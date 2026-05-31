# TriviaQuest

Aplicación web de trivias desarrollada como proyecto final del bootcamp Full Stack a tu propio Ritmo de 4Geeks Academy.

TriviaQuest permite a los usuarios registrarse, iniciar sesión, jugar partidas de trivia, guardar resultados, consultar su historial de partidas, gestionar su perfil y crear sus propias preguntas personalizadas para generar experiencias de juego únicas.

## Demo en producción

**Deploy:**

https://triviaquest-finalproject.onrender.com/

**GitHub Project:**

https://github.com/users/ProyectBlackWolf3005/projects/2

**Repositorio:**

https://github.com/ProyectBlackWolf3005/JoalexisPinto-TriviaQuest-FinalProject

---

## Funcionalidades principales

### Sistema de usuarios

* Registro de usuarios.
* Inicio de sesión mediante JWT.
* Protección de rutas privadas.
* Gestión de perfil.
* Cambio de contraseña.

### Sistema de trivias

#### Categorías locales

* Cultura general.
* Ciencia.
* Historia.
* Entretenimiento.

#### Trivia Online

* Integración con Open Trivia Database (OpenTDB).
* Preguntas dinámicas obtenidas desde una API externa.

### Sistema de juego

* Selección de categoría.
* Preguntas aleatorias.
* Comodín 50/50.
* Opción para saltar una pregunta.
* Registro automático de resultados.
* Historial de partidas.

### Resultados y estadísticas

* Historial de partidas.
* Mejor puntuación obtenida.
* Última categoría jugada.
* Eliminación completa del historial.

### Preguntas personalizadas

* Crear preguntas propias.
* Consultar preguntas creadas.
* Editar preguntas existentes.
* Eliminar preguntas.
* Jugar utilizando preguntas creadas por el usuario.

Esta funcionalidad implementa un CRUD completo para la gestión de preguntas personalizadas.

---

## Tecnologías utilizadas

### Frontend

* React
* React Router
* Context API
* Bootstrap 5
* Vite

### Backend

* Flask
* SQLAlchemy
* Flask-Migrate
* Flask-JWT-Extended
* PostgreSQL

### APIs externas

* Open Trivia Database (OpenTDB)

### Despliegue

* Render

---

## Instalación local

Clona el repositorio:

```bash
git clone https://github.com/ProyectBlackWolf3005/JoalexisPinto-TriviaQuest-FinalProject.git
```

Instala las dependencias del frontend:

```bash
npm install
```

Instala las dependencias del backend:

```bash
pipenv install
```

Ejecuta el frontend:

```bash
npm run dev
```

Ejecuta el backend:

```bash
pipenv run start
```

---

## Estructura general

```text
Frontend (React)
│
├── Home
├── Login
├── Registro
├── Dashboard
├── Jugar Trivia
├── Resultados
├── Perfil
└── Mis Preguntas

Backend (Flask)
│
├── Autenticación JWT
├── Usuarios
├── Resultados
└── Preguntas personalizadas
```

---

## Mejoras futuras

El proyecto fue desarrollado dentro del tiempo disponible del bootcamp, por lo que existen funcionalidades planificadas para futuras versiones:

* Sistema de niveles de dificultad.
* Temporizador por pregunta.
* Ranking global de jugadores.
* Más categorías de preguntas.
* Sistema de logros y recompensas.
* Estadísticas avanzadas.
* Mejoras visuales y animaciones.

---

## Notas del desarrollo

Este proyecto fue desarrollado utilizando el boilerplate oficial de Flask + React proporcionado por 4Geeks Academy como base de trabajo.

Por este motivo, el repositorio conserva algunos archivos de configuración, documentación base o recursos del template original para mantener compatibilidad con el entorno de desarrollo y despliegue.

Todas las funcionalidades principales de TriviaQuest fueron diseñadas, desarrolladas e integradas sobre dicha estructura base.

---

## Autor

Joalexis Pinto