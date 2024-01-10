const nextConfig = {
 rewrites: async () => {
   return [
     {
       destination: "http://127.0.0.1:8000/eligible", // Proxy to FastAPI server
     },
   ];
 },
};

module.exports = nextConfig;