import express from 'express';
import "dotenv/config";
import cors from 'cors';
import { prisma } from './src/lib/prisma';


const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());


app.get('/api/db-test', async(req, res) => {
  try{
    const users = await prisma.user.findMany();
    res.json({
      status: 'ok',
      count: users.length,
      users
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'connection failed'
    });
  }
});


app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});