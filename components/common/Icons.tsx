import React from "react";
import { IconProps } from "../../types"; // Import IconProps from types.ts

export type { IconProps }; // Re-export for convenience if other components import it from here

export const HomeIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={rest.strokeWidth || 1.5}
    stroke="currentColor"
    className={className}
    {...rest}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5"
    />
  </svg>
);

export const Squares2X2Icon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={rest.strokeWidth || 1.5}
    stroke="currentColor"
    className={className}
    {...rest}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
    />
  </svg>
);

export const CalendarIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={rest.strokeWidth || 1.5}
    stroke="currentColor"
    className={className}
    {...rest}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-3.75h.008v.008H12v-.008z"
    />
  </svg>
);

export const ChartBarIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={rest.strokeWidth || 1.5}
    stroke="currentColor"
    className={className}
    {...rest}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
    />
  </svg>
);

export const CurrencyDollarIcon: React.FC<IconProps> = ({
  className,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={rest.strokeWidth || 1.5}
    stroke="currentColor"
    className={className}
    {...rest}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export const PlusCircleIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={rest.strokeWidth || 1.5}
    stroke="currentColor"
    className={className}
    {...rest}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export const PencilIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={rest.strokeWidth || 1.5}
    stroke="currentColor"
    className={className}
    {...rest}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
    />
  </svg>
);

export const TrashIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={rest.strokeWidth || 1.5}
    stroke="currentColor"
    className={className}
    {...rest}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c1.153 0 2.243.096 3.242.26m-2.193.424l2.484.461M15.095 5.79l2.484.461m0 0L19.5 21M5.625 5.79L3.5 21"
    />
  </svg>
);

export const SparklesIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={rest.strokeWidth || 1.5}
    stroke="currentColor"
    className={className}
    {...rest}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L21 5.25l-.813 2.846a4.5 4.5 0 00-3.09 3.09L12.25 12l2.846.813a4.5 4.5 0 003.09 3.09L21 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09zM9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
    />
  </svg>
);

export const XMarkIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={rest.strokeWidth || 1.5}
    stroke="currentColor"
    className={className}
    {...rest}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

export const SunIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={rest.strokeWidth || 1.5}
    stroke="currentColor"
    className={className}
    {...rest}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-6.364-.386l1.591-1.591M3 12h2.25m.386-6.364l1.591 1.591M12 12a2.25 2.25 0 00-2.25 2.25c0 1.242.934 2.393 2.25 2.393s2.25-1.151 2.25-2.393A2.25 2.25 0 0012 12z"
    />
  </svg>
);

export const MoonIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={rest.strokeWidth || 1.5}
    stroke="currentColor"
    className={className}
    {...rest}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
    />
  </svg>
);

