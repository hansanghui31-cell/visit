import React, { useState, useEffect } from 'react';
import { testGasConnection } from '../services/gasService';
import { X, Check, Globe, RefreshCw, AlertCircle, Sparkles, HelpCircle } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGasUrl: string;
  onSaveUrl: (url: string) => void;
  onResetToDemo: () => void;
  onOpenGuide: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentGasUrl,
  onSaveUrl,
  onResetToDemo,
  onOpenGuide,
}) => {
  const [inputUrl, setInputUrl] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    ok: boolean;
    message: string;
    count?: number;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setInputUrl(currentGasUrl || '');
      setTestResult(null);
      setTesting(false);
    }
  }, [isOpen, currentGasUrl]);

  if (!isOpen) return null;

  const handleTest = async () => {
    if (!inputUrl.trim()) {
      setTestResult({
        ok: false,
        message: 'Google Apps Script 웹 앱 URL을 입력해주세요.',
      });
      return;
    }

    setTesting(true);
    setTestResult(null);

    const res = await testGasConnection(inputUrl.trim());
    setTesting(false);
    setTestResult(res);
  };

  const handleSave = () => {
    const trimmed = inputUrl.trim();
    onSaveUrl(trimmed);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-xl shadow-xs">
              ⚙️
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                구글 스프레드시트 연동 설정
              </h3>
              <p className="text-xs text-slate-500">
                배포한 Apps Script 웹 앱 URL을 연결하여 실시간 DB로 사용하세요
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-white/80 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Guide Helper Notice */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/70 flex items-center justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>아직 웹 앱 배포 URL이 없으신가요?</span>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenGuide();
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-200 hover:bg-amber-300 font-bold text-amber-900 transition shrink-0"
            >
              연동 가이드 보기 &rarr;
            </button>
          </div>

          {/* URL Input Form */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Google Apps Script 웹 앱 URL</span>
              <span className="text-[11px] text-slate-400 font-normal">
                (끝자리가 /exec 인 URL)
              </span>
            </label>

            <div className="relative">
              <input
                type="url"
                value={inputUrl}
                onChange={(e) => {
                  setInputUrl(e.target.value);
                  setTestResult(null);
                }}
                placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 font-mono text-slate-800 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Test Connection Button & Result */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTest}
                disabled={testing || !inputUrl.trim()}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition disabled:opacity-50 inline-flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                <span>{testing ? '연결 확인 중...' : '연결 테스트'}</span>
              </button>

              {currentGasUrl && (
                <button
                  type="button"
                  onClick={() => {
                    onResetToDemo();
                    setInputUrl('');
                    onClose();
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                >
                  기본 데모 모드로 전환
                </button>
              )}
            </div>

            {testResult && (
              <div
                className={`p-3 rounded-xl text-xs leading-relaxed flex items-start gap-2 animate-in fade-in duration-200 ${
                  testResult.ok
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {testResult.ok ? (
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition active:scale-95"
          >
            설정 저장하기
          </button>
        </div>
      </div>
    </div>
  );
};
