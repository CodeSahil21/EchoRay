# User API Routes Documentation

## 1. Register User

**Endpoint:** `POST /api/v1/user/register`

**Description:** Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response (201 Created):**
```json
{
  "msg": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "createdAt": "2025-06-15T12:34:56.789Z"
  },
  "token": "<jwt-token>"
}
```

**Response (400 Bad Request):**
```json
{
  "error": "Email already exists"
}
```

---

## 2. Login User

**Endpoint:** `POST /api/v1/user/login`

**Description:** Login to an existing user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response (200 OK):**
```json
{
  "msg": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com"
  },
  "token": "<jwt-token>"
}
```

**Response (400 Bad Request):**
```json
{
  "error": "Invalid email or password"
}
```

---

## 3. Get User Profile

**Endpoint:** `GET /api/v1/user/profile`

**Description:** Get the authenticated user's profile details. Requires authentication (JWT in Authorization header or cookie).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "createdAt": "2025-06-15T12:34:56.789Z"
  }
}
```

**Response (401 Unauthorized):**
```json
{
  "error": "Unauthorized"
}
```

---

## 4. Logout User

**Endpoint:** `GET /api/v1/user/logout`

**Description:** Logout the authenticated user. Requires authentication.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "msg": "Logout successful"
}
```

---

## 5. Get All Users

**Endpoint:** `GET /api/v1/user/getAll`

**Description:** Get all users except the currently authenticated user. Requires authentication.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "msg": "All users fetched successfully",
  "users": [
    {
      "id": 2,
      "email": "otheruser@example.com",
      "createdAt": "2025-06-15T12:34:56.789Z"
    },
    // ...more users
  ]
}
```

**Response (401 Unauthorized):**
```json
{
  "error": "Unauthorized"
}
```

---

# Project API Routes Documentation

## 1. Create Project

**Endpoint:** `POST /api/v1/project/create`

**Description:** Create a new project. Requires authentication.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "name": "My Project"
}
```

**Response (201 Created):**
```json
{
  "msg": "Project created successfully",
  "project": {
    "id": 1,
    "name": "My Project",
    "users": [
      { "id": 1, "email": "user@example.com" }
    ],
    "createdAt": "2025-06-15T12:34:56.789Z"
  }
}
```

**Response (400 Bad Request):**
```json
{
  "error": "Project name already exists"
}
```

---

## 2. Get All Projects

**Endpoint:** `GET /api/v1/project/getAll`

**Description:** Get all projects for the authenticated user. Requires authentication.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "msg": "All projects fetched successfully",
  "projects": [
    {
      "id": 1,
      "name": "My Project",
      "users": [
        { "id": 1, "email": "user@example.com" }
      ],
      "createdAt": "2025-06-15T12:34:56.789Z"
    }
    // ...more projects
  ]
}
```

---

## 3. Add Users to Project

**Endpoint:** `POST /api/v1/project/addUsers`

**Description:** Add users to a project. Requires authentication.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "projectId": 1,
  "users": [2, 3]
}
```

**Response (200 OK):**
```json
{
  "msg": "Users added to project successfully",
  "project": {
    "id": 1,
    "name": "My Project",
    "users": [
      { "id": 1, "email": "user@example.com" },
      { "id": 2, "email": "user2@example.com" },
      { "id": 3, "email": "user3@example.com" }
    ],
    "createdAt": "2025-06-15T12:34:56.789Z"
  }
}
```

**Response (400 Bad Request):**
```json
{
  "error": "User does not belong to this project"
}
```

---

## 4. Get Project By ID

**Endpoint:** `GET /api/v1/project/get-project/:projectId`

**Description:** Get a project by its ID. Requires authentication.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "project": {
    "id": 1,
    "name": "My Project",
    "users": [
      { "id": 1, "email": "user@example.com" },
      { "id": 2, "email": "user2@example.com" }
    ],
    "createdAt": "2025-06-15T12:34:56.789Z"
  }
}
```

**Response (404 Not Found):**
```json
{
  "error": "Project not found"
}
```

---

# AI API Routes Documentation

## 1. Get AI Result

**Endpoint:** `GET /api/v1/ai/get-result`

**Description:** Generate an AI result based on a prompt. Returns the AI-generated result for the given prompt as plain text (not JSON). No authentication required by default (update if you add auth).

**Query Parameters:**
```
prompt: string (required)
```

**Example Request:**
```
GET /api/v1/ai/get-result?prompt=Write%20a%20hello%20world%20program%20in%20Python
```

**Response (200 OK):**
```
<plain text response from AI>
```

**Example:**
```
print('Hello, world!')
```

**Response (500 Internal Server Error):**
```json
{
  "msg": "Error during AI result generation"
}
```
