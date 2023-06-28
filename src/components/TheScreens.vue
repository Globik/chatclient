<script setup>
import { reactive, onMounted, onUnmounted, onBeforeUnmount } from "vue";
import {
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  FaceSmileIcon,
  ExclamationCircleIcon,
} from "@heroicons/vue/24/solid";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { useToast } from "vue-toastification";


import { ref } from "vue";
import TheCountries from "./TheCountries.vue";
import { useSearchPartner } from "../stores/searchPartner";
import { useChatStore } from "../stores/chat";
import { useUserStore } from "../stores/user";
import { state, findNewRoom, stopRoom, getDevice, toggleCamera } from "../socket";
import TheEmojiPicker from "./TheEmojiPicker.vue";
import Cookies from "js-cookie";
import { socket } from "../socket";

const chatStore = useChatStore();
const searchPartnerStore = useSearchPartner();
const userStore = useUserStore();
const toast = useToast();

const isMute = ref(false);
const volume = ref(23);
const reportVisible = ref(false);
const emojisVisible = ref(false);
const message = ref("");
const localStreamRef = ref(null);
const remoteStreamRef = ref(null);
const camToggleRef = ref(null);

const emits = defineEmits(["toggleReportEvent"]);

const toggleReport = () => {
  reportVisible.value = !reportVisible.value;
  emits("toggleReportEvent", reportVisible.value);
};

const toggleSound = () => {
  if (!isMute.value) {
    volume.value = 0;
    REMOTE.muted = true;
  } else {
    volume.value = 100;
    REMOTE.muted = false;
  }
  isMute.value = !isMute.value;
};
const logout = () => {
	userStore.removeToken();
	window.location.reload();
}
const handleEvent = (e) => {
  message.value += e;
};

const toggleEmojiVisibility = () => {
  emojisVisible.value = !emojisVisible.value;
};
const mama=1;
let nick = "Anonym";//userStore.user.details.details.firstname ? userStore.user.details.details.firstname : "Аноним" ;
const findRoomArgs = reactive({
  gender: searchPartnerStore.gender,
  country: +searchPartnerStore.countryIndex,
  userId: Cookies.get("user") ? JSON.parse(Cookies.get("user")).details.userId : "",
  countries:searchPartnerStore.counta,//JSON.parse(Cookies.get("countries")).c,
  nick: nick,
});
//console.log("screen ", searchPartnerStore.counta)
  const sendMessage = async () => {
  console.log(`Message: `, message.value);
  console.log(`Room: `, chatStore.roomDetails.connected);
  if (!message.value || !chatStore.roomDetails.connected) {
  toast.error("Обождитe партнера-то!")
    return;
  } else {
    const text = message.value;
    const roomId = chatStore.roomDetails.partner;
   // alert('roomId: '+ roomId);
    const name = userStore.user.details.details.firstname;
    const userId = Cookies.get("user")
      ? JSON.parse(Cookies.get("user")).details.userId
      : "";
      let Msgs = document.getElementById("Msgs")
      if(Msgs){
    await chatStore.pushMessage({ name, text, roomId, userId });
    Msgs.scrollTop=Msgs.clientHeight + Msgs.scrollHeight;
    let a = { name, text, userId, roomId };
    //alert(JSON.stringify(a))
    socket.emit("newMessage1", a);
    message.value = "";
    }
  }
};

onMounted(async () => {
  if (Cookies.get("accessToken") && Cookies.get("user")) {
  try{
  fuck.srcObject = null;
  // await chatStore.init();
 // const chatStore = useChatStore();
  //remoteStreamRef.value.srcObject = chatStore.remoteStream;
    //alert("onmounted")
    getDevice();
    }catch(e){
    alert(e)
    }
  } else {
    return;
  }
});
onBeforeUnmount(async ()=>{
	
	stopRoom();
})
</script>
<template>
  <div class="w-full">
  <div id="topPanel"><span class="online-now">Онлайн сейчас: </span><span id="userCount">{{state.counts}}</span> | <button title="Разлогиниться" class="panel-btn" @click="logout()">Выйти</button></div>
    <div class="top-0 grid w-full grid-cols-2 screens">
      <div
        class="max-h-[682px] relative xl:h-[740px] xl:aspect-auto aspect-square screen_first bg-slate-50 rounded-xl mx-1"
      >
        <video
          ref="remoteStreamRef"
          id="REMOTE"
          autoplay
          class="w-full h-full object-cover z-[99999]"
        ></video>
        <ExclamationCircleIcon
          @click="toggleReport"
          class="absolute hidden w-8 h-8 transition-all opacity-50 cursor-pointer report-icon fill-black hover:opacity-100 top-4 right-4"
        ></ExclamationCircleIcon>

        <div
          class="absolute bottom-0 flex w-full p-2 space-x-4 transition opacity-0 bg-[#0000007e] controller hover:opacity-100"
        >
          <!-- should be binded  -->
          <button @click="toggleSound()" class="">
            <SpeakerWaveIcon
              v-if="!isMute"
              class="w-6 h-6 transition fill-gray-400 hover:fill-white mx-2"
            ></SpeakerWaveIcon>
            <SpeakerXMarkIcon
              v-else
              class="w-6 h-6 transition fill-gray-400 hover:fill-white mx-2"
            ></SpeakerXMarkIcon>
          </button>
         <!--  <input
            min="0"
            max="100"
            class="w-full cursor-pointer"
            type="range"
            v-model="volume"
            id="volume-slider"
          /> -->
        </div>
      </div>
      <div
        class="relative max-h-[682px] xl:h-[740px] xl:aspect-auto aspect-square screen_second bg-slate-50 rounded-xl mx-1"
      >
        <video
          autoplay
          muted
          ref="localStreamRef"
          id="fuck"
          class="w-full h-full object-cover z-[99999]"
        ></video>
      </div>
    </div>
    
