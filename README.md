# Skillora 🎓

Skillora is a student-focused career website that helps students find internship opportunities and prepare for their careers. The idea behind this project is to bring internship searching and resume-related tools together in one place, so students don't have to depend on multiple platforms for basic career preparation.

## Features

- **Internship Finder:** Search for internship opportunities by entering a role and location.
- **TinyFish Integration:** Fetches relevant web search results related to internships.
- **Resume Analyzer:** Provides a section for students to work on their resumes.
- **Easy-to-Use Interface:** A simple interface designed with students in mind.

## What is the idea behind Skillora?

Students often spend a lot of time searching different websites for internships and preparing their resumes separately. Skillora aims to make this process more convenient by bringing these career-related features together.

## What is innovative about it?

The main idea is to combine internship discovery through web search with resume-related assistance in one student-focused platform. Instead of relying only on a fixed list of internship opportunities, Skillora uses the TinyFish Search API to fetch relevant search results based on the user's chosen role and location.

## Technologies Used

- React.js
- Vite
- JavaScript
- CSS
- TinyFish Search API
- Vercel

## How TinyFish Is Used

TinyFish is used to fetch web search results related to internship opportunities.

Here is how it works:

1. The student enters an internship role and location.
2. Skillora sends the request to its API endpoint.
3. The API endpoint sends the search query to TinyFish.
4. TinyFish returns search results related to the query.
5. Skillora displays the available results, including titles, links, and descriptions when provided.

The TinyFish API key is stored as a server-side environment variable to avoid exposing it in the frontend code.

## How to Run the Project

### Prerequisites

- Node.js and npm
- A TinyFish API key

### 1. Clone the repository

```bash
git clone https://github.com/lilima07/Skillora.git
cd skillora
```

### 2. Install dependencies

```bash
npm install
```
### 3. Start the project locally

Since the internship API uses a Vercel serverless function, run the project with:

```bash
npx vercel dev
```

Follow the terminal instructions to open the local website. Make sure the required environment variable is configured.

## Live Demo

https://skillora-s7ga.vercel.app/

## Future Improvements

- Add filters for internship type, eligibility, and application deadlines.
- Improve matching between student skills and internship requirements.
- Add personalized internship recommendations.
- Improve resume feedback and career preparation tools.

## Learning Outcomes

Building Skillora helped me explore React development, API integration, environment variables, and deploying a web application. It also helped me understand how a frontend communicates with an API to fetch and display data.

## License

This project was created for learning and demonstration purposes.
