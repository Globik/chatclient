<script setup>
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/vue/24/solid";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { useSearchPartner } from "../stores/searchPartner";
import countries from "../storage/countries.json";
import { ref } from "vue";
import { computed } from "@vue/reactivity";

const searchPartner = useSearchPartner();
const term = ref("");
const checkedLands = ref([]);
const light = ref("off");
const allL = ref("");
var all = ref("all");
var off =ref("off");

const suggestedOnes = computed(() => {
  return countries.filter((country) => {
    return (
      country.name.toLowerCase().indexOf(term.value.toLowerCase()) > -1 ||
      country.fullname.toLowerCase().indexOf(term.value.toLowerCase()) > -1 ||
      country.english.toLowerCase().indexOf(term.value.toLowerCase()) > -1
    );
  });
});

const setCountry = (code) => {
  searchPartner.setCountry(code);
  searchPartner.toggleCountrySearch(false);
};
const setCountries = ()=>{
//alert(checked)
if(checkedLands.value.length == 0){
	checkedLands.value = ["all"];
}
searchPartner.setCountries(checkedLands.value);
  searchPartner.toggleCountrySearch(false);
}
function checki(){
	if(checkedLands.value[0]=="all"){
		checkedLands.value=[];
	}
	//checkedLands.value=checkedLands.value;
}
function checkLand(){

	if(checkedLands.value.length >= 5){
	searchPartner.toggleCountrySearch(false);
		return;
	}
	
}
const allLand = ()=>{
lll.innerHTML="";
checkedLands.value = ["all"];
if(light.value=="off"){
	checkedLands.value = [];
}
};
</script>

<template>
  <transition name="fade" mode="out-in">
  
    <div id="landWrapper"
      v-if="searchPartner.showCountrySearch"
      class="search-countries fixed flex justify-center inset-0 w-full h-screen bg-black bg-opacity-60"
    >
    
      <form id="pform" @submit.prevent class="mt-14 px-2">
      <!--
        <div class="search-bar flex items-center">
          <div class="bg-white p-2 w-full rounded-t flex items-center">
            <MagnifyingGlassIcon class="w-5 h-5 text-gray-700" />
            <input
              v-model="term"
              class="bg-transparent outline-none ml-3 w-full"
              type="text"
              placeholder="Введите название вашей страны"
            />
          </div>
        </div>
        <div v-if="term" class="suggestions border-t w-full rounded-b">
          <ul class="countries w-full px-2">
            <li
              v-for="(country, index) in suggestedOnes"
              :key="index"
              class="country min-w-auto"
            >
              <button
                @click="setCountry(country.alpha1)"
                v-if="
                  country.name !== 'name' &&
                  country.name !== 'Абхазия' &&
                  country.name !== 'Южная Осетия' 
                "
                class="flex items-center justify-center font-semibold w-full p-2 my-2 bg-gray-100 rounded transition hover:bg-gray-200"
              >
                <img
                  :src="`https://flagcdn.com/w40/${country.alpha1.toLowerCase()}.webp`"
                  :alt="country.name"
                />
                <p>
                  {{ country.name }}
                </p>
              </button>
            </li>
          </ul>
        </div>
        
        -->
        <div id="krestikCont"> 
        <button
        id="krestik"
          @click="setCountries()"
          cass="fixed right-6 top-60"
        >
          <XMarkIcon lass="w-8 h-8 ml-3 text-black"></XMarkIcon>
        </button>
        <p class="lands-p">Вы можете выбрать до пяти стран или все страны для поиска: </p>
        <p class="lands-p">Выбранные страны: {{ checkedLands.length }} {{ light=="all"?"Все страны":"" }}</p>
        
         
         <div class="lands-c">
         
       <!--  <div class="one-c"> -->
         <label>
         <span class="land-span">Все страны</span>
         </label>
        <!-- </div> -->
        
        
        <!-- <div class="two-c"> -->
         <input 
         id="allInput" 
         type="checkbox" 
        :true-value="all"
        :false-value="off"
         value="all" 
         v-model="light"
         :checked=false
         @change="allLand();">
        <!-- </div> -->
        </div>
         </div>
        <section id="Land">
        
         <div id="lll" v-if="light==='off'">
         <section class="lSec"
         v-for="(country, index) in suggestedOnes"
              :key="index"
         >
        <label
        cass="label"
        class="flex items-center justify-start font-semibold w-full p-2 my-2 bg-gray-100 rounded transition hover:bg-gray-200"
          
                v-if="
                  country.name !== 'name' &&
                  country.name !== 'Абхазия' &&
                  country.name !== 'Южная Осетия' 
                "
              >
               <img class="img-land"
                  v-if="
                  country.name !== 'name' &&
                  country.name !== 'Абхазия' &&
                  country.name !== 'Южная Осетия' 
                "
                  :src="`https://flagcdn.com/w40/${country.alpha1.toLowerCase()}.webp`"
                  :alt="country.name"
                  :title="country.english"
                />
              <span class="land-span"
               v-if="
                  country.name !== 'name' &&
                  country.name !== 'Абхазия' &&
                  country.name !== 'Южная Осетия' 
                "
              >{{ country.name }}</span>
        <input 
        class=""
         v-if="
                  country.name !== 'name' &&
                  country.name !== 'Абхазия' &&
                  country.name !== 'Южная Осетия' 
                "
        type="checkbox" 
        v-model="checkedLands" 
        :value="country.alpha1"
       
        @change="checkLand();"
        
        >
         </label>
         </section>
         </div>
         <div id="emptyLand" v-else><p class="lands-p">Вы можете выбрать конкретные страны, сняв галочку</p></div>
        </section>
        <button
        id="krestik2"
          @click="setCountries()"
          class="fixed right-6 top-6"
        >
          <XMarkIcon class="w-8 h-8 ml-3 text-white"></XMarkIcon>
        </button>
      </form>
    </div>
  </transition>
