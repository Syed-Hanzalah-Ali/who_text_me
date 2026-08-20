import { DBconnect } from "@/lib/db.connect";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { UserModel } from "@/models/user.model";

// toggle the accepting messages status
export async function POST(req:NextRequest){
    await DBconnect()

    const session=await getServerSession(authOptions)
    console.log(session);
    const user:User=session?.user

    if(!session){
        return NextResponse.json(
            {success:false,message:"Not authenticated"},
            {status:401}
        )
    }

    
    try {
        const userId=user._id
        const {isAcceptingMessages}=await req.json()

        const updatedUser=await UserModel.findByIdAndUpdate(userId,{
            isAcceptingMessage:isAcceptingMessages
        },{returnDocument:"after"})

        if(!updatedUser){
            return NextResponse.json(
                {success:false,message:"failed to update user status of accepting messages"},
                {status:401}
            )    
        }
        return NextResponse.json(
            {success:true,message:"accepting messages status updated successfully",updatedUser},
            {status:200}
        )
    } 
    catch (error) {
        return NextResponse.json(
            {success:false,message:"Failed to change accepting messages status"},
            {status:500}
        )    
    }
    
}

// get the status of accepting message
export async function GET(req:NextRequest){
    await DBconnect()

    const session=await getServerSession(authOptions)
    console.log(session);
    const user:User=session?.user

    if(!session){
        return NextResponse.json(
            {success:false,message:"Not authenticated"},
            {status:401}
        )
    }

    try {
        const userId=user._id
        const foundUser=await UserModel.findById(userId)
        if(!foundUser){
            return NextResponse.json(
                {success:false,message:"user not found"},
                {status:404}
            )
        }

        return NextResponse.json(
            {success:true,isAcceptingMessages:foundUser.isAcceptingMessage},
            {status:200}
        )
        
    } 
    catch (error) {
        return NextResponse.json(
            {success:false,message:"Failed to change accepting messages status"},
            {status:500}
        )
    }
}