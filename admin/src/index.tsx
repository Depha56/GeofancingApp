import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { useRoutes } from 'react-router-dom'
import './index.css'

//@ts-ignore: this is a generated routes from app folder
import pagesRoutes from '~react-pages'
import { StrictMode, Suspense, useEffect } from 'react';
import DashboardLayout from 'components/layouts/user-dashboard';
import SimpleLayout from 'components/layouts/simple-layout';
import { AuthProvider } from './hooks/use-auth'
import { UsersProvider } from './hooks/use-users'
import { TrackingProvider } from './hooks/use-tracking'
import { CollarsProvider } from './hooks/use-collars'

const container = document.getElementById('root') as HTMLDivElement
const root = createRoot(container)

// Redefine Routers
const routes =pagesRoutes.map((route: any) => {
    //Users routes
    const listOfPathsWithNavigationHeaders = ["/", "/users", "/profile", "/settings", "/notifications", "/tracking", "/collars"];
    let layout = listOfPathsWithNavigationHeaders
                        .some((path)=>path.includes(route.path)) ? <DashboardLayout /> : <SimpleLayout />;

    return {
        path: "/",
        element: layout,
        children: [route]
    }
});

function App() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        }).catch((err) => {
          console.error('Service Worker registration failed:', err);
        });
    }
  }, []);
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
                  <TrackingProvider>
                    <CollarsProvider>
                        <App />
                    </CollarsProvider>
                  </TrackingProvider>
                </UsersProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>,
)
