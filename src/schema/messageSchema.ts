import {z} from "zod"

// use this for validation when user try to signUp 
export const messageSchema=z.object({
    content:z.string()
            .min(10,{message:"content must be of atleast 10 characters"})
            .max(300,{message:"contetn must be no longer than 300 characters"})
})
