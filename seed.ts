import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // สร้างผู้ใช้
  const user = await prisma.user.create({
    data: {
      email: 'testuser@example.com',
      name: 'Test User',
    },
  });

  // สร้างสินค้า
  await prisma.product.createMany({
    data: [
      { name: 'Keyboard', price: 1999, stock: 10 },
      { name: 'Mouse', price: 599, stock: 20 },
      { name: 'Monitor', price: 4999, stock: 5 },
    ],
  });

  const productList = await prisma.product.findMany();

  // สร้างคำสั่งซื้อ
  const order = await prisma.order.create({
    data: {
      userId: user.id, // ✅ ใช้ชื่อ field ที่ตรงกับ schema
      status: 'pending',
      totalAmount: productList[0].price + productList[1].price,
    },
  });

  // สร้างรายการสินค้าในคำสั่งซื้อ
  await prisma.orderItem.createMany({
    data: [
      { orderId: order.id, productId: productList[0].id, quantity: 1 },
      { orderId: order.id, productId: productList[1].id, quantity: 2 },
    ],
  });

  console.log('✅ Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
