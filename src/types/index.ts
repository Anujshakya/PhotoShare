export interface FetchResults {
  message: string;

  posts: Posts[];
  totalPages: number;
  currentPage: number;
  data: [];
}
export interface UserResponse {
  message: string;
  userdata: Users;
  id: string;
}

export interface UserProfile {
  id: string;

  userImg: string;

  about: string;
  userdata: Users;
}
export interface UserEditResponse {
  firstName: string;
  lastName: string;
  about: string;
  id: string;
  userData: Users;
}
export interface UserPost {
  message: string;
  userPostdata: Posts[];
}
export interface Posts {
  postId: number;
  postImg: string;
  imageName: string;
  postCaption: string;
  postDesc: string;
  postedAt: Date;
  updatedAt: Date;
  postImgWidth: number;
  postImgHeight: number;
  nextPage: number | null;
}

export interface Users {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  id?: string;
  userImg?: string;
  about?: string;
}

export interface UserDetail {
  firstName: string;
  lastName: string;
  about: string;
  id: string;
  userImg: string;
}
export interface PhotoDetail {
  userImg?: File | undefined | Blob;
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface JwtPayload {
  userId: number;
  iat: number;
  exp: number;
}
