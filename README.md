# Ceramic Diary

A cross-platform ceramic journaling application for documenting pottery projects from shaping to firing and glazing.

The application allows users to create ceramic pieces, document individual work stages, record materials and firing information, and attach photos to each stage. The project is built with React Native, Expo, TypeScript and Supabase.

## Features

* Create and manage ceramic pieces
* Track the progress of a piece through different stages
* Record notes, weights and clay information
* Record kiln temperatures and firing programs
* Record glaze and engobe information
* Attach photos to individual work stages
* User authentication with Supabase Auth
* User-specific data access using Row Level Security (RLS)
* Cloud storage for process photos
* Responsive interface for web and mobile

## Tech Stack

* **Frontend:** React Native, Expo, TypeScript
* **Backend / Database:** Supabase, PostgreSQL
* **Authentication:** Supabase Auth
* **Storage:** Supabase Storage
* **Security:** Row Level Security (RLS)
* **Routing:** Expo Router

## Project Structure

```text
app/
├── index.tsx
├── piece/
│   ├── new.tsx
│   └── [id]/
│       ├── index.tsx
│       ├── add-step.tsx
│       └── edit-step/
│
src/
├── components/
├── constants/
├── context/
├── lib/
│   ├── data.ts
│   └── supabase.ts
└── types/

supabase/
└── schema.sql
```

## Data Model

The application uses a relational database with separate tables for:

* **Pieces** – ceramic works and their basic information
* **Steps** – individual stages in the making process
* **Step Photos** – photos associated with individual stages
* **Profiles** – user profile information
* **Ideas** – saved ceramic project ideas

User-specific access is controlled using Supabase Row Level Security policies.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Supabase

Create a Supabase project and configure the required database tables, Row Level Security policies and storage bucket.

### 3. Configure environment variables

Create a `.env` file based on `.env.example`:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Start the development server

```bash
npx expo start
```

The application can be run on web or through Expo Go on a mobile device.

## Current Status

The core application functionality is implemented and the project is actively being developed.

The main focus has been on building the application architecture, database integration, authentication, user-specific data access and the ceramic work-stage tracking system.

## Future Development

Possible future improvements include:

* Improved image upload and management
* Ceramic material and glaze recipe integration
* Statistics and weight/shrinkage visualizations
* Offline support
* More detailed piece management
* Improved sharing and community features

## Author

**Saija Joronen**

ICT Engineering student at HAMK, interested in software development, HealthTech, AI and IoT.
