"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const database_1 = require("./config/database");
const testDriveRoutes_1 = __importDefault(require("./routes/testDriveRoutes"));
const errorHandler_1 = require("./middleware/errorHandler");
const rateLimiter_1 = require("./middleware/rateLimiter");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
(0, database_1.connectDB)();
app.use(express_1.default.json());
app.use(rateLimiter_1.apiLimiter);
app.use("/api/test-drive", testDriveRoutes_1.default);
app.use(errorHandler_1.errorHandler);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//# sourceMappingURL=server.js.map