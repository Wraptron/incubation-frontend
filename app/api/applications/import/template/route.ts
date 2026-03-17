import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import {
  APPLICATION_EXCEL_COLUMNS,
  TEAM_MEMBER_EXAMPLE,
} from "@/lib/applicationFormFields";

/**
 * GET /api/applications/import/template
 * Returns an Excel template file with application form columns.
 * Manager-only (checked by caller; this endpoint is unauthenticated but
 * the download button is only shown to managers).
 */
export async function GET(request: NextRequest) {
  try {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Data template with headers and one example row
    const headers = APPLICATION_EXCEL_COLUMNS.map((c) => c.label);
    const exampleRow: (string | number)[] = APPLICATION_EXCEL_COLUMNS.map(
      (col) => {
        switch (col.key) {
          case "email":
            return "founder@startup.com";
          case "teamName":
            return "My Startup Pvt Ltd";
          case "yourName":
            return "Founder Name";
          case "isIITM":
            return "Yes";
          case "rollNumber":
            return "CE20B001";
          case "phoneNumber":
            return "9876543210";
          case "channel":
            return "CFI";
          case "coFoundersCount":
            return 1;
          case "facultyInvolved":
            return "NA";
          case "priorEntrepreneurshipExperience":
          case "teamPriorEntrepreneurshipExperience":
          case "mcaRegistered":
          case "hasIntellectualProperty":
          case "hasPotentialIntellectualProperty":
          case "hasProofOfConcept":
          case "hasPatentsOrPapers":
            return "No";
          case "teamMembers":
            return JSON.stringify(TEAM_MEMBER_EXAMPLE);
          case "externalFunding":
          case "otherIndustries":
          case "technologiesUtilized":
            return "[]";
          case "nirmaanPresentationLink":
            return "https://drive.google.com/...";
          case "pitchVideoLink":
            return "https://youtube.com/...";
          default:
            return col.hint || "";
        }
      }
    );

    const dataSheet = [headers, exampleRow];
    const ws = XLSX.utils.aoa_to_sheet(dataSheet);

    // Set column widths for readability
    ws["!cols"] = APPLICATION_EXCEL_COLUMNS.map(() => ({
      wch: 18,
    }));

    XLSX.utils.book_append_sheet(wb, ws, "Applications");

    // Sheet 2: Instructions
    const instructions = [
      ["Instructions for Excel Import"],
      [""],
      ["1. Download this template and fill in one row per application."],
      ["2. Do not modify the header row (row 1)."],
      ["3. For Yes/No fields, use exactly 'Yes' or 'No'."],
      [""],
      ["Channel options (How did you hear about us?):"],
      ["  CFI | E-cell | PALS | Carbon Zero Challenge (CZC) | I2I (Sustainability Venture Studio) | IITM (Others) | Others"],
      ["  Use 'Channel (Other)' column only when channel = Others"],
      [""],
      ["Complex fields (use valid JSON):"],
      ["- teamMembers: Array of objects. Example:"],
      [JSON.stringify(TEAM_MEMBER_EXAMPLE, null, 2)],
      [""],
      ["- facultyInvolved: Use 'NA' if no faculty, or JSON array of objects with:"],
      ["  name, designation, department, university, roleInStartup"],
      [""],
      ["- otherIndustries, technologiesUtilized: JSON arrays e.g. [\"Healthcare\",\"AI\"]"],
      ["- externalFunding: JSON array or [] for none"],
      [""],
      ["4. Save as .xlsx and use the Import button to upload."],
    ];
    const wsInstructions = XLSX.utils.aoa_to_sheet(instructions);
    wsInstructions["!cols"] = [{ wch: 80 }];
    XLSX.utils.book_append_sheet(wb, wsInstructions, "Instructions");

    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition":
          'attachment; filename="application-import-template.xlsx"',
      },
    });
  } catch (error) {
    console.error("Template generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate template" },
      { status: 500 }
    );
  }
}
