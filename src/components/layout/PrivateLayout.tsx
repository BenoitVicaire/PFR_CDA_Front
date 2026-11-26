import { Outlet } from "react-router-dom"

import { BottomNav } from "./BottomNav"
import { MobileHeader } from "./MobileHeader"
import { PrivateHeader } from "./PrivateHeader"

export function PrivateLayout() {
  return (
    <div className="min-h-dvh bg-background">
      <PrivateHeader />
      <MobileHeader />
      <main className="pb-20 md:pb-0">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
