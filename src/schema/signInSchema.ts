import {z} from "zod"

// use this for validation when user try to signIn
export const signInSchema=z.object({
    identifier:z.string(),
    password:z.string()
})
