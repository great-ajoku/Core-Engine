/**
 * =========================================================================
 * TRACEV ARCHITECTURE PLATFORM — SYSTEM APPLICATION CORE CORE ENGINE
 * Author: Ajoku Great Ubamara (Lead Full-Stack Engineer / Startup CTO)
 * Language: Pure JavaScript / Node.js Engine (CommonJS Runtime)
 * =========================================================================
 */

// =========================================================================
// PHASE 1: RUNTIME TESTING INJECTOR & ENV MANIPULATION MATRIX
// =========================================================================
if (process.env.NODE_ENV === 'test') {
  console.log("⚡ [FINTECH ENGINE BYPASS] Test mode active. Allocating micro-mock runtime keys to memory...");
  
  const complianceMockKeys = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'RESEND_API_KEY',
    'PAYSTACK_SECRET_KEY',
    'TERMII_API_KEY',
    'TERMII_BASE_URL',
    'TERMII_SENDER_ID',
    'JWT_SECRET'
  ];
  
  complianceMockKeys.forEach(parameterKey => {
    process.env[parameterKey] = process.env[parameterKey] || `mock_secure_token_for_${parameterKey.toLowerCase()}`;
  });
} else { 
  // 🔒 Decoupled Context-Switching: Extracts configurations depending on structural pipelines
  const targetEnvFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.staging';
  require('dotenv').config({ path: targetEnvFile });
  console.log(`[🚀 SYSTEM RUNTIME] Parameters successfully streamed from: "${targetEnvFile}"`);
}

const express = require('express');
const cors = require('cors');
const compression = require("compression");
const helmet = require('helmet');
const { createClient } = require('@supabase/supabase-js');

// =========================================================================
// PHASE 2: ROUTER PLUMBING & MICROSERVICE INTERFACES
// =========================================================================
const authRoutes = require('./routes/authRoutes');
const walletRoutes = require('./routes/walletRoutes');
const verificationRoutes = require('./routes/verificationRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const transactionsRoutes = require("./routes/transactionRoutes");
const notificationRoutes = require('./routes/notificationRoutes');
const bankRoutes = require('./routes/bankRoutes');
const profileRoutes = require("./routes/profileRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");

// Infrastructure Security Middlewares
const { globalLimiter } = require('./middleware/ratelimiter');

// Asynchronous Daemons
const { initTransactionCron } = require("./cron/transaction");

// App Core Allocation
const app = express();
const PORT = process.env.PORT || 5000;

// =========================================================================
// PHASE 3: DISTRIBUTED DATABASE MATRIX (SUPABASE POSTGRES)
// =========================================================================
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_ANON_KEY;

if (supabaseUrl && supabaseServiceKey) {
  global.supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
  console.log(`[📦 ORCHESTRATION] Supabase data cluster successfully pooled with Anon authorization patterns.`);
} else {
  console.log(`[🛡️ ACCELERATION BYPASS] Connection checks isolated for workflow pipeline simulation.`);
}

// =========================================================================
// PHASE 4: GLOBAL INTERCEPTORS & DEFENSE PERIMETER
// =========================================================================
app.set("trust proxy", 1); // Enforces structural mapping over load-balancing proxies (like tracev-bswitch)
app.use(helmet());

// Performance Layering: Enforces Gzip optimization over network sockets
app.use(
  compression({
    threshold: 1024,
    level: 6,
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) return false;
      return compression.filter(req, res);
    },
  })
);

// Unified Origin Controls
const transactionalOrigins = [
  'https://vercel.app', 
  'http://localhost:5173', 
  'http://localhost:5174',         
  'https://localhost',
  'http://localhost',          
  'capacitor://localhost',    
  'http://localhost:3000'                     
];

app.use(cors({
  origin: function (origin, executionCallback) {
    if (!origin) return executionCallback(null, true);
    if (transactionalOrigins.indexOf(origin) === -1) {
      const accessViolationMessage = 'The CORS policy for this network infrastructure does not authorize foreign requests.';
      return executionCallback(new Error(accessViolationMessage), false);
    }
    return executionCallback(null, true);
  },
  credentials: true
}));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(globalLimiter);

// Custom Metadata and Streaming Headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Vary", "Accept-Encoding");
  next();
});

// Logging Transport Stream (Bypassed in test runner to keep outputs clean)
if (process.env.NODE_ENV !== 'test') {
  app.use((req, res, next) => {
    console.log(`[📡 TRAFFIC TRACE] ${new Date().toISOString()} -> ${req.method} ${req.url}`);
    next();
  });
}

// =========================================================================
// PHASE 5: MOUNTING CLEAN RESTFUL ROUTING LAYERS
// =========================================================================
app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use("/api/verification", verificationRoutes);
app.use("/api/payment", paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/banks', bankRoutes);
app.use("/api/transaction", transactionsRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/checkout", checkoutRoutes);

// Base Status System Audits
mapStatusProbe('/health-check', "Tracev Backend Application Engine is running smoothly.");
mapStatusProbe('/', "Welcome to the Tracev Core API. Please refer to documentation for available parameters.");

function mapStatusProbe(pathEndpoint, statusMessage) {
  app.get(pathEndpoint, (req, res) => {
    res.status(200).json({ success: true, message: statusMessage });
  });
}

// =========================================================================
// PHASE 6: SYSTEM EXCEPTION TUNNELLING & ROBUST ERROR HANDLERS
// =========================================================================

// Intercept completely unmatched resource allocations
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    error: "ROUTE_NOT_FOUND",
    message: `The endpoint ${req.method} ${req.originalUrl} does not exist on this infrastructure server`,
    method: req.method,
    path: req.originalUrl,
  });
});

// Deep Pipeline Failures & Server Interceptions
app.use((err, req, res, next) => {
  console.error("🔥 [CRITICAL CORE FAULT] Cascading runtime breakdown intercepted:", err.stack || err);
  if (res.headersSent) {
    return next(err);
  }
  return res.status(err.status || 500).json({
    success: false,
    error: err.code || "INTERNAL_SERVER_ERROR",
    message: err.message || "An isolated structural anomaly occurred inside the application matrix.",
  });
});

// Operational Process Safeguards
process.on('uncaughtException', (runtimeException) => {
  console.error('🚨 [UNCAUGHT CRASH PROTECTOR] Intercepted core thread system error:', runtimeException.stack || runtimeException);
});

process.on('unhandledRejection', (asyncRejectionReason, promiseContext) => {
  console.error('🚨 [UNHANDLED ASYNC PROTECTOR] Broken promise sequence detected at:', promiseContext, 'Reason:', asyncRejectionReason);
});

// =========================================================================
// PHASE 7: APPARATUS ACTIVATION SWITCHBOARD
// =========================================================================
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[✅ INFRASTRUCTURE ACTIVE] Core processing gateway fully listening on port ${PORT}`);
  });
}

module.exports = app;
