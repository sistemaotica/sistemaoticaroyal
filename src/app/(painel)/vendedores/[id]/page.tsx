"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { getSellerByIdAction, updateSellerAction } from "@/actions/sellerActions";

const formatCPF = (cpf: string): string => {
    return cpf
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
        .slice(0, 14); 
};

const formatPhone = (phone: string): string => {
    return phone
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d{1,4})$/, "$1-$2")
        .slice(0, 15);
};

interface Seller {
    id: number;
    name: string;
    cpf: string;
    phone: string;
    birthDate: string;
    email: string;
    password: string;
}

export default function EditSeller({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [formData, setFormData] = useState<Seller>({
        id: 0,
        name: "",
        cpf: "",
        phone: "",
        birthDate: "",
        email: "",
        password: "",
    });
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        async function fetchSeller() {
            try {
                const response = await getSellerByIdAction(Number(params.id));
                if (response?.success && response?.seller) {
                    setFormData({
                        ...response.seller,
                        cpf: formatCPF(response.seller.cpf),
                        phone: formatPhone(response.seller.phone),
                        birthDate: new Date(response.seller.birthDate).toISOString().split("T")[0],
                        password: "",
                    });
                } else {
                    throw new Error(response?.message || "Erro ao buscar vendedor.");
                }
            } catch (error) {
                toast({
                    title: "Erro",
                    description: "Erro ao carregar os dados do vendedor.",
                    variant: "destructive",
                });
                router.push("/vendedores");
            }
        }

        fetchSeller();
    }, [params.id, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === "cpf") {
            setFormData((prev) => ({ ...prev, [name]: formatCPF(value) }));
        } else if (name === "phone") {
            setFormData((prev) => ({ ...prev, [name]: formatPhone(value) }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const updatedData = {
                ...formData,
                password: password || "",
                cpf: formData.cpf.replace(/\D/g, ""),
                phone: formData.phone.replace(/\D/g, ""),
                birthDate: new Date(formData.birthDate).toISOString(),
            };

            const result = await updateSellerAction(updatedData);
            if (result.success) {
                toast({
                    title: "Sucesso",
                    description: "Vendedor atualizado com sucesso!",
                    variant: "success",
                });
                router.push("/vendedores");
            } else {
                throw new Error(result.message || "Erro ao atualizar vendedor.");
            }
        } catch (error) {
            toast({
                title: "Erro",
                description: "Erro ao salvar alterações.",
                variant: "destructive",
            });
        }
    };

    return (
        <main className="flex flex-col px-3 my-6 sm:pr-3 sm:w-full">
            <h1 className="text-xl font-semibold mb-4">Editar Vendedor</h1>
            <form onSubmit={handleSave} className="grid grid-cols-1 gap-4 w-full">
                <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nome do Vendedor"
                />
                <Input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    placeholder="CPF do Vendedor"
                />
                <Input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Telefone do Vendedor"
                />
                <Input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                />
                <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="E-mail do Vendedor"
                />
                <div className="relative">
                    <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Nova Senha (opcional)"
                        className="pr-10"
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                <div className="sm:flex justify-start gap-4">
                    <Button className="w-full mb-4 sm:w-auto" type="submit">
                        Salvar Alterações
                    </Button>
                    <Button className="w-full sm:w-auto" type="button" variant="outline" onClick={() => router.push("/vendedores")}>
                        Cancelar
                    </Button>
                </div>
            </form>
        </main>
    );
}
