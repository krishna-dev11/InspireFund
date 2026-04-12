const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./Config/Database');
const ApiError = require('./Utils/ApiError');

const authRoutes = require('./Routes/auth');
const campaignRoutes = require('./Routes/campaign');
const paymentRoutes = require('./Routes/payment');
const adminRoutes = require('./Routes/admin');
const userRoutes = require('./Routes/user');

const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: false
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get('/', (_req, res) => {
  res.json({ status: 'FundIndia API running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/campaign', campaignRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

app.use((_req, _res, next) => {
  next(new ApiError(404, 'Route not found'));
});

app.use((err, _req, res, _next) => {
  const status = err.statusCode || 500;
  const message =
    err.message ||
    err.error?.description ||
    err.error?.reason ||
    err?.errors?.[0]?.msg ||
    'Server error';

  if (process.env.NODE_ENV !== 'production') {
    console.error('API Error:', err);
  }

  res.status(status).json({
    message,
    errors: err.errors
  });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect DB', err);
    process.exit(1);
  });
