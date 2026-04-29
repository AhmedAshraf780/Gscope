import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

export function PublicOnlyRoute() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

export function PendingOtpRoute() {
  const { isAuthenticated, pendingOtpSession } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  if (!pendingOtpSession) {
    return <Navigate to="/signup" replace />
  }

  return <Outlet />
}
