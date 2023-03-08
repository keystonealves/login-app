import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

/* import all components */
import Username from './components/auth/Username';
import Password from './components/auth/Password';
import Profile from './components/auth/Profile';
import Recovery from './components/auth/Recovery';
import Register from './components/auth/Register';
import Reset from './components/auth/Reset';
import PageNotFound from './components/auth/PageNotFound';


// Auth middleware
import { AuthorizeUser, ProtectRoute } from './middleware/auth';


/* root routes */
const router = createBrowserRouter([
    {
        path : '/',
        element : <Username />
    },
    {
        path : '/register',
        element : <Register />
    },
    {
        path : '/password',
        element : <ProtectRoute><Password /></ProtectRoute>
    },
    {
        path : '/profile',
        element : <AuthorizeUser> <Profile /> </AuthorizeUser>
    },
    {
        path : '/recovery',
        element : <Recovery />
    },
    {
        path : '/reset',
        element : <Reset />
    },
    {
        path : '*',
        element : <PageNotFound />
    }
])

export default function App() {
    return (
        <main>
            <RouterProvider router={router}>

            </RouterProvider>
        </main>
    )
}