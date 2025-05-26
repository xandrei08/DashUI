
import React, { useState, useEffect, useCallback } from 'react';
import { SocialPlatform, TrackedAccount, TrackedPostItem, TrackedPostMetrics } from '../../types';
import { SparklesIcon } from '../common/Icons';
import LoadingSpinner from '../common/LoadingSpinner';
import { analyzePostPerformance, isGeminiAvailable } from '../../services/geminiService';

interface TrackedItemFormProps {
  platforms: SocialPlatform[];
  onSaveAccount: (accountData: Pick<TrackedAccount, 'platformId' | 'usernameOrProfileLink' | 'id'>) => void;
  onSavePost: (accountId: string, postData: TrackedPostItem) => void;
  onCancel: () => void;
  initialAccount?: TrackedAccount | null; // For editing account details or context for new post
  accountForPost?: TrackedAccount | null; // Explicit account context when adding/editing a post
  initialPost?: TrackedPostItem | null;   // For editing a specific post
  darkMode?: boolean;
}

export const TrackedItemForm: React.FC<TrackedItemFormProps> = ({
  platforms,
  onSaveAccount,
  onSavePost,
  onCancel,
  initialAccount,
  accountForPost,
  initialPost,
  darkMode
}) => {
  // Determine if we are editing a post or an account, or adding new
  const isEditingPost = !!initialPost;
  const isEditingAccount = !!initialAccount && !initialPost; // Editing account details itself
  const targetAccount = accountForPost || initialAccount; // Account context for post operations

  // Account fields
  const [platformId, setPlatformId] = useState<string>(initialPost?.platformId || targetAccount?.platformId || (platforms.length > 0 ? platforms[0].id : ''));
  const [usernameOrProfileLink, setUsernameOrProfileLink] = useState<string>(targetAccount?.usernameOrProfileLink || '');
  
  // Post fields
  const [postLinkOrIdentifier, setPostLinkOrIdentifier] = useState<string>(initialPost?.postLinkOrIdentifier || '');
  const [captionSummary, setCaptionSummary] = useState<string>(initialPost?.captionSummary || '');
  const [metrics, setMetrics] = useState<TrackedPostMetrics>(
    initialPost?.metrics || { likes: 0, views: 0, shares: 0, comments: 0, lastUpdated: new Date().toISOString() }
  );

  const [formMode, setFormMode] = useState<'account' | 'post'>(initialPost || accountForPost ? 'post' : 'account');

  // Gemini analysis state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  
  useEffect(() => {
    if (initialPost) { // Editing existing post
      setFormMode('post');
      setPlatformId(initialPost.platformId);
      if (targetAccount) setUsernameOrProfileLink(targetAccount.usernameOrProfileLink); // Keep account context
      setPostLinkOrIdentifier(initialPost.postLinkOrIdentifier);
      setCaptionSummary(initialPost.captionSummary || '');
      setMetrics(initialPost.metrics);
    } else if (accountForPost) { // Adding new post to existing account
      setFormMode('post');
      setPlatformId(accountForPost.platformId);
      setUsernameOrProfileLink(accountForPost.usernameOrProfileLink);
      // Reset post-specific fields for new post
      setPostLinkOrIdentifier('');
      setCaptionSummary('');
      setMetrics({ likes: 0, views: 0, shares: 0, comments: 0, lastUpdated: new Date().toISOString() });
    } else if (initialAccount) { // Editing existing account details
      setFormMode('account');
      setPlatformId(initialAccount.platformId);
      setUsernameOrProfileLink(initialAccount.usernameOrProfileLink);
    } else { // Adding new account (default)
      setFormMode('account');
      setPlatformId(platforms.length > 0 ? platforms[0].id : '');
      setUsernameOrProfileLink('');
    }
  }, [initialAccount, initialPost, accountForPost, platforms]);


  const handleMetricChange = (field: keyof Omit<TrackedPostMetrics, 'lastUpdated'>, value: string) => {
    setMetrics(prev => ({ ...prev, [field]: parseInt(value, 10) || 0, lastUpdated: new Date().toISOString() }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formMode === 'account') {
      if (!platformId || !usernameOrProfileLink) {
        alert("Platform and Username/Profile Link are required for tracking an account.");
        return;
      }
      onSaveAccount({
        id: initialAccount?.id || Date.now().toString() + Math.random().toString(36).substring(2,9), // Use existing ID if editing
        platformId,
        usernameOrProfileLink,
      });
    } else { // formMode === 'post'
      if (!targetAccount || !targetAccount.id) {
        alert("Account context is missing. Cannot save post.");
        return;
      }
      if (!platformId || !postLinkOrIdentifier) {
        alert("Platform and Post Link/Identifier are required for tracking a post.");
        return;
      }
      onSavePost(targetAccount.id, {
        id: initialPost?.id || Date.now().toString() + Math.random().toString(36).substring(2,9), // Use existing ID if editing
        platformId,
        postLinkOrIdentifier,
        captionSummary,
        metrics,
        notes: initialPost?.notes // Preserve notes if any
      });
    }
  };

  const handleGeminiAnalyze = useCallback(async () => {
    if (!isGeminiAvailable() || !platformId || !captionSummary || !postLinkOrIdentifier) {
      setAnalysisError("Platform, caption summary, and post identifier are needed for analysis.");
      return;
    }
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setAnalysisError(null);
    const selectedPlatform = platforms.find(p => p.id === platformId);
    if (!selectedPlatform) {
      setAnalysisError("Invalid platform selected.");
      setIsAnalyzing(false);
      return;
    }

    const analysis = await analyzePostPerformance(selectedPlatform.name, metrics, captionSummary);
    setIsAnalyzing(false);
    if (analysis) {
      setAnalysisResult(analysis);
    } else {
      setAnalysisError("Failed to get analysis from AI. Please check API key and try again.");
    }
  }, [platformId, metrics, captionSummary, postLinkOrIdentifier, platforms]);

  const inputClasses = `block w-full sm:text-sm border rounded-md p-2 shadow-sm bg-card-default dark:bg-slate-700 border-input-default dark:border-slate-600 text-base-default dark:text-slate-100 focus:ring-1 ring-focus-default dark:ring-focus-dark focus:border-input-focus-default dark:focus:border-input-focus-dark`;
  const labelClasses = `block text-sm font-medium text-muted-default dark:text-slate-300 mb-1`;
  const buttonBase = `py-2 px-4 rounded-md font-medium transition`;
  const primaryButton = `bg-button-accent-default dark:bg-button-accent-dark text-on-button-accent-default dark:text-on-button-accent-dark hover:bg-button-accent-hover-default dark:hover:bg-button-accent-hover-dark shadow-sm`;
  const secondaryButton = `bg-button-secondary-default dark:bg-button-secondary-dark text-on-button-secondary-default dark:text-on-button-secondary-dark hover:bg-button-secondary-hover-default dark:hover:bg-button-secondary-hover-dark`;
  
  const aiButtonClasses = `w-full px-3 py-1.5 text-sm font-medium rounded-md flex items-center justify-center text-on-button-accent-default dark:text-on-button-accent-dark bg-button-accent-default dark:bg-button-accent-dark hover:bg-button-accent-hover-default dark:hover:bg-button-accent-hover-dark disabled:opacity-60 transition`;


  const isPostOperation = !!(initialPost || accountForPost);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Show these fields if adding/editing an account, or if adding/editing a post (as context) */}
      {(isEditingAccount || !isPostOperation || isPostOperation) && (
        <>
          <div>
            <label htmlFor="platformId" className={labelClasses}>Platform</label>
            <select id="platformId" value={platformId} onChange={e => setPlatformId(e.target.value)} className={inputClasses} required disabled={isPostOperation && !!accountForPost}>
              {platforms.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="usernameOrProfileLink" className={labelClasses}>Account Username / Profile Link</label>
            <input type="text" id="usernameOrProfileLink" value={usernameOrProfileLink} onChange={e => setUsernameOrProfileLink(e.target.value)} className={inputClasses} required placeholder="e.g., @yourhandle or profile URL" disabled={isPostOperation && !!accountForPost} />
          </div>
        </>
      )}

      {/* Show radio buttons to switch mode only if adding a new item (neither initialAccount nor initialPost is set) */}
      {!initialAccount && !initialPost && !accountForPost && (
         <div className="my-4">
            <span className={labelClasses}>What do you want to track?</span>
            <div className="flex space-x-4 mt-1">
                <label className="flex items-center space-x-2">
                    <input type="radio" name="formMode" value="account" checked={formMode === 'account'} onChange={() => setFormMode('account')} className={`focus:ring-focus-default h-4 w-4 text-accent-highlight-default dark:text-accent-highlight-dark border-input-default dark:border-input-dark`}/>
                    <span className={`text-base-default dark:text-base-dark`}>A Social Media Account</span>
                </label>
                <label className="flex items-center space-x-2">
                    <input type="radio" name="formMode" value="post" checked={formMode === 'post'} onChange={() => setFormMode('post')} className={`focus:ring-focus-default h-4 w-4 text-accent-highlight-default dark:text-accent-highlight-dark border-input-default dark:border-input-dark`}/>
                    <span className={`text-base-default dark:text-base-dark`}>A Specific Post</span>
                </label>
            </div>
            {formMode === 'post' && !targetAccount?.id && <p className={`text-xs mt-1 text-yellow-500 dark:text-yellow-400`}>You'll first define the account, then the post details.</p>}
         </div>
      )}


      {/* Post specific fields - only show if formMode is 'post' OR if we are editing an existing post */}
      {(formMode === 'post' || isEditingPost) && (
        <>
          <hr className={`border-element-default dark:border-element-dark my-4`} />
          <h3 className={`text-lg font-medium text-accent-highlight-default dark:text-accent-highlight-dark`}>Post Details</h3>
          <div>
            <label htmlFor="postLinkOrIdentifier" className={labelClasses}>Post Link / Identifier</label>
            <input type="text" id="postLinkOrIdentifier" value={postLinkOrIdentifier} onChange={e => setPostLinkOrIdentifier(e.target.value)} className={inputClasses} required placeholder="e.g., URL to post or unique video ID" />
          </div>
          <div>
            <label htmlFor="captionSummary" className={labelClasses}>Caption Summary (for AI Analysis)</label>
            <textarea id="captionSummary" value={captionSummary} onChange={e => setCaptionSummary(e.target.value)} rows={2} className={inputClasses} placeholder="Brief summary of the post content."></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="likes" className={labelClasses}>Likes</label>
              <input type="number" id="likes" value={metrics.likes} onChange={e => handleMetricChange('likes', e.target.value)} className={inputClasses} />
            </div>
            <div>
              <label htmlFor="comments" className={labelClasses}>Comments</label>
              <input type="number" id="comments" value={metrics.comments} onChange={e => handleMetricChange('comments', e.target.value)} className={inputClasses} />
            </div>
            <div>
              <label htmlFor="shares" className={labelClasses}>Shares</label>
              <input type="number" id="shares" value={metrics.shares} onChange={e => handleMetricChange('shares', e.target.value)} className={inputClasses} />
            </div>
            <div>
              <label htmlFor="views" className={labelClasses}>Views (Optional)</label>
              <input type="number" id="views" value={metrics.views} onChange={e => handleMetricChange('views', e.target.value)} className={inputClasses} />
            </div>
          </div>

          {isGeminiAvailable() && (postLinkOrIdentifier || captionSummary) && (
            <div className={`mt-4 p-3 rounded-md bg-element-default dark:bg-slate-700 border border-element-default dark:border-slate-600`}>
              <button type="button" onClick={handleGeminiAnalyze} disabled={isAnalyzing}
                className={aiButtonClasses}
              >
                {isAnalyzing ? <LoadingSpinner size="sm" darkMode={!darkMode}/> : <SparklesIcon className="w-4 h-4 mr-2" />}
                Analyze Performance with AI
              </button>
              {isAnalyzing && <p className={`text-xs mt-1 text-center text-muted-default dark:text-slate-400`}>Analyzing...</p>}
              {analysisError && <p className="text-xs text-negative-default dark:text-negative-dark mt-1">{analysisError}</p>}
              {analysisResult && <div className={`mt-2 p-2 rounded text-sm bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100`}><strong>AI Analysis:</strong> {analysisResult}</div>}
            </div>
          )}
        </>
      )}
      
      <div className="flex justify-end space-x-3 pt-2">
        <button type="button" onClick={onCancel} className={`${buttonBase} ${secondaryButton}`}>
          Cancel
        </button>
        <button type="submit" className={`${buttonBase} ${primaryButton}`}>
          {isEditingPost || (formMode === 'post' && targetAccount?.id) ? 'Save Post' : (isEditingAccount ? 'Save Account Changes' : 'Save Account')}
        </button>
      </div>
    </form>
  );
};