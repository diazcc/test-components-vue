// main.js o main.ts
import { createApp } from 'vue';
import { createPinia } from 'pinia'; // Importa createPinia desde Pinia
import App from './App.vue';
import router from './router.ts';
import './style.scss';
import 'v-calendar/style.css';
import { setupCalendar } from 'v-calendar';
import { createI18n } from 'vue-i18n';
import lang  from './locales/lang.js';
import { languageStore } from './store/language.ts'; // Importa el store como un export nombrado

const app = createApp(App);

// Initialize pinia
const pinia = createPinia();
app.use(pinia);

const langStore = languageStore();

// Use calendar defaults (optional)
const i18n = createI18n({
    legacy: false,
    messages: lang,
    fallbackFormat: true,
    locale: langStore.getLocale(),
    fallbackWarn: false,
    missingWarn: false, 
    missing: (locale, key) => key
});


app.use(setupCalendar, {})
app.use(router);
app.use(i18n);
app.mount('#app');
