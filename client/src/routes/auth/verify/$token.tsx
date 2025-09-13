import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyEmail } from "@/redux/auth/authThunks";
import type { RootState, AppDispatch } from "@/redux/store";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/verify/$token")({
  component: RouteComponent,
});

function RouteComponent() {
  const { token } = Route.useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(verifyEmail({ token }));
    }
  }, [dispatch, token, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      {loading && <p>Verifying your email...</p>}
      {!loading && error && (
        <div>
          <p className="text-red-600 font-semibold">
            Verification failed: {error}
          </p>
          <Link to="/auth/login"> Login</Link>
        </div>
      )}
      {!loading && !error && (
        <div>
          <p className="text-green-600 font-semibold">
            Email verified! Redirecting...
          </p>
          <Link to="/auth/login"> Login</Link>
        </div>
      )}
    </div>
  );
}
