import React from 'react';
import './Badge.css';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'accent' | 'neutral' | 'success';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'accent',
  size = 'md',
  icon,
  className = '',
}) => {
  return (
    <span className={`cv-badge cv-badge--${variant} cv-badge--${size} ${className}`}>
      {icon && <span className="cv-badge__icon">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
