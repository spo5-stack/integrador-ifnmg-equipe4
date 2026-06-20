import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { env } from '@/env/index.js'
import { PrismaClient } from '../../../generated/prisma/client.js'

const adapter = new PrismaMariaDb(env.DATABASE_URL)

export const prisma = new PrismaClient({ adapter })
