import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAKLHSQtXdobjVJxFFAde9N9L1ZtBUzQEw",
  authDomain: "portfolio-d0ea2.firebaseapp.com",
  projectId: "portfolio-d0ea2",
  storageBucket: "portfolio-d0ea2.firebasestorage.app",
  messagingSenderId: "450880510310",
  appId: "1:450880510310:web:8882d325b39118085310a7",
};

// 🔥 Inicializa la app solo una vez
const app = initializeApp(firebaseConfig);

// ✅ Exporta las instancias configuradas
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
