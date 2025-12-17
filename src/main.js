import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { setDefaultBaseUrl } from "./libs/fetchJson";

setDefaultBaseUrl(import.meta.env.VITE_API_BASE_URL);

let theme = localStorage.getItem("theme");

if (!theme) {
  theme = "dark";
  localStorage.setItem("theme", theme);
  document.querySelector("body").classList.add("dark");
} else {
  if (theme == "light") {
    document.querySelector("body").classList.remove("dark");
  } else if (theme == "dark") {
    document.querySelector("body").classList.add("dark");
  }
}

createApp(App).use(router).mount("#app");
