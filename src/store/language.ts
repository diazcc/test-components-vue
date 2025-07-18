import { ref } from "vue";
import { defineStore } from "pinia";

export const languageStore = defineStore("language", () => {
	// state varaibles
	const locale: any = ref(localStorage.getItem('locale') || (navigator.language.startsWith('es') ? 'es' : 'en')); // Recuperar de localStorage o establecer por defecto)
	
	/**  
   * Geters
  */ 
  const getLocale = () => locale.value;

	/**
   * Seters
  */
	function setLocale(language: string) {
    locale.value = language
    localStorage.setItem('locale', language);
  };

	return {
		getLocale,
    setLocale,
	};
});