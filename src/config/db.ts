import mongoose from "mongoose";

console.log(process.env.MONGO_URI);
export async function connectDb(): Promise<void> {
    try{
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("Connected to database");
    }catch(err: any){
        console.log(err.message);
        process.exit(1);
    }
}