import { RouterProvider } from "react-router-dom"

import { TooltipProvider } from "@/components/ui/tooltip"
import { AuthProvider } from "@/features/auth/AuthProvider"
import { router } from "@/router"

function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <RouterProvider router={router} />
      </TooltipProvider>
    </AuthProvider>
  )
}

export default App
