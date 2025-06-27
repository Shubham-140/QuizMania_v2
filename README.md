# 🧠 QuizMania - Ultimate Quiz Experience

QuizMania is a feature-rich, full-stack quiz application built with Next.js 15, TypeScript 5, and PostgreSQL. Test your knowledge with beautiful animations, real-time scoring, and personalized feedback — all in a modern, secure, and responsive interface.

## 🚀 Features

### 🎮 Core Quiz Features
- **Dynamic Question Engine**
- **Multiple categories & difficulty levels**
- **Real-time countdown timer**
- **Answer validation at the end of quiz**

### Results Dashboard
- **Animated score calculation**
- **Performance analytics (correct/incorrect)**
- **Time-taken metrics**

### 👤 User Experience & Personalization

#### Authentication System
- **Secure login/signup with NextAuth.js**
- **GitHub OAuth integration**
- **Email/password authentication with bcrypt hashing**
- **JWT token-based sessions**

#### Theme & Customization
- **Light/dark theme toggle with Redux state**
- **Custom quiz length (5-20 questions)**
- **Adjustable time limits**
- **Persistent user preferences with Redux Persist**
- **Cross-session state retention**

#### Engagement Tools
- **Interactive rules overview**
- **Exit prevention with confirmation dialogs**
- **User feedback system**
- **Profile exploration (view other user's profiles)**

### 🔐 Security & Data Management

#### Robust Authentication
- **Password hashing with bcrypt**
- **Session management with NextAuth.js**
- **Protected routes and API endpoints**
- **Secure logout functionality**

#### State Persistence
- **Redux Persist integration for seamless user experience**
- **Automatic state rehydration on app reload**
- **Configurable persistence for sensitive data**
- **Local storage optimization**

#### Database Integration
- **PostgreSQL database with Prisma ORM**
- **User data persistence**
- **Optimized database queries**

### 🌐 Full-Stack Architecture

#### Next.js Backend API
- **RESTful API endpoints (GET, POST, PATCH, DELETE, PUT)**
- **Server-side authentication**
- **Database operations**
- **Error handling and validation**

#### Modern Routing
- **Next.js 15 App Router**
- **File-based routing system**
- **Dynamic routes for user profiles**
- **Custom error pages (error.tsx, not-found.tsx)**

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15.3.4 with App Router
- **Language:** TypeScript 5.x
- **State Management:** Redux Toolkit 2.8.2
- **State Persistence:** Redux Persist 6.0.0
- **Styling:** Tailwind CSS 4.x
- **UI Components:** Lucide React 0.522.0 icons
- **Animations:** CSS keyframes & Tailwind transitions
- **React:** React 19.0.0 & React DOM 19.0.0

### Backend & Database
- **Runtime:** Node.js 20.x
- **Database:** PostgreSQL 8.16.2
- **ORM:** Prisma 6.10.1
- **Authentication:** NextAuth.js 4.24.11
- **Password Security:** bcrypt 6.0.0
- **Session Management:** JWT tokens

### Development Tools
- **Bundler:** Next.js built-in (Turbopack)
- **Linting:** ESLint 9.x with Next.js config
- **Type Checking:** TypeScript 5.x
- **Environment:** dotenv 16.5.0 for configuration

### Additional Dependencies
- **React Redux:** 9.2.0 for React-Redux integration
- **@types/pg:** 8.15.4 for PostgreSQL TypeScript types
- **@types/bcrypt:** 5.0.2 for bcrypt TypeScript types

## 🔧 Key Features Implementation

### State Management & Persistence
- **Redux Toolkit:** Centralized state management with modern Redux patterns
- **Redux Persist:** Automatic state persistence across browser sessions
- **Selective Persistence:** Configure which parts of state to persist
- **Rehydration:** Seamless state restoration on app initialization
- **Storage Optimization:** Efficient local storage management

### Authentication Flow
- **Secure Registration:** bcrypt password hashing + database storage
- **Multi-Provider Login:** GitHub OAuth + credential-based auth
- **Session Management:** JWT tokens with NextAuth.js
- **Protected Routes:** Middleware-based route protection

### User Profile System
- **Profile Exploration:** Search and view other users' profiles
- **Statistics Tracking:** Quiz history, scores, and performance metrics
- **Social Features:** Leaderboards and user discovery
- **Persistent Preferences:** User settings saved across sessions

### Quiz Engine
- **Dynamic Question Loading:** Server-side question generation
- **Real-time Scoring:** Instant feedback with animations
- **Progress Persistence:** Save and resume quiz sessions with Redux Persist
- **Performance Analytics:** Detailed statistics and insights
- **State Recovery:** Resume interrupted quizzes after page refresh

### Error Handling
- **Custom Error Pages:** Branded 404 and error boundaries
- **API Error Handling:** Proper HTTP status codes and messages
- **User-Friendly Feedback:** Contextual error messages
- **Persistence Error Recovery:** Graceful handling of storage failures

## 🚀 Getting Started

1. **Clone the repository**
2. **Install dependencies:** `npm install`
3. **Set up environment variables**
4. **Configure database:** `npx prisma migrate dev`
5. **Run development server:** `npm run dev`

## 📦 Package Notes

### Core Dependencies
All major dependencies are included and up-to-date:
- Next.js 15.3.4 (latest stable)
- React 19.0.0 (latest)
- TypeScript 5.x (latest)
- Prisma 6.10.1 (latest)
- Redux Toolkit 2.8.2 (latest)

### Missing from Standard Setups
- **Prisma Studio:** Not included but can be added for database visualization
- **Jest/Testing Framework:** No testing setup currently configured
- **Storybook:** Component documentation not included
- **Docker:** No containerization setup

## 🎯 What Makes QuizMania Special

- **Full-Stack TypeScript:** End-to-end type safety
- **Modern Architecture:** Next.js 15 App Router with server components
- **Secure by Design:** Industry-standard authentication and data protection
- **Scalable Database:** PostgreSQL with optimized Prisma queries
- **Rich User Experience:** Smooth animations, responsive design, and intuitive UI
- **Social Features:** User profiles via username using params
- **Persistent State:** Redux Persist ensures seamless user experience across sessions
- **Performance Optimized:** Efficient state management with selective persistence

Built with ❤️ using modern web technologies for the ultimate quiz experience.
