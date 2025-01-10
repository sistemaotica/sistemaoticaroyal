"use client";

import { useEffect, useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import Link from "next/link";
import {
    FileText,
    LogOut,
    Menu,
    PlusSquare,
    UserCheck,
    Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Mobile() {
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const userRole = localStorage.getItem("userRole");
        setRole(userRole);
    }, []);

    const isAdmin = role === "ADMIN";

    return (
        <div className="sm:hidden flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <header
                className="sticky top-0 z-30 flex h-14 items-center px-4 border-b bg-background gap-4 
                sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6"
            >
                <Sheet>
                    <SheetTrigger asChild>
                        <Button size="icon" className="sm:hidden">
                            <Menu className="w-5 h-5" />
                            <span className="sr-only">Abrir e fechar menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side={"left"} className="sm:max-w-x flex-col flex">
                        <nav className="grid gap-6 text-lg font-medium">
                            <Link
                                href="#"
                                className="flex h-10 w-10 bg-primary rounded-full text-lg
                                justify-center items-center text-primary-foreground md:text-base gap-2"
                            >
                                <Avatar>
                                    <AvatarImage
                                        src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                        alt="@shadcn"
                                    />
                                    <AvatarFallback>BC</AvatarFallback>
                                </Avatar>
                                <span className="sr-only">Imagem do avatar</span>
                            </Link>

                            <Link
                                href="/ordens-servico"
                                className="flex items-center text-[15px] gap-3 px-[2.5px]
                                hover:text-primary"
                            >
                                <FileText size={17} />
                                Ordens de Serviço
                            </Link>

                            <Link
                                href="/clientes"
                                className="flex items-center text-[15px] gap-3 px-[2.5px]
                                hover:text-primary"
                            >
                                <Users size={17} />
                                Clientes
                            </Link>

                            {isAdmin && (
                                <Link
                                    href="/vendedores"
                                    className="flex items-center text-[15px] gap-3 px-[2.5px]
                                    hover:text-primary"
                                >
                                    <UserCheck size={17} />
                                    Vendedores
                                </Link>
                            )}

                            <Link
                                href="/criar-os"
                                className="flex items-center text-[15px] gap-3 px-[2.5px]
                                hover:text-primary"
                            >
                                <PlusSquare size={17} />
                                Nova OS
                            </Link>
                        </nav>
                    </SheetContent>
                </Sheet>
                <h2>Menu</h2>
            </header>
        </div>
    );
}
