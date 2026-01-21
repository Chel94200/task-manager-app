// server/prismaClient.ts
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load environment variables from .env
dotenv.config({ path: path.join(__dirname, '.env') });
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set in .env");
}
const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production')
    global.prisma = prisma;
export default prisma;
