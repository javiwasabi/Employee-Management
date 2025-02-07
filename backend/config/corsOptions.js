
const corsOptions = {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // 🔹 IMPORTANTE si usas cookies o headers con autenticación
    optionsSuccessStatus: 200
  };
  
  module.exports = corsOptions;