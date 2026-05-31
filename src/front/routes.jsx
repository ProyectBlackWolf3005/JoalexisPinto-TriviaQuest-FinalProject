import {
    createBrowserRouter,
    createRoutesFromElements,
    Route
} from "react-router-dom";

import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Dashboard } from "./pages/Dashboard";
import { PlayTrivia } from "./pages/PlayTrivia";
import { Results } from "./pages/Results";
import { Profile } from "./pages/Profile";
import { MyQuestions } from "./pages/MyQuestions";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route
            path="/"
            element={<Layout />}
            errorElement={<h1>Página no encontrada</h1>}
        >
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/play"
                element={
                    <ProtectedRoute>
                        <PlayTrivia />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/results"
                element={
                    <ProtectedRoute>
                        <Results />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/my-questions"
                element={
                    <ProtectedRoute>
                        <MyQuestions />
                    </ProtectedRoute>
                }
            />
        </Route>
    )
);