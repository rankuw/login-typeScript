"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function errorHandler(err, req, res, next) {
    var _a;
    res.status = (_a = res.status) !== null && _a !== void 0 ? _a : 400;
    res.send(err.message);
    next();
}
exports.default = errorHandler;