<!--  functions h-[100% - 682px]    -->
    <div id="underpanel">
      <div 
      id="undervideocontainer" 
    >
        <button
          @click="findNewRoom(findRoomArgs)"
          id="btnStart"
          :disabled="
            state.loading || state.searching || searchPartnerStore.loading
          "
          class="panel-btn"
          
        >
          {{ state.inRoom ? "Далее" : "Старт" }}
        </button>
        <button
        id="btnStop"
        @click="stopRoom()"
        :disabled="
            !state.inRoom && !state.searching
            "
            class="panel-btn"
         
        >
          Стоп
        </button>
        <button
        class="panel-btn"
        @click="searchPartnerStore.toggleCountrySearch(true)"
        >Поиск</button>
        <!--
        <button
          :disabled="state.inRoom || searchPartnerStore.loading || state.loading"
          @click="searchPartnerStore.toggleCountrySearch(true)"
          class="panel-btn"
          
        >
          <p v-if="searchPartnerStore.loading || state.loading">Загрузка...</p>
          <p v-else class="flex items-center">
            Cтрана:
            <img
              class="ml-2"
              :src="`https://flagcdn.com/w40/${searchPartnerStore.country.toLowerCase()}.webp`"
              alt=""
            />
          </p>
        </button>
        <button
          @click="searchPartnerStore.toggleGender()"
          :disabled="state.inRoom || searchPartnerStore.loading || state.loading"
          class="panel-btn"
          
        >
          Пол: {{ searchPartnerStore.gender === "male" ? "🙍🏻‍♂️" : "🙍🏻‍♀️" }}
        </button>
        -->
        <!--
        <button 
        @click="toggleCamera()"
        id="camToggle" 
        ref="camToggleRef"
        class="panel-btn"
        :disabled="!state.inRoom">{{ state.frontcam ? "Front cam" : "Back cam" }}</button>
        <button 
        
        class="panel-btn"
        disabled>screen</button> -->
      </div>

      <form
      class="formchat"
        @submit.prevent="sendMessage()"
        cass="relative flex flex-1 gap-2 m-2 bg-brown rounded-md w-full"
      >
      <div class="chat-box" cass="relative bottom-0 flex w-full p-2">
            <input
              type="text"
              name="chat_text"
              id="chat_text"
              
              class="chatinput"
              placeholder="Текст сообщения"
              v-model="message"
            /><!--
            <FaceSmileIcon
              @click="toggleEmojiVisibility"
              class="faceicon"
              cass="w-8 h-8 cursor-pointer fill-gray-300"
            ></FaceSmileIcon>
            <TheEmojiPicker v-if="emojisVisible" @emoji_click="handleEvent" /> -->
          </div>
        <div class="chat">
          <div id="Msgs" class="msgs">
            <p v-for="message in chatStore.messages" class="messages">
              <span class="chat-username"><b>{{ message.name }}: </b></span>{{ message.text }}
            </p>
          </div>
         
          
        </div>
      </form>
    </div>
    <TheCountries />
  </div>
 
</template>

<style scoped>
video{
	background-image: url(/buddy.svg);
			background-position: center;
			background-size: calc(90vh - 20%);
			background-repeat: no-repeat;
			background-color: rgba(#000, 0.5);
	border-radius: 5px;
}
#fuck::cue{
	background-image: linear-gradient(to bottom, dimgray, lightgray);
	color: darkblue;
	line-height:1.5;
	font-weight:bold;
position:relative;
}
#fuck::cue::after{
	content:"fuck";
	positoon:absolute;
}
#fuck::cue(b){
	color:orange;
}
#fuck::region{
	color:brown;
}
#fuck::cue(.foreignphrase){
	color:blue;
}


button[disabled].panel-btn, button[disabled].panel-btn:hover{
cursor:initial;
	ackground: rgba(216, 233, 255, 1);
	color:gray;
	background: linear-gradient(to bottom, rgba(216, 233, 255, 1) 0%, rgba(218, 235, 255, 0.7) 26%, rgba(231, 240, 255, 1) 100%);
}


