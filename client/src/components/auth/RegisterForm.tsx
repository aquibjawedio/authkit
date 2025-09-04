import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, LockKeyhole, Mail, User, UserCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormDTO } from "@/schemas/authSchema";
import { Link } from "@tanstack/react-router";
import { axiosClient } from "@/api/axiosClient";

const RegisterForm = () => {
  const [hidePassword, setHidePassword] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<RegisterFormDTO>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormDTO) => {
    await axiosClient.post("/auth/register", data);
  };

  return (
    <Card className="w-full max-w-md overflow-hidden p-0 shadow-lg">
      <CardContent className="p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold">Welcome!</h1>
            <p className="text-muted-foreground">
              Create an account to get started
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fullname">Full Name</Label>
            <div className="relative">
              <Button
                type="button"
                variant="ghost"
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent"
              >
                <User className="w-5 h-5" />
              </Button>
              <Input
                id="fullname"
                placeholder="John Doe"
                {...register("fullname")}
                className="pl-10"
              />
            </div>
            {errors.fullname && (
              <p className="text-sm text-red-600">{errors.fullname.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <Button
                type="button"
                variant="ghost"
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent"
              >
                <UserCheck className="w-5 h-5" />
              </Button>
              <Input
                id="username"
                placeholder="coolcoder123"
                {...register("username")}
                className="pl-10 pr-10"
              />
            </div>
            {errors.username && (
              <p className="text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Button
                type="button"
                variant="ghost"
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent"
              >
                <Mail className="w-5 h-5" />
              </Button>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className="pl-10"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Button
                type="button"
                variant="ghost"
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent"
              >
                <LockKeyhole className="w-5 h-5" />
              </Button>
              <Input
                id="password"
                type={hidePassword ? "password" : "text"}
                placeholder="••••••••"
                {...register("password")}
                className="pl-10 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                onClick={() => setHidePassword(!hidePassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent"
              >
                {hidePassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full mt-2 cursor-pointer"
            disabled={isSubmitting || isSubmitted}
          >
            {isSubmitting
              ? "Registering..."
              : isSubmitted
                ? "Registered!"
                : "Register"}
          </Button>

          <div className="relative text-center text-sm text-muted-foreground">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <span className="relative bg-background px-2 z-10">
              Or continue with
            </span>
          </div>

          <Button
            variant="outline"
            type="button"
            className="w-full gap-2 cursor-pointer"
            onClick={() =>
              (window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/google`)
            }
            disabled={isSubmitting}
          >
            <img
              src="https://img.icons8.com/color/48/google-logo.png"
              alt="Google"
              className="w-5 h-5"
            />
            <span>Continue with Google</span>
          </Button>

          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="text-primary underline hover:underline-offset-4"
            >
              Login
            </Link>
          </div>
          <div className="text-sm text-center text-muted-foreground">
            Didn't receive the verification email?{" "}
            <Link
              to="/auth/resend"
              className="text-primary underline hover:underline-offset-4"
            >
              Resend
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
