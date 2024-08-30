export declare const formatDate: (date: Date) => string;
export declare const isTimeWithinRange: (time: Date, fromTime: string, toTime: string) => boolean;
import { Request, Response, NextFunction } from 'express';
export declare const validateCheckAvailability: import("express-validator").ValidationChain[];
export declare const validateScheduleTestDrive: import("express-validator").ValidationChain[];
export declare const validate: (req: Request, res: Response, next: NextFunction) => void;
