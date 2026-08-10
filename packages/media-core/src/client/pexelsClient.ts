// const BASE_URL = "https://api.pexels.com/v1";
// const VIDEO_URL = "https://api.pexels.com/videos";

// const API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

// if (!API_KEY) {
//   console.error("❌ Missing Pexels API key");
// }

// async function fetchData(url: string) {
//   const res = await fetch(url, {
//     headers: {
//       Authorization: API_KEY,
//     },
//   });

//   if (!res.ok) {
//     throw new Error(`API Error: ${res.status}`);
//   }

//   return res.json();
// }

// export async function getPhotos(query = "nature") {
//   return fetchData(`${BASE_URL}/search?query=${query}&per_page=10`);
// }

// export async function getVideos(query = "nature") {
//   return fetchData(`${VIDEO_URL}/search?query=${query}&per_page=10`);
// }

// export class PexelsClient {

//     private readonly apiKey: string;

//    constructor(apiKey: string) {
//   if (!apiKey) {
//     throw new Error("Pexels API key is required");
//   }

//   this.apiKey = apiKey;
// }
// private async request<T>(endpoint: string): Promise<T> {
//   const response = await fetch(`${BASE_URL}${endpoint}`, {
//     headers: {
//       Authorization: this.apiKey,
//     },
//   });

//   if (!response.ok) {
//     throw new Error(`Pexels API Error: ${response.status}`);
//   }

//   return response.json() as Promise<T>;
// }

// async search(query: string, page = 1, perPage = 20) {
//   return this.request(
//     `/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`
//   );
// }

// async curated(page = 1, perPage = 20) {
//   return this.request(
//     `/curated?page=${page}&per_page=${perPage}`
//   );
// }

// async getPhoto(id: number) {
//   return this.request(`/photos/${id}`);
// }


// async videosPopular(page = 1, perPage = 10) {
//   const data = await this.request<any>(
//     `/videos/popular?page=${page}&per_page=${perPage}`
//   );

//   return {
//     ...data,
//     videos: data.videos.map((v: any) => ({
//       id: v.id,
//       type: "video",
//       width: v.width,
//       height: v.height,
//       duration: v.duration,
//       url: v.url,
//       thumbnailUrl: v.image,
//       videoUrl: v.video_files?.[0]?.link, // 🔥 FIX
//     })),
//   };
// }

// async videosSearch(query: string, page = 1, perPage = 10) {
//   const data = await this.request<any>(
//     `/videos/search?query=${query}&page=${page}&per_page=${perPage}`
//   );

//   return {
//     ...data,
//     videos: data.videos.map((v: any) => ({
//       id: v.id,
//       type: "video",
//       width: v.width,
//       height: v.height,
//       duration: v.duration,
//       url: v.url,
//       thumbnailUrl: v.image,
//       videoUrl: v.video_files?.[0]?.link,
//     })),
//   };
// }

// }


// const BASE_URL = "https://api.pexels.com/v1";
// const VIDEO_URL = "https://api.pexels.com/videos";

// export class PexelsClient {
//   private readonly apiKey: string;

//   constructor(apiKey: string) {
//     if (!apiKey) {
//       throw new Error("Pexels API key is required");
//     }
//     this.apiKey = apiKey;
//   }

//   private async request<T>(endpoint: string): Promise<T> {
//     const response = await fetch(`${BASE_URL}${endpoint}`, {
//       headers: {
//         Authorization: this.apiKey,
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Pexels API Error: ${response.status}`);
//     }

//     return response.json() as Promise<T>;
//   }

//   async search(query: string, page = 1, perPage = 20) {
//     return this.request(
//       `/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`
//     );
//   }

//   async curated(page = 1, perPage = 20) {
//     return this.request(`/curated?page=${page}&per_page=${perPage}`);
//   }

//   async getPhoto(id: number) {
//     return this.request(`/photos/${id}`);
//   }

//   async videosPopular(page = 1, perPage = 10) {
//     const data = await this.request<any>(
//       `/videos/popular?page=${page}&per_page=${perPage}`
//     );
//     return {
//       ...data,
//       videos: data.videos.map((v: any) => ({
//         id: v.id,
//         type: "video",
//         width: v.width,
//         height: v.height,
//         duration: v.duration,
//         url: v.url,
//         thumbnailUrl: v.image,
//         videoUrl: v.video_files?.[0]?.link,
//       })),
//     };
//   }

//   async videosSearch(query: string, page = 1, perPage = 10) {
//     const data = await this.request<any>(
//       `${VIDEO_URL}/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`
//     );
//     return {
//       ...data,
//       videos: data.videos.map((v: any) => ({
//         id: v.id,
//         type: "video",
//         width: v.width,
//         height: v.height,
//         duration: v.duration,
//         url: v.url,
//         thumbnailUrl: v.image,
//         videoUrl: v.video_files?.[0]?.link,
//       })),
//     };
//   }
// }



const BASE_URL = "https://api.pexels.com/v1";

export class PexelsClient {
  private readonly apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("Pexels API key is required");
    }
    this.apiKey = apiKey;
  }

  private async request<T>(url: string): Promise<T> {
    const response = await fetch(url, {
      headers: {
        Authorization: this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Pexels API Error: ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  async search(query: string, page = 1, perPage = 20) {
    return this.request(
      `${BASE_URL}/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`
    );
  }

  async curated(page = 1, perPage = 20) {
    return this.request(`${BASE_URL}/curated?page=${page}&per_page=${perPage}`);
  }

  async getPhoto(id: number) {
    return this.request(`${BASE_URL}/photos/${id}`);
  }

  async videosPopular(page = 1, perPage = 10) {
    const data = await this.request<any>(
      `https://api.pexels.com/videos/popular?page=${page}&per_page=${perPage}`
    );
    return {
      ...data,
      videos: data.videos.map((v: any) => ({
        id: v.id,
        type: "video",
        width: v.width,
        height: v.height,
        duration: v.duration,
        url: v.url,
        thumbnailUrl: v.image,
        videoUrl: v.video_files?.[0]?.link,
      })),
    };
  }

  async videosSearch(query: string, page = 1, perPage = 10) {
    const data = await this.request<any>(
      `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`
    );
    return {
      ...data,
      videos: data.videos.map((v: any) => ({
        id: v.id,
        type: "video",
        width: v.width,
        height: v.height,
        duration: v.duration,
        url: v.url,
        thumbnailUrl: v.image,
        videoUrl: v.video_files?.[0]?.link,
      })),
    };
  }
}