import { CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Globe,
  Twitter,
  Linkedin,
  Instagram,
  Github,
  ImageUp,
  Save,
} from "lucide-react";
import { useRef } from "react";
import type { User as UserType } from "@/redux/auth/userAuthSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { uploadAvatar } from "@/redux/auth/authThunks";
import SpinLoader from "../shared/SpinLoader";

interface PersonalTabProps {
  user: UserType | null;
}

const PersonalTab = ({ user }: PersonalTabProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Selected avatar file:", file);
    }

    if (!file?.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }
  };

  const handleAvatarUpload = () => {
    if (fileInputRef.current?.files?.[0]) {
      const file = fileInputRef.current.files[0];
      console.log("Uploading avatar file:", file);
      dispatch(uploadAvatar(file));
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center gap-4">
        <Avatar
          className="w-24 h-24 border shadow-sm cursor-pointer"
          onClick={handleAvatarClick}
        >
          <AvatarImage src={user?.avatarUrl} alt={user?.fullname} />
          <AvatarFallback>{user?.fullname?.charAt(0) ?? "U"}</AvatarFallback>
        </Avatar>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleAvatarChange}
          className="hidden"
        />
        <Button
          variant="default"
          size="sm"
          className="cursor-pointer"
          onClick={handleAvatarUpload}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2 w-20">
              <SpinLoader />
            </div>
          ) : (
            <>
              <ImageUp className="w-4 h-4" />
              Upload Avatar
            </>
          )}
        </Button>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <Label htmlFor="fullname" className="mb-2">
            Full Name
          </Label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-2  top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent" />
            <Input
              id="fullname"
              defaultValue={user?.fullname}
              className="pl-8"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="username" className="mb-2">
            Username
          </Label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-2  top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent" />
            <Input
              id="username"
              defaultValue={user?.username}
              className="pl-8"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" defaultValue={user?.bio} />
        </div>

        <CardTitle className="pt-2">Social Links</CardTitle>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="website" className="mb-2">
              Website
            </Label>
            <div className="relative">
              <Globe className="w-4 h-4 absolute left-2  top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent" />
              <Input
                id="website"
                defaultValue={user?.socialMedia?.website}
                placeholder="https://yourwebsite.com"
                className="pl-8 text-sm"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="twitter" className="mb-2">
              Twitter
            </Label>
            <div className="relative">
              <Twitter className="w-4 h-4 absolute left-2  top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent" />
              <Input
                id="twitter"
                defaultValue={user?.socialMedia?.twitter}
                placeholder="https://twitter.com/username"
                className="pl-8 text-sm"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="linkedin" className="mb-2">
              LinkedIn
            </Label>
            <div className="relative">
              <Input
                id="linkedin"
                defaultValue={user?.socialMedia?.linkedin}
                placeholder="https://linkedin.com/in/username"
                className="pl-8 text-sm"
              />
              <Linkedin className="w-4 h-4 absolute left-2  top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent" />
            </div>
          </div>
          <div>
            <Label htmlFor="instagram" className="mb-2">
              Instagram
            </Label>
            <div className="relative">
              <Input
                id="instagram"
                defaultValue={user?.socialMedia?.instagram}
                placeholder="https://instagram.com/username"
                className="pl-8 text-sm"
              />
              <Instagram className="w-4 h-4 absolute left-2  top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent" />
            </div>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="github" className="mb-2">
              GitHub
            </Label>
            <div className="relative">
              <Input
                id="github"
                defaultValue={user?.socialMedia?.github}
                placeholder="https://github.com/username"
                className="pl-8 text-sm"
              />
              <Github className="w-4 h-4 absolute left-2  top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent" />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
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
    </div>
  );
};

export default PersonalTab;
