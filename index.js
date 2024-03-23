const express=require("express");
const app=express();

//Load env File
require('dotenv').config();
const PORT=process.env.PORT || 5000;


//MiddleWare for JSON parsing 
app.use(express.json());

const cors = require ('cors'); 
app.use (cors());

const dbConnect=require('./config/database');
dbConnect();

app.get('/',(req,res)=>{
    res.send("Connected To Backend of BullsEyeTrading!")    
})

app.listen(PORT,()=>{
    console.log("Server Started! at "+PORT);
})


// // Allow only specific origins
// const allowedOrigins = ['http://localhost:3000'];
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
// };

// app.use(cors(corsOptions));



//Import All Routes
const UserRoutes=require("./routes/users");
app.use('/BullsEYETrading',UserRoutes);