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

socket.on("connect", (s) => {
  state.connected = true;
 // alert(s);
});

socket.on("disconnect", () => {
  state.connected = false;
});

export const findNewRoom = async (data) => {
  try {
    state.loading = true;
    state.searching = true;
    
  
   const chatStore = useChatStore();
  
    fuck.srcObject = chatStore.localStream;
    
    fuck.onloadedmetadata = function () {
		
	 socket.emit("joinToQueue", { userId: data.userId });
console.log(data);
   let t = setInterval(() => {
	  if(!state.target)	socket.emit("findRoom", data);}, 5000);
}
}catch (error) {
    console.log(error);
    toast.error(error.message);
    state.loading = false;
    state.searching = false;
  }
};

socket.on("onFindRoom", async (data) => {
	return;
	console.log("ROOM FOUNDED!: ", data);

  try {
    const chatStore = useChatStore();
     state.clientId = data.socketId;
    state.target = data.partner.socketId;
   // await chatStore.createOffer(data.roomId);
   await chatStore.createOffer(state.target, state.clientId);
    toast.success(`You connected with ${data.partner.id}`);
    await chatStore.updateRoom("connected", true);
    await chatStore.updateRoom("id", data.roomId);
    await chatStore.updateRoom("partner", data.partner.id);
   

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
	 state.clientId = data.from;
    state.target = data.to;
})
socket.on("waitOffer", async (data) => {
	console.log("waitOffer!: ", data);
	 state.clientId = data.from;
    state.target = data.to;
});
socket.on("onOffer", async (data) => {
	alert("onOffer!");
  try {
    const chatStore = useChatStore();

   //  await chatStore.createAnswer(data.offer, data.roomId);
		await chatStore.createAnswer(data.offer, data.target);
    console.log(data);
  } catch (error) {
    console.log(error);
    toast.error(error.message);
    state.loading = false;
    state.searching = false;
  }
});

socket.on("onAnswer", async (data) => {
  const chatStore = useChatStore();

  await chatStore.addAnswer(data.answer);

  console.log(data);
});

socket.on("onJoinToQueue", (data) => {
  console.log(data);
});

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
