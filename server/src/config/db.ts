import mongoose from 'mongoose';

/**
 * Connect to MongoDB using the MONGODB_URI environment variable.
 * Logs connection success or failure on startup.
 */
export const connectDB = async (): Promise<typeof mongoose | null> => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('<username>') || uri.includes('your_mongodb_connection_string')) {
    console.warn('⚠️  MONGODB_URI environment variable is missing or contains placeholder values.');
    console.log('ℹ️  Please set a valid MONGODB_URI in your .env file (e.g., mongodb+srv://... or mongodb://localhost:27017/farmconnect).');
    return null;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}:${conn.connection.port || 'default'} (Database: ${conn.connection.name})`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${(error as Error).message}`);
    return null;
  }
};

export const isMongoConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

export default connectDB;
