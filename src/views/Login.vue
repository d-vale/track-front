<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const email = ref("jpinard@bluewin.ch");
const password = ref("password123");

const handleLogin = async () => {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email.value,
      password: password.value,
    }),
  };

  const res = await fetch("/api/auth/login", options);
  const data = await res.json();

  if (data.success) {
    localStorage.setItem("token", data.token);
    router.push("/tracking");
  } else {
    console.log(data);
    console.error(`ERROR : ${data.error.code} - MESSAGE : ${data.error.message} `);
  }
};
</script>

<template>
  <div class="flex flex-col items-center gap-8 min-h-screen justify-center">
    <h1 class="text-5xl font-normal leading-tight">Track frontend</h1>
    <form
      @submit.prevent="handleLogin()"
      class="flex flex-col gap-4 w-full max-w-sm"
    >
      <input
        type="email"
        v-model="email"
        placeholder="Email"
        class="px-4 py-2 rounded-lg border border-gray-600 bg-transparent focus:outline-none focus:border-indigo-500"
      />
      <input
        type="password"
        v-model="password"
        placeholder="Password"
        class="px-4 py-2 rounded-lg border border-gray-600 bg-transparent focus:outline-none focus:border-indigo-500"
      />
      <button
        type="submit"
        class="rounded-lg border border-transparent px-5 py-2.5 text-base font-medium bg-[#1a1a1a] cursor-pointer transition-colors hover:border-[#646cff]"
      >
        Login
      </button>
    </form>
  </div>
</template>

<style scoped></style>
