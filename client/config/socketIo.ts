import {io,Socket} from "socket.io-client";

let socketInstance: Socket | null = null;

export const  initializeSocket = (projectId:number| string)=>{
    if(socketInstance){
        socketInstance.disconnect();
        socketInstance = null;
    }

    socketInstance = io(process.env.NEXT_PUBLIC_API_BASE_URL as string, {
        auth:{
            token: localStorage.getItem('token') || '',
        },
        query :{
            projectId: projectId.toString(),
        },
        
    });
    return socketInstance;
}

export const receiveMessage = (eventName: string, cb: (...args: any[]) => void) => {
  if (!socketInstance) return;
  socketInstance.on(eventName, cb);
};

export const sendMessage = (eventName: string, data: any) => {
  if (!socketInstance) return;
  socketInstance.emit(eventName, data);
};