button.panel-btn{
  cursor: pointer;
  margin-left: 5px;
  argin-bottom: 15px;
  text-shadow: 0 -2px 0 #4a8a65, 0 1px 1px #c2dece;
  box-sizing: border-box;
  font-size: 2em;
  font-family: Helvetica, Arial, Sans-Serif;
  text-decoration: none;
  font-weight: bold;
  color: #5ea97d;
  height: 65px;
  line-height: 65px;
  padding: 0 32.5px;
  display: inline-block;
  width: auto;
  background: linear-gradient(to bottom, #9ceabd 0%, #9ddab6 26%, #7fbb98 100%);
  border-radius: 5px;
  border-top: 1px solid #c8e2d3;
  border-bottom: 1px solid #c2dece;
  top: 0;
  transition: all 0.06s ease-out;
  position: relative;
  leter-spacing: 1px;
}
button.panel-btn:before{
  display: inline-block;
  content:"";
  position: absolute;
  left: 0;
  right: 0;
  z-index: -1;
  top: 6px;
  border-radius: 5px;
  height: 65px;
  background: linear-gradient(to top, #1e5033 0%, #378357 6px);
  transition: all 0.078s ease-out;
  box-shadow: 0 1px 0 2px rgba(0, 0, 0, 0.3), 0 5px 2.4px rgba(0, 0, 0, 0.5), 0 10.8px 9px rgba(0, 0, 0, 0.2);
}
button.panel-btn:visited{
	 color: #5ea97d;
	 margin:0;
}

button.panel-btn:hover {
  background: linear-gradient(to bottom, #baf1d1 0%, #b7e4ca 26%, #96c7ab 100%);
}

button.panel-btn:active:not(:disabled){
  top: 6px;
  text-shadow: 0 -2px 0 #7fbb98, 0 1px 1px #c2dece, 0 0 4px white;
  color: white;
}

button.panel-btn:active:before:not(:disabled) {
content:"";
  top: 0;
  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.7), 0 3px 9px rgba(0, 0, 0, 0.2);
}


.screen_first:hover .report-icon {
  display: block;
}
.functions-left {
  height: calc(100vh - 682px);
}

.functions-left button {
  transition: 0.3s all;
}
.functions-left button:hover {
  box-shadow: inset 0 0 10px black;
}

#userCount{
	font-weight: bold;
	color:orange;
}

#topPanel{
	brder: 1px solid orange;
	padding-left:3px;
	padding-top:10px;
	padding-bottom:10px;
	margin-bottom:8px;
}
#undervideocontainer{
	display:flex;
	 flex-wrap: wrap;
    flex-direction: row;
	justify-content: center;
	align-items: center;
    position: relative;
    margin-top:10px;
	margin-bottom:20px;
	padding-bottom:5px;
	brder:1px solid red;
}
.online-now{
	font-weight:bold;
	line-height: 1.6;
	margin-left: 4px;
	color:white;
	letter-spacing:1px;
	text-decoration:underline;
}
#underpanel{
	brder:1px solid orange;
	width:70%;
	margin:0 auto;
	display:block;
	position: relative;
}
.formchat{
	
	width:100%;
	margin:0 auto;
}
.chat-box{
 width: 100%;
	

	position:relative;
	display:block;
}
.chatinput{
width:100%;
margin:0 auto;
height:70px;
border-top-left-radius: 0.5rem;
border-top-right-radius: 0.5rem;
padding-left:1em;
padding-right: 55px;
font-size:1.5rem;
color:black;

background: linear-gradient(to bottom, rgba(216, 233, 255, 0.7) 0%, rgba(225, 243, 255, 0.7) 26%, rgba(250, 246, 255, 0.7) 100%);
}
.chatinput::placeholder{
	color:rgba(0,0,0,0.4);
}
.faceicon{
	color:yellow;
	width:50px;
	height:50px;
	position:absolute;
	top:10px;
	right:1px;
	cursor:pointer;
}
.chat{
	background:black;
	position:relative;
	display:block;
	width:100%;
	height: 70px;
	overflow:hidden;
	margin:0 auto;
	
	border-bottom-left-radius: 0.5rem; /* 8px */
border-bottom-right-radius: 0.5rem;
}
.msgs{
	background:white;
	width:100%;
	height:100%;
	position:relative;
	display:block;
	overflow-y:auto;
	white-space: pre-line;
	word-wrap: break-word;
	overflow-wrap:break-word;
	padding-left: 0.5em;
	padding-top:0.5em;
}
@media screen and (max-width: 401px){
		
				button.panel-btn{
			
					padding-top: 0;
					padding-bottom:0;
					padding-left: 15px;
					padding-right:15px;
	
				
				}
				#underpanel{
					width:100%;
				}
				video{
					background-size:90%;
				}
				}
</style>
