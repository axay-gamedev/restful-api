const express = require("express")
const PORT = 8000
const fs = require("fs")
const app = express()
const mongoose = require("mongoose")


//connection
mongoose.connect("mongodb://127.0.0.1:27017/api-app").then(() => console.log("MongoDB connected")).catch((err) => console.log(err))


//schema

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,

    },
    email: {

        type: String,
        required: true,
        unique: true,
    },
    jobTitle: {
        type: String,
    },
    gender: {
        type: String
    }
})


const User = mongoose.model('user', userSchema)



app.use(express.urlencoded({ extended: false }))

app.get("/users", async (req, res) => {
const allDbUsers = await User.find({})
    const html = `<ul>
    ${allDbUsers.map((users)=>`<li>${users.firstName}- ${users.email}</li>`).join("")}
    </ul>
    `

    res.send(html)


})
app.get("/api/users", async(req, res) => {
    const allDbUsers = await User.find({})

    return res.json(allDbUsers)
})
app.post("/api/users", async (req, res) => {

    const body = req.body





    if (!body ||
        !body.first_name ||
        !body.last_name ||
        !body.email ||
        !body.gender ||
        !body.job_title) {
        return res.status(400).json({ msg: "All fields are req ... " })
    }

    const result = await User.create({
        firstName: body.first_name,
        laštName: body.last_name,
        email: body.email,
        gender: body.gender,
        jobTitle: body.job_title,
    })
    console.log(`result: ${result}`)
    res.status(201).json({msg: "success"})
})


app.route("/api/users/:id").get( async (req, res) => {
    const user = await User.findById(req.params.id)
    return res.json(user)
})
    .patch(async(req, res) => {
        const body = req.body

        if (body.first_name)
            await User.findByIdAndUpdate(req.params.id  , {firstName: body.first_name})
        if (body.last_name)
            await User.findByIdAndUpdate(req.params.id  , {lastName: body.last_name})
        if (body.job_title)
            await User.findByIdAndUpdate(req.params.id  , {jobTitle: body.job_title})
        if (body.email)
            await User.findByIdAndUpdate(req.params.id  , {email: body.email})
        if (body.gender)
            await User.findByIdAndUpdate(req.params.id  , {gender: body.gender})

        else
            res.status(400)

        res.json({status: "sucess"})


    })
    .delete(async(req, res) => {
       
        await User.findByIdAndDelete(req.params.id)
        res.json({status: "sucess"})

    })




app.listen(PORT, () => { console.log("server started") })

