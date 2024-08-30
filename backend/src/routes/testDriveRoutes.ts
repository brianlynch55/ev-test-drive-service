import express from 'express';
import * as testDriveController from '../controllers/testDriveController';
import { validateCheckAvailability, validateScheduleTestDrive, validate } from '../middleware/validator';

const router = express.Router();

router.post('/check-availability', validateCheckAvailability, validate, testDriveController.checkAvailability);
router.post('/schedule-test-drive', validateScheduleTestDrive, validate, testDriveController.scheduleTestDrive);

export default router;