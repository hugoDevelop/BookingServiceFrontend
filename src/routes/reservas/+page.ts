import { authStore } from "$lib/store/authStore";
import { get } from 'svelte/store';
import { redirect } from "@sveltejs/kit";

export async function load() {
  if (typeof window !== "undefined") {
    const { isAuthenticated, accessToken } = get(authStore);
    console.log("isAuthenticated:", isAuthenticated);
    console.log("accessToken:", accessToken);
    if (!isAuthenticated) {
      throw redirect(302, "/login"); // Redirige a la página de inicio de sesión si no está autenticado
    }
  } else {
    console.log("SSR: Skipping authentication check");
  }
}
