import { reactive, ref } from "vue";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
import { useChatStore } from "./stores/chat";
import { useUserStore } from "./stores/user";
//import { useSearchPartner } from "./stores/searchPartner";
import { useToast } from "vue-toastification";

//const searchPartnerStore = useSearchPartner();
const toast = useToast();
var t;
var tru;
var tru2;
var flagi, flagi2;
export const state = reactive({
  connected: false,
  counts: 0,
  fooEvents: [],
  barEvents: [],
  inRoom: false,
  searching: false,
  loading: false,
  localvideo:false,
  target: null,
  clientId:null,
  frontcam: false,
  videoInput: null,
  videoInput2: null,
  cam: null, 
  nick: null,
  phase: null,
  flag: '',
  myflag:'',
  screensharing: false,
  isShow: false,
});
const remoteStreamRef = ref(null);
const camToggleRef = ref(null);
const screenBtnRef = ref(null);
const btnStartRef = ref(null);
//const chatStore = useChatStore();
const localStreamRef = ref(null);
const URL = import.meta.env.DEV? import.meta.env.VITE_SERVER_HOST_DEV : import.meta.env.VITE_SERVER_HOST_PROD;
 //alert(URL);
 //let ru=import.meta.env.VITE_SERVER_HOST_PROD
// alert(Cookies.get("accessToken"));
export const socket = io(URL, {transports: ['websocket'],
  extraHeaders: {
   Authorization: `Bearer ${Cookies.get("accessToken")}`,
  },
});

socket.on("connect", async() => {
	const chatStore = useChatStore();
  state.connected = true;
  console.log(socket.id);
  state.clientId = socket.id;
  await chatStore.updateRoom("socketId", state.clientId);
   
});

socket.on("disconnect", () => {
  state.connected = false;
});

const onInterval = function(data) {
	
	 if(state.target) return;
	 
	if(!state.target) socket.emit("findRoom", data);
	  }
var kK = 0;
function gotDevices(deviceInfos){
	let a = navigator.mediaDevices.getSupportedConstraints();
	const chatStore = useChatStore();
	for(var i=0; i !== deviceInfos.length; ++i){
		
		const deviceInfo = deviceInfos[i];
		if(deviceInfo.kind === 'videoinput'){
			if(kK == 0){
				state.videoInput = deviceInfo.deviceId;
				
				state.cam = state.videoInput;
				//camToggle.setAttribute("data-current" , state.videoInput);
	
			}else if(kK == 1){
				
				state.videoInput2 = deviceInfo.deviceId;
				//alert(state.videoInput2);
				//chatStore.updateVideoInput('input2', state.videoInput2);
			}
			
			kK++;
		}
	}
}
export const getDevice = async()=>{
if(!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices){
alert("your browser navigator.mediaDevices not supported")
}else{
	localStreamRef.value = fuck;
	remoteStreamRef.value = REMOTE;
	camToggleRef.value = camToggle;
	screenBtnRef.value = screenBtn;
	btnStartRef.value = btnStart;
	const chatStore = useChatStore();
	await chatStore.pushMessage({name: "width:height", text: window.innerWidth+":"+window.innerHeight});
navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(function(err){console.error(err)});
}
}
 
 const onScreenEnded = async function(){
	 await toggleCamera();
	screenBtn.disabled = false;
	btnStart.disabled = false;
	state.screensharing = false;
 }
 
 const onHello = async function(event) { 
	// alert("onHello");
	btnStart.disabled = false;
	 state.phase = null;
	  state.loading = false;
    state.searching = false;
    state.inRoom = true;
    
    const chatStore = useChatStore();
     let roomDet = await chatStore.updateRoom("connected", true);
     console.log("roomDetails: ", roomDet);
     if(state.videoInput2){
		 camToggle.disabled = false;
	 }
	 
  await chatStore.pushMessage({name: "Собеседник", text: "вoшел."});
   Msgs.scrollTop = Msgs.clientHeight + Msgs.scrollHeight;	
	 }

