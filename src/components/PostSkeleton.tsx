import '../styles/PostSkeleton.css';

interface PostSkeletonProps {
  count?: number;
}

const PostSkeleton = ({ count = 3 }: PostSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div className="post-skeleton" key={index}>
          <div className="post-skeleton-header">
            <div className="post-skeleton-avatar"></div>
            <div className="post-skeleton-user-info">
              <div className="post-skeleton-name"></div>
              <div className="post-skeleton-username"></div>
            </div>
          </div>
          <div className="post-skeleton-content">
            <div className="post-skeleton-text"></div>
            <div className="post-skeleton-text"></div>
            <div className="post-skeleton-text short"></div>
          </div>
          <div className="post-skeleton-actions">
            <div className="post-skeleton-action"></div>
            <div className="post-skeleton-action"></div>
            <div className="post-skeleton-action"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export default PostSkeleton;