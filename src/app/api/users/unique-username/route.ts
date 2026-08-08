import { DBconnect } from "@/lib/db.connect";
import { UserModel } from "@/models/user.model";
import { NextRequest,NextResponse } from "next/server";
import {success, z} from "zod";  

export async function GET(req:NextRequest){
    await DBconnect()
    // console.log("here unique username");
    

    try {
        const searchParams=req.nextUrl.searchParams
        const queryParam=searchParams.get("username")
        // console.log("search params: ",queryParam);
        

        const result=z.object({
            username:z.string().trim()
                .min(6,{message:"username must be of atleast 6 characters"})
                .max(20,{message:"username must be no more than 20 characters"})
                .regex(/^[a-zA-Z0-9_]+$/,{message:"username only contain letters, numbers and underscores"}),
        }).safeParse({username:queryParam})
        // console.log("zod result: ",result);

        if(!result.success){
            // console.log("flattened: ",z.formatError(result.error));
            
            const usernameErrors=z.treeifyError(result.error).properties?.username?.errors ||[]
            // console.log("tree: ",tree.properties?.username?.errors);
            // console.log("tree: ");
            
            return NextResponse.json(
                {success:result.success,message:usernameErrors.length>0?usernameErrors.join(", ")
                    : "Invalid query parameter"},
                {status:400}
            )
        }

        const {username}=result.data
        // console.log(username);
        
        const existingVerifiedUser=await UserModel.findOne({username,isVerified:true})
        if(existingVerifiedUser){
            // console.log("existed");
            
            return NextResponse.json(
                {success:false,message:"this username is not available"},
                {status:400}
            )
        }
        return NextResponse.json(
            {success:true,message:"username is unique"},
            {status:200}
        )
        
    } 
    catch (error) {
        return NextResponse.json(
            {success:false,message:"Error verifying unique username"},
            {status:500}
        )    
    }
}