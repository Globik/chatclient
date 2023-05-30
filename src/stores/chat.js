import { defineStore } from "pinia";
import { reactive, ref, computed } from "vue";
import { socket, state } from "../socket";

export const useChatStore = defineStore("chat-store", () => {
  const peerConnection = ref(null);
  const localStream = ref(null);
  const stream=null;
  const remoteStream = ref(null);
  const messages = reactive([]);
  var roomId="1";
  const roomDetails = reactive({
    id: "",
    connected: false,
    partner: "",
  });
const someEvent = new Event("hello", { cancelable: false });
  const init = async () => {
	 // alert('init');
	 
	  try{
		 
   localStream.value = await navigator.mediaDevices.getUserMedia({
      video:true,
      audio: true
    });
    
}catch(e){console.log("hier "+e);}


  };
  
  
  
  
  function createPeer(){
	  try{
	   peerConnection.value = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
          ],
        },
      ],
    });
}catch(e){
	
	console.error(e);
	return;
	}
	
	
	
	
     localStream.value.getTracks().forEach((track) => {
      peerConnection.value.addTrack(track, localStream.value);
    });
if('ontrack' in peerConnection.value){
    peerConnection.value.ontrack = ({track, streams}) => {
		track.onunmute = function(){
    if(REMOTE.srcObject)return;
    REMOTE.srcObject = streams[0];
  };
  streams[0].onremovetrack = ({ track }) => {
    console.log(track.kind + " track was removed.");
    if (!streams[0].getTracks().length) {
      console.log("stream " + streams[0].id + " emptied (effectively removed).");
    }
  };
      };
    
}else{
	peerConnection.value.addStream(localStream.value);
	peerConnection.value.onaddstream = function(e){
		remoteVideo.value.srcObject = e.stream;
	}
}

    peerConnection.value.onnegotiationneeded = async () => {
    
    };

    peerConnection.value.onicecandidate = (iceEvent) => {
      if (iceEvent && iceEvent.candidate) {
        socket.emit('iceCandidate', {candidate: iceEvent.candidate, roomId: roomDetails.partner })
      }
    };
    peerConnection.value.oniceconnectionstatechange = iceConnectionStateChange;
	peerConnection.value.onconnectionstatechange = onConnectionStateChange;
	
    peerConnection.value.onicegatheringstatechange = gatheringStateChange;
    peerConnection.value.onicecandidateerror = iceCandidateError;
   
    peerConnection.value.onsignalingstatechange = onSignalingState;
  };
  
 function onConnectionStateChange(e){
	 if(!peerConnection.value) return;
	console.log('connection state: ' + peerConnection.value.connectionState);

	if(peerConnection.value.connectionState == "failed" || peerConnection.value.connectionState == "closed" || peerConnection.value.connectionState == "disconnected"){
	//second
	handleLeave(false, true);
}
}


function iceConnectionStateChange(e){
		if(peerConnection.value) {
			console.log('ice connection state: ', peerConnection.value.iceConnectionState);
		
			if(peerConnection.value.iceConnectionStateChange == "checking"){
				
			}else if(peerConnection.value.iceConnectionState == "connected"){
				//wsend({type: "unfertig", target: targetId});
			
				fuck.dispatchEvent(someEvent);
				//remoteVideoBox.className = "";
				//btnStart.disabled = false;
				updateRoom("connected", true);
				//updateRoom("id", roomDetails.partnerId);
				//updateRoom("partner", roomDetails.partner );
				}else if(peerConnection.value.iceConnectionState == "failed" || 
				peerConnection.value.iceConnectionState == "disconnected"){
				//first
				handleLeave(false, true);
			}else{}
		}
	}

function gatheringStateChange() {
  if(peerConnection.value.iceGatheringState == "complete"){
	
  }}

  function iceCandidateError(e) {
	console.error("ice candidate err: ", e.url, e.errorText );
}

function onSignalingState(e){
	console.log("signaling state: " + peerConnection.value.signalingState);
}

const handleCandidate = (candidate)=>{
		var cand = new RTCIceCandidate(candidate);
		peerConnection.value.addIceCandidate(cand).then(function(){
		}).catch(function(e){console.error(e)});
}

const createOffer = async(target, from)=>{
	console.log("*** CREATING OFFER *** ", target, " ", from);
	roomDetails.partner = target;
	createPeer();
	
	peerConnection.value.createOffer().then(function(offer){
		return peerConnection.value.setLocalDescription(offer);
	}).then(function(){
	console.log(" *** SENDING OFFER ***");
	if(!peerConnection.value.localDescription){
		console.log("RETURN ***");
		return;
	}
	let d = {roomId: target, offer: peerConnection.value.localDescription, from: from};
	console.log("target:", target, " from: ", from);
		//wsend({'type': 'offer', offer: pc.localDescription, target: target, from: clientId});
		socket.emit("offer", d);
	}).catch(function(err){console.error(err);});
}
  const createAnswer = async (offer, roomId, clientId) => {
	 // alert(offer);
	  roomDetails.partner = roomId;
	  createPeer();
	  try{
    await peerConnection.value.setRemoteDescription(offer);

    let answer = await peerConnection.value.createAnswer();
    await peerConnection.value.setLocalDescription(answer);

    socket.emit("answer", { answer: peerConnection.value.localDescription, roomId : roomId, from: clientId});
    console.log("Answer sent: ", "to: ", roomId, "from: ", clientId);
}catch(e){console.error(e);}
  };
  
  
  const addAnswer = async (answer) => {
   try{
	// console.log(peerConnection.value.signalingState);
    await  peerConnection.value.setRemoteDescription(answer);
}catch(e){
	console.error(e);
	}
  
  };
 const leavePeer = (from) => {
	
		handleLeave(from, false);
		
		if(fuck.srcObject){
		fuck.srcObject.getTracks().forEach(function(track){
			track.stop();
		});
		}
		}
 
  const pushMessage = async (msg) => {
    messages.push(msg);
  };

  const updateRoom = async (key, value) => {
    roomDetails[key] = value;

    return roomDetails;
  };
  
 function handleLeave(from, bool){
	if(from)socket.emit("leaveRoom", { membersId: from, roomId: roomDetails.partner });
	if(!peerConnection.value) return;
	 if(REMOTE.srcObject){
		REMOTE.srcObject.getTracks().forEach(function(track){
			track.stop();
		});
	}
		peerConnection.value.close();
		console.log("pc: ", peerConnection.value.signalingState);
	    REMOTE.srcObject = null;
    peerConnection.value.ontrack = null;

	peerConnection.value.onicecandidate = null;
	peerConnection.value.oniceconnectionstatechange = null;
	peerConnection.value.onconnectionstatechange = null;
	
    peerConnection.value.onicegatheringstatechange = null;
    peerConnection.value.onicecandidateerror = null;
    peerConnection.value.onnegotiationneeded = null;
    peerConnection.value.onsignalingstatechange = null;
	peerConnection.value = null;
	updateRoom("connected", false);
    updateRoom("id", "");
    updateRoom("partner", "");
  if(bool)  socket.emit("ready", { ready: true });
	//btnStart.disabled = true;
}
  const disconnect = async (userId) => {};
  //localStream.value.on
 
  return {
    init,
    localStream,
    remoteStream,
    peerConnection,
    disconnect,
    createOffer,
    createAnswer,
    addAnswer,
    handleCandidate,
    leavePeer,
    messages,
    pushMessage,
    roomDetails,
    updateRoom,
    handleLeave,
  };


})
