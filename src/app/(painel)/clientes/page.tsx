"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { getClientsAction, deleteClientAction } from "@/actions/clientActions";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Client {
  id: number;
  name: string;
  cpf: string;
  phone: string;
  birthDate: string | Date;
}

// Função para formatar CPF
function formatCPF(cpf: string): string {
  return cpf
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

// Função para formatar telefone
function formatPhone(phone: string): string {
  return phone
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}

export default function Page() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Obter a função do usuário (simulação de autenticação)
    const userRole = localStorage.getItem("userRole"); // Exemplo: "ADMIN" ou "SELLER"
    setIsAdmin(userRole === "ADMIN");

    async function fetchClients() {
      try {
        const result = await getClientsAction();
        // Aplica formatação nos dados recebidos
        const formattedClients = result.map((client: Client) => ({
          ...client,
          cpf: formatCPF(client.cpf),
          phone: formatPhone(client.phone),
        }));
        setClients(formattedClients);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao buscar clientes.",
          variant: "destructive",
        });
      }
    }
    fetchClients();
  }, []);

  const handlePush = () => {
    router.push("/criar-cliente");
  };

  const handleDelete = async () => {
    if (!selectedClient) return;

    try {
      const result = await deleteClientAction(selectedClient.id);

      if (result.success) {
        toast({
          title: "Sucesso",
          description: `Cliente ${selectedClient.name} excluído com sucesso.`,
          variant: "success",
        });
        setClients((prev) =>
          prev.filter((client) => client.id !== selectedClient.id)
        );
        setOpenDialog(false);
      } else {
        throw new Error(result.message || "Erro ao excluir cliente.");
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o cliente.",
        variant: "destructive",
      });
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.cpf.includes(search)
  );

  return (
    <main className="flex flex-col mx-3 my-2 w-450px sm:w-full sm:px-3 sm:my-1 sm:-ml-1">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <h1 className="text-xl font-semibold">Clientes</h1>
        <div className="flex flex-1 items-center gap-2">
          <Input
            type="text"
            placeholder="Pesquisar clientes..."
            className="flex-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {isAdmin && <Button onClick={handlePush}>Adicionar Cliente</Button>}
      </div>
      <div className="border rounded-2xl items-center">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Data de Nascimento</TableHead>
              {isAdmin && <TableHead>Excluir</TableHead>}
              {isAdmin && <TableHead>Editar</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.cpf}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>
                  {typeof client.birthDate === "string"
                    ? new Date(client.birthDate).toLocaleDateString("pt-BR")
                    : client.birthDate.toLocaleDateString("pt-BR")}
                </TableCell>
                {isAdmin && (
                  <TableCell>
                    <Button
                      size="icon"
                      className="bg-red-100 text-red-700 hover:bg-red-200"
                      onClick={() => {
                        setSelectedClient(client);
                        setOpenDialog(true);
                      }}
                    >
                      <Trash size={16} />
                    </Button>
                  </TableCell>
                )}
                {isAdmin && (
                  <TableCell>
                    <Button
                      size="icon"
                      className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                      onClick={() => router.push(`/clientes/${client.id}`)}
                    >
                      <Edit size={16} />
                    </Button>
                  </TableCell>
                )}
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
            <p>
              Tem certeza de que deseja excluir o cliente{" "}
              <strong>{selectedClient?.name}</strong>?
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenDialog(false)}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
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
