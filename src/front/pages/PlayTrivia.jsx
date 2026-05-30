import { useState } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const questionBank = [
    {
        category: "Cultura general",
        question: "¿Cuál es la capital de Chile?",
        options: ["Santiago", "Lima", "Buenos Aires", "Montevideo"],
        correctAnswer: "Santiago"
    },
    {
        category: "Cultura general",
        question: "¿Cuántos colores tiene la bandera de Chile?",
        options: ["Dos", "Tres", "Cuatro", "Cinco"],
        correctAnswer: "Tres"
    },
    {
        category: "Ciencia",
        question: "¿Qué planeta es conocido como el planeta rojo?",
        options: ["Venus", "Marte", "Júpiter", "Saturno"],
        correctAnswer: "Marte"
    },
    {
        category: "Ciencia",
        question: "¿Cuántos lados tiene un hexágono?",
        options: ["Cinco", "Seis", "Siete", "Ocho"],
        correctAnswer: "Seis"
    },
    {
        category: "Historia",
        question: "¿En qué año llegó el ser humano a la Luna?",
        options: ["1965", "1969", "1972", "1980"],
        correctAnswer: "1969"
    },
    {
        category: "Historia",
        question: "¿Qué civilización construyó las pirámides de Giza?",
        options: ["Romana", "Egipcia", "Griega", "Maya"],
        correctAnswer: "Egipcia"
    },
    {
        category: "Entretenimiento",
        question: "¿Cuál de estas sagas pertenece al cine de fantasía?",
        options: ["Rápidos y Furiosos", "Harry Potter", "Rocky", "Jurassic Park"],
        correctAnswer: "Harry Potter"
    },
    {
        category: "Entretenimiento",
        question: "¿Qué instrumento suele asociarse con una banda de rock?",
        options: ["Guitarra eléctrica", "Arpa", "Flauta dulce", "Acordeón"],
        correctAnswer: "Guitarra eléctrica"
    }
];

const categories = ["Cultura general", "Ciencia", "Historia", "Entretenimiento"];

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

