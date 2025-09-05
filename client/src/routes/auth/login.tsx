import LoginForm from "@/components/auth/LoginForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="bg-background w-full min-h-screen flex items-center justify-center">
      <LoginForm />
    </div>
  );
}
