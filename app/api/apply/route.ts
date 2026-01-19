// import { NextRequest, NextResponse } from "next/server";

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();

//     // Validate required fields
//     const requiredFields = [
//       "companyName",
//       "email",
//       "phone",
//       "founderName",
//       "description",
//       "problem",
//       "solution",
//       "targetMarket",
//       "businessModel",
//       "fundingStage",
//       "whyIncubator",
//     ];

//     for (const field of requiredFields) {
//       if (!body[field] || body[field].trim() === "") {
//         return NextResponse.json(
//           { error: `Missing required field: ${field}` },
//           { status: 400 }
//         );
//       }
//     }

//     // Send to backend API
//     const backendUrl =
//       process.env.NEXT_PUBLIC_API_URL || "http://65.1.107.13:5000";
//     const response = await fetch(`${backendUrl}/api/applications`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(body),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       return NextResponse.json(
//         { error: data.error || "Failed to submit application" },
//         { status: response.status }
//       );
//     }

//     return NextResponse.json(data, { status: 200 });
//   } catch (error) {
//     console.error("Error processing application:", error);
//     return NextResponse.json(
//       { error: "Failed to process application" },
//       { status: 500 }
//     );
//   }
// }




import { NextRequest, NextResponse } from "next/server";
import { backendUrl } from "@/lib/config";

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

    console.log(`Sending request to: ${backendUrl}/api/applications`);
    
    const response = await fetch(`${backendUrl}/api/applications`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Backend error:", data);
      return NextResponse.json(
        { error: data.error || "Failed to submit application" },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error processing application:", error);
    return NextResponse.json(
      { error: "Failed to process application" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log(`Fetching from: ${backendUrl}/api/applications`);
    
    const response = await fetch(`${backendUrl}/api/applications`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
      },
      cache: 'no-store', // Prevent caching
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Backend error:", errorData);
      return NextResponse.json(
        { error: errorData.error || "Failed to fetch applications" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}