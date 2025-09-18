const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // อนุญาตให้ frontend เรียก API ได้
app.use(express.json()); // 👉 เพื่อให้ Express อ่าน JSON จาก req.body ได้

// route: GET
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// route: POST
app.post('/api/send', (req, res) => {
  const data = req.body;
  res.json({
    message: 'Data received!',
    received: data
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});