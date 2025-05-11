# Note Taking API - Problem Statement

## Overview
Build a "Note Taking" API using ExpressJS, MySQL, and Redis, demonstrating expertise in modern JavaScript, ORM (preferably Sequelize), caching with Redis, Docker, and design patterns. The application must address version control, concurrency during updates, and efficient full-text search, with comprehensive documentation of the approach and trade-offs.

## Requirements

### 1. Application Functionality
- Implement a versioning system for notes to:
  - Track changes to a note over time
  - Revert to previous versions of a note
- Ensure concurrent update protection using optimistic locking or similar strategies
- Implement efficient full-text search for retrieving notes by keywords

### 2. Database Requirements
- Utilize Sequelize ORM for MySQL database interaction
- Design a robust database schema with:
  - Tables for users and notes
  - Optimized indices for full-text search
  - User-note relationships
  - Soft deletion support for historical tracking

### 3. API Endpoints
- User Registration: Create accounts with secure password hashing
- User Login: Authenticate and return access tokens
- Create Note: With versioning support
- Retrieve All Notes: For authenticated users
- Retrieve Notes by Keywords: Full-text search functionality
- Retrieve Specific Note: By ID
- Update Note: With concurrency handling
- Delete Note: Soft deletion preserving version history

### 4. Caching
- Use Redis for performance improvement on frequently accessed endpoints
- Implement cache invalidation strategies for data consistency

### 5. Containerization
- Utilize Docker and Docker Compose

### 6. Design Patterns
- Apply Singleton Pattern appropriately

### 7. Documentation
- Clear instructions for running and testing the application
- Technical analysis document outlining:
  - Problem approach
  - Implementation reasoning
  - Trade-offs and their impact on scalability, performance, and maintainability

## Bonus Features
1. Note-sharing functionality with permission controls
2. Multimedia file attachments
3. Refresh token mechanism for session management

## Assessment Criteria
The assessment evaluates implementation of required features, code quality, maintainability, design patterns, ORM usage, caching strategies, authentication security, error handling, documentation quality, and thoughtful approach to trade-offs and scalability.

## Submission
Public GitHub Repository with complete code and documentation.