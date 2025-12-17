<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useFetchJson } from "@/composables/useFetchJson";

const router = useRouter();
const email = ref("jpinard@bluewin.ch");
const password = ref("password123");

const { data, error, execute } = useFetchJson({
  url: "/api/auth/login",
  method: "POST",
  immediate: false,
});

const handleLogin = async () => {
  await execute({
    email: email.value,
    password: password.value,
  });

  if (data.value?.success) {
    localStorage.setItem("token", data.value.data.token);
    router.push("/tracking");
  } else if (error.value) {
    console.error(`ERROR : ${error.value.status} - MESSAGE : ${error.value.statusText}`);
  } else if (data.value) {
    console.error(`ERROR : ${data.value.data.error.code} - MESSAGE : ${data.value.data.error.message}`);
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
