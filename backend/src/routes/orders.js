import { Router } from 'express';
import { prisma } from '../prisma.js';
import { orderCreateSchema, orderStatusSchema } from '../lib/validators.js';
import { HttpError } from '../lib/errors.js';

const router = Router();

router.get('/', async (req, res) => {
  const { filter = '' } = req.query;
  const asString = String(filter);

  const orders = await prisma.order.findMany({
    where: asString
      ? {
          OR: [
            { customerName: { contains: asString } },
            { id: !isNaN(Number(asString)) ? Number(asString) : undefined }
          ]
        }
      : {},
    orderBy: { id: 'asc' },
    include: { items: true }
  });

  res.json(orders);
});

router.post('/', async (req, res, next) => {
  try {
    const payload = orderCreateSchema.parse(req.body);

    const result = await prisma.$transaction(async (tx) => {
      for (const item of payload.items) {
        const p = await tx.product.findFirst({ where: { id: item.productId, isDeleted: false } });
        if (!p) throw new HttpError(400, `Product ${item.productId} not found`);
        if (p.stock < item.quantity) {
          throw new HttpError(400, `Insufficient stock for product ${p.name}`);
        }
      }

      const order = await tx.order.create({
        data: {
          customerName: payload.customerName,
          createdAtStr: payload.createdAtStr,
          status: 'Pending'
        }
      });

      for (const item of payload.items) {
        const p = await tx.product.findUnique({ where: { id: item.productId } });
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            priceAtOrder: p.price
          }
        });

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });

        await tx.transaction.create({
          data: {
            productId: item.productId,
            type: 'OUT',
            quantity: item.quantity
          }
        });
      }

      return await tx.order.findUnique({
        where: { id: order.id },
        include: { items: true }
      });
    });

    res.status(201).json(result);
  } catch (e) { next(e); }
});

router.patch('/:id/status', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { status } = orderStatusSchema.parse(req.body);

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) throw new HttpError(404, 'Order not found');

    const updated = await prisma.order.update({
      where: { id },
      data: { status }
    });
    res.json(updated);
  } catch (e) { next(e); }
});

export default router;
