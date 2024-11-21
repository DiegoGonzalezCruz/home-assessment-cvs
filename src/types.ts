/** Interface for a single movie result from the Discover Movie API */
export interface DiscoverMovieResult {
  id: number;
  title: string;
  release_date: string;
  vote_average: number;
}

/** Interface for the response from the Discover Movie API */
export interface DiscoverMovieResponse {
  results: DiscoverMovieResult[];
}

/** Interface for a crew member in the Movie Credits API */
export interface CrewMember {
  known_for_department: string;
  name: string;
}

/** Interface for the response from the Movie Credits API */
export interface MovieCreditsResponse {
  crew: CrewMember[];
}

/** Internal Models */
export interface Movie {
  title: string;
  release_date: string;
  vote_average: number;
  editors: string[];
}
