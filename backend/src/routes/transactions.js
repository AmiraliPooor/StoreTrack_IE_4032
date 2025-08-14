import { Router } from 'express';
import { prisma } from '../prisma.js';

const router = Router();

// GET /api/transactions
router.get('/', async (_req, res) => {
  const txs = await prisma.transaction.findMany({
    orderBy: { id: 'asc' }
  });
  res.json(txs);
});

export default router;
