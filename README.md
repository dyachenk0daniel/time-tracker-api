# Time Tracker API

Welcome to the **Time Tracker API**! This API allows users to efficiently manage their time entries, track productivity, and streamline the time tracking process. Whether you're managing tasks, projects, or just tracking your daily work, this API provides a simple and reliable way to keep everything in check.

## Features

- **Create and Manage Time Entries**: Track time spent on specific tasks or projects.
- **Update and Edit Entries**: Modify existing time entries with ease.
- **Track Productivity**: Monitor work time and improve your overall efficiency.
- **User Management**: Manage users with simple authentication via JWT.
- **Error Handling**: Clear error responses to help you troubleshoot any issues.

## API Documentation

For detailed documentation on how to use the API, visit: [API Documentation](http://localhost:3000/api-docs)

## Installation

### Requirements

- Node.js (>=14.x)
- PostgreSQL (for database management)

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
   DB_URL=your_database_connection_url
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=1h
    ```

4. Run the application:

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

The API uses JWT (JSON Web Tokens) for authentication. To access protected routes, you need to include the `Authorization` header in your requests, like so:

```bash
Authorization: Bearer <your_jwt_token>
