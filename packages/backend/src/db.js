// packages/backend/src/db.js

import PrismaClientPackage from '@prisma/client';

const { PrismaClient } = PrismaClientPackage;
const prisma = new PrismaClient();

export default prisma;