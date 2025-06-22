import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { useRoutes } from 'react-router-dom'
import './index.css'

//@ts-ignore: this is a generated routes from app folder
import pagesRoutes from '~react-pages'
import { StrictMode, Suspense } from 'react';
import DashboardLayout from 'components/layouts/user-dashboard';
import SimpleLayout from 'components/layouts/simple-layout';
import { AuthProvider } from './hooks/use-auth'
import { UsersProvider } from './hooks/use-users'

const container = document.getElementById('root') as HTMLDivElement
const root = createRoot(container)

// Redefine Routers
const routes =pagesRoutes.map((route: any) => {
    //Users routes
    const listOfPathsWithNavigationHeaders = ["/", "/users", "/profile", "/settings", "/notifications", "/tracking"];
    let layout = listOfPathsWithNavigationHeaders
                        .some((path)=>path.includes(route.path)) ? <DashboardLayout /> : <SimpleLayout />;

    return {
        path: "/",
        element: layout,
        children: [route]
    }
});

function App() {
    return (
      <Suspense fallback={<p>Loading...</p>}>
        {useRoutes(routes)}
      </Suspense>
    )
}
  
root.render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <UsersProvider>
                    <App />
                </UsersProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>,
)
