const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

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
        lastName
      }
    });
    
    // Generate token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );
    
    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
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

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Generate token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );
    
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
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
      select: { id: true, email: true, firstName: true, lastName: true, role: true }
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