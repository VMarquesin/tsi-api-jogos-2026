import { Router, Request, Response } from "express";
import { prisma } from "../prisma";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    const jogos = await prisma.jogo.findMany({
        include: {
            genero: true,
            plataformas: true
        }
    });

    res.json(jogos);
});

router.post("/", async (req: Request, res: Response) => {
    const { titulo, generoId, plataformasIds } = req.body;

    if (!titulo || !generoId) {
        return res.status(400).json({
            erro: "Título e generoId são obrigatórios."
        });
    }

    const genero = await prisma.genero.findUnique({
        where: { id: Number(generoId) }
    });

    if (!genero) {
        return res.status(404).json({
            erro: "Gênero não encontrado."
        });
    }

    if (plataformasIds && plataformasIds.length > 0) {
        const plataformas = await prisma.plataforma.findMany({
            where: { id: { in: plataformasIds } }
        });

        if (plataformas.length !== plataformasIds.length) {
            return res.status(400).json({
                erro: "Uma ou mais plataformas não estão cadastradas."
            });
        }
    }

    const jogo = await prisma.jogo.create({
        data: {
            titulo,
            generoId: Number(generoId),
            plataformas: {
                connect: plataformasIds ? plataformasIds.map((id: number) => ({ id })) : []
            }
        },
        include: {
            genero: true,
            plataformas: true
        }
    });

    res.status(201).json(jogo);
});

router.post("/:id/plataformas", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { plataformasIds } = req.body;

    const jogo = await prisma.jogo.findUnique({
        where: { id }
    });

    if (!jogo) {
        return res.status(404).json({
            erro: "Jogo não encontrado."
        });
    }

    const plataformas = await prisma.plataforma.findMany({
        where: { id: { in: plataformasIds } }
    });

    if (plataformas.length !== plataformasIds.length) {
        return res.status(400).json({
            erro: "Uma ou mais plataformas não encontradas."
        });
    }

    const jogoAtualizado = await prisma.jogo.update({
        where: { id },
        data: {
            plataformas: {
                connect: plataformasIds.map((idPlataforma: number) => ({ id: idPlataforma }))
            }
        },
        include: {
            genero: true,
            plataformas: true
        }
    });

    res.json(jogoAtualizado);
});

export default router;
