
import { getDb, getClient } from "./connection.js";
import { ObjectId } from "mongodb";

// Crear un animal
export async function createAnimal(animalData) {
    const db = getDb();

    const result = await db.collection("animales").insertOne(animalData);

    return result;
}


export async function findAllAnimals() {
    const db = getDb();

    return await db.collection("animales")
        .find({})
        .sort({ _id: -1 })
        .toArray();
}


export async function findAnimalById(id) {
    const db = getDb();

    return await db.collection("animales").findOne({
        _id: new ObjectId(id)
    });
}


export async function updateAnimal(id, userId, animalData) {
    const db = getDb();

    return await db.collection("animales").updateOne(
        {
            _id: new ObjectId(id),
            user_id: new ObjectId(userId)
        },
        {
            $set: animalData
        }
    );
}


export async function deleteAnimalAndPosteos(id, userId) {
    const client = getClient();
    const db = getDb();

    const session = client.startSession();

    try {
        let resultado;

        await session.withTransaction(async () => {
            const animal = await db.collection("animales").findOne(
                {
                    _id: new ObjectId(id),
                    user_id: new ObjectId(userId)
                },
                { session }
            );

            if (!animal) {
                throw new Error("Animal no encontrado");
            }

            // antes de eliminar un animal, borramos los posteos asociados, no tiene sentido que queden
            const posteosEliminados = await db.collection("posteos").deleteMany(
                { animal_id: new ObjectId(id) },
                { session }
            );

            
            await db.collection("animales").deleteOne(
                {
                    _id: new ObjectId(id),
                    user_id: new ObjectId(userId)
                },
                { session }
            );

            resultado = {
                animalEliminado: true,
                posteosEliminados: posteosEliminados.deletedCount
            };
        });

        return resultado;

    } catch (error) {
        throw error;
    } finally {
        await session.endSession();
    }
}
