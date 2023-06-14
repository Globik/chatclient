<script setup>
import { onMounted } from "vue";
import { useVkLogin } from "../composables/useVkLogin";

const { getUserData } = useVkLogin();

onMounted(async () => {
  await getUserData();
});
</script>

<template>
<div class="loading-page h-screen flex flex-col items-center justify-center">
    <div v-if="searchPartner.loading">
      <h1
        class="title text-xl font-bold flex flex-col items-center justify-center"
      >
        Загрузка...
      </h1>
      <p class="description">Ваша информация обрабатывается...</p>
    </div>
    <div v-else>Завершенный!</div>
  </div>
</template>
