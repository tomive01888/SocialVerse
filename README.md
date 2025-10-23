# 社交 VERSE (SocialVerse)

A modern, feature-rich social media web application built with Next.js and Tailwind CSS, utilizing the Noroff v2 API. SocialVerse is designed with a focus on a premium user experience, featuring a dynamic animated background, glassmorphism UI elements, and a fully responsive interface.

**Live Demo:** `[Link to your deployed application]`

<!-- Placeholder for a stunning screenshot or GIF of the app in action -->

`[Image placeholder: A screenshot of the SocialVerse homepage feed with the Aurora background and sticky sidebar]`

## ✨ Features

- **Secure Authentication:** Full user registration and login flow with JWT persistence in `localStorage`.
- **Dynamic Post Feed:** A paginated, masonry-style homepage that displays posts from the community.
- **Contextual Side Panel:** A sticky sidebar on the homepage that provides relevant actions and information:
  - **Create Post:** A quick-access button that opens a fully featured, accessible modal for content creation.
  - **Authors on Page:** A context-aware list of the unique authors currently visible on the feed, allowing for easy discovery.
  - **Sort & Filter:** Controls to change the order and number of posts per page.
- **Rich User Profiles:** Dynamic profile pages displaying user information, banner, avatar, stats, and a feed of their posts.
- **Social Interaction:**
  - **Optimistic UI for Reactions:** Instantly react to posts with a variety of emojis. The UI updates immediately, providing a snappy, responsive feel.
  - **Nested Comments:** A full-featured, YouTube-style comment system that correctly sorts a flat API response into a nested tree of parents and replies.
- **Full Content Ownership:**
  - **Edit & Delete Posts:** Post owners have access to "Edit" and "Delete" actions, protected by on-brand confirmation dialogs.
  - **Follow/Unfollow System:** Users can follow and unfollow other profiles.
- **Polished User Experience:**
  - **Animated "Aurora" Background:** A generative, animated gradient background that provides a unique and modern aesthetic.
  - **Crystallize Effect:** Post cards feature a unique, generative "shattered glass" background, ensuring no two cards look alike.
  - **Skippable Login Intro:** A custom, animated intro sequence plays on a fresh login, which can be disabled by the user.
  - **Error Boundary:** The application is wrapped in an Error Boundary to prevent component-level crashes from breaking the entire page.

## 💻 Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (v4) with PostCSS
- **Animation:** Framer Motion
- **State Management:** React Context (`AuthContext`) and React Hooks
- **UI Components:** Custom, reusable components for Modals, Forms, and more.
- **Linting:** ESLint

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You will need Node.js (version 18.x or later) and npm installed on your computer.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/SocialVerse.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd SocialVerse
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```

### Environment Variables

This project requires environment variables to connect to the Noroff API.

1.  Create a new file named `.env.local` in the root of your project.
2.  Copy the content below into your new `.env.local` file.

    ```env
    # .env.local

    NEXT_PUBLIC_NOROFF_API_URL=https://v2.api.noroff.dev
    NEXT_PUBLIC_NOROFF_API_KEY=YOUR_API_KEY_HERE
    ```

3.  To get an API key, you must be a registered student at Noroff. Replace `YOUR_API_KEY_HERE` with your personal key.

## 📜 Available Scripts

In the project directory, you can run the following commands:

- **`npm run dev`**
  Runs the app in development mode with Turbopack. Open [http://localhost:3000](http://localhost:3000) to view it in the browser. The page will hot-reload if you make edits.

- **`npm run build`**
  Builds the app for production to the `.next` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

- **`npm run start`**
  Starts a production server for the built app. This is used to view the production build locally before deploying.

- **`npm run lint`**
  Runs the ESLint linter to find and fix problems in your codebase.

## 🔗 API

This project is powered by the [Noroff Social API v2](https://docs.noroff.dev/docs/v2/social/posts). All data fetching and content management is handled through this API.
