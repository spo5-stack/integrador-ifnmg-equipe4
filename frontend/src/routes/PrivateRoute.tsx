import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "@/features/auth/controller/AuthContext"

export function PrivateRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/login" />
  }

  return <Outlet />
}
