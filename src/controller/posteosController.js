
import {
    createPosteoService,
    getPosteosService,
    getPosteoByIdService,
    getMisPosteosService,
    getAnimalOwnedByUserService,
    updatePosteoService,
    deletePosteoService
} from "../service/posteosService.js";

import { ObjectId } from "mongodb";

function validarPosteo(data, parcial = false) {
    const campos = ["titulo", "texto", "imagen", "animal_id"];

    if (!parcial) {
        for (const campo of campos) {
            if (data[campo] === undefined || data[campo] === null || data[campo] === "") {
                return `El campo ${campo} es obligatorio`;
            }
        }
    }

    for (const campo of ["titulo", "texto", "imagen"]) {
        if (data[campo] !== undefined) {
            if (typeof data[campo] !== "string" || !data[campo].trim()) {
                return `El campo ${campo} debe ser un texto válido`;
            }
        }
    }

    if (data.animal_id !== undefined) {
        if (
            typeof data.animal_id !== "string" ||
            !ObjectId.isValid(data.animal_id)
        ) {
            return "El animal_id no es válido";
        }
    }

    if (parcial && !campos.some(campo => data[campo] !== undefined)) {
        return "Debés enviar al menos un campo para modificar";
    }

    return null;
}


export async function createPosteoController(req, res) {
    try {
        const errorValidacion = validarPosteo(req.body);

        if (errorValidacion) {
            return res.status(400).json({ message: errorValidacion });
        }

        // Comprobar que el animal pertenezca al refugio autenticado
        const animal = await getAnimalOwnedByUserService(
            req.body.animal_id,
            req.user.id
        );

        if (!animal) {
            return res.status(404).json({
                message: "No se encontró el animal o no pertenece a este refugio"
            });
        }

        const nuevoPosteo = {
            fecha: new Date(),
            titulo: req.body.titulo.trim(),
            texto: req.body.texto.trim(),
            imagen: req.body.imagen.trim(),
            animal_id: new ObjectId(req.body.animal_id),
            user_id: new ObjectId(req.user.id)
        };

        const result = await createPosteoService(nuevoPosteo);

        return res.status(201).json({
            message: "Posteo creado correctamente",
            posteoId: result.insertedId
        });

    } catch (error) {
        console.error("Error al crear posteo:", error);
        return res.status(500).json({
            message: "Error al crear el posteo"
        });
    }
}


export async function getPosteosController(req, res) {
    try {
        const posteos = await getPosteosService();

        return res.status(200).json(posteos);

    } catch (error) {
        console.error("Error al obtener posteos:", error);
        return res.status(500).json({
            message: "Error al obtener los posteos"
        });
    }
}


export async function getMisPosteosController(req, res) {
    try {
        const posteos = await getMisPosteosService(req.user.id);

        return res.status(200).json(posteos);

    } catch (error) {
        console.error("Error al obtener mis posteos:", error);
        return res.status(500).json({
            message: "Error al obtener los posteos del refugio"
        });
    }
}


export async function getPosteoByIdController(req, res) {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "El ID del posteo no es válido"
            });
        }

        const posteo = await getPosteoByIdService(id);

        if (!posteo) {
            return res.status(404).json({
                message: "Posteo no encontrado"
            });
        }

        return res.status(200).json(posteo);

    } catch (error) {
        console.error("Error al obtener posteo:", error);
        return res.status(500).json({
            message: "Error al obtener el posteo"
        });
    }
}


export async function updatePosteoController(req, res) {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "El ID del posteo no es válido"
            });
        }

        const errorValidacion = validarPosteo(req.body, true);

        if (errorValidacion) {
            return res.status(400).json({ message: errorValidacion });
        }

        const camposPermitidos = ["titulo", "texto", "imagen", "animal_id"];
        const datosActualizar = {};

        for (const campo of camposPermitidos) {
            if (req.body[campo] !== undefined) {
                datosActualizar[campo] =
                    typeof req.body[campo] === "string"
                        ? req.body[campo].trim()
                        : req.body[campo];
            }
        }

        // Si se cambia el animal asociado, verificar que pertenezca al refugio
        if (datosActualizar.animal_id !== undefined) {
            const animal = await getAnimalOwnedByUserService(
                datosActualizar.animal_id,
                req.user.id
            );

            if (!animal) {
                return res.status(404).json({
                    message: "No se encontró el animal o no pertenece a este refugio"
                });
            }

            datosActualizar.animal_id = new ObjectId(datosActualizar.animal_id);
        }

        const result = await updatePosteoService(
            id,
            req.user.id,
            datosActualizar
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "Posteo no encontrado o no pertenece a este refugio"
            });
        }

        return res.status(200).json({
            message: "Posteo actualizado correctamente"
        });

    } catch (error) {
        console.error("Error al actualizar posteo:", error);
        return res.status(500).json({
            message: "Error al actualizar el posteo"
        });
    }
}


export async function deletePosteoController(req, res) {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "El ID del posteo no es válido"
            });
        }

        const result = await deletePosteoService(id, req.user.id);

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: "Posteo no encontrado o no pertenece a este refugio"
            });
        }

        return res.status(200).json({
            message: "Posteo eliminado correctamente"
        });

    } catch (error) {
        console.error("Error al eliminar posteo:", error);
        return res.status(500).json({
            message: "Error al eliminar el posteo"
        });
    }
}
