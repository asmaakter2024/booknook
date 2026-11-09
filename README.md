This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

------------------------<<<<<<>>>>>>-------------------------------

# BookNook — Online Library

BookNook is an online library application for discovering books, keeping a personal reading list, adding books to the catalog, and viewing borrowed books.

**Live site:** [Visit BookNook](https://booknook-ruddy.vercel.app)

## Features

- Discover featured titles and new arrivals from the home page.
- Browse the full book catalog at `/allbooks` and explore books by category.
- Open book detail pages to read descriptions and decide what to borrow.
- Request to borrow a book and keep track of borrowed titles at `/myborrows`.
- Save and manage your personal book collection at `/mybooks`.
- Add books to the library catalog through `/addbook`.
- Read reader reviews and see the library's borrowing steps.
- Sign in to access personal library features and protected actions.

## Technology Stack

### Frontend

- TypeScript
- Tailwind CSS

### Authentication and Authorization

- Better Auth
- MongoDB adapter
- JWT

### Backend

- Express.js
- MongoDB
-JavaScript

## Application Routes

| Route        | Purpose                                        |
| ------------ | ---------------------------------------------- |
| `/allbooks`  | Browse all books in the library.               |
| `/mybooks`   | View books associated with the signed-in user. |
| `/addbook`   | Add a new book to the library catalog.         |
| `/myborrows` | View books borrowed by the signed-in user.     |

Routes that show personal data or modify the catalog should require the appropriate authentication and authorization.

## Book Data Example

```json
  {
    "title": "Matilda",
    "author": "Roald Dahl",
    "category": "Kids",
    "image": "https://covers.openlibrary.org/b/isbn/9780141311371-L.jpg",
    "description": "A clever young girl discovers her extraordinary abilities and uses them to stand up to unfair adults."
  },
```

## Getting Started

### Prerequisites

- Node.js and npm
- A MongoDB database

### Installation

1. Clone the repository and open its project directory.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root and set the environment variables required by the application. At minimum, configure the MongoDB connection and the authentication/JWT secrets. Use the variable names expected by the project configuration.
4. Start the development server using the script defined in `package.json`, for example:

   ```bash
   npm run dev
   ```

Available scripts and exact environment variable names depend on the project configuration.

## Security Notes

- Keep database credentials and authentication secrets in environment variables; do not commit them.
- Verify JWTs on protected backend routes.
- Check authorization on the server for catalog changes and user-specific data.

## License

Add the license used by this project here.
