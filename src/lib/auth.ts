import {betterAuth} from "better-auth";

import { prismaAdapter } from "better-auth/adapters/prisma";
import db from "./db";

export const authClient = betterAuth({
    database : prismaAdapter(db, {
        provider : "postgresql"
    }),
    emailAndPassword : {
        enabled : true,
        autoSignIn : true,
        
    }
})