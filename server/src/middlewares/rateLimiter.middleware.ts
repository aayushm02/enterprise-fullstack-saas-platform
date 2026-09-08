import rateLimit from 'express-rate-limit';

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests from this IP, please retry after 15 minutes'
  }
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // Stricter limit for login/auth endpoints
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many authentication attempts, please retry later'
  }
});
