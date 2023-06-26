<script setup>
import { useUsersStore } from "../store/users";

const useUsers = useUsersStore();
</script>

<template>
  <div class="users-page pt-14">
    <h1 class="title font-bold text-3xl">Пользователи</h1>
    <div class="search mt-4">
      <input
        type="text"
        class="outline-none bg-white rounded border px-4 py-2"
        placeholder="Search..."
        v-model="useUsers.searchTerm"
      />
    </div>
    <div class="relative overflow-x-auto mt-4">
      <table
        class="w-full text-sm text-left rounded shadow-sm border font-main"
      >
        <thead class="text-xs uppercase bg-white border-b">
          <tr>
            <th scope="col" class="px-6 py-3">Username</th>
            <th scope="col" class="px-6 py-3">Email</th>
            <th scope="col" class="px-6 py-3">ID</th>
            <th @click="useUsers.toggleActive()" scope="col" class="px-6 py-3 cursor-pointer">
              Status
              <svg
                fill="#000000"
                height="15px"
                width="15px"
                version="1.1"
                id="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 490 490"
                xml:space="preserve"
                class="ml-2 inline"
              >
                <g>
                  <polygon
                    points="85.877,154.014 85.877,428.309 131.706,428.309 131.706,154.014 180.497,221.213 217.584,194.27 108.792,44.46 
		0,194.27 37.087,221.213 	"
                  />
                  <polygon
                    points="404.13,335.988 404.13,61.691 358.301,61.691 358.301,335.99 309.503,268.787 272.416,295.73 381.216,445.54 
		490,295.715 452.913,268.802 	"
                  />
                </g>
              </svg>
            </th>
            <th scope="col" class="px-6 py-3">
              Blocked {{ `(${useUsers.numberOfBlocked})` }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(user, index) in useUsers.suggestedOnes"
            :key="index"
            class="bg-white border-b"
          >
            <th
              scope="row"
              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap underline"
            >
              <router-link :to="`/users/${user.id}`">
                {{ user.username }}
              </router-link>
            </th>
            <td class="px-6 py-4">{{ user.email }}</td>
            <td class="px-6 py-4">{{ user.id }}</td>
            <td class="px-6 py-4">{{ user.status }}</td>
            <td class="px-6 py-4">{{ user.blocked ? "Yes" : "No" }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
