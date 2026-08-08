"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import axios,{AxiosError} from "axios"
import { useDebounceValue,useDebounceCallback } from 'usehooks-ts'
import { toast } from "@/components/ui/toast"
import { useEffect, useState } from "react"
import { signUpSchema } from "@/schema/signUpSchema"
import { ApiResponse } from "@/types/ApiResponse"
import {Field, FieldGroup, FieldLabel, FieldError} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"


// const formSchema=z.object({

// })

export default function page() {
    const [username,setUsername]=useState('')
    const [uniqueUsernameMsg,setUniqueUsernameMsg]=useState(null)
    const [loading,setLoading]=useState(false)
    const [isCheckingUsername,setIsCheckingUsername]=useState(false)

    const debounced = useDebounceCallback(setUsername, 300)

    const router=useRouter()


    const form=useForm<z.infer<typeof signUpSchema>>({
        resolver:zodResolver(signUpSchema),
        defaultValues:{
            username:'',
            email:'',
            password:''
        }
    })

    // check unique username
    // first runs when page load, after that when ever debounceValue changes
    useEffect(()=>{
        async function checkUniqueUsername(){
            if(username){

                try {
                    setUniqueUsernameMsg(null)
                    setIsCheckingUsername(true)
                    const response= await axios.get(`/api/users/unique-username?username=${username}`)
                    console.log("response : ",response);
                    setUniqueUsernameMsg(response.data.message)
                    
                } 
                catch (error:any) {
                    console.log("cathc error: ",error);
                    
                    setUniqueUsernameMsg(error.response.data.message)
                }
                finally{
                    setIsCheckingUsername(false)
                }
            }
        }

        checkUniqueUsername()
    },[username])
    // console.log("unique username msg: ",uniqueUsernameMsg);
    
    // submitting form
    async function onSubmit(data: z.infer<typeof signUpSchema>) {
        // Do something with the form values.
        try {
            setLoading(true)
            const response=await axios.post(`/api/users/signup`,data)
            if(response.data.success){
                toast.add({
                    title:'Success',
                    description:response.data.message
                })
                router.replace(`/verify/${username}`)
            }

        } 
        catch (error:any) {
            console.log("error in user registration: ",error);
            toast.add({
                title:'Error',
                description:error.response.data.message || "something went wrong"
            })
            
        }
        finally{
            setLoading(false)
        }
        
    }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                    Join Who Text Me
                </h1>
                <p className="mb-4">Sign up to start your anonymous adventure</p>
            </div>

            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>

                    <Controller
                        name="username"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="form-rhf-demo-title">
                                    Username
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="form-rhf-demo-title"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Ex: Hanzalah1062"
                                    autoComplete="off"
                                    onChange={(e)=>{
                                        field.onChange(e)
                                        debounced(e.target.value)
                                    }}
                                />
                                {isCheckingUsername&&<Loader2 className="animate-spin h-4 w-4 text-left"/>}
                                <p className={`text-sm ${uniqueUsernameMsg==="username is unique"?"text-green-500"
                                    :"text-red-500"
                                }`}>{uniqueUsernameMsg}</p>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                        />

                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-rhf-demo-title">
                                Email
                            </FieldLabel>
                            <Input
                                {...field}
                                id="form-rhf-demo-title"
                                aria-invalid={fieldState.invalid}
                                placeholder="Ex: Hanzalah1062@gmail.com"
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
                    :"Sign Up"
                    }
                </Button>
            </form>

            <div className="text-center mt-4">
                <p>
                    Already have an account?{' '}
                    <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                    Sign in
                    </Link>
                </p>
            </div>

        </div>
    </div>
  )
}
