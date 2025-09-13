import App from "@/App";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {

  

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <App />
    </div>
  );
}
