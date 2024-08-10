import { NextResponse } from "next/server"
import { connectToDB } from "../database"
import geminiApiModel from "../dbModel"

export async function GET (request){
    await connectToDB()
    let data = await geminiApiModel.find()
    return NextResponse.json(data)
}

export async function POST (request){
    await connectToDB()
    const data  = await request.json()
    await geminiApiModel.create(data)
    return NextResponse.json({message:"post user data successfully"})
}