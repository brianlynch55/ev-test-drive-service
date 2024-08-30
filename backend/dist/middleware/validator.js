"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.validateScheduleTestDrive = exports.validateCheckAvailability = void 0;
const express_validator_1 = require("express-validator");
exports.validateCheckAvailability = [
    (0, express_validator_1.body)("location").isString().notEmpty(),
    (0, express_validator_1.body)("vehicleType").isString().notEmpty(),
    (0, express_validator_1.body)("startDateTime").isISO8601(),
    (0, express_validator_1.body)("durationMins").isInt({ min: 1 }),
];
exports.validateScheduleTestDrive = [
    (0, express_validator_1.body)("vehicleId").isString().notEmpty(),
    (0, express_validator_1.body)("startDateTime").isISO8601(),
    (0, express_validator_1.body)("durationMins").isInt({ min: 1 }),
    (0, express_validator_1.body)("customerName").isString().notEmpty(),
    (0, express_validator_1.body)("customerPhone").isMobilePhone("any"),
    (0, express_validator_1.body)("customerEmail").isEmail(),
];
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    return next();
};
exports.validate = validate;
//# sourceMappingURL=validator.js.map