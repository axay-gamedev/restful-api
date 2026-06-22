# User API

A simple REST API built with Express and MongoDB (via Mongoose) for managing users. Supports creating, reading, updating, and deleting user records, plus a basic HTML listing page.

## Features

- Create a user
- Get all users (JSON)
- Get a single user by ID
- Update a user (partial updates supported)
- Delete a user
- HTML view listing all users

## Tech Stack

- [Express](https://expressjs.com/) – web framework
- [Mongoose](https://mongoosejs.com/) – MongoDB object modeling
- [MongoDB](https://www.mongodb.com/) – database

## Prerequisites

- Node.js (v14+ recommended)
- MongoDB running locally on `mongodb://127.0.0.1:27017`

## Installation

```bash
git clone <repo-url>
cd <repo-folder>
npm install
```

## Running the Server

Make sure MongoDB is running locally, then start the server:

```bash
node index.js
```

The server will start on:

```
http://localhost:8000
```

You should see `MongoDB connected` and `server started` in the console.

## User Schema

| Field     | Type   | Required | Unique |
|-----------|--------|----------|--------|
| firstName | String | Yes      | No     |
| lastName  | String | No       | No     |
| email     | String | Yes      | Yes    |
| jobTitle  | String | No       | No     |
| gender    | String | No       | No     |

## API Endpoints

### Get all users (HTML view)
```
GET /users
```
Returns a simple HTML unordered list of users (first name and email).

### Get all users (JSON)
```
GET /api/users
```
Returns an array of all user documents in JSON format.

### Create a user
```
POST /api/users
```
**Body (form-urlencoded):**

| Field      | Required |
|------------|----------|
| first_name | Yes      |
| last_name  | Yes      |
| email      | Yes      |
| gender     | Yes      |
| job_title  | Yes      |

**Example (curl):**
```bash
curl -X POST http://localhost:8000/api/users \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "first_name=John&last_name=Doe&email=john@example.com&gender=male&job_title=Developer"
```

**Responses:**
- `201` – `{ "msg": "success" }`
- `400` – `{ "msg": "All fields are req ... " }` (if any field is missing)

### Get a single user
```
GET /api/users/:id
```
Returns the user document matching the given MongoDB `_id`.

### Update a user
```
PATCH /api/users/:id
```
**Body (form-urlencoded, all optional):** `first_name`, `last_name`, `job_title`, `email`, `gender`

Only the fields provided will be updated.

**Example:**
```bash
curl -X PATCH http://localhost:8000/api/users/<id> \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "job_title=Senior Developer"
```

### Delete a user
```
DELETE /api/users/:id
```
Deletes the user matching the given `_id`.

## Known Issues

A few bugs exist in the current implementation and should be fixed before production use:

1. **Typo in POST handler**: `laštName` should be `lastName` in the `User.create()` call (the special character will cause `lastName` to never actually be saved).
2. **PATCH validation bug**: the `else res.status(400)` is only attached to the `gender` check, so a request with no fields at all will still return a `200` with `{ status: "sucess" }` instead of a `400` error.
3. **Multiple sequential DB writes in PATCH**: each field triggers a separate `findByIdAndUpdate` call instead of building a single update object and writing once.
4. **Spelling**: `"sucess"` should be `"success"`.
5. **Unused import**: `fs` is required but never used.
6. **No centralized error handling**: invalid IDs (e.g. malformed ObjectId) will throw unhandled errors and crash the request instead of returning a clean `400`/`404`.

## License

MIT
