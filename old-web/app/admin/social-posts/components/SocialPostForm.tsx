"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Youtube,
  Instagram,
  Facebook,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { SocialPost } from '../page';

interface SocialPostFormProps {
  post?: SocialPost | null;
  onSubmit: (data: Partial<SocialPost>) => void;
  onCancel: () => void;
}

interface FormData {
  type: 'youtube' | 'instagram' | 'facebook' | '';
  url: string;
  embedUrl: string;
  videoId: string;
  isActive: boolean;
}

interface ValidationErrors {
  type?: string;
  url?: string;
  embedUrl?: string;
  videoId?: string;
}

export default function SocialPostForm({ post, onSubmit, onCancel }: SocialPostFormProps) {
  const [formData, setFormData] = useState<FormData>({
    type: '',
    url: '',
    embedUrl: '',
    videoId: '',
    isActive: true,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when editing
  useEffect(() => {
    if (post) {
      setFormData({
        type: post.type,
        url: post.url,
        embedUrl: post.embedUrl || '',
        videoId: post.videoId || '',
        isActive: post.isActive,
      });
    }
  }, [post]);

  // Platform-specific URL validation patterns
  const urlPatterns = {
    youtube: [
      /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
      /^https?:\/\/youtu\.be\/[\w-]+/,
      /^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]+/
    ],
    instagram: [
      /^https?:\/\/(www\.)?instagram\.com\/p\/[\w-]+/,
      /^https?:\/\/(www\.)?instagram\.com\/reel\/[\w-]+/,
      /^https?:\/\/(www\.)?instagram\.com\/tv\/[\w-]+/
    ],
    facebook: [
      /^https?:\/\/(www\.)?facebook\.com\/[\w.]+\/(posts|videos|reel)\/[\w.]+/,
      /^https?:\/\/(www\.)?facebook\.com\/reel\/[\w.]+/
    ]
  };

  // Extract video ID from YouTube URL
  const extractYouTubeVideoId = (url: string): string => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return '';
  };

  // Generate embed URL based on platform and URL
  const generateEmbedUrl = (type: string, url: string): string => {
    if (type === 'youtube') {
      const videoId = extractYouTubeVideoId(url);
      return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    }
    // For Instagram and Facebook, embed URLs are typically different
    // and might need specific processing based on the platform's embed requirements
    return '';
  };

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Validate type
    if (!formData.type) {
      newErrors.type = 'Platform type is required';
    }

    // Validate URL
    if (!formData.url.trim()) {
      newErrors.url = 'URL is required';
    } else if (!formData.url.startsWith('http://') && !formData.url.startsWith('https://')) {
      newErrors.url = 'URL must start with http:// or https://';
    } else if (formData.type && urlPatterns[formData.type]) {
      const isValid = urlPatterns[formData.type].some(pattern => pattern.test(formData.url));
      if (!isValid) {
        newErrors.url = `Invalid ${formData.type} URL format`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    const updatedData = { ...formData, [field]: value };

    // Auto-generate embed URL and video ID for YouTube
    if (field === 'url' && formData.type === 'youtube' && typeof value === 'string') {
      const videoId = extractYouTubeVideoId(value);
      updatedData.videoId = videoId;
      updatedData.embedUrl = generateEmbedUrl(formData.type, value);
    }

    // Clear related fields when changing platform type
    if (field === 'type') {
      updatedData.embedUrl = '';
      updatedData.videoId = '';
      if (updatedData.url) {
        updatedData.embedUrl = generateEmbedUrl(value as string, updatedData.url);
        if (value === 'youtube') {
          updatedData.videoId = extractYouTubeVideoId(updatedData.url);
        }
      }
    }

    setFormData(updatedData);

    // Clear error for this field when user starts typing
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const submitData: Partial<SocialPost> = {
        type: formData.type as 'youtube' | 'instagram' | 'facebook',
        url: formData.url.trim(),
        isActive: formData.isActive,
      };

      // Add optional fields if they have values
      if (formData.embedUrl.trim()) {
        submitData.embedUrl = formData.embedUrl.trim();
      }
      if (formData.videoId.trim()) {
        submitData.videoId = formData.videoId.trim();
      }

      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get platform icon
  const getPlatformIcon = (type: string) => {
    switch (type) {
      case 'youtube':
        return <Youtube className="h-5 w-5 text-red-500" />;
      case 'instagram':
        return <Instagram className="h-5 w-5 text-pink-500" />;
      case 'facebook':
        return <Facebook className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <Card className="border-0 shadow-none bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b bg-white">
            <CardTitle className="text-xl font-semibold text-gray-900">
              {post ? 'Edit Social Post' : 'Add New Social Post'}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="h-8 w-8 p-0 bg-white hover:bg-gray-100 text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="pt-6 bg-white">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Platform Type */}
              <div className="space-y-2">
                <Label htmlFor="type">Platform Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleInputChange('type', value)}
                >
                  <SelectTrigger className={`bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 ${errors.type ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select a platform" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg">
                    <SelectItem value="youtube">
                      <div className="flex items-center">
                        <Youtube className="h-4 w-4 mr-2 text-red-500" />
                        YouTube
                      </div>
                    </SelectItem>
                    <SelectItem value="instagram">
                      <div className="flex items-center">
                        <Instagram className="h-4 w-4 mr-2 text-pink-500" />
                        Instagram
                      </div>
                    </SelectItem>
                    <SelectItem value="facebook">
                      <div className="flex items-center">
                        <Facebook className="h-4 w-4 mr-2 text-blue-500" />
                        Facebook
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-red-600">{errors.type}</p>
                )}
              </div>

              {/* URL */}
              <div className="space-y-2">
                <Label htmlFor="url">Post URL *</Label>
                <div className="relative">
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://..."
                    value={formData.url}
                    onChange={(e) => handleInputChange('url', e.target.value)}
                    className={`bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 ${errors.url ? 'border-red-500 pr-10' : 'pr-10'}`}
                  />
                  {formData.url && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-8 w-8 p-0 bg-white hover:bg-gray-100 text-gray-600"
                      onClick={() => window.open(formData.url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {errors.url && (
                  <p className="text-sm text-red-600">{errors.url}</p>
                )}
                
                {/* URL Format Help */}
                {formData.type && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>{formData.type.charAt(0).toUpperCase() + formData.type.slice(1)} URL formats:</strong>
                      <ul className="list-disc list-inside mt-1 text-sm">
                        {formData.type === 'youtube' && (
                          <>
                            <li>https://www.youtube.com/watch?v=VIDEO_ID</li>
                            <li>https://youtu.be/VIDEO_ID</li>
                            <li>https://www.youtube.com/embed/VIDEO_ID</li>
                          </>
                        )}
                        {formData.type === 'instagram' && (
                          <>
                            <li>https://www.instagram.com/p/POST_ID/</li>
                            <li>https://www.instagram.com/reel/REEL_ID/</li>
                            <li>https://www.instagram.com/tv/TV_ID/</li>
                          </>
                        )}
                        {formData.type === 'facebook' && (
                          <>
                            <li>https://www.facebook.com/username/posts/POST_ID</li>
                            <li>https://www.facebook.com/pagename/videos/VIDEO_ID</li>
                            <li>https://www.facebook.com/reel/REEL_ID</li>
                          </>
                        )}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Embed URL */}
              <div className="space-y-2">
                <Label htmlFor="embedUrl">
                  Embed URL 
                  <span className="text-sm text-gray-500 ml-1">(optional, auto-generated for YouTube)</span>
                </Label>
                <Input
                  id="embedUrl"
                  type="url"
                  placeholder="https://..."
                  value={formData.embedUrl}
                  onChange={(e) => handleInputChange('embedUrl', e.target.value)}
                  className={errors.embedUrl ? 'border-red-500' : ''}
                />
                {errors.embedUrl && (
                  <p className="text-sm text-red-600">{errors.embedUrl}</p>
                )}
              </div>

              {/* Video ID (YouTube only) */}
              {formData.type === 'youtube' && (
                <div className="space-y-2">
                  <Label htmlFor="videoId">
                    Video ID 
                    <span className="text-sm text-gray-500 ml-1">(optional, auto-extracted)</span>
                  </Label>
                  <Input
                    id="videoId"
                    placeholder="Video ID"
                    value={formData.videoId}
                    onChange={(e) => handleInputChange('videoId', e.target.value)}
                    className={errors.videoId ? 'border-red-500' : ''}
                  />
                  {errors.videoId && (
                    <p className="text-sm text-red-600">{errors.videoId}</p>
                  )}
                </div>
              )}

              {/* Active Status */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                />
                <Label htmlFor="isActive">
                  Active (visible on website)
                </Label>
              </div>

              {/* Preview */}
              {formData.type && formData.url && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    {getPlatformIcon(formData.type)}
                    <span className="font-medium capitalize">{formData.type}</span>
                    <span className="text-sm text-gray-500">Preview</span>
                  </div>
                  <p className="text-sm text-gray-700 break-all">{formData.url}</p>
                  {formData.embedUrl && (
                    <p className="text-xs text-gray-500 mt-1">
                      Embed: {formData.embedUrl}
                    </p>
                  )}
                  {formData.videoId && (
                    <p className="text-xs text-gray-500">
                      Video ID: {formData.videoId}
                    </p>
                  )}
                </div>
              )}

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary-main hover:bg-primary-main/90 text-white"
                >
                  {isSubmitting ? 'Saving...' : (post ? 'Update Post' : 'Add Post')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}