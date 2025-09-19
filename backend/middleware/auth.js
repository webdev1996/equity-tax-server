const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Database will be used instead of in-memory storage

// Middleware to authenticate JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided, authorization denied'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid'
      });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Account is not active'
      });
    }

    // Add user to request object
    req.user = user;
    next();

  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
};

// Middleware to check if user is admin
const adminAuth = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }
    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during admin authentication'
    });
  }
};

// Middleware to check if user owns the resource or is admin
const ownerOrAdmin = (resourceUserIdField = 'user') => {
  return async (req, res, next) => {
    try {
      const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
      
      if (req.user.role === 'admin' || req.user._id.toString() === resourceUserId) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own resources.'
      });
    } catch (error) {
      console.error('Owner or admin middleware error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during authorization'
      });
    }
  };
};

// Middleware to validate user permissions
const hasPermission = (permission) => {
  return async (req, res, next) => {
    try {
      // Define permissions for different roles
      const rolePermissions = {
        user: ['read:own', 'write:own', 'delete:own'],
        admin: ['read:all', 'write:all', 'delete:all', 'admin:all']
      };

      const userPermissions = rolePermissions[req.user.role] || [];
      
      if (!userPermissions.includes(permission)) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions'
        });
      }

      next();
    } catch (error) {
      console.error('Permission middleware error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during permission check'
      });
    }
  };
};

// Middleware to check if user is verified
const requireVerification = async (req, res, next) => {
  try {
    if (!req.user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Email verification required'
      });
    }
    next();
  } catch (error) {
    console.error('Verification middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during verification check'
    });
  }
};

// Middleware to check if 2FA is enabled and verified
const require2FA = async (req, res, next) => {
  try {
    if (req.user.twoFactorEnabled && !req.headers['x-2fa-verified']) {
      return res.status(403).json({
        success: false,
        message: 'Two-factor authentication required'
      });
    }
    next();
  } catch (error) {
    console.error('2FA middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during 2FA check'
    });
  }
};

module.exports = {
  auth,
  adminAuth,
  ownerOrAdmin,
  hasPermission,
  requireVerification,
  require2FA
};
