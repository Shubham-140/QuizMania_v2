# 🧠 QuizMania - Ultimate Quiz Experience

QuizMania is a feature-rich, full-stack quiz application built with Next.js 14, TypeScript, and PostgreSQL. Test your knowledge with beautiful animations, real-time scoring, and personalized feedback — all in a modern, secure, and responsive interface.

## 🚀 Features

### 🎮 Core Quiz Features

#### Dynamic Question Engine

- Multiple categories & difficulty levels
- Real-time countdown timer
- Answer validation at the end of quiz

#### Results Dashboard

- Animated score calculation
- Performance analytics (correct/incorrect)
- Time-taken metrics

### 👤 User Experience & Personalization

#### Authentication System

- Secure login/signup with NextAuth.js
- GitHub OAuth integration
- Email/password authentication with bcrypt hashing
- JWT token-based sessions

#### Theme & Customization

- Light/dark theme toggle with Redux state
- Custom quiz length (5-20 questions)
- Adjustable time limits
- Local storage for user preferences

#### Engagement Tools

- Interactive rules overview
- Exit prevention with confirmation dialogs
- User feedback system
- Profile exploration (view other user's profiles)

### 🔐 Security & Data Management

#### Robust Authentication

- Password hashing with bcrypt
- Session management with NextAuth.js
- Protected routes and API endpoints
- Secure logout functionality

#### Database Integration

- PostgreSQL database with Prisma ORM
- User data persistence
- Optimized database queries

### 🌐 Full-Stack Architecture

#### Next.js Backend API

- RESTful API endpoints (GET, POST, PATCH, DELETE, PUT)
- Server-side authentication
- Database operations
- Error handling and validation

#### Modern Routing

- Next.js 14 App Router
- File-based routing system
- Dynamic routes for user profiles
- Custom error pages (error.tsx, not-found.tsx)

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript 5
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS 4
- **UI Components**: Lucide React icons
- **Animations**: CSS keyframes & Tailwind transitions

### Backend & Database

- **Runtime**: Node.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Password Security**: bcrypt
- **Session Management**: JWT tokens

### Development Tools

- **Bundler**: Next.js built-in (Turbopack)
- **Linting**: ESLint with Next.js config
- **Type Checking**: TypeScript
- **Environment**: dotenv for configuration

## 🔧 Key Features Implementation

### Authentication Flow

- **Secure Registration**: bcrypt password hashing + database storage
- **Multi-Provider Login**: GitHub OAuth + credential-based auth
- **Session Management**: JWT tokens with NextAuth.js
- **Protected Routes**: Middleware-based route protection

### User Profile System

- **Profile Exploration**: Search and view other users' profiles
- **Statistics Tracking**: Quiz history, scores, and performance metrics
- **Social Features**: Leaderboards and user discovery

### Quiz Engine

- **Dynamic Question Loading**: Server-side question generation
- **Real-time Scoring**: Instant feedback with animations
- **Progress Persistence**: Save and resume quiz sessions
- **Performance Analytics**: Detailed statistics and insights

### Error Handling

- **Custom Error Pages**: Branded 404 and error boundaries
- **API Error Handling**: Proper HTTP status codes and messages
- **User-Friendly Feedback**: Contextual error messages

## 🚀 Getting Started

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Set up environment variables**
4. **Configure database**: `npx prisma migrate dev`
5. **Run development server**: `npm run dev`

## 🎯 What Makes QuizMania Special

- **Full-Stack TypeScript**: End-to-end type safety
- **Modern Architecture**: Next.js 14 App Router with server components
- **Secure by Design**: Industry-standard authentication and data protection
- **Scalable Database**: PostgreSQL with optimized Prisma queries
- **Rich User Experience**: Smooth animations, responsive design, and intuitive UI
- **Social Features**: User profiles via username using params

---

_Built with ❤️ using modern web technologies for the ultimate quiz experience._
