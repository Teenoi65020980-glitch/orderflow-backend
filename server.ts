
import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const app = express()
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())

app.get('/api/products', async (req, res) => {
  const products = await prisma.products.findMany()
  res.json(products)
})

app.listen(5555, () => {
  console.log('🚀 Server running at http://localhost:5555')
})
