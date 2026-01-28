module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/incubation-frontend/lib/supabase.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/incubation-frontend/node_modules/@supabase/supabase-js/dist/index.mjs [app-ssr] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://dfzfmtthyvwltwwmntmd.supabase.co") || "https://dfzfmtthyvwltwwmntmd.supabase.co";
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmemZtdHRoeXZ3bHR3d21udG1kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQwNDk0NiwiZXhwIjoyMDgzOTgwOTQ2fQ.m8DKbf04d5Awu99sYyTIpv15xvnkoXV3WTOlk4GP8HE") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmemZtdHRoeXZ3bHR3d21udG1kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQwNDk0NiwiZXhwIjoyMDgzOTgwOTQ2fQ.m8DKbf04d5Awu99sYyTIpv15xvnkoXV3WTOlk4GP8HE";
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey);
}),
"[project]/incubation-frontend/lib/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn,
    "formatStatus",
    ()=>formatStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
function formatStatus(status) {
    return status.replace(/_/g, " ").split(" ").map((word)=>word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
}
}),
"[project]/incubation-frontend/components/ui/button.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/node_modules/@radix-ui/react-slot/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/node_modules/class-variance-authority/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/lib/utils.ts [app-ssr] (ecmascript)");
;
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground hover:bg-primary/90",
            destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            link: "text-primary underline-offset-4 hover:underline"
        },
        size: {
            default: "h-10 px-4 py-2",
            sm: "h-9 rounded-md px-3",
            lg: "h-11 rounded-md px-8",
            icon: "h-10 w-10"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
const Button = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, variant, size, asChild = false, ...props }, ref)=>{
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Slot"] : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/incubation-frontend/components/ui/button.tsx",
        lineNumber: 46,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
Button.displayName = "Button";
;
}),
"[project]/incubation-frontend/components/dashboard/Sidebar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Sidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeftIcon$3e$__ = __turbopack_context__.i("[project]/incubation-frontend/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-ssr] (ecmascript) <export default as ArrowLeftIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRightIcon$3e$__ = __turbopack_context__.i("[project]/incubation-frontend/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-ssr] (ecmascript) <export default as ArrowRightIcon>");
"use client";
;
;
;
;
;
;
function Sidebar({ userRole }) {
    const [isMinimized, setIsMinimized] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return false;
    });
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    // Update content margin based on sidebar state
    const updateContentMargin = (minimized)=>{
        const content = document.querySelector(".sidebar-content");
        if (content) {
            content.style.marginLeft = minimized ? "4rem" : "16rem";
        }
    };
    // Initialize content margin on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        updateContentMargin(isMinimized);
    }, [
        isMinimized
    ]);
    // Save sidebar state to localStorage
    const toggleMinimize = ()=>{
        const newState = !isMinimized;
        setIsMinimized(newState);
        localStorage.setItem("sidebarMinimized", String(newState));
        updateContentMargin(newState);
        // Dispatch custom event for same-tab updates
        window.dispatchEvent(new Event("sidebarToggle"));
    };
    const menuItems = [
        {
            name: "Cohorts",
            href: "/dashboard/cohorts",
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                className: "w-5 h-5",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                }, void 0, false, {
                    fileName: "[project]/incubation-frontend/components/dashboard/Sidebar.tsx",
                    lineNumber: 57,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/incubation-frontend/components/dashboard/Sidebar.tsx",
                lineNumber: 51,
                columnNumber: 9
            }, this)
        },
        {
            name: "Applications",
            href: "/dashboard",
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                className: "w-5 h-5",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                }, void 0, false, {
                    fileName: "[project]/incubation-frontend/components/dashboard/Sidebar.tsx",
                    lineNumber: 76,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/incubation-frontend/components/dashboard/Sidebar.tsx",
                lineNumber: 70,
                columnNumber: 9
            }, this)
        },
        {
            name: "Users",
            href: "/dashboard/users",
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                className: "w-5 h-5",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                }, void 0, false, {
                    fileName: "[project]/incubation-frontend/components/dashboard/Sidebar.tsx",
                    lineNumber: 95,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/incubation-frontend/components/dashboard/Sidebar.tsx",
                lineNumber: 89,
                columnNumber: 9
            }, this),
            roles: [
                "manager"
            ]
        }
    ];
    const filteredMenuItems = menuItems.filter((item)=>!item.roles || item.roles.includes(userRole));
    const isActive = (href)=>{
        if (href === "/dashboard") {
            return pathname === "/dashboard";
        }
        return pathname?.startsWith(href);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: `bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transition-all duration-300 ${isMinimized ? "w-16" : "w-64"} flex flex-col h-screen fixed left-0 top-0 z-50`,
        style: {
            width: isMinimized ? "4rem" : "16rem"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `h-16 border-b border-zinc-200 dark:border-zinc-800 flex items-center ${isMinimized ? "justify-center" : "justify-between"} px-4`,
                children: [
                    isMinimized ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "w-6 h-6 text-black dark:text-zinc-50",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M13 10V3L4 14h7v7l9-11h-7z"
                            }, void 0, false, {
                                fileName: "[project]/incubation-frontend/components/dashboard/Sidebar.tsx",
                                lineNumber: 139,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/incubation-frontend/components/dashboard/Sidebar.tsx",
                            lineNumber: 133,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/incubation-frontend/components/dashboard/Sidebar.tsx",
                        lineNumber: 132,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-lg font-bold text-black dark:text-zinc-50",
                            children: "LaunchPad"
                        }, void 0, false, {
                            fileName: "[project]/incubation-frontend/components/dashboard/Sidebar.tsx",
                            lineNumber: 149,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/incubation-frontend/components/dashboard/Sidebar.tsx",
                        lineNumber: 148,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        onClick: toggleMinimize,
                        variant: "ghost",
                        size: "icon",
                        "aria-label": isMinimized ? "Expand sidebar" : "Minimize sidebar",
                        className: isMinimized ? "absolute right-2" : "",
                        children: isMinimized ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRightIcon$3e$__["ArrowRightIcon"], {
                            className: "w-5 h-5 text-zinc-600 dark:text-zinc-400 mr-4"
                        }, void 0, false, {
                            fileName: "[project]/incubation-frontend/components/dashboard/Sidebar.tsx",
                            lineNumber: 162,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeftIcon$3e$__["ArrowLeftIcon"], {
                            className: "w-5 h-5 text-zinc-600 dark:text-zinc-400"
                        }, void 0, false, {
                            fileName: "[project]/incubation-frontend/components/dashboard/Sidebar.tsx",
                            lineNumber: 164,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/incubation-frontend/components/dashboard/Sidebar.tsx",
                        lineNumber: 154,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/incubation-frontend/components/dashboard/Sidebar.tsx",
                lineNumber: 126,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "flex-1 overflow-y-auto p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                    className: "space-y-2",
                    children: filteredMenuItems.map((item)=>{
                        const active = isActive(item.href);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: item.href,
                                className: `flex items-center transition-colors ${isMinimized ? active ? "justify-center w-10 h-10 rounded bg-black dark:bg-zinc-50 text-white dark:text-black" : "justify-center w-10 h-10 rounded text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800" : active ? "gap-3 px-3 py-2 rounded-md bg-black dark:bg-zinc-50 text-white dark:text-black" : "gap-3 px-3 py-2 rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"}`,
                                title: isMinimized ? item.name : undefined,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `flex-shrink-0 ${isMinimized && active ? "flex items-center justify-center" : ""}`,
                                        children: item.icon
                                    }, void 0, false, {
                                        fileName: "[project]/incubation-frontend/components/dashboard/Sidebar.tsx",
                                        lineNumber: 189,
                                        columnNumber: 19
                                    }, this),
                                    !isMinimized && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium",
                                        children: item.name
                                    }, void 0, false, {
                                        fileName: "[project]/incubation-frontend/components/dashboard/Sidebar.tsx",
                                        lineNumber: 199,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/incubation-frontend/components/dashboard/Sidebar.tsx",
                                lineNumber: 176,
                                columnNumber: 17
                            }, this)
                        }, item.name, false, {
                            fileName: "[project]/incubation-frontend/components/dashboard/Sidebar.tsx",
                            lineNumber: 175,
                            columnNumber: 15
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/incubation-frontend/components/dashboard/Sidebar.tsx",
                    lineNumber: 171,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/incubation-frontend/components/dashboard/Sidebar.tsx",
                lineNumber: 170,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-t border-zinc-200 dark:border-zinc-800 p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                className: "w-5 h-5 text-zinc-600 dark:text-zinc-400",
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                }, void 0, false, {
                                    fileName: "[project]/incubation-frontend/components/dashboard/Sidebar.tsx",
                                    lineNumber: 218,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/incubation-frontend/components/dashboard/Sidebar.tsx",
                                lineNumber: 212,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/incubation-frontend/components/dashboard/Sidebar.tsx",
                            lineNumber: 211,
                            columnNumber: 11
                        }, this),
                        !isMinimized && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 min-w-0",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm font-medium text-black dark:text-zinc-50 truncate",
                                children: userRole === "manager" ? "Manager" : "Reviewer"
                            }, void 0, false, {
                                fileName: "[project]/incubation-frontend/components/dashboard/Sidebar.tsx",
                                lineNumber: 228,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/incubation-frontend/components/dashboard/Sidebar.tsx",
                            lineNumber: 227,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/incubation-frontend/components/dashboard/Sidebar.tsx",
                    lineNumber: 210,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/incubation-frontend/components/dashboard/Sidebar.tsx",
                lineNumber: 209,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/incubation-frontend/components/dashboard/Sidebar.tsx",
        lineNumber: 119,
        columnNumber: 5
    }, this);
}
}),
"[project]/incubation-frontend/components/dashboard/DashboardLayout.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/lib/supabase.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$dashboard$2f$Sidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/components/dashboard/Sidebar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/components/ui/button.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
function DashboardLayout({ children }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [sidebarMinimized, setSidebarMinimized] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        checkUser();
        // Load sidebar state
        const savedState = localStorage.getItem("sidebarMinimized");
        if (savedState !== null) {
            setSidebarMinimized(savedState === "true");
        }
        // Listen for sidebar state changes
        const handleStorageChange = ()=>{
            const savedState = localStorage.getItem("sidebarMinimized");
            if (savedState !== null) {
                setSidebarMinimized(savedState === "true");
            }
        };
        window.addEventListener("storage", handleStorageChange);
        // Also listen to custom event for same-tab updates
        window.addEventListener("sidebarToggle", handleStorageChange);
        return ()=>{
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("sidebarToggle", handleStorageChange);
        };
    }, []);
    const checkUser = async ()=>{
        try {
            const { data: { user } } = await __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }
            const { data: profile } = await __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("user_profiles").select("role").eq("id", user.id).single();
            if (!profile || profile.role !== "manager" && profile.role !== "reviewer") {
                router.push("/login");
                return;
            }
            setUser({
                ...user,
                role: profile.role
            });
        } catch (error) {
            console.error("Error checking user:", error);
            router.push("/login");
        } finally{
            setIsLoading(false);
        }
    };
    const handleLogout = async ()=>{
        await __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.signOut();
        router.push("/login");
    };
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-zinc-600 dark:text-zinc-400",
                children: "Loading..."
            }, void 0, false, {
                fileName: "[project]/incubation-frontend/components/dashboard/DashboardLayout.tsx",
                lineNumber: 88,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/incubation-frontend/components/dashboard/DashboardLayout.tsx",
            lineNumber: 87,
            columnNumber: 7
        }, this);
    }
    if (!user) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-zinc-50 dark:bg-black flex",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$dashboard$2f$Sidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                userRole: user.role
            }, void 0, false, {
                fileName: "[project]/incubation-frontend/components/dashboard/DashboardLayout.tsx",
                lineNumber: 99,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex flex-col ml-64 transition-all duration-300 sidebar-content",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 h-16 flex items-center justify-between px-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1"
                            }, void 0, false, {
                                fileName: "[project]/incubation-frontend/components/dashboard/DashboardLayout.tsx",
                                lineNumber: 103,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm text-zinc-600 dark:text-zinc-400",
                                        children: [
                                            user.email,
                                            " (",
                                            user.role,
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/incubation-frontend/components/dashboard/DashboardLayout.tsx",
                                        lineNumber: 105,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        onClick: handleLogout,
                                        variant: "default",
                                        size: "sm",
                                        children: "Logout"
                                    }, void 0, false, {
                                        fileName: "[project]/incubation-frontend/components/dashboard/DashboardLayout.tsx",
                                        lineNumber: 108,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/incubation-frontend/components/dashboard/DashboardLayout.tsx",
                                lineNumber: 104,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/incubation-frontend/components/dashboard/DashboardLayout.tsx",
                        lineNumber: 102,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "flex-1 overflow-y-auto",
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/incubation-frontend/components/dashboard/DashboardLayout.tsx",
                        lineNumber: 119,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/incubation-frontend/components/dashboard/DashboardLayout.tsx",
                lineNumber: 100,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/incubation-frontend/components/dashboard/DashboardLayout.tsx",
        lineNumber: 98,
        columnNumber: 5
    }, this);
}
}),
"[project]/incubation-frontend/components/ui/dialog.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Dialog",
    ()=>Dialog,
    "DialogClose",
    ()=>DialogClose,
    "DialogContent",
    ()=>DialogContent,
    "DialogDescription",
    ()=>DialogDescription,
    "DialogFooter",
    ()=>DialogFooter,
    "DialogHeader",
    ()=>DialogHeader,
    "DialogOverlay",
    ()=>DialogOverlay,
    "DialogPortal",
    ()=>DialogPortal,
    "DialogTitle",
    ()=>DialogTitle,
    "DialogTrigger",
    ()=>DialogTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/node_modules/@radix-ui/react-dialog/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/incubation-frontend/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const Dialog = __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"];
const DialogTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Trigger"];
const DialogPortal = __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Portal"];
const DialogClose = __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Close"];
const DialogOverlay = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Overlay"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/incubation-frontend/components/ui/dialog.tsx",
        lineNumber: 21,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
DialogOverlay.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Overlay"].displayName;
const DialogContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogPortal, {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogOverlay, {}, void 0, false, {
                fileName: "[project]/incubation-frontend/components/ui/dialog.tsx",
                lineNumber: 37,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Content"], {
                ref: ref,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-zinc-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg dark:border-zinc-800 dark:bg-zinc-950", className),
                ...props,
                children: [
                    children,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Close"], {
                        className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-zinc-100 data-[state=open]:text-zinc-500 dark:ring-offset-zinc-950 dark:focus:ring-zinc-300 dark:data-[state=open]:bg-zinc-800 dark:data-[state=open]:text-zinc-400",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/incubation-frontend/components/ui/dialog.tsx",
                                lineNumber: 48,
                                columnNumber: 9
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "sr-only",
                                children: "Close"
                            }, void 0, false, {
                                fileName: "[project]/incubation-frontend/components/ui/dialog.tsx",
                                lineNumber: 49,
                                columnNumber: 9
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/incubation-frontend/components/ui/dialog.tsx",
                        lineNumber: 47,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/incubation-frontend/components/ui/dialog.tsx",
                lineNumber: 38,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/incubation-frontend/components/ui/dialog.tsx",
        lineNumber: 36,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
DialogContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Content"].displayName;
const DialogHeader = ({ className, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex flex-col space-y-1.5 text-center sm:text-left", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/incubation-frontend/components/ui/dialog.tsx",
        lineNumber: 60,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
DialogHeader.displayName = "DialogHeader";
const DialogFooter = ({ className, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/incubation-frontend/components/ui/dialog.tsx",
        lineNumber: 74,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
DialogFooter.displayName = "DialogFooter";
const DialogTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Title"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-lg font-semibold leading-none tracking-tight", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/incubation-frontend/components/ui/dialog.tsx",
        lineNumber: 88,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
DialogTitle.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Title"].displayName;
const DialogDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Description"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-sm text-zinc-500 dark:text-zinc-400", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/incubation-frontend/components/ui/dialog.tsx",
        lineNumber: 103,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
DialogDescription.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Description"].displayName;
;
}),
"[project]/incubation-frontend/components/ui/textarea.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Textarea",
    ()=>Textarea
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/lib/utils.ts [app-ssr] (ecmascript)");
;
;
;
const Textarea = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/incubation-frontend/components/ui/textarea.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
});
Textarea.displayName = "Textarea";
;
}),
"[project]/incubation-frontend/components/ui/badge.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "badgeVariants",
    ()=>badgeVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/node_modules/class-variance-authority/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/lib/utils.ts [app-ssr] (ecmascript)");
;
;
;
const badgeVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 dark:focus:ring-zinc-300", {
    variants: {
        variant: {
            default: "border-transparent bg-zinc-900 text-zinc-50 hover:bg-zinc-900/80 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/80",
            secondary: "border-transparent bg-zinc-100 text-zinc-900 hover:bg-zinc-100/80 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-800/80",
            destructive: "border-transparent bg-red-500 text-zinc-50 hover:bg-red-500/80 dark:bg-red-900 dark:text-zinc-50 dark:hover:bg-red-900/80",
            outline: "text-zinc-950 dark:text-zinc-50"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
function Badge({ className, variant, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(badgeVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/incubation-frontend/components/ui/badge.tsx",
        lineNumber: 32,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/incubation-frontend/components/ui/card.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardContent",
    ()=>CardContent,
    "CardDescription",
    ()=>CardDescription,
    "CardFooter",
    ()=>CardFooter,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/lib/utils.ts [app-ssr] (ecmascript)");
;
;
;
const Card = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("rounded-lg bg-card text-card-foreground shadow-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/incubation-frontend/components/ui/card.tsx",
        lineNumber: 9,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
Card.displayName = "Card";
const CardHeader = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex flex-col space-y-1.5 p-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/incubation-frontend/components/ui/card.tsx",
        lineNumber: 24,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CardHeader.displayName = "CardHeader";
const CardTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-2xl font-semibold leading-none tracking-tight", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/incubation-frontend/components/ui/card.tsx",
        lineNumber: 36,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CardTitle.displayName = "CardTitle";
const CardDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/incubation-frontend/components/ui/card.tsx",
        lineNumber: 51,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CardDescription.displayName = "CardDescription";
const CardContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("p-6 pt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/incubation-frontend/components/ui/card.tsx",
        lineNumber: 63,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CardContent.displayName = "CardContent";
const CardFooter = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex items-center p-6 pt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/incubation-frontend/components/ui/card.tsx",
        lineNumber: 71,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CardFooter.displayName = "CardFooter";
;
}),
"[project]/incubation-frontend/components/ui/alert.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Alert",
    ()=>Alert,
    "AlertDescription",
    ()=>AlertDescription,
    "AlertTitle",
    ()=>AlertTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/node_modules/class-variance-authority/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/lib/utils.ts [app-ssr] (ecmascript)");
;
;
;
;
const alertVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cva"])("relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground", {
    variants: {
        variant: {
            default: "bg-background text-foreground",
            destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
const Alert = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, variant, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        role: "alert",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(alertVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/incubation-frontend/components/ui/alert.tsx",
        lineNumber: 26,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
Alert.displayName = "Alert";
const AlertTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("mb-1 font-medium leading-none tracking-tight", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/incubation-frontend/components/ui/alert.tsx",
        lineNumber: 39,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
AlertTitle.displayName = "AlertTitle";
const AlertDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-sm [&_p]:leading-relaxed", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/incubation-frontend/components/ui/alert.tsx",
        lineNumber: 51,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
AlertDescription.displayName = "AlertDescription";
;
}),
"[project]/incubation-frontend/components/ui/tabs.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Tabs",
    ()=>Tabs,
    "TabsContent",
    ()=>TabsContent,
    "TabsList",
    ()=>TabsList,
    "TabsTrigger",
    ()=>TabsTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/node_modules/@radix-ui/react-tabs/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const Tabs = __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"];
const TabsList = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["List"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/incubation-frontend/components/ui/tabs.tsx",
        lineNumber: 14,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
TabsList.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["List"].displayName;
const TabsTrigger = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Trigger"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/incubation-frontend/components/ui/tabs.tsx",
        lineNumber: 29,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
TabsTrigger.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Trigger"].displayName;
const TabsContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Content"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/incubation-frontend/components/ui/tabs.tsx",
        lineNumber: 44,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
TabsContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Content"].displayName;
;
}),
"[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ApplicationDetailPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/lib/supabase.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$dashboard$2f$DashboardLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/components/dashboard/DashboardLayout.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/components/ui/dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/components/ui/textarea.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/components/ui/badge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/components/ui/card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/components/ui/alert.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/components/ui/tabs.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
function ApplicationDetailPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useParams"])();
    const [application, setApplication] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [updateMessage, setUpdateMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [availableReviewers, setAvailableReviewers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showAssignReviewer, setShowAssignReviewer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedReviewers, setSelectedReviewers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showRejectModal, setShowRejectModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [rejectionReason, setRejectionReason] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [evaluations, setEvaluations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoadingEvaluations, setIsLoadingEvaluations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [showDropdown, setShowDropdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const dropdownRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const checkUser = async ()=>{
        try {
            const { data: { user } } = await __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }
            const { data: profile } = await __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("user_profiles").select("role").eq("id", user.id).single();
            if (!profile || profile.role !== "manager" && profile.role !== "reviewer") {
                router.push("/login");
                return;
            }
            setUser({
                ...user,
                role: profile.role
            });
            fetchApplication();
            // If manager, fetch reviewers list for assignment
            if (profile.role === "manager") {
                fetchReviewers();
                fetchAllEvaluations();
            } else if (profile.role === "reviewer") {
                fetchReviewerEvaluation();
            }
        } catch (error) {
            console.error("Error checking user:", error);
            router.push("/login");
        }
    };
    const fetchReviewers = async ()=>{
        try {
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("user_profiles").select("id, full_name").eq("role", "reviewer");
            if (error) {
                console.error("Error fetching reviewers:", error);
                return;
            }
            if (data) {
                console.log("Fetched reviewers:", data);
                setAvailableReviewers(data);
            } else {
                console.log("No reviewers found in database");
            }
        } catch (error) {
            console.error("Error fetching reviewers:", error);
        }
    };
    const fetchApplication = async ()=>{
        try {
            const response = await fetch(`/api/applications/${params.id}`);
            if (response.ok) {
                const data = await response.json();
                setApplication(data.application);
                // Initialize selected reviewers with currently assigned reviewers
                if (data.application.reviewers) {
                    setSelectedReviewers(data.application.reviewers.map((r)=>r.id));
                }
            } else {
                console.error("Failed to fetch application");
            }
        } catch (error) {
            console.error("Error fetching application:", error);
        } finally{
            setIsLoading(false);
        }
    };
    const fetchAllEvaluations = async ()=>{
        if (!user || user.role !== "manager") return;
        setIsLoadingEvaluations(true);
        try {
            const { data: { session } } = await __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
            if (!session) return;
            const response = await fetch(`/api/evaluations/application/${params.id}/all`, {
                headers: {
                    Authorization: `Bearer ${session.access_token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                const evaluationsList = data.evaluations || [];
                console.log("Fetched evaluations:", evaluationsList.length);
                // Calculate total scores for evaluations that don't have them
                const evaluationsWithScores = evaluationsList.map((evaluation)=>{
                    if (evaluation.total_score === null || evaluation.total_score === undefined) {
                        const scores = [
                            evaluation.need_score,
                            evaluation.novelty_score,
                            evaluation.feasibility_scalability_score,
                            evaluation.market_potential_score,
                            evaluation.impact_score
                        ].filter((s)=>s !== null && s !== undefined);
                        evaluation.total_score = scores.reduce((sum, score)=>sum + score, 0);
                    }
                    return evaluation;
                });
                setEvaluations(evaluationsWithScores);
            } else {
                const errorData = await response.json().catch(()=>({}));
                console.error("Failed to fetch evaluations:", response.status, errorData);
                setUpdateMessage(errorData.error || "Failed to fetch evaluations");
                setTimeout(()=>setUpdateMessage(""), 5000);
                setEvaluations([]);
            }
        } catch (error) {
            console.error("Error fetching evaluations:", error);
            setEvaluations([]);
        } finally{
            setIsLoadingEvaluations(false);
        }
    };
    const fetchReviewerEvaluation = async ()=>{
        if (!user || user.role !== "reviewer") return;
        setIsLoadingEvaluations(true);
        try {
            const { data: { session } } = await __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
            if (!session) return;
            const response = await fetch(`/api/evaluations/application/${params.id}`, {
                headers: {
                    Authorization: `Bearer ${session.access_token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                if (data.evaluation) {
                    // Calculate total score if not present
                    const evaluation = data.evaluation;
                    if (evaluation.total_score === null || evaluation.total_score === undefined) {
                        const scores = [
                            evaluation.need_score,
                            evaluation.novelty_score,
                            evaluation.feasibility_scalability_score,
                            evaluation.market_potential_score,
                            evaluation.impact_score
                        ].filter((s)=>s !== null && s !== undefined);
                        evaluation.total_score = scores.reduce((sum, score)=>sum + score, 0);
                    }
                    console.log("Fetched reviewer evaluation:", evaluation);
                    setEvaluations([
                        evaluation
                    ]);
                } else {
                    console.log("No evaluation found for reviewer");
                    setEvaluations([]);
                }
            } else {
                const errorData = await response.json().catch(()=>({}));
                console.error("Failed to fetch evaluation:", response.status, errorData);
                setUpdateMessage(errorData.error || "Failed to fetch evaluation");
                setTimeout(()=>setUpdateMessage(""), 5000);
                setEvaluations([]);
            }
        } catch (error) {
            console.error("Error fetching evaluation:", error);
            setEvaluations([]);
        } finally{
            setIsLoadingEvaluations(false);
        }
    };
    const updateStatus = async (newStatus, reason)=>{
        try {
            const body = {
                status: newStatus
            };
            if (newStatus === "rejected" && reason) {
                body.rejectionReason = reason;
            }
            const response = await fetch(`/api/applications/${params.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });
            if (response.ok) {
                setUpdateMessage(`Status updated to ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatStatus"])(newStatus)}`);
                setTimeout(()=>setUpdateMessage(""), 3000);
                setShowRejectModal(false);
                setRejectionReason("");
                fetchApplication();
                // Refresh evaluations
                if (user?.role === "manager") {
                    fetchAllEvaluations();
                } else if (user?.role === "reviewer") {
                    fetchReviewerEvaluation();
                }
            } else {
                const data = await response.json();
                setUpdateMessage(data.error || "Failed to update status");
                setTimeout(()=>setUpdateMessage(""), 3000);
            }
        } catch (error) {
            console.error("Error updating status:", error);
            setUpdateMessage("Error updating status");
            setTimeout(()=>setUpdateMessage(""), 3000);
        }
    };
    // const handleReject = () => {
    //   if (!rejectionReason.trim()) {
    //     setUpdateMessage("Please provide a reason for rejection");
    //     setTimeout(() => setUpdateMessage(""), 3000);
    //     return;
    //   }
    //   updateStatus("rejected", rejectionReason);
    // };
    // const handleReviewerToggle = (reviewerId: string) => {
    //   setSelectedReviewers((prev) => {
    //     if (prev.includes(reviewerId)) {
    //       // Remove reviewer
    //       return prev.filter((id) => id !== reviewerId);
    //     } else {
    //       // Add reviewer (max 5)
    //       if (prev.length >= 5) {
    //         setUpdateMessage("Maximum of 5 reviewers allowed");
    //         setTimeout(() => setUpdateMessage(""), 3000);
    //         return prev;
    //       }
    //       return [...prev, reviewerId];
    //     }
    //   });
    // };
    // const assignReviewers = async () => {
    //   try {
    //     if (selectedReviewers.length === 0) {
    //       setUpdateMessage("Please select at least one reviewer");
    //       setTimeout(() => setUpdateMessage(""), 3000);
    //       return;
    //     }
    //     const response = await fetch(
    //       `/api/applications/${params.id}`,
    //       {
    //         method: "PUT",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({
    //           reviewerIds: selectedReviewers,
    //           // Backend will auto-transition from pending to under_review
    //         }),
    //       },
    //     );
    //     if (response.ok) {
    //       setUpdateMessage(
    //         selectedReviewers.length === 1
    //           ? "Reviewer assigned successfully"
    //           : `${selectedReviewers.length} reviewers assigned successfully`,
    //       );
    //       setTimeout(() => setUpdateMessage(""), 3000);
    //       setShowAssignReviewer(false);
    //       fetchApplication();
    //       // Refresh evaluations
    //       if (user?.role === "manager") {
    //         fetchAllEvaluations();
    //       }
    //     } else {
    //       const data = await response.json();
    //       setUpdateMessage(data.error || "Failed to assign reviewers");
    //       setTimeout(() => setUpdateMessage(""), 3000);
    //     }
    //   } catch (error) {
    //     console.error("Error assigning reviewer:", error);
    //     setUpdateMessage("Error assigning reviewer");
    //     setTimeout(() => setUpdateMessage(""), 3000);
    //   }
    // };
    // const getStatusColor = (status: string) => {
    //   const colors: Record<string, string> = {
    //     pending:
    //       "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800",
    //     under_review:
    //       "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200 border-blue-200 dark:border-blue-800",
    //     approved:
    //       "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200 border-green-200 dark:border-green-800",
    //     rejected:
    //       "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200 border-red-200 dark:border-red-800",
    //     withdrawn:
    //       "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200 border-gray-200 dark:border-gray-800",
    //   };
    //   return (
    //     colors[status] ||
    //     "bg-gray-100 text-gray-800 border-gray-200 dark:border-gray-800"
    //   );
    // };
    const handleReject = ()=>{
        if (!rejectionReason.trim()) {
            setUpdateMessage("Please provide a reason for rejection");
            setTimeout(()=>setUpdateMessage(""), 3000);
            return;
        }
        updateStatus("rejected", rejectionReason);
    };
    const handleReviewerToggle = (reviewerId)=>{
        setSelectedReviewers((prev)=>{
            if (prev.includes(reviewerId)) {
                // Remove reviewer
                return prev.filter((id)=>id !== reviewerId);
            } else {
                // Add reviewer (max 5)
                if (prev.length >= 5) {
                    setUpdateMessage("Maximum of 5 reviewers allowed");
                    setTimeout(()=>setUpdateMessage(""), 3000);
                    return prev;
                }
                return [
                    ...prev,
                    reviewerId
                ];
            }
        });
    };
    const removeReviewer = (reviewerId)=>{
        setSelectedReviewers((prev)=>prev.filter((id)=>id !== reviewerId));
    };
    const assignReviewers = async ()=>{
        try {
            if (selectedReviewers.length < 2) {
                setUpdateMessage("Please select at least 2 reviewers");
                setTimeout(()=>setUpdateMessage(""), 3000);
                return;
            }
            // Get reviewer names for logging
            const reviewerNames = selectedReviewers.map((id)=>{
                const reviewer = availableReviewers.find((r)=>r.id === id);
                return reviewer?.full_name || "Unknown";
            }).filter(Boolean);
            console.log("📧 Starting reviewer assignment process...");
            console.log(`📋 Application ID: ${params.id}`);
            console.log(`👥 Assigning ${selectedReviewers.length} reviewer(s):`, reviewerNames);
            console.log(`📧 Email notifications will be sent to assigned reviewers`);
            const response = await fetch(`/api/applications/${params.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    reviewerIds: selectedReviewers
                })
            });
            if (response.ok) {
                setUpdateMessage(`${selectedReviewers.length} reviewers assigned successfully`);
                setTimeout(()=>setUpdateMessage(""), 3000);
                setShowAssignReviewer(false);
                setSearchQuery("");
                setShowDropdown(false);
                fetchApplication();
                // Refresh evaluations
                if (user?.role === "manager") {
                    fetchAllEvaluations();
                }
            } else {
                const data = await response.json();
                setUpdateMessage(data.error || "Failed to assign reviewers");
                setTimeout(()=>setUpdateMessage(""), 3000);
            }
        } catch (error) {
            console.error("Error assigning reviewer:", error);
            setUpdateMessage("Error assigning reviewer");
            setTimeout(()=>setUpdateMessage(""), 3000);
        }
    };
    const getStatusColor = (status)=>{
        const colors = {
            pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800",
            under_review: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200 border-blue-200 dark:border-blue-800",
            approved: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200 border-green-200 dark:border-green-800",
            rejected: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200 border-red-200 dark:border-red-800",
            withdrawn: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200 border-gray-200 dark:border-gray-800"
        };
        return colors[status] || "bg-gray-100 text-gray-800 border-gray-200 dark:border-gray-800";
    };
    // Filter reviewers based on search query
    const filteredReviewers = availableReviewers.filter((reviewer)=>!selectedReviewers.includes(reviewer.id) && (reviewer.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || false));
    const getSelectedReviewerNames = ()=>{
        return selectedReviewers.map((id)=>{
            const reviewer = availableReviewers.find((r)=>r.id === id);
            return reviewer?.full_name || "Unknown";
        }).filter(Boolean);
    };
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-zinc-600 dark:text-zinc-400",
                children: "Loading..."
            }, void 0, false, {
                fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                lineNumber: 595,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
            lineNumber: 594,
            columnNumber: 7
        }, this);
    }
    if (!application) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-zinc-600 dark:text-zinc-400",
                children: "Application not found"
            }, void 0, false, {
                fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                lineNumber: 603,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
            lineNumber: 602,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$dashboard$2f$DashboardLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "link",
                        onClick: ()=>router.push("/dashboard"),
                        className: "mb-4",
                        children: "← Back to Applications"
                    }, void 0, false, {
                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                        lineNumber: 614,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                    lineNumber: 613,
                    columnNumber: 9
                }, this),
                updateMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Alert"], {
                    variant: updateMessage.includes("Failed") || updateMessage.includes("Error") ? "destructive" : "default",
                    className: "mb-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDescription"], {
                        children: updateMessage
                    }, void 0, false, {
                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                        lineNumber: 632,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                    lineNumber: 623,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                    className: "mb-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between items-start",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardTitle"], {
                                            className: "text-2xl mb-2",
                                            children: application.company_name
                                        }, void 0, false, {
                                            fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                            lineNumber: 640,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-zinc-600 dark:text-zinc-400",
                                                    children: "Status:"
                                                }, void 0, false, {
                                                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                    lineNumber: 644,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                                    className: getStatusColor(application.status),
                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatStatus"])(application.status)
                                                }, void 0, false, {
                                                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                    lineNumber: 647,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                            lineNumber: 643,
                                            columnNumber: 17
                                        }, this),
                                        application.status === "rejected" && application.rejection_reason && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Alert"], {
                                            variant: "destructive",
                                            className: "mt-2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDescription"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "font-medium mb-1",
                                                        children: "Rejection Reason:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                        lineNumber: 655,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: application.rejection_reason
                                                    }, void 0, false, {
                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                        lineNumber: 656,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                lineNumber: 654,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                            lineNumber: 653,
                                            columnNumber: 21
                                        }, this),
                                        application.reviewers && application.reviewers.length > 0 || application.reviewer_id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-sm text-zinc-600 dark:text-zinc-400",
                                                    children: [
                                                        "Assigned Reviewer",
                                                        application.reviewers && application.reviewers.length > 1 ? "s" : "",
                                                        ":",
                                                        " "
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                    lineNumber: 663,
                                                    columnNumber: 21
                                                }, this),
                                                application.reviewers && application.reviewers.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-1 flex flex-wrap gap-2",
                                                    children: application.reviewers.map((reviewer)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                                            variant: "secondary",
                                                            className: "text-xs",
                                                            children: reviewer.full_name || "Unknown"
                                                        }, reviewer.id, false, {
                                                            fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                            lineNumber: 674,
                                                            columnNumber: 27
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                    lineNumber: 672,
                                                    columnNumber: 23
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-medium text-black dark:text-zinc-50",
                                                    children: application.reviewer?.full_name || "Unknown"
                                                }, void 0, false, {
                                                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                    lineNumber: 684,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                            lineNumber: 662,
                                            columnNumber: 19
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm text-zinc-600 dark:text-zinc-400",
                                                children: "No reviewers assigned"
                                            }, void 0, false, {
                                                fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                lineNumber: 691,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                            lineNumber: 690,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                    lineNumber: 639,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-2 flex-wrap",
                                    children: [
                                        user?.role === "manager" && application.status === "pending" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                    onClick: ()=>{
                                                        setShowAssignReviewer(!showAssignReviewer);
                                                        // Initialize selected reviewers when opening
                                                        if (!showAssignReviewer && application.reviewers) {
                                                            setSelectedReviewers(application.reviewers.map((r)=>r.id));
                                                        }
                                                    },
                                                    className: !showAssignReviewer ? "bg-black text-white hover:bg-black/90 dark:bg-black dark:text-white dark:hover:bg-black/90" : "",
                                                    children: showAssignReviewer ? "Cancel" : application.reviewers && application.reviewers.length > 0 ? "Manage Reviewers" : "Assign Reviewers"
                                                }, void 0, false, {
                                                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                    lineNumber: 702,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                    onClick: ()=>setShowRejectModal(true),
                                                    className: "bg-black text-white hover:bg-black/90 dark:bg-black dark:text-white dark:hover:bg-black/90",
                                                    children: "Reject"
                                                }, void 0, false, {
                                                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                    lineNumber: 725,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true),
                                        application.status === "under_review" && application.totalReviewers && application.totalReviewers > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-sm text-zinc-600 dark:text-zinc-400 px-4 py-2",
                                            children: [
                                                "Evaluations: ",
                                                application.evaluationsCount || 0,
                                                "/",
                                                application.totalReviewers,
                                                application.allEvaluationsComplete && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "ml-2 text-green-600 dark:text-green-400 font-medium",
                                                    children: "✓ Complete"
                                                }, void 0, false, {
                                                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                    lineNumber: 742,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                            lineNumber: 738,
                                            columnNumber: 21
                                        }, this),
                                        user?.role === "reviewer" && (application.status === "pending" || application.status === "under_review") && (application.reviewers?.some((r)=>r.id === user.id) || application.reviewer_id === user.id) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                            onClick: ()=>router.push(`/dashboard/applications/${params.id}/evaluate`),
                                            className: "bg-black text-white hover:bg-black/90 dark:bg-black dark:text-white dark:hover:bg-black/90",
                                            children: "Evaluate"
                                        }, void 0, false, {
                                            fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                            lineNumber: 754,
                                            columnNumber: 21
                                        }, this),
                                        user?.role === "manager" && application.status === "under_review" && application.allEvaluationsComplete && application.totalReviewers && application.totalReviewers > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                    onClick: ()=>updateStatus("approved"),
                                                    variant: "default",
                                                    children: "Accept"
                                                }, void 0, false, {
                                                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                    lineNumber: 772,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                    onClick: ()=>setShowRejectModal(true),
                                                    className: "bg-black text-white hover:bg-black/90 dark:bg-black dark:text-white dark:hover:bg-black/90",
                                                    children: "Reject"
                                                }, void 0, false, {
                                                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                    lineNumber: 778,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                    lineNumber: 697,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                            lineNumber: 638,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                        lineNumber: 637,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                    lineNumber: 636,
                    columnNumber: 9
                }, this),
                showAssignReviewer && user?.role === "manager" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4 w-full max-w-md",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "font-semibold",
                            children: "Assign Reviewers (minimum 2, maximum 5)"
                        }, void 0, false, {
                            fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                            lineNumber: 794,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: [
                                "Select at least 2 reviewers. Currently selected:",
                                " ",
                                selectedReviewers.length
                            ]
                        }, void 0, true, {
                            fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                            lineNumber: 797,
                            columnNumber: 13
                        }, this),
                        availableReviewers.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-red-500",
                            children: "No reviewers available. Please create reviewer accounts first."
                        }, void 0, false, {
                            fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                            lineNumber: 803,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                selectedReviewers.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap gap-2",
                                    children: getSelectedReviewerNames().map((name, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-1 bg-zinc-200 dark:bg-zinc-700 px-2 py-1 rounded-full text-sm",
                                            children: [
                                                name,
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>removeReviewer(selectedReviewers[index]),
                                                    className: "hover:text-red-500",
                                                    children: "✕"
                                                }, void 0, false, {
                                                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                    lineNumber: 817,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, index, true, {
                                            fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                            lineNumber: 812,
                                            columnNumber: 23
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                    lineNumber: 810,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    ref: dropdownRef,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            placeholder: "Search and add reviewers",
                                            value: searchQuery,
                                            onChange: (e)=>setSearchQuery(e.target.value),
                                            onFocus: ()=>setShowDropdown(true),
                                            className: "w-full pl-3 pr-10 py-2 border rounded-md focus:outline-none focus:ring"
                                        }, void 0, false, {
                                            fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                            lineNumber: 832,
                                            columnNumber: 19
                                        }, this),
                                        showDropdown && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "absolute z-50 w-full max-h-30 overflow-y-auto border rounded-md bg-white dark:bg-zinc-800 mt-2 shadow-lg",
                                            children: filteredReviewers.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "px-4 py-2 text-gray-500 dark:text-gray-400",
                                                children: "No reviewers found"
                                            }, void 0, false, {
                                                fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                lineNumber: 845,
                                                columnNumber: 25
                                            }, this) : filteredReviewers.map((reviewer)=>{
                                                const isSelected = selectedReviewers.includes(reviewer.id);
                                                const isDisabled = selectedReviewers.length >= 5 && !isSelected;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    onClick: ()=>{
                                                        if (!isDisabled) {
                                                            handleReviewerToggle(reviewer.id);
                                                            setShowDropdown(false);
                                                            setSearchQuery("");
                                                        }
                                                    },
                                                    className: `flex justify-between px-4 py-2 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: reviewer.full_name || "Unnamed Reviewer"
                                                        }, void 0, false, {
                                                            fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                            lineNumber: 872,
                                                            columnNumber: 31
                                                        }, this),
                                                        isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-green-500",
                                                            children: "✓"
                                                        }, void 0, false, {
                                                            fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                            lineNumber: 876,
                                                            columnNumber: 33
                                                        }, this)
                                                    ]
                                                }, reviewer.id, true, {
                                                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                    lineNumber: 857,
                                                    columnNumber: 29
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                            lineNumber: 843,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                    lineNumber: 831,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-end gap-2 mt-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "px-4 py-2 border rounded hover:bg-zinc-200 dark:hover:bg-zinc-700",
                                            onClick: ()=>{
                                                setShowAssignReviewer(false);
                                                setSearchQuery("");
                                                setShowDropdown(false);
                                                // Reset selection
                                                if (application?.reviewers) {
                                                    setSelectedReviewers(application.reviewers.map((r)=>r.id));
                                                } else {
                                                    setSelectedReviewers([]);
                                                }
                                            },
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                            lineNumber: 888,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: `px-4 py-2 rounded text-white ${selectedReviewers.length < 2 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`,
                                            disabled: selectedReviewers.length < 2,
                                            onClick: ()=>assignReviewers(),
                                            children: [
                                                "Assign ",
                                                selectedReviewers.length,
                                                " Reviewer",
                                                selectedReviewers.length !== 1 && "s"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                            lineNumber: 906,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                    lineNumber: 887,
                                    columnNumber: 17
                                }, this),
                                selectedReviewers.length < 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-red-500 mt-1",
                                    children: "⚠️ Please select at least 2 reviewers to proceed"
                                }, void 0, false, {
                                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                    lineNumber: 921,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true)
                    ]
                }, void 0, true, {
                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                    lineNumber: 793,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Dialog"], {
                    open: showRejectModal,
                    onOpenChange: setShowRejectModal,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogContent"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogHeader"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                        children: "Reject Application"
                                    }, void 0, false, {
                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                        lineNumber: 934,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogDescription"], {
                                        children: "Please provide a reason for rejecting this application. This reason will be visible to the applicant."
                                    }, void 0, false, {
                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                        lineNumber: 935,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                lineNumber: 933,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "py-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Textarea"], {
                                    value: rejectionReason,
                                    onChange: (e)=>setRejectionReason(e.target.value),
                                    placeholder: "Enter rejection reason...",
                                    className: "min-h-[100px]",
                                    required: true
                                }, void 0, false, {
                                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                    lineNumber: 941,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                lineNumber: 940,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogFooter"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "default",
                                        onClick: ()=>{
                                            setShowRejectModal(false);
                                            setRejectionReason("");
                                        },
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                        lineNumber: 950,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        onClick: handleReject,
                                        disabled: !rejectionReason.trim(),
                                        className: "bg-black text-white hover:bg-black/90 dark:bg-black dark:text-white dark:hover:bg-black/90 disabled:opacity-50",
                                        children: "Reject Application"
                                    }, void 0, false, {
                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                        lineNumber: 959,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                lineNumber: 949,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                        lineNumber: 932,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                    lineNumber: 931,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                        className: "pt-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tabs"], {
                            defaultValue: "startup-info",
                            className: "w-full",
                            onValueChange: (value)=>{
                                // Refresh evaluations when switching to evaluations tab
                                if (value === "evaluations") {
                                    if (user?.role === "manager") {
                                        fetchAllEvaluations();
                                    } else if (user?.role === "reviewer") {
                                        fetchReviewerEvaluation();
                                    }
                                }
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TabsList"], {
                                    className: "grid w-full grid-cols-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                            value: "startup-info",
                                            children: "Startup Information"
                                        }, void 0, false, {
                                            fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                            lineNumber: 987,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                            value: "application-form",
                                            children: "Application Form"
                                        }, void 0, false, {
                                            fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                            lineNumber: 990,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                            value: "evaluations",
                                            children: "Evaluations"
                                        }, void 0, false, {
                                            fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                            lineNumber: 993,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                    lineNumber: 986,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TabsContent"], {
                                    value: "startup-info",
                                    className: "space-y-6 mt-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                        children: "Company Information"
                                                    }, void 0, false, {
                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                        lineNumber: 1001,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                    lineNumber: 1000,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "text-sm font-medium text-zinc-600 dark:text-zinc-400",
                                                                        children: "Website"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                        lineNumber: 1006,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    application.website ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                        href: application.website,
                                                                        target: "_blank",
                                                                        rel: "noopener noreferrer",
                                                                        className: "text-blue-600 dark:text-blue-400 hover:underline block",
                                                                        children: application.website
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                        lineNumber: 1010,
                                                                        columnNumber: 27
                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-black dark:text-zinc-50",
                                                                        children: "N/A"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                        lineNumber: 1019,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                lineNumber: 1005,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "text-sm font-medium text-zinc-600 dark:text-zinc-400",
                                                                        children: "Description"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                        lineNumber: 1023,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-black dark:text-zinc-50",
                                                                        children: application.description
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                        lineNumber: 1026,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                lineNumber: 1022,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                        lineNumber: 1004,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                    lineNumber: 1003,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                            lineNumber: 999,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                        children: "Founder Information"
                                                    }, void 0, false, {
                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                        lineNumber: 1037,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                    lineNumber: 1036,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "text-sm font-medium text-zinc-600 dark:text-zinc-400",
                                                                        children: "Founder Name"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                        lineNumber: 1042,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-black dark:text-zinc-50",
                                                                        children: application.founder_name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                        lineNumber: 1045,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                lineNumber: 1041,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "text-sm font-medium text-zinc-600 dark:text-zinc-400",
                                                                        children: "Co-Founders"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                        lineNumber: 1050,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-black dark:text-zinc-50",
                                                                        children: application.co_founders || "N/A"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                        lineNumber: 1053,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                lineNumber: 1049,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "text-sm font-medium text-zinc-600 dark:text-zinc-400",
                                                                        children: "Email"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                        lineNumber: 1058,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                        href: `mailto:${application.email}`,
                                                                        className: "text-blue-600 dark:text-blue-400 hover:underline block",
                                                                        children: application.email
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                        lineNumber: 1061,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                lineNumber: 1057,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "text-sm font-medium text-zinc-600 dark:text-zinc-400",
                                                                        children: "Phone"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                        lineNumber: 1069,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                        href: `tel:${application.phone}`,
                                                                        className: "text-blue-600 dark:text-blue-400 hover:underline block",
                                                                        children: application.phone
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                        lineNumber: 1072,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                lineNumber: 1068,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                        lineNumber: 1040,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                    lineNumber: 1039,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                            lineNumber: 1035,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                    lineNumber: 997,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TabsContent"], {
                                    value: "application-form",
                                    className: "space-y-6 mt-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                        children: "Business Details"
                                                    }, void 0, false, {
                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                        lineNumber: 1089,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                    lineNumber: 1088,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "text-sm font-medium text-zinc-600 dark:text-zinc-400",
                                                                        children: "Problem"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                        lineNumber: 1094,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-black dark:text-zinc-50",
                                                                        children: application.problem
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                        lineNumber: 1097,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                lineNumber: 1093,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "text-sm font-medium text-zinc-600 dark:text-zinc-400",
                                                                        children: "Solution"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                        lineNumber: 1102,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-black dark:text-zinc-50",
                                                                        children: application.solution
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                        lineNumber: 1105,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                lineNumber: 1101,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "text-sm font-medium text-zinc-600 dark:text-zinc-400",
                                                                        children: "Target Market"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                        lineNumber: 1110,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-black dark:text-zinc-50",
                                                                        children: application.target_market
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                        lineNumber: 1113,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                lineNumber: 1109,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "text-sm font-medium text-zinc-600 dark:text-zinc-400",
                                                                        children: "Business Model"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                        lineNumber: 1118,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-black dark:text-zinc-50",
                                                                        children: application.business_model
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                        lineNumber: 1121,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                lineNumber: 1117,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                        lineNumber: 1092,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                    lineNumber: 1091,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                            lineNumber: 1087,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                        children: "Funding & Traction"
                                                    }, void 0, false, {
                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                        lineNumber: 1132,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                    lineNumber: 1131,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "text-sm font-medium text-zinc-600 dark:text-zinc-400",
                                                                        children: "Funding Stage"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                        lineNumber: 1137,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-black dark:text-zinc-50",
                                                                        children: application.funding_stage?.replace("_", " ") || "N/A"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                        lineNumber: 1140,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                lineNumber: 1136,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "text-sm font-medium text-zinc-600 dark:text-zinc-400",
                                                                        children: "Funding Amount"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                        lineNumber: 1146,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-black dark:text-zinc-50",
                                                                        children: application.funding_amount || "N/A"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                        lineNumber: 1149,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                lineNumber: 1145,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "md:col-span-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "text-sm font-medium text-zinc-600 dark:text-zinc-400",
                                                                        children: "Current Traction"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                        lineNumber: 1154,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-black dark:text-zinc-50",
                                                                        children: application.current_traction || "N/A"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                        lineNumber: 1157,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                lineNumber: 1153,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                        lineNumber: 1135,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                    lineNumber: 1134,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                            lineNumber: 1130,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                        children: "Why Our Incubator?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                        lineNumber: 1168,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                    lineNumber: 1167,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-black dark:text-zinc-50",
                                                        children: application.why_incubator
                                                    }, void 0, false, {
                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                        lineNumber: 1171,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                    lineNumber: 1170,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                            lineNumber: 1166,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                    lineNumber: 1085,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TabsContent"], {
                                    value: "evaluations",
                                    className: "space-y-6 mt-6",
                                    children: isLoadingEvaluations ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                                            className: "pt-6",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-zinc-600 dark:text-zinc-400",
                                                children: "Loading evaluations..."
                                            }, void 0, false, {
                                                fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                lineNumber: 1183,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                            lineNumber: 1182,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                        lineNumber: 1181,
                                        columnNumber: 19
                                    }, this) : evaluations.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                                            className: "pt-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-zinc-600 dark:text-zinc-400",
                                                    children: user?.role === "manager" ? "No evaluations have been submitted yet." : "You haven't submitted an evaluation yet."
                                                }, void 0, false, {
                                                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                    lineNumber: 1191,
                                                    columnNumber: 23
                                                }, this),
                                                user?.role === "reviewer" && (application.status === "pending" || application.status === "under_review") && (application.reviewers?.some((r)=>r.id === user.id) || application.reviewer_id === user.id) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                    onClick: ()=>router.push(`/dashboard/applications/${params.id}/evaluate`),
                                                    variant: "default",
                                                    className: "mt-4",
                                                    children: "Start Evaluation"
                                                }, void 0, false, {
                                                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                    lineNumber: 1201,
                                                    columnNumber: 27
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                            lineNumber: 1190,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                        lineNumber: 1189,
                                        columnNumber: 19
                                    }, this) : evaluations.map((evaluation)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-between items-start",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                                    children: [
                                                                        "Evaluation",
                                                                        evaluation.reviewer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-sm font-normal text-zinc-600 dark:text-zinc-400 ml-2",
                                                                            children: [
                                                                                "by ",
                                                                                evaluation.reviewer.full_name || "Unknown"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                            lineNumber: 1223,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                    lineNumber: 1220,
                                                                    columnNumber: 27
                                                                }, this),
                                                                evaluation.total_score !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                                                    variant: "secondary",
                                                                    className: "text-lg",
                                                                    children: [
                                                                        "Total: ",
                                                                        evaluation.total_score,
                                                                        "/50"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                    lineNumber: 1229,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                            lineNumber: 1219,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-zinc-600 dark:text-zinc-400",
                                                            children: [
                                                                "Submitted:",
                                                                " ",
                                                                new Date(evaluation.created_at).toLocaleDateString()
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                            lineNumber: 1234,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                    lineNumber: 1218,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-4",
                                                        children: [
                                                            evaluation.need_score !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex justify-between items-center mb-1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                className: "text-sm font-medium text-zinc-600 dark:text-zinc-400",
                                                                                children: "1. Need"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                                lineNumber: 1245,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                                                                variant: "secondary",
                                                                                children: [
                                                                                    evaluation.need_score,
                                                                                    "/10"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                                lineNumber: 1248,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                        lineNumber: 1244,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    evaluation.need_comment && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm text-black dark:text-zinc-50 mt-1",
                                                                        children: evaluation.need_comment
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                        lineNumber: 1253,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                lineNumber: 1243,
                                                                columnNumber: 29
                                                            }, this),
                                                            evaluation.novelty_score !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex justify-between items-center mb-1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                className: "text-sm font-medium text-zinc-600 dark:text-zinc-400",
                                                                                children: "2. Novelty"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                                lineNumber: 1264,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                                                                variant: "secondary",
                                                                                children: [
                                                                                    evaluation.novelty_score,
                                                                                    "/10"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                                lineNumber: 1267,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                        lineNumber: 1263,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    evaluation.novelty_comment && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm text-black dark:text-zinc-50 mt-1",
                                                                        children: evaluation.novelty_comment
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                        lineNumber: 1272,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                lineNumber: 1262,
                                                                columnNumber: 29
                                                            }, this),
                                                            evaluation.feasibility_scalability_score !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex justify-between items-center mb-1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                className: "text-sm font-medium text-zinc-600 dark:text-zinc-400",
                                                                                children: "3. Feasibility & Scalability"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                                lineNumber: 1284,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                                                                variant: "secondary",
                                                                                children: [
                                                                                    evaluation.feasibility_scalability_score,
                                                                                    "/10"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                                lineNumber: 1287,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                        lineNumber: 1283,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    evaluation.feasibility_scalability_comment && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm text-black dark:text-zinc-50 mt-1",
                                                                        children: evaluation.feasibility_scalability_comment
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                        lineNumber: 1292,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                lineNumber: 1282,
                                                                columnNumber: 29
                                                            }, this),
                                                            evaluation.market_potential_score !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex justify-between items-center mb-1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                className: "text-sm font-medium text-zinc-600 dark:text-zinc-400",
                                                                                children: "4. Market Potential"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                                lineNumber: 1303,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                                                                variant: "secondary",
                                                                                children: [
                                                                                    evaluation.market_potential_score,
                                                                                    "/10"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                                lineNumber: 1306,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                        lineNumber: 1302,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    evaluation.market_potential_comment && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm text-black dark:text-zinc-50 mt-1",
                                                                        children: evaluation.market_potential_comment
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                        lineNumber: 1311,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                lineNumber: 1301,
                                                                columnNumber: 29
                                                            }, this),
                                                            evaluation.impact_score !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex justify-between items-center mb-1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                className: "text-sm font-medium text-zinc-600 dark:text-zinc-400",
                                                                                children: "5. Impact"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                                lineNumber: 1322,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                                                                variant: "secondary",
                                                                                children: [
                                                                                    evaluation.impact_score,
                                                                                    "/10"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                                lineNumber: 1325,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                        lineNumber: 1321,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    evaluation.impact_comment && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm text-black dark:text-zinc-50 mt-1",
                                                                        children: evaluation.impact_comment
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                        lineNumber: 1330,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                lineNumber: 1320,
                                                                columnNumber: 29
                                                            }, this),
                                                            evaluation.overall_comment && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "pt-4 border-t border-zinc-200 dark:border-zinc-800",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2 block",
                                                                        children: "Overall Comment"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                        lineNumber: 1340,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm text-black dark:text-zinc-50",
                                                                        children: evaluation.overall_comment
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                        lineNumber: 1343,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                                lineNumber: 1339,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                        lineNumber: 1240,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                                    lineNumber: 1239,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, evaluation.id, true, {
                                            fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                            lineNumber: 1217,
                                            columnNumber: 21
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                                    lineNumber: 1179,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                            lineNumber: 972,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                        lineNumber: 971,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
                    lineNumber: 970,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
            lineNumber: 612,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/incubation-frontend/app/dashboard/applications/[id]/page.tsx",
        lineNumber: 611,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6e316a6a._.js.map