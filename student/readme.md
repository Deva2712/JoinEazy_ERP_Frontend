# Frontend Documentation

This repository contains the frontend application, including configuration, setup instructions, and environment details for both development and production deployments.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Prerequisites](#prerequisites)
- [Running the Application](#running-the-application)
    - [Using Docker](#using-docker-recommended)
    - [Using NPM](#standard-npm-workflow-without-docker)
- [Development & Maintenance](#development--maintenance)
- [Production Environment](#environment-overview-production)
- [Development Environment](#environment-overview-development)
- [Dependencies](#dependencies)

---

## Getting Started

To get a local copy of the project up and running, follow these steps:

1. **Clone the repository**
   ```
   git clone https://github.com/ChiranjeeviNanda/joineazy-erp-frontend.git
   ```
2. **Navigate into the project directory**
   ```
   cd joineazy-erp-frontend
   ```
---

## Configuration

Before running the application, create a `.env` file and configure the following variables:

| Variable              | Description                                             |
| --------------------- | ------------------------------------------------------- |
| `NGINX_PORT`          | Port for NGINX (default: 3000 dev, 80 prod)             |
| `NGINX_SSL_PORT`      | SSL port for NGINX (default: 3443 dev, 443 prod)        |
| `VITE_API_BASE_URL`   | API base URL (e.g., http://YOUR_IP_ADDRESS:8000/api/v1) |
| `BACKEND_APP_API_URL` | Backend API URL (e.g., http://YOUR_IP_ADDRESS:8000)     |
| `SERVER_NAME`         | Server hostname or IP                                   |
| `SERVER_ENV`          | Environment (development or production)                 |
| `SSL_LOCATION`        | Path to SSL certificates (e.g., ./certs)                |
| `MODE`                | Vite mode (e.g., development)                           |
| `VITE_DEV_HOST`       | Dev server host (e.g., 0.0.0.0)                         |
| `VITE_HMR_HOST`       | HMR host                                                |

---

## Prerequisites

- Node.js (v20 or later)
- npm (bundled with Node.js)
- Docker and Docker Compose (recommended for deployment)

---

## Running the Application

### Using Docker (Recommended)

1. Install Docker and navigate to the project directory.
2. Copy environment file:
    ```
    cp .env.example .env
    ```
3. Update `.env` values as needed.

4. Run in production:

    ```
    docker-compose -f docker-compose.prod.yml up --build -d
    ```

5. Run in development:

    ```
    docker-compose -f docker-compose.dev.yml up --build
    ```

6. Open in browser:
    ```
    http://{SERVER_NAME}:{NGINX_PORT}/
    ```

---

### Standard NPM Workflow (Without Docker)

1. Install dependencies:

    ```
    npm install
    ```

2. Start development server:

    ```
    npm run start
    ```

    - Runs Vite (port 3000) with Tailwind watcher
    - Access at:
        ```
        http://{SERVER_NAME}:3000
        ```

3. Build production assets:

    ```
    npm run build
    ```

4. Preview production build:
    ```
    npm run preview
    ```

---

## Development & Maintenance

### Source Code Fallbacks

While the application primarily relies on the `.env` file, the following files contain hardcoded fallback IP addresses/URLs.

These fallback values can be optionally updated to ensure the application continues to function correctly if fetching variables from `.env` fails:

- `src/api/config.js`
- `src/services/auth.js`

---

### Logs and SSL

- Logs are stored in the `logs/` directory
- SSL certificates should be placed in `SSL_LOCATION`
- Nginx redirects all 404 requests to `/` for SPA routing compatibility

---

## Environment Overview (Production)

This section describes the Docker setup for running the production environment. It includes the configuration files for Docker Compose and the Dockerfile used to build and serve the frontend application.

### In Summary

- The server listens for requests on port 80 (or any other port specified in the configuration) and serves static files from the `build` directory
- The frontend React application is configured to send all API requests to the `/api/` directory (or any other specified in `REACT_APP_API_URL` environment variables) to avoid CORS and browser-related issues
- The Nginx server proxies API requests from `/api/` to the `BACKEND_APP_API_URL`
- The backend server processes and responds to API requests
- `SERVER_ENV` is used to specify and map the required SSL certificate and private key

---

### Docker Compose

The `docker-compose.prod.yml` file defines a single service, **frontend**, which is configured with all the necessary environment variables from the `.env` file.

Additionally, the logs directory is mounted to the Nginx log directory to simplify access to log files.

---

### Dockerfile

The `Dockerfile.prod` uses the **node:20** image to:

- Copy required files
- Install dependencies using `npm install`
- Generate the production `build` directory

The **nginx:1.21-alpine** image is then used to:

- Serve the application using the generated build files
- Copy necessary configuration files into the container
- Expose ports **80** and **443**
- Execute the entrypoint script from the Nginx directory

---

### Nginx Server

- `default_prod.template`:
    - Defines the root Nginx server configuration
    - Listens on port 80
    - Dynamically sets server name and log directories using environment variables
    - Optimizes request handling with tuned buffer and header sizes
    - Redirects all 404 errors to the homepage (SPA support)

- Routing:
    - `location /`: Serves frontend build files and handles client-side routing
    - `location /api/`:
        - Acts as a reverse proxy
        - Rewrites API paths from the frontend
        - Forwards requests to the backend API (`BACKEND_APP_API_URL`)
        - Prevents CORS issues via internal routing

- `nginx_prod.conf`:
    - Defines global `http` block configuration
    - Includes gzip compression and performance optimizations

- `logrotate.conf`:
    - Handles daily rotation of access and error logs
    - Shared across development and production

- `entrypoint_prod.sh`:
    - Runs during container startup
    - Converts `default_prod.template` into `default_prod.conf`
    - Injects environment variables into final configuration

---

## Environment Overview (Development)

This section describes the Docker setup for running the development environment. It includes the configuration files for Docker Compose and the Dockerfile used to build and serve the frontend application.

### In Summary

- The frontend and Nginx servers run independently on different ports
- The React development server runs on port **3000** and manages application files with HMR
- The Nginx server listens on port **80** and proxies requests to the frontend server
- The frontend sends API requests to `/api/` based on environment configuration
- Nginx proxies `/api/` requests to the backend API service to prevent CORS issues

---

### Docker Compose

The `docker-compose.dev.yml` file defines two services:

- **frontend**:
    - Runs the React development server
    - Mounts the working directory and logs directory for easier access

- **nginx**:
    - Runs as a separate service
    - Maps required environment variables
    - Mounts the logs directory for centralized logging

---

### Dockerfile

- `Dockerfile.dev` (frontend):
    - Copies necessary files into the container
    - Starts the React development server on port **3000**

- Nginx Dockerfile:
    - Copies required development configuration files
    - Executes the entrypoint script during startup

---

### Nginx Server

- `default_dev.template`:
    - Contains development server configuration

- Server behavior:
    - First server block:
        - Redirects `www` requests to non-`www` URLs

    - Second server block:
        - Listens on port **80**
        - Proxies all frontend requests to the React dev server (`frontend:3000`)
        - Routes API requests from `/api/` to the backend API service

- Networking:
    - Uses Docker internal networking to reference services directly
    - Ensures seamless communication between frontend, nginx, and backend

## Dependencies

### UI and Styling

- @fontsource (Montserrat, Playfair Display, Poppins, Roboto)
- @radix-ui
- lucide-react
- framer-motion
- tailwindcss
- react-type-animation

### Data and Logic

- @tanstack/react-query
- axios
- react-hook-form
- zod
- date-fns
- js-cookie

### Utilities

- @tsparticles
- jspdf
- jspdf-autotable
- react-markdown
- remark-gfm
- hashids

### Routing

- react-router-dom
- react-router-hash-link
- wouter

### Development

- @vitejs/plugin-react
- autoprefixer
- concurrently
- esbuild
- postcss
- vite

---

Refer to `package.json` for full dependency versions.
