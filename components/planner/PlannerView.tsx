import React, { useState, useCallback, useMemo } from 'react';
import { ScheduledPost, SocialPlatform, ViewState, ToastMessage, TrendingTopicSuggestion } from '../../types';
import { PostSchedulerForm } from './PostSchedulerForm';
import { ScheduledPostItem } from './ScheduledPostItem';
import { PlusCircleIcon, CalendarIcon, FireIcon, ArrowDownTrayIcon } from '../common/Icons'; 
import Modal from '../common/Modal';
import LoadingSpinner from '../common/LoadingSpinner';
import { DEFAULT_PLATFORMS } from '../../constants';
import { getTrendingTopics, isGeminiAvailable } from '../../services/geminiService';

// Helper to escape CSV fields
const escapeCsvField = (field: any): string => {
  if (field === null || typeof field === 'undefined') return '';
  const stringField = String(field);
  // If the field contains a comma, newline, or double quote, enclose it in double quotes
  if (stringField.includes(',') || stringField.includes('\n') || stringField.includes('"')) {
    // Escape existing double quotes by doubling them
    return `"${stringField.replace(/"/g, '""')}"`;
  }
  return stringField;
};

// Generic CSV export function
const exportToCSV = (data: any[], filename: string, headersOrder?: string[]) => {
  if (!data || data.length === 0) {
    alert("No data to export.");
    return;
  }
  const headers = headersOrder || Object.keys(data[0]);
  const csvRows = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => escapeCsvField(row[header])).join(',')
    )
  ];
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};


interface PlannerViewProps {
  scheduledPosts: ScheduledPost[];
  setScheduledPosts: React.Dispatch<React.SetStateAction<ScheduledPost[]>>;
  platforms: SocialPlatform[];
  darkMode?: boolean;
  addToast: (message: string, type?: ToastMessage['type']) => void;
}

