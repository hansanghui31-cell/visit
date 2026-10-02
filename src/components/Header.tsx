import React from 'react';
import { BookOpen, Settings, Sparkles, Database, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  totalCount: number;
  isCustomGasConnected: boolean;
  onOpenGuide: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalCount,
  isCustomGasConnected,
  onOpenGuide,
  onOpenSettings,
}) => {
  return (
    <header className="relative w-full max-w-5xl mx-auto pt-8 pb-6 px-4">
      {/* Decorative Warm Glows in Background */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-amber-300/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-4 right-1/4 w-80 h-80 bg-rose-300/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Title and Tagline */}
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/90 border border-amber-200/80 text-amber-800 text-xs font-semibold tracking-wide mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>Google Sheets × Apps Script 실시간 방명록</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-800 flex items-center justify-center md:justify-start gap-2.5">
            <span>따뜻한 응원 방명록</span>
            <span className="text-2xl md:text-3xl animate-bounce">💌</span>
          </h1>

          <p className="text-slate-600 text-sm md:text-base mt-1.5 font-normal">
            구글 스프레드시트를 실시간 DB로 사용하는 화사하고 가벼운 게시판입니다.
          </p>
        </div>

        {/* Action Buttons & Status */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-2.5">
          {/* Status Badge */}
          <div
            onClick={onOpenSettings}
            className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition shadow-xs hover:opacity-90 ${
              isCustomGasConnected
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
            title="클릭하여 시트 연동 설정 변경"
          >
            {isCustomGasConnected ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>구글 시트 연동 완료</span>
              </>
            ) : (
              <>
                <Database className="w-3.5 h-3.5 text-amber-600" />
                <span>데모 체험 모드</span>
              </>
            )}
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 ml-0.5" />
            <span>총 {totalCount}개</span>
          </div>

          {/* Guide Button */}
          <button
            onClick={onOpenGuide}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold bg-white/90 hover:bg-white text-slate-700 border border-slate-200/90 shadow-xs hover:shadow-sm transition active:scale-95"
          >
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span>초보자 가이드 & 코드</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-xs hover:shadow-md transition active:scale-95"
          >
            <Settings className="w-4 h-4" />
            <span>시트 연동 설정</span>
          </button>
        </div>
      </div>
    </header>
  );
};
