# 🎭 Talent Show voting application

Live demo: https://live-voting-beta.vercel.app/

A modern, responsive voting application built with React, Next.js, and TypeScript. Users can vote for their favorite contestants in a talent show, with real-time updates and trending calculations.

## ✨ Features

- **Interactive voting**: Cast votes for contestants with real-time feedback
- **Live updates**: Simulated real-time vote updates with polling (every 3 seconds)
- **Trending analytics**: Calculate and display trending percentages based on 30-second intervals
- **Persistent state**: Vote state persists across page reloads using localStorage
- **Responsive design**: Optimized for mobile, tablet, and desktop
- **Error handling**: Comprehensive error boundaries and graceful error handling
- **Testing**: Full test coverage with Jest and React Testing Library (75.75% statement coverage)
- **Accessibility**: Keyboard navigation and screen reader support
- **Type safety**: Robust TypeScript implementation with strict type checking
- **Clean code**: Follows clean code principles with modular architecture

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd voting-task
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 Available Scripts

| Script                  | Description                                         |
| ----------------------- | --------------------------------------------------- |
| `npm run dev`           | Start development server                            |
| `npm run build`         | Build for production                                |
| `npm run start`         | Start production server                             |
| `npm run test`          | Run tests                                           |
| `npm run test:watch`    | Run tests in watch mode                             |
| `npm run test:coverage` | Run tests with coverage report                      |
| `npm run lint`          | Run ESLint                                          |
| `npm run lint:fix`      | Fix ESLint issues automatically                     |
| `npm run format`        | Format code with Prettier                           |
| `npm run format:check`  | Check code formatting                               |
| `npm run type-check`    | Run TypeScript type checking                        |
| `npm run clean`         | Clean build artifacts                               |
| `npm run clean:all`     | Clean all artifacts including node_modules          |
| `npm run install:clean` | Clean install (removes node_modules and reinstalls) |

## 🏗️ Architecture

### Custom Hooks

- **`useVoting`**: Manages vote state and localStorage persistence with per-contestant loading states
- **`useLiveVotes`**: Handles real-time vote updates and trending calculations with configurable intervals
- **`useLocalStorage`**: Reusable localStorage hook with error handling and hydration support
- **`useAsyncOperation`**: Generic async operation hook with loading/error states and proper error validation
- **`usePolling`**: Reusable polling hook for live data simulation with error handling

### Component Structure

```
src/
├── components/
│   ├── ContestantCard/
│   │   ├── ContestantCard.tsx      # Main card component (container)
│   │   ├── ContestantImage.tsx     # Image with fallback and inactive overlay
│   │   ├── ContestantInfo.tsx      # Contestant details (name, talent, description)
│   │   ├── VoteButton.tsx          # Interactive vote button with multiple states
│   │   └── TrendingIndicator.tsx   # Trending percentage display with conditional rendering
│   ├── ErrorBoundary.tsx           # Error boundary with recovery options and error reporting
│   ├── ErrorDisplay.tsx            # Error message display component
│   ├── GlobalErrorHandler.tsx      # Global error context with validation
│   └── Header.tsx                  # Application header with live toggle and stats
├── hooks/                          # Custom React hooks
├── utils/                          # Utility functions and validation
├── types/                          # TypeScript type definitions
└── data/                           # Mock data and initial contestants
```

### State Management

The application uses a combination of:

- **React Hooks**: For local component state
- **Custom Hooks**: For reusable logic and state management
- **localStorage**: For persistent vote state with error handling
- **Context API**: For global error handling and user feedback

### Configuration Constants

The application uses configurable constants for easy tuning:

```typescript
const TRENDING_INTERVAL_MS = 30000; // 30 seconds for trending calculations
const POLLING_INTERVAL_MS = 3000; // 3 seconds for live updates
const VOTE_PROBABILITY = 0.3; // 30% chance of receiving votes
const MAX_VOTE_INCREMENT = 3; // Maximum votes per update
```

## 🧪 Testing

The application includes comprehensive tests covering:

- **Component testing**: All components are tested with React Testing Library
- **Hook testing**: Custom hooks are tested for proper behavior and error handling
- **Integration testing**: End-to-end user interactions and voting flows
- **Error handling**: Error boundaries, error states, and validation
- **Accessibility**: Keyboard navigation and screen reader support
- **Mobile responsiveness**: Cross-device compatibility testing

### Test Coverage

- **Statement coverage**: 75.75%
- **Branch coverage**: 75.34%
- **Function coverage**: 76%
- **Line coverage**: 74.69%

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🎨 Styling

The application uses:

- **Tailwind CSS**: For utility-first styling and responsive design
- **Material-UI Icons**: For consistent iconography and accessibility
- **Responsive design**: Mobile-first approach with breakpoints for all devices
- **CSS Grid & Flexbox**: For modern layout techniques

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for local development:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### TypeScript

The project is fully typed with TypeScript and strict type checking:

```bash
npm run type-check
```

### Code Quality Tools

- **ESLint**: Code linting with TypeScript support
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit validation
- **Lint-staged**: Run linters on staged files only

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Requirements

- Node.js >= 18.0.0
- npm >= 8.0.0

## 📱 Browser Support

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## 🔒 Error Handling

The application implements comprehensive error handling:

- **Error boundaries**: Catch and display React component errors
- **Global error Context**: Centralized error management with user-friendly messages
- **Validation**: Input validation with clear error feedback
- **Network error handling**: Graceful handling of API failures
- **localStorage error handling**: Fallback for storage issues
- **Type safety**: TypeScript prevents many runtime errors

## 🎯 Clean Code Principles

The codebase follows clean code principles:

- **Single responsibility**: Each function and component has one clear purpose
- **DRY (don't repeat yourself)**: Reusable hooks and utilities
- **KISS (keep it simple)**: Simple, readable code without complexity
- **SOLID principles**: Proper separation of concerns and dependencies
- **Meaningful names**: Descriptive variable and function names
- **Small functions**: Functions are kept small and focused
- **No magic numbers**: All important values are named constants
