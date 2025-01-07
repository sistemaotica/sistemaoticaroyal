"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeOff, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { loginAction } from "@/actions/authActions";

export default function Page() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleLogin = async () => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
    
        try {
            const result = await loginAction(formData);
    
            if (result.success) {
                toast({
                    title: "Login realizado com sucesso!",
                    description: "Você será redirecionado para o painel.",
                    variant: "success",
                });
    
                // Salva o role no localStorage
                const userRole = result.role ?? "SELLER"; // Define um valor padrão caso role seja undefined
                localStorage.setItem("userRole", userRole);
    
                setTimeout(() => {
                    router.push("/ordens-servico");
                }, 2000);
            } else {
                toast({
                    title: "Erro ao realizar login",
                    description: result.message || "Por favor, tente novamente.",
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            toast({
                title: "Erro inesperado",
                description: error.message || "Algo deu errado, tente novamente.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };
    

    return (
        <main className="flex h-screen items-center justify-center bg-gray-100">
            <Card className="w-[450px] sm:w-[550px] shadow-lg">
                <CardHeader className="items-center justify-center">
                    <CardTitle className="text-2xl font-bold">Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleLogin();
                        }}
                        className="space-y-4"
                    >
                        <div>
                            <Label>E-mail</Label>
                            <Input
                                className="mt-1"
                                type="email"
                                placeholder="Digite seu e-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <Label>Senha</Label>
                            <div className="relative mt-1">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Digite sua senha"
                                    className="pr-10"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                        <Button
                            type="submit" 
                            className="w-full"
                            disabled={isLoading || !email || !password}
                        >
                            {isLoading ? "Carregando..." : "Acessar"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </main>
    );
}
