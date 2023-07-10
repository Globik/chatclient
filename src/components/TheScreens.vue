<script setup>
import { reactive, onMounted, onUnmounted, onBeforeUnmount } from "vue";
import {
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  FaceSmileIcon,
  ExclamationCircleIcon,
} from "@heroicons/vue/24/solid";
//import { ChatIcon } from "@vue-hero-icons/outline"

import "/node_modules/flag-icons/css/flag-icons.min.css";
import { useToast } from "vue-toastification";


import { ref } from "vue";
import TheCountries from "./TheCountries.vue";
import revolverSpinner from "./revolverSpinner.vue";
import sharikSpinner from "./sharikSpinner.vue";
import { useSearchPartner } from "../stores/searchPartner";
import { useChatStore } from "../stores/chat";
import { useUserStore } from "../stores/user";
import { state, findNewRoom, stopRoom, getDevice, toggleCamera, screensharing } from "../socket";
import TheEmojiPicker from "./TheEmojiPicker.vue";
import Cookies from "js-cookie";
import { socket } from "../socket";
//const emits2 = defineEmits(["closeMenu"]);
const chatStore = useChatStore();
const searchPartnerStore = useSearchPartner();
const userStore = useUserStore();
const toast = useToast();

const isMute = ref(false);
const isShow = ref(false);
const volume = ref(23);
const reportVisible = ref(false);
const emojisVisible = ref(false);
const message = ref("");
const localStreamRef = ref(null);
const remoteStreamRef = ref(null);
const camToggleRef = ref(null);

const emits = defineEmits(["toggleReportEvent","closeMenu"]);

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


