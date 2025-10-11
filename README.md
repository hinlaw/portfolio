# Dexter's Portfolio

A modern portfolio website built with Next.js frontend and Go backend using a monorepo architecture.

## 🏗️ Project Structure

```
portfolio/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App Router pages and components
│   ├── components/           # Reusable UI components
│   ├── lib/                 # Utility functions and API client
│   └── package.json         # Frontend dependencies
├── backend/                  # Go backend API
│   ├── cmd/api/             # Application entry point
│   ├── internal/            # Internal packages
│   │   ├── handlers/        # HTTP request handlers
│   │   ├── models/          # Data models
│   │   └── middleware/      # Middleware functions
│   └── go.mod              # Go module dependencies
├── docker-compose.yml        # Local development environment
├── Dockerfile.frontend       # Frontend Docker image
├── Dockerfile.backend        # Backend Docker image
└── README.md                # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Go 1.21+
- Docker and Docker Compose (optional)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio
   ```

2. **Start the backend**
   ```bash
   cd backend
   go run cmd/api/main.go
   ```
   The backend will be available at `http://localhost:8080`

3. **Start the frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The frontend will be available at `http://localhost:3000`

### Docker Development

1. **Build and start all services**
   ```bash
   docker-compose up --build
   ```

2. **Access the applications**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080

## 📡 API Endpoints

The Go backend provides the following REST API endpoints:

### Health Check
- `GET /api/health` - Check backend health status

### Categories
- `GET /api/categories` - Get portfolio categories

### Contact Form
- `POST /api/contact` - Submit contact form
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Project Inquiry",
    "message": "I'm interested in your services..."
  }
  ```

## 🛠️ Development

### Backend Development

The backend uses the Gin web framework and follows Go best practices:

- **Handlers**: HTTP request handlers in `internal/handlers/`
- **Models**: Data structures in `internal/models/`
- **Middleware**: CORS and other middleware in `internal/middleware/`

### Frontend Development

The frontend uses Next.js 15 with:

- **App Router**: Modern Next.js routing system
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **API Client**: Type-safe API communication in `lib/api.ts`

### Hot Reload Development

For backend hot reload during development, you can use Air:

```bash
# Install Air
go install github.com/cosmtrek/air@latest

# Run with hot reload
cd backend
air
```

## 🐳 Docker Deployment

### Production Build

1. **Build Docker images**
   ```bash
   docker build -f Dockerfile.backend -t portfolio-backend .
   docker build -f Dockerfile.frontend -t portfolio-frontend .
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

### Environment Variables

Copy `env.example` to `.env` and configure:

```bash
# Backend
PORT=8080
GIN_MODE=release

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## 🔧 Technologies Used

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Component library

### Backend
- **Go 1.21+** - Programming language
- **Gin** - Web framework
- **CORS** - Cross-origin resource sharing

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📝 API Response Format

All API responses follow this standard format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.