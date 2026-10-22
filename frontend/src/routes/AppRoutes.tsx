import { Navigate, Route, Routes } from "react-router-dom"
import { AuthHomeView } from "@/features/auth/view/AuthHomeView"
import { LoginView } from "@/features/auth/view/LoginView"
import { RegisterView } from "@/features/auth/view/RegisterView"
import { PrivateRoute } from "@/routes/PrivateRoute"
import { PublicRoute } from "@/routes/PublicRoute"

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route element={<LoginView />} path="/login" />
        <Route element={<RegisterView />} path="/cadastro" />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route element={<AuthHomeView />} path="/" />
      </Route>

      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  )
}
