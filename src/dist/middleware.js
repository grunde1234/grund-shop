"use strict";
exports.__esModule = true;
exports.config = exports.middleware = void 0;
var server_1 = require("next/server");
function middleware(req) {
    var _a;
    var sessionCartId = (_a = req.cookies.get("sessionCartId")) === null || _a === void 0 ? void 0 : _a.value;
    // If no session cookie, create one
    if (!sessionCartId) {
        var newSessionId = crypto.randomUUID();
        console.log("New cart session:", newSessionId);
        var response = server_1.NextResponse.next();
        response.cookies.set("sessionCartId", newSessionId, {
            path: "/",
            maxAge: 60 * 60 * 24 * 7
        });
        return response;
    }
    // Already has session
    return server_1.NextResponse.next();
}
exports.middleware = middleware;
exports.config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
};
