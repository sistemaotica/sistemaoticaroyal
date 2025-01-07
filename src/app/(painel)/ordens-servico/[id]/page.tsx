"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getOrderByIdAction, deleteOrderAction } from "@/actions/orderActions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

export default function OrderDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await getOrderByIdAction(Number(params.id));
        if (response?.success && response?.order) {
          setOrder(response.order);
        } else {
          toast({
            variant: "destructive",
            title: "Erro ao carregar OS",
            description: response?.message || "Dados não encontrados.",
          });
        }
      } catch (error) {
        console.error("Erro ao buscar OS:", error);
        toast({
          variant: "destructive",
          title: "Erro inesperado",
          description: "Erro ao carregar OS.",
        });
      }
    }
    fetchOrder();
  }, [params.id]);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await deleteOrderAction(Number(params.id));
      if (response.success) {
        toast({
          variant: "success",
          title: "Sucesso",
          description: "Ordem excluída com sucesso.",
        });
        setOpenDialog(false);
        router.push("/ordens-servico");
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: response.message || "Erro ao excluir a ordem.",
        });
      }
    } catch (error) {
      console.error("Erro ao excluir ordem:", error);
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: "Ocorreu um erro ao excluir a ordem.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!order) {
    return <div className="text-center py-10">Carregando...</div>;
  }

  return (
    <main className="flex flex-col mx-4 my-6 sm:px-7 sm:w-full sm:-ml-2">
      <h1 className="text-2xl font-semibold mb-6">Ordem de Serviço: {order.orderNumber}</h1>

      {/* Informações Gerais */}
      <section className="mb-6 rounded-2xl border items-center">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campo</TableHead>
              <TableHead>Informação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-semibold">Data da Venda</TableCell>
              <TableCell>{order.date}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Entrega Prevista</TableCell>
              <TableCell>{order.deliveryDate}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Examinador</TableCell>
              <TableCell>{order.examiner}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Observações</TableCell>
              <TableCell>{order.observations || "Nenhuma"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Valor Total</TableCell>
              <TableCell>{order.totalValue}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Valor Pago</TableCell>
              <TableCell>{order.amountPaid}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">À Pagar</TableCell>
              <TableCell>{order.amountDue}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      {/* Cliente */}
      <section className="mb-6 border rounded-2xl items-center">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campo</TableHead>
              <TableHead>Informação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-semibold">Nome Cliente</TableCell>
              <TableCell>{order.client}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Telefone Cliente</TableCell>
              <TableCell>{order.clientPhone}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Endereço Cliente</TableCell>
              <TableCell>{order.clientAddress}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Data de Nascimento Cliente</TableCell>
              <TableCell>{order.clientBirthDate}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      {/* Vendedor */}
      <section className="mb-6 border rounded-2xl items-center">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campo</TableHead>
              <TableHead>Informação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-semibold">Nome Vendedor</TableCell>
              <TableCell>{order.seller}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      <section className="mb-6 border rounded-2xl items-center">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-semibold">Longe OD - Esférico</TableCell>
              <TableCell>{order.lensDetails.longeOdSpherical || "-"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Longe OD - Cilíndrico</TableCell>
              <TableCell>{order.lensDetails.longeOdCylindrical || "-"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Longe OD - Eixo</TableCell>
              <TableCell>{order.lensDetails.longeOdAxis || "-"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Longe OD - Prisma</TableCell>
              <TableCell>{order.lensDetails.longeOdPrism || "-"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Longe OD - DNP</TableCell>
              <TableCell>{order.lensDetails.longeOdDnp || "-"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Longe OE - Esférico</TableCell>
              <TableCell>{order.lensDetails.longeOeSpherical || "-"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Longe OE - Cilíndrico</TableCell>
              <TableCell>{order.lensDetails.longeOeCylindrical || "-"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Longe OE - Eixo</TableCell>
              <TableCell>{order.lensDetails.longeOeAxis || "-"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Longe OE - Prisma</TableCell>
              <TableCell>{order.lensDetails.longeOePrism || "-"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Longe OE - DNP</TableCell>
              <TableCell>{order.lensDetails.longeOeDnp || "-"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Perto OD - Esférico</TableCell>
              <TableCell>{order.lensDetails.pertoOdSpherical || "-"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Perto OD - Cilíndrico</TableCell>
              <TableCell>{order.lensDetails.pertoOdCylindrical || "-"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Perto OD - Eixo</TableCell>
              <TableCell>{order.lensDetails.pertoOdAxis || "-"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Perto OD - Prisma</TableCell>
              <TableCell>{order.lensDetails.pertoOdPrism || "-"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Perto OD - DNP</TableCell>
              <TableCell>{order.lensDetails.pertoOdDnp || "-"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Perto OE - Esférico</TableCell>
              <TableCell>{order.lensDetails.pertoOeSpherical || "-"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Perto OE - Cilíndrico</TableCell>
              <TableCell>{order.lensDetails.pertoOeCylindrical || "-"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Perto OE - Eixo</TableCell>
              <TableCell>{order.lensDetails.pertoOeAxis || "-"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Perto OE - Prisma</TableCell>
              <TableCell>{order.lensDetails.pertoOePrism || "-"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Perto OE - DNP</TableCell>
              <TableCell>{order.lensDetails.pertoOeDnp || "-"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Adição</TableCell>
              <TableCell>{order.lensDetails.addition || "-"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">DP</TableCell>
              <TableCell>{order.lensDetails.dp || "-"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Altura</TableCell>
              <TableCell>{order.lensDetails.height || "-"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Descrição da Armação</TableCell>
              <TableCell>{order.lensDetails.frameDescription || "-"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Cor da Armação</TableCell>
              <TableCell>{order.lensDetails.frameColor || "-"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Tipo de Lente</TableCell>
              <TableCell>{order.lensDetails.lensType || "-"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Categoria da Lente</TableCell>
              <TableCell>{order.lensDetails.lensCategory || "-"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      <div className="sm:flex sm:gap-4">
        <Button
          className="w-full mb-4 sm:w-auto"
          onClick={() => router.push(`/ordens-servico/${params.id}/editar`)}
        >
          Editar OS
        </Button>
        <Button
          className="w-full sm:w-auto"
          variant="outline"
          onClick={() => router.back()}
        >
          Voltar
        </Button>
        <Button
          className="w-full sm:w-auto"
          variant="destructive"
          onClick={() => setOpenDialog(true)}
        >
          Excluir
        </Button>
      </div>

      {openDialog && (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-700">
              Tem certeza de que deseja excluir a ordem{" "}
              <span className="font-bold">{order.orderNumber}</span>?
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenDialog(false)}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="bg-red-600 text-white hover:bg-red-700"
                disabled={loading}
              >
                {loading ? "Excluindo..." : "Excluir"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}
