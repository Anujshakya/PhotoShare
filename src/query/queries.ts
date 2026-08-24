import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { FetchResults } from '../types';

export const usePostsQuery = () => {
  return useInfiniteQuery<FetchResults>({
    queryKey: ['posts'],
    queryFn: async ({ pageParam }) => {
      // const limit = 10;
      const response = await fetch(`http://localhost:5000/posts?page=${pageParam}&limit=10`);

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      return response.json();
    },
    getNextPageParam: (lastPage) => {
      return lastPage.totalPages === lastPage.currentPage ? undefined : lastPage.currentPage + 1;
    },
    initialPageParam: 1
  });
};

export const useDeleteQuery = () => {
  const token = Cookies.get('token');
  const navigate = useNavigate();
  const mutatePost = useMutation({
    mutationFn: async (postId: string) => {
      const response = await fetch(`http://localhost:5000/user/post/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData);
        toast.error('Failed to delete!');
        throw new Error('Failed to delete post');
      }
    },
    onSuccess: () => {
      console.warn('Post deleted');
      toast.success('Post deleted successfully');
      navigate('/profile/me');
      // You may choose to handle navigation in the component where you use this hook
    },
    onError: () => {
      toast.error('An error occurred');
    }
  });

  return mutatePost;
};
