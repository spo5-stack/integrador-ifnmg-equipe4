import { Navigate, Route, Routes } from "react-router-dom"
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout"
import { DashboardPage } from "@/pages/dashboard/DashboardPage"
import { CriarGalpaoView } from "@/features/galpoes/view/CriarGalpaoView"
import { EditarGalpaoView } from "@/features/galpoes/view/EditarGalpaoView"
import { GalpaoDetalheView } from "@/features/galpoes/view/GalpaoDetalheView"
import { GalpoesView } from "@/features/galpoes/view/GalpoesView"
import { CadastrarLoteView } from "@/features/lotes/view/CadastrarLoteView"
import { CriarDispositivoView } from "@/features/dispositivos/view/CriarDispositivoView"
import { EditarDispositivoView } from "@/features/dispositivos/view/EditarDispositivoView"
import { DispositivoLeiturasView } from "@/features/dispositivos/view/DispositivoLeiturasView"
import { LoginPage } from "@/pages/auth/LoginPage"
import { RegisterPage } from "@/pages/auth/RegisterPage"
import { PrivateRoute } from "@/routes/PrivateRoute"
import { PublicRoute } from "@/routes/PublicRoute"

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route element={<LoginPage />} path="/login" />
        <Route element={<RegisterPage />} path="/cadastro" />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route element={<AuthenticatedLayout />}>
          <Route element={<DashboardPage />} index />
          <Route element={<GalpoesView />} path="galpoes" />
          <Route element={<CriarGalpaoView />} path="galpoes/novo" />
          <Route
            element={<CadastrarLoteView />}
            path="galpoes/:galpaoId/lotes/novo"
          />
          <Route
            element={<CriarDispositivoView />}
            path="galpoes/:galpaoId/dispositivos/novo"
          />
          <Route element={<GalpaoDetalheView />} path="galpoes/:id" />
          <Route element={<EditarGalpaoView />} path="galpoes/:id/editar" />
          <Route
            element={<EditarDispositivoView />}
            path="dispositivos/:id/editar"
          />
          <Route
            element={<DispositivoLeiturasView />}
            path="dispositivos/:id/leituras"
          />
        </Route>
      </Route>

      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  )
}
