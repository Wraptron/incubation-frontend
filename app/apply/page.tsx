"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ApplyPage() {
  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    email: "",
    phone: "",
    founderName: "",
    coFounders: "",
    description: "",
    problem: "",
    solution: "",
    targetMarket: "",
    businessModel: "",
    fundingStage: "",
    fundingAmount: "",
    currentTraction: "",
    whyIncubator: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        // Reset form
        setFormData({
          companyName: "",
          website: "",
          email: "",
          phone: "",
          founderName: "",
          coFounders: "",
          description: "",
          problem: "",
          solution: "",
          targetMarket: "",
          businessModel: "",
          fundingStage: "",
          fundingAmount: "",
          currentTraction: "",
          whyIncubator: "",
        });
      } else {
        setSubmitStatus("error");
        setErrorMessage(data.error || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      setSubmitStatus("error");
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2 text-black dark:text-zinc-50">
            Startup Application
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Apply to join our incubation program. Fill out the form below and
            we'll get back to you soon.
          </p>
        </div>

        {submitStatus === "success" && (
          <Alert className="mb-6">
            <AlertDescription>
              Thank you! Your application has been submitted successfully. We'll
              review it and get back to you soon.
            </AlertDescription>
          </Alert>
        )}

        {submitStatus === "error" && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              {errorMessage ||
                "There was an error submitting your application. Please try again."}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Tell us about your startup company</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">
                  Company Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="companyName"
                  name="companyName"
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enter your company name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Company Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description of your company..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Founder Information */}
          <Card>
            <CardHeader>
              <CardTitle>Founder Information</CardTitle>
              <CardDescription>Tell us about the founding team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="founderName">
                  Founder Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="founderName"
                  name="founderName"
                  type="text"
                  required
                  value={formData.founderName}
                  onChange={handleChange}
                  placeholder="Your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coFounders">Co-Founders</Label>
                <Input
                  id="coFounders"
                  name="coFounders"
                  type="text"
                  value={formData.coFounders}
                  onChange={handleChange}
                  placeholder="Names of co-founders (if any)"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Details */}
          <Card>
            <CardHeader>
              <CardTitle>Business Details</CardTitle>
              <CardDescription>Describe your business model and market</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="problem">
                  Problem You're Solving <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="problem"
                  name="problem"
                  required
                  rows={3}
                  value={formData.problem}
                  onChange={handleChange}
                  placeholder="Describe the problem your startup addresses..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="solution">
                  Your Solution <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="solution"
                  name="solution"
                  required
                  rows={3}
                  value={formData.solution}
                  onChange={handleChange}
                  placeholder="Describe your solution..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetMarket">
                  Target Market <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="targetMarket"
                  name="targetMarket"
                  required
                  rows={2}
                  value={formData.targetMarket}
                  onChange={handleChange}
                  placeholder="Who is your target market?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessModel">
                  Business Model <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="businessModel"
                  name="businessModel"
                  required
                  rows={3}
                  value={formData.businessModel}
                  onChange={handleChange}
                  placeholder="How does your business make money?"
                />
              </div>
            </CardContent>
          </Card>

          {/* Funding & Traction */}
          <Card>
            <CardHeader>
              <CardTitle>Funding & Traction</CardTitle>
              <CardDescription>Tell us about your funding status and current progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fundingStage">
                  Current Funding Stage <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.fundingStage}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, fundingStage: value }))
                  }
                  required
                >
                  <SelectTrigger id="fundingStage">
                    <SelectValue placeholder="Select funding stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                    <SelectItem value="seed">Seed</SelectItem>
                    <SelectItem value="series-a">Series A</SelectItem>
                    <SelectItem value="series-b">Series B</SelectItem>
                    <SelectItem value="series-c+">Series C+</SelectItem>
                    <SelectItem value="bootstrapped">Bootstrapped</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fundingAmount">Funding Raised (USD)</Label>
                <Input
                  id="fundingAmount"
                  name="fundingAmount"
                  type="text"
                  value={formData.fundingAmount}
                  onChange={handleChange}
                  placeholder="e.g., $100,000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentTraction">Current Traction</Label>
                <Textarea
                  id="currentTraction"
                  name="currentTraction"
                  rows={3}
                  value={formData.currentTraction}
                  onChange={handleChange}
                  placeholder="Users, revenue, partnerships, milestones, etc."
                />
              </div>
            </CardContent>
          </Card>

          {/* Why Incubator */}
          <Card>
            <CardHeader>
              <CardTitle>Why Our Incubator?</CardTitle>
              <CardDescription>Help us understand why you want to join our program</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="whyIncubator">
                  Why do you want to join our incubation program?{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="whyIncubator"
                  name="whyIncubator"
                  required
                  rows={4}
                  value={formData.whyIncubator}
                  onChange={handleChange}
                  placeholder="What are you hoping to gain from our program?"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
