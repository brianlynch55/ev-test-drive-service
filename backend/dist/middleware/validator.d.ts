import { Request, Response, NextFunction } from "express";
export declare const validateCheckAvailability: import("express-validator").ValidationChain[];
export declare const validateScheduleTestDrive: import("express-validator").ValidationChain[];
export declare const validate: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
