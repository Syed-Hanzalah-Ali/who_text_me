import mongoose from "mongoose";


const connectionObject:{host?:string}={
    
}

export async function DBconnect():Promise<void>{
    // console.log("here");
    if(connectionObject.host){
        console.log("Already connected");
        return;
    }
    
    try {
        const connectionInstance=await mongoose.connect(process.env.MONGO_URI||"")
        connectionObject.host=connectionInstance.connection.host
        console.log("Database connected: ",connectionObject.host);
    } 
    catch (error) {
        console.log("DB connection failed, ",error);
        process.exit(1)
            
    }
}
