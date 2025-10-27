'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ExternalLink, Instagram, Calendar, User, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface InstagramEmbedProps {
    postUrl: string;
    caption?: string;
    publishedAt?: string;
    username?: string;
    hideComments?: boolean; // New prop to control comment visibility
}

const InstagramEmbed: React.FC<InstagramEmbedProps> = ({
    postUrl,
    caption,
    publishedAt,
    username,
    hideComments = true // Default to hiding comments for videos
}) => {
    useEffect(() => {
        // Load Instagram embed script with better error handling
        const loadInstagramScript = () => {
            // Check if script already exists
            const existingScript = document.querySelector('script[src="https://www.instagram.com/embed.js"]');
            if (existingScript) {
                // Script exists, just process embeds
                if ((window as any).instgrm) {
                    (window as any).instgrm.Embeds.process();
                }
                return;
            }

            // Create and load new script
            const script = document.createElement('script');
            script.src = 'https://www.instagram.com/embed.js';
            script.async = true;
            script.onload = () => {
                // Process embeds when script loads
                if ((window as any).instgrm) {
                    (window as any).instgrm.Embeds.process();
                }
            };
            script.onerror = () => {
                console.warn('Failed to load Instagram embed script');
            };

            document.body.appendChild(script);
        };

        // Load script and process embeds
        loadInstagramScript();

        // Re-process embeds after component mounts
        const timeoutId = setTimeout(() => {
            if ((window as any).instgrm) {
                (window as any).instgrm.Embeds.process();
            }
            
            // Hide comments if hideComments is true
            if (hideComments) {
                // Apply styles multiple times to override Instagram's loading
                const applyStyles = () => {
                    const style = document.createElement('style');
                    style.textContent = `
                        /* Force Instagram video height with maximum specificity */
                        .instagram-media iframe[src*="instagram.com"] {
                            height: auto !important;
                            min-height: 500px !important;
                            max-height: none !important;
                            width: 100% !important;
                        }
                        
                        /* Target Instagram container with force */
                        .instagram-media[data-instgrm-permalink] {
                            height: auto !important;
                            max-height: none !important;
                            min-height: 500px !important;
                            overflow: visible !important;
                            width: 100% !important;
                        }
                        
                        /* Hide comment sections */
                        .instagram-media [data-testid="caption-text"],
                        .instagram-media [data-testid="comments"],
                        .instagram-media [data-testid="comment-thread"],
                        .instagram-media [role="button"]:has(span),
                        .instagram-media div[style*="margin-top: 8px"],
                        .instagram-media div[style*="padding-top: 8px"],
                        .instagram-media a[href*="/p/"]:not([href*="embed"]),
                        .instagram-media div[style*="padding-bottom"] {
                            display: none !important;
                        }
                        
                        /* Hide Instagram branding */
                        .instagram-media div[style*="text-align: center"]:last-child,
                        .instagram-media a[style*="text-decoration: none"]:last-child {
                            display: none !important;
                        }
                    `;
                    
                    // Remove old style and add new one
                    const oldStyle = document.head.querySelector('#instagram-hide-comments');
                    if (oldStyle) {
                        oldStyle.remove();
                    }
                    style.id = 'instagram-hide-comments';
                    document.head.appendChild(style);
                };

                // Apply immediately and then repeatedly
                applyStyles();
                
                // Keep applying styles every 500ms for 10 seconds to override Instagram
                const intervalId = setInterval(applyStyles, 500);
                setTimeout(() => {
                    clearInterval(intervalId);
                }, 10000);
            }
        }, 2000); // Increased timeout to ensure Instagram embed loads

        return () => {
            clearTimeout(timeoutId);
        };
    }, [postUrl, hideComments]);

    const handleRedirect = () => {
        window.open(postUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -8 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-sm mx-auto"
        >
            <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10">
                <CardContent className="p-0 relative group">
                    <div className="instagram-embed-wrapper">
                        <blockquote
                            className="instagram-media"
                            data-instgrm-permalink={postUrl}
                            data-instgrm-version="14"
                            data-instgrm-captioned="false"
                            data-instgrm-comments="false"
                            style={{
                                background: '#FFF',
                                border: 0,
                                borderRadius: '12px',
                                boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1), 0 1px 10px 0 rgba(0,0,0,0.15)',
                                margin: '1px',
                                maxWidth: '320px',
                                minWidth: '250px',
                                padding: 0,
                                width: 'calc(100% - 2px)',
                                height: 'auto',
                                minHeight: '500px'
                            }}
                        >
                            <div style={{ padding: '12px' }}>
                                <div className="flex items-center justify-center p-6">
                                    <div className="text-center">
                                        <motion.div
                                            animate={{ rotate: [0, 10, -10, 0] }}
                                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                            className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
                                        >
                                            <Instagram className="w-6 h-6 text-white" />
                                        </motion.div>
                                        <p className="text-sm text-muted-foreground mb-3 font-medium">Loading Instagram post...</p>
                                        <a
                                            href={postUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-purple-600 hover:text-pink-600 text-sm font-medium transition-colors duration-300"
                                        >
                                            View on Instagram
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </blockquote>
                        <script async src="//www.instagram.com/embed.js"></script>
                    </div>
                </CardContent>

                <CardContent className="p-6">
                    <div className="space-y-4">
                        {caption && (
                            <p className="text-sm text-foreground line-clamp-3 leading-relaxed">
                                {caption}
                            </p>
                        )}

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            {username && (
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-purple-600" />
                                    <span>@{username}</span>
                                </div>
                            )}

                            {publishedAt && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-purple-600" />
                                    <span>{new Date(publishedAt).toLocaleDateString()}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="p-6 pt-0">
                    <Button
                        onClick={handleRedirect}
                        className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-pink-600 hover:from-purple-600 hover:via-pink-600 hover:to-pink-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                        size="lg"
                    >
                        <Instagram className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                        View on Instagram
                        <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

export default InstagramEmbed;
