import { getMoviesByYear } from "./movies";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // Ensure environment variables are loaded

jest.mock("axios");
const mockedAxios = jest.mocked(axios); // Corrected line

describe("getMoviesByYear", () => {
  it("should return a list of movies with editors", async () => {
    mockedAxios.get.mockImplementation((url: string) => {
      if (url.includes("/discover/movie")) {
        return Promise.resolve({
          data: {
            results: [
              {
                id: 1,
                title: "Test Movie",
                release_date: "2021-01-01",
                vote_average: 7.7,
              },
            ],
          },
        });
      } else if (url.includes("/credits")) {
        return Promise.resolve({
          data: {
            crew: [
              { known_for_department: "Editing", name: "Test Editor One" },
              { known_for_department: "Editing", name: "Test Editor Two" },
              { known_for_department: "Editing", name: "Test Editor Three" },
            ],
          },
        });
      }
      return Promise.reject(new Error("Unexpected API call"));
    });

    const movies = await getMoviesByYear("2019", "1");

    expect(movies).toEqual([
      {
        title: "Test Movie",
        release_date: "January 1, 2021",
        vote_average: 7.7,
        editors: ["Test Editor One", "Test Editor Two", "Test Editor Three"],
      },
    ]);
  });

  it("should handle API failures gracefully", async () => {
    mockedAxios.get.mockRejectedValue(new Error("API is down"));

    await expect(getMoviesByYear("2019", "1")).rejects.toThrow(
      "Failed to fetch movies"
    );
  });

  it("should handle movies with no editors", async () => {
    mockedAxios.get.mockImplementation((url: string) => {
      if (url.includes("/discover/movie")) {
        return Promise.resolve({
          data: {
            results: [
              {
                id: 2,
                title: "Movie Without Editors",
                release_date: "2021-02-01",
                vote_average: 6.5,
              },
            ],
          },
        });
      } else if (url.includes("/credits")) {
        return Promise.resolve({
          data: {
            crew: [
              // No editors in the crew
            ],
          },
        });
      }
      return Promise.reject(new Error("Unexpected API call"));
    });

    const movies = await getMoviesByYear("2019", "1");

    expect(movies).toEqual([
      {
        title: "Movie Without Editors",
        release_date: "February 1, 2021",
        vote_average: 6.5,
        editors: [], // Should be an empty array
      },
    ]);
  });

  it("should handle partial failures when credits API fails for some movies", async () => {
    mockedAxios.get.mockImplementation((url: string) => {
      if (url.includes("/discover/movie")) {
        return Promise.resolve({
          data: {
            results: [
              {
                id: 1,
                title: "Movie With Editors",
                release_date: "2021-01-01",
                vote_average: 7.7,
              },
              {
                id: 2,
                title: "Movie Without Editors Due to API Failure",
                release_date: "2021-02-01",
                vote_average: 6.5,
              },
            ],
          },
        });
      } else if (url.includes("/movie/1/credits")) {
        return Promise.resolve({
          data: {
            crew: [{ known_for_department: "Editing", name: "Editor One" }],
          },
        });
      } else if (url.includes("/movie/2/credits")) {
        return Promise.reject(new Error("Credits API failure"));
      }
      return Promise.reject(new Error("Unexpected API call"));
    });

    const movies = await getMoviesByYear("2019", "1");

    expect(movies).toEqual([
      {
        title: "Movie With Editors",
        release_date: "January 1, 2021",
        vote_average: 7.7,
        editors: ["Editor One"],
      },
      {
        title: "Movie Without Editors Due to API Failure",
        release_date: "February 1, 2021",
        vote_average: 6.5,
        editors: [], // Should be empty due to API failure
      },
    ]);
  });
});
