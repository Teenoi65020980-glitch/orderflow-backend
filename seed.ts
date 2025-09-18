import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // สร้างผู้ใช้
  const user = await prisma.users.create({
    data: {
      email: 'testuser@example.com',
      name: 'Test User',
    },
  })

  // สร้างสินค้า
  const products = await prisma.products.createMany({
    data: [
      { name: 'Keyboard', description: 'Mechanical keyboard', price: 1999 },
      { name: 'Mouse', description: 'Gaming mouse', price: 599 },
      { name: 'Monitor', description: '24" Full HD', price: 4999 },
    ],
  })

  const productList = await prisma.products.findMany()

  // สร้างคำสั่งซื้อ
  const order = await prisma.orders.create({
    data: {
      user_id: user.id,
      status: 'pending',
      total_price: productList[0].price + productList[1].price,
    },
  })

  // สร้างรายการสินค้าในคำสั่งซื้อ
  await prisma.order_items.createMany({
    data: [
      { order_id: order.id, product_id: productList[0].id, quantity: 1 },
      { order_id: order.id, product_id: productList[1].id, quantity: 2 },
    ],
  })

  console.log('✅ Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })
