import { Link } from "react-router-dom";

export const PlayTrivia = () => {
    return (
        <main className="container py-5">
            <section className="text-center mb-5">
                <h1 className="display-5 fw-bold">
                    Jugar trivia
                </h1>

                <p className="lead text-muted">
                    Elige una categoría y prepárate para responder preguntas.
                </p>
            </section>

            <section className="row g-4 justify-content-center">

                <div className="col-12 col-md-6 col-lg-3">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body text-center">
                            <h2 className="h5">Cultura general</h2>
                            <p className="text-muted">
                                Preguntas variadas para poner a prueba tus conocimientos.
                            </p>
                            <button className="btn btn-warning w-100">
                                Seleccionar
                            </button>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-6 col-lg-3">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body text-center">
                            <h2 className="h5">Ciencia</h2>
                            <p className="text-muted">
                                Desafíos sobre naturaleza, espacio y descubrimientos.
                            </p>
                            <button className="btn btn-warning w-100">
                                Seleccionar
                            </button>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-6 col-lg-3">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body text-center">
                            <h2 className="h5">Historia</h2>
                            <p className="text-muted">
                                Eventos, personajes y momentos importantes del pasado.
                            </p>
                            <button className="btn btn-warning w-100">
                                Seleccionar
                            </button>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-6 col-lg-3">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body text-center">
                            <h2 className="h5">Entretenimiento</h2>
                            <p className="text-muted">
                                Cine, series, música y cultura pop para divertirse.
                            </p>
                            <button className="btn btn-warning w-100">
                                Seleccionar
                            </button>
                        </div>
                    </div>
                </div>

            </section>

            <section className="card shadow-sm mt-5">
                <div className="card-body text-center">
                    <h2 className="h4">
                        Próximamente: partida activa
                    </h2>

                    <p className="text-muted mb-4">
                        Aquí aparecerán las preguntas, respuestas y puntuación de la partida.
                    </p>

                    <Link to="/dashboard" className="btn btn-outline-dark">
                        Volver al panel
                    </Link>
                </div>
            </section>
        </main>
    );
};