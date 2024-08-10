import { connectToDB } from "../database";
import geminiApiModel from "../dbModel";

const { NextResponse } = require("next/server");

export async function POST (req) {
    await connectToDB()
    let {userid} = await req.json()
    await geminiApiModel.deleteOne({_id: userid})
    let data = await geminiApiModel.find()
    return NextResponse.json(data);
}

export async function PUT(req){
    await connectToDB()
    let data = await req.json()
    await geminiApiModel.findByIdAndUpdate({_id: data.userid},{
        "uniqueId" : data.uniqueId
    })
    let userData = await geminiApiModel.findById({_id: data.userid})
    return NextResponse.json(userData);
}