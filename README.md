# Algorithm Visualizer

A comprehensive platform for visualizing and learning algorithms with an interactive React frontend and Node.js backend.

## Project Structure

```
algorithm-visualizer/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components
│   │   ├── algorithms/      # Algorithm implementations
│   │   ├── utils/           # Utility functions
│   │   └── __tests__/       # Test files
│   ├── public/              # Static assets
│   ├── package.json         # Frontend dependencies
│   └── vite.config.js       # Vite configuration
├── backend/                 # Node.js backend server
│   ├── server.js           # Main server file
│   ├── algorithms/         # Algorithm implementations
│   ├── models/             # Database models
│   ├── scripts/            # Database scripts
│   └── package.json        # Backend dependencies
├── package.json            # Root package.json for scripts
└── README.md              # This file
```

## Features

- **Interactive Algorithm Visualization**: Visualize sorting, searching, graph, and dynamic programming algorithms
- **Code Editor**: Built-in Monaco editor for writing and testing algorithms
- **User Authentication**: Sign up, sign in, and user progress tracking
- **Responsive Design**: Modern UI with Tailwind CSS and Framer Motion animations
- **Real-time Visualization**: Step-by-step algorithm execution with animations

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (for backend)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd algorithm-visualizer
```

2. Install all dependencies:
```bash
npm run install:all
```

3. Set up environment variables:
```bash
# Copy the example environment file
cp env.example .env

# Edit .env with your configuration
```

4. Start the development servers:
```bash
npm run dev
```

This will start both frontend (http://localhost:5173) and backend (http://localhost:5000) servers.

### Individual Commands

- **Frontend only**: `npm run dev:frontend`
- **Backend only**: `npm run dev:backend`
- **Build frontend**: `npm run build:frontend`
- **Run tests**: `npm test`
- **Lint code**: `npm run lint`

## Available Algorithms

### Sorting Algorithms
- Bubble Sort
- Selection Sort
- Insertion Sort
- Merge Sort
- Quick Sort
- Heap Sort
- Radix Sort

### Searching Algorithms
- Linear Search
- Binary Search

### Graph Algorithms
- Breadth-First Search (BFS)
- Depth-First Search (DFS)
- Dijkstra's Algorithm

### Dynamic Programming
- Longest Common Subsequence
- Knapsack Problem
- Grid Paths

### Recursion
- Factorial
- Fibonacci
- N-Queens Problem

### Binary Trees
- Inorder Traversal
- Preorder Traversal
- Postorder Traversal

## Technology Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- Framer Motion
- Monaco Editor
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt
- CORS
- Helmet

## Development

### Adding New Algorithms

1. Create algorithm implementation in `frontend/src/algorithms/`
2. Add visualization component in `frontend/src/components/`
3. Create page component in `frontend/src/pages/`
4. Add routing in the main App component

### Database

The application uses MongoDB for storing user data, progress, and algorithm submissions.

- **Seed database**: `npm run seed` (in backend directory)
- **Reset database**: `npm run reset-db` (in backend directory)

## Deployment

### Docker

The project includes Docker configuration for easy deployment:

```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Manual Deployment

1. Build the frontend:
```bash
npm run build:frontend
```

2. Start the backend:
```bash
npm run start:backend
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.