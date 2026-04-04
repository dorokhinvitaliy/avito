import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import styles from './BackLink.module.css';

interface BackLinkProps {
  to: string;
  children: ReactNode;
}

export function BackLink({ to, children }: BackLinkProps) {
  return (
    <Link to={to} className={styles.backLink}>
      <ArrowLeft size={14} /> {children}
    </Link>
  );
}
