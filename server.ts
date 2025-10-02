import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Route สำหรับ root URL
app.get('/', (req, res) => {
  res.send('✅ OrderFlow backend is running!');
});

// Route สำหรับดึงข้อมูล products
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// เริ่มเซิร์ฟเวอร์
const PORT = process.env.PORT || 5555;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
