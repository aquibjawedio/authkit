import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/resend")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/auth/resend"!</div>;
}
