// guards/authGuard.js
import { accessStore } from '../store/index.ts';

export async function isAuth(to:any, from:any, next:any) {
    const access = accessStore();
    if (await access.isAuthenticated()) {
        next('/home/dashboard'); // Redirecciona al usuario a la página de inicio si ya está autenticado
    } else {
        next(); // Permite el acceso a la vista de login si el usuario no está autenticado
    }
}
