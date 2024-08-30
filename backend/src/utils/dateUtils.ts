import { parseISO, format, isWithinInterval } from 'date-fns';

export const isTimeWithinRange = (time: Date, fromTime: string, toTime: string): boolean => {
  const from = parseISO(`1970-01-01T${fromTime}Z`);
  const to = parseISO(`1970-01-01T${toTime}Z`);
  const testTime = parseISO(`1970-01-01T${format(time, 'HH:mm:ss')}Z`);
  return isWithinInterval(testTime, { start: from, end: to });
};

import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateCheckAvailability = [
  body('location').isString().notEmpty(),
  body('vehicleType').isString().notEmpty(),
  body('startDateTime').isISO8601(),
  body('durationMins').isInt({ min: 1 }),
];

export const validateScheduleTestDrive = [
  body('vehicleId').isString().notEmpty(),
  body('startDateTime').isISO8601(),
  body('durationMins').isInt({ min: 1 }),
  body('customerName').isString().notEmpty(),
  body('customerPhone').isMobilePhone('any'),
  body('customerEmail').isEmail(),
];

export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};
