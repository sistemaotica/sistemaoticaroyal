"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  getOrderByIdAction,
  updateOrderAction,
} from "@/actions/orderActions";
import { getClientsAction } from "@/actions/clientActions";
import { getSellersAction } from "@/actions/sellerActions";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface Client {
  id: number;
  name: string;
}

interface Seller {
  id: number;
  name: string;
}
function validateAndConvertDate(date: string): string {
  if (!date || !/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
    throw new Error("Formato de data inválido. Use DD/MM/YYYY.");
  }

  const [day, month, year] = date.split("/").map(Number);
  if (!day || !month || !year || day > 31 || month > 12 || year < 1900) {
    throw new Error("Data inválida.");
  }

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatCurrency(value: string): string {
  const numericValue = parseFloat(value.replace(/[^\d]/g, "")) / 100;
  if (isNaN(numericValue)) return "R$ 0,00";
  return numericValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function Page() {
  const { id } = useParams();
  const [osNumber, setOsNumber] = useState("");

  const [clients, setClients] = useState<Client[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    examiner: "",
    date: "",
    totalValue: "R$ 0,00",
    amountPaid: "R$ 0,00",
    amountDue: "R$ 0,00",
    deliveryDate: "",
    longeOdSpherical: "",
    longeOdCylindrical: "",
    longeOdAxis: "",
    longeOdPrism: "",
    longeOdDnp: "",
    longeOeSpherical: "",
    longeOeCylindrical: "",
    longeOeAxis: "",
    longeOePrism: "",
    longeOeDnp: "",
    pertoOdSpherical: "",
    pertoOdCylindrical: "",
    pertoOdAxis: "",
    pertoOdPrism: "",
    pertoOdDnp: "",
    pertoOeSpherical: "",
    pertoOeCylindrical: "",
    pertoOeAxis: "",
    pertoOePrism: "",
    pertoOeDnp: "",
    addition: "",
    dp: "",
    height: "",
    frameDescription: "",
    frameColor: "",
    lensType: "",
    lensCategory: "",
    observations: "",
  });

  const router = useRouter();
  useEffect(() => {
    if (!id) return;
    const safeId = Array.isArray(id) ? id[0] : id;
    setOsNumber(safeId);
  }, [id]);
  useEffect(() => {
    async function fetchData() {
      try {
        const [orderData, clientsData, sellersData] = await Promise.all([
          getOrderByIdAction(Number(osNumber)),
          getClientsAction(),
          getSellersAction(),
        ]);

        if (orderData.success && orderData.order) {
          setFormData({
            examiner: orderData.order.examiner || "",
            date: orderData.order.date || "",
            totalValue: formatCurrency(orderData.order.totalValue || "0"),
            amountPaid: formatCurrency(orderData.order.amountPaid || "0"),
            amountDue: formatCurrency(orderData.order.amountDue || "0"),
            deliveryDate: orderData.order.deliveryDate || "",

            longeOdSpherical: orderData.order.lensDetails.longeOdSpherical || "",
            longeOdCylindrical: orderData.order.lensDetails.longeOdCylindrical || "",
            longeOdAxis: orderData.order.lensDetails.longeOdAxis || "",
            longeOdPrism: orderData.order.lensDetails.longeOdPrism || "",
            longeOdDnp: orderData.order.lensDetails.longeOdDnp || "",
            longeOeSpherical: orderData.order.lensDetails.longeOeSpherical || "",
            longeOeCylindrical: orderData.order.lensDetails.longeOeCylindrical || "",
            longeOeAxis: orderData.order.lensDetails.longeOeAxis || "",
            longeOePrism: orderData.order.lensDetails.longeOePrism || "",
            longeOeDnp: orderData.order.lensDetails.longeOeDnp || "",

            pertoOdSpherical: orderData.order.lensDetails.pertoOdSpherical || "",
            pertoOdCylindrical: orderData.order.lensDetails.pertoOdCylindrical || "",
            pertoOdAxis: orderData.order.lensDetails.pertoOdAxis || "",
            pertoOdPrism: orderData.order.lensDetails.pertoOdPrism || "",
            pertoOdDnp: orderData.order.lensDetails.pertoOdDnp || "",
            pertoOeSpherical: orderData.order.lensDetails.pertoOeSpherical || "",
            pertoOeCylindrical: orderData.order.lensDetails.pertoOeCylindrical || "",
            pertoOeAxis: orderData.order.lensDetails.pertoOeAxis || "",
            pertoOePrism: orderData.order.lensDetails.pertoOePrism || "",
            pertoOeDnp: orderData.order.lensDetails.pertoOeDnp || "",

            addition: orderData.order.lensDetails.addition || "",
            dp: orderData.order.lensDetails.dp || "",
            height: orderData.order.lensDetails.height || "",
            frameDescription: orderData.order.lensDetails.frameDescription || "",
            frameColor: orderData.order.lensDetails.frameColor || "",
            lensType: orderData.order.lensDetails.lensType || "",
            lensCategory: orderData.order.lensDetails.lensCategory || "",
            observations: orderData.order.observations || "",
          });
        } else {
          toast({
            title: "Erro",
            description: orderData.message || "Erro ao carregar ordem de serviço.",
            variant: "destructive",
          });
        }

        setClients(clientsData);
        setSellers(sellersData);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao buscar dados da OS, clientes e vendedores.",
          variant: "destructive",
        });
      }
    }

    if (osNumber) {
      fetchData();
    }
  }, [osNumber]);

  useEffect(() => {
    const totalValue = parseFloat(
      formData.totalValue.replace(/[^\d]/g, "")
    ) / 100;
    const amountPaid = parseFloat(
      formData.amountPaid.replace(/[^\d]/g, "")
    ) / 100;

    if (!isNaN(totalValue) && !isNaN(amountPaid)) {
      const amountDue = totalValue - amountPaid;
      setFormData((prev) => ({
        ...prev,
        amountDue: amountDue.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
      }));
    }
  }, [formData.totalValue, formData.amountPaid]);
  useEffect(() => {
    async function fetchData() {
      try {
        const [clientsData, sellersData] = await Promise.all([
          getClientsAction(),
          getSellersAction(),
        ]);
        setClients(clientsData);
        setSellers(sellersData);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao buscar clientes e vendedores.",
          variant: "destructive",
        });
      }
    }
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "totalValue" || name === "amountPaid") {
      setFormData((prev) => ({
        ...prev,
        [name]: formatCurrency(value),
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClient || !selectedSeller) {
      toast({
        title: "Erro",
        description: "Selecione um cliente e um vendedor.",
        variant: "destructive",
      });
      return;
    }

    try {
      const isoDate = validateAndConvertDate(formData.date);
      const isoDeliveryDate = validateAndConvertDate(formData.deliveryDate);

      const formDataObj = new FormData();
      formDataObj.append("orderNumber", osNumber);
      formDataObj.append("clientId", selectedClient);
      formDataObj.append("sellerId", selectedSeller);
      formDataObj.append("examiner", formData.examiner);

      formDataObj.append(
        "totalValue",
        formData.totalValue.replace(/[^\d.,]/g, "").replace(",", ".")
      );
      formDataObj.append(
        "amountPaid",
        formData.amountPaid.replace(/[^\d.,]/g, "").replace(",", ".")
      );
      formDataObj.append(
        "amountDue",
        formData.amountDue.replace(/[^\d.,]/g, "").replace(",", ".")
      );

      formDataObj.append("date", isoDate);
      formDataObj.append("deliveryDate", isoDeliveryDate);

      const lensDetailsKeys = [
        "longeOdSpherical",
        "longeOdCylindrical",
        "longeOdAxis",
        "longeOdPrism",
        "longeOdDnp",
        "longeOeSpherical",
        "longeOeCylindrical",
        "longeOeAxis",
        "longeOePrism",
        "longeOeDnp",
        "pertoOdSpherical",
        "pertoOdCylindrical",
        "pertoOdAxis",
        "pertoOdPrism",
        "pertoOdDnp",
        "pertoOeSpherical",
        "pertoOeCylindrical",
        "pertoOeAxis",
        "pertoOePrism",
        "pertoOeDnp",
        "addition",
        "dp",
        "height",
        "frameDescription",
        "frameColor",
        "lensType",
        "lensCategory",
      ];

      lensDetailsKeys.forEach((key) => {
        formDataObj.append(key, formData[key as keyof typeof formData]);
      });

      formDataObj.append("observations", formData.observations);

      const result = await updateOrderAction(Number(osNumber), formDataObj);

      if (result.success) {
        toast({
          title: "Sucesso",
          description: "Ordem de serviço atualizada com sucesso!",
          variant: "success",
        });
        router.push("/ordens-servico");
      } else {
        throw new Error("Erro ao atualizar ordem de serviço.");
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar ordem de serviço.",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="flex flex-col mx-4 my-6 sm:px-7 sm:w-full sm:-ml-2">
      <h1 className="text-xl font-semibold mb-4">Edição de Ordem de Serviço</h1>

      <form
        onSubmit={handleSave}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full"
      >
        <div className="sm:col-span-2">
          <label className="block font-semibold mb-1">Cliente</label>
          <Select onValueChange={(value) => setSelectedClient(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione um cliente" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id.toString()}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="sm:col-span-2">
          <label className="block font-semibold mb-1">Vendedor</label>
          <Select onValueChange={(value) => setSelectedSeller(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione um vendedor" />
            </SelectTrigger>
            <SelectContent>
              {sellers.map((seller) => (
                <SelectItem key={seller.id} value={seller.id.toString()}>
                  {seller.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="sm:col-span-2">
          <label className="block font-semibold mb-1">Examinador</label>
          <Input
            type="text"
            name="examiner"
            placeholder="Digite o nome do examinador"
            className="w-full"
            value={formData.examiner}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Data da Venda</label>
          <Input
            type="text"
            name="date"
            placeholder="Ex.: 24/03/2024"
            value={formData.date}
            onChange={handleInputChange}
            className="w-full"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Entrega Prevista</label>
          <Input
            type="text"
            name="deliveryDate"
            placeholder="Ex.: 30/03/2024"
            value={formData.deliveryDate}
            onChange={handleInputChange}
            className="w-full"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Valor da Venda</label>
          <Input
            type="text"
            name="totalValue"
            placeholder="Digite o valor da venda"
            className="w-full"
            value={formData.totalValue}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Valor Pago</label>
          <Input
            type="text"
            name="amountPaid"
            placeholder="Digite o valor pago"
            className="w-full"
            value={formData.amountPaid}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Valor a Pagar</label>
          <Input
            type="text"
            name="amountDue"
            value={formData.amountDue}
            disabled
            className="bg-gray-100 w-full"
          />
        </div>

        <div className="sm:col-span-2">
          <h3 className="text-lg font-bold">Detalhes da Lente</h3>
        </div>

        <div>
          <label className="block font-semibold mb-1">
            Longe OE - Esférico (ESF.)
          </label>
          <Input
            type="text"
            name="longeOeSpherical"
            placeholder="Ex.: +0.25"
            value={formData.longeOeSpherical}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">
            Longe OD - Esférico (ESF.)
          </label>
          <Input
            type="text"
            name="longeOdSpherical"
            placeholder="Ex.: 0.00"
            value={formData.longeOdSpherical}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">
            Longe OE - Cilíndrico(CIL.)
          </label>
          <Input
            type="text"
            name="longeOeCylindrical"
            placeholder="Ex.: 0"
            value={formData.longeOeCylindrical}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">
            Longe OD - Cilíndrico(CIL.)
          </label>
          <Input
            type="text"
            name="longeOdCylindrical"
            placeholder="Ex.: 0.00"
            value={formData.longeOdCylindrical}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Longe OE - Eixo</label>
          <Input
            type="text"
            name="longeOeAxis"
            placeholder="Ex.: 31.5"
            value={formData.longeOeAxis}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Longe OD - Eixo</label>
          <Input
            type="text"
            name="longeOdAxis"
            placeholder="Ex.: +0.25"
            value={formData.longeOdAxis}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Longe OE - Prisma</label>
          <Input
            type="text"
            name="longeOePrism"
            placeholder="Ex.: -0.25"
            value={formData.longeOePrism}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Longe OD - Prisma</label>
          <Input
            type="text"
            name="longeOdPrism"
            placeholder="Ex.: 60"
            value={formData.longeOdPrism}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Longe OE - DNP</label>
          <Input
            type="text"
            name="longeOeDnp"
            placeholder="Ex.: 0.00"
            value={formData.longeOeDnp}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Longe OD - DNP</label>
          <Input
            type="text"
            name="longeOdDnp"
            placeholder="Ex.: 32.1"
            value={formData.longeOdDnp}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">
            Perto OE - Esférico (ESF.)
          </label>
          <Input
            type="text"
            name="pertoOeSpherical"
            placeholder="Ex.: +2.50"
            value={formData.pertoOeSpherical}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">
            Perto OD - Esférico (ESF.)
          </label>
          <Input
            type="text"
            name="pertoOdSpherical"
            placeholder="Ex.: 0.00"
            value={formData.pertoOdSpherical}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">
            Perto OE - Cilíndrico (CIL.)
          </label>
          <Input
            type="text"
            name="pertoOeCylindrical"
            placeholder="Ex.: 0"
            value={formData.pertoOeCylindrical}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">
            Perto OD - Cilíndrico (CIL.)
          </label>
          <Input
            type="text"
            name="pertoOdCylindrical"
            placeholder="Ex.: 0.00"
            value={formData.pertoOdCylindrical}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Perto OE - Eixo</label>
          <Input
            type="text"
            name="pertoOeAxis"
            placeholder="Ex.: 31.5"
            value={formData.pertoOeAxis}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Perto OD - Eixo</label>
          <Input
            type="text"
            name="pertoOdAxis"
            placeholder="Ex.: +2.50"
            value={formData.pertoOdAxis}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Perto OE - Prisma</label>
          <Input
            type="text"
            name="pertoOePrism"
            placeholder="Ex.: -0.25"
            value={formData.pertoOePrism}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Perto OD - Prisma</label>
          <Input
            type="text"
            name="pertoOdPrism"
            placeholder="Ex.: 60"
            value={formData.pertoOdPrism}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Perto OE - DNP</label>
          <Input
            type="text"
            name="pertoOeDnp"
            placeholder="Ex.: 0.00"
            value={formData.pertoOeDnp}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Perto OD - DNP</label>
          <Input
            type="text"
            name="pertoOdDnp"
            placeholder="Ex.: 32.1"
            value={formData.pertoOdDnp}
            onChange={handleInputChange}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block font-semibold mb-1">Adição (ADD)</label>
          <Input
            type="text"
            name="addition"
            placeholder="Ex.: +2.25"
            className="w-full"
            value={formData.addition}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">
            Descrição da Armação
          </label>
          <Input
            type="text"
            name="frameDescription"
            placeholder="Ex.: Quadrada 90º"
            value={formData.frameDescription}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Cor da Armação</label>
          <Input
            type="text"
            name="frameColor"
            placeholder="Ex.: Azul"
            value={formData.frameColor}
            onChange={handleInputChange}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block font-semibold mb-1">Tipo de Lente</label>
          <Input
            type="text"
            name="lensType"
            placeholder="Ex.: Anti-Reflexo (AR)"
            className="w-full"
            value={formData.lensType}
            onChange={handleInputChange}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block font-semibold mb-1">Categoria da Lente</label>
          <Input
            type="text"
            name="lensCategory"
            placeholder="Ex.: Multifocal"
            className="w-full"
            value={formData.lensCategory}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">DP</label>
          <Input
            type="text"
            name="dp"
            placeholder="Ex.: 61.5"
            value={formData.dp}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Altura</label>
          <Input
            type="text"
            name="height"
            placeholder="Digite a altura"
            value={formData.height}
            onChange={handleInputChange}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block font-semibold mb-1">Observações</label>
          <Input
            type="text"
            name="observations"
            placeholder="Adicione observações, se necessário"
            className="w-full"
            value={formData.observations}
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
