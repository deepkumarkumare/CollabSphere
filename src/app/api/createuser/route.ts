import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/User";

export async function POST(req: Request){
    try{
        const response = await req.formData();

        const data = {
            email : response.get("email") as string,
            image : response.get("image") as string,
        }

        const userRef = await User.findOneAndUpdate(data, data, {
            new: true,
            upsert: true,
            runValidators: true,
        })

        const userRes = await userRef.save();
        return NextResponse.json(
            {status : 201, userRes}
         );
    }
    catch(error){
        return NextResponse.json({ error: "Server error" }, { status: 500 });    
    }
}