import mongoose from "mongoose";


export async function connectToDB (){
    await mongoose.connect('mongodb+srv://sairamireddy2683:ICmqjwKP6cOBwWPK@cluster0.jaqtmi0.mongodb.net/geminiApi').then((connection)=>{
        console.log("Connection established");
    })
}