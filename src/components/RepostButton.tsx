import { useState } from 'react';
import { repostPost, unrepostPost } from '../api/reposts';

interface RepostButtonProps {
  postId: number;
  initialReposted: boolean;
  initialCount: number;
  onRepostChange?: (reposted: boolean, count: number) => void;
}

const RepostButton = ({ postId, initialReposted, initialCount, onRepostChange }: RepostButtonProps) => {
  const [reposted, setReposted] = useState(initialReposted);
  const [repostsCount, setRepostsCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);

  const handleRepost = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    setIsLoading(true);
    try {
      if (reposted) {
        const result = await unrepostPost(postId);
        setReposted(false);
        setRepostsCount(result.reposts_count);
        onRepostChange?.(false, result.reposts_count);
      } else {
        const result = await repostPost(postId);
        setReposted(true);
        setRepostsCount(result.reposts_count);
        onRepostChange?.(true, result.reposts_count);
      }
    } catch (error) {
      console.error('Failed to toggle repost:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={`repost-button ${reposted ? 'reposted' : ''}`}
      onClick={handleRepost}
      disabled={isLoading}
      aria-label={reposted ? 'Unrepost' : 'Repost'}
    >
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill={reposted ? '#00ba7c' : 'currentColor'}
      >
        <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"/>
      </svg>
      {repostsCount > 0 && <span className="count">{repostsCount}</span>}
    </button>
  );
};

export default RepostButton;