import { WSClient } from "wsmini";
import { ref } from "vue";

// Récupération des variables d'env et création du serveur websocket
const wsHost = import.meta.env.VITE_WS_HOST ?? "localhost";
const wsPort = import.meta.env.VITE_WS_PORT ?? "8080";
const wsProtocol = import.meta.env.VITE_WS_PROTOCOL ?? "wss";

export const ws = new WSClient(`${wsProtocol}://${wsHost}:${wsPort}`);

// Refs vue pour l'affichage
export const users_count = ref(null);

// Initialisation de la connection websocket
export async function connect() {
  try {
    await ws.connect();

    await ws.sub(import.meta.env.VITE_WS_CHANNEL_NAME, (count) => {
      users_count.value = count;
    });

    return true;
  } catch (err) {
    console.error("Connection failed:", err);
    return false;
  }
}