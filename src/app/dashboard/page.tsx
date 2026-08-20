'use client'
import MessageCard from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/components/ui/toast'
import { acceptMessagesSchema } from '@/schema/acceptMessages'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

export interface IMsg{
    _id:string
    content:string,
    to:string
}

export default function page() {

  const[messages,setMessages]=useState<IMsg[]>([])
  const [loading,setLoading]=useState(false)


  // remove deleted message from frontend
  async function handleDeleteMsg(messageId:string){
    setMessages((prevMsg)=>
      prevMsg.filter((msg)=>msg._id!== messageId))
  }

  const {data:session}=useSession()

  // form
  const form=useForm<z.infer<typeof acceptMessagesSchema>>({
    resolver:zodResolver(acceptMessagesSchema),
    defaultValues:{
      isAcceptingMessages:true
    }
  })
  // console.log("form: ",form);
  const {watch,setValue,register}=form
  console.log("watch: ",watch("isAcceptingMessages"));
  // console.log(setValue);
  const acceptingMessages=watch("isAcceptingMessages")

  // get messages api call
  async function getMessages(){
      try {
        setLoading(true)
        const response=await axios.get('/api/messages/get-messages')
        console.log(response);
        if(response.data.success){
          setMessages(response.data.messages)
          toast.add({
            title:"Success",
            description:"Messages loaded successfully",

          })
        }
        
      } 
      catch (error:any) {
        toast.add(
          {
            title:"Error",
            description:error.response.data.message || "Failed to fetch messages"
          }
        )  
      }
      finally{
        setLoading(false)
      }

    }
  useEffect(()=>{
    
    getMessages()
  },[])

  // accept messages status api call
  useEffect(()=>{
    async function getAcceptingMsgStatus(){
      try {
        const response=await axios.get('/api/messages/accept-messages')
        if(response.data.success){
          console.log("accepting: ",response.data.isAcceptingMessages);
          setValue("isAcceptingMessages",response.data.isAcceptingMessages)
          
        }
        
      } 
      catch (error:any) {
        toast.add(
          {
            title:"Error",
            description:error.response.data.message || "Failed to check status"
          }
        )
      }
    }
    getAcceptingMsgStatus()
  },[])

  // handleMsg status chage
  async function handleMsgStatusChange(){
    try {
      const response=await axios.post("/api/messages/accept-messages",{
        isAcceptingMessages:!acceptingMessages
      })
      if(response.data.success){
        setValue("isAcceptingMessages",!acceptingMessages)
        toast.add({
          description:response.data.message
        })
      }
    } 
    catch (error:any) {
      toast.add(
          {
            title:"Error",
            description:error.response.data.message || "Failed to change status"
          }
        )
    }
  }

  const username=session?.user?.username
  // console.log("username: ",username);

  const profileUrl=`${location.origin}/u/${username}`
  // console.log("base: ",url);
  
  
  function copyClipboard(){
    navigator.clipboard.writeText(profileUrl)
    toast.add({
      description:"Profile URL has been copied"
    })
  }
  

  if(!session || !session.user){
    return <div>Please login</div>
  }
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('isAcceptingMessages')}
          checked={acceptingMessages!}
          onCheckedChange={handleMsgStatusChange}
          
        />
        <span className="ml-2">
          Accept Messages: {acceptingMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          getMessages()
        }}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMsg}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  )
}
