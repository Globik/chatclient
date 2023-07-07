<script setup>
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/vue/24/solid";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { useSearchPartner } from "../stores/searchPartner";
import countries from "../storage/countries.json";
import { ref } from "vue";
import { computed } from "@vue/reactivity";
import { onMounted, onUnmounted, onBeforeUnmount } from "vue";

const searchPartner = useSearchPartner();
const term = ref("");
var checkedLands;
//alert(localStorage.getItem("countries"))
//localStorage.clear();
if(localStorage.getItem("countries") !=null){

checkedLands  = ref(JSON.parse(localStorage.getItem("countries")).countries);
}else{
	checkedLands = ref(["all"]);
}
//const light = ref("on");
//alert(searchPartner.gender)
var picked, picked2 ;
if(localStorage.getItem("yourgender") !=null){
	picked = ref(localStorage.getItem("yourgender"));
}else{
	picked = ref(searchPartner.gender);
}
if(localStorage.getItem("suechgender") !=null){
	picked2 = ref(localStorage.getItem("suechgender"));
}else{
picked2 = ref("female");
}

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

searchPartner.setCountries(checkedLands.value);
  searchPartner.toggleCountrySearch(false);
}

function checkLand(){

	
	let l = checkedLands.value.some(function(el,i){

	return	el == "all";
	})

	if(l){
		checkedLands.value.splice(0, 1)
	}
	
	if(checkedLands.value.length == 0) checkedLands.value = ["all"];
	searchPartner.setCountries(checkedLands.value);
	}

const allLand = ()=>{

	checkedLands.value = ["all"];
	searchPartner.setCountries(checkedLands.value);

};

const setGender = ()=>{
	searchPartner.setGender(picked.value);
}
const setSuechGender = ()=>{
	searchPartner.setSuechGender(picked2.value);
}
</script>

<template>
 <!-- <transition name="fade" mode="out-in"> -->
  
    <div id="landWrapper"
      v-if="searchPartner.showCountrySearch"
      class="search-countries fixed flex justify-center inset-0 w-full h-screen bg-black bg-opacity-60"
    >
    
      <form id="pform" @submit.prevent clss="mt-14 px-2">
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
        <section class="foo">
        <div id="krestikCont"> 
       <button
        id="krestik"
          @click="setCountries()"
          cass="fixed right-6 top-60"
        >
          <XMarkIcon lass="w-8 h-8 ml-3 text-black"></XMarkIcon>
        </button> 
        <section id="genderCheck">
        <b style="padding-left:20px;">Вы кто?</b>
        <div class="gender">
        <label><span>Мужчина</span><input type="radio" name="gender" value="male" v-model="picked" @change="setGender()"></label>
        <label><span>Женщина</span><input type="radio" name="gender" value="female" v-model="picked" @change="setGender()"></label>
        </div>
        <b style="padding-left:20px;">Кого вы ищите?</b>
        <div class="gender">
        <label><span>Мужчину</span><input type="radio" name="gender1" value="male" v-model="picked2" @change="setSuechGender()"></label>
        <label><span>Женщину</span><input type="radio" name="gender1" value="female" v-model="picked2" @change="setSuechGender()"></label>
        </div>
        </section>
        <hr>
        <p class="lands-p"  style="padding-left:20px;padding-right:20px;padding-top:10px;"><b>Вы можете выбрать страны для поиска.</b></p>
        
         
         <div class="lands-c">
         <span>Выбранные страны: {{ checkedLands.length }}</span>
        <div  class="one-c py-2 bg-gray-100 rounded transition hover:bg-gray-200">
         <label>
         <span style="padding-left:10px;" class="land-span">Все страны</span>
         </label>
        <!-- </div> -->
        
        
        <!-- <div class="two-c"> -->
         <input 
          id="allLandCheck"
         type="checkbox" 
        v-model="checkedLands" 
         value="all" 
        
         @change="allLand();">
        </div> 
        </div>
         </div></section>
        <section id="Land">
        
         <div id="lll">
         <section class="lSec py-2 bg-gray-100 rounded transition hover:bg-gray-200"
         v-for="(country, index) in suggestedOnes"
              :key="index-2"
                
         >
        <label
        class="label font-semibold"
              
                v-if="
                  country.name !== 'name' &&
                  country.name !== 'Абхазия' &&
                  country.name !== 'Южная Осетия' "
                
                :for="country.alpha1"
              >
               <img class="img-land"
               style="padding-left:10px;"
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
               style="padding-left:10px;"
               v-if="
                  country.name !== 'name' &&
                  country.name !== 'Абхазия' &&
                  country.name !== 'Южная Осетия' 
                "
              >{{ country.name }}</span>
              </label>
        <input 
        class="input"
         v-if="
                  country.name !== 'name' &&
                  country.name !== 'Абхазия' &&
                  country.name !== 'Южная Осетия' 
                "
        type="checkbox" 
        
        v-model="checkedLands" 
        :value="country.alpha1"
       :id="country.alpha1"
        @change="checkLand();"
        
        >
         
         </section>
         </div>
       <!--  <div id="emptyLand" v-else><p class="lands-p">Вы можете выбрать конкретные страны, сняв галочку</p></div> -->
        </section>
        <button
        id="krestik2"
          @click="setCountries()"
          class="fixed right-6 top-6"
        >
          <XMarkIcon class="w-8 h-8 ml-3 text-white krestikSuka"></XMarkIcon>
        </button>
      </form>
      
    </div>
 <!-- </transition> -->
