import SpinLoader from "@/components/shared/SpinLoader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InfoItem from "@/components/user/InfoItem";
import type { RootState } from "@/redux/store";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Edit } from "lucide-react";
import { useSelector } from "react-redux";

export const Route = createFileRoute("/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { user, loading, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  if (loading || !isAuthenticated) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <SpinLoader />
      </div>
    );
  }

  return (
    user && (
      <div className="w-full min-h-screen flex items-center justify-center bg-muted/30 p-6 rounded-md">
        <Card className="w-full max-w-3xl p-4 sm:p-6">
          <CardHeader className="flex flex-col sm:flex-row items-center gap-6 border-b pb-6">
            <Avatar className="w-28 h-28 shadow-md border">
              <AvatarImage src={user?.avatarUrl} alt={user?.fullname} />
              <AvatarFallback>
                {user?.fullname?.charAt(0) ?? "U"}
              </AvatarFallback>
            </Avatar>

            <div className="text-center sm:text-left">
              <CardTitle className="text-2xl">{user?.fullname}</CardTitle>
              <p className="text-sm text-muted-foreground">@{user?.username}</p>
              <p className="text-sm mt-2 text-muted-foreground max-w-md">
                {user?.bio || "No bio provided."}
              </p>
            </div>
            <Button
              className="md:ml-auto cursor-pointer"
              variant="outline"
              size="sm"
              onClick={() => {
                navigate({ to: "/user/settings" });
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <InfoItem label="Email" value={user?.email} />
              <InfoItem label="Role" value={user?.role} />
              <InfoItem
                label="Last Login"
                value={formatDate(user?.lastLogin)}
              />
              <InfoItem
                label="Member Since"
                value={formatDate(user?.createdAt)}
              />
              <div className="col-span-full">
                <span className="font-medium text-foreground block mb-1">
                  Email Status
                </span>
                <Button
                  variant={user?.isEmailVerified ? "default" : "outline"}
                  className="text-xs"
                >
                  {user?.isEmailVerified ? "Verified" : "Not Verified"}
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="font-medium text-foreground mb-2">Social Media</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                <InfoItem
                  label="Website"
                  value={user.socialMedia?.website}
                  isLink
                />
                <InfoItem
                  label="Twitter"
                  value={user.socialMedia?.twitter}
                  isLink
                />
                <InfoItem
                  label="LinkedIn"
                  value={user.socialMedia?.linkedin}
                  isLink
                />
                <InfoItem
                  label="Instagram"
                  value={user.socialMedia?.instagram}
                  isLink
                />
                <InfoItem
                  label="GitHub"
                  value={user.socialMedia?.github}
                  isLink
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  );
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
