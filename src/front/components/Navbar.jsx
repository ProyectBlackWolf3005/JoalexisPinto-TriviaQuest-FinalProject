import { Link } from "react-router-dom";

export const Navbar = () => {
    return (
        <nav className="navbar navbar-dark bg-dark">
            <div className="container">

                <Link to="/" className="navbar-brand">
                    TriviaQuest
                </Link>

                <div className="d-flex gap-2">

                    <Link to="/play">
                        <button className="btn btn-warning">
                            Play
                        </button>
                    </Link>

                    <Link to="/login">
                        <button className="btn btn-outline-light">
                            Login
                        </button>
                    </Link>

                </div>

            </div>
        </nav>
    );
};