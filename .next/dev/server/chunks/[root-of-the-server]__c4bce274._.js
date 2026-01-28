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
"[project]/incubation-frontend/lib/supabaseServer.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabaseServer",
    ()=>supabaseServer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/incubation-frontend/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
;
// Server-side Supabase client using the service role key so that
// API routes can read/write tables directly without depending on the
// separate backend service. Falls back to the public keys in case
// environment variables are missing to keep local development working.
const supabaseUrl = process.env.SUPABASE_URL || ("TURBOPACK compile-time value", "https://dfzfmtthyvwltwwmntmd.supabase.co") || "https://dfzfmtthyvwltwwmntmd.supabase.co";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmemZtdHRoeXZ3bHR3d21udG1kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQwNDk0NiwiZXhwIjoyMDgzOTgwOTQ2fQ.m8DKbf04d5Awu99sYyTIpv15xvnkoXV3WTOlk4GP8HE") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmemZtdHRoeXZ3bHR3d21udG1kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQwNDk0NiwiZXhwIjoyMDgzOTgwOTQ2fQ.m8DKbf04d5Awu99sYyTIpv15xvnkoXV3WTOlk4GP8HE";
const supabaseServer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
}),
"[project]/incubation-frontend/app/api/apply/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/incubation-frontend/lib/supabaseServer.ts [app-route] (ecmascript)");
;
;
async function POST(request) {
    try {
        // Parse FormData instead of JSON (for file uploads)
        const formData = await request.formData();
        // Convert FormData to a regular object
        const body = {};
        formData.forEach((value, key)=>{
            // Skip file fields
            if (key.endsWith('File')) {
                body[key] = value;
            } else {
                body[key] = value.toString();
            }
        });
        // Validate required fields based on database schema (NOT NULL constraints)
        const requiredFields = [
            "email",
            "teamName",
            "yourName",
            "isIITM",
            "rollNumber",
            "phoneNumber",
            "channel",
            "coFoundersCount",
            "priorEntrepreneurshipExperience",
            "teamPriorEntrepreneurshipExperience",
            "mcaRegistered",
            "teamMembers",
            "nirmaanCanHelp",
            "preIncubationReason",
            "heardAboutStartups",
            "heardAboutNirmaan",
            "problemSolving",
            "yourSolution",
            "solutionType",
            "targetIndustry",
            "startupStage",
            "hasIntellectualProperty",
            "hasPotentialIntellectualProperty",
            "nirmaanPresentationLink",
            "hasProofOfConcept",
            "hasPatentsOrPapers",
            "seedFundUtilizationPlan",
            "pitchVideoLink"
        ];
        for (const field of requiredFields){
            if (!body[field] || String(body[field]).trim() === "") {
                return __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: `Missing required field: ${field}`
                }, {
                    status: 400
                });
            }
        }
        // Handle file uploads to Supabase Storage
        const fileUrls = {};
        // Upload presentation file
        if (body.presentationFile && body.presentationFile instanceof File) {
            const file = body.presentationFile;
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-presentation.${fileExt}`;
            const filePath = `applications/${fileName}`;
            const { data: uploadData, error: uploadError } = await __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].storage.from('application-files').upload(filePath, file);
            if (!uploadError && uploadData) {
                const { data: { publicUrl } } = __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].storage.from('application-files').getPublicUrl(filePath);
                fileUrls.presentation = publicUrl;
            }
        }
        // Upload document files
        if (body.document1File && body.document1File instanceof File) {
            const file = body.document1File;
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-doc1.${fileExt}`;
            const filePath = `applications/${fileName}`;
            const { data: uploadData, error: uploadError } = await __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].storage.from('application-files').upload(filePath, file);
            if (!uploadError && uploadData) {
                const { data: { publicUrl } } = __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].storage.from('application-files').getPublicUrl(filePath);
                fileUrls.document1 = publicUrl;
            }
        }
        if (body.document2File && body.document2File instanceof File) {
            const file = body.document2File;
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-doc2.${fileExt}`;
            const filePath = `applications/${fileName}`;
            const { data: uploadData, error: uploadError } = await __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].storage.from('application-files').upload(filePath, file);
            if (!uploadError && uploadData) {
                const { data: { publicUrl } } = __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].storage.from('application-files').getPublicUrl(filePath);
                fileUrls.document2 = publicUrl;
            }
        }
        // Parse JSONB fields if they're strings
        let otherIndustries = body.otherIndustries;
        if (typeof otherIndustries === 'string') {
            try {
                otherIndustries = JSON.parse(otherIndustries);
            } catch  {
                otherIndustries = [];
            }
        }
        let technologiesUtilized = body.technologiesUtilized;
        if (typeof technologiesUtilized === 'string') {
            try {
                technologiesUtilized = JSON.parse(technologiesUtilized);
            } catch  {
                technologiesUtilized = [];
            }
        }
        // Map ALL frontend fields to database fields matching the new_application schema
        const applicationData = {
            // Basic Information
            email: body.email,
            team_name: body.teamName || "N/A",
            your_name: body.yourName || "N/A",
            is_iitm: body.isIITM || "No",
            roll_number: body.rollNumber || "N/A",
            roll_number_other: body.rollNumberOther || null,
            college_name: body.collegeName || null,
            current_occupation: body.currentOccupation || null,
            phone_number: body.phoneNumber || "N/A",
            channel: body.channel || "N/A",
            channel_other: body.channelOther || null,
            co_founders_count: parseInt(body.coFoundersCount) || 0,
            faculty_involved: body.facultyInvolved || null,
            // Entrepreneurship Experience
            prior_entrepreneurship_experience: body.priorEntrepreneurshipExperience || "No",
            team_prior_entrepreneurship_experience: body.teamPriorEntrepreneurshipExperience || "No",
            prior_experience_details: body.priorExperienceDetails || null,
            // Startup Registration & Funding
            mca_registered: body.mcaRegistered || "No",
            dpiit_registered: body.dpiitRegistered || null,
            dpiit_details: body.dpiitDetails || null,
            external_funding: body.externalFunding || null,
            currently_incubated: body.currentlyIncubated || null,
            // Team Members
            team_members: body.teamMembers || "N/A",
            // About Nirmaan Program
            nirmaan_can_help: body.nirmaanCanHelp || "N/A",
            pre_incubation_reason: body.preIncubationReason || "N/A",
            heard_about_startups: body.heardAboutStartups || "N/A",
            heard_about_nirmaan: body.heardAboutNirmaan || "N/A",
            // Problem & Solution
            problem_solving: body.problemSolving || "N/A",
            your_solution: body.yourSolution || "N/A",
            solution_type: body.solutionType || "N/A",
            // Industry & Technologies
            target_industry: body.targetIndustry || "N/A",
            other_industries: otherIndustries || [],
            industry_other: body.industryOther || null,
            other_industries_other: body.otherIndustriesOther || null,
            technologies_utilized: technologiesUtilized || [],
            other_technology_details: body.otherTechnologyDetails || null,
            // Startup Stage & IP
            startup_stage: body.startupStage || "N/A",
            has_intellectual_property: body.hasIntellectualProperty || "No",
            has_potential_intellectual_property: body.hasPotentialIntellectualProperty || "No",
            // Presentation & Proof
            nirmaan_presentation_link: body.nirmaanPresentationLink || fileUrls.presentation || "N/A",
            has_proof_of_concept: body.hasProofOfConcept || "No",
            proof_of_concept_details: body.proofOfConceptDetails || null,
            has_patents_or_papers: body.hasPatentsOrPapers || "No",
            patents_or_papers_details: body.patentsOrPapersDetails || null,
            // Seed Fund & Pitch
            seed_fund_utilization_plan: body.seedFundUtilizationPlan || "N/A",
            pitch_video_link: body.pitchVideoLink || "N/A",
            document1_link: body.document1Link || fileUrls.document1 || null,
            document2_link: body.document2Link || fileUrls.document2 || null,
            // Status & Metadata
            status: "pending"
        };
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from("new_application").insert(applicationData).select().single();
        if (error) {
            console.error("Supabase insert error:", error);
            return __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Failed to submit application",
                details: error.message
            }, {
                status: 500
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Application submitted successfully",
            data: {
                id: data.id,
                status: data.status
            }
        }, {
            status: 200
        });
    } catch (error) {
        console.error("POST error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to process application"
        }, {
            status: 500
        });
    }
}
async function GET() {
    try {
        const { data, error, count } = await __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from("new_application").select("*", {
            count: "exact"
        }).order("submitted_at", {
            ascending: false
        });
        if (error) {
            console.error("Supabase fetch error:", error);
            return __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Failed to fetch applications",
                details: error.message
            }, {
                status: 500
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            applications: data || [],
            pagination: {
                total: count || 0
            }
        }, {
            status: 200
        });
    } catch (error) {
        console.error("GET error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$incubation$2d$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to fetch applications"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c4bce274._.js.map