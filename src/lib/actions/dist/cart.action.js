'use server';
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.removeItemFromCart = exports.getMyCart = exports.addItemToCart = void 0;
var headers_1 = require("next/headers");
var utils_1 = require("../utils");
var auth_1 = require("../../../auth");
var prisma_1 = require("../../../db/prisma");
var validators_1 = require("../validators");
var utils_2 = require("../utils");
var cache_1 = require("next/cache");
/* import { Prisma } from '@prisma/client'
 */
// Calculate cart prices
//???????????????????
var calcPrice = function (items) {
    var itemPrice = utils_2.round2(items.reduce(function (acc, item) { return acc + Number(item.price) * item.qty; }, 0));
    var shippingPrice = utils_2.round2(itemPrice > 10 ? 0 : 10);
    var taxPrice = utils_2.round2((itemPrice * 15) / 100);
    var totalPrice = utils_2.round2(itemPrice + shippingPrice + taxPrice);
    return {
        itemPrice: itemPrice.toFixed(2),
        shippingPrice: shippingPrice.toFixed(2),
        taxPrice: taxPrice.toFixed(2),
        totalPrice: totalPrice.toFixed(2)
    };
};
//????????????????
function addItemToCart(data) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var sessionCartId, session, userId, cart, item_1, product, newCart, existItems, prices, error_1;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 8, , 9]);
                    return [4 /*yield*/, headers_1.cookies()];
                case 1:
                    sessionCartId = (_a = (_d.sent()).get("sessionCartId")) === null || _a === void 0 ? void 0 : _a.value;
                    if (!sessionCartId)
                        throw new Error("Cart session not found");
                    return [4 /*yield*/, auth_1.auth()];
                case 2:
                    session = _d.sent();
                    userId = ((_b = session === null || session === void 0 ? void 0 : session.user) === null || _b === void 0 ? void 0 : _b.id) ? session.user.id : undefined;
                    return [4 /*yield*/, getMyCart()
                        // Parse and validate item
                    ];
                case 3:
                    cart = _d.sent();
                    item_1 = validators_1.cartItemSchema.parse(data);
                    return [4 /*yield*/, prisma_1.prisma.product.findFirst({
                            where: { id: item_1.productId }
                        })];
                case 4:
                    product = _d.sent();
                    if (!product)
                        throw new Error("Product not found");
                    if (!!cart) return [3 /*break*/, 6];
                    newCart = validators_1.insertCartSchema.parse(__assign({ userId: userId, items: [item_1], sessionCartId: sessionCartId }, calcPrice([item_1])));
                    console.log("NEW CART:", newCart);
                    return [4 /*yield*/, prisma_1.prisma.cart.create({
                            data: {
                                userId: (_c = newCart.userId) !== null && _c !== void 0 ? _c : null,
                                sessionCartId: newCart.sessionCartId,
                                items: newCart.items,
                                itemsPrice: newCart.itemPrice,
                                shippingPrice: newCart.shippingPrice,
                                taxPrice: newCart.taxPrice,
                                totalPrice: newCart.totalPrice
                            }
                        })];
                case 5:
                    _d.sent();
                    cache_1.revalidatePath("/product/" + product.slug);
                    return [2 /*return*/, {
                            success: true,
                            message: product.name + " added to cart successfully"
                        }];
                case 6:
                    existItems = cart.items.find(function (x) { return x.productId === item_1.productId; });
                    if (existItems) {
                        // check stock
                        if (product.stock < existItems.qty + 1) {
                            throw new Error("Not enough");
                        }
                        // increase qty
                        existItems.qty = existItems.qty + 1;
                    }
                    else {
                        // new item, check stock
                        if (product.stock < item_1.qty) {
                            throw new Error("Not enough");
                        }
                        cart.items.push(item_1);
                    }
                    prices = calcPrice(cart.items);
                    return [4 /*yield*/, prisma_1.prisma.cart.update({
                            where: { id: cart.id },
                            data: {
                                items: cart.items,
                                // MUST MATCH Prisma schema names
                                itemsPrice: prices.itemPrice,
                                shippingPrice: prices.shippingPrice,
                                taxPrice: prices.taxPrice,
                                totalPrice: prices.totalPrice
                            }
                        })
                        //******** */
                    ];
                case 7:
                    _d.sent();
                    //******** */
                    cache_1.revalidatePath("/product/" + product.slug);
                    return [2 /*return*/, {
                            success: true,
                            message: product.name + " " + (existItems ? "updated" : "added to") + " cart"
                        }];
                case 8:
                    error_1 = _d.sent();
                    return [2 /*return*/, {
                            success: false,
                            message: utils_1.formatError(error_1)
                        }];
                case 9: return [2 /*return*/];
            }
        });
    });
}
exports.addItemToCart = addItemToCart;
function getMyCart() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var sessionCartId, session, userId, cart;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, headers_1.cookies()];
                case 1:
                    sessionCartId = (_a = (_c.sent()).get("sessionCartId")) === null || _a === void 0 ? void 0 : _a.value;
                    if (!sessionCartId)
                        throw new Error("Cart session not found");
                    return [4 /*yield*/, auth_1.auth()];
                case 2:
                    session = _c.sent();
                    userId = ((_b = session === null || session === void 0 ? void 0 : session.user) === null || _b === void 0 ? void 0 : _b.id) ? session.user.id : undefined;
                    return [4 /*yield*/, prisma_1.prisma.cart.findFirst({
                            where: userId ? { userId: userId } : { sessionCartId: sessionCartId }
                        })];
                case 3:
                    cart = _c.sent();
                    if (!cart)
                        return [2 /*return*/, undefined];
                    return [2 /*return*/, utils_2.convertToPlainObject(__assign(__assign({}, cart), { items: cart.items, itemsPrice: cart.itemsPrice.toString(), totalPrice: cart.totalPrice.toString(), shippingPrice: cart.shippingPrice.toString(), taxPrice: cart.taxPrice.toString() }))];
            }
        });
    });
}
exports.getMyCart = getMyCart;
function removeItemFromCart(productId) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var sessionCartId, product, cart, exist_1, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, headers_1.cookies()];
                case 1:
                    sessionCartId = (_a = (_b.sent()).get("sessionCartId")) === null || _a === void 0 ? void 0 : _a.value;
                    if (!sessionCartId)
                        throw new Error("Cart session not found");
                    return [4 /*yield*/, prisma_1.prisma.product.findFirst({
                            where: {
                                id: productId
                            }
                        })];
                case 2:
                    product = _b.sent();
                    if (!product)
                        throw new Error('Product not found');
                    return [4 /*yield*/, getMyCart()];
                case 3:
                    cart = _b.sent();
                    if (!cart)
                        throw new Error('Cart not found');
                    exist_1 = cart.items.find(function (x) { return x.productId === productId; });
                    if (!exist_1)
                        throw new Error('Item not found');
                    //Check if one then remove but if more then decrease the qty
                    if (exist_1.qty === 1) {
                        cart.items = cart.items.filter(function (x) { return x.productId !== exist_1.productId; });
                    }
                    else {
                        //Decrease the qty
                        cart.items.find(function (x) { return x.productId === productId; }).qty = exist_1.qty - 1;
                    }
                    //?????????????????????
                    //************* */
                    //update cart in db
                    return [4 /*yield*/, prisma_1.prisma.cart.update({
                            where: { id: cart.id },
                            data: {
                                items: cart.items,
                                // MUST MATCH Prisma schema names
                                itemsPrice: cart.itemsPrice,
                                shippingPrice: cart.shippingPrice,
                                taxPrice: cart.taxPrice,
                                totalPrice: cart.totalPrice
                            }
                        })];
                case 4:
                    //?????????????????????
                    //************* */
                    //update cart in db
                    _b.sent();
                    //????????????????????????????
                    //********************* */
                    cache_1.revalidatePath("/product/" + product.slug);
                    return [2 /*return*/, {
                            success: true,
                            message: product.name + " was remove from cart"
                        }];
                case 5:
                    error_2 = _b.sent();
                    return [2 /*return*/, {
                            success: false,
                            message: utils_1.formatError(error_2)
                        }];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.removeItemFromCart = removeItemFromCart;
