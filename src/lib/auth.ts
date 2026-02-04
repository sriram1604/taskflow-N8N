
import {checkout, polar, portal} from "@polar-sh/better-auth"; 

import {betterAuth} from "better-auth";

import { prismaAdapter } from "better-auth/adapters/prisma";
import db from "./db";
import { polarClient } from "./polar";

export const authClient = betterAuth({
    database : prismaAdapter(db, {
        provider : "postgresql"
    }),
    emailAndPassword : {
        enabled : true,
        autoSignIn : true,
        
    },
    plugins : [
       polar({
        client : polarClient,
        createCustomerOnSignUp : true,
        use:[
            checkout({
                products : [
                    {
                        productId: "ed9f86a2-34b3-4ed0-9a94-710eab20e1cc",
                        slug: "Taskflow-pro" 
                    }
                ],
                successUrl: process.env.POLAR_SUCCESS_URL,
                authenticatedUsersOnly : true,
                
            }),
            portal(),
        ]
       }) 
    ]
    
})