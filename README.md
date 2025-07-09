# Online Code Editor API

This is the backend service for a secure online code editor, built as my final portfolio project for the ALX Software Engineering program. The API allows users to register, manage code snippets, and execute code in various languages within a secure, containerized environment.

---

### Live API URL

The API is deployed on Render and is available at:
**`https://alx-portfolio-code-executor-api.onrender.com`**

---

## Key Features

*   **Secure User Authentication:** JWT-based authentication for user registration and login.
*   **Protected Routes:** Middleware to protect sensitive endpoints, ensuring only authenticated users can access them.
*   **Snippet Management (CRUD):** Full CRUD functionality for users to create, read, update, and delete their personal code snippets.
*   **Secure Code Execution:** The core feature of the application. Executes user-submitted code inside isolated, resource-limited Docker containers to prevent abuse and ensure security.
*   **Support for Multiple Languages:** Currently supports Python and JavaScript, with a structure that allows for easy expansion.

---

## Project Architecture

The application is a monolithic REST API built on the Node.js runtime. It follows a standard Model-View-Controller (MVC) pattern, adapted for an API-only service (Model-Route-Controller-Service).

1.  **Routes:** Define the API endpoints (e.g., `/api/auth/login`).
2.  **Middleware:** Intercepts requests for tasks like authentication (`protect` middleware).
3.  **Controllers:** Handle the request and response cycle and contain the main business logic.
4.  **Models:** Define the data structure (schemas) for MongoDB using Mongoose.
5.  **Execution Engine:** A core component within the `executionController` that interfaces with the system's command line to run Docker containers for sandboxed code execution.
6.  **Database:** A cloud-hosted MongoDB Atlas cluster for data persistence.
7.  **Deployment:** The application is containerized using a multi-stage `Dockerfile` and deployed on Render.

---

## Tech Stack

*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB with Mongoose ODM
*   **Authentication:** JSON Web Tokens (JWT), bcrypt.js
*   **Containerization:** Docker
*   **Deployment:** Render

---

## API Documentation

Comprehensive documentation for all API endpoints, including examples, is available through a public Postman collection.

**[View API Documentation](https://documenter.getpostman.com/view/46595562/2sB34eJhdH)**
---
## Getting Started (Running Locally)

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js
*   npm (Node Package Manager)
*   Git
*   Docker Desktop
*   A local or cloud-based MongoDB instance

### Installation

1.  Clone the repository:
    ```sh
    git clone https://github.com/LetaEmiru1/alx-portfolio-code-executor-api.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd alx-portfolio-code-executor-api
    ```
3.  Install NPM packages:
    ```sh
    npm install
    ```
4.  Create a `.env` file in the root directory and add the following variables:
    ```
    PORT=5000
    MONGO_URI=<YOUR_MONGODB_CONNECTION_STRING>
    JWT_SECRET=<YOUR_JWT_SECRET>
    ```
5.  Start the server:
    ```sh
    npm run dev
    ```

The API will be available at `http://localhost:5000`.
