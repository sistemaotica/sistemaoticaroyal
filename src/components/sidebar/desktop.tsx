"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FileText, LogOut, PlusSquare, UserCheck, Users } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Desktop() {
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const userRole = localStorage.getItem("userRole"); 
        setRole(userRole);
    }, []);

    const isAdmin = role === "ADMIN";

    return (
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 border-r bg-background sm:flex flex-col">
            <nav className="flex flex-col items-center gap-4 px-2 py-5">
                <TooltipProvider>
                    <Link
                        className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary rounded-full text-primary-foreground"
                        href="#"
                    >
                        <Avatar>
                            <AvatarImage src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="@shadcn" />
                            <AvatarFallback>BC</AvatarFallback>
                        </Avatar>
                        <span className="sr-only">Dashboard Avatar</span>
                    </Link>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors hover:text-primary"
                                href="/ordens-servico"
                            >
                                <FileText size={17} />
                                <span className="sr-only">Ordens de Serviço</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Ordens de Serviço</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors hover:text-primary"
                                href="/clientes"
                            >
                                <Users size={17} />
                                <span className="sr-only">Clientes</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Clientes</TooltipContent>
                    </Tooltip>

                    {isAdmin && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors hover:text-primary"
                                    href="/vendedores"
                                >
                                    <UserCheck size={17} />
                                    <span className="sr-only">Vendedores</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">Vendedores</TooltipContent>
                        </Tooltip>
                    )}

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors hover:text-primary"
                                href="/criar-os"
                            >
                                <PlusSquare size={17} />
                                <span className="sr-only">Nova OS</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Nova OS</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </nav>
        </aside>
    );
}
