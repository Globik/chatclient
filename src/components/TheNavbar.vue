<script setup></script>

<template>
  <nav
    class="navbar-component container bg-white rounded-full shadow-sm p-2 overflow-x-auto w-full"
  >
    <ul class="links flex items-center justify-around font-semibold space-x-2">
      <li class="link">
        <router-link
          class="transition hover:bg-slate-100 px-6 py-1 rounded-full"
          to="/"
          >Главный</router-link
        >
      </li>
      <li class="link">
        <router-link
          class="transition hover:bg-slate-100 px-6 py-1 rounded-full"
          to="/users"
          >Пользователи</router-link
        >
      </li>
      <li class="link">
        <router-link
          class="transition hover:bg-slate-100 px-6 py-1 rounded-full"
          to="/reports"
          >Жалобы</router-link
        >
      </li>
      <li class="link">
        <router-link
          class="transition hover:bg-slate-100 px-6 py-1 rounded-full"
          to="/chats"
          >Чаты</router-link
        >
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.router-link-active,
.router-link-exact-active {
  background: #3b82f6;
  color: #fff;
}

.router-link-active,
.router-link-exact-active:hover {
  background: #3b82f6;
  color: #fff;
}
</style>
