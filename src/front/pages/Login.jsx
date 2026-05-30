import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Login = () => {
    // Acceso al estado global y navegación.
    const { dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    // Estados del formulario.
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Estado para mostrar errores de autenticación.
    const [error, setError] = useState("");

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Procesa el envío del formulario.
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        try {
            const response = await fetch(`${backendUrl}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "No se pudo iniciar sesión.");
                return;
            }

            // Guarda token y usuario en el estado global.
            dispatch({
                type: "login",
                payload: {
                    token: data.token,
                    user: data.user
                }
            });

            // Redirige al panel principal.
            navigate("/dashboard");
        } catch (error) {
            setError("Error de conexión con el servidor.");
        }
    };

    return (
        <main className="container py-5">
            <section className="row justify-content-center">
                <div className="col-12 col-md-6 col-lg-4">
                    <h1 className="mb-4 text-center">
                        Iniciar sesión
                    </h1>

                    {/* Mensaje de error */}
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    {/* Formulario de acceso */}
                    <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Correo electrónico
                            </label>

                            <input
                                id="email"
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">
                                Contraseña
                            </label>

                            <input
                                id="password"
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-warning w-100">
                            Entrar
                        </button>
                    </form>

                    {/* Enlace al registro */}
                    <p className="mt-3 text-center">
                        ¿No tienes cuenta?{" "}
                        <Link to="/signup">
                            Regístrate aquí
                        </Link>
                    </p>
                </div>
            </section>
        </main>
    );
};