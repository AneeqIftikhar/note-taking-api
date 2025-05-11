# Note Taking API

## Overview
This project is a "Note Taking" API built using ExpressJS, MySQL, and Redis. It demonstrates expertise in modern JavaScript, ORM (preferably Sequelize), caching with Redis, Docker, and design patterns. The application addresses version control, concurrency during updates, and efficient full-text search, with comprehensive documentation of the approach and trade-offs.

## Features
- Versioning system for notes to track changes and revert to previous versions.
- Concurrent update protection using optimistic locking.
- Efficient full-text search for retrieving notes by keywords.
- User registration and login with secure password hashing.
- Soft deletion preserving version history.
- Redis caching for performance improvement.
- Docker and Docker Compose for containerization.

## Requirements
- Node.js
- MySQL
- Redis
- Docker

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/AneeqIftikhar/note-taking-api.git
    cd note-taking-api
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:
    - Create a `.env` file in the root directory.
    - Add the following variables:
      ```
      NODE_ENV=development
      PORT=3000
      DB_HOST=mysql
      DB_PORT=3306
      DB_NAME=note_taking_db
      DB_USER=root
      DB_PASSWORD=your_mysql_password
      REDIS_HOST=redis
      REDIS_PORT=6379
      JWT_SECRET=your_jwt_secret_key_here
      FORCE_SYNC=false
      ```

4. Start the application using Docker Compose:
    ```bash
    docker-compose up
    ```

## Running and Testing the Application
- To run the application, ensure Docker is installed and running on your machine. Use the command `docker-compose up` to start all services.
- For testing, use the command `npm test` to run the test suite. Ensure that the database and Redis services are running before executing tests.

## Technical Analysis

### Problem Approach
The application is designed to handle note-taking with features like version control, concurrency management, and full-text search. It uses ExpressJS for the server, MySQL for data storage, and Redis for caching.

### Implementation Reasoning
- **Version Control:** Implemented using Sequelize models to track changes and revert to previous versions.
- **Concurrency:** Managed using optimistic locking to prevent conflicts during updates.
- **Full-Text Search:** Utilized MySQL's full-text indexing for efficient keyword-based retrieval.

### Trade-offs
- **Scalability:** Using Docker ensures the application can be easily scaled across different environments.
- **Performance:** Redis caching improves response times for frequently accessed endpoints.
- **Maintainability:** The use of Sequelize ORM simplifies database interactions and schema management.

## Contribution
Feel free to fork the repository and submit pull requests for improvements or bug fixes.

## License
This project is licensed under the ISC License.