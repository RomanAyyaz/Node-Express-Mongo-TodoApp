const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejs = require("ejs");
const Note = require("./models/notes") 
const auth = require("./middleware/auth")
const UserRouter = require("./routes/user")
const cookieparser = require("cookie-parser")
const app = express();
const uri ="mongodb://localhost:27017/Todo-App";
const port = process.env.PORT || 5000;
//Connection to the data base
mongoose.connect(uri,{}).then(()=>{
    console.log("Connected to local Database")
}).catch((error)=>{
    console.log(error)
})
app.set("view engine","ejs")
app.set("views", path.resolve("./views"))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieparser())
app.get("/",(req,res)=>{
    res.render("homewithoutuser")
})
app.get("/homewithuser", auth ,async (req, res) => {
    try {
        let notes = [];

        if (req.user) {
            // If user is authenticated, fetch their notes
            notes = await Note.find({ createdBy: req.user._id });
        }

        res.render("homewithuser", {
            user: req.user || {}, // Provide an empty object if user is not authenticated
            notes: notes
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});



app.use("/user",UserRouter);
app.listen(port ,()=>{
    console.log(`listening at port no ${port}`)
})