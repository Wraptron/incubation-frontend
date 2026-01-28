"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserPlus, Copy, CheckCircle, AlertCircle } from "lucide-react";

interface User {
  id: string;
  email_address: string;
  full_name: string | null;
  role: string;
  created_at: string;
}

interface NewUserData {
  email: string;
  fullName: string;
  role: string;
}

interface CreatedUserResponse {
  id: string;
  email: string;
  fullName: string;
  role: string;
  password: string;
  emailSent: boolean;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newUser, setNewUser] = useState<NewUserData>({
    email: "",
    fullName: "",
    role: "reviewer",
  });
  const [createdUser, setCreatedUser] = useState<CreatedUserResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [passwordCopied, setPasswordCopied] = useState(false);

  useEffect(() => {
    checkUserAndFetchUsers();
  }, []);

  const checkUserAndFetchUsers = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!profile || profile.role !== "manager") {
        router.push("/dashboard");
        return;
      }

      await fetchUsers();
    } catch (error) {
      console.error("Error:", error);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching users:", error);
        return;
      }

      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleCreateUser = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create user");
      }

      setCreatedUser(data.data);
      setNewUser({ email: "", fullName: "", role: "reviewer" });
      await fetchUsers();
    } catch (err: any) {
      setError(err.message || "Failed to create user");
      console.error("Error creating user:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyPassword = () => {
    if (createdUser?.password) {
      navigator.clipboard.writeText(createdUser.password);
      setPasswordCopied(true);
      setTimeout(() => setPasswordCopied(false), 2000);
    }
  };

  const resetDialog = () => {
    setIsDialogOpen(false);
    setCreatedUser(null);
    setError(null);
    setPasswordCopied(false);
    setNewUser({ email: "", fullName: "", role: "reviewer" });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-black dark:text-zinc-50">
              Users Management
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Manage reviewers and administrators.
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            if (!open) resetDialog();
            setIsDialogOpen(open);
          }}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              {!createdUser ? (
                <>
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                      Create a new user account. A random password will be generated
                      and sent to their email.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="grid gap-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        value={newUser.fullName}
                        onChange={(e) =>
                          setNewUser({ ...newUser, fullName: e.target.value })
                        }
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={newUser.email}
                        onChange={(e) =>
                          setNewUser({ ...newUser, email: e.target.value })
                        }
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={newUser.role}
                        onValueChange={(value) =>
                          setNewUser({ ...newUser, role: value })
                        }
                        disabled={isSubmitting}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="reviewer">Reviewer</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={resetDialog}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateUser}
                      disabled={
                        isSubmitting ||
                        !newUser.email ||
                        !newUser.fullName ||
                        !newUser.role
                      }
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {isSubmitting ? "Creating..." : "Create User"}
                    </Button>
                  </DialogFooter>
                </>
              ) : (
                <>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      User Created Successfully
                    </DialogTitle>
                    <DialogDescription>
                      The user account has been created. Please share the
                      credentials below with the user.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    {!createdUser.emailSent && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Email notification could not be sent. Please share the
                          credentials manually with the user.
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 p-4">
                      <div>
                        <Label className="text-xs text-zinc-500">Name</Label>
                        <p className="font-medium">{createdUser.fullName}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-zinc-500">Email</Label>
                        <p className="font-medium">{createdUser.email}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-zinc-500">Role</Label>
                        <p className="font-medium capitalize">
                          {createdUser.role}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs text-zinc-500">
                          Temporary Password
                        </Label>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="flex-1 bg-white dark:bg-zinc-800 px-3 py-2 rounded border font-mono text-sm">
                            {createdUser.password}
                          </code>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={copyPassword}
                          >
                            {passwordCopied ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Alert>
                      <AlertDescription className="text-sm">
                        The user should change this password after their first
                        login for security purposes.
                      </AlertDescription>
                    </Alert>
                  </div>

                  <DialogFooter>
                    <Button onClick={resetDialog} className="w-full">
                      Done
                    </Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.full_name || "N/A"}
                    </TableCell>
                    <TableCell>{user.email_address}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          user.role === "manager"
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200 border-purple-200 dark:border-purple-800"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200 border-blue-200 dark:border-blue-800"
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