export const PlannerView: React.FC<PlannerViewProps> = ({ scheduledPosts, setScheduledPosts, platforms, darkMode, addToast }) => {
  const [viewState, setViewState] = useState<ViewState>(ViewState.LIST);
  const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null);
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [showDiscoverTrendsModal, setShowDiscoverTrendsModal] = useState<boolean>(false);
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopicSuggestion[]>([]);
  const [trendsLoading, setTrendsLoading] = useState<boolean>(false);
  const [trendsError, setTrendsError] = useState<string | null>(null);
  const [selectedPlatformForTrends, setSelectedPlatformForTrends] = useState<string>(DEFAULT_PLATFORMS.length > 0 ? DEFAULT_PLATFORMS[0].id : '');
  const [nicheForTrends, setNicheForTrends] = useState<string>('');


  const handleAddPost = useCallback((post: Omit<ScheduledPost, 'id' | 'status'>) => { 
    setScheduledPosts(prev => [...prev, { ...post, id: Date.now().toString() + Math.random().toString(36).substring(2,9), status: 'scheduled' }]);
    setViewState(ViewState.LIST);
    addToast('Post scheduled successfully!', 'success');
  }, [setScheduledPosts, addToast]);

  const handleUpdatePost = useCallback((updatedPost: ScheduledPost) => {
    setScheduledPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
    setViewState(ViewState.LIST);
    setEditingPost(null);
    addToast('Post updated successfully!', 'success');
  }, [setScheduledPosts, addToast]);

  const handleDeletePost = useCallback((postId: string) => {
    setScheduledPosts(prev => prev.filter(p => p.id !== postId));
    addToast('Post deleted.', 'info');
  }, [setScheduledPosts, addToast]);

  const handleEditPost = useCallback((post: ScheduledPost) => {
    setEditingPost(post);
    setViewState(ViewState.ADD); 
  }, []);

  const handleUpdateStatus = useCallback((postId: string, newStatus: ScheduledPost['status']) => {
    setScheduledPosts(prevPosts => prevPosts.map(p => p.id === postId ? { ...p, status: newStatus } : p));
    addToast(`Post status updated to ${newStatus}.`, 'info');
  }, [setScheduledPosts, addToast]);

  const openSchedulerForm = () => {
    setEditingPost(null);
    setViewState(ViewState.ADD);
  };
  
  const closeSchedulerForm = () => {
    setViewState(ViewState.LIST);
    setEditingPost(null);
  };

  const fetchTrendingTopicsForModal = async () => {
    if (!selectedPlatformForTrends || !nicheForTrends.trim() || !isGeminiAvailable()) {
        addToast("Platform, niche, and AI availability are required.", 'warning');
        return;
    }
    setTrendsLoading(true);
    setTrendsError(null);
    setTrendingTopics([]);
    const platformName = DEFAULT_PLATFORMS.find(p => p.id === selectedPlatformForTrends)?.name || "selected platform";
    const trends = await getTrendingTopics(platformName, nicheForTrends);
    setTrendsLoading(false);
    if (trends) {
      setTrendingTopics(trends);
      addToast(`Fetched trends for ${platformName} / ${nicheForTrends}!`, 'success');
    } else {
      setTrendsError("Failed to fetch trending topics. Please check API key and try again.");
      addToast("Failed to fetch AI trends.", 'error');
    }
  };

  const handleDownloadPlannerCSV = () => {
    const dataToExport = scheduledPosts.map(post => {
      const platform = platforms.find(p => p.id === post.platformId);
      return {
        ID: post.id,
        Platform: platform?.name || post.platformId,
        Account: post.usernameOrLink,
        Content: post.content,
        ScheduledTime: new Date(post.scheduledTime).toLocaleString(),
        Status: post.status,
        MediaURL: post.mediaUrl || '',
        Notes: post.notes || '',
        AIAssisted: post.geminiGenerated ? 'Yes' : 'No',
      };
    });
    exportToCSV(dataToExport, 'planner_schedule.csv', ['ID', 'Platform', 'Account', 'Content', 'ScheduledTime', 'Status', 'MediaURL', 'Notes', 'AIAssisted']);
    addToast('Planner data exported to CSV!', 'success');
  };

  const filteredAndSortedPosts = useMemo(() => {
    return scheduledPosts
      .filter(post => {
        const platformMatch = filterPlatform === 'all' || post.platformId === filterPlatform;
        const statusMatch = filterStatus === 'all' || post.status === filterStatus;
        return platformMatch && statusMatch;
      })
      .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime());
  }, [scheduledPosts, filterPlatform, filterStatus]);
  
  const commonInputClasses = `p-2 border rounded-md shadow-sm bg-card-default dark:bg-card-dark border-input-default dark:border-input-dark text-base-default dark:text-base-dark focus:ring-1 focus:ring-focus-default dark:focus:ring-focus-dark focus:border-input-focus-default dark:focus:border-input-focus-dark`;
  const buttonClasses = `flex items-center bg-button-accent-default dark:bg-button-accent-dark hover:bg-button-accent-hover-default dark:hover:bg-button-accent-hover-dark text-on-button-accent-default dark:text-on-button-accent-dark font-semibold py-2 px-3 rounded-lg shadow-md transition duration-150 ease-in-out text-sm`;


  const plannerStats = useMemo(() => {
    const totalPosts = scheduledPosts.length;
    const currentlyScheduled = scheduledPosts.filter(p => p.status === 'scheduled' && new Date(p.scheduledTime) >= new Date()).length;
    const posted = scheduledPosts.filter(p => p.status === 'posted').length;
    const failed = scheduledPosts.filter(p => p.status === 'failed').length;
    const drafts = scheduledPosts.filter(p => p.status === 'draft').length;
    const pending = scheduledPosts.filter(p => p.status === 'pending_review').length;
    const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const upcomingNext7Days = scheduledPosts.filter(p => {
      const scheduledTime = new Date(p.scheduledTime);
      return p.status === 'scheduled' && scheduledTime >= new Date() && scheduledTime <= sevenDaysFromNow;
    }).length;

    return { totalPosts, currentlyScheduled, posted, failed, drafts, pending, upcomingNext7Days };
  }, [scheduledPosts]);

  const statCardBaseClass = `p-3 rounded-lg shadow-md text-center bg-card-default dark:bg-card-dark`;
  const statLabelClass = `text-xs text-muted-default dark:text-muted-dark uppercase`;
  const statValueClass = `text-2xl font-bold text-button-accent-default dark:text-button-accent-dark`;


  return (
    <div className="bg-page-default dark:bg-page-dark text-base-default dark:text-base-dark p-4 rounded-lg shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h2 className="text-2xl font-semibold flex items-center">
          <CalendarIcon className={`w-7 h-7 mr-2 text-button-accent-default dark:text-button-accent-dark`} />
          Content Planner
        </h2>
        {viewState === ViewState.LIST && (
          <div className="flex flex-wrap gap-2">
            {isGeminiAvailable() && (
              <button
                onClick={() => setShowDiscoverTrendsModal(true)}
                className={`${buttonClasses} bg-pastel-lavender-400 dark:bg-pastel-light-lavender-300 hover:bg-pastel-lavender-500 dark:hover:bg-pastel-light-lavender-400 text-pastel-gray-700 dark:text-pastel-deep-blue-900`}
              >
                <FireIcon className="w-4 h-4 mr-1 sm:mr-2" />
                Discover Trends
              </button>
            )}
             <button
              onClick={handleDownloadPlannerCSV}
              className={`${buttonClasses} bg-pastel-mint-400 dark:bg-pastel-light-mint-300 hover:bg-pastel-mint-500 dark:hover:bg-pastel-light-mint-300 text-pastel-gray-700 dark:text-pastel-deep-blue-900`}
              title="Download schedule as CSV"
            >
              <ArrowDownTrayIcon className="w-4 h-4 mr-1 sm:mr-2" />
              Download CSV
            </button>
            <button
              onClick={openSchedulerForm}
              className={buttonClasses}
            >
              <PlusCircleIcon className="w-5 h-5 mr-2" />
              Schedule Post
            </button>
          </div>
        )}
      </div>

      {viewState === ViewState.LIST && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
          <div className={statCardBaseClass}>
            <p className={statLabelClass}>Total Posts</p>
            <p className={statValueClass}>{plannerStats.totalPosts}</p>
          </div>
          <div className={statCardBaseClass}>
            <p className={statLabelClass}>Scheduled</p>
            <p className={statValueClass}>{plannerStats.currentlyScheduled}</p>
          </div>
          <div className={statCardBaseClass}>
            <p className={statLabelClass}>Next 7 Days</p>
            <p className={statValueClass}>{plannerStats.upcomingNext7Days}</p>
          </div>
          <div className={statCardBaseClass}>
            <p className={statLabelClass}>Posted</p>
            <p className={statValueClass}>{plannerStats.posted}</p>
          </div>
          <div className={statCardBaseClass}>
            <p className={statLabelClass}>Failed</p>
            <p className={statValueClass}>{plannerStats.failed}</p>
          </div>
        </div>
      )}

      {viewState === ViewState.LIST && (
        <div className={`mb-6 p-4 rounded-md bg-element-default dark:bg-element-dark flex flex-col sm:flex-row gap-4 items-center`}>
          <div className="flex-grow w-full sm:w-auto">
            <label htmlFor="filterPlatform" className={`block text-sm font-medium mb-1 text-muted-default dark:text-muted-dark`}>Filter by Platform:</label>
            <select
              id="filterPlatform"
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className={`${commonInputClasses} w-full`}
            >
              <option value="all">All Platforms</option>
              {platforms.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="flex-grow w-full sm:w-auto">
            <label htmlFor="filterStatus" className={`block text-sm font-medium mb-1 text-muted-default dark:text-muted-dark`}>Filter by Status:</label>
            <select
              id="filterStatus"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`${commonInputClasses} w-full`}
            >
              <option value="all">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="posted">Posted</option>
              <option value="failed">Failed</option>
              <option value="draft">Draft</option>
              <option value="pending_review">Pending Review</option>
            </select>
          </div>
        </div>
      )}

      <Modal 
        isOpen={viewState === ViewState.ADD} 
        onClose={closeSchedulerForm} 
        title={editingPost ? "Edit Scheduled Post" : "Schedule New Post"}
        darkMode={darkMode}
      >
        <PostSchedulerForm
          platforms={platforms}
          onSave={editingPost ? handleUpdatePost : handleAddPost}
          onCancel={closeSchedulerForm}
          initialPost={editingPost}
          darkMode={darkMode}
          addToast={addToast} 
        />
      </Modal>

      <Modal isOpen={showDiscoverTrendsModal} onClose={() => setShowDiscoverTrendsModal(false)} title="Discover Trends with AI" darkMode={darkMode}>
        <div className="space-y-3">
          <div>
            <label htmlFor="platformForTrends" className={`block text-sm font-medium text-muted-default dark:text-muted-dark mb-1`}>Platform:</label>
            <select 
              id="platformForTrends" 
              value={selectedPlatformForTrends} 
              onChange={(e) => setSelectedPlatformForTrends(e.target.value)}
              className={`${commonInputClasses} w-full`}
            >
              {DEFAULT_PLATFORMS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
           <div>
            <label htmlFor="nicheForTrends" className={`block text-sm font-medium text-muted-default dark:text-muted-dark mb-1`}>Your Niche/Topic:</label>
            <input 
                type="text" 
                id="nicheForTrends" 
                value={nicheForTrends} 
                onChange={e => setNicheForTrends(e.target.value)} 
                className={`${commonInputClasses} w-full`}
                placeholder="e.g., Sustainable Fashion, AI in Healthcare"
            />
          </div>
          <button
            onClick={fetchTrendingTopicsForModal}
            disabled={trendsLoading || !selectedPlatformForTrends || !nicheForTrends.trim()}
            className={`w-full flex items-center justify-center ${buttonClasses} bg-pastel-lavender-400 dark:bg-pastel-light-lavender-300 hover:bg-pastel-lavender-500 dark:hover:bg-pastel-light-lavender-400 text-pastel-gray-700 dark:text-pastel-deep-blue-900 disabled:opacity-50`}
          >
            {trendsLoading ? <LoadingSpinner size="sm" darkMode={!darkMode} /> : <><FireIcon className="w-4 h-4 mr-2" /> Discover Trends</>}
          </button>
          {trendsError && <p className="text-sm text-negative-default dark:text-negative-dark">{trendsError}</p>}
          {trendingTopics.length > 0 && (
            <div className="mt-4 max-h-60 overflow-y-auto space-y-2">
              <h4 className={`text-md font-semibold text-base-default dark:text-base-dark`}>Trending Topics:</h4>
              {trendingTopics.map((trend, index) => (
                <div key={index} className={`p-2 rounded bg-element-default dark:bg-element-dark`}>
                  <p className={`font-semibold text-button-accent-default dark:text-button-accent-dark`}>{trend.topic}</p>
                  {trend.reason && <p className={`text-xs text-muted-default dark:text-muted-dark`}><em>Reason:</em> {trend.reason}</p>}
                  {trend.contentIdea && <p className={`text-xs text-base-default dark:text-base-dark`}><em>Idea:</em> {trend.contentIdea}</p>}
                </div>
              ))}
            </div>
          )}
           {!isGeminiAvailable() && <p className={`text-sm text-yellow-500 dark:text-yellow-400`}>AI features are disabled. Please set API_KEY.</p>}
        </div>
      </Modal>


      {viewState === ViewState.LIST && (
        <>
          {filteredAndSortedPosts.length === 0 ? (
            <div className={`text-center py-10 text-muted-default dark:text-muted-dark`}>
              <CalendarIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl">No posts match your filters, or none scheduled yet.</p>
              <p className="mt-1">Ready to plan your next big hit? Click "Schedule Post" to get started or adjust your filters!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedPosts.map(post => (
                <ScheduledPostItem
                  key={post.id}
                  post={post}
                  platforms={platforms}
                  onEdit={() => handleEditPost(post)}
                  onDelete={() => handleDeletePost(post.id)}
                  onUpdateStatus={handleUpdateStatus} 
                  darkMode={darkMode}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};