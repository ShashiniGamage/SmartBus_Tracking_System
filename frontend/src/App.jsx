import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar        from './components/Navbar'
import Footer        from './components/Footer'
import Home          from './pages/Home'
import Login         from './pages/Login'
import Register      from './pages/Register'
import LiveRoute     from './pages/LiveRoute'
import { About, Services, Contact, Privacy } from './pages/StaticPages'
import AdminDash     from './pages/AdminDash'
import DriverDash    from './pages/DriverDash'
import PassengerDash from './pages/PassengerDash'

function PrivateRoute({ children, role }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace/>
  if (role && user.role !== role) return <Navigate to={`/${user.role}`} replace/>
  return children
}

function Layout({ children }) {
  return (
    <>
      <Navbar/>
      <main>{children}</main>
      <Footer/>
    </>
  )
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <Routes>
      <Route path="/"         element={<Layout><Home/></Layout>}/>
      <Route path="/about"    element={<Layout><About/></Layout>}/>
      <Route path="/live"     element={<Layout><LiveRoute/></Layout>}/>
      <Route path="/services" element={<Layout><Services/></Layout>}/>
      <Route path="/contact"  element={<Layout><Contact/></Layout>}/>
      <Route path="/privacy"  element={<Layout><Privacy/></Layout>}/>
      <Route path="/login"    element={<Layout><Login/></Layout>}/>
      <Route path="/register" element={<Layout><Register/></Layout>}/>

      <Route path="/admin"     element={<PrivateRoute role="admin">    <><Navbar/><AdminDash/></>     </PrivateRoute>}/>
      <Route path="/driver"    element={<PrivateRoute role="driver">   <><Navbar/><DriverDash/></>    </PrivateRoute>}/>
      <Route path="/passenger" element={<PrivateRoute role="passenger"><><Navbar/><PassengerDash/></> </PrivateRoute>}/>

      <Route path="*" element={user ? <Navigate to={`/${user.role}`} replace/> : <Navigate to="/" replace/>}/>
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes/>
      </BrowserRouter>
    </AuthProvider>
  )
}