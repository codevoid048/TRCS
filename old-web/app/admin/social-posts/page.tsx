"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Filter,
  Search,
  Youtube,
  Instagram,
  Facebook,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import SocialPostForm from './components/SocialPostForm';
import SocialPostItem from './components/SocialPostItem';

export interface SocialPost {
  _id: string;
  type: 'youtube' | 'instagram' | 'facebook';
  url: string;
  embedUrl?: string;
  videoId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

type PlatformFilter = 'all' | 'youtube' | 'instagram' | 'facebook';

function SocialPostsPageContent() {
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>('all');
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    post: SocialPost | null;
  }>({ isOpen: false, post: null });

  // Fetch social posts
  const fetchSocialPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      const url = platformFilter === 'all' 
        ? '/admin/social-posts'
        : `/admin/social-posts?type=${platformFilter}`;
      
      const response = await axios.get(`${API_BASE_URL}${url}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data && response.data.data) {
        setSocialPosts(response.data.data.socialPosts || []);
      } else {
        toast.error('Failed to fetch social posts');
      }
    } catch (error) {
      console.error('Error fetching social posts:', error);
      toast.error('Failed to fetch social posts');
    } finally {
      setLoading(false);
    }
  };

  // Filter posts based on search and platform
  useEffect(() => {
    let filtered = socialPosts;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(post =>
        post.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPosts(filtered);
  }, [socialPosts, searchQuery]);

  // Fetch posts on mount and platform filter change
  useEffect(() => {
    fetchSocialPosts();
  }, [platformFilter]);

  // Handle form submission
  const handleFormSubmit = async (postData: Partial<SocialPost>) => {
    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      const url = editingPost 
        ? `/admin/social-posts/${editingPost._id}`
        : '/admin/social-posts';

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      let response;
      if (editingPost) {
        response = await axios.put(`${API_BASE_URL}${url}`, postData, { headers });
      } else {
        response = await axios.post(`${API_BASE_URL}${url}`, postData, { headers });
      }

      if (response.data) {
        toast.success(editingPost ? 'Social post updated successfully' : 'Social post added successfully');
        setShowForm(false);
        setEditingPost(null);
        fetchSocialPosts();
      }
    } catch (error) {
      console.error('Error saving social post:', error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data?.message || 'Failed to save social post');
      } else {
        toast.error('Failed to save social post');
      }
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteDialog.post) return;

    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      
      const response = await axios.delete(`${API_BASE_URL}/admin/social-posts/${deleteDialog.post._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data) {
        toast.success('Social post deleted successfully');
        setDeleteDialog({ isOpen: false, post: null });
        fetchSocialPosts();
      }
    } catch (error) {
      console.error('Error deleting social post:', error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data?.message || 'Failed to delete social post');
      } else {
        toast.error('Failed to delete social post');
      }
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (post: SocialPost) => {
    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      
      const response = await axios.put(`${API_BASE_URL}/admin/social-posts/${post._id}/toggle-status`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data) {
        toast.success(`Social post ${post.isActive ? 'deactivated' : 'activated'} successfully`);
        fetchSocialPosts();
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data?.message || 'Failed to toggle status');
      } else {
        toast.error('Failed to toggle status');
      }
    }
  };

  // Platform icon mapping
  const getPlatformIcon = (type: string) => {
    switch (type) {
      case 'youtube':
        return <Youtube className="h-4 w-4 text-red-500" />;
      case 'instagram':
        return <Instagram className="h-4 w-4 text-pink-500" />;
      case 'facebook':
        return <Facebook className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-main"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white min-h-screen p-6 -m-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Social Posts</h1>
          <p className="text-gray-600 mt-1">
            Manage social media posts and embeds
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingPost(null);
            setShowForm(true);
          }}
          className="bg-primary-main hover:bg-primary-main/90 text-white border-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Social Post
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search posts by URL or platform..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Platform Filter */}
            <Select value={platformFilter} onValueChange={(value: PlatformFilter) => setPlatformFilter(value)}>
              <SelectTrigger className="w-full sm:w-48 bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by platform" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-lg">
                <SelectItem value="all">All Platforms</SelectItem>
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
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Youtube className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900">{socialPosts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Posts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {socialPosts.filter(post => post.isActive).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Youtube className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">YouTube</p>
                <p className="text-2xl font-bold text-gray-900">
                  {socialPosts.filter(post => post.type === 'youtube').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Instagram className="h-6 w-6 text-pink-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Instagram</p>
                <p className="text-2xl font-bold text-gray-900">
                  {socialPosts.filter(post => post.type === 'instagram').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div> */}

      {/* Posts List */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="bg-white">
          <CardTitle className="text-gray-900">Social Posts ({filteredPosts.length})</CardTitle>
        </CardHeader>
        <CardContent className="bg-white">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Youtube className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No social posts found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery ? 'Try adjusting your search criteria' : 'Get started by adding your first social post'}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => {
                    setEditingPost(null);
                    setShowForm(true);
                  }}
                  className="bg-primary-main hover:bg-primary-main/90 text-white border-0"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Social Post
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <SocialPostItem
                  key={post._id}
                  post={post}
                  onEdit={(post: SocialPost) => {
                    setEditingPost(post);
                    setShowForm(true);
                  }}
                  onDelete={(post: SocialPost) => setDeleteDialog({ isOpen: true, post })}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Modal */}
      {showForm && (
        <SocialPostForm
          post={editingPost}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingPost(null);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.isOpen} onOpenChange={(open) => 
        setDeleteDialog({ isOpen: open, post: null })
      }>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Social Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this social post? This action cannot be undone.
              <br />
              <br />
              <strong>URL:</strong> {deleteDialog.post?.url}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function SocialPostsPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <SocialPostsPageContent />
      </AdminLayout>
    </ProtectedRoute>
  );
}