import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from "./router";
import {createPinia} from "pinia";

// =========================================================================
// GLOBÁLNÍ INTERCEPTOR PRO FETCH (Automatické odhlášení při vypršení tokenu)
// =========================================================================
const { fetch: originalFetch } = window;

window.fetch = async (...args) => {
    const response = await originalFetch(...args);

    // Pokud jakýkoliv dotaz v aplikaci narazí na vypršelý/neplatný token (401 Unauthorized)
    if (response.status === 401) {
        console.warn("[Auth] Session expired! Logging out user automatically...");

        // 1. Smažeme neplatný token z localStorage
        localStorage.removeItem("auth_token");

        // 2. Vyhodíme jasný alert pro uživatele
        alert("Your session has expired. Please log in again.");

        // 3. Okamžitě uživatele přesměrujeme na přihlašovací stránku
        router.push({ name: 'login' });
    }

    return response;
};
// =========================================================================

// Inicializace Vue aplikace
createApp(App)
    .use(createPinia())
    .use(router)
    .mount('#app')
