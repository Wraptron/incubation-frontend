import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
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

    // Send to backend API
    const primaryBackendUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      (process.env.NODE_ENV === "development"
        ? "http://localhost:5000"
        : "http://localhost:5000");

    // Try primary backend; if blocked (e.g., macOS AirPlay on 5000), fall back to 5050
    const tryPost = async (url: string) =>
      fetch(`${url}/api/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

    let backendUrl = primaryBackendUrl;
    let response = await tryPost(backendUrl);

    if (response.status === 403 && backendUrl.includes("5000")) {
      const fallbackUrl = "http://localhost:5050";
      console.warn(
        "Primary backend returned 403 (likely port 5000 blocked by AirPlay). Retrying on",
        fallbackUrl
      );
      backendUrl = fallbackUrl;
      response = await tryPost(backendUrl);
    }

    // Safely parse backend response (it may be empty on errors)
    const rawBody = await response.text();
    let data: any = null;
    if (rawBody) {
      try {
        data = JSON.parse(rawBody);
      } catch (err) {
        console.error("Failed to parse backend response JSON:", err, rawBody);
      }
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            data?.error ||
            data?.message ||
            "Failed to submit application",
          details: rawBody ? undefined : "Backend returned an empty response",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data ?? { message: "Application submitted" }, {
      status: 200,
    });
  } catch (error) {
    console.error("Error processing application:", error);
    return NextResponse.json(
      { error: "Failed to process application" },
      { status: 500 }
    );
  }
}
