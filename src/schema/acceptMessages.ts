import {z} from "zod"

// use this for validation when user try to signUp 
export const acceptMessagesSchema=z.object({
    isAcceptingMessages:z.boolean()
})
