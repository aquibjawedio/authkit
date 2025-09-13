import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, LockKeyhole, LogIn, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormDTO } from "@/schemas/authSchema";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { loginUser } from "@/redux/auth/authThunks";
import SpinLoader from "../shared/SpinLoader";

const LoginForm = () => {
  const [hidePassword, setHidePassword] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormDTO) => {
    dispatch(loginUser(data));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/profile" });
    }
  }, [isAuthenticated, navigate]);

  if (error) {
    console.log("ERROR : ", error);
    return <div className="bg-red-700">{error} </div>;
  }

  return (
    <Card className="w-full max-w-md overflow-hidden p-0 shadow-lg">
      <CardContent className="grid p-0">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-2xl font-bold">Welcome back</h1>
              <p className="text-muted-foreground text-balance">
                Login to your Auth Kit account
              </p>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute left-0  top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent"
                >
                  <Mail className="w-5 h-5" />
                </Button>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="Enter your email"
                  required
                  className="pl-10"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-3">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/auth/forgot"
                  className="ml-auto text-sm underline-offset-2 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute left-0  top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent"
                >
                  <LockKeyhole className="w-5 h-5" />
                </Button>
                <Input
                  id="password"
                  type={hidePassword ? "password" : "text"}
                  required
                  {...register("password")}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setHidePassword(!hidePassword)}
                  className="absolute right-0  top-1/2 -translate-y-1/2 cursor-pointer bg-transparent hover:bg-transparent"
                >
                  {hidePassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </Button>
                {errors.password && (
                  <p className="text-red-500 text-sm absolute -bottom-6 left-0">
                    {errors.password.message || "Password is required"}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer mt-2"
              disabled={isSubmitting || isSubmitted}
            >
              {isSubmitting || loading ? (
                <SpinLoader />
              ) : (
                <div className="flex gap-2 items-center justify-center">
                  <LogIn className="w-5 h-5" />
                  Login
                </div>
              )}
            </Button>

            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className="bg-card text-muted-foreground relative z-10 px-2">
                Or continue with
              </span>
            </div>

            <Button
              variant="outline"
              type="button"
              className="w-full gap-2 cursor-pointer"
              onClick={() =>
                (window.location.href = `${
                  import.meta.env.VITE_BACKEND_URL
                }/api/v1/auth/google`)
              }
              disabled={isSubmitting || isSubmitted}
            >
              <img
                width="48"
                height="48"
                src="https://img.icons8.com/color/48/google-logo.png"
                alt="google-logo"
                className="w-6 h-6"
              />
              <span>Continue with Google</span>
            </Button>

            <div className="text-sm text-center text-muted-foreground">
              <span>Don't have an account?</span>{" "}
              <Link
                to="/auth/register"
                className="hover:underline underline-offset-4 ml-1 text-primary"
              >
                Register
              </Link>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
