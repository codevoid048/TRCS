"use client";

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface OfferPopupProps {
  variant?: 'discount' | 'welcome' | 'flash-sale' | 'special-offer';
  position?: 'bottom-left' | 'bottom-right';
  title: string;
  description: string;
  buttonText?: string;
  buttonAction?: () => void;
  discountPercent?: number;
  showDelay?: number; // delay in milliseconds before showing
  autoCloseDelay?: number; // auto close after milliseconds
  onClose?: () => void;
  className?: string;
}

const variantConfig = {
  discount: {
    textColor: 'text-gray-900 dark:text-white',
    buttonColor: 'bg-brown-primary text-brown-light hover:bg-brown-dark',
    discountBadge: 'bg-green-500 text-white',
  },
  welcome: {
    textColor: 'text-gray-900 dark:text-white',
    buttonColor: 'bg-brown-primary text-white hover:bg-brown-dark',
    discountBadge: 'bg-brown-secondary text-brown-dark',
  },
  'flash-sale': {
    textColor: 'text-gray-900 dark:text-white',
    buttonColor: 'bg-brown-primary text-brown-light hover:bg-brown-dark',
    discountBadge: 'bg-red-500 text-white',
  },
  'special-offer': {
    textColor: 'text-gray-900 dark:text-white',
    buttonColor: 'bg-brown-primary text-brown-light hover:bg-brown-dark',
    discountBadge: 'bg-purple-500 text-white',
  },
};

const OfferPopup: React.FC<OfferPopupProps> = ({
  variant = 'discount',
  position = 'bottom-right',
  title,
  description,
  buttonText = 'Claim Offer',
  buttonAction,
  discountPercent,
  showDelay = 3000,
  autoCloseDelay,
  onClose,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const config = variantConfig[variant];

  const positionClasses = {
    'bottom-left': 'bottom-1 left-1 sm:bottom-2 sm:left-2',
    'bottom-right': 'bottom-1 right-1 sm:bottom-2 sm:right-2',
  };

  useEffect(() => {
    // Show popup after delay
    const showTimer = setTimeout(() => {
      setIsVisible(true);
      setIsAnimating(true);
    }, showDelay);

    // Auto close if specified
    let autoCloseTimer: NodeJS.Timeout;
    if (autoCloseDelay) {
      autoCloseTimer = setTimeout(() => {
        handleClose();
      }, showDelay + autoCloseDelay);
    }

    return () => {
      clearTimeout(showTimer);
      if (autoCloseTimer) clearTimeout(autoCloseTimer);
    };
  }, [showDelay, autoCloseDelay]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  const handleButtonClick = () => {
    buttonAction?.();
    handleClose();
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed z-50 transform transition-all duration-300 ease-in-out',
        'w-[240px] sm:w-[280px] max-w-[calc(100vw-1rem)]',
        positionClasses[position],
        isAnimating
          ? 'translate-y-0 opacity-100 scale-100'
          : position === 'bottom-left'
          ? 'translate-x-[-100%] opacity-0 scale-95'
          : 'translate-x-[100%] opacity-0 scale-95',
        className
      )}
    >
      {/* Animated golden border container */}
      <div className="relative p-1 rounded-lg shadow-lg" style={{
        background: 'linear-gradient(90deg, #FFD700 0%, #FFD700 25%, transparent 50%, transparent 75%, #FFD700 100%)',
        backgroundSize: '300% 300%',
        animation: 'gradient-x 2s linear infinite'
      }}>
        {/* Static golden border base */}
        <div className="absolute inset-0 rounded-lg" style={{
          background: 'linear-gradient(45deg, #B8860B, #DAA520)',
          opacity: 0.3
        }}></div>
        {/* Inner container with transparent background */}
        <div className="relative rounded-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm overflow-hidden h-full flex flex-col">
          {/* Close button */}
          <button
            onClick={handleClose}
            className={cn(
              'absolute top-2 right-2 w-6 h-6 rounded-sm transition-all duration-200',
              'bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20',
              'flex items-center justify-center'
            )}
          >
            <X className={cn('h-3 w-3', config.textColor)} />
          </button>

          {/* Content */}
          <div className="p-4 pr-8 flex-1 flex flex-col justify-center">
            {/* Description */}
            <p className={cn('text-sm leading-relaxed mb-4 text-center', config.textColor)}>
              {description}
            </p>
            
            {/* Action button */}
            <button
              onClick={handleButtonClick}
              className={cn(
                'w-full px-4 py-3 rounded-md text-sm font-medium transition-all duration-200',
                'transform hover:scale-105 active:scale-95',
                config.buttonColor
              )}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferPopup;