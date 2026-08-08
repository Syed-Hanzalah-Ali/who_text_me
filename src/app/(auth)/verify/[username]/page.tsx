'use client'

import { verifyCodeSchema } from "@/schema/verifyCodeSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams} from "next/navigation"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "@/components/ui/toast"
import { useState } from "react"
import axios from "axios"
import {FieldGroup, FieldLabel,Field, FieldError} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"


export default function page() {

    const params=useParams<{username:string}>()
    const router=useRouter()

    const [isVerifyingCode,setIsVerifyingCode]=useState(false)


    const form=useForm<z.infer<typeof verifyCodeSchema>>({
        resolver:zodResolver(verifyCodeSchema),
        defaultValues:{
            verifyCode:'',
            
        }
    })

    async function onSubmit(data:z.infer<typeof verifyCodeSchema>){
        console.log("data: ",data);
        
        try {
            setIsVerifyingCode(true)
            const response=await axios.post("/api/users/verify-code",{
                username:params.username,
                code:data.verifyCode
            })
            if(response.data.success){
                toast.add({
                    title:'Success',
                    description:response.data.message
                })
                router.replace('/sign-in')
            }
            
        } 
        catch (error:any) {
            console.log("error in verifying code: ",error);
            toast.add({
                title:'Error',
                description:error.response.data.message || "something went wrong"
            })
        }
        finally{
            setIsVerifyingCode(false)
        }
    }
    
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                    Verify Your Account
                </h1>
                <p className="mb-4">Enter the verification code sent to your email</p>

            </div>

            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                    <Controller
                        name="verifyCode"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="form-rhf-demo-title">
                                    Verification Code
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="form-rhf-demo-title"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="code"
                                    autoComplete="off"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </FieldGroup>
                <Button type="submit" disabled={isVerifyingCode}>
                    {
                        isVerifyingCode?
                        <>
                            Please wait
                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                        </>
                        :"Verify code"
                    }
                </Button>
            </form>
        </div>
    </div>
  )
}
