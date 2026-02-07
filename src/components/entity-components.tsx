"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangleIcon, Loader2Icon, MoreHorizontalIcon, MoreVerticalIcon, PackageOpenIcon, PlusIcon, SearchIcon, TrashIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Input } from "./ui/input";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyTitle,
    EmptyHeader,
    EmptyMedia
} from "./ui/empty";
import { cn } from "@/lib/utils";
import {
    Card,
    CardContent,
    CardTitle,
    CardDescription,
} from './ui/card'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';

type EntityHeaderProps = {
    title:string;
    description?:string;
    newButtonLabel :string;
    disabled? : boolean;
    isCreating?: boolean;
} & (
    | {onNew:()=>void; newButtonHref?: never}
    | {onNew?:never; newButtonHref:string}
    | {onNew?:never; newButtonHref?:never}
)



export const EntityHeader = ({
    title,
    description,
    newButtonLabel,
    disabled,
    isCreating,
    onNew,
    newButtonHref,
}:EntityHeaderProps) => {
    return (
        <div className="flex flex-row items-center justify-between gap-x-4">
            <div className="flex flex-col">
                <h1 className="text-lg md:text:xl font-semibold">{title}</h1>
                {description && <p className="text-xs md:text-sm text-muted-foreground">{description}</p>}
            </div>
            {onNew && !newButtonHref && (
                <Button onClick={onNew} disabled={disabled || isCreating} size="sm">
                    <PlusIcon className="size-4"/>
                    {newButtonLabel}
                </Button>
            )}
            {newButtonHref && !onNew && (
                <Button size="sm" asChild>
                    <Link href={newButtonHref} prefetch>
                        <PlusIcon className="size-4"/>
                        {newButtonLabel}
                    </Link>
                </Button>
            )}
        </div>
    )
}
type EntityContainerProps = {
    header?:React.ReactNode;
    search?:React.ReactNode;
    pagination?:React.ReactNode;
    children:React.ReactNode;
};

export const EntityContainer = ({
    header,
    search,
    pagination,
    children
}:EntityContainerProps) => {
    return (
        <div className="p-4 md:px-10 md:py-6 h-full">
            <div className="mx-auto max-w-screen-xl w-full h-full flex flex-col gap-y-8">
                {header}
                
            
                <div className="flex flex-col gap-y-4 h-full">
                    {search}
                    {children}
                    
                </div>
                {pagination}
            </div>
        </div>
    )
}


interface EntitySearchProps {
    value : string;
    onChange : (value : string) => void;
    placeholder?:string;
    
}

export const EntitySearch = ({
    value,
    onChange,
    placeholder,
    
} : EntitySearchProps) => {
    return (
        <div className="relative ml-auto">
            <SearchIcon className="absolute size-3.5 left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
            <Input
                className="max-w-[200px] bg-background shadow-none
                border-border pl-8"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                
            />
        </div>
    )
}


interface EntityPaginationProps {
    page : number;
    totalPages : number;
    onPageChange : (page:number) => void;
    disabled?:boolean;
}

export const EntityPagination = ({
    page,
    totalPages,
    onPageChange,
    disabled
}:EntityPaginationProps) => {
    return (
        <div className="flex items-center justify-between gap-x-2">
            <div className="flex-1 text-sm text-muted-foreground">
                <p suppressHydrationWarning>Page {page} of {totalPages || 1}</p>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                variant="outline"
                    size="sm"
                    onClick={() => onPageChange(Math.max(1,page - 1))}
                    disabled={page === 1 || disabled}
                >
                    Previous
                </Button>
                 <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(Math.min(totalPages,page + 1))}
                    disabled={page >= totalPages || totalPages <= 1 || disabled}
                >
                    Next
                </Button>
            </div>
            
           
        </div>
    )
}

interface StateViewProps {
    message? : string;
};

interface LoadingViewProps extends StateViewProps {
    entity? : string;
}

export const LoadingView = ({message,entity = "items"} : LoadingViewProps) => {
    return (
        <div className="flex items-center justify-center h-full flex-1 flex-col gap-y-4">
            <p className="text-sm text-muted-foreground">{message || `Loading ${entity}...`}</p>
            <Loader2Icon className="size-6 animate-spin text-primary"/>
        </div>
    )
}


