"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = bindAll;
function bindAll(obj) {
    const proto = Object.getPrototypeOf(obj);
    Object.getOwnPropertyNames(proto)
        .filter(key => typeof obj[key] === 'function' && key !== 'constructor')
        .forEach(key => {
        obj[key] = obj[key].bind(obj);
    });
}
//# sourceMappingURL=bind-all.js.map