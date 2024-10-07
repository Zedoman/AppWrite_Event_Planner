export type IconName =
  | 'arrow-up'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'cross'
  | 'filters-2'
  | 'filters-3'
  | 'plus'
  | 'search';

export interface Event {
  _id: string;
  id: string; // Unique identifier for the event
  title: string;
  description?: string;
  // datetime: string; // ISO 8601 datetime string (recommended)
  date: string; // Separate date string (YYYY-MM-DD)
  time: string; // Separate time string (HH:mm)
  location: string;
  category: string;
  picture?: string;
  priority: string;
}
