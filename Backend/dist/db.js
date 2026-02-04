import mongoose from "mongoose";
export async function connectDB() {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("Connected to DataBase");
    }
    catch (error) {
        console.log("Error While Connection to DB");
    }
}
//# sourceMappingURL=db.js.map