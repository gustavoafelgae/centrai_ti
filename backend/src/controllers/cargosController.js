import { cargoRepository } from "../repository/CargoRepository.js";


// LISTAR TODOS OS CARGOS
export const listarCargos = async (req, res) => {

    const cargos = await cargoRepository.findAll();
    return res.status(200).json({cargos});
}