// Social Media Icons
export const FacebookIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" {...rest}>
    <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06c0 5.52 4.5 10.02 10 10.02s10-4.5 10-10.02C22 6.53 17.5 2.04 12 2.04zm.82 15.42v-6.23h2.11l.31-2.4h-2.42v-1.53c0-.7.19-1.18 1.2-1.18h1.28V3.6c-.22-.03-.98-.09-1.87-.09c-1.85 0-3.12 1.11-3.12 3.21v1.79H8.37v2.4h2.05v6.23h2.4z" />
  </svg>
);
export const TwitterIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" {...rest}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
export const InstagramIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" {...rest}>
    <path d="M12 2c2.72 0 3.05.01 4.12.06c1.06.05 1.79.24 2.42.51c.64.27 1.09.58 1.61 1.11c.52.52.84 1 1.11 1.61c.27.63.46 1.36.51 2.42c.05 1.07.06 1.4.06 4.12s-.01 3.05-.06 4.12c-.05 1.06-.24 1.79-.51 2.42c-.27.64-.58 1.09-1.11 1.61c-.52-.52-1 .84-1.61 1.11c-.63.27-1.36.46-2.42.51c-1.07.05-1.4.06-4.12.06s-3.05-.01-4.12-.06c-1.06-.05-1.79-.24-2.42-.51c-.64-.27-1.09-.58-1.61-1.11c-.52-.52-.84-1-1.11-1.61c-.27-.63-.46-1.36-.51-2.42C2.01 15.05 2 14.72 2 12s.01-3.05.06-4.12c.05-1.06.24-1.79.51-2.42c.27-.64.58-1.09 1.11-1.61c.52-.52 1-.84 1.61-1.11c.63-.27 1.36.46 2.42-.51C8.95 2.01 9.28 2 12 2zm0 1.8c-2.67 0-3 .01-4.05.06c-.99.04-1.5.23-1.86.37c-.42.16-.72.35-.99.62c-.27.27-.46.57-.62.99c-.14.36-.33.87-.37 1.86C4.01 9 4 9.33 4 12s.01 3 .06 4.05c.04.99.23 1.5.37 1.86c.16.42.35.72.62.99c.27.27.57.46.99.62c.36.14.87.33 1.86.37C9 19.99 9.33 20 12 20s3-.01 4.05-.06c.99-.04 1.5-.23 1.86-.37c.42-.16.72.35-.99-.62c.27-.27.46-.57-.62.99c.14-.36.33-.87.37-1.86c.05-1.05.06-1.38.06-4.05s-.01-3-.06-4.05c-.04-.99-.23-1.5-.37-1.86c-.16-.42-.35-.72-.62-.99c-.27-.27-.57-.46-.99-.62c-.36-.14-.87-.33-1.86-.37C15 4.01 14.67 4 12 4zm0 2.88c-2.83 0-5.12 2.29-5.12 5.12s2.29 5.12 5.12 5.12s5.12-2.29 5.12-5.12s-2.29-5.12-5.12-5.12zm0 8.44c-1.82 0-3.32-1.5-3.32-3.32s1.5-3.32 3.32-3.32s3.32 1.5 3.32 3.32s-1.5 3.32-3.32-3.32zm6.28-8.98c-.71 0-1.29.58-1.29 1.29s.58 1.29 1.29 1.29s1.29-.58 1.29-1.29s-.58-1.29-1.29-1.29z" />
  </svg>
);
export const YoutubeIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" {...rest}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm5.78 11.39l-4.5 2.25c-.14.07-.29.07-.44 0c-.15-.07-.24-.21-.24-.39V8.75c0-.18.09-.32.24-.39c.15-.07.3-.07.44 0l4.5 2.25c.15.08.22.22.22.39s-.07.31-.22.39z" />
  </svg>
);
export const TiktokIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" {...rest}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02c.08 0 .17.02.25.04c.54.12.98.49 1.27.97c.49.81.51 1.79.22 2.68c-.28.88-.89 1.53-1.69 1.91c-.51.23-1.07.31-1.64.3c-1.31-.03-2.62-.02-3.93-.02c-.19 0-.38.01-.56.04c-.97.15-1.89.6-2.59 1.28c-.96.93-1.48 2.21-1.46 3.56c.01 1.02.32 2.01.88 2.84c.67.99 1.64 1.68 2.79 1.95C9.74 15.58 11.3 16 12.94 16c.02 1.31.02 2.62.01 3.93c0 .13-.01.26-.02.39c-.03.8-.36 1.56-.94 2.12c-.73.71-1.7 1.04-2.74 1.01c-1.06-.03-2.04-.48-2.74-1.2c-.52-.54-.83-1.24-.94-1.97c-.08-.52-.07-1.04-.07-1.57c0-3.45.01-6.9-.01-10.35c-.01-.96-.28-1.88-.79-2.68c-.7-.98-1.74-1.58-2.87-1.77C1.24 4.09.65 3.3.62 2.41c-.03-.9.44-1.74 1.25-2.07C2.84.03 3.83-.01 4.85-.02c1.31.01 2.62.01 3.93.01c.12 0 .23 0 .35.01c.36.03.7.13 1.01.28c.58.28 1.04.72 1.32 1.25c.1.19.18.39.24.6c.03.11.05.22.07.33C12.06.82 12.29.42 12.525.02z" />
  </svg>
);

export const LinkedinIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" {...rest}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

