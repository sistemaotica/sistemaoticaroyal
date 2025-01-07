'use client';

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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getOrdersAction } from "@/actions/orderActions";
import { generateExactLayoutPDF } from "@/utils/pdfUtils";

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
  date: string;
  deliveryDate: string;
  client: string;
  clientPhone: string;
  clientAddress: string;
  clientBirthDate: string;
  seller: string;
  totalValue: string;
  amountPaid: string;
  amountDue: string;
  observations?: string;
  examiner: string;
  lensDetails: LensDetails;
}

export default function Page() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await getOrdersAction();
        if (response.success && Array.isArray(response.orders)) {
          setOrders(response.orders);
        } else {
          console.error("Erro ao carregar ordens:", response.message);
          setOrders([]);
        }
      } catch (error) {
        console.error("Erro ao buscar ordens de serviço:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const handlePush = () => {
    router.push("/criar-os");
  };

  const handleRowClick = (orderId: number) => {
    router.push(`/ordens-servico/${orderId}`);
  };

  const filteredOrders = orders.filter((order) =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.seller.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="flex flex-col mx-3 my-2 w-450px sm:w-full sm:px-3 sm:my-1 sm:-ml-1">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <h1 className="text-xl font-semibold">Ordens de Serviço</h1>
        <div className="flex flex-1 items-center gap-2">
          <Input
            type="text"
            placeholder="Pesquisar ordens de serviço..."
            className="flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={handlePush}>Gerar OS</Button>
      </div>
      <div className="border rounded-2xl items-center">
        <Table>
          <TableHeader>
            <TableRow className="center">
              <TableHead className="font-semibold">Número OS</TableHead>
              <TableHead className="font-semibold">Data</TableHead>
              <TableHead className="font-semibold">Cliente</TableHead>
              <TableHead className="font-semibold">Vendedor</TableHead>
              <TableHead className="font-semibold">Valor</TableHead>
              <TableHead className="font-semibold">Imprimir</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow
                  key={order.id}
                  className="cursor-pointer"
                  onClick={() => handleRowClick(order.id)}
                >
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.client}</TableCell>
                  <TableCell>{order.seller}</TableCell>
                  <TableCell>
                    {order.totalValue.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        generateExactLayoutPDF(order);
                      }}
                    >
                      Imprimir
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Nenhuma OS encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
