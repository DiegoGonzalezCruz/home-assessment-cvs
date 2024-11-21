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

export async function getMoviesByYear(
  year: string,
  page: string
): Promise<Movie[]> {
  const discoverMovieURL = `${TMDB_BASE_URL}/discover/movie`;
  try {
    const res = await axios.get(discoverMovieURL, {
      params: {
        language: "en-US",
        primary_release_year: year,
        sort_by: "popularity.desc",
        page: page,
        api_key: TMDB_API_KEY,
      },
    });

    // Parallel call improves performance
    const movies = await Promise.all(
      res.data.results.map(async (movie: any) => {
        const editors = await getMovieEditors(movie.id);
        return {
          title: movie.title,
          release_date: formatReleaseDate(movie.release_date),
          vote_average: parseFloat(movie.vote_average.toFixed(2)),
          editors,
        };
      })
    );

    return movies;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw new Error("Failed to fetch movies");
  }
}

function formatReleaseDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC", // Ensure consistent time zone
  });
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
      .filter(
        (crewMember: any) => crewMember.known_for_department === "Editing"
      ) // Filter crew members by department "Editing" only
      .map((editor: any) => editor.name);
  } catch (error) {
    console.error(`Error fetching editors for movie ID ${movieId}:`, error);
    return []; // Return empty array on failure
  }
}
