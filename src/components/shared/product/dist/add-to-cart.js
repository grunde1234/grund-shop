"use client";
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var button_1 = require("@/components/ui/button");
var navigation_1 = require("next/navigation");
var lucide_react_1 = require("lucide-react");
var sonner_1 = require("sonner");
var cart_action_1 = require("@/lib/actions/cart.action");
var AddToCart = function (_a) {
    var cart = _a.cart, item = _a.item;
    var router = navigation_1.useRouter();
    //add to the cart and get a response
    var handleAddToCart = function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, cart_action_1.addItemToCart(item)];
                case 1:
                    res = _a.sent();
                    if (!res.success) {
                        sonner_1.toast.error(res.message);
                        return [2 /*return*/];
                    }
                    //For success in this
                    sonner_1.toast.success(res.message, {
                        action: {
                            label: "Go to cart",
                            onClick: function () {
                                router.push("/cart");
                            }
                        }
                    });
                    return [2 /*return*/];
            }
        });
    }); };
    var handleRemoveFromCart = function () { return __awaiter(void 0, void 0, void 0, function () {
        var res, to;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, cart_action_1.removeItemFromCart(item.productId)];
                case 1:
                    res = _a.sent();
                    to = res.success ? sonner_1.toast.success(res.message)
                        : sonner_1.toast.error(res.message);
                    return [2 /*return*/];
            }
        });
    }); };
    //check if item is in the cart 
    var existItem = cart && cart.items.find(function (x) { return x.productId === item.productId; });
    return existItem ? (React.createElement("div", null,
        React.createElement(button_1.Button, { type: 'button', variant: 'outline', onClick: handleRemoveFromCart },
            React.createElement(lucide_react_1.Minus, { className: 'h-4 w-4' })),
        React.createElement("span", { className: "px-2" }, existItem.qty),
        React.createElement(button_1.Button, { type: 'button', variant: 'outline', onClick: handleAddToCart },
            React.createElement(lucide_react_1.Plus, { className: 'h-4 w-4' })))) : (React.createElement(button_1.Button, { className: "w-full cursor-pointer", type: "button", onClick: handleAddToCart },
        React.createElement(lucide_react_1.Plus, null),
        " Add To Cart"));
};
exports["default"] = AddToCart;
