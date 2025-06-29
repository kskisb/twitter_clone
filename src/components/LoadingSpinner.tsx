import '../styles/LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  fullPage?: boolean;
}

const LoadingSpinner = ({
  size = 'medium',
  text = '読み込み中...',
  fullPage = false
}: LoadingSpinnerProps) => {
  return (
    <div className={`loading-container ${fullPage ? 'full-page' : ''}`}>
      <div className={`loading-spinner ${size}`}>
        <svg viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="14" fill="none"></circle>
        </svg>
      </div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;