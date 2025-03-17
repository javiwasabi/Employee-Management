
const corsOptions = {
    origin: [
        "http://localhost:3000",
        "https://employee-management-brown-five.vercel.app",
        "https://gallant-stillness-production.up.railway.app"
    ],
    methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // 🔹 Importante si usas cookies o autenticación
    optionsSuccessStatus: 200
};
  module.exports = corsOptions;