[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=24068623&assignment_repo_type=AssignmentRepo)

# News Aggregator API

A REST API that fetches news from GNews based on user preferences, with JWT auth and article bookmarking.

## Installation

```bash
npm install
```

## Environment variables

Copy `.env.example` to `.env` and fill in the values before starting:

```
JWT_SECRET=<long random string>
GNEWS_API_KEY=<your GNews API key>
PORT=3000          # optional, defaults to 3000
```

## Run

```bash
npm start
```

Server runs on `http://localhost:${PORT}` (default 3000).

> **Note:** the data store is in-memory. All users, preferences, and article history are reset when the server restarts.

## Test

```bash
npm run test
```

---

## API Endpoints

All protected routes require: `Authorization: Bearer <token>`

### Auth

| Method | Endpoint         | Description       | Auth |
|--------|-----------------|-------------------|------|
| POST   | /users/register | Register a user   | No   |
| POST   | /users/login    | Login, get token  | No   |

### Preferences

| Method | Endpoint            | Description              | Auth |
|--------|---------------------|--------------------------|------|
| GET    | /users/preferences  | Get user preferences     | Yes  |
| PUT    | /users/preferences  | Update user preferences  | Yes  |

### News

| Method | Endpoint              | Description                        | Auth |
|--------|-----------------------|------------------------------------|------|
| GET    | /news                 | Fetch news by user preferences     | Yes  |
| GET    | /news/search/:keyword | Search news by keyword             | Yes  |
| GET    | /news/read            | Get articles marked as read        | Yes  |
| GET    | /news/favorites       | Get articles marked as favorite    | Yes  |
| POST   | /news/:id/read        | Mark an article as read            | Yes  |
| POST   | /news/:id/favorite    | Mark an article as favorite        | Yes  |

---

### Signup

```
POST /users/register
```
```json
{
  "name": "Clark Kent",
  "email": "clark@example.com",
  "password": "secret123",
  "preferences": ["technology", "sports"]
}
```

### Login

```
POST /users/login
```
```json
{
  "email": "clark@example.com",
  "password": "secret123"
}
```
Returns `{ "token": "..." }`

### Update Preferences

```
PUT /users/preferences
Authorization: Bearer <token>
```
```json
{ "preferences": ["movies", "gaming"] }
```
