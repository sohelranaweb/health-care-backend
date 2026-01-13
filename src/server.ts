import { Server } from "http";
import app from "./app";
import config from "./config";

import { prisma } from "./shared/prisma";
import seedSuperAdmin from "./helpers/seed";

async function bootstrap() {
  // This variable will hold our server instance
  let server: Server;
  try {
    // Database connection
    await prisma.$connect();
    console.log("Database connected successfully!!!");
    //Seed Super Admin
    await seedSuperAdmin();

    // Start the server
    server = app.listen(config.port, () => {
      console.log(`Server is running on http://localhost:${config.port}`);
    });

    // Function to gracefully shut down the server
    const exitHandler = () => {
      if (server) {
        server.close(() => {
          console.log("Server closed gracefully.");
          process.exit(1); // Exit with a failure code
        });
      } else {
        process.exit(1);
      }
    };

    // Call exitHandler on different signals
    process.on("SIGTERM", exitHandler); // Docker/Kubernetes stop
    process.on("SIGINT", exitHandler); // Ctrl+C

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (error) => {
      console.log(
        "Unhandled Rejection is detected, we are closing our server..."
      );
      if (server) {
        server.close(() => {
          console.log(error);
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    });
  } catch (error) {
    console.error("Error during server startup:", error);
  }
}

bootstrap();
