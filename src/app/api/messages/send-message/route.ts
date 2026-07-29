import { DBconnect } from "@/lib/db.connect";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { UserModel } from "@/models/user.model";
import mongoose from "mongoose";
import { msgModel } from "@/models/message.model";
import { messageSchema } from "@/schema/messageSchema";
import {z} from "zod";


export async function POST(req:NextRequest){
    await DBconnect()

    try {
        const {username,content}=await req.json()
        
        const user=await UserModel.findOne({username})
        if(!user){
            return NextResponse.json(
                {success:false,message:"no user found with this username"},
                {status:404}
            )    
        }

        if(!user.isAcceptingMessage){
            return NextResponse.json(
                {success:false,message:"This user is not accepting messages"},
                {status:400}
            )
        }

        const result=messageSchema.safeParse({content})
        if(!result.success){
            const messageErrors=z.treeifyError(result.error).properties?.content?.errors||[]
            return NextResponse.json(
                {success:result.success,message:messageErrors.length>0?messageErrors.join(", ")
                    : "Invalid message format"},
                {status:400}
            )
        }

        const newMsg=await msgModel.create({
            content,
            to:user._id
        })

        return NextResponse.json(
            {success:true,message:"message sent successfully"},
            {status:201}
        )


    } 
    catch (error) {
        return NextResponse.json(
            {success:false,message:"Failed to send messages"},
            {status:500}
        )
    }
}