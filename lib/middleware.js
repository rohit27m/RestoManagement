import { verifyToken, extractTokenFromHeader } from './jwt.js';

export function authMiddleware(req, res, next) {
  const token = extractTokenFromHeader(req.headers.authorization);
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const payload = verifyToken(token);
  
  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.user = payload;
  next();
}

export function roleMiddleware(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}

export function restaurantAccessMiddleware(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Admin can access all restaurants
  if (req.user.role === 'admin') {
    return next();
  }

  // Manager/staff can only access their own restaurant
  const requestedRestaurantId = parseInt(req.params.restaurantId || req.body.restaurantId);
  
  if (requestedRestaurantId && requestedRestaurantId !== req.user.restaurantId) {
    return res.status(403).json({ error: 'Access denied to this restaurant' });
  }

  next();
}
