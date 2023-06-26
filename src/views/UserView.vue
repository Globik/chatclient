<script setup>
import { useUsersStore } from "../store/users";
import { useRoute } from "vue-router";

const route = useRoute();
const useUsers = useUsersStore();

const user = useUsers.getUserById(route.params.id);
</script>

<template>
  <div class="user-page pt-14">
    <div class="titles">
      <h1 class="title font-bold text-3xl">{{ user.username }}</h1>
      <p class="desc text-lg">Пользователь</p>
    </div>
    <div class="buttons"></div>
  </div>
</template>
