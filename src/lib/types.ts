export interface Meta {
  isFirstPage: boolean;
  isLastPage: boolean;
  currentPage: number;
  previousPage: number | null;
  nextPage: number | null;
  pageCount: number;
  totalCount: number;
}

export interface ApiError {
  code?: string;
  message: string;
  path?: string[];
}

export interface ApiErrorResponse {
  errors: ApiError[];
  status: string;
  statusCode: number;
}

export interface PaginatedApiResponse<T> {
  data: T;
  meta: Meta;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: {
    url: string;
    alt: string;
  };
  banner?: {
    url: string;
    alt: string;
  };
}

export interface LoginSuccessResponse {
  data: UserProfile & {
    accessToken: string;
  };
}

export interface RegisterSuccessResponse {
  data: UserProfile;
}

interface Author {
  name: string;
  email: string;
  avatar?: {
    url: string;
    alt: string;
  };
}

interface Media {
  url: string;
  alt: string;
}

interface PostCounts {
  comments: number;
  reactions: number;
}

export interface PostDetail {
  id: string;
  title: string;
  body: string | null;
  tags: string[];
  media: Media | null;
  created: string;
  updated: string;
  _count: PostCounts;
  author?: Author;
  reactions?: Reaction[];
  comments?: Comment[];
}

export interface Reaction {
  symbol: string;
  count: number;
  reactors: string[];
}

export interface Comment {
  id: number;
  body: string;
  replyToId: number | null;
  postId: string;
  owner: string;
  created: string;
  author: Author;
}

export interface FollowUser {
  name: string;
  avatar: Media | null;
  banner?: Media | null;
}

export interface Profile {
  name: string;
  email: string;
  bio: string | null;
  banner: Media | null;
  avatar: Media | null;
  _count?: {
    posts: number;
    followers: number;
    following: number;
  };
  posts?: PostDetail[];
  followers?: FollowUser[];
  following?: FollowUser[];
}
