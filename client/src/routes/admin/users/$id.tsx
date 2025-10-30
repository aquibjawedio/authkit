import {
  createFileRoute,
  useParams,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import {
  getUserById,
  updateUserRole,
  deleteUser,
} from "@/redux/admin/adminThunks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, Trash2, UserCog } from "lucide-react";

export const Route = createFileRoute("/admin/users/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({ from: "/admin/users/$id" });
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { selectedUser, loading, error } = useSelector(
    (state: RootState) => state.admin
  );

  // 🧭 Fetch user on mount
  useEffect(() => {
    if (id) dispatch(getUserById(id));
  }, [id, dispatch]);

  // 🧩 Role toggle handler
  const handleRoleChange = async () => {
    if (!selectedUser) return;
    const newRole = selectedUser.role === "admin" ? "user" : "admin";
    const result = await dispatch(
      updateUserRole({ id: selectedUser._id, role: newRole })
    );
    if (updateUserRole.fulfilled.match(result)) {
      toast.success(`Role updated to ${newRole}`);
    } else {
      toast.error("Failed to update role");
    }
  };

  // 🗑️ Delete user
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    const confirm = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirm) return;

    const result = await dispatch(deleteUser(selectedUser._id));
    if (deleteUser.fulfilled.match(result)) {
      toast.success("User deleted successfully");
      navigate({ to: "/admin/dashboard" });
    } else {
      toast.error("Failed to delete user");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-[60vh] text-muted-foreground">
        <Loader2 className="animate-spin w-6 h-6 mr-2" /> Loading user...
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-red-500">
        <p>{error}</p>
      </div>
    );

  if (!selectedUser)
    return (
      <div className="flex items-center justify-center h-[60vh] text-muted-foreground">
        User not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-3xl mx-auto">
        <Card className="border bg-card shadow-sm">
          <CardHeader className="flex flex-col sm:flex-row items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={selectedUser.avatarUrl} />
              <AvatarFallback>{selectedUser.fullname[0]}</AvatarFallback>
            </Avatar>

            <div className="flex flex-col text-center sm:text-left">
              <CardTitle className="text-2xl font-bold">
                {selectedUser.fullname}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                @{selectedUser.username}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge
                  variant={
                    selectedUser.role === "admin" ? "default" : "secondary"
                  }
                >
                  {selectedUser.role}
                </Badge>
                {selectedUser.isEmailVerified && (
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-600"
                  >
                    Email Verified
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{selectedUser.email}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Last Login</p>
              <p className="font-medium">
                {new Date(selectedUser.lastLogin).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Joined</p>
              <p className="font-medium">
                {new Date(selectedUser.createdAt).toLocaleDateString()}
              </p>
            </div>

            {selectedUser.bio && (
              <div>
                <p className="text-sm text-muted-foreground">Bio</p>
                <p className="font-medium">{selectedUser.bio}</p>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between">
            <Button
              variant="outline"
              onClick={handleRoleChange}
              className="flex items-center gap-2"
            >
              <UserCog className="w-4 h-4" />
              Toggle Role
            </Button>

            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete User
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
