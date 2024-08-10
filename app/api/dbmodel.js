import mongoose from "mongoose";

const geminiApiSchema = new mongoose.Schema({
    site: String,
    uniqueId: String,
    commandsUsed: Number
}, { timestamps:true });

let geminiApiModel = mongoose.models.usersData || mongoose.model('usersData',geminiApiSchema)

export default geminiApiModel   