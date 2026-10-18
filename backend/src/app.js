const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

const origins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:5174').split(',').map((s) => s.trim());
app.use(helmet());
app.use(cors({ origin: origins, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(hpp());
app.use(morgan('dev'));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use('/api', limiter);
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
app.use('/api/v1/auth/login', authLimiter);

// routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/settings', require('./routes/siteSettingRoutes'));
app.use('/api/v1/services', require('./routes/serviceRoutes'));
app.use('/api/v1/locations', require('./routes/locationRoutes'));
app.use('/api/v1/fleet', require('./routes/fleetRoutes'));
app.use('/api/v1/faqs', require('./routes/faqRoutes'));
app.use('/api/v1/gallery', require('./routes/galleryRoutes'));
app.use('/api/v1/testimonials', require('./routes/testimonialRoutes'));
app.use('/api/v1/seo', require('./routes/seoRoutes'));
app.use('/api/v1/inquiries', require('./routes/inquiryRoutes'));
app.use('/api/v1/quotations', require('./routes/quotationRoutes'));
app.use('/api/v1/bookings', require('./routes/bookingRoutes'));
app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/activity-logs', require('./routes/activityLogRoutes'));
app.use('/api/v1/reviews', require('./routes/reviewRoutes'));
app.use('/api/v1/upload', require('./routes/uploadRoutes'));
app.use('/api/v1/reports', require('./routes/reportRoutes'));

app.get('/api/v1/health', (req, res) => res.json({ success: true, status: 'ok' }));

app.use(notFound);
app.use(errorHandler);

module.exports = app;