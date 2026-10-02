import React, { useState, useMemo } from 'react';
import { GuestbookEntry, TagCategory } from '../types';
import { TAG_OPTIONS } from '../constants';
import {
  Search,
  RotateCw,
  Heart,
  Copy,
  Clock,
  MessageSquareHeart,
  SmilePlus,
  Share2,
} from 'lucide-react';

interface GuestbookListProps {
  entries: GuestbookEntry[];
  isLoading: boolean;
  onRefresh: () => void;
  onLike: (id: string) => void;
  likedEntryIds: Set<string>;
  onCopyMessage: (text: string) => void;
}

export const GuestbookList: React.FC<GuestbookListProps> = ({
  entries,
  isLoading,
  onRefresh,
  onLike,
  likedEntryIds,
  onCopyMessage,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<TagCategory>('전체');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'likes'>('latest');

  // Format relative time or friendly string
  const formatTime = (isoString?: string) => {
    if (!isoString) return '방금 전';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return '방금 전';
    if (diffMin < 60) return `${diffMin}분 전`;
    if (diffHour < 24) return `${diffHour}시간 전`;
    if (diffDay < 7) return `${diffDay}일 전`;

    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(
      date.getDate()
    ).padStart(2, '0')}`;
  };

  // Find tag styling
  const getTagStyle = (tag: string) => {
    const matched = TAG_OPTIONS.find((t) => t.label === tag);
    if (matched) return matched;
    return {
      label: tag as TagCategory,
      icon: '💬',
      bg: 'bg-amber-100',
      text: 'text-amber-800',
      border: 'border-amber-200',
    };
  };

  // Filter and Sort entries
  const filteredEntries = useMemo(() => {
    let result = [...entries];

    // Filter by tag
    if (activeCategory !== '전체') {
      result = result.filter((entry) => entry.tag === activeCategory);
    }

    // Filter by search
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (entry) =>
          entry.name.toLowerCase().includes(q) ||
          entry.message.toLowerCase().includes(q) ||
          entry.tag.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'latest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === 'likes') {
      result.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    }

    return result;
  }, [entries, activeCategory, searchTerm, sortBy]);

  return (
    <section className="w-full max-w-5xl mx-auto px-4 pb-16">
      {/* Control Bar: Filters, Search, Sort & Refresh */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 mb-6 border border-amber-200/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
          {TAG_OPTIONS.map((tag) => {
            const isSelected = activeCategory === tag.label;
            const count =
              tag.label === '전체'
                ? entries.length
                : entries.filter((e) => e.tag === tag.label).length;

            return (
              <button
                key={tag.label}
                onClick={() => setActiveCategory(tag.label)}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition active:scale-95 ${
                  isSelected
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-amber-50/70 hover:bg-amber-100/70 text-slate-700'
                }`}
              >
                <span>{tag.icon}</span>
                <span>{tag.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-amber-600 text-white' : 'bg-white/70 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Tools: Search, Sort, Refresh */}
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-48 md:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="작성자 또는 내용 검색"
              className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-xl text-xs font-medium border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
          >
            <option value="latest">최신순</option>
            <option value="likes">인기순</option>
            <option value="oldest">오래된순</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition active:scale-95 disabled:opacity-50"
            title="새로고침"
            aria-label="새로고침"
          >
            <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Grid of Guestbook Cards */}
      {isLoading && entries.length === 0 ? (
        // Loading Skeleton
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white/70 rounded-3xl p-5 border border-amber-100 shadow-xs animate-pulse space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-3 bg-slate-100 rounded w-1/4" />
                </div>
              </div>
              <div className="h-14 bg-slate-100 rounded-xl" />
              <div className="h-4 bg-slate-100 rounded w-1/2 pt-2" />
            </div>
          ))}
        </div>
      ) : filteredEntries.length === 0 ? (
        // Empty State
        <div className="text-center py-16 px-4 bg-white/60 backdrop-blur-sm rounded-3xl border border-amber-200/50">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-amber-100 flex items-center justify-center text-3xl">
            {searchTerm ? '🔍' : '💌'}
          </div>
          <h3 className="text-base font-bold text-slate-700">
            {searchTerm ? '검색된 응원이 없습니다' : '아직 등록된 응원이 없습니다'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchTerm
              ? '다른 검색어를 입력하거나 카테고리 필터를 변경해 보세요.'
              : '첫 번째 따뜻한 응원의 한마디를 남겨보세요!'}
          </p>
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveCategory('전체');
              }}
              className="mt-4 px-3 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-semibold hover:bg-amber-600 transition"
            >
              검색 필터 초기화
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEntries.map((item) => {
            const tagStyle = getTagStyle(item.tag);
            const isLiked = likedEntryIds.has(item.id);
            const likesCount = (item.likes || 0) + (isLiked ? 1 : 0);

            return (
              <div
                key={item.id}
                className="group relative bg-white/90 backdrop-blur-md rounded-3xl p-5 border border-amber-100/90 hover:border-amber-300 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between hover:-translate-y-0.5"
              >
                <div>
                  {/* Card Top: Avatar, Name, Tag */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      {/* Avatar Bubble */}
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-100 to-orange-100 border border-amber-200 flex items-center justify-center text-xl shadow-xs group-hover:scale-105 transition-transform">
                        {item.emoji || '🌸'}
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-slate-800 leading-tight">
                          {item.name || '익명'}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(item.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Tag Badge */}
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold border ${tagStyle.bg} ${tagStyle.text} ${tagStyle.border}`}
                    >
                      <span>{tagStyle.icon}</span>
                      <span>{item.tag || '응원'}</span>
                    </span>
                  </div>

                  {/* Message Content */}
                  <p className="text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-wrap break-words bg-amber-50/20 rounded-2xl p-3 border border-amber-100/40">
                    {item.message}
                  </p>
                </div>

                {/* Card Bottom: Likes & Actions */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs">
                  {/* Heart / Cheer Reaction */}
                  <button
                    onClick={() => onLike(item.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium transition active:scale-90 ${
                      isLiked
                        ? 'bg-rose-50 text-rose-600 font-bold'
                        : 'text-slate-500 hover:text-rose-500 hover:bg-rose-50/70'
                    }`}
                    title="응원 하트 보내기"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 transition-transform ${
                        isLiked ? 'fill-rose-500 text-rose-500 scale-110' : ''
                      }`}
                    />
                    <span>{likesCount > 0 ? likesCount : '응원'}</span>
                  </button>

                  {/* Share & Copy Action */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onCopyMessage(item.message)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                      title="메시지 복사"
                      aria-label="메시지 복사"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
