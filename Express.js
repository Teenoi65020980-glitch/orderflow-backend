import express from 'express'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
const prisma = new PrismaClient()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('OrderFlow Backend is running 🚀')
})

app.post('/api/orders', async (req, res) => {
  try {
    const { userId, items } = req.body
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const order = await prisma.order.create({
      data: {
        userId,
        status: 'pending',
        totalAmount,
        orderItems: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          }))
        }
      },
      include: { orderItems: true }
    })

    res.status(201).json(order)
  } catch (err) {
    console.error('❌ Create Order Error:', err)
    res.status(500).json({ error: 'Failed to create order', detail: err.message })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
