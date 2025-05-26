
import React from 'react';
import { SocialPlatform } from './types';
import { FacebookIcon, TwitterIcon, InstagramIcon, YoutubeIcon, TiktokIcon, LinkedinIcon, PinterestIcon } from './components/common/Icons';

export const DEFAULT_PLATFORMS: SocialPlatform[] = [
  { id: 'facebook', name: 'Facebook', icon: <FacebookIcon className="w-5 h-5" />, color: 'bg-blue-600' },
  { id: 'twitter', name: 'X (Twitter)', icon: <TwitterIcon className="w-5 h-5" />, color: 'bg-black' },
  { id: 'instagram', name: 'Instagram', icon: <InstagramIcon className="w-5 h-5" />, color: 'bg-pink-500' },
  { id: 'youtube', name: 'YouTube', icon: <YoutubeIcon className="w-5 h-5" />, color: 'bg-red-600' },
  { id: 'tiktok', name: 'TikTok', icon: <TiktokIcon className="w-5 h-5" />, color: 'bg-black' },
  { id: 'linkedin', name: 'LinkedIn', icon: <LinkedinIcon className="w-5 h-5" />, color: 'bg-blue-700' },
  { id: 'pinterest', name: 'Pinterest', icon: <PinterestIcon className="w-5 h-5" />, color: 'bg-red-700' },
];

export const GEMINI_TEXT_MODEL = 'gemini-2.5-flash-preview-04-17';
export const GEMINI_IMAGE_MODEL = 'imagen-3.0-generate-002';

export const GENERIC_AVATAR_URL = 'https://picsum.photos/seed/profile/100/100';
export const GENERIC_POST_IMAGE_URL = 'https://picsum.photos/seed/post/400/300';