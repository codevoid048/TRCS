'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ExternalLink, Facebook, Calendar, User, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface FacebookEmbedProps {
    postUrl: string;
    width?: number;
    height?: number;
    caption?: string;
    publishedAt?: string;
    pageOrUserName?: string;
}

const FacebookEmbed: React.FC<FacebookEmbedProps> = ({
    postUrl,
    caption,
    publishedAt,
    pageOrUserName
}) => {
    const handleRedirect = () => {
        window.open(postUrl, '_blank', 'noopener,noreferrer');
    };

    // Check if it's a video/reel URL
    const isVideoUrl = postUrl.includes('/reel/') || postUrl.includes('/videos/') || postUrl.includes('/watch');

    // Extract video ID from Facebook URL
    const getVideoId = (url: string) => {
        const reelMatch = url.match(/\/reel\/([0-9]+)/);
        const videoMatch = url.match(/\/videos\/([0-9]+)/);
        const watchMatch = url.match(/[?&]v=([0-9]+)/);

        return reelMatch?.[1] || videoMatch?.[1] || watchMatch?.[1] || '';
    };

    const videoId = getVideoId(postUrl);

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -8 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md mx-auto"
        >
            <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-900/10 dark:to-gray-900">
                <CardHeader className="p-0 relative group">
                    {isVideoUrl ? (
                        // Try multiple Facebook embed approaches
                        <div className="relative bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20" style={{ minHeight: '400px', width: '100%', overflow: 'visible' }}>
                            {/* Primary approach: Direct Facebook video embed */}
                            <iframe
                                src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(postUrl)}&show_text=false&width=500&height=400`}
                                width="100%"
                                height="400"
                                style={{
                                    border: 'none',
                                    overflow: 'visible',
                                    display: 'block',
                                    minHeight: '400px'
                                }}
                                scrolling="no"
                                frameBorder="0"
                                allowFullScreen
                                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                                title={`Facebook video by ${pageOrUserName || 'Raja Cycles'}`}
                                className="rounded-t-lg w-full"
                                onLoad={(e) => {
                                    // Hide loading overlay when video loads
                                    const overlay = e.currentTarget.parentElement?.querySelector('.loading-overlay');
                                    if (overlay) {
                                        (overlay as HTMLElement).style.display = 'none';
                                    }
                                }}
                                onError={(e) => {
                                    // Fallback: try alternative embed URL
                                    const iframe = e.target as HTMLIFrameElement;
                                    iframe.src = `https://www.facebook.com/video/embed?video_id=${videoId || postUrl.split('/').pop()}`;
                                }}
                            />

                            {/* Loading overlay */}
                            <div className="loading-overlay absolute inset-0 flex items-center justify-center bg-blue-100/80 dark:bg-blue-900/20 rounded-t-lg">
                                <div className="text-center">
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
                                    >
                                        <Facebook className="w-8 h-8 text-white" />
                                    </motion.div>
                                    <p className="text-sm text-muted-foreground font-medium">Loading Facebook video...</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Preview for regular posts
                        <div className="facebook-preview bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 group-hover:from-blue-100 group-hover:to-blue-200 dark:group-hover:from-blue-800 dark:group-hover:to-blue-700 transition-all duration-300">
                            <div className="flex items-center justify-center p-8 min-h-[250px]">
                                <div className="text-center max-w-sm">
                                    <motion.div 
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                                    >
                                        <Facebook className="w-10 h-10 text-white" />
                                    </motion.div>

                                    <h4 className="text-xl font-bold text-foreground mb-3">
                                        Facebook Post
                                    </h4>

                                    {pageOrUserName && (
                                        <p className="text-blue-600 dark:text-blue-400 font-semibold mb-4 text-sm">
                                            by {pageOrUserName}
                                        </p>
                                    )}

                                    {caption && (
                                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                                            {caption}
                                        </p>
                                    )}

                                    {publishedAt && (
                                        <p className="text-xs text-muted-foreground mb-4">
                                            {new Date(publishedAt).toLocaleDateString()}
                                        </p>
                                    )}

                                    <div className="text-xs text-muted-foreground opacity-75">
                                        Click to view full post
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </CardHeader>

                <CardContent className="p-6">
                    <div className="space-y-4">
                        {caption && (
                            <p className="text-sm text-foreground line-clamp-3 leading-relaxed">
                                {caption}
                            </p>
                        )}

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            {pageOrUserName && (
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-blue-600" />
                                    <span>{pageOrUserName}</span>
                                </div>
                            )}

                            {publishedAt && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-blue-600" />
                                    <span>{new Date(publishedAt).toLocaleDateString()}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="p-6 pt-0">
                    <Button
                        onClick={handleRedirect}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                        size="lg"
                    >
                        <Facebook className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                        View on Facebook
                        <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

export default FacebookEmbed;