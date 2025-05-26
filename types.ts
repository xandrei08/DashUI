export interface SocialPlatform {
  id: string;
  name: string;
  icon?: React.ReactElement<IconProps>; // For displaying platform icons
  color?: string; // For platform-specific theming
}

export interface ScheduledPost {
  id: string;
  platformId: string;
  usernameOrLink: string;
  content: string;
  scheduledTime: string; // ISO string for date-time
  status: "scheduled" | "posted" | "failed" | "draft" | "pending_review"; // Added new statuses
  mediaUrl?: string; // Optional: URL for image/video
  geminiGenerated?: boolean; // Flag if content was AI-assisted
  notes?: string; // Optional internal notes for the post
}

export interface TrackedPostMetrics {
  likes: number;
  views: number;
  shares: number;
  comments: number;
  lastUpdated: string; // ISO string
}

export interface TrackedPostItem {
  id: string;
  postLinkOrIdentifier: string; // e.g., URL to post or unique ID
  platformId: string;
  captionSummary?: string; // Brief summary of the post
  metrics: TrackedPostMetrics;
  notes?: string;
}

export interface TrackedAccount {
  id: string;
  platformId: string;
  usernameOrProfileLink: string;
  posts: TrackedPostItem[];
  overallMetrics?: {
    // Optional overall profile metrics
    followers?: number;
    engagementRate?: number;
  };
}

export interface MonetizationEntry {
  id: string;
  source: string; // e.g., 'Brand Deal', 'Affiliate Link', 'Ad Revenue'
  postId?: string; // Optional: Link to a specific TrackedPostItem
  platformId?: string; // Optional: Link to a platform
  amount: number;
  date: string; // ISO string
  notes?: string;
}

export interface ExpenseEntry {
  id: string;
  category: string; // e.g., 'Software', 'Advertising', 'Equipment', 'Outsourcing'
  description: string;
  amount: number;
  date: string; // ISO string for date
  platformId?: string; // Optional: Link to a platform
  notes?: string;
}

export interface GeminiContentSuggestion {
  idea: string;
  caption: string;
  hashtags: string[];
}

export interface TrendingTopicSuggestion {
  topic: string;
  reason?: string; // Why it's trending
  contentIdea?: string; // A specific idea related to the trend
}

// Enum for view states in components
export enum ViewState {
  LIST,
  ADD,
  EDIT,
  DETAIL,
}

export interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

// For icon prop typing
export interface IconProps {
  className?: string;
  title?: string;
  strokeWidth?: string | number; // Make strokeWidth optional and accept string or number
}
