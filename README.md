# SKILLORA

Skillora is a project which we built to make it easier for students to find internship opportunities and prepare for their careers. The idea is to bring useful career-related features together in one place instead of having to search across different websites.

## What it does

- **Internship Finder:** Search for internships based on the role and location.
- **TinyFish Search:** Fetches relevant web search results for internship opportunities.
- **Resume Analysis:** Includes a section for students to work with their resumes.
- **Simple Interface:** Built with React so students can navigate the website easily.

## Tech used

- React.js
- Vite
- JavaScript and CSS
- TinyFish Search API
- Vercel

## How TinyFish works in Skillora

I used the TinyFish Search API to help find internship-related results. When a user enters a role and location, Skillora sends the search request to its API endpoint. The endpoint sends the query to TinyFish and returns the available results to the website.

The API key is stored as an environment variable on the server instead of being added to the frontend code.

## How to run the project

**1. Clone the repository**

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd skillora
```

Replace the URL with your repository link.

**2. Install the dependencies**

```bash
npm install
```

**3. Add your TinyFish API key**

Create a `.env.local` file in the project folder and add:

```env
TINYFISH_API_KEY=your_api_key_here
```

Use your own API key and do not upload this file to GitHub.

**4. Start the project**

```bash
npx vercel dev
```

This runs the frontend and the Vercel API locally. Make sure your environment variable is configured before testing the internship search.

## What I learned

While building Skillora, I got to work with React, API integration, environment variables, and deployment. I also learned how a frontend can communicate with an API to fetch and display search results.

## Project link

Live website: https://skillora-s7ga.vercel.app/

GitHub repository: Add your repository link here.
