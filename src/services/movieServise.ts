import axios from 'axios';
import type { Movie } from '../types/movie';

axios.defaults.baseURL = 'https://api.themoviedb.org/3';

axios.defaults.headers.common = {
  accept: 'application/json',
  Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
};

axios.defaults.params = {
  include_adult: false,
  language: 'en-US',
};

interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export default async function fetchMovies(
  query: string,
  page: number
): Promise<MoviesResponse> {

  if (!query.trim()) {
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }

  const response = await axios.get<MoviesResponse>('/search/movie', {
    params: { query, page },
  });

  return response.data;
}
