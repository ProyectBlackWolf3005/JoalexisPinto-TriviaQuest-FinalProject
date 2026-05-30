import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export const Signup = () => {
    // Permite redirigir al usuario tras registrarse.
    const navigate = useNavigate();

    // Estados del formulario.
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Estados para mensajes de error y éxito.
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Procesa el registro del usuario.
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        try {
            const response = await fetch(`${backendUrl}/api/signup`, {
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
                setError(data.error || "No se pudo crear la cuenta.");
                return;
            }

            // Muestra mensaje de éxito.
            setSuccess("Cuenta creada correctamente. Ahora puedes iniciar sesión.");

            // Redirige automáticamente al login.
            setTimeout(() => {
                navigate("/login");
            }, 1000);
        } catch (error) {
            setError("Error de conexión con el servidor.");
        }
    };

    return (
        <main className="container py-5">
            <section className="row justify-content-center">
                <div className="col-12 col-md-6 col-lg-4">
                    <h1 className="mb-4 text-center">
                        Crear cuenta
                    </h1>

                    {/* Mensaje de error */}
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    {/* Mensaje de éxito */}
                    {success && (
                        <div className="alert alert-success" role="alert">
                            {success}
                        </div>
                    )}

                    {/* Formulario de registro */}
                    <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                        <div className="mb-3">
                            <label htmlFor="signup-email" className="form-label">
                                Correo electrónico
                            </label>

                            <input
                                id="signup-email"
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="signup-password" className="form-label">
                                Contraseña
                            </label>

                            <input
                                id="signup-password"
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-warning w-100">
                            Registrarse
                        </button>
                    </form>

                    {/* Enlace para usuarios ya registrados */}
                    <p className="mt-3 text-center">
                        ¿Ya tienes cuenta?{" "}
                        <Link to="/login">
                            Inicia sesión aquí
                        </Link>
                    </p>
                </div>
            </section>
        </main>
    );
};