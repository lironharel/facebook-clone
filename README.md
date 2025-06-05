# Facebook Clone (simplified)

This project provides a minimal example of a social feed built with React, Node.js, Express and MongoDB.

## Setup

1. Start MongoDB.
   If you already have it installed, run `mongod` so it listens on the default port.
   You can also use Docker:
   ```bash
   docker run --name mongodb -p 27017:27017 -d mongo:latest
   ```
   The API will connect to `mongodb://localhost/facebook_clone`.
2. From the `server` directory, install dependencies and start the API server:
   ```bash
   cd server
   npm install
   npm start
   ```
3. From the `client` directory, install dependencies and run the React app:
   ```bash
   cd client
   npm install
   npm start
   ```

The client will be available at `http://localhost:3000` and communicates with the API on port `5000`.
