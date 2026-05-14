import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // No usar COEP/COOP aquí: en dev pueden bloquear chunks o recursos y dejar la app en pantalla en blanco.
});
