import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "@/features/auth/controller/AuthContext"

type LocationState = {
  from?: {
    pathname?: string
  }
}

export function PublicRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (isAuthenticated) {
    const state = location.state as LocationState | null
    return <Navigate replace to={state?.from?.pathname ?? "/"} />
  }

  return <Outlet />
}
