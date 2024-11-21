# Movie Information API

This project was created following these instructions: [https://github.com/harshalpatel/take-home-coding?tab=readme-ov-file](https://) . It corresponds to a Node.js application that provides an API endpoint to retrieve a list of movies released in a specified year, sorted by descending popularity. Each movie in the list includes the title, release date, vote average, and a list of editors. The API integrates with The Movie Database (TMDB) APIs to fetch movie and credit information. Robust testing is included.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Running Tests](#running-tests)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact Information](#contact-information)

## Features

- Fetches movies for a given year, sorted by popularity.
- Retrieves editors for each movie (optional if the credits API fails).
- Returns movie details including title, release date, vote average, and editors.
- Handles API failures gracefully without crashing the service.
- Includes comprehensive unit tests.

## Prerequisites

- **Node.js v21 or higher**: Ensure you have Node.js installed. You can download it from [Node.js Official Website](https://nodejs.org/).
- **npm**: Comes bundled with Node.js.

## Installation

1. **Clone the repository:**

   ```
   git clone https://github.com/your-username/movie-information-api.git
   cd movie-information-api
   ```

2. Install dependencies:

```
npm install
```

## Environment Variables

The application requires a TMDB API bearer token to authenticate requests. Do not commit your bearer token to the repository.

Create a .env file in the root directory:

```
touch .env
```

### Add your TMDB API key to the .env file:

```
TMDB_API_KEY=your_tmdb_bearer_token
```

- Replace your_tmdb_bearer_token with your actual TMDB bearer token.
- You can obtain an API key by creating an account on The Movie Database.

## Running the Application

Start the server:

```
npm start
```

The server will run on port 3000 by default.

## API Documentation

**Endpoint**
URL: /movies/:year
Method: GET
URL Parameters:
year: The year in YYYY format.
Query Parameters:
page (optional): The page number of results to retrieve. Defaults to 1 if not provided.
Response Format
The API returns a JSON array of movie objects with the following structure:

```
json
Copy code
[
  {
    "title": "Movie Title",
    "release_date": "Release Date in 'Month Day, Year' format",
    "vote_average": 8.19,
    "editors": ["Editor One", "Editor Two"]
  }
]
```

## Example Request

GET http://localhost:3000/movies/2019?page=1
Example Response:

```
json
Copy code
[
  {
    "title": "Joker",
    "release_date": "October 4, 2019",
    "vote_average": 8.19,
    "editors": [
      "Jeff Groth",
      "Jeff Mee",
      "Ray Neapolitan",
      "Thomas J. Cabela"
    ]
  },
  {
    "title": "Avengers: Endgame",
    "release_date": "April 26, 2019",
    "vote_average": 8.27,
    "editors": ["Jeffrey Ford", "Matthew Schmidt"]
  }
  // Additional movie objects...
]
```

## Error Handling

Invalid Year Format:

```
{
  "error": "Invalid year format. Please use YYYY"
}
```

### Invalid Page Number:

```
{
  "error": "Invalid page number. Must be a positive integer."
}
```

### Internal Server Error:

```
{
  "error": "Internal Server Error"
}
```

## Running Tests

The project includes unit tests to ensure functionality remains intact.

Run tests using the following command:

```
npm test
```

### Test Coverage:

The tests cover scenarios including successful data retrieval, API failures, movies without editors, and partial failures.

## Technologies Used

Node.js: JavaScript runtime environment.
TypeScript: Typed superset of JavaScript.
Express: Web framework for Node.js.
Axios: Promise-based HTTP client.
dotenv: Loads environment variables from a .env file.
Jest: JavaScript testing framework.

## Project Structure

```
├── src
│   ├── index.ts        // Entry point of the application
│   ├── movies.ts       // Module handling movie data fetching and processing
│   └── movies.test.ts  // Unit tests for movies module
├── .env                // Environment variables (not committed to version control)
├── package.json        // Project metadata and dependencies
├── tsconfig.json       // TypeScript configuration
└── README.md           // Project documentation
```

License
This project is licensed under the MIT License.

Contact Information
For any questions or suggestions, please contact:

Name: Diego Gonzalez Cruz

Email: diego@thinkey.us
