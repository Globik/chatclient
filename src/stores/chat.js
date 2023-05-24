import { defineStore } from "pinia";
import { reactive, ref, computed } from "vue";
import { socket, state } from "../socket";

export const useChatStore = defineStore("chat-store", () => {
  const peerConnection = ref(null);
  const localStream = ref(null);
  const stream=null;
  const remoteStream = ref(/*new MediaStream()*/null);
  const messages = reactive([]);
  var roomId="1";
  const roomDetails = reactive({
    id: "",
    connected: false,
    partner: "",
  });

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
     // e.streams[0].getTracks().forEach((track) => {
       // remoteStream.value.addTrack(track);
        if(remoteStream.value.srcObject){return;}
        remoteStream.value.srcObject = streams[0];
      };
    
}else{
	peerConnection.value.addStream(localStream.value);
	peerConnection.value.onaddstream = function(e){
		remoteVideo.value.srcObject = e.stream;
	}
}

    peerConnection.value.onnegotiationneeded = async () => {
     /* const offer = await peerConnection.value.createOffer();
      await peerConnection.value.setLocalDescription(offer);
//console.log("onnegotiationneeded", offer)
      socket.emit("offer", { offer, roomId });
      console.log("offer sent: ", { offer, roomId });
      */
    };

    peerConnection.value.onicecandidate = (iceEvent) => {
      if (iceEvent && iceEvent.candidate) {
        socket.emit('iceCandidate', {candidate: iceEvent.candidate, roomId })
      }
    };
    peerConnection.value.oniceconnectionstatechange = iceConnectionStateChange;
	peerConnection.value.onconnectionstatechange = onConnectionStateChange;
	
    peerConnection.value.onicegatheringstatechange = gatheringStateChange;
    peerConnection.value.onicecandidateerror = iceCandidateError;
   
    peerConnection.value.onsignalingstatechange = onSignalingState;
  };
  
 function onConnectionStateChange(e){
	console.log('connection state: ' + peerConnection.value.connectionState);

	if(peerConnection.value.connectionState == "failed" || peerConnection.value.connectionState == "closed"){
	//	handleLeave();
}
}


function iceConnectionStateChange(e){
		if(peerConnection.value) {
			console.log('ice connection state: ', peerConnection.value.iceConnectionState);
		
			if(peerConnection.value.iceConnectionStateChange == "checking"){
				
			}else if(peerConnection.value.iceConnectionState == "connected"){
				//wsend({type: "unfertig", target: targetId});
				
				//remoteVideoBox.className = "";
				//btnStart.disabled = false;
				}else if(peerConnection.value.iceConnectionState == "failed" || peerCoonection.value.iceConnectionState == "disconnected"){
				
				//handleLeave();
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

const createOffer = async(roomId, from)=>{
	createPeer();
	peerConnection.value.createOffer().then(function(offer){
		return peerConnection.value.setLocalDescription(offer);
	}).then(function(){
	
		//wsend({'type': 'offer', offer: pc.localDescription, target: target, from: clientId});
		socket.emit("offer", {roomId: roomId, offer: peerConnection.value.localDescription, from: from});
	}).catch(function(err){alert(err);});
}
  const createAnswer = async (offer, roomId) => {
	  createPeer();
    await peerConnection.value.setRemoteDescription(offer);

    let answer = await peerConnection.value.createAnswer();
    await peerConnection.value.setLocalDescription(answer);

    socket.emit("answer", { answer: peerConnection.value.localDescription, roomId });
    console.log("Answer sent: ", { answer, roomId });
  };
  
  
  const addAnswer = async (answer) => {
   // if (!peerConnection.value.currentLocalDescription) {
   try{
    await  peerConnection.value.setRemoteDescription(answer);
}catch(e){alert(e);}
  //  }
  };

  const pushMessage = async (msg) => {
    messages.push(msg);
  };

  const updateRoom = async (key, value) => {
    roomDetails[key] = value;

    return roomDetails;
  };

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
    messages,
    pushMessage,
    roomDetails,
    updateRoom,
  };
});

