"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.validateScheduleTestDrive = exports.validateCheckAvailability = exports.isTimeWithinRange = exports.formatDate = void 0;
const date_fns_1 = require("date-fns");
const formatDate = (date) => (0, date_fns_1.format)(date, "yyyy-MM-dd'T'HH:mm:ssXXX");
exports.formatDate = formatDate;
const isTimeWithinRange = (time, fromTime, toTime) => {
    const from = (0, date_fns_1.parseISO)(`1970-01-01T${fromTime}Z`);
    const to = (0, date_fns_1.parseISO)(`1970-01-01T${toTime}Z`);
    const testTime = (0, date_fns_1.parseISO)(`1970-01-01T${(0, date_fns_1.format)(time, 'HH:mm:ss')}Z`);
    return (0, date_fns_1.isWithinInterval)(testTime, { start: from, end: to });
};
exports.isTimeWithinRange = isTimeWithinRange;
const express_validator_1 = require("express-validator");
exports.validateCheckAvailability = [
    (0, express_validator_1.body)('location').isString().notEmpty(),
    (0, express_validator_1.body)('vehicleType').isString().notEmpty(),
    (0, express_validator_1.body)('startDateTime').isISO8601(),
    (0, express_validator_1.body)('durationMins').isInt({ min: 1 }),
];
exports.validateScheduleTestDrive = [
    (0, express_validator_1.body)('vehicleId').isString().notEmpty(),
    (0, express_validator_1.body)('startDateTime').isISO8601(),
    (0, express_validator_1.body)('durationMins').isInt({ min: 1 }),
    (0, express_validator_1.body)('customerName').isString().notEmpty(),
    (0, express_validator_1.body)('customerPhone').isMobilePhone('any'),
    (0, express_validator_1.body)('customerEmail').isEmail(),
];
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};
exports.validate = validate;
//# sourceMappingURL=dateUtils.js.map