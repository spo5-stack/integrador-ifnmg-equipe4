import { Outlet } from "react-router-dom"
import { MobileHeader } from "@/components/layout/MobileHeader"
import { Sidebar } from "@/components/layout/Sidebar"

export function AuthenticatedLayout() {
  return (
    <div className="min-h-svh bg-background">
      <Sidebar />
      <MobileHeader />
      <main className="min-h-svh md:ml-64">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
