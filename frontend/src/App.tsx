import { Outlet, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import LandingPage from './pages/Landing'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Login, {action as LoginAction } from './pages/Login'
import Inventory, {loader as InventoryLoader} from './pages/Inventory'
import AddInventory, {action as AddInventoryAction} from './pages/AddInventory'


function App() {  
  const router = createBrowserRouter(createRoutesFromElements(
    <>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} action={LoginAction} />
      <Route path="/" element={<Layout />}>
        <Route path='dashboard' element={<Dashboard />} />
        <Route path="inventory" element={<Outlet />}>
          <Route index element={<Inventory />} loader={InventoryLoader} />
          <Route path="new" element={<AddInventory />} action={AddInventoryAction}/>
        </Route>
      </Route>
    </>
  ))

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
