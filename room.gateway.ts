import { OnModuleInit, UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { WsGuard } from "src/auth/jwt/ws.guard";
import { RoomGatewayService } from "./room.gateway.service";
import { FindNewRoomDto } from "./dto/findNewRoom.dto";
import { UserService } from "src/user/user.service";
import { User } from "src/user/schemas/user.schema";
import { LeaveRoomDto } from "./dto/leaveRoom.dto";
import { Queue } from "./queue";

@WebSocketGateway({ cors: true })
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {

    constructor(private readonly gatewayService: RoomGatewayService,
        private readonly userService: UserService) { }

    @WebSocketServer() 
    private server: Server;
    
    queue: Queue[] = [];// здесь я предлагаю не массив использовать , а queue = new Map();

    async handleConnection(@ConnectedSocket() socket: Socket) {
        this.queue.push({
            socketId: socket.id
        } as Queue);        

        console.log(this.queue);
         this.server.to(socket.id).emit('onConnection', { connectionId: socket.id });
        
        
    }

    async handleDisconnect(@ConnectedSocket() socket: Socket) {   
        let queue = this.queue.find(queue => queue.socketId === socket.id);
        if (queue) {
            var index = this.queue.indexOf(queue);
            if (index !== -1) {
                this.queue.splice(index, 1);
            }
        }      
    }

    //@UseGuards(WsGuard)
    @SubscribeMessage('joinToQueue')
    async joinToQueue(@MessageBody() dto: FindNewRoomDto, @ConnectedSocket() socket: Socket) {
        let user = await this.userService.getUserById(dto.userId).catch((e) => {
            this.server.to(socket.id).emit('onException', {
                statusCode: e.status,
                message: e.message
            });

            stop();
        }) as User;
console.log("*** ON JOIN QUEUE ***: ", dto);
        this.queue.push({
            socketId: socket.id,
            userId: dto.userId,
            gender: dto.gender,
            country: dto.country,
            isBusy: false
        });

        socket.emit("onJoinToQueue", {
            status: "OK"
        });
    }

    //@UseGuards(WsGuard)
    @SubscribeMessage('findRoom')
    async findNewRoom(@MessageBody() dto: FindNewRoomDto, @ConnectedSocket() socket: Socket) {
        let partnerQueue = this.queue.find(queue => queue.country === dto.country 
              && queue.gender === dto.gender 
              && queue.socketId !== socket.id
             && !queue.isBusy
              );
              console.log("*** ON FIND ROOM *** : ", dto);
          if (!partnerQueue){            
              partnerQueue = this.queue.find(queue => (queue.country === dto.country 
                  || queue.gender === dto.gender) 
                  && queue.socketId !== socket.id
                  && !queue.isBusy);
          } 
          if (!partnerQueue) {
              partnerQueue = this.queue.find(queue => !queue.isBusy && queue.socketId !== socket.id);
          }
          if(!partnerQueue){console.log("***NOT FOUND ***");return;}
          console.log("[]=> ", this.queue);
          let myQueue = this.queue.find(queue => queue.socketId === socket.id);
          //this.queue = [];
          //console.log("[]=> ", this.queue);
          let roomId = await this.gatewayService.create([dto.userId, partnerQueue.userId]).catch((e) => {
              this.server.to(socket.id).emit('onException', {
                  statusCode: e.status,
                  message: e.message
              });
  
              stop();
          });
   
          socket.join(roomId);
          myQueue.isBusy = true;
  
          const partnerSocket = this.server.sockets.sockets.get(partnerQueue.socketId);
         if(partnerSocket) partnerSocket.join(roomId);
          partnerQueue.isBusy = true;
          
          this.server.to(partnerQueue.socketId).emit("waitOffer", {from: socket.id, roomId: roomId, gender: dto.gender, country: dto.country});
          this.server.to(socket.id).emit("makeOffer", {to: partnerQueue.socketId, roomId: roomId, gender: partnerQueue.gender, country: partnerQueue.country});
      
      let a = {
			roomId: roomId,
             socketId:socket.id,
              partner: {
                  id: partnerQueue.userId,
                 socketId: partnerQueue.socketId,
                  gender: partnerQueue.gender,
                  country: partnerQueue.country
              },
              userId: dto.userId,
              gender: dto.gender,
              country: dto.country
		  }
		  console.log("*** A ***: ", a);
       //   this.server.to(roomId).emit('onFindRoom', a );
    }

    //@UseGuards(WsGuard)
    @SubscribeMessage('leaveRoom')
    async onLeaveRoom(@MessageBody() dto: LeaveRoomDto, @ConnectedSocket() socket: Socket) {
		console.log("*** LEAVEROOM ***: ", dto);
        await this.gatewayService.leave(dto).catch((e) => {
            this.server.to(socket.id).emit('onException', {
                statusCode: e.status,
                message: e.message
            });

          stop();// undefined
        });

        this.server.to(dto.roomId).emit('onLeaveRoom', {
            membersId: dto.membersId,//clientId (from)
            roomId: dto.roomId 
        });

        this.queue.forEach(item => {
            dto.membersId.forEach(id => {// is not a function
                if (item.userId === id) {
                    item.isBusy = false;
                    const memberSocket = this.server.sockets.sockets.get(item.socketId);
                    memberSocket.leave(dto.roomId);
                }
            });
        });
        console.log("*** ON leave []=> ", this.queue);
    }

    //@UseGuards(WsGuard)
    @SubscribeMessage('offer')
    handleOffer(@MessageBody() data: { offer: any, roomId: string }) {
        this.server.to(data.roomId).emit('offer', data.offer);
    }

    //@UseGuards(WsGuard)
    @SubscribeMessage('answer')
    handleAnswer(@MessageBody() data: { answer: any, roomId: string }) {
        this.server.to(data.roomId).emit('answer', data.answer);
    }

    //@UseGuards(WsGuard)
    @SubscribeMessage('iceCandidate')
    handleIceCandidate(@MessageBody() data: { candidate: any, roomId: string }) {
        this.server.to(data.roomId).emit('iceCandidate', data.candidate);
    }
}
