import mongoose from "mongoose";

const Attendence_schema=mongoose.Schema({
    name:{
        date:Date,
        required:True
    },
    attendence:{
        present:Boolean,
        required:True
    }
})

const Attendence=mongoose.model("Attendence",Attendence_schema);
export default Attendence;