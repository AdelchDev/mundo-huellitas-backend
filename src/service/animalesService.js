
import {
    createAnimal,
    findAllAnimals,
    findAnimalById,
    updateAnimal,
    deleteAnimalAndPosteos
} from "../data/animalesData.js";

export async function createAnimalService(animalData) {
    return await createAnimal(animalData);
}

export async function getAnimalsService() {
    return await findAllAnimals();
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
