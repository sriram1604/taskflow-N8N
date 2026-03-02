import { PAGINATION } from "@/config/constants";
import db from "@/lib/db";
import { createTRPCRouter, premiumProcedure, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { generateSlug } from "random-word-slugs";
import z from "zod";
import {NodeType} from "@/generated/prisma";
import type { Node, Edge } from "@xyflow/react";



export const workflowRouter = createTRPCRouter({
    createWorkflow: protectedProcedure.mutation(async ({ctx})=>{
        try {
            return await db.workflow.create({
                data: {
                    name : generateSlug(3),
                    userId : ctx.auth.user.id,
                    nodes : {
                        create : [{
                            name : "Initial Node",
                            type : NodeType.INITIAL,
                            position : { x: 0, y: 0 },
                            
                        }],
                    },
                },
            })
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new TRPCError({
                    code: 'CONFLICT',
                    message: 'A workflow with this name already exists. Please try again.',
                });
            }
            throw error;
        }
    }),
    removeWorkflow : protectedProcedure.input(z.object({
        id : z.string(),
    })).mutation(({ctx,input})=>{
        return db.workflow.delete({
            where: {
                id : input.id,
                userId : ctx.auth.user.id,
            },
        })
    }),
    update : protectedProcedure.input(z.object({
        id : z.string(),
        nodes : z.array(z.object({
            id: z.string(),
            type: z.string().nullish(),
            position: z.object({
                x: z.number(),
                y: z.number(),
            }),
            data: z.record(z.string(),z.any()).optional(),
        })),
        edges : z.array(z.object({
            source : z.string(),
            target : z.string(),
            sourceHandle : z.string().nullish(),
            targetHandle : z.string().nullish(),
        })),
    })).mutation(async ({ctx,input})=>{
        const {id,nodes,edges} = input;
        const workflow = await db.workflow.findUniqueOrThrow({
            where: {
                id,
                userId : ctx.auth.user.id,
            },
        });

        return await db.$transaction(async(tx)=>{
            await tx.node.deleteMany({
                where: {
                    workflowId : id,
                },
            });
            await tx.node.createMany({
                data : nodes.map((node)=>({
                    id: node.id,
                    workflowId : id,
                    name : node.type || "Unknown",
                    type : node.type as NodeType,
                    position : node.position,
                    data : node.data || {},
                })),
            })

            
            await tx.connection.createMany({
                data : edges.map((edge)=>({
                    workflowId : id,
                    fromNodeId : edge.source,
                    toNodeId : edge.target,
                    fromOutput : edge.sourceHandle || "main",
                    toInput : edge.targetHandle || "main",
                })),
            })

            await tx.workflow.update({
                where : { id},
                data : {updatedAt : new Date()},
            })

            return workflow;
        })
    }),
    updateName : protectedProcedure.input(z.object({
        id : z.string(),
        name : z.string().min(1).max(255),
    })).mutation(async ({ctx,input})=>{
        try {
            return await db.workflow.update({
                where: {
                    id : input.id,
                    userId : ctx.auth.user.id,
                },
                data: {
                    name : input.name,
                },
            })
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new TRPCError({
                    code: 'CONFLICT',
                    message: 'A workflow with this name already exists.',
                });
            }
            throw error;
        }
    }),
    getOne : protectedProcedure.input(z.object({
        id : z.string(),
    })).query(async({ctx,input})=>{
        const workflow = await db.workflow.findFirstOrThrow({
            where: {
                id : input.id,
                userId : ctx.auth.user.id,
            },  
            include : {
                nodes : true,
                connections : true,
            },
        })

        const nodes : Node[] = workflow.nodes.map((node)=>({
            id : node.id,
            type : node.type,
            position : node.position as {x : number,y : number},
            data : (node.data as Record<string,unknown>) || {},
        }))
        const edges : Edge[] = workflow.connections.map((connection)=>(
            {
                id : connection.id,
                source : connection.fromNodeId,
                target : connection.toNodeId,
                sourceHandle : connection.fromOutput,
                targetHandle : connection.toInput,
            }
        ))
        return {
            id : workflow.id,
            name : workflow.name,
            nodes,
            edges,
        }
    }),
    getMany : protectedProcedure
    .input(z.object({
        page : z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize : z
        .number()
        .min(PAGINATION.MIN_PAGE_SIZE)
        .max(PAGINATION.MAX_PAGE_SIZE)
        .default(PAGINATION.DEFAULT_PAGE_SIZE),
        search : z.string().default(""),
    }))
    .query(async({ctx,input})=>{
        const {page,pageSize,search} = input;
        
        const [items, totalCount] = await Promise.all([
            db.workflow.findMany({
                skip : (page - 1) * pageSize,
                take : pageSize,
                where: {
                    userId : ctx.auth.user.id,
                    name : {
                        contains : search,
                        mode : "insensitive",
                    },
                },
                orderBy: {
                    updatedAt: "desc",
                },
                
            }),
            db.workflow.count({
                where: {
                    userId : ctx.auth.user.id,
                    name : {
                        contains : search,
                        mode : "insensitive",
                    },
                },
            }),
        ]);

        const totalPages = Math.ceil(totalCount / pageSize);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        return {
            items,
            page,
            pageSize,
            totalCount,
            totalPages,
            hasNextPage,
            hasPrevPage,
        };
    })
})