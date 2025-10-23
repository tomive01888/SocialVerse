# 社交 VERSE (SocialVerse)

A modern, feature-rich social media web application built with Next.js and Tailwind CSS, utilizing the Noroff v2 API. SocialVerse is designed with a focus on a premium user experience, featuring a dynamic animated background, glassmorphism UI elements, and a fully responsive interface.

**Live Demo:** `[Link to your deployed application]`

<!-- Placeholder for a stunning screenshot or GIF of the app in action -->

`[Image placeholder: A screenshot of the SocialVerse homepage feed with the Aurora background and sticky sidebar]`

## ✨ Features

- **Secure Authentication:** Full user registration and login flow with JWT persistence in `localStorage`.
- **Dynamic Post Feed:** A paginated, masonry-style homepage that displays posts from the community.
- **Powerful Controls:** A sticky sidebar on the homepage allows users to:
  - **Live Search:** A debounced, real-time search for both users and posts with an interactive dropdown.
  - **Sort:** Change the order of posts.
  - **Paginate:** Control the number of posts per page.
- **Rich User Profiles:** Dynamic profile pages displaying user information, banner, avatar, and a feed of their posts.
- **Social Interaction:**
  - **Optimistic UI for Reactions:** Instantly react to posts with a variety of emojis. The UI updates immediately, providing a snappy, responsive feel.
  - **Nested Comments:** A full-featured, YouTube-style comment system that correctly sorts a flat API response into a nested tree of parents and replies.
- **Full Content Ownership:**
  - **Create Posts:** A "Create Post" button opens a fully accessible, focus-trapped modal with a form for creating new content.
  - **Edit & Delete Posts:** Post owners have access to "Edit" and "Delete" actions on their profile and single post pages, protected by on-brand confirmation dialogs.
  - **Follow/Unfollow System:** Users can follow and unfollow other profiles.
- **Polished User Experience:**
  - **Animated "Aurora" Background:** A generative, animated gradient background that provides a unique and modern aesthetic.
  - **Glassmorphism UI:** Semi-transparent, blurred UI elements create a sense of depth and context.
  - **Skippable Login Intro:** A custom, animated intro sequence plays on a fresh login, which can be disabled by the user.
  - **Error Boundary:** The application is wrapped in an Error Boundary to prevent component-level crashes from breaking the entire page.

## 💻 Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (v4) with PostCSS
- **Animation:** Framer Motion
- **State Management:** React Context (`AuthContext`) and `useState`/`useEffect`
- **UI Components:** Custom, reusable components for Modals, Forms, and more.
- **Linting:** ESLint

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You will need Node.js (version 18.x or later) and npm installed on your computer.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/socialverse.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd socialverse
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

3.  Replace `YOUR_API_KEY_HERE` with the API key.

### Running the Application

1.  **Start the development server:**
    ```bash
    npm run dev
    ```
2.  Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to see the application in action.

## 🔗 API

This project is powered by the [Noroff Social API v2](https://docs.noroff.dev/docs/v2/social). All data fetching and content management is handled through this API.

## 🛣️ Future Work

- Implement the "Edit Profile" form functionality.
- Add a modal to display lists of followers and following.
- Implement the "Delete Comment" functionality with ownership checks.
- Explore real-time updates for comments and reactions using polling or WebSockets.
