import mongoose from 'mongoose';
import { UserModel } from '../models/User.ts';
import { ProductModel } from '../models/Product.ts';
import { OrderModel } from '../models/Order.ts';
import { getInitialSeedData } from '../utils/seedData.ts';

export function isMongoConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export async function seedMongoDBIfEmpty(): Promise<void> {
  if (!isMongoConnected()) return;

  try {
    const userCount = await UserModel.countDocuments();
    if (userCount === 0) {
      console.log('🌱 MongoDB collections are empty. Seeding initial FarmConnect agricultural data...');
      const seed = getInitialSeedData();

      // Seed Users
      const createdUsers = [];
      for (const u of seed.users) {
        const userDoc = await UserModel.create({
          _id: new mongoose.Types.ObjectId(u.id.replace('usr_', '').padEnd(24, '0').slice(0, 24)),
          name: u.name,
          email: u.email,
          passwordHash: u.passwordHash,
          role: u.role,
          phone: u.phone,
          address: u.address,
          farmLocation: u.farmLocation,
          profileImage: u.profileImage,
          isActive: u.isActive
        });
        createdUsers.push(userDoc);
      }

      // Seed Products
      const userMap = new Map(createdUsers.map(u => [u.email, u._id]));
      for (const p of seed.products) {
        const farmer = seed.users.find(u => u.id === p.farmerId);
        const farmerMongoId = farmer ? userMap.get(farmer.email) : createdUsers[1]._id;

        await ProductModel.create({
          _id: new mongoose.Types.ObjectId(p.id.replace('prd_', '').padEnd(24, '0').slice(0, 24)),
          name: p.name,
          description: p.description,
          category: p.category,
          price: p.price,
          unit: p.unit,
          quantity: p.quantity,
          images: p.images,
          farmerId: farmerMongoId,
          farmerName: p.farmerName,
          location: p.location,
          isAvailable: p.isAvailable,
          isOrganic: p.isOrganic,
          harvestDate: p.harvestDate
        });
      }

      console.log('✅ MongoDB initial seeding completed successfully.');
    }
  } catch (err) {
    console.warn('Notice: MongoDB seeding encountered non-fatal error:', (err as Error).message);
  }
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('<username>') || uri.includes('your_mongodb_connection_string')) {
    console.log('ℹ️  MONGODB_URI is not set with live credentials. Using robust integrated fail-safe data engine. Set MONGODB_URI in .env to connect a live MongoDB cluster.');
    return { isConnected: false, mode: 'local' };
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ MongoDB connected successfully via Mongoose:', mongoose.connection.host);
    await seedMongoDBIfEmpty();
    return { isConnected: true, mode: 'mongoose' };
  } catch (error) {
    console.warn('⚠️  Could not connect to external MongoDB cluster:', (error as Error).message);
    console.log('ℹ️  Operating with integrated fail-safe data store. CRUD, authentication, and orders remain fully operational.');
    return { isConnected: false, mode: 'local' };
  }
}
