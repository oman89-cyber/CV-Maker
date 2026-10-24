import React from 'react';
import { Link } from 'react-router-dom';
import './Button.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  to?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  to,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const classNames = [
    'cv-btn',
    `cv-btn--${variant}`,
    `cv-btn--${size}`,
    fullWidth ? 'cv-btn--full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {leftIcon && <span className="cv-btn__icon cv-btn__icon--left">{leftIcon}</span>}
      <span className="cv-btn__text">{children}</span>
      {rightIcon && <span className="cv-btn__icon cv-btn__icon--right">{rightIcon}</span>}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classNames} aria-label={props['aria-label']}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classNames} {...props}>
      {content}
    </button>
  );
};
