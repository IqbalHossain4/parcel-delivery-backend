"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IParcelStatus = void 0;
var IParcelStatus;
(function (IParcelStatus) {
    IParcelStatus["requested"] = "requested";
    IParcelStatus["approved"] = "approved";
    IParcelStatus["dispatched"] = "dispatched";
    IParcelStatus["inTransit"] = "inTransit";
    IParcelStatus["delivered"] = "delivered";
    IParcelStatus["cancelled"] = "cancelled";
    IParcelStatus["rejected"] = "rejected";
    IParcelStatus["returned"] = "returned";
    IParcelStatus["rescheduled"] = "rescheduled";
})(IParcelStatus || (exports.IParcelStatus = IParcelStatus = {}));
