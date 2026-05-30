import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Results = () => {
    const { store } = useGlobalReducer();

    const [results, setResults] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const loadResults = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/game-results`, {
                headers: {
                    Authorization: `Bearer ${store.token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "No se pudieron cargar los resultados.");
                return;
            }

            setResults(data.results);
        } catch (error) {
            setError("Error de conexión con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadResults();
    }, []);

    const gamesPlayed = results.length;

    const bestScore = results.length > 0
        ? Math.max(...results.map((result) => result.score))
        : 0;

    const lastCategory = results.length > 0
        ? results[0].category
        : "-";

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

            {loading && (
                <div className="alert alert-info">
                    Cargando resultados...
                </div>
            )}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {!loading && !error && (
                <>
                    <section className="row g-4 justify-content-center">

                        <div className="col-12 col-md-4">
                            <div className="card shadow-sm h-100">
                                <div className="card-body text-center">
                                    <h2 className="h5">Partidas jugadas</h2>
                                    <p className="display-6 mb-0">{gamesPlayed}</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-md-4">
                            <div className="card shadow-sm h-100">
                                <div className="card-body text-center">
                                    <h2 className="h5">Mejor puntaje</h2>
                                    <p className="display-6 mb-0">{bestScore}</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-md-4">
                            <div className="card shadow-sm h-100">
                                <div className="card-body text-center">
                                    <h2 className="h5">Última categoría</h2>
                                    <p className="display-6 mb-0">{lastCategory}</p>
                                </div>
                            </div>
                        </div>

                    </section>

                    <section className="card shadow-sm mt-5">
                        <div className="card-body">
                            <h2 className="h4 mb-3">
                                Historial de partidas
                            </h2>

                            {results.length === 0 ? (
                                <div className="alert alert-info mb-0">
                                    Aún no tienes partidas registradas. Juega una trivia para ver tus resultados aquí.
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-striped align-middle">
                                        <thead>
                                            <tr>
                                                <th>Categoría</th>
                                                <th>Puntaje</th>
                                                <th>Preguntas</th>
                                                <th>Fecha</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {results.map((result) => (
                                                <tr key={result.id}>
                                                    <td>{result.category}</td>
                                                    <td>{result.score}</td>
                                                    <td>{result.total_questions}</td>
                                                    <td>{result.created_at}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </section>

                    <div className="text-center mt-4">
                        <Link to="/play" className="btn btn-warning">
                            Jugar una trivia
                        </Link>
                    </div>
                </>
            )}
        </main>
    );
};