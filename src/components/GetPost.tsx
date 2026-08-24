import { Box, ImageList, ImageListItem, Typography, useMediaQuery, useTheme } from '@mui/material';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { NavLink } from 'react-router-dom';

import { useModal } from '../context/ModalContext';
import { usePostsQuery } from '../query/queries';
import Loader from './Loader';

const GetPost = () => {
  const { modal } = useModal();
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'));

  const { data, error, fetchNextPage, hasNextPage, isFetching, isLoading } = usePostsQuery();

  const [infiniteRef] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage: hasNextPage,
    onLoadMore: fetchNextPage,
    rootMargin: '0px 0px 400px 0px'
  });
  if (isLoading) return <Loader />;
  if (error) return <div>An error has occurred: {error.message}</div>;
  if (isFetching) return <Loader />;
  if (!data) {
    return <p>'No data!'</p>;
  }
  const posts = data.pages.flatMap((page) => {
    return page.posts;
  });

  return (
    <Box sx={{ position: modal === null ? 'relative' : 'fixed' }}>
      <Typography
        variant="h4"
        align="center"
        color="primary"
        fontWeight={600}
        sx={{ my: 2, pt: 1 }}>
        Explore
      </Typography>
      <ImageList cols={isMd ? 4 : 2} gap={16} sx={{ mx: 5, my: 5, p: 4, pt: 0 }}>
        {posts.map((post) => (
          <ImageListItem
            key={post.postId}
            sx={{
              height: 192,
              overflow: 'hidden',
              borderRadius: 2,
              border: '2px solid',
              borderColor: 'grey.300'
            }}>
            <NavLink to={`post/view/${post.postId}`}>
              <Box
                component="img"
                sx={{ width: '100%', height: 192, objectFit: 'cover', display: 'block' }}
                src={`http://localhost:5000/${post.postImg.replace('public\\images\\', 'images/')}`}
                alt={post.imageName}
              />
            </NavLink>
          </ImageListItem>
        ))}
      </ImageList>
      {hasNextPage && <div ref={infiniteRef}></div>}
    </Box>
  );
};

export default GetPost;
