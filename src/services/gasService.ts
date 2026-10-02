import { GuestbookEntry, GasApiResponse } from '../types';

/**
 * Validates Google Apps Script Web App URL format
 */
export function isValidGasUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  return (
    trimmed.startsWith('https://script.google.com/macros/s/') &&
    (trimmed.endsWith('/exec') || trimmed.includes('/exec'))
  );
}

/**
 * Fetch guestbook entries from Google Apps Script Web App
 */
export async function fetchEntriesFromGas(url: string): Promise<GuestbookEntry[]> {
  const cleanUrl = url.trim();
  
  // Add a cache-busting timestamp query parameter
  const separator = cleanUrl.includes('?') ? '&' : '?';
  const fetchUrl = `${cleanUrl}${separator}_t=${Date.now()}`;

  const response = await fetch(fetchUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`구글 시트 응답 오류 (상태 코드: ${response.status})`);
  }

  const json: GasApiResponse | GuestbookEntry[] = await response.json();

  let rawList: GuestbookEntry[] = [];
  if (Array.isArray(json)) {
    rawList = json;
  } else if (json && json.data && Array.isArray(json.data)) {
    rawList = json.data;
  } else if (json && json.status === 'error') {
    throw new Error(json.message || '데이터를 불러오는 중 오류가 발생했습니다.');
  }

  // Sanitize and normalize entries
  return rawList
    .filter(item => item && (item.message || item.name))
    .map(item => ({
      id: String(item.id || `entry_${Math.random().toString(36).substring(2, 9)}`),
      name: String(item.name || '익명'),
      message: String(item.message || ''),
      tag: String(item.tag || '응원'),
      emoji: String(item.emoji || '🌸'),
      createdAt: item.createdAt ? String(item.createdAt) : new Date().toISOString(),
      likes: Number(item.likes) || 0,
    }));
}

/**
 * Submit a new guestbook entry to Google Apps Script Web App
 */
export async function submitEntryToGas(
  url: string,
  entry: Omit<GuestbookEntry, 'likes'>
): Promise<{ success: boolean; message: string; entry?: GuestbookEntry }> {
  const cleanUrl = url.trim();

  // Sending with 'text/plain;charset=utf-8' prevents CORS preflight OPTIONS requests
  // which Google Apps Script endpoints do not respond to.
  try {
    const response = await fetch(cleanUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(entry),
    });

    if (response.ok) {
      try {
        const json: GasApiResponse = await response.json();
        if (json.status === 'error') {
          throw new Error(json.message || '시트 저장에 실패했습니다.');
        }
        return {
          success: true,
          message: json.message || '구글 시트에 성공적으로 등록되었습니다!',
          entry: json.entry || { ...entry, likes: 0 },
        };
      } catch {
        // If JSON parsing fails but status was 200, assume success
        return {
          success: true,
          message: '구글 시트에 등록되었습니다!',
          entry: { ...entry, likes: 0 },
        };
      }
    }
    throw new Error(`저장 실패 (HTTP ${response.status})`);
  } catch (err: unknown) {
    // If standard POST hits CORS issue in some browser sandbox, try fallback with no-cors or query
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn('POST failed or blocked by CORS, attempting fallback:', errorMsg);
    
    // In many GAS deployments, no-cors still executes the doPost successfully on Google's servers
    try {
      await fetch(cleanUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(entry),
      });

      return {
        success: true,
        message: '구글 시트로 전송되었습니다! (약 1~2초 후 반영됩니다)',
        entry: { ...entry, likes: 0 },
      };
    } catch (fallbackErr) {
      throw new Error(`구글 시트 저장 실패: ${errorMsg}`);
    }
  }
}

/**
 * Test Google Apps Script Web App connectivity
 */
export async function testGasConnection(url: string): Promise<{
  ok: boolean;
  message: string;
  count?: number;
}> {
  if (!isValidGasUrl(url)) {
    return {
      ok: false,
      message: '올바른 웹앱 URL 형식이 아닙니다. (/exec 로 끝나는 URL을 입력해주세요)',
    };
  }

  try {
    const list = await fetchEntriesFromGas(url);
    return {
      ok: true,
      message: `연결 성공! 현재 시트에 ${list.length}개의 방명록이 있습니다.`,
      count: list.length,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
      return {
        ok: false,
        message: '연결 실패: Apps Script 배포 시 "액세스 권한을 가진 사용자"를 "모든 사용자(Anyone)"로 설정했는지 확인해주세요.',
      };
    }
    return {
      ok: false,
      message: `연결 실패: ${msg}`,
    };
  }
}
