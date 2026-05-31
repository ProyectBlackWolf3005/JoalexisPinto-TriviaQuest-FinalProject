from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True)

    email: Mapped[str] = mapped_column(
        String(120),
        unique=True,
        nullable=False
    )

    username: Mapped[str] = mapped_column(
        String(80),
        nullable=True
    )

    password: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean(),
        default=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )

    questions = relationship(
        "CustomQuestion",
        back_populates="user"
    )

    results = relationship(
        "GameResult",
        back_populates="user"
    )

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "username": self.username
        }


class CustomQuestion(db.Model):
    __tablename__ = "custom_question"

    id: Mapped[int] = mapped_column(primary_key=True)

    question: Mapped[str] = mapped_column(
        String(500),
        nullable=False
    )

    correct_answer: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    wrong_answer_1: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    wrong_answer_2: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    wrong_answer_3: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    category: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    difficulty: Mapped[str] = mapped_column(
        String(50),
        nullable=False
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("user.id")
    )

    user = relationship(
        "User",
        back_populates="questions"
    )

    def serialize(self):
        return {
            "id": self.id,
            "question": self.question,
            "category": self.category,
            "difficulty": self.difficulty
        }


class GameResult(db.Model):
    __tablename__ = "game_result"

    id: Mapped[int] = mapped_column(primary_key=True)

    score: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )

    total_questions: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )

    category: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("user.id")
    )

    user = relationship(
        "User",
        back_populates="results"
    )

    def serialize(self):
        return {
            "id": self.id,
            "score": self.score,
            "total_questions": self.total_questions,
            "category": self.category,
            "created_at": self.created_at
        }