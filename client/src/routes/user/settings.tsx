import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { User, Mail, Lock } from "lucide-react";
import EmailTab from "@/components/user/EmailTab";
import PersonalTab from "@/components/user/PersonalTab";
import PasswordTab from "@/components/user/PasswordTab";

export const Route = createFileRoute("/user/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="w-full min-h-screen p-6 flex items-start justify-center bg-muted/30">
      <Card className="w-full max-w-5xl overflow-hidden p-6">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger
              value="personal"
              className="flex gap-2  cursor-pointer"
            >
              <User className="w-4 h-4" />
              Personal
            </TabsTrigger>
            <TabsTrigger value="email" className="flex gap-2  cursor-pointer">
              <Mail className="w-4 h-4" />
              Email
            </TabsTrigger>
            <TabsTrigger
              value="password"
              className="flex gap-2  cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              Password
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            {user && <PersonalTab user={user} />}
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            {user && <EmailTab user={user} />}
          </TabsContent>

          <TabsContent value="password" className="space-y-4">
            <PasswordTab />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
