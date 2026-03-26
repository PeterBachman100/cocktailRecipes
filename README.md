# Tippl — Professional Cocktail Management

**Tippl** is a full-stack MERN application designed for home bartenders and enthusiasts who need a rigorous way to manage their cocktail library. Built with a **Master-Detail** UI, it allows users to browse global recipes, curate a private collection, and organize drinks into custom folders without losing their place in the library.

### [Live Application](https://tippl.vercel.app/recipes)

---

## Technical Highlights

* **Master-Detail Layout:** Engineered a seamless UI where recipe details open in a contextual side panel. This maintains the user's scroll position and filter state in the main collection, significantly improving UX over traditional page-to-page navigation.
* **Express 5 Architecture:** Utilizes the latest Express 5.x routing engine, implementing named wildcard parameters for robust API health monitoring and deployment stability.
* **Advanced Filtering Engine:** A custom-built filtering system that supports multi-select tags for spirits, flavors, and cocktail types, using MongoDB query logic to handle complex "match-all" or "match-any" requirements.
* **Image Pipeline:** Integrated **Cloudinary** via a `multer` middleware stack to handle high-resolution cocktail photography with optimized delivery.
* **Stateless Authentication:** Secure user sessions powered by **JWT (JSON Web Tokens)** and `bcryptjs` for password hashing.

---

## The Stack

### Frontend
* **React 19:** Utilizing modern hooks for state management and UI logic.
* **Vite:** Optimized build tooling for fast HMR and production bundling.
* **Lucide React:** Consistent, high-quality iconography.
* **React Router 7:** Handling deep-linking for recipes within the master-detail view.
* **React Spinners:** Providing visual feedback during asynchronous data fetching.

### Backend
* **Node.js & Express 5:** A modern REST API handling authentication, CRUD operations, and media uploads.
* **MongoDB & Mongoose:** Schema-driven database design, including nested folder structures for user organization.
* **Cloudinary:** Cloud-based image management and hosting.
* **Morgan:** HTTP request logger for development and production monitoring.

---

## Key Features

* **Global & Private Libraries:** Browse a curated public list and "Save to My Recipes" to personalize your experience.
* **Private Editing & Rating:** Once a recipe is in your collection, you can rate it, tweak the specs, and add personal notes.
* **Folder Organization:** Create and manage custom folders (e.g., "Summer Tiki," "Bittersweet Classics") to categorize your private library.
* **Smart Recipe Cards:** Cards dynamically display spirit/flavor tags and a truncated description to provide the "gist" of a drink at a glance.
* **Search & Filter:** Real-time search with debounced inputs to keep performance snappy even as the library grows.

---

## Deployment Strategy

* **Frontend:** Hosted on **Vercel** with custom rewrite rules (`vercel.json`) for SPA routing.
* **Backend:** Hosted on **Render**, utilizing an automated health-check "wake-up" protocol to manage free-tier cold starts.
* **Database:** **MongoDB Atlas** with a globally whitelisted IP configuration for cloud-to-cloud communication.
