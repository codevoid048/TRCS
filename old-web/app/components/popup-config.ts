// Homepage Offer Popup Configuration
// This file contains the configuration for all homepage offer popups

export interface PopupConfig {
  id: string;
  variant: 'discount' | 'welcome' | 'flash-sale' | 'special-offer';
  title: string;
  description: string;
  buttonText: string;
  discountPercent?: number;
  showDelay: number; // in milliseconds
  autoCloseDelay?: number; // in milliseconds  
  priority: number; // Higher = shown first
  isActive: boolean;
  targetUrl?: string;
  scrollToSection?: string;
}

export const HOMEPAGE_POPUPS: PopupConfig[] = [
  {
    id: 'welcome-discount',
    variant: 'welcome',
    title: 'Welcome to TRC Stores!',
    description: 'Get exclusive 15% off on your first bicycle purchase. Premium quality guaranteed!',
    buttonText: 'Shop Bicycles',
    discountPercent: 15,
    showDelay: 2000, // Show after 2 seconds
    autoCloseDelay: 15000, // Auto close after 15 seconds
    priority: 3,
    isActive: true,
    scrollToSection: 'categories'
  },
  
  {
    id: 'flash-sale',
    variant: 'flash-sale',
    title: 'Flash Sale Alert!',
    description: 'Mountain bikes starting at ₹15,000. Limited time offer - only 24 hours left!',
    buttonText: 'View Deals',
    discountPercent: 25,
    showDelay: 5000, // Show after 5 seconds
    autoCloseDelay: 20000, // Auto close after 20 seconds
    priority: 5, // Highest priority
    isActive: true,
    targetUrl: '/cycles?category=mountain'
  },

  {
    id: 'free-delivery',
    variant: 'special-offer',
    title: 'Free Home Delivery',
    description: 'Free delivery on all bicycle orders above ₹10,000. No hidden charges!',
    buttonText: 'Explore Collection',
    showDelay: 8000, // Show after 8 seconds
    autoCloseDelay: 12000, // Auto close after 12 seconds
    priority: 2,
    isActive: true,
    scrollToSection: 'featured'
  },

  {
    id: 'seasonal-discount',
    variant: 'discount',
    title: 'Seasonal Sale',
    description: 'Up to 30% off on kids bicycles and accessories. Perfect for young riders!',
    buttonText: 'Shop Kids Bikes',
    discountPercent: 30,
    showDelay: 12000, // Show after 12 seconds
    priority: 4,
    isActive: true,
    targetUrl: '/cycles?category=kids'
  },

  // Additional popup examples you can activate:
  
  {
    id: 'assembly-service',
    variant: 'special-offer',
    title: 'Free Assembly Service',
    description: 'Professional bicycle assembly at your doorstep. No extra charges!',
    buttonText: 'Learn More',
    showDelay: 10000,
    priority: 1,
    isActive: false, // Set to true to activate
    scrollToSection: 'featured'
  },

  {
    id: 'accessories-deal',
    variant: 'discount',
    title: 'Accessories Combo',
    description: 'Buy any bicycle and get 40% off on helmets & accessories!',
    buttonText: 'View Combo Deals',
    discountPercent: 40,
    showDelay: 6000,
    priority: 3,
    isActive: false, // Set to true to activate
    targetUrl: '/cycles?combo=accessories'
  }
];

// Popup display settings
export const POPUP_SETTINGS = {
  // How long to wait before showing any popup (milliseconds)
  INITIAL_DELAY: 1000,
  
  // Maximum number of popups to show per session
  MAX_POPUPS_PER_SESSION: 1,
  
  // Remember dismissed popups for how long? ('session' | 'day' | 'week')
  REMEMBER_DISMISSAL: 'session' as 'session' | 'day' | 'week',
  
  // Default position for all popups
  DEFAULT_POSITION: 'bottom-right' as const,
  
  // Enable/disable all popups
  ENABLED: true
};