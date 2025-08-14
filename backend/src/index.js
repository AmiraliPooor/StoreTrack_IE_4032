import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from 'dotenv';
import { errorMiddleware } from './lib/errors.js';

import productsRoute from './routes/products.js';
import ordersRoute from './routes/orders.js';
import transactionsRoute from './routes/transactions.js';
import reportsRoute from './routes/reports.js';
import alertsRoute from './routes/alerts.js';

config();

const app = express();
app.use(cors()); // allow localhost:5173 (Vite) / 3000 etc.
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/products', productsRoute);
app.use('/api/orders', ordersRoute);
app.use('/api/transactions', transactionsRoute);
app.use('/api/reports', reportsRoute);
app.use('/api/alerts', alertsRoute);

// error handler
app.use(errorMiddleware);

const port = process.env.PORT || 5005;
app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
