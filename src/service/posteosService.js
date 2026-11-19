
import {
    createPosteo,
    findAllPosteos,
    findPosteoById,
    findPosteosByUserId,
    findAnimalOwnedByUser,
    updatePosteo,
    deletePosteo
} from "../data/posteosData.js";

export async function createPosteoService(posteoData) {
    return await createPosteo(posteoData);
}

export async function getPosteosService() {
    return await findAllPosteos();
}

export async function getPosteoByIdService(id) {
    return await findPosteoById(id);
}

export async function getMisPosteosService(userId) {
    return await findPosteosByUserId(userId);
}

export async function getAnimalOwnedByUserService(animalId, userId) {
    return await findAnimalOwnedByUser(animalId, userId);
}

export async function updatePosteoService(id, userId, posteoData) {
    return await updatePosteo(id, userId, posteoData);
}

export async function deletePosteoService(id, userId) {
    return await deletePosteo(id, userId);
}
