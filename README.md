# EV Test Drive Scheduling Service

## Overview

This project implements an on-demand scheduling service for Electric Vehicle (EV) test drives. It consists of a backend service that handles availability checks and test drive scheduling, and a frontend component for user interaction.

## Features

1. **Availability Check:**

   - Check vehicle availability for a given datetime and location.
   - Considers vehicle type, location, and existing bookings.
   - Ensures even distribution of test drives across available vehicles.

2. **Test Drive Scheduling:**

   - Schedule a test drive for an available vehicle.
   - Collects and stores customer information.

3. **Frontend Component:**

   - User-friendly interface for booking test drives.
   - Configurable vehicle type.
   - Allows bookings up to 14 days in advance.

4. **Additional Features:**
   - Detailed error messages for unavailability reasons.
   - In-memory database for easy testing and development.

## Technologies Used

- **Backend:**

  - Node.js with Express.js
  - TypeScript for type-safe code
  - MongoDB (with Mongoose ODM)
  - date-fns for date manipulation

- **Frontend:**

  - React.js
  - TypeScript
  - Axios for API communication
  - react-toastify for notifications

- **Development Tools:**
  - ESLint and Prettier for code quality
  - Jest for testing
  - nodemon for hot-reloading during development

## Setup and Running the Project

1. **Clone the repository:**

   ```
   git clone https://github.com/brianlynch55/ev-test-drive-service.git
   cd ev-test-drive-service
   ```

2. **Install dependencies:**

   ```
   cd backend
   cd frontend
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add:

   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/ev-test-drive
   ```

4. **Run the backend server and in-memory database:**

   ```
   cd backend
   npm run start
   ```

5. **Run the frontend development server:**

   ```
   cd frontend
   npm run start
   ```

6. Open your browser and navigate to `http://localhost:3000` to use the application.

## Design Decisions and Trade-offs

1. **In-Memory Database:**

   - Used MongoDB-Memory-Server for easy setup and testing.
   - Trade-off: Data doesn't persist between server restarts, but simplifies development and testing.

2. **Mongoose ODM:**

   - Provides a schema-based solution to model application data.
   - Offers built-in type casting, validation, query building, and business logic hooks.
   - Trade-off: Adds an abstraction layer which may impact performance for very large-scale applications.

3. **Schema Validation:**

   - Implemented robust schema validation using Mongoose.
   - Ensures data integrity and consistency at the database level.
   - Trade-off: Adds some overhead to database operations but greatly improves data reliability.

4. **Modular Component Structure (Frontend):**

   - Organized into components, types, API, and hooks.
   - Improves code reusability and maintainability.
   - Trade-off: Increases initial development time but pays off in long-term maintenance.

5. **Modular Architecture (Backend):**

   - Separated into routes, controllers, services, validation, and repository.
   - Enhances code organization and makes the codebase easier to navigate and maintain.
   - Trade-off: Requires more initial setup but improves scalability and testability.

6. **Detailed Error Handling:**

   - Implemented comprehensive error handling with user-friendly toast notifications.
   - Improves user experience by providing clear feedback.
   - Trade-off: Requires more frontend-backend coordination but greatly enhances usability.

7. **Simple UI Design:**

   - Focused on functionality and ease of use.
   - Prioritized user experience over complex design elements.
   - Trade-off: May not be as visually appealing but ensures usability and fast development.

8. **TypeScript Usage:**
   - Implemented throughout for type safety.
   - Catches errors early and improves code documentation.
   - Trade-off: Requires more initial setup and learning curve but enhances long-term maintainability.

8. **API Validation:**
   - Validate request at api level to ensure data integrity and no wasteful requests or confusing errors with bad data


## Potential Future Improvements

1. **Persistent Database:**

   - Switch to a persistent MongoDB instance for production use.

2. **Enhanced User Interface:**

   - Implement a more sophisticated design while maintaining usability.

3. **Performance Optimizations:**

   - Implement caching for frequently accessed data.
   - Optimize database queries for larger datasets.

4. **Expanded Test Coverage:**

   - Increase unit test coverage across both frontend and backend.
   - Implement integration and end-to-end tests for critical user flows.

5. **Monitoring and Logging:**

   - Implement comprehensive logging and monitoring for production use.

6. **Containerization:**

   - Dockerize the application for easier deployment and scaling.

7. **Frontend State Management:**

   -As the application gets larger and more complex, we might want to consider using a state management library like Redux or MobX or handle state on our server using react query.


## Testing

To run the backend test:

```
cd backend
npm test
```

Please note that the current test coverage is limited. Given more time, additional tests would be implemented to cover more scenarios and components.