export const ErrorView = ({message} : StateViewProps) => {
    return (
        <div className="flex items-center justify-center h-full flex-1 flex-col gap-y-4">
           
            <AlertTriangleIcon className="size-6 text-destructive"/>
            {!!message && (
                <p className="text-sm text-muted-foreground">{message}</p>
            )}
            <Button size="sm" onClick={() => window.location.reload()}>
                Refresh
            </Button>
        </div>
    )
}

interface EmptyViewProps extends StateViewProps {
    onNew? : () => void;
    entity?: string;
}

export const EmptyView = ({message,onNew,entity = "items"} : EmptyViewProps) => {
    return (
        <Empty className="border border-dashed bg-white">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <PackageOpenIcon className=""/>
                </EmptyMedia>
            </EmptyHeader>
            <EmptyContent>
                <EmptyTitle>{`No ${entity} found`}</EmptyTitle>
                {!!message && (
                    <EmptyDescription>{message}</EmptyDescription>
                )}

                {!!onNew && (
                    <EmptyContent>
                        <Button size="sm" onClick={onNew}>
                            Add {entity}
                        </Button>
                    </EmptyContent>
                )}
            </EmptyContent>
        </Empty>
    )
}

interface EntityListProps<T> {
    items:T[];
    renderItem : (item:T, index: number) => React.ReactNode;
    getKey? : (item:T, index: number) => string | number;
    emptyView? : React.ReactNode;
    className?: string;
}

export function EntityList<T>({
    items,
    renderItem,
    getKey,
    emptyView,
    className
}:EntityListProps<T>) {
    if(items.length === 0 && emptyView){
        return (
            <div className="flex-1 flex justify-center items-center">
                <div className="max-w-sm mx-auto">
                    {emptyView}
                </div>
            </div>
        )
    }

    return (
        <div className={cn("flex flex-col gap-y-4",className)}>
            <AnimatePresence mode="popLayout">
                {items.map((item,index) => (
                    <motion.div 
                        key={getKey ? getKey(item,index) : index}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ 
                            opacity: 0, 
                            scale: 0.9, 
                            filter: "blur(4px)",
                            transition: { duration: 0.3 } 
                        }}
                    >
                        {renderItem(item,index)}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )

}


interface EntityItemProps {
    href : string;
    title? : string;
    subtitle? : React.ReactNode;
    image? : React.ReactNode;
    actions? : React.ReactNode;
    onRemove?: () => void | Promise<void>;
    isRemoving?: boolean;
    className?: string;
}

export const EntityItem = ({
    href,
    title,
    subtitle,
    image,
    actions,
    onRemove,
    isRemoving = false,
    className
}:EntityItemProps) => {
    const handleRemove = async(e: React.MouseEvent) => {
        // e.preventDefault(); // Removed to allow dropdown to close
        e.stopPropagation();

        if(isRemoving){
            return;
        }

        if(onRemove){
            await onRemove();
        }
    }
    return (
        <Link href={href} prefetch>
            <Card className={cn("p-4 shadow-none hover:shadow cursor-pointer",
                isRemoving && "opacity-50 cursor-not-allowed",className)}>
                <CardContent className="flex flex-row items-center justify-between p-0">
                    <div className="flex items-center gap-3">
                        {image}
                        <div>
                            <CardTitle className="text-base font-medium">
                                {title}
                            </CardTitle>
                            {!!subtitle && (
                                <CardDescription className="text-xs text-muted-foreground">
                                    {subtitle}
                                </CardDescription>
                            )}
                        </div>
                    </div>
                    {(actions || onRemove) && (
                        <div className="flex items-center gap-x-4">
                            {actions}
                            {onRemove && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <MoreVerticalIcon className="size-4"/>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <DropdownMenuItem onClick={handleRemove}>
                                            <TrashIcon className="size-4" />
                                            Delete
                                        </DropdownMenuItem>
                                        
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </Link>
    )
}

