import { cargoRepository } from "../repository/CargoRepository.js";
import { servicoRepository } from "../repository/ServicoRepository.js";
import { statusNomeRepository } from "../repository/StatusNomeRepository.js";


// LISTAR TODOS OS CARGOS
export const listarCargos = async (req, res) => {

    const cargos = await cargoRepository.findAll();
    return res.status(200).json({cargos});
}

// LISTAR TODOS OS SERVICOS
export const listarServicos = async (req, res) => {

    const servicos = await servicoRepository.findAll();
    return res.status(200).json({servicos});
}

// LISTAR TODOS OS STATUS
export const listarStatus = async (req, res) => {

    const status = await statusNomeRepository.findAll();
    return res.status(200).json({status});
}