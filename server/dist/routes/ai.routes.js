"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const aiRouter = express_1.default.Router();
const ai_controller_1 = require("../controllers/ai.controller");
aiRouter.get('/get-result', ai_controller_1.generateResultController);
exports.default = aiRouter;
