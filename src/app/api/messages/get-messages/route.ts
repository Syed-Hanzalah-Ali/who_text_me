import { DBconnect } from "@/lib/db.connect";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { UserModel } from "@/models/user.model";
import mongoose from "mongoose";
import { msgModel } from "@/models/message.model";

export async function GET(req:NextRequest){
    await DBconnect()

    const session=await getServerSession(authOptions)
    const user:User=session?.user
    if(!session){
        return NextResponse.json(
            {success:false,message:"Not authenticated"},
            {status:401}
        )
    }

    try {
        // mongoose object ID 
        const userId=new mongoose.Types.ObjectId(user._id)
        // user only get his own messages
        const messages=await msgModel.aggregate([
            {
                $match:{to:userId}
            },
            {
                $sort:{createdAt:-1}
            }
        ])
        if(!messages){
            return NextResponse.json(
                {success:false,message:"no messages found"},
                {status:404}
            )    
        }
        return NextResponse.json(
            {success:true,messages},
            {status:200}
        )
        
    } 
    catch (error) {
        return NextResponse.json(
            {success:false,message:"Failed to get messages"},
            {status:500}
        )    
    }

}