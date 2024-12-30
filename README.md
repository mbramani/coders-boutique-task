# Tech Assessment Dashboard

This project is a responsive user dashboard for a tech assessment platform built using Next.js, ShadCN, and PostgreSQL.

## Approach

The application is built using a modern, component-based architecture with Next.js and React. It leverages server-side rendering and API routes for improved performance and SEO. The user interface is designed to be responsive and accessible, with a focus on usability across different devices.

### Key Features

1. Dashboard with assessment overview and summary
2. CRUD operations for assessments
3. Responsive design
4. Dark mode support
5. Server-side rendering
6. API routes for data fetching and manipulation

## Tools and Technologies Used

1. **Next.js**: React framework for building the application, providing server-side rendering and API routes.
2. **React**: JavaScript library for building user interfaces.
3. **TypeScript**: Superset of JavaScript that adds static types.
4. **Prisma**: Next-generation ORM for Node.js and TypeScript.
5. **PostgreSQL**: Open-source relational database.
6. **ShadCN UI**: A collection of re-usable components built using Radix UI and Tailwind CSS.
7. **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
8. **Zod**: TypeScript-first schema declaration and validation library.

## Project Structure

- `app/`: Contains the Next.js application code
  - `components/`: Reusable React components
  - `api/`: API routes for server-side operations
  - `hooks/`: Custom React hooks
  - `lib/`: Utility functions and shared code
- `prisma/`: Prisma schema and migrations
- `public/`: Static assets

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your PostgreSQL database and update the connection string in `.env`
4. Run Prisma migrations: `npx prisma migrate dev`
5. Seed the database with initial data: `npm run seed`
6. Start the development server: `npm run dev`

## Deployment

This project can be easily deployed on Vercel, which provides an optimal environment for Next.js applications. Make sure to set up your environment variables in the Vercel dashboard.
