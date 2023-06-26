<script setup>
import { onMounted } from "vue";
import axios from "axios";
import { useSearchPartner } from "./stores/searchPartner";
import Cookies from "js-cookie";
import countries from "./storage/countries.json";
import TheNavbar from './components/TheNavbar.vue';

const searchPartner = useSearchPartner();

onMounted(async () => {
  if (Cookies.get("country")) {
    return;
  } else {
    try {
      await searchPartner.setLoading(true);
      const res = await axios.get(
        "https://api.ipgeolocation.io/ipgeo?apiKey=1c9dee18518d4b55becc6cee7bf6ccf8"
      );
      const data = await res.data;

      searchPartner.setCountry(data.country_code2);
      searchPartner.getCountryIndexAndSet(data.country_code2);
      await searchPartner.setLoading(false);
    } catch (error) {
      await searchPartner.setLoading(false);
    }
  }
});
</script>
<!--

<template>
  <div class="min-h-screen app bg-sky-100">
    <routerView />
  </div>
 </template>
-->



<template>
  <div class="min-h-screen app bg-sky-100" lass="wrapper w-full bg-sky-100 font-main min-h-screen container mx-auto sm:px-4 px-2 pt-8">
    <TheNavbar />
    <transition name="fade" mode="out-in">
      <RouterView />
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
