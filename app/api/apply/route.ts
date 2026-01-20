import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

/* =========================
   POST: Submit application
========================= */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const requiredFields = [
      "companyName",
      "email",
      "phone",
      "founderName",
      "description",
      "problem",
      "solution",
      "targetMarket",
      "businessModel",
      "fundingStage",
      "whyIncubator",
    ];

    for (const field of requiredFields) {
      if (!body[field] || body[field].trim() === "") {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Map fundingStage values to DB enum style
    const fundingStageMap: Record<string, string> = {
      "pre-seed": "pre_seed",
      seed: "seed",
      "series-a": "series_a",
      "series-b": "series_b",
      "series-c+": "series_c_plus",
      bootstrapped: "bootstrapped",
    };

    const { data, error } = await supabaseServer
      .from("startup_applications")
      .insert({
        user_id: null,
        company_name: body.companyName,
        website: body.website || null,
        description: body.description,
        founder_name: body.founderName,
        co_founders: body.coFounders || null,
        email: body.email,
        phone: body.phone,
        problem: body.problem,
        solution: body.solution,
        target_market: body.targetMarket,
        business_model: body.businessModel,
        funding_stage: fundingStageMap[body.fundingStage] || null,
        funding_amount: body.fundingAmount || null,
        current_traction: body.currentTraction || null,
        why_incubator: body.whyIncubator,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to submit application", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Application submitted successfully",
        data: { id: data.id, status: data.status },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "Failed to process application" },
      { status: 500 }
    );
  }
}

/* =========================
   GET: Fetch applications
========================= */
export async function GET() {
  try {
    const { data, error, count } = await supabaseServer
      .from("startup_applications")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch applications", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        applications: data || [],
        pagination: { total: count || 0 },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
