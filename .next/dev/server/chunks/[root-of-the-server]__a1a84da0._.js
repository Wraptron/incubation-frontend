module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

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
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/config.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "backendUrl",
    ()=>backendUrl
]);
const backendUrl = ("TURBOPACK compile-time value", "http://65.1.107.13:5001") || "http://localhost:5001";
}),
"[project]/app/api/apply/draft/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module 'nodemailer'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/config.ts [app-route] (ecmascript)");
;
;
;
async function sendResumeLinkEmail(email, applicantName, resumeToken, baseUrl) {
    try {
        const gmailUser = process.env.GMAIL_USER;
        const gmailPass = process.env.GMAIL_APP_PASSWORD;
        if (!gmailUser || !gmailPass) {
            console.warn("GMAIL_USER or GMAIL_APP_PASSWORD not set - skipping resume link email");
            return {
                success: false,
                error: "Email not configured"
            };
        }
        const resumeLink = `${baseUrl.replace(/\/$/, "")}/apply/resume?token=${encodeURIComponent(resumeToken)}`;
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: gmailUser,
                pass: gmailPass
            }
        });
        const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head><style>body{font-family:Arial,sans-serif;line-height:1.6;color:#333;}.container{max-width:600px;margin:0 auto;padding:20px;}.content{padding:20px;}.btn{display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;margin:16px 0;}</style></head>
      <body>
        <div class="container">
          <div class="content">
            <p>Dear ${applicantName || "Applicant"},</p>
            <p>You have saved a draft of your application. Use the link below to resume and continue where you left off. This link is valid for 30 days.</p>
            <p><a href="${resumeLink}" class="btn">Resume application</a></p>
            <p>Or copy this link: ${resumeLink}</p>
            <p>Regards,<br>Team Nirmaan</p>
          </div>
        </div>
      </body>
      </html>`;
        const emailText = `Dear ${applicantName || "Applicant"},\n\nYou have saved a draft of your application. Use the link below to resume:\n${resumeLink}\n\nThis link is valid for 30 days.\n\nRegards,\nTeam Nirmaan`;
        await transporter.sendMail({
            from: `"Nirmaan Pre-Incubation" <${gmailUser}>`,
            to: email,
            subject: "Resume your application – Nirmaan Pre-Incubation",
            text: emailText,
            html: emailHTML
        });
        console.log("Resume link email sent to", email);
        return {
            success: true
        };
    } catch (error) {
        const err = error;
        console.error("Error sending resume link email:", err);
        return {
            success: false,
            error: err.message
        };
    }
}
async function POST(request) {
    try {
        const body = await request.json().catch(()=>({}));
        const res = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["backendUrl"]}/api/applications/draft`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        const data = await res.json().catch(()=>({}));
        if (!res.ok) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(data, {
                status: res.status
            });
        }
        if (data.resumeToken && data.isNew === true) {
            const toEmail = body.email?.trim();
            if (toEmail) {
                const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
                await sendResumeLinkEmail(toEmail, body.yourName || body.teamName || "Applicant", data.resumeToken, baseUrl);
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(data);
    } catch (error) {
        console.error("Draft save error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to save draft"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a1a84da0._.js.map