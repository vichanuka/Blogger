# Blogger

A modern blog application built with Next.js and MongoDB. It includes a public blog listing, individual blog detail pages, and an admin area for adding and deleting posts.

## Features

- Responsive blog homepage with featured blog cards
- Single post pages for reading full articles
- Admin dashboard for creating blog entries
- Blog image upload support
- MongoDB-backed content storage
- Tailwind-based styling

## Tech Stack

- Next.js 16
- React 19
- MongoDB with Mongoose
- Tailwind CSS
- Axios for client-side API calls

## Prerequisites

- Node.js 18+
- npm
- MongoDB instance running locally or remotely

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file in the project root and add your MongoDB connection string:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/blogger
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```text
blogger/
├── app/
│   ├── admin/
│   ├── api/
│   ├── blogs/
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── Components/
├── lib/
├── public/
├── .env.local
├── package.json
├── README.md
└── next.config.mjs
```

## Main Routes

- `/` — homepage listing all blog posts
- `/blogs/[id]` — detailed blog page
- `/admin/addProduct` — create a new blog post
- `/admin/blogList` — manage existing blog posts

## API

The app exposes blog endpoints under `app/api/blog/route.js`:

- `GET /api/blog` — fetch all blogs
- `GET /api/blog?id=<id>` — fetch a single blog
- `POST /api/blog` — create a blog post with uploaded image
- `DELETE /api/blog?id=<id>` — delete a blog post

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Notes

- Uploaded blog images are stored in the `public` directory.
- The database connection is configured in `lib/config/db.js`.
- Blog data schema is defined in `lib/models/BlogModels.js`.

## License

This project is for educational/demo purposes.
