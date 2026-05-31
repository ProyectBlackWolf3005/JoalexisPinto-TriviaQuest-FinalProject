import { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

const emptyForm = {
    question: "",
    correct_answer: "",
    wrong_answer_1: "",
    wrong_answer_2: "",
    wrong_answer_3: "",
    category: "",
    difficulty: "Fácil"
};

export const MyQuestions = () => {
    const { store } = useGlobalReducer();

    const [questions, setQuestions] = useState([]);
    const [formData, setFormData] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const loadQuestions = async () => {
        setError("");

        try {
            const response = await fetch(`${backendUrl}/api/custom-questions`, {
                headers: {
                    Authorization: `Bearer ${store.token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "No se pudieron cargar las preguntas.");
                return;
            }

            setQuestions(data.questions);
        } catch (error) {
            setError("Error de conexión con el servidor.");
        }
    };

    useEffect(() => {
        loadQuestions();
    }, []);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const resetForm = () => {
        setFormData(emptyForm);
        setEditingId(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setMessage("");

        const url = editingId
            ? `${backendUrl}/api/custom-questions/${editingId}`
            : `${backendUrl}/api/custom-questions`;

        const method = editingId ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${store.token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "No se pudo guardar la pregunta.");
                return;
            }

            setMessage(
                editingId
                    ? "Pregunta actualizada correctamente."
                    : "Pregunta creada correctamente."
            );

            resetForm();
            loadQuestions();
        } catch (error) {
            setError("Error de conexión con el servidor.");
        }
    };

    const handleEdit = (question) => {
        setEditingId(question.id);
        setFormData({
            question: question.question,
            correct_answer: question.correct_answer,
            wrong_answer_1: question.wrong_answer_1,
            wrong_answer_2: question.wrong_answer_2,
            wrong_answer_3: question.wrong_answer_3,
            category: question.category,
            difficulty: question.difficulty
        });
        setMessage("");
        setError("");
    };

    const handleDelete = async (questionId) => {
        const confirmDelete = window.confirm(
            "¿Seguro que deseas eliminar esta pregunta?"
        );

        if (!confirmDelete) return;

        setError("");
        setMessage("");

        try {
            const response = await fetch(
                `${backendUrl}/api/custom-questions/${questionId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${store.token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "No se pudo eliminar la pregunta.");
                return;
            }

            setMessage("Pregunta eliminada correctamente.");
            loadQuestions();
        } catch (error) {
            setError("Error de conexión con el servidor.");
        }
    };

    return (
        <main className="container py-5">
            <section className="text-center mb-5">
                <h1 className="display-5 fw-bold">
                    Mis preguntas
                </h1>

                <p className="lead text-muted">
                    Crea, edita y elimina tus propias preguntas personalizadas.
                </p>
            </section>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {message && (
                <div className="alert alert-success">
                    {message}
                </div>
            )}

            <section className="row g-4">
                <div className="col-12 col-lg-5">
                    <form onSubmit={handleSubmit} className="card shadow-sm p-4">
                        <h2 className="h4 mb-3">
                            {editingId ? "Editar pregunta" : "Nueva pregunta"}
                        </h2>

                        <div className="mb-3">
                            <label htmlFor="question" className="form-label">
                                Pregunta
                            </label>

                            <textarea
                                id="question"
                                name="question"
                                className="form-control"
                                value={formData.question}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="correct_answer" className="form-label">
                                Respuesta correcta
                            </label>

                            <input
                                id="correct_answer"
                                name="correct_answer"
                                type="text"
                                className="form-control"
                                value={formData.correct_answer}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="wrong_answer_1" className="form-label">
                                Respuesta incorrecta 1
                            </label>

                            <input
                                id="wrong_answer_1"
                                name="wrong_answer_1"
                                type="text"
                                className="form-control"
                                value={formData.wrong_answer_1}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="wrong_answer_2" className="form-label">
                                Respuesta incorrecta 2
                            </label>

                            <input
                                id="wrong_answer_2"
                                name="wrong_answer_2"
                                type="text"
                                className="form-control"
                                value={formData.wrong_answer_2}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="wrong_answer_3" className="form-label">
                                Respuesta incorrecta 3
                            </label>

                            <input
                                id="wrong_answer_3"
                                name="wrong_answer_3"
                                type="text"
                                className="form-control"
                                value={formData.wrong_answer_3}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="category" className="form-label">
                                Categoría
                            </label>

                            <input
                                id="category"
                                name="category"
                                type="text"
                                className="form-control"
                                value={formData.category}
                                onChange={handleChange}
                                placeholder="Ejemplo: Personalizada"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="difficulty" className="form-label">
                                Dificultad
                            </label>

                            <select
                                id="difficulty"
                                name="difficulty"
                                className="form-select"
                                value={formData.difficulty}
                                onChange={handleChange}
                                required
                            >
                                <option value="Fácil">Fácil</option>
                                <option value="Media">Media</option>
                                <option value="Difícil">Difícil</option>
                            </select>
                        </div>

                        <div className="d-flex gap-2 flex-wrap">
                            <button type="submit" className="btn btn-warning">
                                {editingId ? "Actualizar" : "Guardar"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={resetForm}
                                >
                                    Cancelar edición
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="col-12 col-lg-7">
                    <section className="card shadow-sm p-4">
                        <h2 className="h4 mb-3">
                            Preguntas guardadas
                        </h2>

                        {questions.length === 0 ? (
                            <div className="alert alert-info mb-0">
                                Todavía no tienes preguntas personalizadas.
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-striped align-middle">
                                    <thead>
                                        <tr>
                                            <th>Pregunta</th>
                                            <th>Categoría</th>
                                            <th>Dificultad</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {questions.map((question) => (
                                            <tr key={question.id}>
                                                <td>{question.question}</td>
                                                <td>{question.category}</td>
                                                <td>{question.difficulty}</td>
                                                <td>
                                                    <div className="d-flex gap-2 flex-wrap">
                                                        <button
                                                            className="btn btn-sm btn-outline-dark"
                                                            onClick={() => handleEdit(question)}
                                                        >
                                                            Editar
                                                        </button>

                                                        <button
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() => handleDelete(question.id)}
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                </div>
            </section>
        </main>
    );
};