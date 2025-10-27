'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ExternalLink, Play, Calendar, User, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface YouTubeEmbedProps {
    videoId: string;
    title: string;
    description?: string;
    redirectUrl: string;
    publishedAt?: string;
    channelName?: string;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({
    videoId,
    title,
    description,
    redirectUrl,
    publishedAt,
    channelName
}) => {
    const handleRedirect = () => {
        window.open(redirectUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -8 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg mx-auto"
        >
            <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50/50 to-white dark:from-red-900/10 dark:to-gray-900">
                <CardHeader className="p-0 relative group">
                    <div className="relative aspect-video bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/20 dark:to-red-800/20">
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title={title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 rounded-t-lg"
                        />
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-t-lg flex items-center justify-center">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileHover={{ scale: 1, opacity: 1 }}
                                className="bg-red-600 text-white p-3 rounded-full shadow-lg"
                            >
                                <Play className="w-6 h-6" />
                            </motion.div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-foreground line-clamp-2 leading-tight">
                            {title}
                        </h3>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            {channelName && (
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-red-600" />
                                    <span>{channelName}</span>
                                </div>
                            )}

                            {publishedAt && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-red-600" />
                                    <span>{new Date(publishedAt).toLocaleDateString()}</span>
                                </div>
                            )}
                        </div>

                        {description && (
                            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                                {description}
                            </p>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="p-6 pt-0">
                    <Button
                        onClick={handleRedirect}
                        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                        size="lg"
                    >
                        <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                        Watch on YouTube
                        <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

export default YouTubeEmbed;
