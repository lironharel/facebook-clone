# Running the Facebook Clone Locally

Follow these steps to get the development servers running on your machine.

1. Ensure MongoDB is installed and running on `mongodb://localhost/facebook_clone`.
2. Start the API server:
   ```bash
   cd server
   npm install
   npm start
   ```
3. Start the client application in a new terminal:
   ```bash
   cd client
   npm install
   npm start
   ```

The React app will be available at `http://localhost:3000` and communicates with the API on port `5000`.
