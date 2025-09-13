import { CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock, Save } from "lucide-react";

const PasswordTab = () => {
  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <CardTitle className="text-base">Update Password</CardTitle>
      <div>
        <Label htmlFor="currentPassword">Current Password</Label>
        <div className="relative">
          <Lock className="w-4 h-4 absolute left-2  top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent" />
          <Input id="currentPassword" type="password" className="pl-8" />
        </div>
      </div>
      <div>
        <Label htmlFor="newPassword">New Password</Label>
        <div className="relative">
          <Lock className="w-4 h-4 absolute left-2  top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent" />
          <Input id="newPassword" type="password" className="pl-8" />
        </div>
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <div className="relative">
          <Lock className="w-4 h-4 absolute left-2  top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent" />
          <Input id="confirmPassword" type="password" className="pl-8" />
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          type="submit"
          className="cursor-pointer flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save
        </Button>
      </div>
    </form>
  );
};

export default PasswordTab;
