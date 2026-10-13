import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { dataStore } from '../utils/dataStore.ts';
import { generateToken, AuthRequest } from '../middleware/auth.ts';

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password, role, phone, address, farmLocation } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
      return;
    }

    // Security rule: admin self-registration is strictly prohibited
    if (role === 'admin') {
      res.status(403).json({ success: false, message: 'Administrator accounts cannot be registered publicly.' });
      return;
    }

    const assignedRole = role === 'farmer' ? 'farmer' : 'customer';

    // Duplicate check
    const existing = dataStore.findUserByEmail(email);
    if (existing) {
      res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = dataStore.createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      role: assignedRole,
      phone: phone || '',
      address: address || '',
      farmLocation: assignedRole === 'farmer' ? {
        farmName: farmLocation?.farmName || `${name}'s Organic Farm`,
        description: farmLocation?.description || 'Locally grown natural produce delivered straight from the field.',
        city: farmLocation?.city || 'Pune',
        state: farmLocation?.state || 'Maharashtra',
        address: farmLocation?.address || address || '',
        lat: Number(farmLocation?.lat) || 18.5204,
        lng: Number(farmLocation?.lng) || 73.8567,
        experienceYears: Number(farmLocation?.experienceYears) || 5,
        organicCertified: Boolean(farmLocation?.organicCertified ?? true)
      } : undefined,
      profileImage: assignedRole === 'farmer'
        ? 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80'
    });

    const token = generateToken(newUser);

    const { passwordHash: _, ...userSafe } = newUser;
    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: userSafe
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during registration.', error: (error as Error).message });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    const user = dataStore.findUserByEmail(email);
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({ success: false, message: 'This account has been deactivated. Please contact support.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const token = generateToken(user);
    const { passwordHash: _, ...userSafe } = user;

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: userSafe
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during login.', error: (error as Error).message });
  }
}

export function getMe(req: AuthRequest, res: Response): void {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated.' });
    return;
  }

  const user = dataStore.findUserById(req.user.id);
  if (!user) {
    res.status(404).json({ success: false, message: 'User not found.' });
    return;
  }

  const { passwordHash: _, ...userSafe } = user;
  res.status(200).json({ success: true, user: userSafe });
}

export function updateProfile(req: AuthRequest, res: Response): void {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated.' });
    return;
  }

  const { name, phone, address, farmLocation, profileImage } = req.body;
  const updates: Record<string, unknown> = {};

  if (name) updates.name = name.trim();
  if (phone !== undefined) updates.phone = phone;
  if (address !== undefined) updates.address = address;
  if (profileImage !== undefined) updates.profileImage = profileImage;

  if (req.user.role === 'farmer' && farmLocation) {
    const existing = dataStore.findUserById(req.user.id);
    updates.farmLocation = {
      ...(existing?.farmLocation || {}),
      ...farmLocation
    };
  }

  const updated = dataStore.updateUser(req.user.id, updates);
  if (!updated) {
    res.status(404).json({ success: false, message: 'User not found.' });
    return;
  }

  const { passwordHash: _, ...userSafe } = updated;
  res.status(200).json({
    success: true,
    message: 'Profile updated successfully.',
    user: userSafe
  });
}
