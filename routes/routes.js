import express from 'express'
import bodyParser from 'body-parser';
import { Games } from '../models/modelGame.js';

const app = express();
const PORT = process.env.PORT || 3000;

export function HandleRequest() {
    app.use(bodyParser.json());

    app.get('/', (req, res) => {
        res.send('API para Gestão de Jogos de Tabuleiro');
    });

    app.post('/games/post/:titulo/:descricao/:num_jogadores_recomendados/:faixa_etaria', async (req, res) => {

        try {
            const gameTitulo = req.params.titulo
            const gameDescricao = req.params.descricao
            const gameJogadores = req.params.num_jogadores_recomendados
            const gameFaixaEtaria = req.params.faixa_etaria

            const novoJogo = await Games.create({
                titulo: gameTitulo,
                descricao: gameDescricao,
                num_jogadores_recomendados: gameJogadores,
                faixa_etaria: gameFaixaEtaria
            })
            return res.json(novoJogo)
        } catch (err) {
            return res.status(500).json({ message: 'Ocorreu um erro ao buscar o jogo.' })
        }

    })

    // Exemplo de rota para buscar todos os jogos
    app.get('/games/get', async (req, res) => {
        try {
            const games = await Games.findAll();
             
            return res.json(games)
        } catch (err) {
            return res.status(500).json({ message: 'Ocorreu um erro ao buscar o jogo.' })
        }
    })

    app.get('/games/get/:id', async (req, res) => {
        try {
            const gameID = req.params.id
            const game = await Games.findByPk(gameID)

            if (game) {
                return res.json(game)
            } else {
                return res.status(404).json({ message: 'Jogo não encontrado' })
            }

        } catch (err) {
            return res.status(500).json({ message: 'Ocorreu um erro ao buscar o jogo.' })
        }
    })

    app.delete('/games/delete/:id', async (req, res) => {
        try {
            const gameID = req.params.id

            const deletedRows = await Games.destroy({
                where: {
                    id: gameID
                }
            })

            if (deletedRows > 0) {
                return res.status(200).json({ message: "Jogo excluido com sucesso" })
            } else {
                return res.status(404).json({ message: 'Jogo não encontrado' })
            }

        } catch (err) {
            return res.status(500).json({ message: 'Ocorreu um erro ao excluir o jogo.' })
        }
    })

    app.put('/games/put/:id/:titulo/:descricao/:num_jogadores_recomendados/:faixa_etaria', async (req, res) => {
        const gameID = req.params.id
        const gameTitulo = req.params.titulo
        const gameDescricao = req.params.descricao
        const gameJogadores = req.params.num_jogadores_recomendados
        const gameFaixaEtaria = req.params.faixa_etaria

        try {
            const game = await Games.findByPk(gameID)

            if (!game) {
                return res.status(404).json({ message: "Jogo não encontrado" })
            }

            game.titulo = gameTitulo
            game.descricao = gameDescricao
            game.num_jogadores_recomendados = gameJogadores
            game.faixa_etaria = gameFaixaEtaria

            await game.save()

            return res.status(200).json({ message: "Jogo atualizado com sucesso" })
        } catch (err) {
            return res.status(500).json({ message: 'Ocorreu um erro ao atualizar o jogo.' })
        }
    })

    // Inicialização do servidor
    app.listen(PORT, () => {
        console.log(`Server is listening at http://localhost:${PORT}`)
    })
}