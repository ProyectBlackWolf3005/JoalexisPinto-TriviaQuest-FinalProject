export const initialStore = () => {
    return {
        token: localStorage.getItem("token") || null,
        user: null
    };
};

export default function storeReducer(store, action = {}) {
    switch (action.type) {
        case "login":
            // Guarda el token para mantener la sesión al recargar la página.
            localStorage.setItem("token", action.payload.token);

            return {
                ...store,
                token: action.payload.token,
                user: action.payload.user
            };

        case "logout":
            // Elimina el token y limpia la información del usuario.
            localStorage.removeItem("token");

            return {
                ...store,
                token: null,
                user: null
            };

        case "set_user":
            // Actualiza los datos del usuario autenticado.
            return {
                ...store,
                user: action.payload
            };

        default:
            return store;
    }
}