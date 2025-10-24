import express from 'express';
import integrationController from '../controllers/integrationController.js';
const router = express.Router();

router.get('/', integrationController.listIntegrations);
router.delete('/:id', integrationController.removeIntegration);
router.post('/:id/resync', integrationController.resync);

export default router;
