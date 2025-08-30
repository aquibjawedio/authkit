import { axiosClient } from "@/api/axiosClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/profile")({
  component: RouteComponent,
});

interface UserDTO {
  fullname: string;
  username: string;
  email: string;
  role: string;
  avatarUrl: string;
}

function RouteComponent() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserDTO>();
  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await axiosClient.get("/users/me");
      setLoading(false);
      console.log(res);
      setUser(res?.data?.data?.user);
    })();
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <Loader2 className="w-4 h-4 animate-spin" />
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
        </CardContent>
      </Card>
    </div>
  ) : (
    <div className="w-full min-h-screen flex items-center justify-center bg-muted/30">
      <Card className="p-6">
        <CardContent>
          <p className="text-destructive font-semibold text-lg">
            USER NOT FOUND
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
