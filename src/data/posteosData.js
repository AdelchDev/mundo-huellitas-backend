
import { getDb } from "./connection.js";
import { ObjectId } from "mongodb";

export async function createPosteo(posteoData) {
    const db = getDb();

    return await db.collection("posteos").insertOne(posteoData);
}

export async function findAllPosteos() {
    const db = getDb();

    return await db.collection("posteos")
        .find({})
        .sort({ fecha: -1 })
        .toArray();
}

export async function findPosteoById(id) {
    const db = getDb();

    return await db.collection("posteos").findOne({
        _id: new ObjectId(id)
    });
}

export async function findPosteosByUserId(userId) {
    const db = getDb();

    return await db.collection("posteos")
        .find({ user_id: new ObjectId(userId) })
        .sort({ fecha: -1 })
        .toArray();
}

export async function findAnimalOwnedByUser(animalId, userId) {
    const db = getDb();

    return await db.collection("animales").findOne({
        _id: new ObjectId(animalId),
        user_id: new ObjectId(userId)
    });
}

export async function updatePosteo(id, userId, posteoData) {
    const db = getDb();

    return await db.collection("posteos").updateOne(
        {
            _id: new ObjectId(id),
            user_id: new ObjectId(userId)
        },
        {
            $set: posteoData
        }
    );
}

export async function deletePosteo(id, userId) {
    const db = getDb();

    return await db.collection("posteos").deleteOne({
        _id: new ObjectId(id),
        user_id: new ObjectId(userId)
    });
}
