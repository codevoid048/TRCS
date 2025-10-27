"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  Youtube,
  Instagram,
  Facebook,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  ExternalLink,
  Calendar,
  Link
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { SocialPost } from '../page';

interface SocialPostItemProps {
  post: SocialPost;
  onEdit: (post: SocialPost) => void;
  onDelete: (post: SocialPost) => void;
  onToggleStatus: (post: SocialPost) => void;
}

export default function SocialPostItem({ 
  post, 
  onEdit, 
  onDelete, 
  onToggleStatus 
}: SocialPostItemProps) {
  
  // Get platform icon and color
  const getPlatformConfig = (type: string) => {
    switch (type) {
      case 'youtube':
        return {
          icon: <Youtube className="h-5 w-5" />,
          color: 'text-red-500',
          bgColor: 'bg-red-50',
          badge: 'bg-red-100 text-red-800'
        };
      case 'instagram':
        return {
          icon: <Instagram className="h-5 w-5" />,
          color: 'text-pink-500',
          bgColor: 'bg-pink-50',
          badge: 'bg-pink-100 text-pink-800'
        };
      case 'facebook':
        return {
          icon: <Facebook className="h-5 w-5" />,
          color: 'text-blue-500',
          bgColor: 'bg-blue-50',
          badge: 'bg-blue-100 text-blue-800'
        };
      default:
        return {
          icon: <Link className="h-5 w-5" />,
          color: 'text-gray-500',
          bgColor: 'bg-gray-50',
          badge: 'bg-gray-100 text-gray-800'
        };
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Truncate URL for display
  const truncateUrl = (url: string, maxLength: number = 60) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  const platformConfig = getPlatformConfig(post.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`bg-white border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-lg ${
        post.isActive ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-gray-300 opacity-75'
      }`}>
        <CardContent className="p-6 bg-white">
          <div className="flex items-start justify-between">
            {/* Left side - Platform info and URL */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-3">
                {/* Platform Icon */}
                <div className={`p-2 rounded-lg ${platformConfig.bgColor}`}>
                  <div className={platformConfig.color}>
                    {platformConfig.icon}
                  </div>
                </div>

                {/* Platform Badge */}
                <Badge 
                  variant="secondary" 
                  className={`${platformConfig.badge} capitalize font-medium`}
                >
                  {post.type}
                </Badge>

                {/* Status Badge */}
                <Badge 
                  variant={post.isActive ? "default" : "secondary"}
                  className={post.isActive 
                    ? "bg-green-100 text-green-800 hover:bg-green-100" 
                    : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                  }
                >
                  {post.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              {/* URL */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Link className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          href={post.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline font-medium truncate block"
                        >
                          {truncateUrl(post.url)}
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs break-all">{post.url}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 flex-shrink-0"
                    onClick={() => window.open(post.url, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>

                {/* Embed URL (if available) */}
                {post.embedUrl && (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 flex-shrink-0" /> {/* Spacer */}
                    <span className="text-sm text-gray-500">
                      Embed: {truncateUrl(post.embedUrl, 50)}
                    </span>
                  </div>
                )}

                {/* Video ID (for YouTube) */}
                {post.videoId && (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 flex-shrink-0" /> {/* Spacer */}
                    <span className="text-sm text-gray-500">
                      Video ID: {post.videoId}
                    </span>
                  </div>
                )}
              </div>

              {/* Timestamps */}
              <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Created: {formatDate(post.createdAt)}</span>
                </div>
                {post.updatedAt !== post.createdAt && (
                  <div className="flex items-center space-x-1">
                    <span>Updated: {formatDate(post.updatedAt)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right side - Action buttons */}
            <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
              {/* Toggle Status */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onToggleStatus(post)}
                      className={`h-9 w-9 p-0 bg-white border-gray-300 ${
                        post.isActive 
                          ? 'hover:bg-red-50 hover:border-red-200' 
                          : 'hover:bg-green-50 hover:border-green-200'
                      }`}
                    >
                      {post.isActive ? (
                        <EyeOff className="h-4 w-4 text-red-600" />
                      ) : (
                        <Eye className="h-4 w-4 text-green-600" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{post.isActive ? 'Deactivate' : 'Activate'} post</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Edit */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(post)}
                      className="h-9 w-9 p-0 bg-white border-gray-300 hover:bg-blue-50 hover:border-blue-200"
                    >
                      <Edit className="h-4 w-4 text-blue-600" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit post</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Delete */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(post)}
                      className="h-9 w-9 p-0 bg-white border-gray-300 hover:bg-red-50 hover:border-red-200"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete post</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Mobile Action Buttons */}
          <div className="flex items-center justify-end space-x-2 mt-4 sm:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleStatus(post)}
              className={`bg-white border-gray-300 ${post.isActive ? 'text-red-600' : 'text-green-600'}`}
            >
              {post.isActive ? (
                <>
                  <EyeOff className="h-4 w-4 mr-1" />
                  Deactivate
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-1" />
                  Activate
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(post)}
              className="bg-white border-gray-300 text-blue-600"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(post)}
              className="bg-white border-gray-300 text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}