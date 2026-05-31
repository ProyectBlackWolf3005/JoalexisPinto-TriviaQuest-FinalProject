import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    // Cierra la sesión y redirige al login.
    const handleLogout = () => {
        dispatch({
            type: "logout"
        });

        navigate("/login");
    };

    return (
        <nav className="navbar navbar-dark bg-dark">
            <div className="container">
                <Link to="/" className="navbar-brand">
                    TriviaQuest
                </Link>

                <div className="d-flex gap-2">
                    <Link to="/play">
                        <button className="btn btn-warning">
                            Jugar
                        </button>
                    </Link>

                    {store.token ? (
                        <>
                            <Link to="/dashboard">
                                <button className="btn btn-outline-light">
                                    Panel
                                </button>
                            </Link>

                            <Link to="/profile">
                                <button className="btn btn-outline-light">
                                    Perfil
                                </button>
                            </Link>

                            <button className="btn btn-danger" onClick={handleLogout}>
                                Salir
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <button className="btn btn-outline-light">
                                    Ingresar
                                </button>
                            </Link>

                            <Link to="/signup">
                                <button className="btn btn-success">
                                    Registro
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};