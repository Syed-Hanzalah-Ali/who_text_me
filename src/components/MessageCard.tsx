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

export default function MessageCard() {

    async function handleDeleteMsg(){
        
    }
(
    <Card className="w-full max-w-sm">
      
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <AlertDialog>

            <AlertDialogTrigger
                render={<Button variant="destructive">Delete Chat</Button>}
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
