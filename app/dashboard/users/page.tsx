"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { UserPlus, CheckCircle, AlertCircle, Trash2, Repeat } from "lucide-react";

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

interface RoleChangeTarget {
  userId: string;
  userName: string;
  currentRole: string;
  nextRole: string;
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
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [changingRoleId, setChangingRoleId] = useState<string | null>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [roleChangeTarget, setRoleChangeTarget] = useState<RoleChangeTarget | null>(null);

  const checkUserAndFetchUsers = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setCurrentUserId(user.id);

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
  }, [router]);

  useEffect(() => {
    checkUserAndFetchUsers();
  }, [checkUserAndFetchUsers]);

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
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("Not authenticated");
      }

      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
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
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Failed to create user");
      console.error("Error creating user:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetDialog = () => {
    setIsDialogOpen(false);
    setCreatedUser(null);
    setError(null);
    setNewUser({ email: "", fullName: "", role: "reviewer" });
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(userId);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("Not authenticated");
      }

      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete user");
      }

      await fetchUsers();
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Failed to delete user");
      console.error("Error deleting user:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const openRoleChangeDialog = (userId: string, currentRole: string, userName: string) => {
    const nextRole = currentRole === "manager" ? "reviewer" : "manager";
    setRoleChangeTarget({
      userId,
      userName,
      currentRole,
      nextRole,
    });
    setIsRoleDialogOpen(true);
  };

  const handleConfirmRoleChange = async () => {
    if (!roleChangeTarget) return;

    setChangingRoleId(roleChangeTarget.userId);
    setError(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("Not authenticated");
      }

      const response = await fetch("/api/users/change-role", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          userId: roleChangeTarget.userId,
          newRole: roleChangeTarget.nextRole,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to change role");
      }

      await fetchUsers();
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Failed to change role");
      console.error("Error changing role:", err);
    } finally {
      setChangingRoleId(null);
      setIsRoleDialogOpen(false);
      setRoleChangeTarget(null);
    }
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
                      {isSubmitting ? "Adding..." : "Add User"}
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
                      The user account has been created.
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter>
                    <Button onClick={resetDialog} className="w-full">
                      Done
                    </Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>

          <Dialog
            open={isRoleDialogOpen}
            onOpenChange={(open) => {
              setIsRoleDialogOpen(open);
              if (!open) setRoleChangeTarget(null);
            }}
          >
            <DialogContent className="sm:max-w-[420px]">
              <DialogHeader>
                <DialogTitle>Confirm Role Change</DialogTitle>
                <DialogDescription>
                  {roleChangeTarget
                    ? `Change ${roleChangeTarget.userName} from ${roleChangeTarget.currentRole} to ${roleChangeTarget.nextRole}?`
                    : "Are you sure you want to change this user role?"}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsRoleDialogOpen(false);
                    setRoleChangeTarget(null);
                  }}
                  disabled={!!changingRoleId}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={handleConfirmRoleChange}
                  disabled={!roleChangeTarget || !!changingRoleId}
                >
                  {changingRoleId ? "Changing..." : "Confirm"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="w-[180px] text-right">Actions</TableHead>
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
                    <TableCell className="text-right">
                      {currentUserId !== user.id && (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/30"
                            disabled={changingRoleId === user.id || deletingId === user.id}
                            onClick={() =>
                              openRoleChangeDialog(
                                user.id,
                                user.role,
                                user.full_name || user.email_address
                              )
                            }
                          >
                            {changingRoleId === user.id ? (
                              "Changing..."
                            ) : (
                              <Repeat className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                            disabled={deletingId === user.id || changingRoleId === user.id}
                            onClick={() =>
                              handleDeleteUser(
                                user.id,
                                user.full_name || user.email_address
                              )
                            }
                          >
                            {deletingId === user.id ? (
                              "Deleting..."
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      )}
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
