<script setup></script>

<template>
  <div class="home-page pt-14">
    <h1 class="title font-bold text-3xl">Главная страница</h1>
    <div class="cards my-3">
      <div class="top-card mb-3">
        <div
          class="card bg-white shadow-sm rounded p-4 cursor-pointer transition hover:bg-slate-50"
        >
          <h1 class="title text-xl font-semibold">
            Пользователи <span class="text-blue-500">24</span>
          </h1>
          <div class="mt-2">
            <h3 class="subtitle">
              Активно: <span class="text-blue-500">13</span>
            </h3>
            <h3 class="subtitle">
              Запрещено: <span class="text-blue-500">5</span>
            </h3>
          </div>
        </div>
      </div>
      <div class="bottom-cards">
        <div
          class="card bg-white shadow-sm rounded p-4 cursor-pointer transition hover:bg-slate-50"
        >
          <h1 class="title text-xl font-semibold">
            Жалобы <span class="text-blue-500">24</span>
          </h1>
        </div>
        <div
          class="card bg-white shadow-sm rounded p-4 cursor-pointer transition hover:bg-slate-50"
        >
          <h1 class="title text-xl font-semibold">
            Чаты <span class="text-blue-500">24</span>
          </h1>
        </div>
        <div
          class="card bg-white shadow-sm rounded p-4 cursor-pointer transition hover:bg-slate-50 text-xl font-semibold text-red-400"
        >
          Выйти
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bottom-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.card {
  width: 100%;
}
</style>
