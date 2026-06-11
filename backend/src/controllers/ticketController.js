import { ticketRepository } from '../repository/TicketRepository.js';
import { servicoRepository } from '../repository/ServicoRepository.js';
import { demandaRepository } from '../repository/DemandaRepository.js';
import { statusRepository } from '../repository/StatusRepository.js';
import { statusNomeRepository } from '../repository/StatusNomeRepository.js';
import { usuarioRepository } from '../repository/UsuarioRepository.js';
import { getDb } from '../config/database.js';


// CRIAR NOVO TICKET
export const criarTicket = async (req, res) => {
    
    const dadosDeEntrada = req.body;

    const servico = await servicoRepository.findById(dadosDeEntrada.idServico);
    const status = await statusNomeRepository.findAll();

    const db = getDb();
    const novoTicket = await db.transaction(async (transactionalEntityManager) => {

        const novoSerial  = await ticketRepository.gerarProximoSerial(transactionalEntityManager);
        const ticketSalvo = await ticketRepository.create({ ...dadosDeEntrada, serial: novoSerial }, transactionalEntityManager);

        const demanda = await demandaRepository.create({
            idUsuarioCreated: dadosDeEntrada.idUsuario,
            idTicket: ticketSalvo.id
        }, transactionalEntityManager);

        await statusRepository.insert({
            ticketId: ticketSalvo.id,
            statusNomeId: 1
        }, transactionalEntityManager);

        return {
            ...ticketSalvo,
            demanda: demanda,
        };
    });

    return res.status(201).json({
        mensagem: "Ticket aberto com sucesso.",
        ticket: {
            ...novoTicket,
            servico: servico,
            status: status[0]
        },
    });
};


// CONSULTAR TICKET
export const consultarTicket = async (req, res) => {

    const { serial } = req.params;
    const ticket = await ticketRepository.findBySerial(serial);
    const ultimoStatus = await statusRepository.obterUltimoStatusDoTicket(ticket.id);

    if (!ultimoStatus || !ultimoStatus.statusNome)
        return res.status(500).json({ mensagem: "Erro de integridade: Nenhum status foi encontrado para o ticket solicitado." });

    const { idServico, ...ticketLimpo } = ticket;

    return res.status(200).json({
        ...ticketLimpo,
        status: ultimoStatus.statusNome
    });
}


// CONSULTAR TICKET POR SERVIÇO
export const consultarTicketByServico = async (req, res) => {

    const { idServico } = req.params;
    const tickets = await ticketRepository.findByServico(idServico);

    const ticketsLimpos = tickets.map(ticket => {
        const { servico, ...ticketLimpo } = ticket;
        return ticketLimpo;
    });

    return res.status(200).json(ticketsLimpos);
}


// ATUALIZAR TICKET
export const atualizarTicket = async (req, res) => {
    
    const { serial } = req.params;
    const dadosDeEntrada = req.body;

    await servicoRepository.assertExists(dadosDeEntrada.idServico);
    await statusNomeRepository.assertExists(dadosDeEntrada.idStatus);
    await usuarioRepository.assertExists(dadosDeEntrada.idUsuarioResolved);

    const ticketAtual     = await ticketRepository.findBySerial(serial);

    const tituloMudou     = ticketAtual.titulo !== dadosDeEntrada.titulo;
    const prioridadeMudou = ticketAtual.prioridade !== dadosDeEntrada.prioridade;
    const descricaoMudou  = ticketAtual.descricao !== dadosDeEntrada.descricao;
    const servicoMudou    = ticketAtual.idServico !== dadosDeEntrada.idServico;
    
    const ultimoStatus    = await statusRepository.obterUltimoStatusDoTicket(ticketAtual.id);
    console.log("Último status do ticket:", ultimoStatus);
    const statusMudou     = ultimoStatus.statusNomeId !== dadosDeEntrada.idStatus;

    const demandaAtual    = ticketAtual.demanda;
    const usuarioMudou    = demandaAtual?.idUsuarioResolved !== dadosDeEntrada.idUsuarioResolved;

    const houveAlteracao  = tituloMudou || prioridadeMudou || descricaoMudou || servicoMudou || statusMudou || usuarioMudou;
    if (!houveAlteracao)
        return res.status(200).json({ 
            mensagem: "Nenhum campo foi alterado. O banco de dados já possui estas informações." 
        });
    
    const db = getDb();
    await db.transaction(async (transactionalEntityManager) => {

        if (tituloMudou || prioridadeMudou || descricaoMudou || servicoMudou)
            await ticketRepository.update(ticketAtual.id, {
                titulo: dadosDeEntrada.titulo,
                prioridade: dadosDeEntrada.prioridade,
                descricao: dadosDeEntrada.descricao,
                idServico: dadosDeEntrada.idServico
            }, transactionalEntityManager);

        if (statusMudou)
            await statusRepository.insert({
                ticketId: ticketAtual.id,
                statusNomeId: dadosDeEntrada.idStatus
            }, transactionalEntityManager);

        if (usuarioMudou && demandaAtual)
            await demandaRepository.update(demandaAtual.id, {
                idUsuarioResolved: dadosDeEntrada.idUsuarioResolved
            }, transactionalEntityManager);
    });

    const ticketAtualizado = await ticketRepository.findBySerial(serial);
    const historicoStatusFinal = await statusRepository.obterUltimoStatusDoTicket(ticketAtualizado.id);

    const { status, idServico, ...ticketLimpo } = ticketAtualizado;

    return res.status(200).json({
        mensagem: "Ticket atualizado com sucesso.",
        ticket: {
            ...ticketLimpo,
            status: historicoStatusFinal.statusNome
        }   
    });
}

// export const criarV2 = async (req, res) => {

//     const dadosDeEntrada = req.body;

//     if(!dadosDeEntrada)
//         return res.status(402).json({ mensagem: "Dados de entrada invalido." });
    
//     const resposta = await ticketRepository.create(dadosDeEntrada);

//     const novaDemanda = await demandaRepository.create({
//         idUsuarioCreated: dadosDeEntrada.idUsuario,
//         idTicket: resposta.id  
//     })

//     console.log

//     const status = await statusRepository.create({
//         ticketId: resposta.id
//         statusNomeId: 1
//     });

//     if (!resposta || !novaDemanda || !status) {
//         return res.status(500).json({ mensagem: "Erro ao criar o ticket." });
//     }

//     return res.status(201).json({
//         mensagem: "Ticket aberto com sucesso.",
//         ticket: resposta
//     });

// }