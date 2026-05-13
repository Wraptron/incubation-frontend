"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [isForgotLoading, setIsForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Please enter both email and password.");
      setIsLoading(false);
      return;
    }

    try {
      // Sign in with Supabase
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: trimmedPassword,
        });

      if (signInError) {
        // Supabase returns 400 for invalid credentials or unconfirmed email
        const msg = signInError.message || "";
        if (msg.toLowerCase().includes("email not confirmed") || msg.toLowerCase().includes("confirm your")) {
          setError("Please check your email and confirm your account before signing in.");
        } else if (msg.toLowerCase().includes("invalid login")) {
          setError("Invalid email or password. Please try again.");
        } else {
          setError(msg || "Invalid email or password.");
        }
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // Check user role
        const { data: profile, error: profileError } = await supabase
          .from("user_profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        if (profileError || !profile) {
          setError("User profile not found. Please contact administrator.");
          await supabase.auth.signOut();
          setIsLoading(false);
          return;
        }

        // Check if user is manager or admin
        if (profile.role !== "manager" && profile.role !== "reviewer") {
          setError(
            "Access denied. This login is for managers and reviewers only."
          );
          await supabase.auth.signOut();
          setIsLoading(false);
          return;
        }

        // Redirect to dashboard
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMessage("");
    setForgotError("");

    const trimmedEmail = forgotEmail.trim().toLowerCase();
    if (!trimmedEmail) {
      setForgotError("Please enter your email.");
      return;
    }

    setIsForgotLoading(true);
    try {
      const response = await fetch("/api/users/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to process forgot password request");
      }

      setForgotMessage(data.message || "Mail sent successfully");
    } catch (err: any) {
      setForgotError(err.message || "Failed to process forgot password request");
    } finally {
      setIsForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-zinc-50 dark:from-black dark:to-zinc-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center gap-6 mb-4">
            <img
              src="/iitm-sie-logo.png"
              alt="School of Innovation & Entrepreneurship IIT Madras"
              className="h-20 w-auto object-contain"
            />
            <img
              src={encodeURI("/nirmaan logo.png")}
              alt="Nirmaan logo"
              className="w-24 h-24 rounded-2xl shadow-lg object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-black dark:text-zinc-50">
            NIRMAAN
          </h1>
          <p className="text-primary font-semibold">TRACKTOR Ascent</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Sign in to access the management dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="manager@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <PasswordInput
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="link"
                  className="h-auto p-0 text-sm"
                  onClick={() => {
                    setShowForgotPasswordForm(true);
                    setForgotMessage("");
                    setForgotError("");
                  }}
                >
                  Forgot Password?
                </Button>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <Dialog
              open={showForgotPasswordForm}
              onOpenChange={(open) => {
                setShowForgotPasswordForm(open);
                if (!open) {
                  setForgotEmail("");
                  setForgotMessage("");
                  setForgotError("");
                }
              }}
            >
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Forgot Password</DialogTitle>
                  <DialogDescription>
                    Enter your registered email to receive a reset link.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleForgotPassword} className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="forgotEmail">Registered Email</Label>
                    <Input
                      id="forgotEmail"
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="Enter your registered email"
                      disabled={isForgotLoading}
                    />
                  </div>
                  {forgotMessage && (
                    <Alert className="border-green-200 bg-green-50 text-green-900">
                      <AlertDescription>{forgotMessage}</AlertDescription>
                    </Alert>
                  )}
                  {forgotError && (
                    <Alert variant="destructive">
                      <AlertDescription>{forgotError}</AlertDescription>
                    </Alert>
                  )}
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      variant="outline"
                      className="w-full"
                      disabled={isForgotLoading}
                    >
                      {isForgotLoading ? "Sending..." : "Send Reset Link"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      disabled={isForgotLoading}
                      onClick={() => {
                        setShowForgotPasswordForm(false);
                        setForgotEmail("");
                        setForgotMessage("");
                        setForgotError("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <div className="mt-6 text-center">
              <Button variant="link" asChild>
                <Link href="/">← Back to home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
