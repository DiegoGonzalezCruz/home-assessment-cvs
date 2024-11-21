import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { getMoviesByYear } from "./movies";

// Load env variables

// Create express app
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(bodyParser.json());

app.get(
  "/movies/:year",
  async (req: Request<{ year: string }>, res: Response): Promise<void> => {
    const year = req.params.year;
    // console.log(year, "year");

    if (!/^\d{4}$/.test(year)) {
      res.status(400).json({ error: "Invalid year format. Please use YYYY" });
      return;
    }

    try {
      const movies = await getMoviesByYear(year);
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