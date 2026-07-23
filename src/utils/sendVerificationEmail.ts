import { Resend } from 'resend';
import {EmailTemplate} from "../../components/email-template"
import { ApiResponse } from '@/types/ApiResponse';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(username:string,email:string,otp:string):Promise<ApiResponse>{
    try {

        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'who-text-me | Verification Email',
            react: EmailTemplate({ username,otp }),
        });


        return {success:true,message:"verification email send successfully"}
    } 
    catch (error) {
        console.log("error while sending verification email");
        
        return {success:false,message:"Failed to send verification email"}
    }
}