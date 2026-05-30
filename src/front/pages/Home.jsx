import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Home = () => {
    // Obtenemos el estado global para saber si el usuario tiene sesión activa.
    const { store } = useGlobalReducer();

    return (
        <main className="container py-5">
            {/* Sección principal de bienvenida */}
            <section className="text-center py-5">
                <h1 className="display-3 fw-bold mb-3">
                    TriviaQuest
                </h1>

                <p className="lead mb-4">
                    Pon a prueba tus conocimientos, compite por la mejor puntuación
                    y descubre cuánto sabes sobre distintos temas.
                </p>

                <div className="d-flex justify-content-center gap-3 flex-wrap">
                    <Link to="/play">
                        <button className="btn btn-warning btn-lg">
                            Comenzar partida
                        </button>
                    </Link>

                    {store.token ? (
                        <Link to="/dashboard">
                            <button className="btn btn-outline-dark btn-lg">
                                Ir al panel
                            </button>
                        </Link>
                    ) : (
                        <Link to="/signup">
                            <button className="btn btn-outline-dark btn-lg">
                                Crear cuenta
                            </button>
                        </Link>
                    )}
                </div>
            </section>

            {/* Sección de características principales */}
            <section className="row g-4 mt-4">
                <div className="col-12 col-md-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body text-center">
                            <h2 className="h4">
                                Elige una categoría
                            </h2>

                            <p className="text-muted">
                                Selecciona el tema que más te interese y comienza una nueva partida.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body text-center">
                            <h2 className="h4">
                                Responde preguntas
                            </h2>

                            <p className="text-muted">
                                Pon a prueba tus conocimientos con preguntas claras y desafiantes.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body text-center">
                            <h2 className="h4">
                                Guarda resultados
                            </h2>

                            <p className="text-muted">
                                Revisa tu historial, mejora tu rendimiento y supera tus marcas.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sección explicativa del flujo de uso */}
            <section className="card shadow-sm mt-5">
                <div className="card-body">
                    <h2 className="h4 text-center mb-4">
                        ¿Cómo funciona?
                    </h2>

                    <div className="row g-3 text-center">
                        <div className="col-12 col-md-3">
                            <strong>1. Crea una cuenta</strong>
                            <p className="text-muted mb-0">
                                Regístrate para guardar tu progreso.
                            </p>
                        </div>

                        <div className="col-12 col-md-3">
                            <strong>2. Elige una categoría</strong>
                            <p className="text-muted mb-0">
                                Escoge el tema de la partida.
                            </p>
                        </div>

                        <div className="col-12 col-md-3">
                            <strong>3. Responde</strong>
                            <p className="text-muted mb-0">
                                Selecciona la alternativa correcta.
                            </p>
                        </div>

                        <div className="col-12 col-md-3">
                            <strong>4. Revisa resultados</strong>
                            <p className="text-muted mb-0">
                                Consulta tu historial de partidas.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};