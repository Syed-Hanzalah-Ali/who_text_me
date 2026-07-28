import { DBconnect } from "@/lib/db.connect";
import { NextRequest,NextResponse } from "next/server";
import { verifyCodeSchema } from "@/schema/verifyCodeSchema";
import { UserModel } from "@/models/user.model";
import z from "zod";

export async function POST(req:NextRequest){
    await DBconnect()

    try {
        const {username,code}=await req.json()
        // console.log(username," ",code);
        

        const user=await UserModel.findOne({username})
        // console.log(user);
        
        if(!user){
            return NextResponse.json(
                {success:false,message:"username not found"},
                {status:400}
            )
        }
        const result=verifyCodeSchema.safeParse({verifyCode:code})
        if(!result.success){
            const codeErrors=z.treeifyError(result.error).properties?.verifyCode?.errors || []
            // console.log("codeErrors: ",codeErrors);
            
            return NextResponse.json(
                {success:false,message:codeErrors.length>0?codeErrors.join(", "):"Invalid verification code"},
                {status:400}
            )
        }

        
        const isVerifiedCode=user.verifyCode===code
        const isCodeNotExpired=new Date(user.verifyCodeExpiry) > new Date()
        
        if(isVerifiedCode && isCodeNotExpired){
            // console.log("getting here");
            user.isVerified=true
            user.verifyCode=""
            await user.save()

            return NextResponse.json(
                {success:true,message:"user verified successfully"},
                {status:200}
            )
        }
        else if(!isCodeNotExpired){
            return NextResponse.json(
                {success:false,message:"verification code has expired, please signup again"},
                {status:400}
            )
        }
        return NextResponse.json(
            {success:false,message:"Incorrect verification code"},
            {status:400}
        )

    } 
    catch (error) {
        console.log("error in catch: ",error);
        
        return NextResponse.json(
            {success:false,message:"Error while verifying code"},
            {status:500}
        )
    }
}