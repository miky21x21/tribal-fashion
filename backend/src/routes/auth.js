const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const prisma = require('../config/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Initialize Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Helper function to find or create user from OAuth
const findOrCreateUser = async (profileData) => {
  const { email, googleId, appleId, phoneNumber, firstName, lastName, avatar } = profileData;
  
  // First try to find existing user by provider ID
  let user = null;
  
  if (googleId) {
    user = await prisma.user.findUnique({ where: { googleId } });
  } else if (appleId) {
    user = await prisma.user.findUnique({ where: { appleId } });
  } else if (phoneNumber) {
    user = await prisma.user.findUnique({ where: { phoneNumber } });
  }
  
  // If not found by provider ID but email exists, link accounts
  if (!user && email) {
    user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      // Update existing user with new provider data
      const updateData = {};
      if (googleId) updateData.googleId = googleId;
      if (appleId) updateData.appleId = appleId;
      if (phoneNumber && !user.phoneNumber) updateData.phoneNumber = phoneNumber;
      
      user = await prisma.user.update({
        where: { id: user.id },
        data: updateData
      });
    }
  }
  
  // If still no user found, create new one
  if (!user) {
    const userData = {
      email,
      googleId,
      appleId,
      phoneNumber,
      firstName: firstName || null,
      lastName: lastName || null,
      avatar: avatar || null,
      profileComplete: !!(firstName && lastName)
    };
    
    user = await prisma.user.create({ data: userData });
  }
  
  return user;
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        profileComplete: !!(firstName && lastName)
      }
    });
    
    // Generate token
    const token = generateToken(user.id);
    
    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profileComplete: user.profileComplete
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Google OAuth Registration/Login
router.post('/oauth/google', async (req, res) => {
  try {
    const { idToken, verified, email, firstName, lastName, googleId, avatar } = req.body;
    
    let userData;
    
    if (verified && email && googleId) {
      // Token was already verified by frontend, use provided data
      userData = {
        email,
        googleId,
        firstName,
        lastName,
        avatar
      };
    } else if (idToken) {
      // Legacy path: verify token in backend
      if (!idToken) {
        return res.status(400).json({
          success: false,
          message: 'Google ID token is required'
        });
      }
      
      // Verify the Google ID token
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      
      const payload = ticket.getPayload();
      userData = {
        email: payload.email,
        googleId: payload.sub,
        firstName: payload.given_name,
        lastName: payload.family_name,
        avatar: payload.picture
      };
    } else {
      return res.status(400).json({
        success: false,
        message: 'Google authentication data is required'
      });
    }
    
    // Find or create user
    const user = await findOrCreateUser(userData);
    
    // Generate token
    const token = generateToken(user.id);
    
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar,
          profileComplete: user.profileComplete
        }
      }
    });
  } catch (error) {
    console.error('Google OAuth error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Apple Sign In Registration/Login
router.post('/oauth/apple', async (req, res) => {
  try {
    const { appleId, email, firstName, lastName } = req.body;
    
    if (!appleId) {
      return res.status(400).json({
        success: false,
        message: 'Apple ID is required'
      });
    }
    
    // Find or create user
    const user = await findOrCreateUser({
      appleId,
      email,
      firstName,
      lastName
    });
    
    // Generate token
    const token = generateToken(user.id);
    
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar,
          profileComplete: user.profileComplete
        }
      }
    });
  } catch (error) {
    console.error('Apple OAuth error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to authenticate with Apple'
    });
  }
});

// Phone Number Registration/Login
router.post('/phone/register', async (req, res) => {
  try {
    const { phoneNumber, firstName, lastName } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }
    
    // Find or create user
    const user = await findOrCreateUser({
      phoneNumber,
      firstName,
      lastName
    });
    
    // Generate token
    const token = generateToken(user.id);
    
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          profileComplete: user.profileComplete
        }
      }
    });
  } catch (error) {
    console.error('Phone registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register with phone number'
    });
  }
});

// Update profile for incomplete profiles
router.put('/profile/complete', authenticate, async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const userId = req.user.id;
    
    if (!firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'First name and last name are required'
      });
    }
    
    // Check if email is being updated and if it's already in use
    if (email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });
      
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({
          success: false,
          message: 'Email is already in use by another account'
        });
      }
    }
    
    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        email: email || undefined,
        profileComplete: true
      }
    });
    
    res.json({
      success: true,
      data: {
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          avatar: updatedUser.avatar,
          phoneNumber: updatedUser.phoneNumber,
          profileComplete: updatedUser.profileComplete
        }
      }
    });
  } catch (error) {
    console.error('Profile completion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Generate token
    const token = generateToken(user.id);
    
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profileComplete: user.profileComplete
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Verify JWT token endpoint for middleware
router.post('/verify', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { 
        id: true, 
        email: true, 
        firstName: true, 
        lastName: true, 
        role: true, 
        avatar: true,
        phoneNumber: true,
        profileComplete: true
      }
    });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid'
      });
    }
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token is not valid'
    });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

// Store OTP
router.post('/phone/store-otp', async (req, res) => {
  try {
    const { phoneNumber, otpCode } = req.body;

    if (!phoneNumber || !otpCode) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and OTP code are required'
      });
    }

    // Clean up any expired OTPs for this phone number
    await prisma.phoneOTP.deleteMany({
      where: {
        phoneNumber,
        expiresAt: {
          lt: new Date()
        }
      }
    });

    // Set expiration time (10 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Store the new OTP
    const phoneOTP = await prisma.phoneOTP.create({
      data: {
        phoneNumber,
        otpCode,
        expiresAt
      }
    });

    res.json({
      success: true,
      message: 'OTP stored successfully',
      data: {
        id: phoneOTP.id,
        expiresAt: phoneOTP.expiresAt
      }
    });
  } catch (error) {
    console.error('Error storing OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to store OTP',
      error: error.message
    });
  }
});

// Verify OTP
router.post('/phone/verify-otp', async (req, res) => {
  try {
    const { phoneNumber, otpCode } = req.body;

    if (!phoneNumber || !otpCode) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and OTP code are required'
      });
    }

    // Find the OTP record
    const phoneOTP = await prisma.phoneOTP.findFirst({
      where: {
        phoneNumber,
        otpCode,
        isUsed: false,
        expiresAt: {
          gte: new Date()
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!phoneOTP) {
      // Check if there's an expired OTP
      const expiredOTP = await prisma.phoneOTP.findFirst({
        where: {
          phoneNumber,
          otpCode
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      if (expiredOTP && expiredOTP.expiresAt < new Date()) {
        return res.status(400).json({
          success: false,
          message: 'OTP has expired. Please request a new one.',
          error: 'expired'
        });
      }

      if (expiredOTP && expiredOTP.isUsed) {
        return res.status(400).json({
          success: false,
          message: 'OTP has already been used.',
          error: 'already_used'
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Invalid OTP code.',
        error: 'invalid_code'
      });
    }

    // Mark the OTP as used
    await prisma.phoneOTP.update({
      where: { id: phoneOTP.id },
      data: { isUsed: true }
    });

    // Clean up other OTPs for this phone number
    await prisma.phoneOTP.deleteMany({
      where: {
        phoneNumber,
        id: { not: phoneOTP.id }
      }
    });

    res.json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        phoneNumber,
        verifiedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP',
      error: error.message
    });
  }
});

module.exports = router;