export const stopRoom = async function(el){

	 if(t){
		
		 clearInterval(t);
		 t = undefined;
		 }
	 console.warn("stop");
	 const chatStore = useChatStore();
	 
			chatStore.leavePeer(state.clientId);
		if(localStreamRef.value.srcObject){
		localStreamRef.value.srcObject.getTracks().forEach(function(track){
			track.stop();
		});
		}
		fuck.srcObject = null;
			fuck.removeEventListener("hello", onHello);
			fuck.removeEventListener("screenended", onScreenEnded);
			state.target = undefined;
			if(state.searching)state.searching = false;
          if(state.loading)  state.loading = false;
          if(state.screensharing) state.screensharing = false;
          state.inRoom = false;
			socket.emit("bye", {});
	await chatStore.updateRoom("connected", false);
    await chatStore.updateRoom("id", "");
    await chatStore.updateRoom("partner", "");
   if(state.connected) socket.close();
    if(tru){tru.mode = "disabled";}
    if(tru2){tru2.mode = "hidden";}
    if(flagi){flagi.mode = "hidden";}
    if(flagi2){flagi2.mode = "hidden";}
    localStreamRef.value.onloadedmetadata = null;
    remoteStreamRef.value.onloadedmetadata = null;
    btnStartRef.value.disabled = false;
    camToggleRef.value.disabled = true;
    screenBtnRef.value.disabled = true;
 };

 //const someEvent = new Event("hello");
 
export const findNewRoom = async (data) => {
	state.myflag = data.flag;
	btnStart.disabled = true;
	state.localvideo = true;
	console.log("start");
	const us=useUserStore();
	
	//alert(JSON.stringify(us));
	if(!state.connected) socket.connect();
	 const chatStore = useChatStore();
  try {
   if(!fuck.srcObject){
	       fuck.addEventListener("hello", onHello, true);
	       fuck.addEventListener("screenended", onScreenEnded, true);
  
  
  await chatStore.init();
    localStreamRef.value.srcObject = chatStore.localStream;
  
  
  
  
   //camToggle
    localStreamRef.value.onloadedmetadata = function (ev) {
		//alert("go");
		state.localvideo = false;
    tru=ev.target.addTextTrack("captions", "Titles", "ru");
   tru.mode="showing";
   let cue=new VTTCue(0.0,100090.9, /*us.user.details.details.firstname*/ "<c.base>we</c>");
   cue.snapToLines=false;
   cue.lineAlign='center';
   //cue.vertical="rl"
  cue.positionAlign='center';
  cue.position=10;
   cue.size="100";
  cue.line=2;
  
   cue.align="start";// start end 
  
  // console.log(cue.getCueAsHTML());
   tru.addCue(cue);
   fuck.style.setProperty("--some-image", "url(/janus.png");
   
  
   
   
   
   
   
   
   
	 if(!t)socket.emit("joinToQueue", { userId: data.userId, gender: data.gender, country: data.country, countries:data.countries, nick: data.nick,
		 mygender: data.mygender, suechgender: data.suechgender, flag: data.flag });
	  state.loading = true;
  if(!state.inRoom)  state.searching = true;
    btnStop.disabled = false;
  if(!state.inRoom)  btnStart.disabled = true;
    camToggle.disabled = false;
    screenBtn.disabled = false;
console.log("here data: ", JSON.stringify(data));
if(!t){
   t = setInterval(onInterval, 1000, data);
	}
	if(state.videoInput2)camToggle.disabled = false;
	//alert(navigator.onLine);
	//if(!navigator.onLine) return;
	 
   flagi2 = ev.target.addTextTrack("captions", "Titles", "ru");
   flagi2.mode = "showing";
   let cue4 = new VTTCue(0.0,100090.9, "<c.flag>we</c>");
   cue4.snapToLines = false;
   cue4.lineAlign = 'center';
   cue4.vertical="rl"
  cue4.positionAlign = 'center';
  cue4.position = 97;
   cue4.size = "100";
  cue4.line = 2;
  cue4.align = "end";// start end 
   flagi2.addCue(cue4);
   fuck.style.setProperty("--some-flag", `url(${state.myflag})`);
   
};


REMOTE.onloadedmetadata = function (ev) {
	state.inRoom = true;
    state.loading = false;
    state.searching = false;
    tru2 = ev.target.addTextTrack("captions", "Titles", "ru");
   tru2.mode = "showing";
   let cue=new VTTCue(0.0,100090.9, "<c.base>we</c>");
   cue.snapToLines = false;
   cue.lineAlign = 'center';
   //cue.vertical="rl"
  cue.positionAlign = 'center';
  cue.position = 10;
   cue.size = "100";
  cue.line=2;
   cue.align = "start";// start end 
  // console.log(cue.getCueAsHTML());
   tru2.addCue(cue);
   REMOTE.style.setProperty("--some-image", "url(/janus.png");
   if(!navigator.onLine) return;
   flagi = ev.target.addTextTrack("captions", "Titles", "ru");
   flagi.mode = "showing";
   let cue3 = new VTTCue(0.0,100090.9, "<c.flag>we</c>");
   cue3.snapToLines = false;
   cue3.lineAlign = 'center';
   cue3.vertical="rl"
  cue3.positionAlign = 'center';
  cue3.position = 97;
   cue3.size = "100";
  cue3.line = 2;
  cue3.align = "end";// start end 
   flagi.addCue(cue3);
   REMOTE.style.setProperty("--some-flag", `url(${state.flag})`);
};







}else{
	//camToggle.disabled = true;
	//alert("weiter");
	state.localvideo = false;
	if(flagi){
		flagi.mode = "hidden";
	}
			chatStore.leavePeer(state.clientId);
			if(tru2){
				tru2.mode="hidden";
			}
			screenBtn.disabled = true;
			camToggle.disabled = true;
			 await chatStore.pushMessage({name: "Вы", text: "вышли."});
  
   Msgs.scrollTop = Msgs.clientHeight + Msgs.scrollHeight;	
}
}catch (error) {
	btnStart.disabled = false;
	state.localvideo = false;
    console.log(error);
   // alert(error);
    toast.error(error.message);
   // state.loading = false;
   // state.searching = false;
  }
};


