"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import z from "zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form" 
import { Input } from "@/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react";


const formSchema = z.object({
    variableName : z.string().min(1,"Variable name is required").regex(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/,"Invalid variable name. It must start with a letter or underscore and can contain letters, numbers, and underscores."),
    endpoint : z.string().url("Please enter a valid URL"),
    method : z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]),
    body : z.string().optional(),
})
 
export type HttpRequestFormValues = z.infer<typeof formSchema>

interface Props{
    open: boolean;
    onOpenChange : (open : boolean) => void;
    onSubmit : (values : z.infer<typeof formSchema>) => void;
    defaultValues? : Partial<HttpRequestFormValues>;
}

export const HttpRequestDialog = (
    {
        open,
        onOpenChange,
        onSubmit,
        defaultValues = {},
    } : Props) => {
        const form = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            defaultValues:{
                variableName:defaultValues.variableName || "",
                endpoint:defaultValues.endpoint || "",
                method:defaultValues.method || "GET",
                body:defaultValues.body || ""
            },
            
        })
        const watchVariableName = form.watch("variableName") || "myApiCall";
        const watchMethod = form.watch("method");
        const shouldShowBody = ["POST", "PUT", "PATCH"].includes(watchMethod);

        const onSubmitHandler = (values : z.infer<typeof formSchema>) => {
            onSubmit(values);
            onOpenChange(false);
        }

        useEffect(() => {
            form.reset({
                variableName : defaultValues.variableName || "",
                endpoint:defaultValues.endpoint || "",
                method:defaultValues.method || "GET",
                body:defaultValues.body || ""
            })
        }, [defaultValues, form, open])
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>HTTP Request</DialogTitle>
                    <DialogDescription>
                        Configure settings for the HTTP Request node.
                        
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-8 mt-4">
                        <div className="space-y-6">
                            <FormField
                                control={form.control}
                                name="variableName"
                                render={({field}) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel>Variable Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="myApiCall" {...field} className="border-1 border-gray-300"/>
                                        </FormControl>
                                        <FormDescription>
                                            Use this variable to access the response in other nodes : {`{{${watchVariableName}.httpResponse.data}}`}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="endpoint"
                                render={({field}) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel>Endpoint</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://api.example.com/users/{{httpResponse.data.id}}" {...field} className="border-1 border-gray-300"/>
                                        </FormControl>
                                        <FormDescription>
                                            Static URL or use {"{{variables}}"} for simple values or {"{{json variables}}"} to stringify objects
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="method"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Method</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} >
                                            <FormControl>
                                                <SelectTrigger className="border-1 border-gray-300">
                                                    <SelectValue placeholder="Select a method" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="GET">GET</SelectItem>
                                                <SelectItem value="POST">POST</SelectItem>
                                                <SelectItem value="PUT">PUT</SelectItem>
                                                <SelectItem value="DELETE">DELETE</SelectItem>
                                                <SelectItem value="PATCH">PATCH</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            Select the HTTP method for the request.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {shouldShowBody && (
                                <FormField
                                    control={form.control}
                                    name="body"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Request Body</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={
                                                    `{\n "userId": "{{httpResponse.data.id}}", 
                                                    "name": "{{httpResponse.data.name}}", 
                                                    "items": "{{httpResponse.data.items}}" \n}`
                                                
                                                    
                                            }   
                                            {...field}
                                            className="min-h-[120px] font-mono text-sm border border-gray-300"
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            JSON with template variables. Use {"{{variables}}"} for simple values or {"{{json variable}}"} to stringify objects
                                        </FormDescription>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                            <Button type="submit">Save</Button>
                        </div>
                    </form>
                </Form>
                
            </DialogContent>
        </Dialog>
    )
}