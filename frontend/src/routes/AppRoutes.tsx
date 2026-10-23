import { Navigate, Route, Routes } from "react-router-dom"
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout"
import { DashboardPage } from "@/pages/dashboard/DashboardPage"
import { CriarGalpaoPage } from "@/pages/galpoes/CriarGalpaoPage"
import { EditarGalpaoPage } from "@/pages/galpoes/EditarGalpaoPage"
import { GalpaoDetalhePage } from "@/pages/galpoes/GalpaoDetalhePage"
import { GalpoesPage } from "@/pages/galpoes/GalpoesPage"
import { CadastrarLotePage } from "@/pages/lotes/CadastrarLotePage"
import { CriarDispositivoPage } from "@/pages/dispositivos/CriarDispositivoPage"
import { EditarDispositivoPage } from "@/pages/dispositivos/EditarDispositivoPage"
import { DispositivoLeiturasPage } from "@/pages/dispositivos/DispositivoLeiturasPage"
import { PerfilPage } from "@/pages/perfil/PerfilPage"
import { EsqueciSenhaPage } from "@/pages/auth/EsqueciSenhaPage"
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
        <Route element={<EsqueciSenhaPage />} path="/esqueci-senha" />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route element={<AuthenticatedLayout />}>
          <Route element={<DashboardPage />} index />
          <Route element={<GalpoesPage />} path="galpoes" />
          <Route element={<CriarGalpaoPage />} path="galpoes/novo" />
          <Route
            element={<CadastrarLotePage />}
            path="galpoes/:galpaoId/lotes/novo"
          />
          <Route
            element={<CriarDispositivoPage />}
            path="galpoes/:galpaoId/dispositivos/novo"
          />
          <Route element={<GalpaoDetalhePage />} path="galpoes/:id" />
          <Route element={<EditarGalpaoPage />} path="galpoes/:id/editar" />
          <Route
            element={<EditarDispositivoPage />}
            path="dispositivos/:id/editar"
          />
          <Route
            element={<DispositivoLeiturasPage />}
            path="dispositivos/:id/leituras"
          />
          <Route element={<PerfilPage />} path="perfil" />
        </Route>
      </Route>

      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  )
}
