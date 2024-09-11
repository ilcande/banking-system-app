# Banking System Application

The banking system aims to provide core banking functionalities, including account creation, transactions, and statement generation. It serves as a foundation for a comprehensive banking application.

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/ilcande/banking-system-app.git
    ```

2. Install the dependencies:

    ```bash
    cd client
    npm install
    ```

    ```bash
    cd ../server
    npm install
    ```

3. Create a `.env` file in the `server` directory and add the following environment variables:

    ```bash
    DATABASE_URL=
    JWT_SECRET=
    ```

4. Create a PostgreSQL database and add the connection string to the `DATABASE_URL` environment variable.

  ```bash
    DATABASE_URL="postgres://your_username:your_password@your_host:your_port/your_database_name"
  ```

5. Run the migrations to create the database schema:

    ```bash
    npm run migrate
    ```

6. Start the server:

    ```bash
    cd server
    npm run dev

    cd/client
    npm start
    ```

7. Access the application at `http://localhost:3000`.

### System Architecture

The system follows a layered architecture with distinct components for user interface, API gateway, middleware, controllers, services, and PSQL database. This approach promotes modularity, maintainability, and scalability.

### Technology Stack

  1. **Frontend**: Tailwind, CSS, React, TypeScript
  2. **Backend**: Node.js, TypeScript
  3. **Database**: PostgreSQL
  4. **Authentication**: JWT
  5. **API Gateway**: Express.js
  
### Data Flow

![System Design](system-design.png)

The user interacts with the frontend, which sends requests to the API gateway. The API gateway routes the requests to the appropriate controller, which interacts with the service layer. The service layer processes the requests and interacts with the database to fetch or update data. The database sends the response back to the service layer, which is then sent back to the user through the API gateway.

## Authentication and Authorization

JWT was chosen as the authentication mechanism due to its stateless nature, which aligns with the distributed architecture of the system. Middleware is employed to enforce authorization rules, ensuring that users can only access resources permitted by their roles and permissions.

## Database Selection

PostgreSQL was selected as the database due to its robust features, ACID compliance, and strong support for complex data types. Its ability to handle large datasets and concurrent transactions makes it suitable for a banking system.

## Service Layer

The introduction of a service layer promotes separation of concerns by encapsulating business logic. This enhances code reusability, testability, and maintainability. Controllers act as orchestrators, delegating requests to appropriate services.

## Error Handling

The system employs a centralized error handling mechanism to ensure consistent error responses. Errors are classified into different categories based on their nature, such as validation errors, database errors, or server errors. This approach simplifies debugging and troubleshooting.

## Security Considerations

The system follows security best practices, such as input validation, data sanitization, and encryption. Passwords are hashed before storage to prevent unauthorized access.

### Potential Improvements and Scalability

**Frontend Separation**: Creating a separate frontend repository could facilitate independent development and deployment.
**Microservices Architecture / Distributed System**: For larger-scale systems, consider decomposing the application into microservices to improve scalability and resilience.
**Caching**: Implementing caching mechanisms for frequently accessed data can enhance performance.
**Message Queues**: Utilizing message queues can decouple components and enable asynchronous processing of tasks.
**Multicurrency Support**: Introducing support for multiple currencies would require additional data models, calculations, and exchange rate management.

### Conclusion

With additional development time, the following enhancements would be prioritized:

**Comprehensive Test Coverage**: Implementing a robust test suite to ensure system reliability and prevent regressions.
**Advanced Features**: Exploring additional features like loan management, credit cards, and investment services.
**Security Audits**: Conducting regular security audits to identify and address vulnerabilities.
**Performance Optimization**: Profiling the system to identify bottlenecks and optimize performance.