export const PinterestIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" {...rest}>
    <path d="M12.017 0C5.383 0 0 5.383 0 12.017c0 7.025 6.027 11.983 10.443 11.983 1.284 0 2.31-.406 2.31-1.183 0-.538-.203-1.144-.305-1.503-.305-1.042.914-2.432 2.433-2.432 3.256 0 5.207-2.398 5.207-6.218 0-3.917-2.957-7.632-7.868-7.632-5.338 0-8.341 4.012-8.341 7.983 0 1.52.508 3.205 1.425 3.71.101.102.203.000.203-.102 0-.203-.004-1.042-.102-1.32-.203-.608.305-1.215.914-1.215.812 0 1.32.813 1.32 1.927 0 1.32-.712 3.348-1.727 3.348-.608 0-1.116-.712-1.116-1.523 0-1.216.812-2.332 1.22-3.145.508-1.017.102-2.132-.712-2.132-1.016 0-1.727.914-1.727 2.233 0 .812-.305 1.424-.305 1.424s-1.117 4.667-1.32 5.478c-.305 1.215-.102 2.637-.102 2.637.101.406.508.508.712.203.305-.305 1.117-1.116 1.523-2.132.203-.508.712-1.523.712-1.523.406.71.812 1.32 2.032 1.32 2.332 0 4.158-2.74 4.158-5.382 0-2.33-1.317-4.057-3.855-4.057-.914 0-1.828.508-1.828 1.317 0 .712.406 1.215.406 1.215s-1.22 4.97-1.424 5.783c-.101.304-.101.71-.101.71s.101.102.203.102c.203 0 .812-.608.914-.812.203-.305.712-1.523.712-1.523.000 0 .608 1.117.914 1.424.508.608 1.216.812 1.828.812 2.842 0 4.768-2.948 4.768-6.092C21.983 5.917 17.97 2.433 13.63.203 13.02.000 12.408 0 12.017 0z" />
  </svg>
);

// Utility Icons
export const ImagePlaceholderIcon: React.FC<IconProps> = ({
  className,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={rest.strokeWidth || 1.5}
    stroke="currentColor"
    className={className}
    {...rest}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
    />
  </svg>
);

export const CheckCircleIcon: React.FC<IconProps> = ({
  className,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={rest.strokeWidth || 1.5}
    stroke="currentColor"
    className={className}
    {...rest}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export const XCircleIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={rest.strokeWidth || 1.5}
    stroke="currentColor"
    className={className}
    {...rest}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export const ArrowUpIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={rest.strokeWidth || 1.5}
    stroke="currentColor"
    className={className}
    {...rest}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
    />
  </svg>
);

export const ArrowDownIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={rest.strokeWidth || 1.5}
    stroke="currentColor"
    className={className}
    {...rest}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
    />
  </svg>
);

export const BriefcaseIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={rest.strokeWidth || 1.5}
    stroke="currentColor"
    className={className}
    {...rest}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.25 14.15v4.075c0 1.313-.976 2.475-2.25 2.475H6c-1.274 0-2.25-.99-2.25-2.306V14.15M15.75 7.5V4.125A2.25 2.25 0 0013.5 1.875h-3A2.25 2.25 0 008.25 4.125V7.5m6 4.125V10.875A1.125 1.125 0 0013.125 9.75H10.875A1.125 1.125 0 009.75 10.875v.375m6 0H9.75m0 0H6.75m0 0H3.375M20.25 7.5H3.75"
    />
  </svg>
);

export const ReceiptPercentIcon: React.FC<IconProps> = ({
  className,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={rest.strokeWidth || 1.5}
    stroke="currentColor"
    className={className}
    {...rest}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-1.5h5.25m-5.25 0h3m-3 0h-1.5m0 0H3m9 0H9m12-3.75H3C2.172 11.25 1.5 10.578 1.5 9.75V4.875C1.5 3.504 2.936 2.25 4.875 2.25H19.125C21.064 2.25 22.5 3.504 22.5 4.875v4.875c0 .828-.672 1.5-1.5 1.5M16.5 18.75h.008v.008h-.008v-.008zm0 0H12m0 0H9.75M12 21H7.5m2.25-2.25H12m0 0H9.75M12 15.75H9.75m2.25 0h3.75M15.75 15.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m0 0h-1.5m9-1.5a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 0h-1.5m3 0a1.5 1.5 0 000-3m0 0V9.75"
    />
  </svg>
);

export const LightBulbIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={rest.strokeWidth || 1.5}
    stroke="currentColor"
    className={className}
    {...rest}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.25c.398-.06.716-.23.992-.47M12 21c-.398.06-.716.23-.992.47M12 6.75A2.25 2.25 0 0114.25 9v1.083c0 .803.402 1.537 1.07 1.992A5.25 5.25 0 0112 15.75a5.25 5.25 0 01-3.32-1.675c.668-.455 1.07-1.19 1.07-1.992V9a2.25 2.25 0 012.25-2.25z"
    />
  </svg>
);

