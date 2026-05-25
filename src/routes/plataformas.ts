import { Router, Request, Response } from "express";
import { prisma } from "../prisma";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
    try {
        const { nome } = req.body;

        if (!nome || nome.trim() === "") {
            return res.status(400).json({
                erro: "O campo nome é obrigatório."
            });
        }

        const novaPlataforma = await prisma.plataforma.create({
            data: { nome: nome.trim() }
        });

        res.status(201).json(novaPlataforma);
    } catch (ex) {
        res.status(500).json({
            erro: "Erro ao cadastrar plataforma."
        });
    }
});

router.get("/", async (req: Request, res: Response) => {
    try {
        const plataformas = await prisma.plataforma.findMany({
            include: { jogos: true }
        });

        res.json(plataformas);
    } catch (error) {
        res.status(500).json({
            erro: "Erro ao buscar plataformas."
        });
    }
});

export default router;
