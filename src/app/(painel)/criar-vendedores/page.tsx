"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { createSellerAction } from "@/actions/sellerActions";
import { useRouter } from "next/navigation";

// Função para formatar CPF
const formatCPF = (value: string): string => {
  return value
    .replace(/\D/g, "") // Remove todos os caracteres não numéricos
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .slice(0, 14); // Limita o tamanho máximo do CPF
};

// Função para formatar telefone
const formatPhone = (value: string): string => {
  return value
    .replace(/\D/g, "") // Remove todos os caracteres não numéricos
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2")
    .slice(0, 15); // Limita o tamanho máximo do telefone
};

export default function Page() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    phone: "",
    birthDate: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Formata os campos de CPF e telefone enquanto o usuário digita
    if (name === "cpf") {
      setFormData((prev) => ({ ...prev, [name]: formatCPF(value) }));
    } else if (name === "phone") {
      setFormData((prev) => ({ ...prev, [name]: formatPhone(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSave = async () => {
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    try {
      const formDataObj = new FormData();
      formDataObj.append("name", formData.name);
      formDataObj.append("cpf", formData.cpf);
      formDataObj.append("phone", formData.phone);
      formDataObj.append("birthDate", formData.birthDate);
      formDataObj.append("email", formData.email);
      formDataObj.append("password", formData.password);

      const result = await createSellerAction(formDataObj);

      if (result.success) {
        toast({
          title: "Sucesso",
          description: "Vendedor salvo com sucesso!",
          variant: "success",
        });

        router.push("/vendedores");
      } else {
        toast({
          title: "Erro",
          description: result.message || "Erro ao salvar vendedor.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Erro ao salvar vendedor:", error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao salvar vendedor.",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="flex flex-col mx-4 my-6 sm:px-7 sm:w-full sm:-ml-2">
      <h1 className="text-xl font-semibold mb-4">Adicionar Vendedores</h1>
      <form
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full"
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <div className="sm:col-span-2">
          <label className="block font-semibold mb-1">Nome do Vendedor</label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            placeholder="Digite o nome do vendedor"
            className="w-full"
            onChange={handleInputChange}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block font-semibold mb-1">CPF do Vendedor</label>
          <Input
            type="text"
            name="cpf"
            value={formData.cpf}
            placeholder="Digite o CPF do vendedor"
            className="w-full"
            onChange={handleInputChange}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block font-semibold mb-1">Telefone do Vendedor</label>
          <Input
            type="text"
            name="phone"
            value={formData.phone}
            placeholder="Digite o telefone do vendedor"
            className="w-full"
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

        <div className="sm:col-span-2">
          <label className="block font-semibold mb-1">E-mail do Vendedor</label>
          <Input
            type="text"
            name="email"
            value={formData.email}
            placeholder="Digite o e-mail do vendedor"
            className="w-full"
            onChange={handleInputChange}
          />
        </div>

        <div className="sm:col-span-2 relative">
          <label className="block font-semibold mb-1">Senha do Vendedor</label>
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            placeholder="Digite a senha do vendedor"
            className="w-full pr-10"
            onChange={handleInputChange}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 mt-3 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="sm:col-span-2 relative">
          <label className="block font-semibold mb-1">Confirmar Senha</label>
          <Input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            placeholder="Confirme a senha do vendedor"
            className="w-full pr-10"
            onChange={handleInputChange}
          />
          <button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            className="absolute right-3 top-1/2 mt-3 -translate-y-1/2 text-gray-500"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
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