const toggleMenu = () =>{
	state.isShow = !state.isShow;
//	emits("closeMenu",state.isShow);
}
document.body.onclick=function(ev){
	//toggleMenu();
}
const toggleScreen = () =>{
	if(!remoteStreamRef.value.fullScreenElement){
		remoteStreamRef.value.requestFullscreen();
	}
}
function dofuck(){}

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
var userid;
try{
if(Cookies.get("user")){
	userid = JSON.parse(Cookies.get("user")).details.userId;
	}else{
		userid = "1";
	}
}catch(e){
	//alert(e)
	console.error(e)
	userid="1";
}
let nick = "Anonym";//userStore.user.details.details.firstname ? userStore.user.details.details.firstname : "Аноним" ;
const findRoomArgs = reactive({
  gender: searchPartnerStore.gender,
  country: +searchPartnerStore.countryIndex,
  userId: userid,
  countries:searchPartnerStore.counta,
  nick: nick,
  mygender: searchPartnerStore.mygender,
  suechgender: searchPartnerStore.suechgender,
  flag: `https://flagcdn.com/w40/${searchPartnerStore.country.toLowerCase()}.webp`,
});
//console.log("screen ", searchPartnerStore.counta)
  const sendMessage = async () => {
  console.log(`Message: `, message.value);
  console.log(`Room: `, chatStore.roomDetails.connected);
  if (!message.value || !chatStore.roomDetails.connected) {
  //toast.info("Обождитe партнера-то!")
    return;
  } else {
    const text = message.value;
    const roomId = chatStore.roomDetails.partner;
   // alert('roomId: '+ roomId);
    //const name = userStore.user.details.details.firstname;
    const userId = Cookies.get("user")
      ? JSON.parse(Cookies.get("user")).details.userId
      : "";
      let Msgs = document.getElementById("Msgs")
      if(Msgs){
    await chatStore.pushMessage({ name: "Вы", text, roomId, userId });
    Msgs.scrollTop = Msgs.clientHeight + Msgs.scrollHeight;
    let a = { name: "Собеседник", text, userId, roomId };
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
  camToggleRef.value = camToggle;
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
<div id="logoutDiv">
<div class="logout-item">
<button id="btnLogout" @click="logout()"><span>Выход</span>

</button>
</div></div>
  <div class="w-full" >
  <div id="topPanel">
  
  <div id="countcontainer"><span class="online-now it">Онлайн: </span><span class="it" id="userCount">{{state.counts}}</span></div>
  <div class="ita">
  
  <button title="Настройки" @click="toggleMenu()">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
  <path fill-rule="evenodd" d="M4.25 2A2.25 2.25 0 002 4.25v2.5A2.25 2.25 0 004.25 9h2.5A2.25 2.25 0 009 6.75v-2.5A2.25 2.25 0 006.75 2h-2.5zm0 9A2.25 2.25 0 002 13.25v2.5A2.25 2.25 0 004.25 18h2.5A2.25 2.25 0 009 15.75v-2.5A2.25 2.25 0 006.75 11h-2.5zm9-9A2.25 2.25 0 0011 4.25v2.5A2.25 2.25 0 0013.25 9h2.5A2.25 2.25 0 0018 6.75v-2.5A2.25 2.25 0 0015.75 2h-2.5zm0 9A2.25 2.25 0 0011 13.25v2.5A2.25 2.25 0 0013.25 18h2.5A2.25 2.25 0 0018 15.75v-2.5A2.25 2.25 0 0015.75 11h-2.5z" clip-rule="evenodd" />
</svg>
</button>
  </div>
  <div id="menuPanel" :class="{'show':state.isShow}">
  <div><button 
   @click="toggleCamera()"
        id="camToggle" 
        ref="camToggleRef"
        disabled
  title="Тыловая/фронтальная камера">{{ state.frontcam ? "Фронтальная камера" : "Тыловая камера" }}</button></div>
  <div><button id="screenBtn" ref="screenBtnRef" title="screen sharing" @click="screensharing()" 
  disabled>{{ state.screensharing ? "Откл. демонстрацию экрана":"Демонстрация экрана" }}</button></div>
  </div>
  </div>
    <div class="top-0 grid w-full grid-cols-2 screens">
      <div
        class="max-h-[682px] relative xl:h-[990px] xl:aspect-auto aspect-square screen_first  videocontainer"
      >
     <div id="cloader" :class="{'unspinner':!state.searching}">
   
     <revolverSpinner></revolverSpinner>
     </div>
        <video
          ref="remoteStreamRef"
          id="REMOTE"
          autoplay
          class="w-full h-full object-cover z-[99999]"
        ></video>
        
        <ExclamationCircleIcon
          @click="toggleReport"
          title="Пожаловаться"
          ref="complain"
          class="complainznak absolute hidden w-8 h-8 transition-all opacity-50 cursor-pointer report-icon fill-red hover:opacity-100 top-4 right-4 excl"
        ></ExclamationCircleIcon>

        <div style="display:grid;grid-template-columns: 1fr 1fr;width:100%;position:absolute;bottom:0;align-items:center; jutify-content:start;"
          class="absolute bottom-0 flex w-full p-2 space-x-4 transition opacity-0 bg-[#0000007e] controller hover:opacity-100"
        >
          <!-- should be binded  -->
          <button @click="toggleSound()" class="" title="откл/вкл звук">
            <SpeakerWaveIcon
              v-if="!isMute"
              class="mute w-6 h-6 transitionfill-gray-400 fill-white mx-2"
            ></SpeakerWaveIcon>
            <SpeakerXMarkIcon
              v-else
              class="mute w-6 h-6 transitionfill-gray-400 fill-white mx-2"
            ></SpeakerXMarkIcon>
          </button>
          <button id="fullscreen" @click="toggleScreen" title="во весь экран" style="justify-self:end;" class="">
          <svg xmlns="http://www.w3.org/2000/svg" fill="blue" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
</svg>

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
        class="relative max-h-[682px] xl:h-[990px] xl:aspect-auto aspect-square screen_second  videocontainer"
      >
      <div id="cloader2" :class="{'unspinner': !state.localvideo}">
      <sharikSpinner></sharikSpinner>
      </div>
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
        ref="btnStartRef"
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
              autocomplete="off"
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
#fullscreen:hover svg{
 stroke: blue;

}
#fullscreen svg, .mute svg{
	stroke:white;

}
#logoutDiv{
	display:flex;
	 flex-wrap: wrap;
    flex-direction: row;
	justify-content: end;
	align-items: center;
	argin-top:5px;
	margin-bottom:5px;
}
.logout-item{
display:inline-block;
align-self: end;
  justify-self: end;
  position:relative;
  mrgin-right:10px;
}
#btnLogout{
line-height:1.5;
padding:10px;
	border:1px solid black;
}
#btnLogout:hover{
	background:rgba(255,161,97,0.9);
}
.excl{
	fill:red;
	ackground:orange;
}
.first.videocontainer{
	position:relative;
	display:flex;
}
.videocontainer{
	background:rgba(138,231,197,0.34);
	border-radius: 5px;
	border: 2px solid rgba(122,183,121, 0.68);
	margin-right:2px;
	margin-left:2px;
	gap:20px;
}
video{
	background-image: url(/buddy.svg);
			background-position: center;
			background-size: calc(90vh - 20%);
			background-repeat: no-repeat;
			background-color: rgba(#000, 0.5);
	border-radius: 5px;
}
#fuck,#REMOTE{
	--some-image: url(/buddy.svg);
	--some-flag: url(/buddy.svg);
	--some-color: rgba(0,0,0,0);
}
#fuck::cue(.base), #REMOTE::cue(.base){

	background-image: var(--some-image);
	background-position: center;
	background-size: 100%;
	background-repeat: no-repeat;
	font-size:6vw;
	color:rgba(0,0,0,0);

}


