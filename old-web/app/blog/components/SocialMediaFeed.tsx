'use client';

import React, { useState, useEffect } from 'react';
import YouTubeEmbed from './YouTubeEmbed';
import InstagramEmbed from './InstagramEmbed';
import FacebookEmbed from './FacebookEmbed';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Youtube, Instagram, Facebook, Sparkles, TrendingUp, Calendar, Loader2 } from 'lucide-react';
import { PublicSocialPostsAPI } from '@/lib/api/socialPosts';
import type { SocialPost as APISocialPost } from '@/lib/api/socialPosts';

export interface SocialPost {
    id: string;
    type: 'youtube' | 'instagram' | 'facebook';
    title?: string;
    caption?: string;
    description?: string;
    url: string;
    embedUrl?: string;
    videoId?: string; // For YouTube
    publishedAt: string;
    username?: string;
    channelName?: string;
    pageOrUserName?: string;
    thumbnail?: string;
    isVideo?: boolean;
}

interface SocialMediaFeedProps {
    posts?: SocialPost[]; // Make optional since we'll fetch internally
    title?: string;
    showFilters?: boolean; // Keep for compatibility but not used in new design
    loading?: boolean;
    error?: string | null;
}

// Convert API social post to feed social post format
const convertAPIPostToFeedPost = (apiPost: APISocialPost): SocialPost => {
    return {
        id: apiPost._id,
        type: apiPost.type,
        url: apiPost.url,
        embedUrl: apiPost.embedUrl,
        videoId: apiPost.videoId,
        publishedAt: apiPost.createdAt,
        title: apiPost.type === 'youtube' ? 'YouTube Video' : undefined,
        username: apiPost.type === 'instagram' ? 'therajacyclestores' : undefined,
        channelName: apiPost.type === 'youtube' ? 'The Raja Cycle Stores' : undefined,
        pageOrUserName: apiPost.type === 'facebook' ? 'Raja Cycles' : undefined,
        isVideo: apiPost.type === 'youtube',
    };
};

