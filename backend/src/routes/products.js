import { Router } from 'express';
import { prisma } from '../prisma.js';
import { productCreateSchema, productUpdateSchema } from '../lib/validators.js';
import { HttpError } from '../lib/errors.js';

const router = Router();

// GET /api/products?search=...&category=...
router.get('/', async (req, res) => {
  const { search = '', category } = req.query;
  const products = await prisma.product.findMany({
    where: {
      isDeleted: false,
      AND: [
        search ? { OR: [
          { name: { contains: String(search) } },
          { category: { contains: String(search) } }
        ] } : {},
        category ? { category: String(category) } : {}
      ]
    },
    orderBy: { id: 'asc' }
  });
  res.json(products);
});

// POST /api/products
router.post('/', async (req, res, next) => {
  try {
    const body = productCreateSchema.parse(req.body);
    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({ data: body });
      await tx.transaction.create({
        data: {
          productId: product.id,
          type: 'IN',
          quantity: product.stock
        }
      });
      return product;
    });
    res.status(201).json(result);
  } catch (e) { next(e); }
});

// PUT /api/products/:id
router.put('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const data = productUpdateSchema.parse(req.body);

    const existing = await prisma.product.findFirst({ where: { id, isDeleted: false } });
    if (!existing) throw new HttpError(404, 'Product not found');

    const stockDelta = data.stock - existing.stock;

    const updated = await prisma.$transaction(async (tx) => {
      const product = await tx.product.update({
        where: { id },
        data
      });
      if (stockDelta !== 0) {
        await tx.transaction.create({
          data: {
            productId: id,
            type: stockDelta > 0 ? 'IN' : 'OUT',
            quantity: Math.abs(stockDelta)
          }
        });
      }
      return product;
    });

    res.json(updated);
  } catch (e) { next(e); }
});

// DELETE (soft) /api/products/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const product = await prisma.product.update({
      where: { id },
      data: { isDeleted: true }
    });
    res.json({ ok: true, id: product.id });
  } catch (e) { next(e); }
});

export default router;
