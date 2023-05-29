import { reactive, ref } from "vue";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
import { useChatStore } from "./stores/chat";
import { useToast } from "vue-toastification";

const toast = useToast();

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
const localStreamRef = ref(null);
const URL = import.meta.env.DEV? import.meta.env.VITE_SERVER_HOST_DEV : import.meta.env.VITE_SERVER_HOST_PROD;
 //alert(URL);
 //let ru=import.meta.env.VITE_SERVER_HOST_PROD
// alert(Cookies.get("accessToken"));
export const socket = io(URL, {
  extraHeaders: {
   Authorization: `Bearer ${Cookies.get("accessToken")}`,
  },
});
socket.on('onConnection', d=>{
	state.clientId = d.connectionId;
	console.warn(d.connectionId);
})
socket.on("connect", (s) => {
  state.connected = true;
});

socket.on("disconnect", () => {
  state.connected = false;
});


export const stopRoom = async function(){
	 
	 console.warn("stop");
	 const chatStore = useChatStore();
			chatStore.leavePeer(state.clientId);
			state.target = null;
	await chatStore.updateRoom("connected", false);
    await chatStore.updateRoom("id", "");
    await chatStore.updateRoom("partner", "");
 };

 
 
export const findNewRoom = async (data) => {
  try {
    state.loading = true;
    state.searching = true;
    
  
   const chatStore = useChatStore();
  
    fuck.srcObject = chatStore.localStream;
   
    fuck.onloadedmetadata = function () {
		
	 socket.emit("joinToQueue", { userId: data.userId, gender: data.gender, country: data.country });
console.log("here data: ",data);
   let t = setInterval(() => {
	 if(state.target) return;
console.warn(data)
	  	socket.emit("findRoom", data);
	  }, 5000);
	
}
}catch (error) {
    console.log(error);
    toast.error(error.message);
    state.loading = false;
    state.searching = false;
  }
};

socket.on('onLeaveRoom', async (data) => {
	console.log("on leave room");
	try {
    const chatStore = useChatStore();
    chatStore.handleLeave(false, true);
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
	console.log("makeOffer!!: ", data);
    state.target = data.to;
    
  try {
    const chatStore = useChatStore();
    await chatStore.createOffer(state.target, state.clientId);
    await chatStore.updateRoom("connected", false);
    await chatStore.updateRoom("id", data.roomId);
    await chatStore.updateRoom("partner", state.target);
    state.loading = false;
    state.searching = false;
}catch(e){console.error(e)}
})
socket.on("waitOffer", async (data) => {
	console.log("waitOffer!: ", data);
    state.target = data.from;
    const chatStore = useChatStore();
    await chatStore.updateRoom("connected", false);
    await chatStore.updateRoom("id", data.roomId);
    await chatStore.updateRoom("partner", state.target);
    state.loading = false;
    state.searching = false;
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
  state.searching = false;
  state.loading = false;
  console.log(data);
});

socket.on("onNewMessage", async (data) => {
  const chatStore = useChatStore()

  await chatStore.pushMessage(data)

  console.log(chatStore.messages);
});
