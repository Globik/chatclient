import { defineStore } from "pinia";
import { ref, reactive, computed } from "vue";
import usersJson from "../storage/users.json";

export const useUsersStore = defineStore("users-store", () => {
  const users = reactive(usersJson);
  const searchTerm = ref("");
  const activeFirst = ref(true);

  const suggestedOnes = computed(() => {
    const filteredOnes = users.filter((user) => {
      return (
        user.username
          .toLowerCase()
          .includes(searchTerm.value.toLowerCase().trim()) ||
        user.email
          .toLowerCase()
          .includes(searchTerm.value.toLowerCase().trim()) ||
        user.id.toLowerCase().includes(searchTerm.value.toLowerCase().trim())
      );
    });

    if (activeFirst.value) {
      return filteredOnes.sort((a, b) => {
        if (a.status < b.status) {
          return -1;
        }

        if (a.status > b.status) {
          return 1;
        }
      });
    } else if (!activeFirst.value) {
      return filteredOnes.sort((a, b) => {
        if (a.status < b.status) {
          return 1;
        }

        if (a.status > b.status) {
          return -1;
        }
      });
    } else {
      return filteredOnes;
    }
  });

  const numberOfBlocked = computed(() => {
    const blockedUsers = suggestedOnes.value.filter((u) => {
      return u.blocked === true;
    });

    return blockedUsers.length;
  });

  const getUserById = (id) => {
    return users.find((u) => u.id === id);
  };

  const toggleActive = () => {
    activeFirst.value = !activeFirst.value;
  };

  return {
    users,
    suggestedOnes,
    activeFirst,
    searchTerm,
    numberOfBlocked,
    toggleActive,
    getUserById,
  };
});
