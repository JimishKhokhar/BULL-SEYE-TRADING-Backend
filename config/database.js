const mongoose=require("mongoose");
require("dotenv").config();

const dbConnect= async ()=>{
    await mongoose.connect(process.env.DATABASE_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true
      }).then(()=>{
        console.log("DB connected!");
      }).catch((err)=>{
        console.log("DB not Connected");
        console.error(err);
        process.exit(1);
      })
}

module.exports=dbConnect;