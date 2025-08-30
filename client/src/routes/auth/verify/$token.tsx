import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/verify/$token")({
  component: RouteComponent,
});

function RouteComponent() {
  const { token } = Route.useParams();
  return <div>Hello "/auth/verify/$token"! is : {token}</div>;
}
