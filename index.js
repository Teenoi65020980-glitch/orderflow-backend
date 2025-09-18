import dotenv from 'dotenv'
dotenv.config()
console.log('🔐 DATABASE_URL:', process.env.DATABASE_URL)

import express from 'express'
import cors from 'cors'
import pkg from 'pg'
const { Pool } = pkg

const app = express()
app.use(cors())
app.use(express.json())

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

// 🔹 ทดสอบ backend
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from backend!' })
})

// 🔹 ดึง orders ทั้งหมด
app.get('/api/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders')
    res.json(result.rows)
  } catch (err) {
    console.error('❌ ดึง orders ไม่สำเร็จ:', err.message)
    res.status(500).json({ error: 'เกิดข้อผิดพลาด' })
  }
})

// 🔸 เพิ่ม order แบบเก่า (product_name, quantity)
app.post('/api/orders-old', async (req, res) => {
  const { product_name, quantity } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO orders (product_name, quantity) VALUES ($1, $2) RETURNING *',
      [product_name, quantity]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('❌ Insert error:', err.message)
    res.status(500).json({ error: 'Insert error' })
  }
})

// 🔸 เพิ่ม order แบบใหม่ (user_id)
app.post('/api/orders', async (req, res) => {
  const { userId } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO orders (user_id) VALUES ($1) RETURNING id',
      [userId]
    )
    res.json({ orderId: result.rows[0].id })
  } catch (err) {
    console.error('❌ สร้างคำสั่งซื้อไม่สำเร็จ:', err.message)
    res.status(500).json({ error: 'เกิดข้อผิดพลาด' })
  }
})

// 🔹 ดึงสินค้า
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products')
    res.json(result.rows)
  } catch (err) {
    console.error('❌ ดึงสินค้าไม่สำเร็จ:', err.message)
    res.status(500).json({ error: 'เกิดข้อผิดพลาด' })
  }
})

// 🔸 เพิ่มรายการสินค้าใน order
app.post('/api/order-items', async (req, res) => {
  const { orderId, items } = req.body

  if (!Array.isArray(items)) {
    return res.status(400).json({ error: 'Missing or invalid items' })
  }

  for (const item of items) {
    if (!item.product_id || typeof item.quantity !== 'number') {
      return res.status(400).json({ error: 'Invalid item structure' })
    }
  }

  try {
    const values = items.map(item => `(${orderId}, ${item.product_id}, ${item.quantity})`).join(',')
    await pool.query(`INSERT INTO order_items (order_id, product_id, quantity) VALUES ${values}`)
    res.json({ success: true })
  } catch (err) {
    console.error('❌ เพิ่มรายการสินค้าไม่สำเร็จ:', err.message)
    res.status(500).json({ error: 'เกิดข้อผิดพลาด' })
  }
})

// ✅ เริ่มรันเซิร์ฟเวอร์
const PORT = 3000
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`)
  console.log('Routes loaded:')
  console.log('GET    /api/data')
  console.log('GET    /api/orders')
  console.log('POST   /api/orders')
  console.log('POST   /api/orders-old')
  console.log('GET    /api/products')
  console.log('POST   /api/order-items')
})
