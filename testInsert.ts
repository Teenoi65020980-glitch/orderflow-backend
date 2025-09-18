// testInsert.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: 'secure123',
    },
  })
  console.log(user)
}

main()
