"use client"


import { zodResolver} from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import {
    Input
} from "@/components/ui/input";

//import {authClient} from "@/lib/auth";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";


const formSchema = z.object({
    email : z.string().email("Please enter a valid email address"),
    password : z.string().min(6,"Password must be at least 6 characters long"),
});

type LoginFormSchema = z.infer<typeof formSchema>;

export default function LoginForm() {
    const router = useRouter();
    const form = useForm<LoginFormSchema>({
        resolver : zodResolver(formSchema),
        defaultValues : {
            email : "",
            password : "",
        },
    });

    async function onSubmit(values : LoginFormSchema) {
        // const result = await authClient.signIn.emailAndPassword({
        //     email : values.email,
        //     password : values.password,
        // });

        // if(result.error) {
        //     toast.error(result.error);
        // } else {
        //     toast.success("Logged in successfully");
        //     router.push("/");
        // }
        await authClient.signIn.email({
            email : values.email,
            password : values.password,
            callbackURL : "/",
        },{
            onSuccess : () => {
                toast.success("Logged in successfully");
                router.push("/");
            },
            onError : (ctx) => {
                toast.error(ctx.error.message);
            },
        }
    );
        console.log(values);
    }

    const isPending = form.formState.isSubmitting;

    return (
        <div className="flex flex-col gap-6">
            <Card>
            <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>
                    Enter your email and password to continue
                </CardDescription>
            </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid gap-6">
                                <div className = "flex flex-col gap-4">
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        type="button"
                                        disabled={isPending}
                                    >
                                        <Image src="/images/google.svg" alt="Google" width={20} height={20} />
                                        Continue with Google
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        type="button"
                                        disabled={isPending}
                                    >
                                        <Image src="/images/github.svg" alt="GitHub" width={20} height={20} />
                                        Continue with GitHub
                                    </Button>
                                </div>
                                <div className = "grid gap-6">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="someone@gmail.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="*********" type="password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <Button type="submit" disabled={isPending} className="w-full">Login</Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter>
                    <p>
                        Don't have an account?{" "}
                        <Link href="/register" className="text-blue-500">
                            Sign-up
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}