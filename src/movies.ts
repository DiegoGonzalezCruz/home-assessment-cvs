import axios from "axios";
import { logger, TMDB_API_KEY } from "./config";
import {
  CrewMember,
  DiscoverMovieResponse,
  DiscoverMovieResult,
  Movie,
  MovieCreditsResponse,
} from "./types";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

if (!TMDB_API_KEY) {
  throw new Error("TMDB_API_KEY is not set in .env file");
}

export async function getMoviesByYear(
  year: string,
  page: string
): Promise<Movie[]> {
  const discoverMovieURL = `${TMDB_BASE_URL}/discover/movie`;
  try {
    const res = await axios.get<DiscoverMovieResponse>(discoverMovieURL, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_API_KEY}`,
      },
      params: {
        language: "en-US",
        primary_release_year: year,
        sort_by: "popularity.desc",
        page: page,
      },
    });

    // Parallel call improves performance 🤩
    // It could be optimized further by limiting the number of concurrent requests, like p-limit
    const movies = await Promise.all(
      res.data.results.map(async (movieResult: DiscoverMovieResult) => {
        const editors = await getMovieEditors(movieResult.id);
        return {
          title: movieResult.title,
          release_date: formatReleaseDate(movieResult.release_date),
          vote_average: parseFloat(movieResult.vote_average.toFixed(2)),
          editors,
        };
      })
    );

    return movies;
  } catch (error) {
    logger.error("Error fetching movies:", error);
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
    const res = await axios.get<MovieCreditsResponse>(movieCreditURL, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_API_KEY}`,
      },
    });

    const crew = res.data.crew || []; // Ensure crew is an array

    return crew
      .filter(
        (crewMember: CrewMember) =>
          crewMember.known_for_department === "Editing"
      )
      .map((editor: CrewMember) => editor.name);
  } catch (error) {
    logger.error(`Error fetching editors for movie ID ${movieId}:`, error);
    return []; // Return empty array on failure so the movie can still be displayed
  }
}
