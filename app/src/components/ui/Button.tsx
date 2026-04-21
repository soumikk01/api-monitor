import React from 'react';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}
export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, ...props }) => (
  <button data-variant={variant} {...props}>{children}</button>
);
