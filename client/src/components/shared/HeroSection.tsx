import { LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

const HeroSection = () => {
  return (
    <section className="relative flex flex-col items-center justify-center py-20 gap-4 text-center px-4 overflow-hidden">
      <div className="absolute top-10 left-10 w-24 h-24 bg-primary/20 rounded-full blur-2xl animate-float-slow" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-secondary/30 rounded-full blur-2xl animate-float" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-muted/40 rounded-full blur-3xl animate-pulse" />

      <h1 className="text-3xl md:text-5xl font-bold tracking-tight z-10">
        Welcome to <span className="text-primary">AuthKit</span>
      </h1>
      <p className="max-w-xl text-muted-foreground z-10">
        A fullstack authentication system that is secure, modern, and easy to
        use.
      </p>

      <div className="flex gap-4 mt-6 z-10">
        <Link to="/auth/login">
          <Button
            variant="secondary"
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg transition-transform hover:scale-105 cursor-pointer"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Login
          </Button>
        </Link>
        <Link to="/auth/register">
          <Button
            variant="outline"
            className="hover:bg-primary/10 hover:text-primary transition-transform hover:scale-105 cursor-pointer"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Register
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
