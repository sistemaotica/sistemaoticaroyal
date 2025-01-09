"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  updateOrderAction,
  getOrderByIdAction,
} from "@/actions/orderActions";
import { getClientsAction } from "@/actions/clientActions";
import { getSellersAction } from "@/actions/sellerActions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface LensDetails {
  longeOdSpherical?: string;
  longeOdCylindrical?: string;
  longeOdAxis?: string;
  longeOdPrism?: string;
  longeOdDnp?: string;
  longeOeSpherical?: string;
  longeOeCylindrical?: string;
  longeOeAxis?: string;
  longeOePrism?: string;
  longeOeDnp?: string;
  pertoOdSpherical?: string;
  pertoOdCylindrical?: string;
  pertoOdAxis?: string;
  pertoOdPrism?: string;
  pertoOdDnp?: string;
  pertoOeSpherical?: string;
  pertoOeCylindrical?: string;
  pertoOeAxis?: string;
  pertoOePrism?: string;
  pertoOeDnp?: string;
  addition?: string;
  frameDescription?: string;
  frameColor?: string;
  lensType?: string;
  dp?: string;
  height?: string;
  lensCategory?: string;
}

interface Order {
  id: number;
  orderNumber: string;
  clientId: string;
  sellerId: string;
  examiner: string;
  date: string;
  deliveryDate: string;
  totalValue: string;
  amountPaid: string;
  amountDue: string;
  observations?: string;
  lensDetails: LensDetails;
}

interface Client {
  id: string;
  name: string;
}

interface Seller {
  id: string;
  name: string;
}

export default function EditOrderPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [orderResponse, clientsResponse, sellersResponse] = await Promise.all([
          getOrderByIdAction(Number(params.id)),
          getClientsAction(),
          getSellersAction(),
        ]);

        if (orderResponse.success && orderResponse.order) {
          setOrder(orderResponse.order);
        } else {
          toast({
            variant: "destructive",
            title: "Erro",
            description: orderResponse.message || "Erro ao carregar a OS.",
          });
        }

        setClients(clientsResponse);
        setSellers(sellersResponse);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        toast({
          variant: "destructive",
          title: "Erro inesperado",
          description: "Erro ao carregar os dados necessários.",
        });
      }
    }

    fetchData();
  }, [params.id]);

  const handleChange = (name: string, value: string) => {
    setOrder((prevOrder) =>
      prevOrder
        ? {
            ...prevOrder,
            [name]: value,
            lensDetails: {
              ...prevOrder.lensDetails,
              [name]: name in prevOrder.lensDetails ? value : prevOrder.lensDetails[name],
            },
          }
        : null
    );
  };

  const handleSubmit = async () => {
    if (!order) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("clientId", order.clientId);
    formData.append("sellerId", order.sellerId);
    formData.append("examiner", order.examiner);
    formData.append("date", order.date);
    formData.append("deliveryDate", order.deliveryDate);
    formData.append("totalValue", order.totalValue);
    formData.append("amountPaid", order.amountPaid);
    formData.append("amountDue", order.amountDue);
    formData.append("observations", order.observations || "");

    Object.entries(order.lensDetails).forEach(([key, value]) => {
      formData.append(key, value || "");
    });

    try {
      const response = await updateOrderAction(order.id, formData);

      if (response.success) {
        toast({
          variant: "success",
          title: "Sucesso",
          description: "Ordem atualizada com sucesso.",
        });
        router.push(`/ordens-servico/${order.id}`);
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: response.message || "Erro ao atualizar a OS.",
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar ordem:", error);
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: "Erro ao atualizar a OS.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!order) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">Editar Ordem de Serviço</h1>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cliente */}
        <div>
          <label className="block text-sm font-medium">Cliente</label>
          <Select
            onValueChange={(value) => handleChange("clientId", value)}
            defaultValue={order.clientId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um cliente" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Vendedor */}
        <div>
          <label className="block text-sm font-medium">Vendedor</label>
          <Select
            onValueChange={(value) => handleChange("sellerId", value)}
            defaultValue={order.sellerId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um vendedor" />
            </SelectTrigger>
            <SelectContent>
              {sellers.map((seller) => (
                <SelectItem key={seller.id} value={seller.id}>
                  {seller.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Campos padrão */}
        <div>
          <label className="block text-sm font-medium">Examinador</label>
          <Input name="examiner" type="text" value={order.examiner} onChange={(e) => handleChange("examiner", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium">Data</label>
          <Input name="date" type="date" value={order.date} onChange={(e) => handleChange("date", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium">Data de Entrega</label>
          <Input
            name="deliveryDate"
            type="date"
            value={order.deliveryDate}
            onChange={(e) => handleChange("deliveryDate", e.target.value)}
          />
        </div>

        {/* Valores */}
        <div>
          <label className="block text-sm font-medium">Valor Total</label>
          <Input
            name="totalValue"
            type="number"
            step="0.01"
            value={order.totalValue}
            onChange={(e) => handleChange("totalValue", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Valor Pago</label>
          <Input
            name="amountPaid"
            type="number"
            step="0.01"
            value={order.amountPaid}
            onChange={(e) => handleChange("amountPaid", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Valor a Pagar</label>
          <Input
            name="amountDue"
            type="number"
            step="0.01"
            value={order.amountDue}
            onChange={(e) => handleChange("amountDue", e.target.value)}
          />
        </div>

        {/* Observações */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Observações</label>
          <Input
            name="observations"
            type="text"
            value={order.observations || ""}
            onChange={(e) => handleChange("observations", e.target.value)}
          />
        </div>

        {/* Detalhes da Lente */}
        {Object.entries(order.lensDetails).map(([key, value]) => (
          <div key={key}>
            <label className="block text-sm font-medium capitalize">{key}</label>
            <Input name={key} type="text" value={value || ""} onChange={(e) => handleChange(key, e.target.value)} />
          </div>
        ))}
      </form>

      {/* Botões */}
      <div className="mt-6 flex gap-4">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Salvando..." : "Salvar Alterações"}
        </Button>
        <Button variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}
