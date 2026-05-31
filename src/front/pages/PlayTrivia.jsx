import { useState } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { questionBank, categories } from "../data/questionBank";

const QUESTIONS_PER_GAME = 5;
const ONLINE_QUESTIONS_PER_GAME = 10;
const CUSTOM_QUESTIONS_PER_GAME = 15;
const ONLINE_CATEGORY = "Trivia Online";
const CUSTOM_CATEGORY = "Mis preguntas";

const allCategories = [...categories, ONLINE_CATEGORY, CUSTOM_CATEGORY];

const categoryDescriptions = {
    "Cultura general": "Preguntas variadas para poner a prueba tus conocimientos.",
    "Historia": "Eventos y personajes importantes de distintas épocas.",
    "Ciencia": "Descubre cuánto sabes sobre el mundo y sus fenómenos.",
    "Entretenimiento": "Películas, series, música y cultura popular.",
    [ONLINE_CATEGORY]: "Preguntas generales en inglés.",
    [CUSTOM_CATEGORY]: "Juega con las preguntas personalizadas que has creado."
};

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

const decodeText = (text) => {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = text;
    return textArea.value;
};

const prepareQuestions = (questions) => {
    return shuffleArray(questions)
        .slice(0, QUESTIONS_PER_GAME)
        .map((question) => ({
            ...question,
            options: shuffleArray(question.options)
        }));
};

const prepareOnlineQuestions = (questions) => {
    return questions.map((question) => {
        const correctAnswer = decodeText(question.correct_answer);

        return {
            category: ONLINE_CATEGORY,
            question: decodeText(question.question),
            correctAnswer,
            options: shuffleArray([
                correctAnswer,
                ...question.incorrect_answers.map((answer) => decodeText(answer))
            ])
        };
    });
};

const prepareCustomQuestions = (questions) => {
    return shuffleArray(questions)
        .slice(0, CUSTOM_QUESTIONS_PER_GAME)
        .map((question) => ({
            category: CUSTOM_CATEGORY,
            question: question.question,
            correctAnswer: question.correct_answer,
            options: shuffleArray([
                question.correct_answer,
                question.wrong_answer_1,
                question.wrong_answer_2,
                question.wrong_answer_3
            ])
        }));
};

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
    const [loadingQuestions, setLoadingQuestions] = useState(false);
    const [questionError, setQuestionError] = useState("");

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const question = questions[currentQuestion];

    const resetGameState = () => {
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
        setQuestionError("");
    };

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

    const startLocalGame = (category) => {
        const selectedQuestions = questionBank.filter(
            (item) => item.category === category
        );

        setSelectedCategory(category);
        setQuestions(prepareQuestions(selectedQuestions));
        setGameStarted(true);
        resetGameState();
    };

    const startOnlineGame = async () => {
        setLoadingQuestions(true);
        setQuestionError("");

        try {
            const response = await fetch(
                `https://opentdb.com/api.php?amount=${ONLINE_QUESTIONS_PER_GAME}&type=multiple`
            );

            const data = await response.json();

            if (!response.ok || data.response_code !== 0) {
                setQuestionError("No se pudieron cargar las preguntas online.");
                return;
            }

            setSelectedCategory(ONLINE_CATEGORY);
            setQuestions(prepareOnlineQuestions(data.results));
            setGameStarted(true);
            resetGameState();
        } catch (error) {
            setQuestionError("Error de conexión con la API externa.");
        } finally {
            setLoadingQuestions(false);
        }
    };

    const startCustomGame = async () => {
        setLoadingQuestions(true);
        setQuestionError("");

        try {
            const response = await fetch(`${backendUrl}/api/custom-questions`, {
                headers: {
                    Authorization: `Bearer ${store.token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                setQuestionError(data.error || "No se pudieron cargar tus preguntas.");
                return;
            }

            if (data.questions.length === 0) {
                setQuestionError("Primero crea preguntas en la sección Mis preguntas.");
                return;
            }

            setSelectedCategory(CUSTOM_CATEGORY);
            setQuestions(prepareCustomQuestions(data.questions));
            setGameStarted(true);
            resetGameState();
        } catch (error) {
            setQuestionError("Error de conexión al cargar tus preguntas.");
        } finally {
            setLoadingQuestions(false);
        }
    };

    const startGame = (category) => {
        if (category === ONLINE_CATEGORY) {
            startOnlineGame();
            return;
        }

        if (category === CUSTOM_CATEGORY) {
            startCustomGame();
            return;
        }

        startLocalGame(category);
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
        resetGameState();
    };

    if (!gameStarted) {
        return (
            <main className="container py-5">
                <section className="text-center mb-5">
                    <h1 className="display-5 fw-bold">
                        Jugar trivia
                    </h1>

                    <p className="lead text-muted">
                        Elige una categoría para comenzar una partida.
                    </p>
                </section>

                {questionError && (
                    <div className="alert alert-danger">
                        {questionError}
                    </div>
                )}

                <section className="row g-4 justify-content-center">
                    {allCategories.map((category) => (
                        <div className="col-12 col-md-6 col-lg-3" key={category}>
                            <div className="card h-100 shadow-sm">
                                <div className="card-body text-center">
                                    <h2 className="h5">
                                        {category}
                                    </h2>

                                    <p className="text-muted">
                                        {categoryDescriptions[category] ||
                                            "Responde preguntas aleatorias y acumula puntos."}
                                    </p>

                                    <button
                                        className="btn btn-warning w-100"
                                        onClick={() => startGame(category)}
                                        disabled={loadingQuestions}
                                    >
                                        {loadingQuestions &&
                                            (category === ONLINE_CATEGORY || category === CUSTOM_CATEGORY)
                                            ? "Cargando..."
                                            : "Seleccionar"}
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
        const percentage = Math.round((score / questions.length) * 100);

        let message = "Sigue practicando";

        if (percentage === 100) {
            message = "Excelente partida";
        } else if (percentage >= 80) {
            message = "Muy buen resultado";
        } else if (percentage >= 60) {
            message = "Buen trabajo";
        } else if (percentage >= 40) {
            message = "Puedes mejorar";
        }

        return (
            <main className="container py-5">
                <section className="row justify-content-center">
                    <div className="col-12 col-lg-8">
                        <div className="card shadow-sm p-4 text-center">
                            <h1 className="mb-3">
                                Partida finalizada
                            </h1>

                            <p className="lead mb-1">
                                Categoría: <strong>{selectedCategory}</strong>
                            </p>

                            <p className="lead mb-1">
                                Obtuviste <strong>{score}</strong> de{" "}
                                <strong>{questions.length}</strong> puntos.
                            </p>

                            <p className="lead">
                                {percentage}% de aciertos · <strong>{message}</strong>
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

                        <h1 className="h3 mb-4">
                            {question.question}
                        </h1>

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
                                {currentQuestion + 1 === questions.length
                                    ? "Finalizar"
                                    : "Siguiente"}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};