#fuck::cue(.flag), #REMOTE::cue(.flag){

	background-image: var(--some-flag);
	background-position: center;
	background-size: 100%;
	background-repeat: no-repeat;
	font-size:6vw;
	color:rgba(0,0,0,0);

}

#fuck::cue, #REMOTE::cue{
	background-color: var(--some-color);
}

button[disabled].panel-btn, button[disabled].panel-btn:hover{
cursor:initial;
	ackground: rgba(216, 233, 255, 1);
	color:gray;
	background: linear-gradient(to bottom, rgba(216, 233, 255, 1) 0%, rgba(218, 235, 255, 1) 26%, rgba(231, 240, 255, 1) 100%);
}

button[disabled].panel-btn:before{
	background:gray;
}
button.panel-btn{
 -webkit-tap-highlight-color:transparent;
  cursor: pointer;
  margin-left: 0.313rem;/*5px;*/
  argin-bottom: 15px;
  text-shadow: 0 -0.125rem 0 #4a8a65, 0 0.063rem 0.063rem #c2dece; /* 0 -2px 0 #4a8a65, 0 1px 1px #c2dece;*/
  box-sizing: border-box;
  font-size: 2rem;
  font-family: Helvetica, Arial, Sans-Serif;
  text-decoration: none;
  font-weight: bold;
  color: #5ea97d;
  height: 4.063rem;/*65px */
  line-height: 4.063rem;/*65px;*/
  padding: 0 2.031rem;/*32.5px;*/
  display: inline-block;
  width: auto;
  background: linear-gradient(to bottom, #9ceabd 0%, #9ddab6 26%, #7fbb98 100%);
  border-radius: 0.313rem;/*5px;*/
  border-top: 1px solid #c8e2d3;
  border-bottom: 0.063rem solid #c2dece;/*1px*/
  top: 0;
  transition: all 0.06s ease-out;
  position: relative;
  letter-spacing: 0.063rem;
}



button.panel-btn:hover {
  background: linear-gradient(to bottom, #baf1d1 0%, #b7e4ca 26%, #96c7ab 100%);
}

button.panel-btn:active:not(:disabled){
  top: 3px;
  text-shadow: 0 -2px 0 #7fbb98, 0 1px 1px #c2dece, 0 0 4px white;
  color: white;
}

button.panel-btn:active:not(:disabled):before{

  top: 0;
  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.7), 0 3px 9px rgba(0, 0, 0, 0.2);
}

button.panel-btn:before{
  display: inline-block;
  content:"";
  position: absolute;
  left: 0;
  right: 0;
  z-index: -1;
  top: 3px;
  border-radius: 0.313rem;
  height: 4.063rem;
  background: linear-gradient(to top, #1e5033 0%, #378357 0.375rem);
  transition: all 0.078s ease-out;
  box-shadow: 0 0.063rem 0 0.125rem rgba(0, 0, 0, 0.3), 0 0.313rem 0.15rem rgba(0, 0, 0, 0.5), 0 0.675rem 0.563rem rgba(0,0, 0, 0.2);
  /*0 1px 0 2px rgba(0, 0, 0, 0.3), 0 5px 2.4px rgba(0, 0, 0, 0.5), 0 10.8px 9px rgba(0, 0, 0, 0.2);*/
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
margin-left:5px;
	font-weight: bold;
	clor:orange;
}

#topPanel{
 display:grid;
 grid-template-columns: auto 30px;
 /*justify-content: center;
 align-items: center;
 */
	position:relative;
	border: 1px solid transparent;
	padding-left:10px;
	/*padding-top:10px;
	padding-bottom:10px;*/
	margin-bottom:5px;
	/*margin-top:8px;
	margin-right:9px;
	margin-left:9px;*/
	height: 40px;
	background:rgb(250,240,190);
	border-radius:5px;
}
#topPanel > div{
	pdding:1rem;
}
#countcontainer{
align-self:center;

}
.ita{
dsplay:block;
	position:relative;
	color:orange;
	justify-self: center;
	align-self:center;
brder:2px solid red;
width:100%;
}
.ita > button{

}
.ita > button > svg{
	
	transform:translateX(12px);
	transform:translateY(0.2em);
}
#menuPanel{
	position:absolute;
	top:40px;
	padding:0;
	right:0;
	width:auto;
	display:none;
	background: rgba(255,204,153,0.8);
	z-index:1;
	border-radius:5px;
}
#menuPanel > div{
	margin-top:0px;
	boder:1px solid black;
	padding:0;
}
#menuPanel > div > button{
width:100%;
height:100%;
border: 1px solid silver;
line-height:2rem;
padding:0.6rem;
border-radius:5px;
}
#menuPanel > div > button:not(:disabled):hover{
	background:rgba(255,161,97,0.9);
	color:white;
}
#menuPanel.show{
	display:block;
	z-index:1;
}
#camToggle[disabled],#screenBtn[disabled]{
	color:silver;
	background:gray;
}

