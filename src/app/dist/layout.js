"use strict";
exports.__esModule = true;
exports.metadata = void 0;
// src/app/layout.tsx
var constants_1 = require("@/lib/constants");
var google_1 = require("next/font/google");
require("@/assets/styles/globals.css");
var theme_provider_1 = require("@/components/theme-provider");
var sonner_1 = require("sonner");
var inter = google_1.Inter({ subsets: ["latin"] });
exports.metadata = {
    title: {
        template: "%s | prostore",
        "default": constants_1.APP_NAME
    },
    description: constants_1.APP_DESCRIPTION,
    metadataBase: new URL(constants_1.SERVER_URL)
};
function RootLayout(_a) {
    var children = _a.children;
    return (React.createElement("html", { lang: "en", suppressHydrationWarning: true },
        React.createElement("body", { className: inter.className },
            React.createElement(theme_provider_1.ThemeProvider, { attribute: "class", defaultTheme: "system", enableSystem: true, disableTransitionOnChange: true },
                React.createElement(sonner_1.Toaster, { richColors: true }),
                children))));
}
exports["default"] = RootLayout;
