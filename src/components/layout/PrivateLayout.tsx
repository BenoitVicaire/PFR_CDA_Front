import { Outlet } from "react-router-dom"

import { BottomNav } from "./BottomNav"
import { PrivateHeader } from "./PrivateHeader"
import { PublicFooter } from "./PublicFooter"

export function PrivateLayout() {
  return (
    // pb-20 : laisse la place de BottomNav, fixée en bas sur mobile.
    <div className="flex min-h-dvh flex-col bg-background pb-20 md:pb-0">
      <PrivateHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
      <BottomNav />
    </div>
  )
}
