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
...
