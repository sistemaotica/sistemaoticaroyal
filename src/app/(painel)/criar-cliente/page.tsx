"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { createClientAction } from "@/actions/clientActions";
import { useRouter } from "next/navigation";

function formatCPF(value: string): string {
    return value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatPhone(value: string): string {
    return value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}

export default function Page() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        cpf: "",
        phone: "",
        birthDate: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        const formattedValue =
            name === "cpf"
                ? formatCPF(value)
                : name === "phone"
                ? formatPhone(value)
                : value;

        setFormData((prev) => ({
            ...prev,
            [name]: formattedValue,
        }));
    };

    const handleSave = async () => {
        try {
            const formDataObj = new FormData();
            formDataObj.append("name", formData.name);
            formDataObj.append("address", formData.address);
            formDataObj.append("cpf", formData.cpf);
            formDataObj.append("phone", formData.phone);
            formDataObj.append("birthDate", formData.birthDate);

            const result = await createClientAction(formDataObj);

            if (result.success) {
                toast({
                    title: "Sucesso",
                    description: "Cliente criado com sucesso!",
                    variant: "success",
                });

                router.push("/clientes");
            } else {
                throw new Error(result.message || "Erro ao criar cliente.");
            }
        } catch (error: any) {
            console.error("Erro ao salvar cliente:", error);
            toast({
                title: "Erro",
                description: error.message || "Erro ao salvar cliente.",
                variant: "destructive",
            });
        }
    };

    return (
        <main className="flex flex-col mx-4 my-6 sm:px-7 sm:w-full sm:-ml-2">
            <h1 className="text-xl font-semibold mb-4">Adicionar Cliente</h1>
            <form
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSave();
                }}
            >
                <div className="sm:col-span-2">
                    <label className="block font-semibold mb-1">Nome do Cliente</label>
                    <Input
                        type="text"
                        name="name"
                        placeholder="Digite o nome do cliente"
                        value={formData.name}
                        className="w-full"
                        onChange={handleInputChange}
                    />
                </div>

                <div className="sm:col-span-2">
                    <label className="block font-semibold mb-1">Endereço do Cliente</label>
                    <Input
                        type="text"
                        name="address"
                        placeholder="Digite o endereço do cliente"
                        value={formData.address}
                        className="w-full"
                        onChange={handleInputChange}
                    />
                </div>

                <div className="sm:col-span-2">
                    <label className="block font-semibold mb-1">CPF do Cliente</label>
                    <Input
                        type="text"
                        name="cpf"
                        placeholder="Digite o CPF do cliente"
                        value={formData.cpf}
                        className="w-full"
                        maxLength={14}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="sm:col-span-2">
                    <label className="block font-semibold mb-1">Telefone do Cliente</label>
                    <Input
                        type="text"
                        name="phone"
                        placeholder="Digite o telefone do cliente"
                        value={formData.phone}
                        className="w-full"
                        maxLength={15}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="sm:col-span-2">
                    <label className="block font-semibold mb-1">Data de Nascimento</label>
                    <Input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        className="w-full"
                        onChange={handleInputChange}
                    />
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-4 sm:col-span-2">
                    <Button type="submit" className="w-full">
                        Salvar
                    </Button>
                </div>
            </form>
        </main>
    );
}
