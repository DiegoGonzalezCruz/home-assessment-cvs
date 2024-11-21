export interface DiscoverMovieResult {
  id: number;
  title: string;
  release_date: string;
  vote_average: number;
}

export interface DiscoverMovieResponse {
  results: DiscoverMovieResult[];
}

export interface CrewMember {
  known_for_department: string;
  name: string;
}

export interface MovieCreditsResponse {
  crew: CrewMember[];
}

export interface Movie {
  title: string;
  release_date: string;
  vote_average: number;
  editors: string[];
}
