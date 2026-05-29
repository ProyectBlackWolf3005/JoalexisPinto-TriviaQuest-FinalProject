import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Dashboard = () => {
    const { store } = useGlobalReducer();

    return (
        <main className="container py-5">
            <section className="row justify-content-center">
                <div className="col-12 col-lg-8">

                    <div className="card shadow-sm p-4">
                        <h1 className="mb-3">Panel</h1>

                        <p className="lead mb-1">
                            Bienvenido a TriviaQuest.
                        </p>

                        {store.user ? (
                            <p className="text-muted">
                                Sesión iniciada como: <strong>{store.user.email}</strong>
                            </p>
                        ) : (
                            <p className="text-muted">
                                Sesión iniciada.
                            </p>
                        )}

                        <hr />

                        <div className="row g-3">
                            <div className="col-12 col-md-6">
                                <div className="border rounded p-3 h-100">
                                    <h2 className="h5">Jugar trivia</h2>
                                    <p className="text-muted">
                                        Responde preguntas por categoría y guarda tu puntaje.
                                    </p>
                                    <Link to="/play" className="btn btn-warning">
                                        Jugar ahora
                                    </Link>
                                </div>
                            </div>

                            <div className="col-12 col-md-6">
                                <div className="border rounded p-3 h-100">
                                    <h2 className="h5">Resultados</h2>
                                    <p className="text-muted">
                                        Revisa tu historial de partidas y estadísticas.
                                    </p>
                                    <Link to="/results" className="btn btn-outline-dark">
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