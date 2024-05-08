import express from 'express';
import workOrderRoutes from './workorders';

const router = express.Router();

router.use('/workorders', workOrderRoutes);

export default router;