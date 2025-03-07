const rateLimit = require('express-rate-limit');

// Create a limiter for paste creation
const createPasteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 paste creations per window
  message: { error: 'Too many pastes created from this IP, please try again after 15 minutes' },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Create a limiter for API requests
const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // limit each IP to 100 requests per window
  message: { error: 'Too many requests from this IP, please try again after 5 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  createPasteLimiter,
  apiLimiter
};