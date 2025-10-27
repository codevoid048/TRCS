"use client";

import React, { useState, useEffect } from 'react';
import OfferPopup from './OfferPopup';
import { HOMEPAGE_POPUPS, POPUP_SETTINGS, type PopupConfig } from './popup-config';

const HomepageOfferManager: React.FC = () => {
  const [activePopup, setActivePopup] = useState<PopupConfig | null>(null);

  useEffect(() => {
    // Return early if popups are disabled
    if (!POPUP_SETTINGS.ENABLED) return;

    // Check which popup should be shown based on priority and dismissal status
    const checkPopupToShow = () => {
      const today = new Date().toDateString();
      
      // Filter active popups that haven't been dismissed
      const availablePopups = HOMEPAGE_POPUPS
        .filter(popup => popup.isActive)
        .filter(popup => {
          const dismissKey = `offer-popup-dismissed-${popup.id}`;
          
          if (POPUP_SETTINGS.REMEMBER_DISMISSAL === 'session') {
            return !sessionStorage.getItem(dismissKey);
          } else if (POPUP_SETTINGS.REMEMBER_DISMISSAL === 'day') {
            return localStorage.getItem(dismissKey) !== today;
          }
          return true;
        })
        .sort((a, b) => b.priority - a.priority); // Sort by priority (highest first)

      // Show the highest priority popup that hasn't been dismissed
      if (availablePopups.length > 0) {
        setActivePopup(availablePopups[0]);
      }
    };

    // Wait for initial delay before checking popups
    const timer = setTimeout(checkPopupToShow, POPUP_SETTINGS.INITIAL_DELAY);
    return () => clearTimeout(timer);
  }, []);

  const handlePopupClose = () => {
    if (!activePopup) return;

    // Remember dismissal based on settings
    const dismissKey = `offer-popup-dismissed-${activePopup.id}`;
    
    if (POPUP_SETTINGS.REMEMBER_DISMISSAL === 'session') {
      sessionStorage.setItem(dismissKey, 'true');
    } else if (POPUP_SETTINGS.REMEMBER_DISMISSAL === 'day') {
      const today = new Date().toDateString();
      localStorage.setItem(dismissKey, today);
    } else if (POPUP_SETTINGS.REMEMBER_DISMISSAL === 'week') {
      const today = new Date().toISOString();
      localStorage.setItem(dismissKey, today);
    }

    setActivePopup(null);
  };

  const handleButtonAction = () => {
    if (!activePopup) return;

    // Handle different action types
    if (activePopup.targetUrl) {
      window.location.href = activePopup.targetUrl;
    } else if (activePopup.scrollToSection) {
      const section = document.querySelector(`[data-section="${activePopup.scrollToSection}"]`);
      section?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Only render if there's an active popup
  if (!activePopup) return null;

  return (
    <OfferPopup
      variant={activePopup.variant}
      position={POPUP_SETTINGS.DEFAULT_POSITION}
      title={activePopup.title}
      description={activePopup.description}
      buttonText={activePopup.buttonText}
      buttonAction={handleButtonAction}
      discountPercent={activePopup.discountPercent}
      showDelay={activePopup.showDelay}
      autoCloseDelay={activePopup.autoCloseDelay}
      onClose={handlePopupClose}
    />
  );
};

export default HomepageOfferManager;