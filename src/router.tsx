import { createBrowserRouter } from "react-router-dom"

import { PrivateLayout } from "@/components/layout/PrivateLayout"
import { PublicLayout } from "@/components/layout/PublicLayout"
import { RedirectIfAuthenticated } from "@/features/auth/RedirectIfAuthenticated"
import { RequireAuth } from "@/features/auth/RequireAuth"
import { ForgotPasswordPage } from "@/features/auth/pages/ForgotPasswordPage"
import { LoginPage } from "@/features/auth/pages/LoginPage"
import { LogoutPage } from "@/features/auth/pages/LogoutPage"
import { RegisterPage } from "@/features/auth/pages/RegisterPage"
import { ResetPasswordPage } from "@/features/auth/pages/ResetPasswordPage"
import { ProfilePage } from "@/features/account/pages/ProfilePage"
import { SettingsPage } from "@/features/account/pages/SettingsPage"
import { BudgetsListPage } from "@/features/budgets/pages/BudgetsListPage"
import { CategoriesListPage } from "@/features/categories/pages/CategoriesListPage"
import { NewCategoryPage } from "@/features/categories/pages/NewCategoryPage"
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage"
import { StatisticsPage } from "@/features/dashboard/pages/StatisticsPage"
import { NewOperationPage } from "@/features/operations/pages/NewOperationPage"
import { OperationDetailPage } from "@/features/operations/pages/OperationDetailPage"
import { OperationsListPage } from "@/features/operations/pages/OperationsListPage"
import { ErrorPage } from "@/pages/ErrorPage"
import { HomePage } from "@/pages/HomePage"
import { LegalNoticePage } from "@/pages/LegalNoticePage"
import { NotFoundPage } from "@/pages/NotFoundPage"
import { PrivacyPolicyPage } from "@/pages/PrivacyPolicyPage"
import { BudgetForm } from "./features/budgets/BudgetForm"

export const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    children: [
      {
        element: <RedirectIfAuthenticated />,
        children: [
          { path: "/", element: <HomePage /> },
          { path: "/inscription", element: <RegisterPage /> },
          { path: "/connexion", element: <LoginPage /> },
        ],
      },
      {
        element: <PublicLayout />,
        children: [
          { path: "/mot-de-passe-oublie", element: <ForgotPasswordPage /> },
          { path: "/mot-de-passe-reset/:token", element: <ResetPasswordPage /> },
          { path: "/mentions-legales", element: <LegalNoticePage /> },
          { path: "/politique-confidentialite", element: <PrivacyPolicyPage /> },
        ],
      },
      { path: "/deconnexion", element: <LogoutPage /> },
      {
        element: <RequireAuth />,
        children: [
          {
            element: <PrivateLayout />,
            children: [
              { path: "/dashboard", element: <DashboardPage /> },
              { path: "/operations", element: <OperationsListPage /> },
              { path: "/operations/new", element: <NewOperationPage /> },
              { path: "/operations/:id", element: <OperationDetailPage /> },
              { path: "/categories", element: <CategoriesListPage /> },
              { path: "/categories/nouvelle", element: <NewCategoryPage /> },
              { path: "/budgets", element: <BudgetsListPage /> },
              { path: "/budgets/new", element: <BudgetForm /> },
              { path: "/statistiques", element: <StatisticsPage /> },
              { path: "/profil", element: <ProfilePage /> },
              { path: "/parametres", element: <SettingsPage /> },
            ],
          },
        ],
      },
      { path: "/erreur", element: <ErrorPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
])
