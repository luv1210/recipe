# Recipe Sharing Platform API

A robust RESTful API for a recipe sharing platform with JWT authentication, Role-Based Access Control (RBAC), and multi-user support.

## Project Structure

- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT with HTTP-only Cookies
- **Middleware**: Custom Auth & Role-based authorization

---

## API Endpoints & Controller Methods

### 1. Authentication (`/api/v1/auth`)

| HTTP Method | Endpoint | Controller Method | Access | Description |
| :--- | :--- | :--- | :--- | :--- |
| POST | `/register` | `register` | Public | Register a new user/chef |
| POST | `/login` | `login` | Public | Login and receive JWT cookie |
| GET | `/logout` | `logout` | Private | Clear authentication cookie |
| GET | `/me` | `getMe` | Private | Get current user details |

### 2. Recipes (`/api/v1/recipes`)

| HTTP Method | Endpoint | Controller Method | Access | Description |
| :--- | :--- | :--- | :--- | :--- |
| GET | `/` | `getRecipes` | Public | Get all recipes with user info |
| POST | `/` | `createRecipe` | Private | Create a new culinary masterpiece |
| GET | `/myrecipes` | `getMyRecipes` | Private | Get recipes created by current user |
| GET | `/:id` | `getRecipe` | Public | Get details of a single recipe |
| PUT | `/:id` | `updateRecipe` | Private (Owner/Admin) | Update an existing recipe |
| DELETE | `/:id` | `deleteRecipe` | Private (Owner/Admin) | Delete a recipe |

### 3. Comments & Reviews

#### Nested under Recipes (`/api/v1/recipes/:recipeId/comments`)

| HTTP Method | Endpoint | Controller Method | Access | Description |
| :--- | :--- | :--- | :--- | :--- |
| GET | `/` | `getComments` | Public | View all comments for a recipe |
| POST | `/` | `addComment` | Private | Post a new comment on a recipe |

#### Direct Comment Management (`/api/v1/comments/:id`)

| HTTP Method | Endpoint | Controller Method | Access | Description |
| :--- | :--- | :--- | :--- | :--- |
| PUT | `/:id` | `updateComment` | Private (Owner/Admin) | Edit your comment |
| DELETE | `/:id` | `deleteComment` | Private (Owner/Admin) | Remove a comment |

---

## Features

- **RBAC**: Roles included in JWT payload (`admin`, `user`).
- **Data Integrity**: Automated linking between Users and Recipes.
- **Security**: Password hashing with `bcryptjs` and route protection middleware.
- **Population**: Mongoose `populate` for automatic fetching of referenced data.