</template>




<!--  -->
<style scoped>
#landWrapper, #pform{
	adding:10px;
	margin:10px;

}
#krestikCont{
	position:relative;
}
.countries {
  overflow-y: scroll;
  min-width: 360px;
  max-height: 500px;
  background: white;
  display: flex;
  flex-direction: column;
  
}

p {
  overflow: hidden;
  border:1px solid red;
  idth: 20ic;
}

.countries::-webkit-scrollbar {
  width: 0;
}
#Land{


	overflow-y: scroll;
	min-width: 100%;
  max-height: 500px;
  background: white;
  display: flex;
  flex-direction: column;
}
.land-span{
	margin-left:10px;
}
.label{
	width:50%;
	display:inline-block;
}
.img-land{
	width:40px;
}
#Land div, #emptyLand{width:100%;}
#Land::-webkit-scrollbar {
width: 0;	
}
input[type=checkbox]{
	
	width:30px;
	height:30px;
	margin-left: 40px;
}
.lands-p{
	background:white;
	color:black;
	padding:20px;
}
#krestik{
	z-index:999;
	display:inline-block;
	position:absolute;
	color:green;
	background:red;
	top:2px;
	right:2px;
	width:40px;
	height:40px;
}
#krestik img{
	width:30px;
	height:30px;
	display:inline-block;
	
}

div.lands-c{
	display:grid;
	background:white;
	grid-template-columns: 50% auto;
	padding:0;
	margin:0;
}
div.lands-c label{
	border:1px solid red;
	align-self: center;
	margin-bottom:0;
	width:100%;
}

div.lands-c input{
	align-self:center;
	justify-self:end;
	margin:0;
	padding:0;
}
@media screen and (max-width: 390px) and (orientation: portrait){
	.lands-p{
	ackground:black;
	padding:0.1em;
	}
	#landWrapper, #pform{
	padding:3px;
}
input[type=checkbox]{
	borer:1px solid red;
	wih:60px;
}
}
@media screen and (max-height: 547px) and (orientation: landscape){
	.lands-p{
		ackground: red;
		padding:0.1em;
	}
	#landWrapper, #pform{
	padding:3px;margin-top:0;
}
#krestik{
	z-index:999;
	display:block;
	position:relative;
	color:red;
	background:red;
}
	}
</style>
