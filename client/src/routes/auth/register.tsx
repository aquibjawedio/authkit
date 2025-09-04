import RegisterForm from "@/components/auth/RegisterForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/register")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <RegisterForm />
    </div>
  );
}
