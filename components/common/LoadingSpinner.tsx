
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  darkMode?: boolean; // darkMode prop is less critical if using semantic classes
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', message }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  // Semantic classes will handle dark/light mode automatically
  const spinnerColor = 'border-button-accent-default dark:border-button-accent-dark';
  const textColor = 'text-muted-default dark:text-muted-dark';

  return (
    <div className="flex flex-col items-center justify-center my-4">
      <div
        className={`animate-spin rounded-full ${sizeClasses[size]} border-t-2 border-b-2 ${spinnerColor}`}
      ></div>
      {message && <p className={`mt-2 text-sm ${textColor}`}>{message}</p>}
    </div>
  );
};

export default LoadingSpinner;