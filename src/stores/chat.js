import { defineStore } from "pinia";
import { reactive, ref, computed } from "vue";
import { socket, state } from "../socket";


export const useChatStore = defineStore("chat-store", () => {
  const peerConnection = ref(null);
  const localStream = ref(null);
  var stream=null;
  const remoteStream = ref(null);
  const messages = reactive([]);
  var roomId="1";
  const videoInput = reactive({input: undefined, input2:undefined});

  const roomDetails = reactive({
    id: "",
    connected: false,
    partner: "",
  });
const someEvent = new Event("hello", { cancelable: false });
  const init = async () => {
		let constraintsa = {
		audio:{
      echoCancellation: true,
      autoGainControl: true,
      noiseSuppression: true,
      channelCount: 1,
      sampleRate:48000,
      sampleSize: 16
    }, 
	video: {deviceId: videoInput.input ? {exact: videoInput.input} : undefined}
		};
		
		let constraints = { audio: true, video: true };
	 
	  try{
		 
   localStream.value = await navigator.mediaDevices.getUserMedia(constraints);
    document.body.click();
   // document.body.touch();
    //fuck.play();
  //  window.streami = localStream.value;
    
}catch(e){alert(e.name);console.log("hier "+e);}


  };
  
  async function changeCam(cam){
	  
	  let constraints={audio:{
      echoCancellation: {exact: true}
    }, video:{deviceId: cam ? {exact: cam} : undefined}}
    try{
		//alert("cam " + cam);
	let stream = await navigator.mediaDevices.getUserMedia(constraints);
	//localVideo.srcObject = stream;
	localStream.value = stream;	
	//window.streami = stream;
	
	
	if(!peerConnection.value) {
	//	alert("no peerConnection");
		return;
	}
	 let videoTrack = stream.getVideoTracks()[0];
	   var sender = peerConnection.value.getSenders().find(function(s) {
        return s.track.kind == videoTrack.kind;
      });
      
     await sender.replaceTrack(videoTrack);
	 
	 
	}catch(err){
		alert(err);
	}

  }
  
  
  function createPeer(){
	
//var conis = {iceTransportPolicy:"relay","iceServers":[{urls:["stun:45.89.66.167:3478"]},
//	{urls:["turn:45.89.66.167:3478?transport=udp","turn:45.89.66.167:5349?transport=tcp"]
//		,username:"alik",credential:"1234"}]};

	  try{
	   peerConnection.value = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
          ],
        },
        {
			urls: [
			"turn:45.89.66.167:3478?transport=udp",
			"turn:45.89.66.167:5349?transport=tcp",
			],
			username:"alik",
			credential:"1234"
		}
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
	handleLeave(false);
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
				handleLeave(false);
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
	
	peerConnection.value.createOffer({ offerToReceiveAudio: 1, offerToReceiveVideo: 1 }).then(function(offer){
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
	
		handleLeave(from);
		
		}
 
  const pushMessage = async (msg) => {
    messages.push(msg);
  };

  const updateRoom = async (key, value) => {
    roomDetails[key] = value;

    return roomDetails;
  };
  const updateVideoInput = (key, value)=>{
	  viedeoInput[key] = value;
	  return videoInput;
  }
 function handleLeave(from){
	 if(!roomDetails.id)return;
	if(from)socket.emit("leaveRoom", { to: from,  membersId: roomDetails.partner, roomId: roomDetails.id });
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
 // if(bool)  socket.emit("ready", { ready: true });
}
  const disconnect = async (userId) => {};
  //localStream.value.on
 const stopStream = ()=>{
	 if(localStream.value){
		localStream.value.getTracks().forEach(function(track){
			track.stop();
		});
 }
}
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
    stopStream,
    updateVideoInput,
    changeCam,
  };


})
