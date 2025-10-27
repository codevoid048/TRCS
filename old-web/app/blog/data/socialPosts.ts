import { SocialPost } from '../components/SocialMediaFeed';

// Sample data - Replace with your actual social media posts
export const socialMediaPosts: SocialPost[] = [
  // YouTube Posts
  {
    id: 'yt-1',
    type: 'youtube',
    title: 'Latest Bicycle Collection 2024 - The Raja Cycle Stores',
    description: 'Check out our newest collection of bicycles perfect for all ages and terrains.',
    url: 'https://youtu.be/gloXvahnCS4',
    videoId: 'gloXvahnCS4',
    publishedAt: '2024-01-15T10:00:00Z',
    channelName: 'The Raja Cycle Stores',
    isVideo: true
  },
  {
    id: 'yt-2',
    type: 'youtube',
    title: 'Bicycle Maintenance Tips - Expert Guide',
    description: 'Learn how to maintain your bicycle like a pro with our expert tips.',
    url: 'https://youtu.be/gloXvahnCS4',
    videoId: 'gloXvahnCS4',
    publishedAt: '2024-01-10T15:30:00Z',
    channelName: 'The Raja Cycle Stores',
    isVideo: true
  },
  
  // Instagram Posts
  {
    id: 'ig-1',
    type: 'instagram',
    caption: 'New arrivals! 🚴‍♂️ Check out these amazing mountain bikes perfect for adventure seekers. Visit our store today! #bicycles #mountainbike #cycling',
    url: 'https://www.instagram.com/reel/DOIkfYpkw7Z/?igsh=MWEzM3owNG11eDk3Yw==', // Replace with actual Instagram post URL
    publishedAt: '2024-01-12T09:00:00Z',
    username: 'therajacyclestores'
  },
  {
    id: 'ig-2',
    type: 'instagram',
    caption: 'Customer satisfaction is our priority! 😊 Another happy customer with their new ride. Thank you for choosing us! 🙏 #customerlove #bicycles #happycustomer',
    url: 'https://www.instagram.com/reel/DOIkfYpkw7Z/?igsh=MWEzM3owNG11eDk3Yw==', // Replace with actual Instagram post URL
    publishedAt: '2024-01-08T14:20:00Z',
    username: 'therajacyclestores'
  },
  
  // Facebook Posts
  {
    id: 'fb-1',
    type: 'facebook',
    caption: 'Special discount this weekend! Get up to 20% off on selected bicycles. Visit Raja Cycles now!',
    url: 'https://www.facebook.com/reel/744391915090774/?mibextid=rS40aB7S9Ucbxw6v', // Replace with actual Facebook post URL
    publishedAt: '2024-01-14T11:00:00Z',
    pageOrUserName: 'Raja Cycles'
  },
  {
    id: 'fb-2',
    type: 'facebook',
    caption: 'Thank you to everyone who attended our bicycle safety workshop! Safety first, cycling always. See you at the next event!',
    url: 'https://www.facebook.com/reel/744391915090774/?mibextid=rS40aB7S9Ucbxw6v', // Replace with actual Facebook post URL
    publishedAt: '2024-01-07T16:45:00Z',
    pageOrUserName: 'Raja Cycles'
  }
];

// Function to get posts by platform
export const getPostsByPlatform = (platform: 'youtube' | 'instagram' | 'facebook'): SocialPost[] => {
  return socialMediaPosts.filter(post => post.type === platform);
};

// Function to get recent posts (last 30 days)
export const getRecentPosts = (days: number = 30): SocialPost[] => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return socialMediaPosts.filter(post => 
    new Date(post.publishedAt) >= cutoffDate
  ).sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
};

// Function to search posts
export const searchPosts = (query: string): SocialPost[] => {
  const searchTerm = query.toLowerCase();
  
  return socialMediaPosts.filter(post =>
    (post.title?.toLowerCase().includes(searchTerm)) ||
    (post.caption?.toLowerCase().includes(searchTerm)) ||
    (post.description?.toLowerCase().includes(searchTerm))
  );
};

// Function to get all posts sorted by date
export const getAllPostsSorted = (): SocialPost[] => {
  return [...socialMediaPosts].sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
};
