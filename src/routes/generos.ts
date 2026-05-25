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

        const novoGenero = await prisma.genero.create({
            data: { nome: nome.trim() }
        });

        res.status(201).json(novoGenero);
    } catch (ex) {
        res.status(500).json({
            erro: "Erro ao cadastrar gênero."
        });
    }
});

router.get("/", async (req: Request, res: Response) => {
    try {
        const generos = await prisma.genero.findMany({
            include: { jogos: true }
        });

        res.json(generos);
    } catch (error) {
        res.status(500).json({
            erro: "Erro ao buscar gêneros."
        });
    }
});

export default router;
