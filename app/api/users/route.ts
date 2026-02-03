import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseServer } from "@/lib/supabaseServer";
import crypto from "crypto";
import nodemailer from "nodemailer";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://dfzfmtthyvwltwwmntmd.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmemZtdHRoeXZ3bHR3d21udG1kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQwNDk0NiwiZXhwIjoyMDgzOTgwOTQ2fQ.m8DKbf04d5Awu99sYyTIpv15xvnkoXV3WTOlk4GP8HE";

function generateRandomPassword(length = 12): string {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*";
  const allChars = uppercase + lowercase + numbers + symbols;

  let password = "";
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  for (let i = password.length; i < length; i++) {
    password += allChars[crypto.randomInt(0, allChars.length)];
  }

  return password
    .split("")
    .sort(() => (crypto.randomInt(0, 2) === 0 ? 1 : -1))
    .join("");
}

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.APP_URL ||
  "http://localhost:3000";

async function sendWelcomeEmail(
  email: string,
  password: string,
  fullName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const loginUrl = appUrl.replace(/\/$/, "") + "/login";
    console.log(`
      =====================================
      NEW USER CREATED
      =====================================
      Name: ${fullName}
      Email: ${email}
      Password: ${password}
      Login URL: ${loginUrl}
      =====================================
    `);

    const gmailUser = process.env.GMAIL_USER || "support@sieiitm.org";
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
    if (!gmailAppPassword) {
      console.warn("GMAIL_APP_PASSWORD not set; skipping welcome email");
      return { success: false, error: "Email not configured" };
    }

    const transporter = nodemailer.createTransport({
      host: "smtpout.secureserver.net",
      port: 465,
      secure: true, // SSL
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f4f4f4; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #fff; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
          .credentials { background-color: #f9f9f9; padding: 15px; border-left: 4px solid #4CAF50; margin: 20px 0; }
          .button { display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Registration for New Users</h2>
          </div>
          <div class="content">
            <h3>Welcome to Nirmaan Pre-Incubation Program</h3>
            <p>Dear ${fullName},</p>
            <p>You have been onboarded as a user on the platform for <strong>Nirmaan Pre-Incubation Program</strong>!</p>
            <p>Please click the button below to manage your account:</p>
            <p style="text-align: center;">
              <a href="${loginUrl}" class="button">Login to Your Account</a>
            </p>
            <div class="credentials">
              <p><strong>Your Login Credentials:</strong></p>
              <p><strong>Email ID (Login ID):</strong> ${email}</p>
              <p><strong>Default Password:</strong> ${password}</p>
            </div>
            <p><strong>Important:</strong> Please change your password after your first login for security purposes.</p>
            <p>Thanks,<br>Team Nirmaan</p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailText = `
Registration for New Users

Welcome to Nirmaan Pre-Incubation Program

Dear ${fullName},

You have been onboarded as a user on the platform for Nirmaan Pre-Incubation Program!

Please visit ${loginUrl} to manage your account.

Your email ID is your login ID and your default password is ${password}.

Please change your password after your first login for security purposes.

Thanks,
Team Nirmaan
    `;

    const info = await transporter.sendMail({
      from: `"Nirmaan Pre-Incubation" <${gmailUser}>`,
      to: email,
      subject: "Welcome to Nirmaan Pre-Incubation Program",
      text: emailText,
      html: emailHTML,
    });

    console.log(`✅ Email sent successfully to ${email} - Message ID: ${info.messageId}`);
    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("❌ Error sending email:", err);
    return { success: false, error: err.message };
  }
}

/* =========================
   POST: Create a new user (uses Supabase directly; does not call backend)
========================= */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user: caller },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !caller) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", caller.id)
      .single();

    if (!profile || profile.role !== "manager") {
      return NextResponse.json(
        { error: "Forbidden - Only managers can create users" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email, fullName, role } = body;

    if (!email || !fullName || !role) {
      return NextResponse.json(
        { error: "Missing required fields: email, fullName, and role are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const validRoles = ["manager", "reviewer"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be 'manager' or 'reviewer'" },
        { status: 400 }
      );
    }

    const password = generateRandomPassword(12);

    const { data: authData, error: authError } =
      await supabaseServer.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName, role },
      });

    if (authError) {
      console.error("Auth error:", authError);
      return NextResponse.json(
        { error: "Failed to create user account", details: authError.message },
        { status: 500 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Failed to create user account - no user data returned" },
        { status: 500 }
      );
    }

    const { data: profileData, error: profileError } = await supabaseServer
      .from("user_profiles")
      .upsert(
        {
          id: authData.user.id,
          email_address: email,
          full_name: fullName,
          role,
        },
        { onConflict: "id" }
      )
      .select()
      .single();

    if (profileError) {
      console.error("Profile creation error:", profileError);
      await supabaseServer.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: "Failed to create user profile", details: profileError.message },
        { status: 500 }
      );
    }

    const emailResult = await sendWelcomeEmail(email, password, fullName);
    if (!emailResult.success) {
      console.warn("Email sending failed, but user was created:", emailResult.error);
    }

    return NextResponse.json(
      {
        message: "User created successfully",
        data: {
          id: profileData.id,
          email: profileData.email_address || email,
          fullName: profileData.full_name,
          role: profileData.role,
          password,
          emailSent: emailResult.success,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const err = error as Error;
    console.error("POST /api/users error:", err);
    return NextResponse.json(
      { error: "Failed to create user", details: err.message },
      { status: 500 }
    );
  }
}

/* =========================
   GET: List all users (uses Supabase directly; does not call backend)
========================= */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
  try {
    const { data, error } = await supabaseServer
      .from("user_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch users error:", error);
      return NextResponse.json(
        { error: "Failed to fetch users", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ users: data || [] });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("GET /api/users error:", err);
    return NextResponse.json(
      { error: "Failed to fetch users", details: err.message },
      { status: 500 }
    );
  }
}
