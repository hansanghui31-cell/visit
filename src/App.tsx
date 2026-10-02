/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { GuestbookEntry, TagCategory, ToastMessage } from './types';
import {
  STORAGE_KEYS,
  INITIAL_DEMO_ENTRIES,
  DEFAULT_GAS_URL,
} from './constants';
import {
  fetchEntriesFromGas,
  submitEntryToGas,
  isValidGasUrl,
} from './services/gasService';
import { Header } from './components/Header';
import { GuestbookForm } from './components/GuestbookForm';
import { GuestbookList } from './components/GuestbookList';
import { GuideModal } from './components/GuideModal';
import { SettingsModal } from './components/SettingsModal';
import { ToastContainer } from './components/Toast';

export default function App() {
  const [gasUrl, setGasUrl] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GAS_URL);
    if (saved !== null) {
      return saved;
    }
    return DEFAULT_GAS_URL;
  });

  const [entries, setEntries] = useState<GuestbookEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOCAL_ENTRIES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [likedEntryIds, setLikedEntryIds] = useState<Set<string>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LIKES);
    if (saved) {
      try {
        return new Set(JSON.parse(saved));
      } catch {
        return new Set();
      }
    }
    return new Set();
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Toast Helper
  const addToast = useCallback((type: 'success' | 'error' | 'info', title: string, description?: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, type, title, description }]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch entries from Google Sheet or Local
  const loadEntries = useCallback(async (targetUrl?: string) => {
    const url = targetUrl !== undefined ? targetUrl : gasUrl;

    if (url && isValidGasUrl(url)) {
      setIsLoading(true);
      try {
        const liveEntries = await fetchEntriesFromGas(url);
        setEntries(liveEntries);
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error('Failed to fetch from Google Sheet:', errorMsg);
        addToast(
          'error',
          '구글 시트 데이터 로딩 실패',
          '시트 접근 권한(모든 사용자 허용) 또는 웹앱 URL을 확인해주세요.'
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      // In demo mode, load local entries
      const saved = localStorage.getItem(STORAGE_KEYS.LOCAL_ENTRIES);
      if (saved) {
        try {
          setEntries(JSON.parse(saved));
        } catch {
          setEntries(INITIAL_DEMO_ENTRIES);
        }
      } else {
        setEntries(INITIAL_DEMO_ENTRIES);
      }
    }
  }, [gasUrl, addToast]);

  // Initial load
  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  // Save liked IDs in localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LIKES, JSON.stringify(Array.from(likedEntryIds)));
  }, [likedEntryIds]);

  // Handle Form Submit
  const handleSubmitEntry = async (formData: {
    name: string;
    message: string;
    tag: TagCategory;
    emoji: string;
  }): Promise<boolean> => {
    setIsSubmitting(true);

    const newEntry: GuestbookEntry = {
      id: `entry_${Date.now()}`,
      name: formData.name,
      message: formData.message,
      tag: formData.tag,
      emoji: formData.emoji,
      createdAt: new Date().toISOString(),
      likes: 0,
    };

    if (gasUrl && isValidGasUrl(gasUrl)) {
      try {
        const result = await submitEntryToGas(gasUrl, newEntry);
        
        // Optimistically update list
        setEntries((prev) => [newEntry, ...prev.filter((e) => e.id !== newEntry.id)]);

        addToast(
          'success',
          '구글 시트 저장 완료! 🎉',
          result.message || '응원의 한마디가 구글 시트에 안전하게 등록되었습니다.'
        );

        // Optionally re-fetch after 1.5s to ensure full sync
        setTimeout(() => {
          loadEntries();
        }, 1500);

        setIsSubmitting(false);
        return true;
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        // Even if network fails, add to local view so user doesn't lose entry
        setEntries((prev) => [newEntry, ...prev]);
        addToast(
          'error',
          '구글 시트 저장 오류',
          `${errorMsg} (임시로 화면에만 반영되었습니다)`
        );
        setIsSubmitting(false);
        return false;
      }
    } else {
      // Demo Mode: save locally in localStorage
      const updated = [newEntry, ...entries];
      setEntries(updated);
      localStorage.setItem(STORAGE_KEYS.LOCAL_ENTRIES, JSON.stringify(updated));

      addToast(
        'success',
        '방명록이 등록되었습니다! 🌸',
        '현재 체험(데모) 모드입니다. 상단 [시트 연동 설정]에서 구글 시트를 연결해보세요.'
      );
      setIsSubmitting(false);
      return true;
    }
  };

  // Handle Like
  const handleLike = (id: string) => {
    setLikedEntryIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Copy Message
  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast('info', '메시지가 클립보드에 복사되었습니다! 📋');
  };

  // Save GAS URL
  const handleSaveGasUrl = (url: string) => {
    const trimmed = url.trim();
    localStorage.setItem(STORAGE_KEYS.GAS_URL, trimmed);
    setGasUrl(trimmed);

    if (trimmed) {
      addToast('success', '구글 시트 연동 URL이 저장되었습니다!', '최신 데이터를 불러옵니다.');
      loadEntries(trimmed);
    } else {
      addToast('info', '기본 데모 모드로 변경되었습니다.');
      loadEntries('');
    }
  };

  // Reset to Demo Mode
  const handleResetToDemo = () => {
    localStorage.setItem(STORAGE_KEYS.GAS_URL, '');
    localStorage.removeItem(STORAGE_KEYS.LOCAL_ENTRIES);
    setGasUrl('');
    setEntries(INITIAL_DEMO_ENTRIES);
    addToast('info', '데모 체험 모드로 전환되었습니다.');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        {/* Header */}
        <Header
          totalCount={entries.length}
          isCustomGasConnected={Boolean(gasUrl && isValidGasUrl(gasUrl))}
          onOpenGuide={() => setIsGuideOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Input Form */}
        <GuestbookForm
          onSubmit={handleSubmitEntry}
          isSubmitting={isSubmitting}
          isCustomGasConnected={Boolean(gasUrl && isValidGasUrl(gasUrl))}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Entries List */}
        <GuestbookList
          entries={entries}
          isLoading={isLoading}
          onRefresh={() => {
            loadEntries();
            addToast('info', '목록을 새로고침했습니다 ✨');
          }}
          onLike={handleLike}
          likedEntryIds={likedEntryIds}
          onCopyMessage={handleCopyMessage}
        />
      </div>

      {/* Cheerful Bottom Footer */}
      <footer className="w-full border-t border-amber-200/60 bg-white/60 backdrop-blur-md py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 font-medium">
            <span>💛</span>
            <span>Google Sheets & Apps Script 방명록</span>
            <span className="text-slate-300">•</span>
            <span className="text-amber-700 font-semibold">서버 비용 0원 실시간 DB</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="text-amber-700 hover:text-amber-800 underline underline-offset-2 font-medium"
            >
              연동 가이드 및 코드 보기
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-amber-700 hover:text-amber-800 underline underline-offset-2 font-medium"
            >
              시트 연동 관리
            </button>
          </div>
        </div>
      </footer>

      {/* Guide Modal */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onCopySuccess={() => {
          addToast('success', 'Apps Script 코드가 복사되었습니다! 📋', '구글 시트 Apps Script에 붙여넣으세요.');
        }}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentGasUrl={gasUrl}
        onSaveUrl={handleSaveGasUrl}
        onResetToDemo={handleResetToDemo}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
