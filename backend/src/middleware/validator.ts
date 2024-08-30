import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateCheckAvailability = [
  body("location").isString().notEmpty(),
  body("vehicleType").isString().notEmpty(),
  body("startDateTime").isISO8601(),
  body("durationMins").isInt({ min: 1 }),
];

export const validateScheduleTestDrive = [
  body("vehicleId").isString().notEmpty(),
  body("startDateTime").isISO8601(),
  body("durationMins").isInt({ min: 1 }),
  body("customerName").isString().notEmpty(),
  body("customerPhone").isMobilePhone("any"),
  body("customerEmail").isEmail(),
];

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return next();
};
