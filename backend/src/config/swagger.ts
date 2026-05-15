import swaggerJSDoc from "swagger-jsdoc";
import config from "./config";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Gscope API",
      version: "1.0.0",
      description: "Gym management platform API documentation",
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
      },
    ],
    tags: [
      { name: "Auth", description: "Authentication and registration" },
      { name: "Company", description: "Company management" },
      { name: "Bank", description: "Bank account operations" },
      { name: "Members", description: "Member management" },
      { name: "Sessions", description: "Session management" },
      { name: "Logs", description: "Attendance logs" },
      { name: "Offers", description: "Subscription offers" },
      { name: "Expenses", description: "Expense management" },
      { name: "Reports", description: "Analytics and reporting" },
    ],
  },
  apis: ["./src/**/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
