import { Box, ImageList, ImageListItem, useMediaQuery, useTheme } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { NavLink } from 'react-router-dom';

import { UserPost } from '../types';
import Loader from './Loader';

interface DecodedToken extends JwtPayload {
  userId: string;
}
type UserPostsProps = {
  userIdParams: string | undefined;
};

const UserPosts = ({ userIdParams }: UserPostsProps) => {
  const token = Cookies.get('token');
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'));

  let id: string | undefined;

  let decoded: DecodedToken | null = null;
  if (token) {
    decoded = jwtDecode<DecodedToken>(token);
  }
  if (decoded) {
    id = decoded.userId;
  }

  const getUrl = () => {
    if (userIdParams && id !== userIdParams) {
      return `http://localhost:5000/user/post/${userIdParams}`;
    }

    return `http://localhost:5000/user/post/${id}`;
  };
  const { isLoading, isError, data, error } = useQuery<UserPost>({
    queryKey: ['userPosts'],
    queryFn: async () => {
      const response = await fetch(getUrl());
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      return response.json();
    }
  });

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );

  if (isError) return <div>An error occurred: {error.message}</div>;

  if (!data || !data.userPostdata || data.userPostdata.length === 0) {
    return <div>Nothing to show!</div>;
  }

  const postData = data.userPostdata;

  return (
    <Box sx={{ mt: 5 }}>
      <ImageList cols={isMd ? 4 : 2} gap={8}>
        {postData.map((post) => (
          <ImageListItem
            key={post.postId}
            sx={{
              width: 250,
              height: 300,
              mb: 3,
              overflow: 'hidden',
              borderRadius: 2,
              border: '2px solid',
              borderColor: 'grey.300'
            }}>
            <NavLink to={`/post/view/${post.postId}`}>
              <Box
                component="img"
                sx={{ width: '100%', height: 300, objectFit: 'cover', display: 'block' }}
                src={`http://localhost:5000/${post.postImg.replace('public\\images\\', 'images/')}`}
                alt={post.imageName}
              />
            </NavLink>
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
};

export default UserPosts;
