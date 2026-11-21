
import {
    createAnimal,
    findAnimals,
    findMyAnimalsByUserId,
    findAnimalById,
    updateAnimal,
    deleteAnimalAndPosteos
} from "../data/animalesData.js";

export async function createAnimalService(animalData) {
    return await createAnimal(animalData);
}

export async function getAnimalsService(filters = {}) {
    return await findAnimals(filters);
}

export async function getMisAnimalesService(userId) {
    return await findMyAnimalsByUserId(userId);
}

export async function getAnimalByIdService(id) {
    return await findAnimalById(id);
}

export async function updateAnimalService(id, userId, animalData) {
    return await updateAnimal(id, userId, animalData);
}

export async function deleteAnimalService(id, userId) {
    return await deleteAnimalAndPosteos(id, userId);
}