export const PlayTrivia = () => {
    const { store } = useGlobalReducer();

    const [gameStarted, setGameStarted] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [gameFinished, setGameFinished] = useState(false);
    const [disabledOptions, setDisabledOptions] = useState([]);
    const [usedFiftyFifty, setUsedFiftyFifty] = useState(false);
    const [usedSkip, setUsedSkip] = useState(false);
    const [resultSaved, setResultSaved] = useState(false);
    const [saveError, setSaveError] = useState("");

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const question = questions[currentQuestion];

    const saveGameResult = async (finalScore) => {
        if (resultSaved) return;

        try {
            const response = await fetch(`${backendUrl}/api/game-results`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${store.token}`
                },
                body: JSON.stringify({
                    score: finalScore,
                    total_questions: questions.length,
                    category: selectedCategory
                })
            });

            if (!response.ok) {
                setSaveError("No se pudo guardar el resultado.");
                return;
            }

            setResultSaved(true);
        } catch (error) {
            setSaveError("Error de conexión al guardar el resultado.");
        }
    };

    const startGame = (category) => {
        const selectedQuestions = questionBank.filter(
            (item) => item.category === category
        );

        setSelectedCategory(category);
        setQuestions(shuffleArray(selectedQuestions));
        setGameStarted(true);
        setCurrentQuestion(0);
        setSelectedAnswer("");
        setScore(0);
        setShowResult(false);
        setGameFinished(false);
        setDisabledOptions([]);
        setUsedFiftyFifty(false);
        setUsedSkip(false);
        setResultSaved(false);
        setSaveError("");
    };

    const handleNextQuestion = () => {
        if (!selectedAnswer) return;

        setShowResult(true);

        const newScore = selectedAnswer === question.correctAnswer ? score + 1 : score;

        if (selectedAnswer === question.correctAnswer) {
            setScore(newScore);
        }

        setTimeout(() => {
            if (currentQuestion + 1 >= questions.length) {
                setGameFinished(true);
                saveGameResult(newScore);
                return;
            }

            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer("");
            setShowResult(false);
            setDisabledOptions([]);
        }, 1800);
    };

    const handleFiftyFifty = () => {
        if (usedFiftyFifty || showResult) return;

        const wrongOptions = question.options.filter(
            (option) => option !== question.correctAnswer
        );

        setDisabledOptions(wrongOptions.slice(0, 2));
        setUsedFiftyFifty(true);
    };

    const handleSkip = () => {
        if (usedSkip || showResult) return;

        setUsedSkip(true);

        if (currentQuestion + 1 >= questions.length) {
            setGameFinished(true);
            saveGameResult(score);
            return;
        }

        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer("");
        setShowResult(false);
        setDisabledOptions([]);
    };

    const resetGame = () => {
        setGameStarted(false);
        setSelectedCategory("");
        setQuestions([]);
        setCurrentQuestion(0);
        setSelectedAnswer("");
        setScore(0);
        setShowResult(false);
        setGameFinished(false);
        setDisabledOptions([]);
        setUsedFiftyFifty(false);
        setUsedSkip(false);
        setResultSaved(false);
        setSaveError("");
    };

    if (!gameStarted) {
        return (
            <main className="container py-5">
                <section className="text-center mb-5">
                    <h1 className="display-5 fw-bold">Jugar trivia</h1>
                    <p className="lead text-muted">
                        Elige una categoría para comenzar una partida.
                    </p>
                </section>

                <section className="row g-4 justify-content-center">
                    {categories.map((category) => (
                        <div className="col-12 col-md-6 col-lg-3" key={category}>
                            <div className="card h-100 shadow-sm">
                                <div className="card-body text-center">
                                    <h2 className="h5">{category}</h2>
                                    <p className="text-muted">
                                        Responde preguntas y acumula puntos.
                                    </p>
                                    <button
                                        className="btn btn-warning w-100"
                                        onClick={() => startGame(category)}
                                    >
                                        Seleccionar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>
            </main>
        );
    }

    if (gameFinished) {
        return (
            <main className="container py-5">
                <section className="row justify-content-center">
                    <div className="col-12 col-lg-8">
                        <div className="card shadow-sm p-4 text-center">
                            <h1 className="mb-3">Partida finalizada</h1>

                            <p className="lead">
                                Categoría: <strong>{selectedCategory}</strong>
                            </p>

                            <p className="lead">
                                Obtuviste <strong>{score}</strong> de{" "}
                                <strong>{questions.length}</strong> puntos.
                            </p>

                            {resultSaved && (
                                <div className="alert alert-success">
                                    Resultado guardado correctamente.
                                </div>
                            )}

                            {saveError && (
                                <div className="alert alert-danger">
                                    {saveError}
                                </div>
                            )}

                            <div className="d-flex justify-content-center gap-3 flex-wrap mt-4">
                                <button className="btn btn-warning" onClick={resetGame}>
                                    Jugar otra vez
                                </button>

                                <Link to="/results" className="btn btn-outline-dark">
                                    Ver resultados
                                </Link>

                                <Link to="/dashboard" className="btn btn-outline-secondary">
                                    Volver al panel
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="container py-5">
            <section className="row justify-content-center">
                <div className="col-12 col-lg-8">
                    <div className="card shadow-sm p-4">
                        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                            <span className="badge bg-dark">
                                Pregunta {currentQuestion + 1} de {questions.length}
                            </span>

                            <span className="badge bg-warning text-dark">
                                Puntaje: {score}
                            </span>

                            <span className="badge bg-secondary">
                                {selectedCategory}
                            </span>
                        </div>

                        <h1 className="h3 mb-4">{question.question}</h1>

                        <div className="row g-3">
                            {question.options.map((option) => {
                                const isSelected = selectedAnswer === option;
                                const isCorrect = question.correctAnswer === option;
                                const isDisabled = disabledOptions.includes(option);

                                let buttonClass = "btn btn-outline-dark w-100 text-start";

                                if (isDisabled) {
                                    buttonClass = "btn btn-light w-100 text-start text-muted border";
                                }

                                if (!showResult && isSelected) {
                                    buttonClass = "btn btn-dark w-100 text-start";
                                }

                                if (showResult && isCorrect) {
                                    buttonClass = "btn btn-success w-100 text-start";
                                }

                                if (showResult && isSelected && !isCorrect) {
                                    buttonClass = "btn btn-danger w-100 text-start";
                                }

                                return (
                                    <div className="col-12 col-md-6" key={option}>
                                        <button
                                            className={buttonClass}
                                            disabled={showResult || isDisabled}
                                            onClick={() => setSelectedAnswer(option)}
                                        >
                                            {option}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        <hr />

                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                            <div className="d-flex gap-2 flex-wrap">
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={handleFiftyFifty}
                                    disabled={usedFiftyFifty || showResult}
                                >
                                    Comodín 50/50
                                </button>

                                <button
                                    className="btn btn-outline-primary"
                                    onClick={handleSkip}
                                    disabled={usedSkip || showResult}
                                >
                                    Saltar pregunta
                                </button>
                            </div>

                            <button
                                className="btn btn-warning"
                                onClick={handleNextQuestion}
                                disabled={!selectedAnswer || showResult}
                            >
                                {currentQuestion + 1 === questions.length ? "Finalizar" : "Siguiente"}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};