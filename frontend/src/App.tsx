import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { DashboardPage } from './pages/DashboardPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { LandingPage } from './pages/LandingPage'
import { SignInPage } from './pages/SignInPage'
import { SignUpPage } from './pages/SignUpPage'
import { ValidateOtpPage } from './pages/ValidateOtpPage'
import { PendingOtpRoute, ProtectedRoute, PublicOnlyRoute } from './routes/RouteGuards'
import { UpdatePasswordPage } from './pages/UpdatePasswordPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<PublicOnlyRoute />}>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
        </Route>
        <Route element={<PendingOtpRoute />}>
          <Route path="/validateOtp" element={<ValidateOtpPage />} />
        </Route>
        <Route element={<PendingOtpRoute />}>
          <Route path="/restorepassword" element={<UpdatePasswordPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
