import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/forgot')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/auth/forgot"!</div>
}