export const  toggleCamera=async()=>{
camToggle.disabled = true;
btnStop.disabled = true;
screenBtn.disabled = true;
toast.info("Переключаем камеру.");

//menuPanel.className = "";
state.isShow = false;
	//if(!state.videoInput2) {
		//toast.error("Не работает!");
		//return;
	//}
	
const chatStore = useChatStore();
chatStore.stopStream();
	fuck.srcObject = null;

	state.localvideo = true;
	var dura;
	let si = state.cam;
	
	if(si !== state.videoInput2){
	camToggle.setAttribute("data-current", state.videoInput2);
	state.cam = state.videoInput2;
	dura = state.videoInput2;
	
	state.frontcam = true;
	
}else{
	
	camToggle.setAttribute("data-current", state.videoInput);
	state.cam = state.videoInput;
	dura = state.videoInput;
	
	state.frontcam = false;
}
  try{
    await chatStore.changeCam(dura);
}catch(e){
	toast.error(e);
}
	fuck.srcObject = chatStore.localStream;
	state.localvideo = false
	camToggle.disabled = false;
	screenBtn.disabled = false;
	btnStop.disabled = false;
	btnStart.disabled = false;

}

export const screensharing = async()=>{
	const chatStore = useChatStore();
	screenBtn.disabled = true;
	state.isShow = false;
	if(!state.screensharing){
		//menuPanel.className = "";
		btnStop.disabled = true;
	toast.info("Переключаемся в режим демонстрации экрана");
	
	chatStore.stopStream();
	fuck.srcObject = null;
	state.localvideo = true;
	try{
		await chatStore.doSharing();
	}catch(e){
		toast.error(e);
		await toggleCamera();
		return;
	}
	fuck.srcObject = chatStore.localStream;
	state.localvideo = false;
	screenBtn.disabled = false;
	state.screensharing = true;
	btnStop.disabled = false;
	//state.searching = false;
	//screenBtn.textContent = "Выключить демонстрацию"
}else{
	await toggleCamera();
	screenBtn.disabled = false;
	state.screensharing = false;
}
}

