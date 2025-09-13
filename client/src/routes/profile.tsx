import SpinLoader from "@/components/shared/SpinLoader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RootState } from "@/redux/store";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useSelector } from "react-redux";

export const Route = createFileRoute("/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, loading } = useSelector((state: RootState) => state.auth);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <SpinLoader />
      </div>
    );
  }

  return user ? (
    <div className="w-full min-h-screen flex items-center justify-center bg-muted/30 p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center">
          <Avatar className="w-24 h-24">
            <AvatarImage src={user?.avatarUrl} alt={user?.fullname} />
            <AvatarFallback>{user?.fullname?.charAt(0) ?? "U"}</AvatarFallback>
          </Avatar>
          <CardTitle className="mt-4">{user?.fullname}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3 pt-4 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Username:</span>{" "}
            {user?.username}
          </p>
          <p>
            <span className="font-medium text-foreground">Email:</span>{" "}
            {user?.email}
          </p>
          <p>
            <span className="font-medium text-foreground">Role:</span>{" "}
            {user?.role}
          </p>
          <Button variant="outline" className="cursor-pointer">
            {user.isEmailVerified ? "Verified" : "Not Verified"}
          </Button>
        </CardContent>
      </Card>
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4">
      <Card className="w-full max-w-sm shadow-md rounded-xl p-6 bg-background border border-border">
        <CardContent className="flex flex-col items-center text-center space-y-4">
          <p className="text-destructive font-bold text-xl">Not Logged In</p>
          <p className="text-muted-foreground text-sm">
            You must be logged in to access this page.
          </p>
          <Link to="/auth/login" className="w-full">
            <Button className="w-full mt-2 cursor-pointer" variant="default">
              Go to Login
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
