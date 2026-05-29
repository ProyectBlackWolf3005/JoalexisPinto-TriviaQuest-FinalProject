import { Link } from "react-router-dom";

export const Results = () => {
    return (
        <main className="container py-5">
            <section className="text-center mb-5">
                <h1 className="display-5 fw-bold">
                    Resultados
                </h1>

                <p className="lead text-muted">
                    Revisa tu historial de partidas y tus mejores puntuaciones.
                </p>
            </section>

            <section className="row g-4 justify-content-center">

                <div className="col-12 col-md-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body text-center">
                            <h2 className="h5">Partidas jugadas</h2>
                            <p className="display-6 mb-0">0</p>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body text-center">
                            <h2 className="h5">Mejor puntaje</h2>
                            <p className="display-6 mb-0">0</p>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body text-center">
                            <h2 className="h5">Última categoría</h2>
                            <p className="display-6 mb-0">-</p>
                        </div>
                    </div>
                </div>

            </section>

            <section className="card shadow-sm mt-5">
                <div className="card-body">
                    <h2 className="h4 mb-3">
                        Historial de partidas
                    </h2>

                    <div className="alert alert-info mb-4">
                        Aún no tienes partidas registradas. Juega una trivia para ver tus resultados aquí.
                    </div>

                    <h3 className="h5">
                        Próximas mejoras
                    </h3>

                    <ul className="mb-0">
                        <li>Historial completo de partidas.</li>
                        <li>Mejor puntaje por categoría.</li>
                        <li>Estadísticas personales de rendimiento.</li>
                    </ul>
                </div>
            </section>

            <div className="text-center mt-4">
                <Link to="/play" className="btn btn-warning">
                    Jugar una trivia
                </Link>
            </div>
        </main>
    );
};