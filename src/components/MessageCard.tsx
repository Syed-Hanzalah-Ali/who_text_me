'use client'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Trash2Icon } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { IMsg } from "@/app/dashboard/page"
import axios from "axios"
import { toast } from "./ui/toast"


type msg={
  message:IMsg,
  onMessageDelete:(messageId:string)=>void
}
export default function MessageCard({message,onMessageDelete}:msg) {

    async function handleDeleteMsg(){
      try {
        console.log("handle delete called");
        
        const response=await axios.delete(`/api/messages/delete-message/${message._id}`)
        if(response.data.success){
          toast.add({
            description:response.data.message
          })
          onMessageDelete(message._id)
        }
      } 
      catch (error:any) {
        toast.add({
          title:"Error",
          description:error.response.data.message || "something went wrong while deleting message"
        })
      }
    }

  return (
    <Card className="w-full max-w-sm">
      
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          {message.content}
        </CardDescription>
        <AlertDialog>

            <AlertDialogTrigger
                render={<Button variant="destructive">Delete Message</Button>}
            />

            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                    <Trash2Icon />
                </AlertDialogMedia>
                <AlertDialogTitle>Delete Message?</AlertDialogTitle>
                <AlertDialogDescription>
                    Are you sure you want to delete this message?
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteMsg} variant="destructive">Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
    </AlertDialog>
      <CardContent>
        
      </CardContent>
    </Card>

  )
}
