import React, { useState, useEffect, useCallback } from "react";
// Fix: Import IconProps
import {
  ScheduledPost,
  SocialPlatform,
  GeminiContentSuggestion,
  ToastMessage,
  IconProps,
} from "../../types";
import {
  SparklesIcon,
  ImagePlaceholderIcon,
  HashtagIcon,
  ClockIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "../common/Icons";
import LoadingSpinner from "../common/LoadingSpinner";
import {
  generateContentIdea,
  suggestTitlesOrHooks,
  suggestHashtags,
  suggestBestPostingTimes,
  isGeminiAvailable,
} from "../../services/geminiService";

interface PostSchedulerFormProps {
  platforms: SocialPlatform[];
  onSave: (post: ScheduledPost | Omit<ScheduledPost, "id" | "status">) => void;
  onCancel: () => void;
  initialPost?: ScheduledPost | null;
  darkMode?: boolean;
  addToast: (message: string, type?: ToastMessage["type"]) => void;
}

interface AIAssistantSectionProps {
  title: string;
  // Fix: Specify IconProps for the icon element to ensure 'className' is a known property for React.cloneElement
  icon: React.ReactElement<IconProps>;
  children: React.ReactNode;
  darkMode?: boolean;
}

const AIAssistantSection: React.FC<AIAssistantSectionProps> = ({
  title,
  icon,
  children,
  darkMode,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      className={`rounded-md ${
        darkMode ? "bg-slate-700" : "bg-gray-50 border border-gray-200"
      }`}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-2 text-sm font-medium transition-colors
                    ${
                      darkMode
                        ? "text-accent-highlight-dark hover:bg-slate-600"
                        : "text-accent-highlight-default hover:bg-gray-200" // Use new blue accent for text
                    }`}
      >
        <div className="flex items-center">
          {React.cloneElement(icon, { className: "w-5 h-5 mr-2" })}
          {title}
        </div>
        {isOpen ? (
          <ChevronUpIcon className="w-5 h-5" />
        ) : (
          <ChevronDownIcon className="w-5 h-5" />
        )}
      </button>
      {isOpen && (
        <div className="p-3 border-t border-gray-300 dark:border-slate-600">
          {children}
        </div>
      )}
    </div>
  );
};

export const PostSchedulerForm: React.FC<PostSchedulerFormProps> = ({
  platforms,
  onSave,
  onCancel,
  initialPost,
  darkMode,
  addToast,
}) => {
  const [platformId, setPlatformId] = useState<string>(
    initialPost?.platformId || (platforms.length > 0 ? platforms[0].id : "")
  );
  const [usernameOrLink, setUsernameOrLink] = useState<string>(
    initialPost?.usernameOrLink || ""
  );
  const [content, setContent] = useState<string>(initialPost?.content || "");
  const [scheduledTime, setScheduledTime] = useState<string>(
    initialPost?.scheduledTime
      ? new Date(initialPost.scheduledTime).toISOString().substring(0, 16)
      : new Date(Date.now() + 3600 * 1000).toISOString().substring(0, 16)
  );
  const [mediaUrl, setMediaUrl] = useState<string>(initialPost?.mediaUrl || "");
  const [status, setStatus] = useState<ScheduledPost["status"]>(
    initialPost?.status || "scheduled"
  );
  const [notes, setNotes] = useState<string>(initialPost?.notes || "");
  const [geminiGenerated, setGeminiGenerated] = useState<boolean>(
    initialPost?.geminiGenerated || false
  );

  // AI States - Post Idea Generator
  const [ideaTopic, setIdeaTopic] = useState<string>("");
  const [isGeneratingIdea, setIsGeneratingIdea] = useState<boolean>(false);
  const [ideaError, setIdeaError] = useState<string | null>(null);

  // AI States - Title/Hook Assistant
  const [titleHookTopic, setTitleHookTopic] = useState<string>("");
  const [isGeneratingTitleHook, setIsGeneratingTitleHook] =
    useState<boolean>(false);
  const [titleHookError, setTitleHookError] = useState<string | null>(null);
  const [titleHookSuggestions, setTitleHookSuggestions] = useState<string[]>(
    []
  );

  // AI States - Hashtag Assistant
  const [hashtagContent, setHashtagContent] = useState<string>("");
  const [isGeneratingHashtags, setIsGeneratingHashtags] =
    useState<boolean>(false);
  const [hashtagError, setHashtagError] = useState<string | null>(null);
  const [hashtagSuggestions, setHashtagSuggestions] = useState<string[]>([]);

  // AI States - Posting Time Advisor
  const [timeAdvisorNiche, setTimeAdvisorNiche] = useState<string>("");
  const [isGeneratingTimes, setIsGeneratingTimes] = useState<boolean>(false);
  const [timeError, setTimeError] = useState<string | null>(null);
  const [timeSuggestions, setTimeSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (initialPost) {
      setPlatformId(initialPost.platformId);
      setUsernameOrLink(initialPost.usernameOrLink);
      setContent(initialPost.content);
      setScheduledTime(
        new Date(initialPost.scheduledTime).toISOString().substring(0, 16)
      );
      setMediaUrl(initialPost.mediaUrl || "");
      setStatus(initialPost.status);
      setNotes(initialPost.notes || "");
      setGeminiGenerated(initialPost.geminiGenerated || false);
      // Pre-fill AI topics if content exists
      if (initialPost.content) {
        const summary =
          initialPost.content.length > 100
            ? initialPost.content.substring(0, 100) + "..."
            : initialPost.content;
        setIdeaTopic(summary);
        setTitleHookTopic(summary);
        setHashtagContent(initialPost.content);
      }
    } else {
      // Reset for new post
      setPlatformId(platforms.length > 0 ? platforms[0].id : "");
      setUsernameOrLink("");
      setContent("");
      setScheduledTime(
        new Date(Date.now() + 3600 * 1000).toISOString().substring(0, 16)
      );
      setMediaUrl("");
      setStatus("scheduled");
      setNotes("");
      setGeminiGenerated(false);
      setIdeaTopic("");
      setTitleHookTopic("");
      setHashtagContent("");
      setTimeAdvisorNiche("");
    }
  }, [initialPost, platforms]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!platformId || !usernameOrLink || !content || !scheduledTime) {
      addToast(
        "Please fill in Platform, Account, Content, and Scheduled Time.",
        "error"
      );
      return;
    }

    const postData = {
      platformId,
      usernameOrLink,
      content,
      scheduledTime: new Date(scheduledTime).toISOString(),
      mediaUrl: mediaUrl || undefined,
      notes: notes || undefined,
      geminiGenerated,
    };

    if (initialPost) {
      onSave({ ...postData, id: initialPost.id, status: status });
    } else {
      onSave(postData);
    }
  };

  const getSelectedPlatformName = useCallback(() => {
    return (
      platforms.find((p) => p.id === platformId)?.name || "selected platform"
    );
  }, [platformId, platforms]);

  // AI Handlers
  const handleGeminiSuggestIdea = useCallback(async () => {
    if (!ideaTopic.trim() || !platformId) {
      setIdeaError("Please enter a topic and select a platform.");
      return;
    }
    setIsGeneratingIdea(true);
    setIdeaError(null);
    const suggestion = await generateContentIdea(
      getSelectedPlatformName(),
      ideaTopic
    );
    setIsGeneratingIdea(false);
    if (suggestion) {
      setContent(suggestion.caption + "\n\n" + suggestion.hashtags.join(" "));
      setGeminiGenerated(true);
      addToast("AI content idea generated!", "success");
    } else {
      setIdeaError("Failed to generate content idea.");
      addToast("Failed to generate AI idea.", "error");
    }
  }, [ideaTopic, platformId, getSelectedPlatformName, addToast]);

  const handleGeminiSuggestTitles = useCallback(async () => {
    if (!titleHookTopic.trim() || !platformId) {
      setTitleHookError("Please enter a topic for titles/hooks.");
      return;
    }
    setIsGeneratingTitleHook(true);
    setTitleHookError(null);
    setTitleHookSuggestions([]);
    const suggestions = await suggestTitlesOrHooks(
      titleHookTopic,
      getSelectedPlatformName()
    );
    setIsGeneratingTitleHook(false);
    if (suggestions) {
      setTitleHookSuggestions(suggestions);
      addToast("AI titles/hooks generated!", "success");
    } else {
      setTitleHookError("Failed to generate titles/hooks.");
      addToast("Failed to generate AI titles/hooks.", "error");
    }
  }, [titleHookTopic, platformId, getSelectedPlatformName, addToast]);

  const handleGeminiSuggestHashtags = useCallback(async () => {
    const contentForHashtags = hashtagContent.trim() || content.trim();
    if (!contentForHashtags || !platformId) {
      setHashtagError(
        "Post content or topic is needed for hashtag suggestions."
      );
      return;
    }
    setIsGeneratingHashtags(true);
    setHashtagError(null);
    setHashtagSuggestions([]);
    const suggestions = await suggestHashtags(
      contentForHashtags,
      getSelectedPlatformName()
    );
    setIsGeneratingHashtags(false);
    if (suggestions) {
      setHashtagSuggestions(suggestions);
      addToast("AI hashtags generated!", "success");
    } else {
      setHashtagError("Failed to generate hashtags.");
      addToast("Failed to generate AI hashtags.", "error");
    }
  }, [hashtagContent, content, platformId, getSelectedPlatformName, addToast]);

  const handleGeminiSuggestTimes = useCallback(async () => {
    if (!platformId) {
      setTimeError("Please select a platform.");
      return;
    }
    setIsGeneratingTimes(true);
    setTimeError(null);
    setTimeSuggestions([]);
    const suggestions = await suggestBestPostingTimes(
      getSelectedPlatformName(),
      timeAdvisorNiche.trim() || undefined
    );
    setIsGeneratingTimes(false);
    if (suggestions) {
      setTimeSuggestions(suggestions);
      addToast("AI posting time advice generated!", "success");
    } else {
      setTimeError("Failed to generate posting time advice.");
      addToast("Failed to generate AI posting time advice.", "error");
    }
  }, [platformId, timeAdvisorNiche, getSelectedPlatformName, addToast]);

  const inputClasses = `block w-full sm:text-sm border rounded-md p-2 shadow-sm bg-card-default dark:bg-slate-700 border-input-default dark:border-slate-600 text-base-default dark:text-slate-100 focus:ring-1 ring-focus-default dark:ring-focus-dark focus:border-input-focus-default dark:focus:border-input-focus-dark`;
  const labelClasses = `block text-sm font-medium text-muted-black dark:text-base-dark mb-1`;
  const aiButtonClasses = `px-3 py-1.5 text-xs font-medium rounded-md flex items-center justify-center text-on-button-accent-default dark:text-on-button-accent-dark bg-button-accent-default dark:bg-button-accent-dark hover:bg-button-accent-hover-default dark:hover:bg-button-accent-hover-dark disabled:opacity-60 transition`;
  const aiInputClasses = `${inputClasses} text-xs py-1`; // Inherits base input styles

  const availableStatuses: ScheduledPost["status"][] = [
    "scheduled",
    "posted",
    "failed",
    "draft",
    "pending_review",
  ];

  const renderSuggestions = (
    suggestions: string[],
    onApply: (suggestion: string) => void,
    type: string
  ) => (
    <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
      {suggestions.map((s, i) => (
        <button
          type="button"
          key={`${type}-${i}`}
          onClick={() => onApply(s)}
          className={`block w-full text-left p-1.5 text-xs rounded bg-element-default dark:bg-slate-600 hover:bg-gray-200 dark:hover:bg-slate-500 text-base-default dark:text-slate-200 transition`}
        >
          {s}
        </button>
      ))}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="platformId" className={labelClasses}>
          Platform
        </label>
        <select
          id="platformId"
          value={platformId}
          onChange={(e) => setPlatformId(e.target.value)}
          className={inputClasses}
          required
        >
          {platforms.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="usernameOrLink" className={labelClasses}>
          Account Identifier
        </label>
        <input
          type="text"
          id="usernameOrLink"
          value={usernameOrLink}
          onChange={(e) => setUsernameOrLink(e.target.value)}
          className={inputClasses}
          required
          placeholder="e.g., @yourhandle or profile URL"
        />
      </div>

      {isGeminiAvailable() && (
        <div className="space-y-3">
          <AIAssistantSection
            title="AI Post Idea Generator"
            icon={<SparklesIcon />}
            darkMode={darkMode}
          >
            <div className="flex items-end space-x-2">
              <div className="flex-grow">
                <label
                  htmlFor="ideaTopic"
                  className={`${labelClasses} text-xs`}
                >
                  Topic for Idea
                </label>
                <input
                  type="text"
                  id="ideaTopic"
                  value={ideaTopic}
                  onChange={(e) => setIdeaTopic(e.target.value)}
                  className={aiInputClasses}
                  placeholder="e.g., 'healthy breakfast ideas'"
                />
              </div>
              <button
                type="button"
                onClick={handleGeminiSuggestIdea}
                disabled={isGeneratingIdea || !ideaTopic.trim()}
                className={aiButtonClasses}
              >
                {isGeneratingIdea ? (
                  <LoadingSpinner size="sm" darkMode={!darkMode} />
                ) : (
                  <SparklesIcon className="w-4 h-4" />
                )}
              </button>
            </div>
            {isGeneratingIdea && (
              <p
                className={`text-xs mt-1 text-muted-default dark:text-base-dark`}
              >
                Generating idea...
              </p>
            )}
            {ideaError && (
              <p className="text-xs text-negative-default dark:text-negative-dark mt-1">
                {ideaError}
              </p>
            )}
          </AIAssistantSection>

          <AIAssistantSection
            title="AI Title/Hook Assistant"
            icon={<SparklesIcon />}
            darkMode={darkMode}
          >
            <div className="flex items-end space-x-2">
              <div className="flex-grow">
                <label
                  htmlFor="titleHookTopic"
                  className={`${labelClasses} text-xs`}
                >
                  Topic for Titles/Hooks
                </label>
                <input
                  type="text"
                  id="titleHookTopic"
                  value={titleHookTopic}
                  onChange={(e) => setTitleHookTopic(e.target.value)}
                  className={aiInputClasses}
                  placeholder="e.g., 'benefits of yoga'"
                />
              </div>
              <button
                type="button"
                onClick={handleGeminiSuggestTitles}
                disabled={isGeneratingTitleHook || !titleHookTopic.trim()}
                className={aiButtonClasses}
              >
                {isGeneratingTitleHook ? (
                  <LoadingSpinner size="sm" darkMode={!darkMode} />
                ) : (
                  <SparklesIcon className="w-4 h-4" />
                )}
              </button>
            </div>
            {isGeneratingTitleHook && (
              <p
                className={`text-xs mt-1 text-muted-default dark:text-base-dark`}
              >
                Generating titles/hooks...
              </p>
            )}
            {titleHookError && (
              <p className="text-xs text-negative-default dark:text-negative-dark mt-1">
                {titleHookError}
              </p>
            )}
            {titleHookSuggestions.length > 0 &&
              renderSuggestions(
                titleHookSuggestions,
                (s) => setContent((prev) => s + "\n\n" + prev),
                "title"
              )}
          </AIAssistantSection>

          <AIAssistantSection
            title="AI Hashtag Assistant"
            icon={<HashtagIcon />}
            darkMode={darkMode}
          >
            <div className="flex items-end space-x-2">
              <div className="flex-grow">
                <label
                  htmlFor="hashtagContent"
                  className={`${labelClasses} text-xs`}
                >
                  Content/Topic for Hashtags (optional)
                </label>
                <input
                  type="text"
                  id="hashtagContent"
                  value={hashtagContent}
                  onChange={(e) => setHashtagContent(e.target.value)}
                  className={aiInputClasses}
                  placeholder="Uses main content if empty"
                />
              </div>
              <button
                type="button"
                onClick={handleGeminiSuggestHashtags}
                disabled={
                  isGeneratingHashtags ||
                  (!hashtagContent.trim() && !content.trim())
                }
                className={aiButtonClasses}
              >
                {isGeneratingHashtags ? (
                  <LoadingSpinner size="sm" darkMode={!darkMode} />
                ) : (
                  <HashtagIcon className="w-4 h-4" />
                )}
              </button>
            </div>
            {isGeneratingHashtags && (
              <p
                className={`text-xs mt-1 text-muted-default dark:text-base-dark`}
              >
                Generating hashtags...
              </p>
            )}
            {hashtagError && (
              <p className="text-xs text-negative-default dark:text-negative-dark mt-1">
                {hashtagError}
              </p>
            )}
            {hashtagSuggestions.length > 0 &&
              renderSuggestions(
                hashtagSuggestions,
                (s) => setContent((prev) => prev + " " + s),
                "hashtag"
              )}
          </AIAssistantSection>

          <AIAssistantSection
            title="AI Posting Time Advisor"
            icon={<ClockIcon />}
            darkMode={darkMode}
          >
            <div className="flex items-end space-x-2">
              <div className="flex-grow">
                <label
                  htmlFor="timeAdvisorNiche"
                  className={`${labelClasses} text-xs`}
                >
                  Niche (Optional)
                </label>
                <input
                  type="text"
                  id="timeAdvisorNiche"
                  value={timeAdvisorNiche}
                  onChange={(e) => setTimeAdvisorNiche(e.target.value)}
                  className={aiInputClasses}
                  placeholder="e.g., 'tech reviews'"
                />
              </div>
              <button
                type="button"
                onClick={handleGeminiSuggestTimes}
                disabled={isGeneratingTimes || !platformId}
                className={aiButtonClasses}
              >
                {isGeneratingTimes ? (
                  <LoadingSpinner size="sm" darkMode={!darkMode} />
                ) : (
                  <ClockIcon className="w-4 h-4" />
                )}
              </button>
            </div>
            {isGeneratingTimes && (
              <p
                className={`text-xs mt-1 text-muted-default dark:text-base-dark`}
              >
                Generating advice...
              </p>
            )}
            {timeError && (
              <p className="text-xs text-negative-default dark:text-negative-dark mt-1">
                {timeError}
              </p>
            )}
            {timeSuggestions.length > 0 && (
              <div className="mt-2 space-y-1">
                {timeSuggestions.map((s, i) => (
                  <p
                    key={`time-${i}`}
                    className={`p-1.5 text-xs rounded bg-element-default dark:bg-slate-600 text-base-default dark:text-slate-200`}
                  >
                    {s}
                  </p>
                ))}
              </div>
            )}
          </AIAssistantSection>
        </div>
      )}

      <div>
        <label htmlFor="content" className={labelClasses}>
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          className={inputClasses}
          required
          placeholder="Write your post content here..."
        ></textarea>
        {geminiGenerated && (
          <p
            className={`text-xs mt-1 text-accent-highlight-default dark:text-accent-highlight-dark`}
          >
            Content assisted by AI ✨
          </p>
        )}
      </div>
      <div>
        <label htmlFor="scheduledTime" className={labelClasses}>
          Scheduled Time
        </label>
        <input
          type="datetime-local"
          id="scheduledTime"
          value={scheduledTime}
          onChange={(e) => setScheduledTime(e.target.value)}
          className={inputClasses}
          required
        />
      </div>
      <div>
        <label htmlFor="mediaUrl" className={labelClasses}>
          Media URL (Optional)
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            id="mediaUrl"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            className={inputClasses}
            placeholder="https://example.com/image.jpg"
          />
          {mediaUrl ? (
            <img
              src={mediaUrl}
              alt="Preview"
              className="w-10 h-10 object-cover rounded"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          ) : (
            <ImagePlaceholderIcon
              className={`w-10 h-10 text-gray-300 dark:text-slate-500`}
            />
          )}
        </div>
      </div>
      <div>
        <label htmlFor="notes" className={labelClasses}>
          Internal Notes (Optional)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className={inputClasses}
          placeholder="Notes for your reference, not part of the post."
        ></textarea>
      </div>

      {initialPost && (
        <div>
          <label htmlFor="status" className={labelClasses}>
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as ScheduledPost["status"])
            }
            className={inputClasses}
            required
          >
            {availableStatuses.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1).replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className={`py-2 px-4 rounded-md font-medium transition bg-button-secondary-default dark:bg-button-secondary-dark text-on-button-secondary-default dark:text-on-button-secondary-dark hover:bg-button-secondary-hover-default dark:hover:bg-button-secondary-hover-dark`}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`py-2 px-4 rounded-md font-medium transition shadow-sm bg-button-accent-default dark:bg-button-accent-dark text-on-button-accent-default dark:text-on-button-accent-dark hover:bg-button-accent-hover-default dark:hover:bg-button-accent-hover-dark`}
        >
          {initialPost ? "Save Changes" : "Schedule Post"}
        </button>
      </div>
    </form>
  );
};
