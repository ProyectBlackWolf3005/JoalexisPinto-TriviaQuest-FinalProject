"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import request, jsonify, Blueprint
from api.models import db, User, GameResult
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint("api", __name__)

CORS(api)


@api.route("/hello", methods=["GET"])
def handle_hello():
    return jsonify({
        "message": "TriviaQuest backend is running correctly."
    }), 200


@api.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email y contraseña son obligatorios."}), 400

    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({"error": "Este email ya está registrado."}), 400

    new_user = User(
        email=email,
        password=generate_password_hash(password),
        is_active=True
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "Usuario registrado correctamente.",
        "user": new_user.serialize()
    }), 201


@api.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email y contraseña son obligatorios."}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Credenciales inválidas."}), 401

    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        "message": "Inicio de sesión correcto.",
        "token": access_token,
        "user": user.serialize()
    }), 200


@api.route("/private", methods=["GET"])
@jwt_required()
def private():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"error": "Usuario no encontrado."}), 404

    return jsonify({
        "message": "Ruta privada funcionando correctamente.",
        "user": user.serialize()
    }), 200


@api.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"error": "Usuario no encontrado."}), 404

    return jsonify({
        "user": user.serialize()
    }), 200


@api.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    data = request.get_json()

    if not user:
        return jsonify({"error": "Usuario no encontrado."}), 404

    username = data.get("username")
    user.username = username.strip() if username else None

    db.session.commit()

    return jsonify({
        "message": "Perfil actualizado correctamente.",
        "user": user.serialize()
    }), 200


@api.route("/change-password", methods=["PUT"])
@jwt_required()
def change_password():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    data = request.get_json()

    current_password = data.get("current_password")
    new_password = data.get("new_password")

    if not user:
        return jsonify({"error": "Usuario no encontrado."}), 404

    if not current_password or not new_password:
        return jsonify({
            "error": "Debes ingresar la contraseña actual y la nueva contraseña."
        }), 400

    if not check_password_hash(user.password, current_password):
        return jsonify({"error": "La contraseña actual no es correcta."}), 401

    user.password = generate_password_hash(new_password)
    db.session.commit()

    return jsonify({
        "message": "Contraseña actualizada correctamente."
    }), 200


@api.route("/game-results", methods=["GET"])
@jwt_required()
def get_game_results():
    current_user_id = get_jwt_identity()

    results = GameResult.query.filter_by(
        user_id=current_user_id
    ).order_by(
        GameResult.created_at.desc()
    ).all()

    return jsonify({
        "results": [result.serialize() for result in results]
    }), 200


@api.route("/game-results", methods=["POST"])
@jwt_required()
def create_game_result():
    current_user_id = get_jwt_identity()
    data = request.get_json()

    score = data.get("score")
    total_questions = data.get("total_questions")
    category = data.get("category")

    if score is None or total_questions is None or not category:
        return jsonify({
            "error": "Puntaje, total de preguntas y categoría son obligatorios."
        }), 400

    new_result = GameResult(
        score=score,
        total_questions=total_questions,
        category=category,
        user_id=current_user_id
    )

    db.session.add(new_result)
    db.session.commit()

    return jsonify({
        "message": "Resultado guardado correctamente.",
        "result": new_result.serialize()
    }), 201


@api.route("/game-results", methods=["DELETE"])
@jwt_required()
def delete_game_results():
    current_user_id = get_jwt_identity()

    GameResult.query.filter_by(
        user_id=current_user_id
    ).delete()

    db.session.commit()

    return jsonify({
        "message": "Historial eliminado correctamente."
    }), 200