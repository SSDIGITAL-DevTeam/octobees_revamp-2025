# API Documentation

docker


## Overview

This document describes the RESTful API for the application. The API enables authentication, user management, admin features, scheduling, and queue management.

---

## Base URL

```
https://klinigma-api.vercel.app/api
```

---

## Authentication

### Base Path: `/auth`

| Method | Endpoint         | Description                         | Authorization Required |
| ------ | ---------------- | ----------------------------------- | ---------------------- |
| POST   | `/login`         | Authenticate user and return a JWT. | No                     |
| POST   | `/register`      | Register a new user.                | No                     |
| POST   | `/logout`        | Logout user and invalidate the JWT. | Yes                    |
| POST   | `/refresh-token` | Refresh an expired token.           | No                     |

---

## Users

### Base Path: `/users`

| Method      | Endpoint | Description                           | Authorization Required |
| ----------- | -------- | ------------------------------------- | ---------------------- |
| GET         | `/`      | Retrieve a list of all users.         | Yes                    |
| GET         | `/:id`   | Get details of a specific user by ID. | Yes                    |
| POST        | `/`      | Add a new user.                       | Yes                    |
| PUT / PATCH | `/:id`   | Update a user by ID.                  | Yes                    |
| DELETE      | `/:id`   | Delete a user by ID.                  | Yes                    |

---

## Admins

### Base Path: `/admins`

| Method      | Endpoint | Description                            | Authorization Required |
| ----------- | -------- | -------------------------------------- | ---------------------- |
| GET         | `/`      | Retrieve a list of all admins.         | Yes                    |
| GET         | `/:id`   | Get details of a specific admin by ID. | Yes                    |
| POST        | `/`      | Add a new admin.                       | Yes                    |
| PUT / PATCH | `/:id`   | Update an admin by ID.                 | Yes                    |
| DELETE      | `/:id`   | Delete an admin by ID.                 | Yes                    |

---

## Schedules

### Base Path: `/schedules`

| Method      | Endpoint | Description                         | Authorization Required |
| ----------- | -------- | ----------------------------------- | ---------------------- |
| GET         | `/`      | Retrieve a list of all schedules.   | Yes                    |
| GET         | `/:id`   | Get details of a specific schedule. | Yes                    |
| POST        | `/`      | Add a new schedule.                 | Yes                    |
| PUT / PATCH | `/:id`   | Update a schedule by ID.            | Yes                    |
| DELETE      | `/:id`   | Delete a schedule by ID.            | Yes                    |

---

## Polyclinics

### Base Path: `/polyclinics`

| Method      | Endpoint | Description                           | Authorization Required |
| ----------- | -------- | ------------------------------------- | ---------------------- |
| GET         | `/`      | Retrieve a list of all polyclinics.   | Yes                    |
| GET         | `/:id`   | Get details of a specific polyclinic. | Yes                    |
| POST        | `/`      | Add a new polyclinic.                 | Yes                    |
| PUT / PATCH | `/:id`   | Update a polyclinic by ID.            | Yes                    |
| DELETE      | `/:id`   | Delete a polyclinic by ID.            | Yes                    |

---

## Queues

### Base Path: `/queues`

| Method      | Endpoint | Description                      | Authorization Required |
| ----------- | -------- | -------------------------------- | ---------------------- |
| GET         | `/`      | Retrieve a list of all queues.   | Yes                    |
| GET         | `/:id`   | Get details of a specific queue. | Yes                    |
| POST        | `/`      | Add a new queue.                 | Yes                    |
| PUT / PATCH | `/:id`   | Update a queue by ID.            | Yes                    |
| DELETE      | `/:id`   | Delete a queue by ID.            | Yes                    |

---

## Middleware

### Applied Middleware

**Authentication (`verifyToken`)**: Protects sensitive endpoints.

---

## Example Request/Response

### Login

**Request**

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "example.klinigma.com",
  "password": "securepassword"
}
```

**Response**

```json
{
  "accessToken": "asdasuhdasjkjnasnjbj67343924ghgavhdv2423..."
}
```

---

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/hatchuuu/klinigma-api.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the `.env` file:

   ```env
   PORT=5000
   DATABASE_URL=your-database
   ACCESS_TOKEN_SECRET=your-jwt-secret
   REFRESH_TOKEN_SECRET=your-jwt-secret
   ```

4. Start the server:

   ```bash
   npm run start
   ```

5. Access the API at `http://localhost:5000/api`.

---

## License

[MIT License](LICENSE)

## Author

Developed by [Kusuma Nayr ♻](https://github.com/hatchuu).