socket.on( 'onLeaveRoom', async (data) => {
	console.warn("*** on leave room ***");
	 const chatStore = useChatStore();
	state.target = null;
	state.searching = true;
	btnStart.disabled = true;
	try {
   
    chatStore.handleLeave(false);
    if(tru2){
				tru2.mode="hidden";
			}
			if(flagi){
				flagi.mode = "hidden";
				}
			screenBtn.disabled = true;
  await chatStore.pushMessage({name: "Собеседник", text: "вышел."});
  
   Msgs.scrollTop = Msgs.clientHeight + Msgs.scrollHeight;	
}catch(e){
	toast.error(e);
}
})


socket.on('usercount', (data)=>{
	if(document.getElementById('userCount'))userCount.textContent = data.count;
	state.counts = data.count;
})

socket.on("makeOffer", async (data) => {
	if(state.phase && state.phase == "wait_offer"){
		return;
	}
	state.phase = "make_offer";
	console.log("makeOffer!!: ", JSON.stringify(data));
	//toast.info("Нашелся собеседник");
    state.target = data.to;
    state.nick = data.nick;
    state.flag = data.flag;
    
  try {
    const chatStore = useChatStore();
    await chatStore.createOffer(state.target, state.clientId);
    await chatStore.updateRoom("connected", false);
    await chatStore.updateRoom("id", data.roomId);
    await chatStore.updateRoom("partner", state.target);
    await chatStore.updateRoom("socketId", state.clientId);
   // state.loading = false;
   // state.searching = false;
  setTimeout(function(){
	   if(!state.inRoom){
		   chatStore.leavePeer(state.clientId);
	   }
   }, 5000);
}catch(e){console.error(e)}
})
socket.on("waitOffer", async (data) => {
	if(state.phase && state.phase == "make_offer"){
		return;
	}
	state.phase = "wait_offer";
	console.log("waitOffer!: ", JSON.stringify(data));
	//toast.info("Нашелся собеседник");
    state.target = data.from;
    state.nick = data.nick;
    state.flag = data.flag;
    const chatStore = useChatStore();
    await chatStore.updateRoom("connected", false);
    await chatStore.updateRoom("id", data.roomId);
    await chatStore.updateRoom("partner", state.target);
    setTimeout(function(){;
     if(!state.inRoom){
		   chatStore.leavePeer(state.clientId);
	   }
   }, 5000);
   // state.loading = false;
   // state.searching = false;
});
socket.on("offer", async (data) => {
	console.log("Sending Answer!");
    //console.log(data);
  try {
    const chatStore = useChatStore();

   //  await chatStore.createAnswer(data.offer, data.roomId);
		await chatStore.createAnswer(data, state.target, state.clientId);
   // console.log(data);
  
  } catch (error) {
    console.log(error);
    toast.error(error.message);
    state.loading = false;
    state.searching = false;
  }
});

socket.on("answer", async (data) => {
  const chatStore = useChatStore();

  await chatStore.addAnswer(data, state.clientId);
});

socket.on("onJoinToQueue", (data) => {
  console.log("join to queue ", data);
});

socket.on('iceCandidate', (data)=>{
//	console.warn("candidate: ", data);
	const chatStore = useChatStore();
	chatStore.handleCandidate(data);
})

socket.on("onException", (data) => {
 // state.searching = false;
 // state.loading = false;
  console.log(data);
  toast.error(data.message);
});

socket.on("onNewMessage1", async (data) => {
  const chatStore = useChatStore();
  await chatStore.pushMessage(data);
   Msgs.scrollTop = Msgs.clientHeight + Msgs.scrollHeight;
//alert("message came")
  console.log(chatStore.messages);
});
