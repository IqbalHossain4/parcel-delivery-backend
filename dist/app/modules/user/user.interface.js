"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = exports.Role = void 0;
var Role;
(function (Role) {
    Role["admin"] = "admin";
    Role["sender"] = "sender";
    Role["receiver"] = "receiver";
})(Role || (exports.Role = Role = {}));
var Status;
(function (Status) {
    Status["isActive"] = "active";
    Status["isInactive"] = "inactive";
    Status["isBlocked"] = "blocked";
})(Status || (exports.Status = Status = {}));
