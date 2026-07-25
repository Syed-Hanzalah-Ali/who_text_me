import { NextRequest,NextResponse } from "next/server";
import { DBconnect } from "@/lib/db.connect";
import { UserModel } from "@/models/user.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";
import { ApiResponse } from '@/types/ApiResponse';


export async function POST(req:NextRequest){
    await DBconnect()
    console.log("Request Object: ",Request);
    console.log("NextRequest Object: ",NextRequest);

    try {
        const {username,email,password}=await req.json()
        const existedVerifiedUserByUsername=await UserModel.findOne({username,isVerified:true})

        if(existedVerifiedUserByUsername){
            return Response.json(
                {success:false,message:"username is already taken"} as ApiResponse,
                {status:400}
            )
        }

        const existedUserByEmail=await UserModel.findOne({email})

        const verifyCode=Math.floor(100000+Math.random()*900000).toString()
        const expiryDate=new Date()
        expiryDate.setHours(expiryDate.getHours()+1)

        if(existedUserByEmail){
            
            if(existedUserByEmail.isVerified){
                return Response.json(
                    {success:false,message:"email is already taken"} as ApiResponse,
                    {status:400}
                )
            }
            else{
                existedUserByEmail.verifyCode=verifyCode
                existedUserByEmail.verifyCodeExpiry=expiryDate
                await existedUserByEmail.save()
            }
        }
        else{
            const hashedPassword=await bcrypt.hash(password,10)

            const newUser=await UserModel.create({
                username,
                email,
                password:hashedPassword,
                verifyCode,
                verifyCodeExpiry:expiryDate
            })
        }

        const emailResponse=await sendVerificationEmail(username,email,verifyCode)
        
        if(!emailResponse.success){
            return Response.json(
                {success:false,message:emailResponse.message} as ApiResponse,
                {status:500}
            )
        }
        return Response.json(
            {success:true,message:"user registered successfully"} as ApiResponse,
            {status:201}
        )

    } 
    catch (error) {
        console.log("Error while registering User ",error);
        
        return Response.json(
            {success:false,message:"Error registering user"} as ApiResponse,
            {status:500}
        )
    }
}