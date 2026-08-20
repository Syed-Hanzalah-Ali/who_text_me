import { DBconnect } from "@/lib/db.connect";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/options";
import { UserModel } from "@/models/user.model";
import mongoose from "mongoose";
import { msgModel } from "@/models/message.model";


// dynamic is object that has property params, that params property contains a promise
// when this promise resolves it give object containing dynamic data {key:value}
export async function DELETE(req:NextRequest,dynamic:{params:Promise<{messageId:string}>}){
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
        // console.log(params);
        const {messageId}=await dynamic.params
        // console.log("message id: ",messageId);
        
        const deletedMessage=await msgModel.findOneAndDelete({
            _id:messageId,
            to:user._id
        
        })
        // console.log("message: ",message);
        // console.log("user: ",user);
        if(!deletedMessage){
            return NextResponse.json(
                {success:false,message:"Message not found"},
                {status:404}
            )
        }
        return NextResponse.json(
                {success:true,message:"Message deleted successfully"},
                {status:200}
            )
        
    } 
    catch (error) {
        console.log("delete message catch: ",error);
        
        return NextResponse.json(
            {success:false,message:"Failed to delete messages"},
            {status:500}
        )
    }
}