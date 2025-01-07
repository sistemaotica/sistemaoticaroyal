import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash("Pietro@272", 10);

    const admin = await prisma.user.create({
        data: {
            email: "pietrosantos@blockcode.online",
            cpf: "52824862882",
            password: hashedPassword,
            name: "Pietro Santos",
            role: "ADMIN",
            phone: "11980141941",
            birthDate: new Date("1990-05-15"),
        },
    });

    console.log("Administrador criado:", admin);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
