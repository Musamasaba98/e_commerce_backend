import app from './app.js'
import dotenv from 'dotenv-safe'
import dbConnect from './config/dbConnect.js';


dotenv.config()
dbConnect()


const PORT = process.env.PORT || 4000;

process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception: ", err.message);
    console.log("Closing server now...");
    process.exit(1);
});

const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})

process.on("unhandledRejection", (err) => {
    console.log(err);
    console.log("Closing server now...");
    server.close(() => {
        process.exit(1);
    });
});
process.on("SIGTERM", () => {
    console.log("SIGTERM received. Shutting down gracefully");
    server.close(() => {
        console.log("Closed out remaining connections");
        process.exit(0);
    });
});