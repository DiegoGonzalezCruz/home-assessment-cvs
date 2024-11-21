import axios from "axios";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

if (!TMDB_API_KEY) {
  throw new Error("TMDB_API_KEY is not set in .env file");
}

interface Movie {
  title: string;
  release_date: string;
  vote_average: number;
  editors?: string[]; // optional
}

export async function getMoviesByYear(year: string): Promise<Movie[]> {
  const discoverMovieURL = `${TMDB_BASE_URL}/discover/movie`;
  const movies: Movie[] = [];

  try {
    const res = await axios.get(discoverMovieURL, {
      params: {
        language: "en-US",
        primary_release_year: year,
        sort_by: "popularity.desc",
        page: 1,
        api_key: TMDB_API_KEY,
      },
    });

    for (const movie of res.data.results) {
      const editors = await getMovieEditors(movie.id); // Fetch editors for each movie

      movies.push({
        title: movie.title,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        editors,
      });
    }
    return movies;
  } catch (error) {
    console.error("Error fetching movies, error: ", error);
    return movies; // FIXME: This should not return an empty array
  }
}

async function getMovieEditors(movieId: number): Promise<string[]> {
  const movieCreditURL = `${TMDB_BASE_URL}/movie/${movieId}/credits`;

  try {
    const res = await axios.get(movieCreditURL, {
      params: {
        api_key: TMDB_API_KEY,
      },
    });
    return res.data.crew
      .filter((crewMember: any) => crewMember.department === "Editing") // Filter crew members by department "Editing" only
      .map((editor: any) => editor.name);
  } catch (error) {
    console.error(`Error fetching editors for movie ID ${movieId}:`, error);
    return []; // Return empty array on failure
  }
}
