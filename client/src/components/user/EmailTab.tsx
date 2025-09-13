import { Mail, Save } from "lucide-react";
import { CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import type { User as UserType } from "@/redux/auth/userAuthSlice";

type EmailTabProps = {
  user: UserType;
};

const EmailTab = ({ user }: EmailTabProps) => {
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <CardTitle className="text-base">Update Email</CardTitle>
      <div>
        <Label htmlFor="email" className="mb-2">
          Email
        </Label>
        <div className="relative">
          <Mail className="w-4 h-4 absolute left-2  top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent" />

          <Input
            id="email"
            type="email"
            defaultValue={user?.email}
            className="pl-8"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          className="cursor-pointer flex items-center gap-2"
          onClick={() => {
            console.log("Changes canceled");
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="cursor-pointer flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default EmailTab;
