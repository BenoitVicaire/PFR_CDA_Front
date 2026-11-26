/**
 * Destination après connexion (US-002, EF-A02) : le paramètre `?redirect=` posé par RequireAuth.
 * Seul un chemin interne est accepté, pour ne pas renvoyer vers un autre site.
 */
export function getRedirectPath(searchParams: URLSearchParams): string {
  const redirect = searchParams.get("redirect")
  const isInternalPath = redirect?.startsWith("/") && !redirect.startsWith("//") && !redirect.startsWith("/\\")
  return isInternalPath ? redirect! : "/dashboard"
}
