const express = require("express")
const router = express.Router();
const User = require("../models/user");
const Note = require("../models/notes")
const auth = require ("../middleware/auth")
const bcryptjs = require("bcryptjs")
router.get("/signin",(req,res)=>{
    return res.render("signin")
})
router.post("/signin",async (req,res)=>{
    const {email , password} = req.body;
    const user = await  User.findOne({email})
    const userPassword = user.password;
    try {
        if(user && ( await bcryptjs.compare(password,userPassword))){
             const notes = await Note.find({ createdBy: user._id });
            const token = await user.generateToken(user);
            res.cookie("token", token);
            res.render("homewithuser", {
                user: user,
                notes: notes
            });
        }
        else{
            return res.render("signin",{
                error: "Invalid Login Details"
            })
        }
    } 
    catch (error) {
        res.status(500).send(error)
    }
})
router.get("/signup",(req,res)=>{
    return res.render("signup")
})
router.post("/signup",async (req,res)=>{
    const { fullname, email , password} = req.body;
    const user = await User.create({
        fullname,
        email,
        password
    })
    const token = await user.generateToken(user);
    res.cookie("token",token)
    return res.redirect("/")
})
router.post("/add-note",auth, async (req,res)=>{
    const {note} = req.body;
    const notedata = await Note.create({
        note,
        createdBy: req.user._id
    })
    res.redirect("/homewithuser")
})
router.post("/delete-note/:noteId", auth, async (req, res) => {
    try {
        const noteId = req.params.noteId;
        // Add logic to ensure that the user has the right to delete this note
        await Note.findByIdAndDelete(noteId);
        res.redirect("/homewithuser");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});
router.get("/edit-note/:noteId", auth, async (req, res) => {
    try {
        const noteId = req.params.noteId;
        const note = await Note.findById(noteId);
        res.render("edit-note", { note: note });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});
router.post("/edit-note/:noteId", auth, async (req, res) => {
    try {
        const noteId = req.params.noteId;
        const updatedNoteText = req.body.updatedNote;
        await Note.findByIdAndUpdate(noteId, { note: updatedNoteText });
        res.redirect("/homewithuser");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});
router.get("/logout",(req,res)=>{
    res.clearCookie("token").redirect("/")
})
module.exports = router;