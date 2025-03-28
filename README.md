# Time Tracker API

Time Tracker API is a simple time management application that allows users to track the time spent on tasks.

## Features

- **User Management**: User registration and authentication.
- **Time Tracking**: Track time spent on tasks and manage time entries.

## API Documentation

For detailed documentation on how to use the API, visit: [API Documentation](http://localhost:3000/api-docs)

Before accessing the documentation, make sure to start the project by running:

```bash
npm install
npm run dev
```

## Installation

### Requirements

- Node.js (>=14.x)
- PostgreSQL (for database management)
- Redis (for in memory database management)

### Getting Started

1. Clone the repository:

    ```bash
    git clone https://github.com/dyachenk0daniel/time-tracker-api.git
    cd time-tracker-api
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Set up your environment variables in a `.env` file:

    ```
   HOST=localhost
   PORT=3000
   JWT_SECRET=super_secret_key
   JWT_EXPIRES_IN=1h
   REFRESH_SECRET=another_secret_key
   
   # 7 days (in seconds)
   REFRESH_EXPIRES_IN=604800
   POSTGRESQL_URL=postgresql_connection_url
   REDIS_URL=redis_connection_url
    ```

4. Apply database migrations using Prisma:
   ```bash
   npx prisma migrate dev --name init
   ```

5. Run the application:

    ```bash
    npm run build
    npm run start
    ```

   The server will be running at `http://localhost:3000`.

## Endpoints

Here are the main endpoints available in the API:

- **POST /auth/login**: Log in and receive a JWT token
- **POST /auth/register**: Register a new user
- **POST /users**: Create a new user
- **GET /users/{id}**: Get user details
- **GET /time-entries**: Get time entry list
- **GET /time-entries/{id}**: Get time entry details
- **POST /time-entries**: Create a new time entry
- **PUT /time-entries/:id/stop**: Stop a time entry
- **DELETE /time-entries/{id}**: Delete a time entry

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. To access protected routes, you need to include the
`Authorization` header in your requests, like so:

```bash
Authorization: Bearer <your_jwt_token>
