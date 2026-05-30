import { Link } from "react-router-dom";
import { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Dashboard = () => {
    const { store, dispatch } = useGlobalReducer();

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Recupera la información del usuario cuando existe un token
    // pero todavía no se han cargado sus datos en el estado global.
    useEffect(() => {
        const loadUser = async () => {
            if (!store.token || store.user) return;

            try {
                const response = await fetch(`${backendUrl}/api/private`, {
                    headers: {
                        Authorization: `Bearer ${store.token}`
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    dispatch({
                        type: "set_user",
                        payload: data.user
                    });
                }
            } catch (error) {
                console.error(error);
            }
        };

        loadUser();
    }, [store.token, store.user, dispatch, backendUrl]);

    return (
        <main className="container py-5">
            <section className="row justify-content-center">
                <div className="col-12 col-lg-8">
                    <div className="card shadow-sm p-4">
                        <h1 className="mb-3">
                            Panel
                        </h1>

                        <p className="lead mb-1">
                            Bienvenido a TriviaQuest.
                        </p>

                        {store.user ? (
                            <p className="text-muted">
                                Sesión iniciada como: <strong>{store.user.email}</strong>
                            </p>
                        ) : (
                            <p className="text-muted">
                                Cargando información del usuario...
                            </p>
                        )}

                        <hr />

                        <div className="row g-3">
                            <div className="col-12 col-md-6">
                                <div className="border rounded p-3 h-100">
                                    <h2 className="h5">
                                        Jugar trivia
                                    </h2>

                                    <p className="text-muted">
                                        Responde preguntas por categoría y guarda tu puntaje.
                                    </p>

                                    <Link
                                        to="/play"
                                        className="btn btn-warning"
                                    >
                                        Jugar ahora
                                    </Link>
                                </div>
                            </div>

                            <div className="col-12 col-md-6">
                                <div className="border rounded p-3 h-100">
                                    <h2 className="h5">
                                        Resultados
                                    </h2>

                                    <p className="text-muted">
                                        Revisa tu historial de partidas y estadísticas.
                                    </p>

                                    <Link
                                        to="/results"
                                        className="btn btn-outline-dark"
                                    >
                                        Ver resultados
                                    </Link>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
};