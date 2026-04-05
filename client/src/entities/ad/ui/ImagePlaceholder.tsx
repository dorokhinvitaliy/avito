import styles from './ImagePlaceholder.module.css';

interface ImagePlaceholderProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function ImagePlaceholder({ size = 'medium', className = '' }: ImagePlaceholderProps) {
  return (
    <div className={`${styles.placeholder} ${size !== 'medium' ? styles[size] : ''} ${className}`}>
      <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="3" width="20" height="18" rx="2" stroke="#9ca3af" strokeWidth="1.5" />
        <circle cx="8.5" cy="9.5" r="2" stroke="#9ca3af" strokeWidth="1.5" />
        <path
          d="M2 17l4.586-4.586a2 2 0 012.828 0L14 17"
          stroke="#9ca3af"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M13 15l1.586-1.586a2 2 0 012.828 0L22 18"
          stroke="#9ca3af"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
