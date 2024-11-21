import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";

import { getMoviesByYear } from "./movies";

// Load env variables

// Create express app
const app = express();
const port = 3000;

// Middleware to parse JSON

app.get(
  "/movies/:year",
  async (
    req: Request<{ year: string }, {}, {}, { page?: string }>,
    res: Response
  ): Promise<void> => {
    const year = req.params.year;
    const page = req.query.page || "1"; // Default to page 1 if not provided

    if (!/^\d{4}$/.test(year)) {
      res.status(400).json({ error: "Invalid year format. Please use YYYY" });
      return;
    }
    // Validate the page parameter
    if (!/^\d+$/.test(page) || parseInt(page, 10) < 1) {
      res
        .status(400)
        .json({ error: "Invalid page number. Must be a positive integer." });
      return;
    }

    try {
      const movies = await getMoviesByYear(year, page);
      //   console.log(movies, "movies");
      res.json(movies);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
