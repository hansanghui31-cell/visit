import { GuestbookEntry, TagCategory } from './types';

export const STORAGE_KEYS = {
  GAS_URL: 'gsheet_guestbook_url',
  LOCAL_ENTRIES: 'gsheet_guestbook_local_entries',
  LIKES: 'gsheet_guestbook_likes',
};

export const DEFAULT_GAS_URL = 'https://script.google.com/macros/s/AKfycbw04DFZZfp3g330Bvu2FhHNvp1_vmntzfxxRoLH7KjaiaArzjM-QxHO7ox5JOAenBSA/exec';

export const TAG_OPTIONS: { label: TagCategory; icon: string; bg: string; text: string; border: string }[] = [
  { label: '전체', icon: '✨', bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' },
  { label: '응원', icon: '🎉', bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
  { label: '축하', icon: '🎂', bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-200' },
  { label: '힘내요', icon: '💪', bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200' },
  { label: '감사', icon: '💌', bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-200' },
  { label: '소원', icon: '🌟', bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
  { label: '일상', icon: '☕', bg: 'bg-sky-100', text: 'text-sky-800', border: 'border-sky-200' },
];

export const EMOJI_OPTIONS = [
  '🌸', '🌻', '🌷', '🍀', '✨', '🌈', 
  '🐶', '🐱', '🐰', '🐻', '🐥', '🦄',
  '☕', '🧁', '🍰', '🥞', '🎉', '💖'
];

export const RANDOM_NICKNAMES = [
  '행복한 다람쥐', '햇살가득 데이지', '꿈꾸는 고양이', '용기있는 판다',
  '달콤한 딸기', '미소짓는 구름', '달리는 토끼', '행운의 네잎클로버',
  '빛나는 별똥별', '포근한 라떼', '희망찬 새싹', '마음 따뜻한 곰'
];

export const INITIAL_DEMO_ENTRIES: GuestbookEntry[] = [
  {
    id: 'demo-1',
    name: '햇살가득 데이지',
    message: '오늘 하루도 정말 고생 많으셨어요! 작은 순간들 속에 큰 행복이 깃들길 언제나 응원할게요 🌼✨',
    tag: '응원',
    emoji: '🌻',
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    likes: 12
  },
  {
    id: 'demo-2',
    name: '행운의 네잎클로버',
    message: '구글 스프레드시트와 앱스 스크립트로 이렇게 예쁜 방명록이 완성되다니 정말 신기해요! 배포 축하드립니다 🎂🥳',
    tag: '축하',
    emoji: '🍀',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    likes: 8
  },
  {
    id: 'demo-3',
    name: '포근한 라떼',
    message: '지치고 힘들 땐 따뜻한 차 한 잔 마시며 쉬어가세요. 당신의 모든 발걸음을 응원합니다 💪☕',
    tag: '힘내요',
    emoji: '☕',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    likes: 15
  },
  {
    id: 'demo-4',
    name: '마음 따뜻한 곰',
    message: '항상 곁에서 든든하게 힘이 되어주셔서 진심으로 감사합니다. 늘 건강하고 행복하세요 💌',
    tag: '감사',
    emoji: '🐻',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    likes: 6
  },
  {
    id: 'demo-5',
    name: '빛나는 별똥별',
    message: '올해 준비하고 있는 모든 프로젝트와 소원들이 눈부시게 이뤄지길 진심으로 바라요! 🌟🙏',
    tag: '소원',
    emoji: '✨',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    likes: 19
  }
];

export const APPS_SCRIPT_CODE = `/**
 * ====================================================================
 * 💌 구글 스프레드시트 방명록 API (Google Apps Script)
 * ====================================================================
 * 초보자도 그대로 복사해서 붙여넣기만 하면 바로 작동하는 코드입니다!
 * 
 * [시트 헤더 구조 자동 생성]
 * A열: id | B열: name | C열: message | D열: tag | E열: emoji | F열: createdAt
 */

// 시트가 없거나 헤더가 비어있을 때 자동으로 초기화하는 헬퍼 함수
function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('방명록') || ss.getActiveSheet();
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['id', 'name', 'message', 'tag', 'emoji', 'createdAt']);
    
    // 첫 행 예쁘게 스타일링 (노란 파스텔 배경, 굵은 글씨)
    var headerRange = sheet.getRange(1, 1, 1, 6);
    headerRange.setBackground('#FFF4D6');
    headerRange.setFontWeight('bold');
    headerRange.setHorizontalAlignment('center');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * 1. 방명록 목록 불러오기 (GET)
 * 웹앱 URL로 GET 요청이 오면 시트의 모든 글을 JSON으로 반환합니다.
 */
function doGet(e) {
  try {
    var sheet = getOrCreateSheet();
    var data = sheet.getDataRange().getValues();
    
    // 만약 데이터가 헤더만 있거나 완전히 빈 경우
    if (data.length <= 1) {
      return jsonResponse({
        status: 'success',
        count: 0,
        data: []
      });
    }

    var headers = data[0];
    var rows = data.slice(1);
    
    var result = rows.map(function(row) {
      var item = {};
      headers.forEach(function(header, idx) {
        var val = row[idx];
        // 날짜 객체인 경우 ISO 포맷으로 변환
        if (val instanceof Date) {
          val = val.toISOString();
        }
        item[header] = val !== undefined && val !== null ? String(val) : '';
      });
      return item;
    });

    // 최신 글이 위로 오도록 역순 정렬
    result.reverse();

    return jsonResponse({
      status: 'success',
      count: result.length,
      data: result
    });
  } catch (err) {
    return jsonResponse({
      status: 'error',
      message: err.toString()
    });
  }
}

/**
 * 2. 방명록 새 글 등록하기 (POST)
 * 웹앱 URL로 POST 요청이 오면 시트의 마지막 행에 데이터를 추가합니다.
 */
function doPost(e) {
  try {
    var sheet = getOrCreateSheet();
    var body = {};

    if (e && e.postData && e.postData.contents) {
      try {
        body = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        body = e.parameter || {};
      }
    } else if (e && e.parameter) {
      body = e.parameter;
    }

    var id = body.id || 'entry_' + new Date().getTime();
    var name = String(body.name || '익명').trim();
    var message = String(body.message || '').trim();
    var tag = String(body.tag || '응원').trim();
    var emoji = String(body.emoji || '🌸').trim();
    var createdAt = body.createdAt || new Date().toISOString();

    if (!message) {
      return jsonResponse({
        status: 'error',
        message: '응원 한마디 메시지를 입력해주세요.'
      });
    }

    // 시트에 새 행 추가
    sheet.appendRow([id, name, message, tag, emoji, createdAt]);

    return jsonResponse({
      status: 'success',
      message: '방명록이 구글 시트에 성공적으로 저장되었습니다!',
      entry: {
        id: id,
        name: name,
        message: message,
        tag: tag,
        emoji: emoji,
        createdAt: createdAt
      }
    });
  } catch (err) {
    return jsonResponse({
      status: 'error',
      message: err.toString()
    });
  }
}

/**
 * JSON 응답 생성 헬퍼 함수
 */
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
