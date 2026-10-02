import React, { useState } from 'react';
import { EMOJI_OPTIONS, RANDOM_NICKNAMES, TAG_OPTIONS } from '../constants';
import { TagCategory } from '../types';
import { Send, Shuffle, Sparkles, Loader2, Check } from 'lucide-react';

interface GuestbookFormProps {
  onSubmit: (entry: {
    name: string;
    message: string;
    tag: TagCategory;
    emoji: string;
  }) => Promise<boolean>;
  isSubmitting: boolean;
  isCustomGasConnected: boolean;
  onOpenSettings: () => void;
}

export const GuestbookForm: React.FC<GuestbookFormProps> = ({
  onSubmit,
  isSubmitting,
  isCustomGasConnected,
  onOpenSettings,
}) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedTag, setSelectedTag] = useState<TagCategory>('응원');
  const [selectedEmoji, setSelectedEmoji] = useState('🌸');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleRandomNickname = () => {
    const randomIndex = Math.floor(Math.random() * RANDOM_NICKNAMES.length);
    setName(RANDOM_NICKNAMES[randomIndex]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSubmitting) return;

    const trimmedName = name.trim() || '익명의 천사';
    const trimmedMessage = message.trim();

    const success = await onSubmit({
      name: trimmedName,
      message: trimmedMessage,
      tag: selectedTag,
      emoji: selectedEmoji,
    });

    if (success) {
      setMessage('');
      // Keep name or randomize
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 mb-8">
      <div className="relative bg-white/90 backdrop-blur-md rounded-3xl p-5 md:p-7 shadow-sm hover:shadow-md border border-amber-200/70 transition-all duration-300">
        {/* Subtle Header Tag */}
        <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-amber-100">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-amber-400 animate-ping" />
            <h2 className="text-base md:text-lg font-bold text-slate-800 flex items-center gap-1.5">
              <span>응원의 한마디 남기기</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </h2>
          </div>

          {!isCustomGasConnected && (
            <button
              type="button"
              onClick={onOpenSettings}
              className="text-xs text-amber-700 bg-amber-100/70 hover:bg-amber-100 px-2.5 py-1 rounded-lg transition font-medium"
            >
              💡 내 구글 시트에 저장하려면 연동하기 &rarr;
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row: Nickname & Emoji Avatar Selection */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-start">
            {/* Nickname Input & Randomize */}
            <div className="md:col-span-6 flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>닉네임 / 작성자</span>
                <button
                  type="button"
                  onClick={handleRandomNickname}
                  className="text-xs text-amber-600 hover:text-amber-700 inline-flex items-center gap-1 font-medium transition"
                >
                  <Shuffle className="w-3 h-3" />
                  <span>랜덤 추천</span>
                </button>
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="따스한 닉네임을 적어주세요 (생략 시 '익명의 천사')"
                  maxLength={20}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-amber-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 text-sm text-slate-800 placeholder-slate-400 transition"
                />
              </div>
            </div>

            {/* Emoji Avatar Selector */}
            <div className="md:col-span-6 flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>내 아바타 이모지</span>
                <span className="text-[11px] text-slate-500">마음에 드는 이모지를 골라보세요</span>
              </label>

              <div className="flex items-center gap-2 overflow-x-auto py-1 px-1 no-scrollbar">
                {EMOJI_OPTIONS.slice(0, 10).map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-transform active:scale-95 ${
                      selectedEmoji === emoji
                        ? 'bg-amber-100 ring-2 ring-amber-400 scale-110 shadow-xs'
                        : 'bg-slate-100/70 hover:bg-amber-50 hover:scale-105'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="shrink-0 px-2 py-1 rounded-xl text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                >
                  {showEmojiPicker ? '접기' : '더보기'}
                </button>
              </div>

              {/* Extended Emoji Picker */}
              {showEmojiPicker && (
                <div className="grid grid-cols-9 gap-1.5 p-2 bg-amber-50/60 rounded-xl border border-amber-200/60 animate-in fade-in duration-200">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        setSelectedEmoji(emoji);
                        setShowEmojiPicker(false);
                      }}
                      className={`h-8 rounded-lg flex items-center justify-center text-lg transition ${
                        selectedEmoji === emoji ? 'bg-amber-200 font-bold scale-110' : 'hover:bg-white'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Category Tag Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">메시지 카테고리 태그</label>
            <div className="flex flex-wrap gap-2">
              {TAG_OPTIONS.filter((t) => t.label !== '전체').map((tag) => {
                const isSelected = selectedTag === tag.label;
                return (
                  <button
                    key={tag.label}
                    type="button"
                    onClick={() => setSelectedTag(tag.label)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all active:scale-95 ${
                      isSelected
                        ? `${tag.bg} ${tag.text} ${tag.border} ring-2 ring-amber-400 font-semibold shadow-xs scale-102`
                        : 'bg-white/80 text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>{tag.icon}</span>
                    <span>{tag.label}</span>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cheer Message Textarea */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <label htmlFor="message-box">응원 한마디</label>
              <span className={`text-[11px] font-normal ${message.length > 280 ? 'text-rose-500 font-bold' : 'text-slate-400'}`}>
                {message.length} / 300자
              </span>
            </div>

            <textarea
              id="message-box"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="마음을 따뜻하게 데워줄 응원, 축하, 덕담을 자유롭게 남겨주세요 🌸 (Ctrl+Enter로 등록 가능)"
              maxLength={300}
              required
              className="w-full px-3.5 py-3 rounded-2xl border border-slate-200 bg-amber-50/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 text-sm text-slate-800 placeholder-slate-400 resize-none transition leading-relaxed"
            />
          </div>

          {/* Form Actions: Submit Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <p className="text-[12px] text-slate-500 flex items-center gap-1.5">
              <span>🌱</span>
              {isCustomGasConnected ? (
                <span>구글 스프레드시트에 즉시 기록되어 영구 보관됩니다.</span>
              ) : (
                <span>현재 데모 모드입니다. 연동 설정 시 내 구글 시트에 바로 기록됩니다.</span>
              )}
            </p>

            <button
              type="submit"
              disabled={!message.trim() || isSubmitting}
              className={`w-full sm:w-auto min-w-[140px] px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm inline-flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 ${
                !message.trim() || isSubmitting
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 text-white shadow-amber-200/50 hover:shadow-md'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>시트에 저장 중...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>등록하기</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
