import { Navigate, Route, Routes } from "react-router-dom"
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout"
import { LoginView } from "@/features/auth/view/LoginView"
import { RegisterView } from "@/features/auth/view/RegisterView"
import { DashboardView } from "@/features/dashboard/view/DashboardView"
import { CriarGalpaoView } from "@/features/galpoes/view/CriarGalpaoView"
import { EditarGalpaoView } from "@/features/galpoes/view/EditarGalpaoView"
import { GalpaoDetalheView } from "@/features/galpoes/view/GalpaoDetalheView"
import { GalpoesView } from "@/features/galpoes/view/GalpoesView"
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
        <Route element={<AuthenticatedLayout />}>
          <Route element={<DashboardView />} index />
          <Route element={<GalpoesView />} path="galpoes" />
          <Route element={<CriarGalpaoView />} path="galpoes/novo" />
          <Route element={<GalpaoDetalheView />} path="galpoes/:id" />
          <Route element={<EditarGalpaoView />} path="galpoes/:id/editar" />
        </Route>
      </Route>

      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  )
}
