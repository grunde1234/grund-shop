'use client';
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
var navigation_1 = require("next/navigation");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var validators_1 = require("@/lib/validators");
var zod_1 = require("@hookform/resolvers/zod");
var react_hook_form_1 = require("react-hook-form");
var form_1 = require("@/components/ui/form");
var input_1 = require("@/components/ui/input");
var button_1 = require("@/components/ui/button");
var ShippingAddressForm = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h;
    var address = _a.address;
    var router = navigation_1.useRouter();
    var _j = react_1.useTransition(), isPending = _j[0], startTransition = _j[1];
    var defaultValues = {
        fullName: (_b = address === null || address === void 0 ? void 0 : address.fullName) !== null && _b !== void 0 ? _b : "John Doe",
        streetAddress: (_c = address === null || address === void 0 ? void 0 : address.streetAddress) !== null && _c !== void 0 ? _c : "123 Main St",
        city: (_d = address === null || address === void 0 ? void 0 : address.city) !== null && _d !== void 0 ? _d : "Dubai",
        postalCode: (_e = address === null || address === void 0 ? void 0 : address.postalCode) !== null && _e !== void 0 ? _e : "123456",
        country: (_f = address === null || address === void 0 ? void 0 : address.country) !== null && _f !== void 0 ? _f : "USA",
        lat: (_g = address === null || address === void 0 ? void 0 : address.lat) !== null && _g !== void 0 ? _g : 0,
        lng: (_h = address === null || address === void 0 ? void 0 : address.lng) !== null && _h !== void 0 ? _h : 0
    };
    var form = react_hook_form_1.useForm({
        mode: 'onBlur',
        resolver: zod_1.zodResolver(validators_1.shippingAddressSchema),
        defaultValues: defaultValues
    });
    function submitForm(data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log(data);
                return [2 /*return*/];
            });
        });
    }
    return (React.createElement("div", { className: "max-w-md mx-auto space-y-4" },
        React.createElement("h2", { className: "h2-bold mt-4" }, "Shipping Address"),
        React.createElement("p", { className: "text-sm text-muted-foreground" }, "Please enter an address to ship to"),
        React.createElement(form_1.Form, __assign({}, form),
            React.createElement("form", { onSubmit: form.handleSubmit(submitForm), className: "space-y-4" },
                React.createElement("div", { className: "flex flex-col gap-5 md:flex-row" },
                    React.createElement(form_1.FormField, { control: form.control, name: "fullName", render: function (_a) {
                            var field = _a.field;
                            return (React.createElement(form_1.FormItem, { className: 'w-full' },
                                React.createElement(form_1.FormLabel, null, "Full Name"),
                                React.createElement(form_1.FormControl, null,
                                    React.createElement(input_1.Input, __assign({ placeholder: "Please enter your full name" }, field))),
                                React.createElement(form_1.FormMessage, null)));
                        } })),
                React.createElement("div", { className: "flex flex-col gap-5 md:flex-row" },
                    React.createElement(form_1.FormField, { control: form.control, name: "streetAddress", render: function (_a) {
                            var field = _a.field;
                            return (React.createElement(form_1.FormItem, { className: 'w-full' },
                                React.createElement(form_1.FormLabel, null, "Address"),
                                React.createElement(form_1.FormControl, null,
                                    React.createElement(input_1.Input, __assign({ placeholder: "Please enter your Address" }, field))),
                                React.createElement(form_1.FormMessage, null)));
                        } })),
                React.createElement("div", { className: "flex flex-col gap-5 md:flex-row" },
                    React.createElement(form_1.FormField, { control: form.control, name: "city", render: function (_a) {
                            var field = _a.field;
                            return (React.createElement(form_1.FormItem, { className: 'w-full' },
                                React.createElement(form_1.FormLabel, null, "City"),
                                React.createElement(form_1.FormControl, null,
                                    React.createElement(input_1.Input, __assign({ placeholder: "Please enter your city" }, field))),
                                React.createElement(form_1.FormMessage, null)));
                        } })),
                React.createElement("div", { className: "flex flex-col gap-5 md:flex-row" },
                    React.createElement(form_1.FormField, { control: form.control, name: "postalCode", render: function (_a) {
                            var field = _a.field;
                            return (React.createElement(form_1.FormItem, { className: 'w-full' },
                                React.createElement(form_1.FormLabel, null, "Postal code"),
                                React.createElement(form_1.FormControl, null,
                                    React.createElement(input_1.Input, __assign({ placeholder: "Please enter your postal code" }, field))),
                                React.createElement(form_1.FormMessage, null)));
                        } })),
                React.createElement("div", { className: "flex flex-col gap-5 md:flex-row" },
                    React.createElement(form_1.FormField, { control: form.control, name: "country", render: function (_a) {
                            var field = _a.field;
                            return (React.createElement(form_1.FormItem, { className: 'w-full' },
                                React.createElement(form_1.FormLabel, null, "Country"),
                                React.createElement(form_1.FormControl, null,
                                    React.createElement(input_1.Input, __assign({ placeholder: "Please enter your country" }, field))),
                                React.createElement(form_1.FormMessage, null)));
                        } })),
                React.createElement("div", { className: "flex gap-2" },
                    React.createElement(button_1.Button, { type: "submit", disabled: isPending },
                        isPending ? (React.createElement(lucide_react_1.Loader, { className: "w-4 h-4 animate-spin" })) : (React.createElement(lucide_react_1.ArrowRight, { className: "w-4 h-4" })),
                        "Continue"))))));
};
exports["default"] = ShippingAddressForm;
