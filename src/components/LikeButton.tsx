import { useState } from 'react';

interface LikeButtonProps {
  likesCount: number;
  isLiked: boolean;
  onLike?: () => Promise<void>;
  onUnlike?: () => Promise<void>;
  disabled?: boolean;
}

const LikeButton = ({
  likesCount,
  isLiked,
  onLike,
  onUnlike,
  disabled = false
}: LikeButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (disabled || isLoading) return;

    setIsLoading(true);
    try {
      if (isLiked) {
        if (onUnlike) await onUnlike();
      } else {
        if (onLike) await onLike();
      }
    } catch (error) {
      console.error('いいね処理エラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={`like-button ${isLiked ? 'liked' : ''} ${isLoading ? 'loading' : ''}`}
      onClick={handleLikeClick}
      disabled={disabled || isLoading}
    >
      <span className="like-icon">
        {isLiked ? (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="#E0245E">
            <g>
              <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z"></path>
            </g>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <g>
              <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"></path>
            </g>
          </svg>
        )}
      </span>
      <span className="like-count">{likesCount}</span>
    </button>
  );
};

export default LikeButton;