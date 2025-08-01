# Builders Project Backend

## Installation

Follow the steps below to set up the backend for the Builders Project:

1. **Clone the repository**  
   ```
   git clone https://github.com/Bug-Battlers/builders-backend.git
   cd builders-backend
   ```

2. **Install dependencies**  
   ```
   npm install
   ```

3. **Set up environment variables**  
   Create a `.env` file in the root directory and add the following environment variables:

   ```
   PORT=3000  
   MONGO_URI=your_mongodb_connection_string  
   JWT_SECRET=your_jwt_secret_key
   ```
   - PORT: Optional – defaults to 3000 if not specified.  
   - MONGO_URI: Your MongoDB connection URI.  
   - JWT_SECRET: A secret key for signing JWT tokens.

4. **Run the development server**
   ```
   npm run dev
   ```

6. **Run the production server**  
   ```
   npm start
   ```
