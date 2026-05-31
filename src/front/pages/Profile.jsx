import { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Profile = () => {
    const { store, dispatch } = useGlobalReducer();

    const [username, setUsername] = useState(store.user?.username || "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [profileMessage, setProfileMessage] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");
    const [historyMessage, setHistoryMessage] = useState("");
    const [error, setError] = useState("");

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Actualiza el nombre visible del usuario.
    const handleProfileSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setProfileMessage("");

        try {
            const response = await fetch(`${backendUrl}/api/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${store.token}`
                },
                body: JSON.stringify({ username })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "No se pudo actualizar el perfil.");
                return;
            }

            dispatch({
                type: "set_user",
                payload: data.user
            });

            setProfileMessage("Perfil actualizado correctamente.");
        } catch (error) {
            setError("Error de conexión con el servidor.");
        }
    };

    // Cambia la contraseña del usuario autenticado.
    const handlePasswordSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setPasswordMessage("");

        try {
            const response = await fetch(`${backendUrl}/api/change-password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${store.token}`
                },
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "No se pudo actualizar la contraseña.");
                return;
            }

            setCurrentPassword("");
            setNewPassword("");
            setPasswordMessage("Contraseña actualizada correctamente.");
        } catch (error) {
            setError("Error de conexión con el servidor.");
        }
    };

    // Elimina el historial de partidas del usuario actual.
    const handleClearHistory = async () => {
        setError("");
        setHistoryMessage("");

        const confirmDelete = window.confirm(
            "¿Seguro que deseas eliminar todo tu historial de partidas?"
        );

        if (!confirmDelete) return;

        try {
            const response = await fetch(`${backendUrl}/api/game-results`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${store.token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "No se pudo eliminar el historial.");
                return;
            }

            setHistoryMessage("Historial eliminado correctamente.");
        } catch (error) {
            setError("Error de conexión con el servidor.");
        }
    };

    return (
        <main className="container py-5">
            <section className="text-center mb-5">
                <h1 className="display-5 fw-bold">
                    Perfil
                </h1>

                <p className="lead text-muted">
                    Administra tu información de usuario y configuración de cuenta.
                </p>
            </section>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            <section className="row g-4">
                <div className="col-12 col-lg-6">
                    <form onSubmit={handleProfileSubmit} className="card shadow-sm p-4 h-100">
                        <h2 className="h4 mb-3">
                            Información personal
                        </h2>

                        {profileMessage && (
                            <div className="alert alert-success">
                                {profileMessage}
                            </div>
                        )}

                        <div className="mb-3">
                            <label className="form-label">
                                Correo electrónico
                            </label>

                            <input
                                type="email"
                                className="form-control"
                                value={store.user?.email || ""}
                                disabled
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">
                                Nombre de usuario
                            </label>

                            <input
                                id="username"
                                type="text"
                                className="form-control"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                placeholder="Ejemplo: Nombre personal"
                            />
                        </div>

                        <button type="submit" className="btn btn-warning">
                            Guardar cambios
                        </button>
                    </form>
                </div>

                <div className="col-12 col-lg-6">
                    <form onSubmit={handlePasswordSubmit} className="card shadow-sm p-4 h-100">
                        <h2 className="h4 mb-3">
                            Cambiar contraseña
                        </h2>

                        {passwordMessage && (
                            <div className="alert alert-success">
                                {passwordMessage}
                            </div>
                        )}

                        <div className="mb-3">
                            <label htmlFor="current-password" className="form-label">
                                Contraseña actual
                            </label>

                            <input
                                id="current-password"
                                type="password"
                                className="form-control"
                                value={currentPassword}
                                onChange={(event) => setCurrentPassword(event.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="new-password" className="form-label">
                                Nueva contraseña
                            </label>

                            <input
                                id="new-password"
                                type="password"
                                className="form-control"
                                value={newPassword}
                                onChange={(event) => setNewPassword(event.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-outline-dark">
                            Actualizar contraseña
                        </button>
                    </form>
                </div>
            </section>

            <section className="card shadow-sm p-4 mt-4">
                <h2 className="h4 mb-3">
                    Historial de partidas
                </h2>

                <p className="text-muted">
                    Puedes eliminar tu historial de resultados guardados.
                </p>

                {historyMessage && (
                    <div className="alert alert-success">
                        {historyMessage}
                    </div>
                )}

                <button className="btn btn-danger" onClick={handleClearHistory}>
                    Limpiar historial
                </button>
            </section>
        </main>
    );
};