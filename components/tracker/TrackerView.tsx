
import React, { useState, useCallback } from 'react';
import { TrackedAccount, SocialPlatform, ViewState, TrackedPostItem, ToastMessage } from '../../types';
import { TrackedItemForm } from './TrackedItemForm';
import { TrackedAccountCard } from './TrackedAccountCard';
import Modal from '../common/Modal';
import { PlusCircleIcon, ChartBarIcon } from '../common/Icons';

interface TrackerViewProps {
  trackedAccounts: TrackedAccount[];
  setTrackedAccounts: React.Dispatch<React.SetStateAction<TrackedAccount[]>>;
  platforms: SocialPlatform[];
  darkMode?: boolean;
  addToast: (message: string, type?: ToastMessage['type']) => void;
}

export const TrackerView: React.FC<TrackerViewProps> = ({ trackedAccounts, setTrackedAccounts, platforms, darkMode, addToast }) => {
  const [viewState, setViewState] = useState<ViewState>(ViewState.LIST);
  const [editingAccount, setEditingAccount] = useState<TrackedAccount | null>(null); 
  const [editingPost, setEditingPost] = useState<{account: TrackedAccount, post: TrackedPostItem | null} | null>(null); 


  const handleAddOrUpdateAccount = useCallback((accountData: Pick<TrackedAccount, 'platformId' | 'usernameOrProfileLink' | 'id'>) => {
    if (editingAccount) { 
      setTrackedAccounts(prev => prev.map(acc => acc.id === editingAccount.id ? { ...acc, ...accountData } : acc));
      addToast('Account updated successfully!', 'success');
    } else { 
      const newAccount: TrackedAccount = {
        ...accountData,
        id: Date.now().toString() + Math.random().toString(36).substring(2,9),
        posts: [],
      };
      setTrackedAccounts(prev => [...prev, newAccount]);
      addToast('Account added for tracking!', 'success');
    }
    setViewState(ViewState.LIST);
    setEditingAccount(null);
  }, [setTrackedAccounts, editingAccount, addToast]);
  
  const handleAddOrUpdatePost = useCallback((accountId: string, postData: TrackedPostItem) => {
    setTrackedAccounts(prevAccounts =>
      prevAccounts.map(acc => {
        if (acc.id === accountId) {
          const existingPostIndex = acc.posts.findIndex(p => p.id === postData.id);
          let updatedPosts: TrackedPostItem[];
          if (existingPostIndex > -1) { 
            updatedPosts = acc.posts.map((p, index) => index === existingPostIndex ? postData : p);
            addToast('Post metrics updated!', 'success');
          } else { 
             const newPostWithId = { ...postData, id: Date.now().toString() + Math.random().toString(36).substring(2,9) };
            updatedPosts = [...acc.posts, newPostWithId];
            addToast('New post added for tracking!', 'success');
          }
          return { ...acc, posts: updatedPosts };
        }
        return acc;
      })
    );
    setViewState(ViewState.LIST);
    setEditingPost(null);
  }, [setTrackedAccounts, addToast]);


  const handleDeleteAccount = useCallback((accountId: string) => {
    setTrackedAccounts(prev => prev.filter(acc => acc.id !== accountId));
    addToast('Account removed from tracking.', 'info');
  }, [setTrackedAccounts, addToast]);

  const handleDeletePost = useCallback((accountId: string, postId: string) => {
    setTrackedAccounts(prev => prev.map(acc => {
      if (acc.id === accountId) {
        return { ...acc, posts: acc.posts.filter(p => p.id !== postId) };
      }
      return acc;
    }));
    addToast('Post removed from tracking.', 'info');
  }, [setTrackedAccounts, addToast]);
  
  const openAddAccountForm = () => {
    setEditingAccount(null);
    setEditingPost(null);
    setViewState(ViewState.ADD);
  };

  const openEditAccountForm = (account: TrackedAccount) => {
    setEditingAccount(account);
    setEditingPost(null); 
    setViewState(ViewState.ADD); 
  };

  const openAddPostToAccountForm = (account: TrackedAccount) => {
    setEditingAccount(null); 
    setEditingPost({account, post: null}); 
    setViewState(ViewState.ADD);
  };
  
  const openEditPostForm = (account: TrackedAccount, post: TrackedPostItem) => {
    setEditingAccount(null);
    setEditingPost({account, post});
    setViewState(ViewState.ADD);
  };

  const closeModal = () => {
    setViewState(ViewState.LIST);
    setEditingAccount(null);
    setEditingPost(null);
  };
  
  const buttonClasses = `flex items-center bg-button-accent-default dark:bg-button-accent-dark hover:bg-button-accent-hover-default dark:hover:bg-button-accent-hover-dark text-on-button-accent-default dark:text-on-button-accent-dark font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out`;

  return (
    <div className="bg-page-default dark:bg-page-dark text-base-default dark:text-base-dark p-0 sm:p-4 rounded-lg"> {/* Adjusted padding */}
      <div className={`bg-card-default dark:bg-card-dark p-4 sm:p-6 rounded-lg shadow-lg`}> {/* Moved card styling to inner div */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
          <h2 className="text-2xl font-semibold flex items-center text-base-default dark:text-base-dark">
            <ChartBarIcon className={`w-7 h-7 mr-2 text-accent-highlight-default dark:text-accent-highlight-dark`} />
            Performance Tracker
          </h2>
          {viewState === ViewState.LIST && (
            <button
              onClick={openAddAccountForm}
              className={buttonClasses}
            >
              <PlusCircleIcon className="w-5 h-5 mr-2" />
              Track New Account/Post
            </button>
          )}
        </div>

        <Modal 
          isOpen={viewState === ViewState.ADD} 
          onClose={closeModal} 
          title={editingPost ? (editingPost.post ? "Edit Tracked Post" : "Add New Post to Track") : (editingAccount ? "Edit Tracked Account" : "Add Account/Post to Track")}
          darkMode={darkMode}
        >
          <TrackedItemForm
            platforms={platforms}
            onSaveAccount={handleAddOrUpdateAccount}
            onSavePost={handleAddOrUpdatePost}
            onCancel={closeModal}
            initialAccount={editingAccount}
            accountForPost={editingPost?.account} 
            initialPost={editingPost?.post}
            darkMode={darkMode}
          />
        </Modal>

        {viewState === ViewState.LIST && (
          <>
            {trackedAccounts.length === 0 ? (
              <div className={`text-center py-10 text-muted-default dark:text-muted-dark`}>
                <ChartBarIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-xl">Nothing is being tracked yet.</p>
                <p className="mt-1">Keep an eye on your social growth! Click "Track New Account/Post" to begin.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {trackedAccounts.map(account => (
                  <TrackedAccountCard
                    key={account.id}
                    account={account}
                    platforms={platforms}
                    onEditAccount={() => openEditAccountForm(account)}
                    onDeleteAccount={() => handleDeleteAccount(account.id)}
                    onAddPost={() => openAddPostToAccountForm(account)}
                    onEditPost={(post) => openEditPostForm(account, post)}
                    onDeletePost={(postId) => handleDeletePost(account.id, postId)}
                    darkMode={darkMode}
                    addToast={addToast}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div> {/* End of inner card div */}
      <div className={`mt-6 p-4 rounded-lg shadow-lg bg-card-default dark:bg-card-dark text-base-default dark:text-base-dark border border-card-default dark:border-card-dark`}>
          <strong>Note:</strong> Actual social media data (likes, views, etc.) is not fetched automatically. Please input these metrics manually for each post you track. This tool helps you organize and analyze the data you provide.
      </div>
    </div>
  );
};
