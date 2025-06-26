"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const project_routes_1 = __importDefault(require("./routes/project.routes"));
const ai_routes_1 = __importDefault(require("./routes/ai.routes"));
const helmet_1 = __importDefault(require("helmet"));
const app = (0, express_1.default)();
app.use((0, morgan_1.default)('dev'));
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, helmet_1.default)());
app.use('/api/v1/user', user_routes_1.default);
app.use('/api/v1/project', project_routes_1.default);
app.use('/api/v1/ai', ai_routes_1.default);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ msg: 'Internal Server Error' });
});
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
exports.default = app;