export const FireIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={rest.strokeWidth || 1.5}
    stroke="currentColor"
    className={className}
    {...rest}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.62a8.983 8.983 0 013.362-3.797A8.223 8.223 0 0112 2.25c1.131 0 2.203.304 3.132.835.228.263.362.521.362.79V17.25a.75.75 0 01-1.5 0V8.25a.75.75 0 00-.75-.75H5.25a.75.75 0 000 1.5h8.25a.75.75 0 00.75-.75V5.25a.75.75 0 00-.75-.75h-.514z"
    />
  </svg>
);

export const HashtagIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={rest.strokeWidth || 1.5}
    stroke="currentColor"
    className={className}
    {...rest}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5.25 8.25h13.5m-13.5 7.5h13.5m-1.5-15l-3.75 15m-7.5-15l3.75 15"
    />
  </svg>
);

export const ClockIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={rest.strokeWidth || 1.5}
    stroke="currentColor"
    className={className}
    {...rest}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({
  className,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={rest.strokeWidth || 1.5}
    stroke="currentColor"
    className={className}
    {...rest}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
    />
  </svg>
);

export const ChevronUpIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={rest.strokeWidth || 1.5}
    stroke="currentColor"
    className={className}
    {...rest}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 15.75l7.5-7.5 7.5 7.5"
    />
  </svg>
);

export const ClipboardDocumentListIcon: React.FC<IconProps> = ({
  className,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={rest.strokeWidth || 1.5}
    stroke="currentColor"
    className={className}
    {...rest}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0cA3.375 3.375 0 015.625 4.5c0 1.095.386 2.089.991 2.832M12 21H3.375A2.25 2.25 0 011.125 18.75V6.108c0-1.135.845-2.098 1.976-2.192a48.424 48.424 0 001.123-.08"
    />
  </svg>
);

export const UsersIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={rest.strokeWidth || 1.5}
    stroke="currentColor"
    className={className}
    {...rest}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
    />
  </svg>
);

export const CalendarDaysIcon: React.FC<IconProps> = ({
  className,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={rest.strokeWidth || 1.5}
    stroke="currentColor"
    className={className}
    {...rest}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-7.5-3.75h.008v.008H14.25v-.008zm-2.25 0h.008v.008H12v-.008zM9.75 15h.008v.008H9.75v-.008z"
    />
  </svg>
);

export const ChartPieIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={rest.strokeWidth || 1.5}
    stroke="currentColor"
    className={className}
    {...rest}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z"
    />
  </svg>
);

export const BanknotesIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={rest.strokeWidth || 1.5}
    stroke="currentColor"
    className={className}
    {...rest}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
    />
  </svg>
);

export const InformationCircleIcon: React.FC<IconProps> = ({
  className,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={rest.strokeWidth || 1.5}
    stroke="currentColor"
    className={className}
    {...rest}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
    />
  </svg>
);

export const ArrowDownTrayIcon: React.FC<IconProps> = ({
  className,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={rest.strokeWidth || 1.5}
    stroke="currentColor"
    className={className}
    {...rest}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
    />
  </svg>
);

export const PrinterIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={rest.strokeWidth || 1.5}
    stroke="currentColor"
    className={className}
    {...rest}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0A42.253 42.253 0 0112 18.75c-2.178 0-4.207-.5-5.923-1.404M12 18.75c3.866 0 7-1.679 7-3.75V8.25A3.75 3.75 0 0015.25 4.5H8.75A3.75 3.75 0 005 8.25v6.75c0 2.071 3.134 3.75 7 3.75z"
    />
  </svg>
);
