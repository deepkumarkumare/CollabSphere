import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/User";


export async function GET(req: NextRequest){
    try{

        const users = await User.find()

         return NextResponse.json(
            users
         );
    }
    catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
      }
}