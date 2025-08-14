import { Router } from 'express';
import { prisma } from '../prisma.js';

const router = Router();

// GET /api/alerts/low-stock
router.get('/low-stock', async (_req, res) => {
    const all = await prisma.product.findMany({ where: { isDeleted: false } });
    const low = all.filter(p => p.stock <= p.minStock);
    res.json(low);
})

export default router;