@media screen and (max-width: 501px){
#topPanel{
	eight:50px;
	ading:0;
	argin-bottom:4px;
	argin-left:3px;
	argin-right:3px;
}
.online-now,#userCount{
	ont-size:1.5rem;
	align-self:center;
}
#menuPanel{
	op:50px;
}
	#menuPanel > div > button{
	
		ont-size:2rem;
	}
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
	olor:white;
	letter-spacing:1px;
	text-decoration:none;
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
	
	border-bottom-left-radius: 0.5rem; /* 8px   3px=0.188rem*/
border-bottom-right-radius: 0.5rem;
}
.msgs:before{
	content:"чат";
	position:absolute;
	background:rgba(24,23,4,0.1);
	top:0;
	left:45%;
	padding:0.1em;
	font-size:0.9em;
	color:rgba(0,0,0,0.4);
	line-height:1.2;
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
@media screen and (max-width: 501px){
		
				button.panel-btn{
			font-size:22px;
			line-height:27px;
			height:44px;
			width:auto;
			padding:10px;
	margin-top:0.5rem;
	margin-bottom:0.5rem;
	
				
				}
				button.panel-btn:before{
					top:3px;
					height:44px;
					background: linear-gradient(to top, #1e5033 0%, #378357 0.188rem);
				}
				button.panel-btn:active:not(:disabled){
  top: 3px;
  }
				#underpanel{
					width:100%;
				}
				video{
					background-size:90%;
				}
	
				}
				
				
				
				
	/* planshet 451x641      */
	
	@media screen and (max-width: 452px) and (orientation: portrait){
			button.panel-btn{
					font-size:4.5vw;
				}
				button.panel-btn:before{
					top:1px;
					box-shadow:none;
					}
					button.panel-btn:active:not(:disabled){
  top: 1px;
  box-shadow:none;
  }
  
  .complainznak{
	 top:1px;
	 right:1px;
 }
	}
	@media screen and (max-height: 642px) and (orientation: landscape){
		#underpanel{
		
				width:100%;
				
			}	
				button.panel-btn{
					font-size:5.5vh;
				}
				button.panel-btn:before{
					top:1px;
					box-shadow:none;
					height:44px;
					}
					button.panel-btn:active:not(:disabled){
  top: 1px;
  box-shadow:none;
  }
  video{
	
			background-size: 90%;
			}
	}
				
				
				
				
				
				
	/* 285 x 567 */
	@media screen and (max-height: 286px) and (orientation: landscape){
	#underpanel{
		
				width:100%;
				
			}	
				button.panel-btn{
					font-size:5.5vh;
				}
				button.panel-btn:before{
					top:1px;
					box-shadow:none;
					height:44px;
					}
					button.panel-btn:active:not(:disabled){
  top: 1px;
  box-shadow:none;
  }
  .complainznak{
	 top:1px;
	 right:1px;
 }
  
	}
	@media screen and (max-width: 384px) and (orientation: portrait){
			#underpanel{
				ackground:green;
			}	
				button.panel-btn{
					font-size:5.5vw;
				}
				button.panel-btn:before{
					top:1px;
					box-shadow:none;
					}
					button.panel-btn:active:not(:disabled){
  top: 1px;
  box-shadow:none;
  }
  
 .complainznak{
	 top:1px;
	 right:1px;
 }
  
  
  
  
  
  
  
		}		
				
				
				/* loader */
	#cloader, #cloader2{
		position:absolute;
		top:0;
		left:0;
		width:100%;
		height:100%;
		overflow:hidden;
		display:flex;
		justify-content:center;
		align-items:center;
		background: #262E2A;
		border-radius:5px;
	}	
	
#cloader.unspinner, #cloader2.unspinner{
	display:none;
}		
</style>
