export type MediaType = "photo" | "video";

export interface Pagination {
  page: number;
  perPage: number;
  totalResults: number;
  nextPage?: string;
}

export interface Photo {
  id: number;
  type: "photo";

  width: number;
  height: number;

  photographer: string;

  url: string;

  imageUrl: string;

  thumbnailUrl: string;
}

export interface Video {
  id: number;

  type: "video";

  width: number;

  height: number;

  duration: number;

  url: string;

  thumbnailUrl: string;

  videoUrl: string;
}

export interface SearchParams {
  query: string;

  page?: number;

  perPage?: number;
}

export type MediaItem = Photo | Video;

export interface MediaResponse {
  items: MediaItem[];

  pagination: Pagination;
}