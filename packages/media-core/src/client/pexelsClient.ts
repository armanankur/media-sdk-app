const BASE_URL = "https://api.pexels.com/v1";

export class PexelsClient {

    private readonly apiKey: string;

   constructor(apiKey: string) {
  if (!apiKey) {
    throw new Error("Pexels API key is required");
  }

  this.apiKey = apiKey;
}
private async request<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
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
    `/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`
  );
}

async curated(page = 1, perPage = 20) {
  return this.request(
    `/curated?page=${page}&per_page=${perPage}`
  );
}

async getPhoto(id: number) {
  return this.request(`/photos/${id}`);
}



}