</template>




<!--  -->
<style scoped>

#landWrapper, #pform{

}
#genderCheck{
border-radius:10px;
padding-top:10px;
padding-bottom:10px;	
background:rgb(250,240,190);
display:block;
position:relative;
z-idex:9999;
}
.gender{
	display:grid;
	grid-template-columns: 1fr 1fr;
	border-radius:10px;
	
	
}
.gender label{
	display:flex;
	align-items:center;
	
    jutify-content:center;
  
    width:100%;
    
}
.gender span{
margin-left:20px;
	flex:auto;
}
.gender input{
display:inline;
width:120px;
justify-self:start;
	mrgin-left:1.1em;
}
section.foo{
	background:white;
	border-radius:10px;

}
#krestikCont{
	position:relative;
	pdding-left:25px;
	pdding-right:20px;
	mrgin:5px;
}

.countries {
  overflow-y: scroll;
  min-width: 360px;
  ma-height: auto;
  hight:100%;
  background: white;
  display: flex;
  flex-direction: column;
  
}

p {
  overflow:hidden;

 
}

.countries::-webkit-scrollbar {
  width: 0;
}

#pform{
border-radius:10px;
bckground:white;
height:vh;
margin-top:10vh;
overflow-x:auto;
z-inex:10;
display:block;
position:relative;
}
#Land{
overflow-y: scroll;
	min-width: 100%;
  max-height: 500px;
 border-bottom-left-radius:10px;
 border-bottom-right-radius:10px;
  background: white;
  display:block;
  position:relative;
  z-index:1000;
  padding-right:20px;
  padding-left:20px;
}
.lSec:first-of-type, .lSec:nth-of-type(2){
	display:none;
}

section.lSec{
	display:grid;
	grid-template-columns: auto 50px;
	margin-top:3px;
	margin-bottom:3px;
}
section.lSec .label{
align-self:center;
	display:flex;

	align-items:center;
}
.land-span{
	mrgin-left:10px;
}
.img-land{

disolay:inline-block;
	width:40px;
}
#Land div, #emptyLand{width:100%;}
#Land::-webkit-scrollbar {
width: 0;	
}
.input[type=checkbox]{

	width:30px;
	height:30px;

	align-self:center;
	justify-self:center;
}
.lands-p{
	background:white;
	color:black;
	padding:0px;
}
#krestik{
	z-index:999;
	display:inline-block;
	border-radius:50%;
	position:absolute;
	color:gray;
	ackground:red;
	top:4px;
	right:10px;
	width:40px;
	height:40px;
	loat:right;
}
#krestik img{
	width:30px;
	height:30px;
	display:inline-block;
	
}


div.lands-c{
	display:grid;
	background:white;
	align-self:center;
	grid-template-columns: 200px auto;
	padding-left:20px;
	padding-right:20px;
	margin-top:15px;
}
.one-c{
	align-self:center;
	display:grid;
	grid-template-columns: auto 35px;
}
div.lands-c span{
	align-self:center;
	justify-self:start;
	
}
div.lands-c label{

	align-self: center;
	margin-bottom:0;
	width:100%;
	flex:auto;
	
}

div.one-c input{
	align-self:center;
transform:translateX(-5px);
	margin:0;
	adding-left:40px;
	width:30px;
	height:30px;
	
}


@media screen and (max-width: 501px) and (orientation: portrait){
.krestikSuka{
		color:rgb(250,240,190);
		display:none;
	}
	
.input[type=checkbox]{
	
	width:30px;
	height:30px;
}
#pform{
	margin-top:0;
		height:auto;
	}
	#Land{
	max-height:50%;
	
	}
}
@media screen and (max-height: 547px) and (orientation: landscape){
.krestikSuka{
		color:rgb(250,240,190);
		display:none;
	}
	#pform{
	
		height:60%;
		margin-top:0;
	}
	#Land{
	max-height:75%;
	
	}
	}
	/* 285 x 567 */
	@media screen and (max-height: 286px) and (orientation: landscape){
	.krestikSuka{
		color:rgb(250,240,190);
		display:none;
	
	}
	div.one-c{
		ackground:red;
	}
	#pform{
		height:100%;
	}
	}
	
	/* ideal for 320x442 */
	@media screen and (max-width: 384px) and (orientation: portrait){
	.krestikSuka{
		color:rgb(250,240,190);
		display:none;
	}
	#pform{
		/*-webkit-text-size-adjust:none;
		text-size-adjust:none;*/
		font-size:3vw;
	}
	#genderCheck{
		
		max-height: 100px;
		overflow:auto;
	}
	.gender{
		display:block;
		margin-top:2vw;
		margin-bottom:1vw;
	}
	.gender label{
		margin-top:4vw;
		margin-bottom:4vw;
	}
		div.one-c{
		ackground:green;
	}
	div.lands-c{
		display:block;
	}
	}
</style>
