import { Router } from 'express';
import { prisma } from '../prisma.js';

const router = Router();

// GET /api/reports/sales
// For each product: totalSold & revenue (includes all orders like your UI)
router.get('/sales', async (_req, res) => {
  const [products, items] = await Promise.all([
    prisma.product.findMany({ where: { isDeleted: false } }),
    prisma.orderItem.findMany()
  ]);

  const totals = products.map(p => {
    const sold = items.filter(i => i.productId === p.id);
    const totalSold = sold.reduce((s, i) => s + i.quantity, 0);
    const revenue = sold.reduce((s, i) => s + i.quantity * i.priceAtOrder, 0);
    return {
      id: p.id, name: p.name, totalSold, revenue
    };
  });

  res.json(totals);
});

export default router;
