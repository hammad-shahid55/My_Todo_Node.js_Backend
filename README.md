# Todo Backend API

Express-based REST API for managing personal tasks with user authentication, built on the Bun runtime and MongoDB Atlas.

---

## Features

- CRUD operations for tasks (create, read, update, delete, and bulk delete)
- User signup and login with password hashing (bcrypt) and JWT issuance
- Centralized environment configuration for easy deployment across environments
- Built with Bun for fast installs/startup and native ES module support

---

## Tech Stack

| Layer        | Technology |
|--------------|------------|
| Runtime      | [Bun](https://bun.com) v1.3+
| Web server   | Express 5
| Database     | MongoDB (official Node driver)
| Auth         | bcrypt, jsonwebtoken

---

## Project Structure

```
backend/
├── config/
│   └── env.js            # Centralized environment variable loader
├── routes/
│   ├── authRoutes.js     # Signup & login endpoints
│   └── taskRoutes.js     # Task CRUD endpoints
├── dbconfig.js           # MongoDB connection helper
├── index.js              # Express bootstrap & route mounting
├── package.json
└── README.md
```

---

## Prerequisites

- Bun v1.3.0 or later (`curl -fsSL https://bun.sh/install | bash`)
- MongoDB Atlas or self-hosted MongoDB URI

---

## Environment Variables

Create a `.env` file in the project root (see `.gitignore`). All values are required unless noted:

| Variable           | Description                                  |
|--------------------|----------------------------------------------|
| `PORT`             | Port the API server listens on               |
| `MONGODB_URI`      | MongoDB connection string                    |
| `DB_NAME`          | Database name for tasks & users              |
| `COLLECTION_NAME`  | MongoDB collection for tasks                 |
| `USERS_COLLECTION` | MongoDB collection for user profiles         |
| `JWT_SECRET`       | Secret used to sign authentication tokens    |

Example:

```
PORT=3200
MONGODB_URI=mongodb+srv://...
DB_NAME=todo-backend
COLLECTION_NAME=todo
USERS_COLLECTION=users
JWT_SECRET=change-me
```

---

## Installation & Local Development

1. Install dependencies:
   ```bash
   bun install
   ```
2. Start the server:
   ```bash
   bun run index.js
   ```
3. The API will be available at `http://localhost:<PORT>`.

---

## API Reference

Base URL: `http://localhost:<PORT>`

### Health Check
| Method | Endpoint | Description          |
|--------|----------|----------------------|
| GET    | `/`      | Returns service info |

### Task Endpoints
| Method | Endpoint              | Description                     |
|--------|-----------------------|---------------------------------|
| POST   | `/add-task`           | Create a new task               |
| GET    | `/tasks`              | List all tasks                  |
| PUT    | `/update-task/:id`    | Update a task by Mongo ID       |
| DELETE | `/delete-task/:id`    | Delete a task by Mongo ID       |
| DELETE | `/delete-all-tasks`   | Delete every task document      |

Sample request:

```bash
curl -X POST http://localhost:3200/add-task \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn Bun","completed":false}'
```

### Auth Endpoints
| Method | Endpoint   | Description            |
|--------|------------|------------------------|
| POST   | `/signup`  | Register a new user    |
| POST   | `/login`   | Authenticate and get JWT |

Both endpoints expect JSON payloads:

```json
// POST /signup
{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "password": "strongpass"
}

// POST /login
{
  "email": "jane@example.com",
  "password": "strongpass"
}
```

Successful responses include a `token` you can use in future authenticated routes (if/when added) via `Authorization: Bearer <token>` headers.

---

## Notes

- All database connections are lazily created using the helper in `dbconfig.js` to avoid multiple client instances.
- Remember to keep `.env` values out of version control and rotate your `JWT_SECRET` if leaked.

---

## Troubleshooting

- **`Missing MONGODB_URI environment variable`**: Ensure `.env` is populated before starting the server.
- **Cannot connect to MongoDB Atlas**: Allow your IP in Atlas Network Access and verify the URI string.
- **JWT errors**: Confirm `JWT_SECRET` is set and consistent across deployments.

---

## License

This project is provided as-is for educational purposes. Adapt freely for your own Todo applications.
