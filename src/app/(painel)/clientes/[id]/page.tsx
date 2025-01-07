"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { getClientByIdAction, updateClientAction } from "@/actions/clientActions";

interface Client {
  id: number;
  name: string;
  address: string;
  cpf: string;
  phone: string;
  birthDate: Date;
}

// Função para formatar CPF
const formatCPF = (value: string): string => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .slice(0, 14); // Limita o tamanho máximo
};

// Função para formatar telefone
const formatPhone = (value: string): string => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2")
    .slice(0, 15); // Limita o tamanho máximo
};

export default function EditClient({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    cpf: "",
    phone: "",
    birthDate: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchClient() {
      try {
        const response = await getClientByIdAction(Number(params.id));
        if (response?.success && response?.client) {
          setClient(response.client);

          const formattedBirthDate = new Date(response.client.birthDate)
            .toISOString()
            .split("T")[0];

          setFormData({
            name: response.client.name,
            address: response.client.address,
            cpf: formatCPF(response.client.cpf),
            phone: formatPhone(response.client.phone),
            birthDate: formattedBirthDate,
          });
        } else {
          throw new Error(response?.message || "Erro ao carregar cliente.");
        }
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao carregar os dados do cliente.",
          variant: "destructive",
        });
        router.push("/clientes");
      }
    }

    fetchClient();
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: "Erro",
        description: "O nome do cliente é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const updatedClient = {
        id: client!.id,
        name: formData.name,
        address: formData.address,
        cpf: formData.cpf.replace(/\D/g, ""), // Remove formatação
        phone: formData.phone.replace(/\D/g, ""), // Remove formatação
        birthDate: formData.birthDate,
      };

      const result = await updateClientAction(updatedClient);

      if (result.success) {
        toast({
          title: "Sucesso",
          description: "Cliente atualizado com sucesso!",
          variant: "success",
        });
        router.push("/clientes");
      } else {
        throw new Error(result.message || "Erro ao atualizar cliente.");
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar alterações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!client) {
    return <div className="text-center py-10">Carregando...</div>;
  }

  return (
    <main className="flex flex-col mx-4 my-6 sm:px-7 sm:w-full sm:-ml-2">
      <h1 className="text-xl font-semibold mb-4">Editar Cliente</h1>
      <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        <div className="sm:col-span-2">
          <label className="block font-semibold mb-1">Nome</label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Digite o nome do cliente"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block font-semibold mb-1">Endereço</label>
          <Input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Digite o endereço do cliente"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block font-semibold mb-1">CPF</label>
          <Input
            type="text"
            name="cpf"
            value={formData.cpf}
            onChange={handleInputChange}
            placeholder="Digite o CPF"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block font-semibold mb-1">Telefone</label>
          <Input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Digite o telefone"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block font-semibold mb-1">Data de Nascimento</label>
          <Input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleInputChange}
          />
        </div>

        <div className="sm:col-span-2 sm:flex justify-start gap-4">
          <Button
            className="w-full mb-4 sm:w-auto"
            type="submit"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar Alterações"}
          </Button>
          <Button
            className="w-full sm:w-auto"
            type="button"
            variant="outline"
            onClick={() => router.push("/clientes")}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </main>
  );
}
