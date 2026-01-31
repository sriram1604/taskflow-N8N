import {authClient} from "@/lib/auth"

import {toNextJsHandler} from "better-auth/next-js"


export const {POST, GET} = toNextJsHandler(authClient);