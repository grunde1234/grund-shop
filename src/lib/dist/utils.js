"use strict";
exports.__esModule = true;
exports.round2 = exports.formatError = exports.formatNumber = exports.convertToPlainObject = exports.cn = void 0;
var clsx_1 = require("clsx");
var tailwind_merge_1 = require("tailwind-merge");
function cn() {
    var inputs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        inputs[_i] = arguments[_i];
    }
    return tailwind_merge_1.twMerge(clsx_1.clsx(inputs));
}
exports.cn = cn;
//convert prisma object into a regular js object function
function convertToPlainObject(data) {
    return JSON.parse(JSON.stringify(data));
}
exports.convertToPlainObject = convertToPlainObject;
//format numbers with decimals
function formatNumber(num) {
    var _a = num.toString().split('.'), int = _a[0], decimal = _a[1];
    return decimal ? int + "." + decimal.padEnd(2, '0') : int + ".00";
}
exports.formatNumber = formatNumber;
//format errors
//eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatError(error) {
    var _a;
    var zodErrors = error.errors || error.issues;
    if (Array.isArray(zodErrors)) {
        var fieldErrors = zodErrors.map(function (err) { return err.message; });
        return fieldErrors.join(', ');
    }
    else if (error.name === 'PrismaClientKnownRequestError' && error.code === 'P2002') {
        //handle prisma errors
        var field = ((_a = error.meta) === null || _a === void 0 ? void 0 : _a.target) ? error.meta.target[0] : 'field'; //get the field that caused the error and it is a single field
        return "The " + (field.charAt(0).toUpperCase() + field.slice(1)) + " is already in use. Please choose a different " + field + ".";
    }
    else {
        //handle other errors
        return typeof error.message === 'string' ? error.message : 'An unexpected error occurred. Please try again.';
    }
}
exports.formatError = formatError;
//round to 2 decimals
function round2(value) {
    if (typeof value === 'number') {
        /* return Math.round((value + Number.EPSILON) * 100) / 100; */
        return Math.round((value + Number.EPSILON) * 100) / 100;
    }
    else if (typeof value === 'string') {
        return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
    }
    else {
        throw new Error('Invalid value type');
    }
}
exports.round2 = round2;
