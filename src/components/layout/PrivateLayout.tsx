import { Outlet } from "react-router-dom"

import { BottomNav } from "./BottomNav"
import { PrivateHeader } from "./PrivateHeader"

export function PrivateLayout() {
  return (
    <div className="min-h-dvh bg-background">
      <PrivateHeader />
      <main className="pb-20 md:pb-0">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
