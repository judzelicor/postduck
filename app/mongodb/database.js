import mongoose from "mongoose";

class Database {
    constructor() {
        this.connect()
            .then(error => {
            if (error) {
                console.log("An error occurred while connecting to the database" + error)
            } else {
                console.log("Connected to database successfully!")
            }
        })
    }

    async connect() {
        await mongoose.connect("mongodb://localhost:27017/PostduckDB");
    }
}

export default new Database();