"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import axios,{AxiosError} from "axios"
import { toast } from "@/components/ui/toast"
import {  useState } from "react"
import { ApiResponse } from "@/types/ApiResponse"
import {Field, FieldGroup, FieldLabel, FieldError} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signInSchema } from "@/schema/signInSchema"
import {signIn} from "next-auth/react"
import { resumeToPipeableStream } from "react-dom/server"


// const formSchema=z.object({

// })

export default function page() {
    
    const [loading,setLoading]=useState(false)
    const router=useRouter()


    const form=useForm<z.infer<typeof signInSchema>>({
        resolver:zodResolver(signInSchema),
        defaultValues:{
            identifier:'',
            password:''
        }
    })

    
    // submitting form
    async function onSubmit(data: z.infer<typeof signInSchema>) {
        // Do something with the form values.
            setLoading(true)
            const response=await signIn('credentials',{
                redirect:false,
                identifier:data.identifier,
                password:data.password
            })
            console.log(response);
            if(response?.error){
                toast.add({
                    title:'Error',
                    description:response.error

                })
            }
            if(response?.ok){
                toast.add({
                    title:'Success',
                    description:"User logged-In successfully"
                    
                })
                router.replace("/dashboard")
            }
            setLoading(false)
            
            

        
    }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                    Sign-In
                </h1>
                {/* <p className="mb-4">Sign up to start your anonymous adventure</p> */}
            </div>

            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>


                    <Controller
                        name="identifier"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-rhf-demo-title">
                                username/email
                            </FieldLabel>
                            <Input
                                {...field}
                                id="form-rhf-demo-title"
                                aria-invalid={fieldState.invalid}
                                placeholder="Identifier"
                                autoComplete="off"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="password"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-rhf-demo-title">
                                Password
                            </FieldLabel>
                            <Input
                                {...field}
                                type="password"
                                id="form-rhf-demo-title"
                                aria-invalid={fieldState.invalid}
                                placeholder="**********"
                                autoComplete="off"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                            </Field>
                        )}
                    />
                </FieldGroup>

                <Button type="submit" disabled={loading}>
                    {
                    loading?
                    <>
                        Please wait
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                    </>
                    :"Sign In"
                    }
                </Button>
            </form>

            <div className="text-center mt-4">
                <p>
                    Don't have an account?{' '}
                    <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
                    Sign up
                    </Link>
                </p>
            </div>

        </div>
    </div>
  )
}
