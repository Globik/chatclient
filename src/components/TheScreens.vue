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

const handleEvent = (e) => {
  message.value += e;
};

const toggleEmojiVisibility = () => {
  emojisVisible.value = !emojisVisible.value;
};
const mama=1;
let nick = userStore.user.details.details.firstname ? userStore.user.details.details.firstname : "Аноним" ;
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
	//alert('onUnmounted')
	stopRoom();
})
</script>
<template>
  <div class="w-full">
  <div>Users online: <span id="userCount">{{state.counts}}</span></div>
    <div class="top-0 grid w-full grid-cols-2 screens">
      <div
        class="max-h-[682px] relative xl:h-[740px] xl:aspect-auto aspect-square screen_first bg-gray-600"
      >
        <video
          ref="remoteStreamRef"
          id="REMOTE"
          autoplay
          class="w-full h-full object-cover z-[99999]"
        ></video>
        <ExclamationCircleIcon
          @click="toggleReport"
          class="absolute hidden w-8 h-8 transition-all opacity-50 cursor-pointer report-icon fill-white hover:opacity-100 top-4 right-4"
        ></ExclamationCircleIcon>

        <div
          class="absolute bottom-0 flex w-full p-2 space-x-4 transition opacity-0 bg-[#0000007e] controller hover:opacity-100"
        >
          <!-- should be binded  -->
          <button @click="toggleSound()" class="">
            <SpeakerWaveIcon
              v-if="!isMute"
              class="w-6 h-6 transition fill-gray-400 hover:fill-white"
            ></SpeakerWaveIcon>
            <SpeakerXMarkIcon
              v-else
              class="w-6 h-6 transition fill-gray-400 hover:fill-white"
            ></SpeakerXMarkIcon>
          </button>
          <input
            min="0"
            max="100"
            class="w-full cursor-pointer"
            type="range"
            v-model="volume"
            id="volume-slider"
          />
        </div>
      </div>
      <div
        class="relative max-h-[682px] xl:h-[740px] xl:aspect-auto aspect-square screen_second"
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
    <div clas="flex w-full functions h-[100% - 682px] ">
      <div id="undervideocontainer" 
        clas="flex flex-col items-center flex-1 gap-2 p-2 space-x-1 text-2xl font-medium md:flex-row functions-left"
      >
        <button
          @click="findNewRoom(findRoomArgs)"
          :disabled="
            state.loading || state.searching || searchPartnerStore.loading
          "
          cass="flex-1 w-full h-full bg-blue-400 rounded-md disabled:bg-gray-400"
        >
          {{ state.inRoom ? "Далее" : "Старт" }}
        </button>
        <button
        id="btnStop"
        @click="stopRoom()"
        :disabled="
            !state.inRoom && !state.searching
            "
         cass="flex-1 w-full h-full bg-red-400 rounded-md disabled:bg-gray-400"
        >
          Стоп
        </button>
        <button
          :disabled="state.inRoom || searchPartnerStore.loading || state.loading"
          @click="searchPartnerStore.toggleCountrySearch(true)"
          cass="flex items-center justify-center flex-1 w-full h-full space-x-2 bg-gray-200 rounded-md disabled:bg-gray-400"
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
          cass="flex-1 w-full h-full bg-gray-200 rounded-md disabled:bg-gray-400"
        >
          Пол: {{ searchPartnerStore.gender === "male" ? "🙍🏻‍♂️" : "🙍🏻‍♀️" }}
        </button>
        <button 
        @click="toggleCamera()"
        id="camToggle" 
        :disabled="!state.inRoom">{{ state.frontcam ? "Front cam" : "Back cam" }}</button>
      </div>

      <form
        @submit.prevent="sendMessage()"
        cass="relative flex flex-1 gap-2 m-2 bg-brown rounded-md w-full"
      >
      <div class="relative bottom-0 flex w-full p-2 border-t-2">
            <input
              type="text"
              name="chat_text"
              id="chat_text"
              
              class="chatinput"
              placeholder="Введите сюда текст сообщения и нажмите Enter"
              v-model="message"
            />
            <FaceSmileIcon
              @click="toggleEmojiVisibility"
              class="w-8 h-8 cursor-pointer fill-gray-300"
            ></FaceSmileIcon>
            <TheEmojiPicker v-if="emojisVisible" @emoji_click="handleEvent" />
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

#undervideocontainer{
	margin-top:5px;
}
button[disabled]{
	background:gray;
}
button{background:orange;color:white;font-weight:bold;font-size:1rem;margin-left:10px;padding:15px;margin-bottom:4px;margin-top:4px;}
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
.chatinput{
width:100%;
	padding-left:2em;
}
.chat{
	background:black;
	position:relative;
	display:block;
	width:100%;
	height: 150px;
	overflow:hidden;
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
}
</style>
