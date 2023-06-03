import { reactive, ref } from "vue";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
import { useChatStore } from "./stores/chat";
import { useToast } from "vue-toastification";

const toast = useToast();
var t;
export const state = reactive({
  connected: false,
  fooEvents: [],
  barEvents: [],
  inRoom: false,
  searching: false,
  loading: false,
  target: null,
  clientId:null
});
//const localStreamRef = ref(null);
//const chatStore = useChatStore();
//const localStreamRef = ref(null);
const URL = import.meta.env.DEV? import.meta.env.VITE_SERVER_HOST_DEV : import.meta.env.VITE_SERVER_HOST_PROD;
 //alert(URL);
 //let ru=import.meta.env.VITE_SERVER_HOST_PROD
// alert(Cookies.get("accessToken"));
export const socket = io(URL, {transports: ['websocket'],
  extraHeaders: {
   Authorization: `Bearer ${Cookies.get("accessToken")}`,
  },
});

socket.on("connect", () => {
  state.connected = true;
  console.log(socket.id);
  state.clientId = socket.id;
});

socket.on("disconnect", () => {
  state.connected = false;
});

const onInterval = function(data) {
	console.warn("interval");
	 if(state.target) return;
	 //alert(state.target);
//console.warn(data)
	if(!state.target) socket.emit("findRoom", data);
	  }


 const onHello = async function(event) { 
	 //  alert("hello");
	   console.error("hello");
	  state.loading = false;
    state.searching = false;
    state.inRoom = true;
    const chatStore = useChatStore();
     let roomDet = await chatStore.updateRoom("connected", true);
     console.log("roomDetails: ", roomDet);
	 }

export const stopRoom = async function(el){

	 if(t){
		// alert("clearInterval");
		 clearInterval(t);
		 t = undefined;
		 }
	 console.warn("stop");
	 const chatStore = useChatStore();
	 
			chatStore.leavePeer(state.clientId);
			if(fuck.srcObject){
		fuck.srcObject.getTracks().forEach(function(track){
			track.stop();
		});
		}
		fuck.srcObject = null;
			fuck.removeEventListener("hello", onHello);
			state.target = undefined;
			if(state.searching)state.searching = false;
          if(state.loading)  state.loading = false;
          state.inRoom = false;
			socket.emit("bye", {});
	await chatStore.updateRoom("connected", false);
    await chatStore.updateRoom("id", "");
    await chatStore.updateRoom("partner", "");
   if(state.connected) socket.close();
    
    
 };

 //const someEvent = new Event("hello");
 
export const findNewRoom = async (data) => {
	console.log("start");
	
	if(!state.connected) socket.connect();
	 const chatStore = useChatStore();
  try {
   if(!fuck.srcObject){
	       fuck.addEventListener("hello", onHello, true);
  
  
  await chatStore.init();
    fuck.srcObject = chatStore.localStream;
  
   
    fuck.onloadedmetadata = function () {

	 socket.emit("joinToQueue", { userId: data.userId, gender: data.gender, country: data.country });
	  state.loading = true;
    state.searching = true;
console.log("here data: ",data);
if(!t){
   t = setInterval(onInterval, 5000, data);
	}
}
}else{
			chatStore.leavePeer(state.clientId);
}
}catch (error) {
    console.log(error);
    toast.error(error.message);
   // state.loading = false;
   // state.searching = false;
  }
};

socket.on( 'onLeaveRoom', async (data) => {
	console.warn("*** on leave room ***");
	
	state.target = null;
	state.searching = true;
	try {
    const chatStore = useChatStore();
    chatStore.handleLeave(false);
    
}catch(e){
	console.error(e);
}
})

socket.on("onFindRoom", async (data) => {
console.log("ROOM FOUNDED!: ", JSON.stringify(data));

  try {
    const chatStore = useChatStore();
   //  state.clientId = data.socketId;
    //state.target = data.partner.socketId;
   // await chatStore.createOffer(data.roomId);
  // await chatStore.createOffer(state.target, state.clientId);
    toast.success(`You connected with ${data.partner.id}`);
    await chatStore.updateRoom("connected", true);
    await chatStore.updateRoom("id", data.socketId);
    await chatStore.updateRoom("partner", data.partner.socketId);
   

    state.loading = false;
    state.searching = false;

    console.log(chatStore.roomDetails);
  } catch (error) {
    state.loading = false;
    state.searching = false;
    console.log(error);
    toast.error(error.message);
  }
});
socket.on("makeOffer", async (data) => {
	console.log("makeOffer!!: ", JSON.stringify(data));
    state.target = data.to;
    
  try {
    const chatStore = useChatStore();
    await chatStore.createOffer(state.target, state.clientId);
    await chatStore.updateRoom("connected", false);
    await chatStore.updateRoom("id", data.roomId);
    await chatStore.updateRoom("partner", state.target);
   // state.loading = false;
   // state.searching = false;
}catch(e){console.error(e)}
})
socket.on("waitOffer", async (data) => {
	console.log("waitOffer!: ", JSON.stringify(data));
    state.target = data.from;
    const chatStore = useChatStore();
    await chatStore.updateRoom("connected", false);
    await chatStore.updateRoom("id", data.roomId);
    await chatStore.updateRoom("partner", state.target);
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

  await chatStore.addAnswer(data);
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

socket.on("onNewMessage", async (data) => {
  const chatStore = useChatStore()

  await chatStore.pushMessage(data)

  console.log(chatStore.messages);
});
