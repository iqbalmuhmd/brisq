import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";
import { config } from "./env";

const adapter = new PrismaPg({
  connectionString: config.db.url,
});

const prisma = new PrismaClient({ adapter });

export const connectDB = async (): Promise<void> => {
  await prisma.$connect();
  console.log("Database connected");
};

export default prisma;