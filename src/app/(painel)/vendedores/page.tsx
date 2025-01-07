"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Trash, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { getSellersAction, deleteSellerAction } from "@/actions/sellerActions";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Seller {
    id: number;
    name: string;
    cpf: string;
    phone: string;
    birthDate: string | Date;
}

function formatCPF(cpf: string): string {
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
}

function formatPhone(phone: string): string {
    return phone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
}

export default function Page() {
    const router = useRouter();
    const [sellers, setSellers] = useState<Seller[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);

    useEffect(() => {
        async function fetchSellers() {
            try {
                const result = await getSellersAction();
                setSellers(result);
            } catch (error) {
                console.error("Erro ao buscar vendedores:", error);
                toast({
                    title: "Erro",
                    description: "Erro ao buscar vendedores.",
                    variant: "destructive",
                });
            }
        }

        fetchSellers();
    }, []);

    const handlePush = () => {
        router.push("/criar-vendedores");
    };

    const handleDelete = async () => {
        if (!selectedSeller) return;

        try {
            const result = await deleteSellerAction(selectedSeller.id);

            if (result.success) {
                toast({
                    title: "Sucesso",
                    description: `Vendedor ${selectedSeller.name} excluído com sucesso.`,
                    variant: "success",
                });

                setSellers((prev) => prev.filter((seller) => seller.id !== selectedSeller.id));
                setOpenDialog(false);
            } else {
                throw new Error(result.message || "Erro desconhecido ao excluir vendedor.");
            }
        } catch (error) {
            console.error("Erro ao excluir vendedor:", error);
            toast({
                title: "Erro",
                description: "Não foi possível excluir o vendedor.",
                variant: "destructive",
            });
        }
    };

    return (
        <main className="flex flex-col mx-3 my-2 w-450px sm:w-full sm:px-3 sm:my-1 sm:-ml-1">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                <h1 className="text-xl font-semibold">Vendedores</h1>
                <Button onClick={handlePush}>Adicionar Vendedores</Button>
            </div>
            <div className="border rounded-2xl items-center">
                <Table>
                    <TableHeader>
                        <TableRow className="center">
                            <TableHead className="font-semibold">Nome</TableHead>
                            <TableHead className="font-semibold">CPF</TableHead>
                            <TableHead className="font-semibold">Telefone</TableHead>
                            <TableHead className="font-semibold">Data de Nascimento</TableHead>
                            <TableHead className="font-semibold">Excluir</TableHead>
                            <TableHead className="font-semibold">Editar</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sellers.map((seller) => (
                            <TableRow key={seller.id}>
                                <TableCell className="font-medium">{seller.name}</TableCell>
                                <TableCell>{formatCPF(seller.cpf)}</TableCell>
                                <TableCell>{formatPhone(seller.phone)}</TableCell>
                                <TableCell>
                                    {typeof seller.birthDate === "string"
                                        ? new Date(seller.birthDate).toLocaleDateString("pt-BR")
                                        : seller.birthDate.toLocaleDateString("pt-BR")}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        size="icon"
                                        className="flex items-center justify-center rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                                        onClick={() => {
                                            setSelectedSeller(seller);
                                            setOpenDialog(true);
                                        }}
                                    >
                                        <Trash size={16} />
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        size="icon"
                                        className="flex items-center justify-center rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                        onClick={() => router.push(`/vendedores/${seller.id}`)} // Redireciona para a rota dinâmica
                                    >
                                        <Edit size={16} />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {openDialog && (
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirmar Exclusão</DialogTitle>
                        </DialogHeader>
                        <p className="text-sm text-gray-700">
                            Tem certeza de que deseja excluir o vendedor{" "}
                            <span className="font-bold">{selectedSeller?.name}</span>?
                        </p>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setOpenDialog(false)}>
                                Cancelar
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                className="bg-red-600 text-white hover:bg-red-700"
                            >
                                Excluir
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </main>
    );
}
