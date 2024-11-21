import dotenv from "dotenv";

dotenv.config();

import { createLogger, transports, format } from "winston";

export const logger = createLogger({
  level: "info",
  format: format.combine(format.timestamp(), format.json()),
  transports: [new transports.Console()],
});

export const TMDB_API_KEY = process.env.TMDB_API_KEY;