const SocialMediaFeed: React.FC<SocialMediaFeedProps> = ({
    posts: propsPosts,
    title = "Latest Updates",
    showFilters = false, // Accept but ignore this prop
    loading: propsLoading = false,
    error: propsError = null
}) => {
    const [activeTab, setActiveTab] = useState('youtube');
    const [posts, setPosts] = useState<SocialPost[]>(propsPosts || []);
    const [loading, setLoading] = useState<{ [key: string]: boolean }>({
        youtube: false,
        instagram: false,
        facebook: false
    });
    const [error, setError] = useState<{ [key: string]: string | null }>({
        youtube: null,
        instagram: null,
        facebook: null
    });
    const [loadedPlatforms, setLoadedPlatforms] = useState<Set<string>>(new Set());

    // Fetch posts for specific platform
    const fetchPlatformPosts = async (platform: 'youtube' | 'instagram' | 'facebook') => {
        if (loadedPlatforms.has(platform) || loading[platform]) {
            return; // Already loaded or loading
        }

        setLoading(prev => ({ ...prev, [platform]: true }));
        setError(prev => ({ ...prev, [platform]: null }));

        try {
            const data = await PublicSocialPostsAPI.getPublicSocialPosts({ type: platform });
            const apiPosts = data?.socialPosts || [];
            const convertedPosts = apiPosts.map(convertAPIPostToFeedPost);

            setPosts(prev => {
                // Remove existing posts of this platform and add new ones
                const filteredPosts = prev.filter(p => p.type !== platform);
                return [...filteredPosts, ...convertedPosts];
            });

            setLoadedPlatforms(prev => new Set([...prev, platform]));
        } catch (error) {
            console.error(`Error fetching ${platform} posts:`, error);
            setError(prev => ({ 
                ...prev, 
                [platform]: `Failed to load ${platform} posts` 
            }));
        } finally {
            setLoading(prev => ({ ...prev, [platform]: false }));
        }
    };    // Load initial platform (YouTube) on mount
    useEffect(() => {
        if (!propsPosts) {
            fetchPlatformPosts('youtube');
        }
    }, [propsPosts]);

    // Handle tab change - fetch platform data if not already loaded
    const handleTabChange = (value: string) => {
        const platform = value as 'youtube' | 'instagram' | 'facebook';
        setActiveTab(platform);
        if (!propsPosts && !loadedPlatforms.has(platform)) {
            fetchPlatformPosts(platform);
        }
    };

    // Separate posts by platform
    const youtubePosts = posts.filter(post => post.type === 'youtube')
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    const instagramPosts = posts.filter(post => post.type === 'instagram')
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    const facebookPosts = posts.filter(post => post.type === 'facebook')
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    // Get posts for current tab
    const getCurrentPosts = () => {
        switch (activeTab) {
            case 'youtube':
                return youtubePosts;
            case 'instagram':
                return instagramPosts;
            case 'facebook':
                return facebookPosts;
            default:
                return instagramPosts; // Default to Instagram
        }
    };

    const currentPosts = getCurrentPosts();

    const renderYouTubePost = (post: SocialPost) => (
        <YouTubeEmbed
            key={post.id}
            videoId={post.videoId || ''}
            title={post.title || post.caption || 'YouTube Video'}
            description={post.description}
            redirectUrl={post.url}
            publishedAt={post.publishedAt}
            channelName={post.channelName}
        />
    );

    const renderInstagramPost = (post: SocialPost) => (
        <InstagramEmbed
            key={post.id}
            postUrl={post.url}
            caption={post.caption}
            publishedAt={post.publishedAt}
            username={post.username}
            hideComments={true}
        />
    );

    const renderFacebookPost = (post: SocialPost) => (
        <FacebookEmbed
            key={post.id}
            postUrl={post.url}
            caption={post.caption}
            publishedAt={post.publishedAt}
            pageOrUserName={post.pageOrUserName}
        />
    );

    const renderPost = (post: SocialPost) => {
        switch (post.type) {
            case 'youtube':
                return renderYouTubePost(post);
            case 'instagram':
                return renderInstagramPost(post);
            case 'facebook':
                return renderFacebookPost(post);
            default:
                return null;
        }
    };

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="text-center max-w-5xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary-main to-secondary-main bg-clip-text text-transparent mb-6 leading-tight">
                    {title}
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                    Follow our latest updates across all social media platforms and stay connected with our cycling community
                </p>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <div className="flex justify-center mb-12">
                    <TabsList className="inline-flex h-auto p-1 bg-muted/50 rounded-2xl shadow-lg border border-border/50">
                        <TabsTrigger 
                            value="youtube" 
                            className="group relative flex items-center gap-3 px-4 sm:px-6 py-4 data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl"
                        >
                            <div className="flex items-center gap-3">
                                <Youtube className="w-5 h-5 text-red-600 group-data-[state=active]:text-white transition-colors duration-300" />
                                <span className="font-semibold hidden sm:inline">YouTube</span>
                                {loading.youtube && (
                                    <span className="bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300 group-data-[state=active]:bg-white/20 group-data-[state=active]:text-white px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 hidden sm:inline">
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                    </span>
                                )}
                            </div>
                        </TabsTrigger>
                        <TabsTrigger 
                            value="instagram" 
                            className="group relative flex items-center gap-3 px-4 sm:px-6 py-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl"
                        >
                            <div className="flex items-center gap-3">
                                <Instagram className="w-5 h-5 text-pink-600 group-data-[state=active]:text-white transition-colors duration-300" />
                                <span className="font-semibold hidden sm:inline">Instagram</span>
                                {loading.instagram && (
                                    <span className="bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300 group-data-[state=active]:bg-white/20 group-data-[state=active]:text-white px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 hidden sm:inline">
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                    </span>
                                )}
                            </div>
                        </TabsTrigger>
                        <TabsTrigger 
                            value="facebook" 
                            className="group relative flex items-center gap-3 px-4 sm:px-6 py-4 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl"
                        >
                            <div className="flex items-center gap-3">
                                <Facebook className="w-5 h-5 text-blue-600 group-data-[state=active]:text-white transition-colors duration-300" />
                                <span className="font-semibold hidden sm:inline">Facebook</span>
                                {loading.facebook && (
                                    <span className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 group-data-[state=active]:bg-white/20 group-data-[state=active]:text-white px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 hidden sm:inline">
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                    </span>
                                )}
                            </div>
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* YouTube Tab */}
                <TabsContent value="youtube" className="space-y-8">
                    {loading.youtube ? (
                        <div className="text-center py-16">
                            <Loader2 className="w-8 h-8 text-red-600 mx-auto mb-4 animate-spin" />
                            <p className="text-gray-500 dark:text-gray-400">Loading YouTube videos...</p>
                        </div>
                    ) : error.youtube ? (
                        <div className="text-center py-16 max-w-2xl mx-auto">
                            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-8 border border-red-200 dark:border-red-800">
                                <Youtube className="w-12 h-12 text-red-600 mx-auto mb-4" />
                                <p className="text-red-600 dark:text-red-400 text-lg mb-2">
                                    {error.youtube}
                                </p>
                                <button 
                                    onClick={() => fetchPlatformPosts('youtube')}
                                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                                >
                                    Try again
                                </button>
                            </div>
                        </div>
                    ) : youtubePosts.length > 0 ? (
                        <>
                            <div className="text-center">
                                <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-2">
                                    YouTube Videos
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Watch our latest videos and tutorials
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center">
                                {youtubePosts.map(renderYouTubePost)}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-16 max-w-2xl mx-auto">
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8">
                                <Youtube className="w-12 h-12 text-red-600 mx-auto mb-4" />
                                <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                                    No posts found in this category.
                                </p>
                                <p className="text-gray-400 dark:text-gray-500 text-sm">
                                    Check back later for new video content.
                                </p>
                            </div>
                        </div>
                    )}
                </TabsContent>

                {/* Instagram Tab */}
                <TabsContent value="instagram" className="space-y-12">
                    <AnimatePresence mode="wait">
                    {loading.instagram ? (
                        <div className="text-center py-16">
                            <Loader2 className="w-8 h-8 text-pink-600 mx-auto mb-4 animate-spin" />
                            <p className="text-gray-500 dark:text-gray-400">Loading Instagram posts...</p>
                        </div>
                    ) : error.instagram ? (
                        <div className="text-center py-16 max-w-2xl mx-auto">
                            <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-8 border border-pink-200 dark:border-pink-800">
                                <Instagram className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                                <p className="text-pink-600 dark:text-pink-400 text-lg mb-2">
                                    {error.instagram}
                                </p>
                                <button 
                                    onClick={() => fetchPlatformPosts('instagram')}
                                    className="text-pink-600 hover:text-pink-700 text-sm font-medium"
                                >
                                    Try again
                                </button>
                            </div>
                        </div>
                    ) : instagramPosts.length > 0 ? (
                            <motion.div
                                key="instagram-content"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className="space-y-8"
                            >
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                    className="text-center"
                                >
                                    <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-pink-700 bg-clip-text text-transparent mb-4">
                                    Instagram Posts
                                </h3>
                                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                        Follow our latest photos, stories, and behind-the-scenes content
                                    </p>
                                </motion.div>
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center"
                                >
                                    {instagramPosts.map((post, index) => (
                                        <motion.div
                                            key={post.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                            whileHover={{ scale: 1.02, y: -5 }}
                                            className="w-full"
                                        >
                                            {renderInstagramPost(post)}
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="instagram-empty"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.5 }}
                                className="text-center py-20 max-w-2xl mx-auto"
                            >
                                <div className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-800/20 rounded-2xl p-12 border border-purple-200 dark:border-purple-800">
                                    <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                        <Instagram className="w-10 h-10 text-white" />
                            </div>
                                    <h4 className="text-2xl font-bold text-foreground mb-4">No posts found in this category.</h4>
                                    <p className="text-muted-foreground text-lg mb-6">
                                        We're preparing amazing visual content for you.
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Follow us for daily updates, cycling tips, and store highlights!
                                </p>
                            </div>
                            </motion.div>
                    )}
                    </AnimatePresence>
                </TabsContent>

                {/* Facebook Tab */}
                <TabsContent value="facebook" className="space-y-12">
                    <AnimatePresence mode="wait">
                    {loading.facebook ? (
                        <div className="text-center py-16">
                            <Loader2 className="w-8 h-8 text-blue-600 mx-auto mb-4 animate-spin" />
                            <p className="text-gray-500 dark:text-gray-400">Loading Facebook posts...</p>
                        </div>
                    ) : error.facebook ? (
                        <div className="text-center py-16 max-w-2xl mx-auto">
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8 border border-blue-200 dark:border-blue-800">
                                <Facebook className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                                <p className="text-blue-600 dark:text-blue-400 text-lg mb-2">
                                    {error.facebook}
                                </p>
                                <button 
                                    onClick={() => fetchPlatformPosts('facebook')}
                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                    Try again
                                </button>
                            </div>
                        </div>
                    ) : facebookPosts.length > 0 ? (
                            <motion.div
                                key="facebook-content"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className="space-y-8"
                            >
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                    className="text-center"
                                >
                                    <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-4">
                                    Facebook Posts
                                </h3>
                                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                        Stay updated with our latest news, events, and community highlights
                                    </p>
                                </motion.div>
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center"
                                >
                                    {facebookPosts.map((post, index) => (
                                        <motion.div
                                            key={post.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                            whileHover={{ scale: 1.02, y: -5 }}
                                            className="w-full"
                                        >
                                            {renderFacebookPost(post)}
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="facebook-empty"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.5 }}
                                className="text-center py-20 max-w-2xl mx-auto"
                            >
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-12 border border-blue-200 dark:border-blue-800">
                                    <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                        <Facebook className="w-10 h-10 text-white" />
                            </div>
                                    <h4 className="text-2xl font-bold text-foreground mb-4">No posts found in this category.</h4>
                                    <p className="text-muted-foreground text-lg mb-6">
                                        We're building our community presence.
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Join our Facebook community for news, events, and cycling discussions!
                                </p>
                            </div>
                            </motion.div>
                    )}
                    </AnimatePresence>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default SocialMediaFeed;
