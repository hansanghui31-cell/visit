export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  tag: string;
  emoji: string;
  createdAt: string;
  likes?: number;
}

export interface GasApiResponse {
  status: 'success' | 'error';
  message?: string;
  count?: number;
  data?: GuestbookEntry[];
  entry?: GuestbookEntry;
}

export type TagCategory = '전체' | '응원' | '축하' | '힘내요' | '감사' | '소원' | '일상';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}
