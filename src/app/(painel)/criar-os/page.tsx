"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { createOrderAction, getNextOrderNumberAction } from "@/actions/orderActions";
import { getClientsAction } from "@/actions/clientActions";
import { getSellersAction } from "@/actions/sellerActions";

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

export default function Page() {
  const [osNumber, setOsNumber] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    examiner: "",
    date: "",
    totalValue: "",
    amountPaid: "",
    amountDue: "",
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

  useEffect(() => {
    async function fetchData() {
      try {
        // Obter o número da OS sequencial usando Server Actions
        const nextOrderNumber = await getNextOrderNumberAction();
        setOsNumber(nextOrderNumber);

        // Buscar clientes e vendedores
        const [fetchedClients, fetchedSellers] = await Promise.all([
          getClientsAction(),
          getSellersAction(),
        ]);
        setClients(fetchedClients || []);
        setSellers(fetchedSellers || []);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao carregar dados iniciais.",
          variant: "destructive",
        });
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const totalValue = parseFloat(formData.totalValue.replace(/[^\d.,]/g, "").replace(",", ".") || "0");
    const amountPaid = parseFloat(formData.amountPaid.replace(/[^\d.,]/g, "").replace(",", ".") || "0");

    if (!isNaN(totalValue) && !isNaN(amountPaid)) {
      const amountDue = totalValue - amountPaid;
      setFormData((prev) => ({
        ...prev,
        amountDue: new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(amountDue),
      }));
    }
  }, [formData.totalValue, formData.amountPaid]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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
      formDataObj.append("date", isoDate);
      formDataObj.append("totalValue", formData.totalValue.replace(/[^\d.,]/g, "").replace(",", "."));
      formDataObj.append("amountPaid", formData.amountPaid.replace(/[^\d.,]/g, "").replace(",", "."));
      formDataObj.append("amountDue", formData.amountDue.replace(/[^\d.,]/g, "").replace(",", "."));
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

      const result = await createOrderAction(formDataObj);

      if (result.success) {
        toast({
          title: "Sucesso",
          description: "Ordem de serviço criada com sucesso!",
          variant: "success",
        });
      } else {
        throw new Error("Erro ao criar ordem de serviço.");
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
      <h1 className="text-xl font-semibold mb-4">Criar/Edição de Ordem de Serviço</h1>
      <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {/* Número da OS */}
        <div className="sm:col-span-2">
          <label className="block font-semibold mb-1">Número da OS</label>
          <Input type="text" value={osNumber} disabled className="bg-gray-100 w-full" />
        </div>

        {/* Cliente */}
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

        {/* Vendedor */}
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

        {/* Examinador */}
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

        {/* Data da Venda */}
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

        {/* Entrega Prevista */}
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

        {/* Valor da Venda */}
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

        {/* Valor Pago */}
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

        {/* Valor a Pagar */}
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

          {/* Detalhes da Lente */}
          <div className="sm:col-span-2">
            <h3 className="text-lg font-bold">Detalhes da Lente</h3>
          </div>

          {/* Longe OD */}
          <div>
            <label className="block font-semibold mb-1">Longe OD - Esférico (ESF.)</label>
            <Input
              type="text"
              name="longeOdSpherical"
              placeholder="Ex.: +0.25"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Longe OD - Cilíndrico (CIL.)</label>
            <Input
              type="text"
              name="longeOdCylindrical"
              placeholder="Ex.: 0.00"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Longe OD - Eixo</label>
            <Input
              type="text"
              name="longeOdAxis"
              placeholder="Ex.: 0"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Longe OD - Prisma</label>
            <Input
              type="text"
              name="longeOdPrism"
              placeholder="Ex.: 0.00"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Longe OD - DNP</label>
            <Input
              type="text"
              name="longeOdDnp"
              placeholder="Ex.: 31.5"
              onChange={handleInputChange}
            />
          </div>

          {/* Longe OE */}
          <div>
            <label className="block font-semibold mb-1">Longe OE - Esférico (ESF.)</label>
            <Input
              type="text"
              name="longeOeSpherical"
              placeholder="Ex.: +0.25"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Longe OE - Cilíndrico (CIL.)</label>
            <Input
              type="text"
              name="longeOeCylindrical"
              placeholder="Ex.: -0.25"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Longe OE - Eixo</label>
            <Input
              type="text"
              name="longeOeAxis"
              placeholder="Ex.: 60"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Longe OE - Prisma</label>
            <Input
              type="text"
              name="longeOePrism"
              placeholder="Ex.: 0.00"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Longe OE - DNP</label>
            <Input
              type="text"
              name="longeOeDnp"
              placeholder="Ex.: 32.1"
              onChange={handleInputChange}
            />
          </div>

          {/* Perto OD */}
          <div>
            <label className="block font-semibold mb-1">Perto OD - Esférico (ESF.)</label>
            <Input
              type="text"
              name="pertoOdSpherical"
              placeholder="Ex.: +2.50"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Perto OD - Cilíndrico (CIL.)</label>
            <Input
              type="text"
              name="pertoOdCylindrical"
              placeholder="Ex.: 0.00"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Perto OD - Eixo</label>
            <Input
              type="text"
              name="pertoOdAxis"
              placeholder="Ex.: 0"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Perto OD - Prisma</label>
            <Input
              type="text"
              name="pertoOdPrism"
              placeholder="Ex.: 0.00"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Perto OD - DNP</label>
            <Input
              type="text"
              name="pertoOdDnp"
              placeholder="Ex.: 31.5"
              onChange={handleInputChange}
            />
          </div>

          {/* Perto OE */}
          <div>
            <label className="block font-semibold mb-1">Perto OE - Esférico (ESF.)</label>
            <Input
              type="text"
              name="pertoOeSpherical"
              placeholder="Ex.: +2.50"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Perto OE - Cilíndrico (CIL.)</label>
            <Input
              type="text"
              name="pertoOeCylindrical"
              placeholder="Ex.: -0.25"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Perto OE - Eixo</label>
            <Input
              type="text"
              name="pertoOeAxis"
              placeholder="Ex.: 60"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Perto OE - Prisma</label>
            <Input
              type="text"
              name="pertoOePrism"
              placeholder="Ex.: 0.00"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Perto OE - DNP</label>
            <Input
              type="text"
              name="pertoOeDnp"
              placeholder="Ex.: 32.1"
              onChange={handleInputChange}
            />
          </div>

          {/* Adição */}
          <div className="sm:col-span-2">
            <label className="block font-semibold mb-1">Adição (ADD)</label>
            <Input
              type="text"
              name="addition"
              placeholder="Ex.: +2.25"
              className="w-full"
              onChange={handleInputChange}
            />
          </div>

          {/* Armação */}
          <div>
            <label className="block font-semibold mb-1">Descrição da Armação</label>
            <Input
              type="text"
              name="frameDescription"
              placeholder="Ex.: Quadrada 90º"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Cor da Armação</label>
            <Input
              type="text"
              name="frameColor"
              placeholder="Ex.: Azul"
              onChange={handleInputChange}
            />
          </div>

          {/* Tipo de Lente */}
          <div className="sm:col-span-2">
            <label className="block font-semibold mb-1">Tipo de Lente</label>
            <Input
              type="text"
              name="lensType"
              placeholder="Ex.: Anti-Reflexo (AR)"
              className="w-full"
              onChange={handleInputChange}
            />
          </div>

          {/* Categoria da Lente */}
          <div className="sm:col-span-2">
            <label className="block font-semibold mb-1">Categoria da Lente</label>
            <Input
              type="text"
              name="lensCategory"
              placeholder="Ex.: Multifocal"
              className="w-full"
              onChange={handleInputChange}
            />
          </div>

          {/* DP e Altura */}
          <div>
            <label className="block font-semibold mb-1">DP</label>
            <Input
              type="text"
              name="dp"
              placeholder="Ex.: 61.5"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Altura</label>
            <Input
              type="text"
              name="height"
              placeholder="Digite a altura"
              onChange={handleInputChange}
            />
          </div>

          {/* Observações */}
          <div className="sm:col-span-2">
            <label className="block font-semibold mb-1">Observações</label>
            <Input
              type="text"
              name="observations"
              placeholder="Adicione observações, se necessário"
              className="w-full"
              onChange={handleInputChange}
            />
          </div>

          {/* Botão Salvar */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 sm:col-span-2">
            <Button type="submit" className="w-full">
              Salvar
            </Button>
          </div>
      </form>
    </main>
  );
}
