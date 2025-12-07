import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";

const theme = localStorage.getItem("theme");

if (!theme) {
  theme = localStorage.setItem("theme", "dark");
  document.querySelector("body").classList.add("dark");
} else {
  if (theme == "light") {
    document.querySelector("body").classList.remove("dark");
  } else if (theme == "dark") {
    document.querySelector("body").classList.add("dark");
  }
}

createApp(App).use(router).mount("#app");
