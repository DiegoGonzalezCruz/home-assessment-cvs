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
              { department: "Editing", name: "Test Editor One" },
              { department: "Editing", name: "Test Editor Two" },
              { department: "Editing", name: "Test Editor Three" },
            ],
          },
        });
      }
      return Promise.reject(new Error("Unexpected API call"));
    });

    const movies = await getMoviesByYear("2019");

    expect(movies).toEqual([
      {
        title: "Test Movie",
        release_date: "2021-01-01",
        vote_average: 7.7,
        editors: ["Test Editor One", "Test Editor Two", "Test Editor Three"],
      },
    ]);
  });

  it("should handle API failures gracefully", async () => {
    mockedAxios.get.mockRejectedValue(new Error("API is down"));

    const movies = await getMoviesByYear("2019");

    expect(movies).toEqual([]);
  });
});
