import { GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold } from '@google/generative-ai';
import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';
import { connectToDB } from '../database';
import geminiApiModel from '../dbmodel';

const apiKey = 'AIzaSyBRlujo7eEGO1LKS-5PDKxk90jS0jU52eM';
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});
  
const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};
  

export async function GET (request){
    const data = {
        name: 'Bishal Shrestha',
        age: '27'
    }
    return new Response('John Doe')
} 

export async function POST (req,res){
    await connectToDB()
    const data  =await req.json()
    async function run() {
        const chatSession = model.startChat({
          generationConfig,
          history: [
            
          ],
        });
      
        const result = await chatSession.sendMessage(data.message);
        return result.response.text();
    }

    let userData = await geminiApiModel.findOne({uniqueId: data.userid})
    await geminiApiModel.findOneAndUpdate({uniqueId: data.userid},{commandsUsed : userData.commandsUsed+1})
    return NextResponse.json({message : await run()})
} 