# Practice Backend with Node.js

This project is a practice backend application built with Node.js, Express, and TypeScript. It implements a task management system with user authentication.

## Features

- User registration and login
- JWT-based authentication
- CRUD operations for tasks
- Task filtering and pagination
- Refresh token mechanism

## Technologies Used

- Node.js
- Express.js
- TypeScript
- MySQL
- JSON Web Tokens (JWT)
- Bcrypt for password hashing
- Zod for schema validation

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up your MySQL database
4. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   DATABASE_HOST=your_database_host
   DATABASE_PORT=your_database_port
   DATABASE_USER=your_database_user
   DATABASE_PASSWORD=your_database_password
   DATABASE_NAME=your_database_name
   JWT_SECRET=your_jwt_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   CLIENT_URL=http://localhost:3000
   ```
5. Run the development server:
   ```
   npm run dev
   ```

## API Endpoints

### User Routes

- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- POST /api/auth/refresh-token - Refresh access token
- GET /api/auth/protected - Protected route (requires authentication)

### Task Routes

- POST /api/task/create - Create a new task
- GET /api/task/get/all - Get all tasks (with pagination and filtering)
- GET /api/task/get/:id - Get a specific task
- PUT /api/task/update/:id - Update a task
- PUT /api/task/update/status/:id - Update task status
- DELETE /api/task/delete/:id - Delete a task

## Project Structure

- `src/` - Source code
  - `config/` - Database configuration
  - `controllers/` - Request handlers
  - `middleware/` - Custom middleware
  - `models/` - Data models
  - `routes/` - API routes
  - `schemas/` - Zod schemas for validation
  - `utils/` - Utility functions
  - `index.ts` - Main application file

## Scripts

- `npm run build` - Build the TypeScript code
- `npm start` - Start the production server
- `npm run dev` - Start the development server with hot-reloading

## Contributing

Feel free to submit pull requests or create issues for bugs and feature requests.

## License

This project is licensed under the ISC License.
