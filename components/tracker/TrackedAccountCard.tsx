import React, { useState, useMemo, useCallback } from "react";
// Fix: Import TrackedPostMetrics type
import {
  TrackedAccount,
  SocialPlatform,
  TrackedPostItem,
  ToastMessage,
  TrackedPostMetrics,
} from "../../types";
import {
  PencilIcon,
  TrashIcon,
  PlusCircleIcon,
  SparklesIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "../common/Icons";
import LoadingSpinner from "../common/LoadingSpinner";
import {
  analyzePostPerformance,
  isGeminiAvailable,
} from "../../services/geminiService";
import { GENERIC_AVATAR_URL } from "../../constants";

interface TrackedPostItemCardProps {
  post: TrackedPostItem;
  platform: SocialPlatform | undefined;
  onEdit: () => void;
  onDelete: () => void;
  darkMode?: boolean;
  addToast: (message: string, type?: ToastMessage["type"]) => void;
}

const TrackedPostItemCard: React.FC<TrackedPostItemCardProps> = ({
  post,
  platform,
  onEdit,
  onDelete,
  darkMode,
  addToast,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleGeminiAnalyze = async () => {
    if (!isGeminiAvailable() || !platform || !post.captionSummary) {
      const errorMsg =
        "Platform and caption summary are needed for AI analysis.";
      setAnalysisError(errorMsg);
      addToast(errorMsg, "warning");
      return;
    }
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setAnalysisError(null);

    const analysis = await analyzePostPerformance(
      platform.name,
      post.metrics,
      post.captionSummary
    );
    setIsAnalyzing(false);
    if (analysis) {
      setAnalysisResult(analysis);
      addToast("AI analysis successful!", "success");
    } else {
      const errorMsg =
        "Failed to get analysis from AI. Ensure API key is set and try again.";
      setAnalysisError(errorMsg);
      addToast(errorMsg, "error");
    }
  };

  const cardBg = darkMode
    ? "bg-slate-700 dark:border-slate-600"
    : "bg-white border-gray-200"; // Inner post card
  const textColor = darkMode ? "text-slate-300" : "text-gray-500";
  const valueColor = darkMode ? "text-slate-100" : "text-gray-700";
  const linkColor = darkMode
    ? "text-accent-highlight-dark hover:text-opacity-80"
    : "text-accent-highlight-default hover:opacity-80";
  const aiButtonBg = darkMode
    ? "bg-accent-700 hover:bg-accent-600 disabled:bg-slate-500 text-white"
    : "bg-element-default hover:bg-gray-100 disabled:bg-gray-200 text-accent-highlight-default";

  return (
    <div className={`p-3 rounded-md border ${cardBg} shadow-sm`}>
      <div className="flex justify-between items-start mb-2">
        <a
          href={
            post.postLinkOrIdentifier.startsWith("http")
              ? post.postLinkOrIdentifier
              : undefined
          }
          target="_blank"
          rel="noopener noreferrer"
          className={`font-medium truncate ${linkColor}`}
          title={post.postLinkOrIdentifier}
        >
          Post:{" "}
          {post.postLinkOrIdentifier.length > 30
            ? post.postLinkOrIdentifier.substring(0, 27) + "..."
            : post.postLinkOrIdentifier}
        </a>
        <div className="flex space-x-1.5">
          <button
            onClick={onEdit}
            className={`p-1 rounded ${
              darkMode ? "hover:bg-slate-600" : "hover:bg-gray-100"
            } text-muted-scheduled`}
            title="Edit Post Metrics"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className={`p-1 rounded ${
              darkMode ? "hover:bg-slate-600" : "hover:bg-gray-100"
            } text-accent-highlight-default`}
            title="Delete Post"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      {post.captionSummary && (
        <p className={`text-xs italic mb-2 ${textColor}`}>
          "{post.captionSummary}"
        </p>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mb-2">
        <div>
          <span className={textColor}>Likes:</span>{" "}
          <span className={`font-semibold ${valueColor}`}>
            {post.metrics.likes.toLocaleString()}
          </span>
        </div>
        <div>
          <span className={textColor}>Comments:</span>{" "}
          <span className={`font-semibold ${valueColor}`}>
            {post.metrics.comments.toLocaleString()}
          </span>
        </div>
        <div>
          <span className={textColor}>Shares:</span>{" "}
          <span className={`font-semibold ${valueColor}`}>
            {post.metrics.shares.toLocaleString()}
          </span>
        </div>
        <div>
          <span className={textColor}>Views:</span>{" "}
          <span className={`font-semibold ${valueColor}`}>
            {post.metrics.views?.toLocaleString() || "N/A"}
          </span>
        </div>
      </div>
      <p className={`text-xs ${textColor}`}>
        Last Updated: {new Date(post.metrics.lastUpdated).toLocaleDateString()}
      </p>

      {isGeminiAvailable() && post.captionSummary && (
        <div className="mt-2">
          <button
            onClick={handleGeminiAnalyze}
            disabled={isAnalyzing}
            className={`w-full text-xs px-2 py-1 rounded-md flex items-center justify-center ${aiButtonBg} transition`}
          >
            {isAnalyzing ? (
              <LoadingSpinner size="sm" darkMode={!darkMode} />
            ) : (
              <SparklesIcon className="w-3 h-3 mr-1" />
            )}
            Get AI Insights
          </button>
          {isAnalyzing && (
            <p className={`text-xs mt-1 text-center ${textColor}`}>
              Analyzing...
            </p>
          )}
          {analysisError && (
            <p className="text-xs text-red-500 mt-1">{analysisError}</p>
          )}
          {analysisResult && (
            <div
              className={`mt-1 p-1.5 rounded text-xs ${
                darkMode
                  ? "bg-slate-600 text-slate-200"
                  : "bg-green-50 text-green-700"
              }`}
            >
              <strong>AI:</strong> {analysisResult}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface TrackedAccountCardProps {
  account: TrackedAccount;
  platforms: SocialPlatform[];
  onEditAccount: (account: TrackedAccount) => void;
  onDeleteAccount: (accountId: string) => void;
  onAddPost: (account: TrackedAccount) => void;
  onEditPost: (post: TrackedPostItem) => void;
  onDeletePost: (postId: string) => void;
  darkMode?: boolean;
  addToast: (message: string, type?: ToastMessage["type"]) => void;
}

type SortKey =
  | keyof TrackedPostMetrics
  | "postLinkOrIdentifier"
  | "captionSummary";
type SortOrder = "asc" | "desc";

export const TrackedAccountCard: React.FC<TrackedAccountCardProps> = ({
  account,
  platforms,
  onEditAccount,
  onDeleteAccount,
  onAddPost,
  onEditPost,
  onDeletePost,
  darkMode,
  addToast,
}) => {
  const platform = platforms.find((p) => p.id === account.platformId);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("lastUpdated");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

  const filteredAndSortedPosts = useMemo(() => {
    let posts = [...account.posts];

    if (searchTerm) {
      posts = posts.filter(
        (post) =>
          post.postLinkOrIdentifier
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          post.captionSummary?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    posts.sort((a, b) => {
      let valA: any;
      let valB: any;

      if (sortKey === "postLinkOrIdentifier" || sortKey === "captionSummary") {
        valA = a[sortKey]?.toLowerCase() || "";
        valB = b[sortKey]?.toLowerCase() || "";
      } else {
        valA =
          sortKey === "lastUpdated"
            ? new Date(a.metrics.lastUpdated).getTime()
            : a.metrics[sortKey as keyof TrackedPostMetrics] ?? 0;
        valB =
          sortKey === "lastUpdated"
            ? new Date(b.metrics.lastUpdated).getTime()
            : b.metrics[sortKey as keyof TrackedPostMetrics] ?? 0;
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return posts;
  }, [account.posts, searchTerm, sortKey, sortOrder]);

  const mainCardClasses = `rounded-lg shadow-lg bg-card-default dark:bg-card-dark border border-card-default dark:border-card-dark text-base-default dark:text-base-dark`;
  const headerClasses = `flex justify-between items-center p-3 sm:p-4 rounded-t-lg border-b border-element-default dark:border-element-dark bg-card-default dark:bg-card-dark`; // Header also uses card default
  const platformIconColor = darkMode ? "text-muted-dark" : "text-muted-default";
  const usernameColor = `text-base-default dark:text-base-dark`;
  const platformNameColor = `text-muted-default dark:text-muted-dark`;
  const inputClasses = `p-2 border rounded-md shadow-sm text-sm w-full bg-card-default dark:bg-element-dark border-input-default dark:border-input-dark text-base-default dark:text-base-dark placeholder-muted-default dark:placeholder-muted-dark focus:ring-1 ring-focus-default dark:ring-focus-dark focus:border-input-focus-default dark:focus:border-input-focus-dark`;
  const addPostButtonClasses = `p-1.5 sm:px-2 sm:py-1 text-xs rounded-md flex items-center bg-button-accent-default dark:bg-button-accent-dark hover:bg-button-accent-hover-default dark:hover:bg-button-accent-hover-dark text-on-button-accent-default dark:text-on-button-accent-dark transition`;

  const SortButton: React.FC<{ columnKey: SortKey; label: string }> = ({
    columnKey,
    label,
  }) => (
    <button
      onClick={() => handleSort(columnKey)}
      className={`px-2 py-1 text-xs rounded flex items-center transition-colors
        ${
          sortKey === columnKey
            ? "bg-button-accent-default dark:bg-button-accent-dark text-on-button-accent-default dark:text-on-button-accent-dark"
            : "bg-button-secondary-default dark:bg-button-secondary-dark text-on-button-secondary-default dark:text-on-button-secondary-dark hover:bg-opacity-80"
        }`}
    >
      {label}
      {sortKey === columnKey &&
        (sortOrder === "asc" ? (
          <ArrowUpIcon className="w-3 h-3 ml-1" />
        ) : (
          <ArrowDownIcon className="w-3 h-3 ml-1" />
        ))}
    </button>
  );

  return (
    <div className={mainCardClasses}>
      <div className={headerClasses}>
        <div className="flex items-center">
          <img
            src={GENERIC_AVATAR_URL + `?=${account.id}`}
            alt="Profile"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3 border-2 border-gray-300 dark:border-slate-600"
          />
          <div>
            <div className="flex items-center">
              {platform?.icon &&
                React.cloneElement(platform.icon, {
                  className: `w-5 h-5 mr-1.5 ${platformIconColor}`,
                })}
              <h3 className={`text-lg font-semibold ${usernameColor}`}>
                {account.usernameOrProfileLink}
              </h3>
            </div>
            <p className={`text-sm ${platformNameColor}`}>
              {platform?.name || "Unknown Platform"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={() => onAddPost(account)}
            className={addPostButtonClasses}
            title="Add Post to Track"
          >
            <PlusCircleIcon className="w-4 h-4 sm:mr-1" />{" "}
            <span className="hidden sm:inline">Add Post</span>
          </button>
          <button
            onClick={() => onEditAccount(account)}
            className={`p-1.5 rounded text-muted-scheduled hover:bg-element-default dark:hover:bg-element-dark text-blue-500`}
            title="Edit Account"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDeleteAccount(account.id)}
            className={`p-1.5 rounded text-accent-highlight-default hover:bg-element-default dark:hover:bg-element-dark text-red-500`}
            title="Delete Account"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-4">
        <div className="mb-3">
          <input
            type="text"
            placeholder="Search posts by link or caption..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={inputClasses}
          />
        </div>

        {account.posts.length > 0 && (
          <div
            className={`mb-3 p-2 rounded-md flex flex-wrap gap-2 items-center text-xs bg-element-default dark:bg-element-dark`}
          >
            <span
              className={`font-medium mr-1 text-muted-default dark:text-muted-dark`}
            >
              Sort by:
            </span>
            <SortButton columnKey="lastUpdated" label="Date" />
            <SortButton columnKey="likes" label="Likes" />
            <SortButton columnKey="comments" label="Comments" />
            <SortButton columnKey="shares" label="Shares" />
            <SortButton columnKey="views" label="Views" />
            <SortButton columnKey="postLinkOrIdentifier" label="Identifier" />
          </div>
        )}

        {filteredAndSortedPosts.length === 0 ? (
          <p
            className={`text-center py-4 text-muted-default dark:text-muted-dark`}
          >
            {account.posts.length > 0
              ? "No posts match your search."
              : "No posts tracked for this account yet."}
          </p>
        ) : (
          <div className="space-y-3">
            {filteredAndSortedPosts.map((post) => (
              <TrackedPostItemCard
                key={post.id}
                post={post}
                platform={platform}
                onEdit={() => onEditPost(post)}
                onDelete={() => onDeletePost(post.id)}
                darkMode={darkMode}
                addToast={addToast}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
