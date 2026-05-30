import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

// Componente base que mantiene Navbar, contenido principal y Footer en toda la aplicación.
export const Layout = () => {
    return (
        <ScrollToTop>
            <div className="d-flex flex-column min-vh-100">
                <Navbar />

                <div className="flex-grow-1">
                    <Outlet />
                </div>

                <Footer />
            </div>
        </ScrollToTop>
    );
};