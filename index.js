const express = require("express")
const mock_data = require("./MOCK_DATA.json")
const PORT = 8000
const fs = require("fs")
const app = express()


app.use(express.urlencoded({extended:false}))

app.get("/users", (req, res) => {

    const html_text = `
   
    <ul>
    ${mock_data.map((val, ind) => `<li>${val.first_name} ${val.last_name}</li>`).join("")}
    <ul>`

    res.send(html_text)


})
app.get("/api/users" , (req,res)=>
{
   return res.json(mock_data)
})
app.post("/api/users", (req,res)=>{
    const body = req.body
    mock_data.push({...body,id : mock_data.length + 1})
    fs.writeFile("./MOCK_DATA.json",JSON.stringify(mock_data),(err)=>{
        if(err) return res.send("505 error")
    })
    return res.send(`Added user ${body.first_name}`)

})


app.route("/api/users/:id").get((req,res)=>{
    const id = Number(req.params.id)
    const user = mock_data.find((user)=>user.id == id)
    return res.json(user)
})
.patch((req,res)=>{
    const body =req.body
    const id = Number(req.params.id)
    const user =mock_data.find((user)=>user.id == id)

    if(body.first_name)
        user.first_name = body.first_name
    if(body.last_name)
         user.last_name = body.last_name
    if(body.job_title)
        user.job_title = body.job_title
    if(body.email)
        user.email = body.email
    if (body.gender)
        user.gender = body.gender

fs.writeFile("./MOCK_DATA.json",JSON.stringify(mock_data),(err)=>{
        if(err) return res.send("505 error")
    })
    return res.send(`Updated user ${id}`)
})
.delete((req,res)=>{
    const body = req.body
    const id = Number(req.params.id)
    const userToDelete = mock_data.find(user => user.id === id);
    const newMockData = mock_data.filter(user => user.id !== id);
    
     fs.writeFile("./MOCK_DATA.json",JSON.stringify(newMockData),(err)=>{
        if(err) return res.status(505)
        
    })
        return res.send(`Deleted user ${body.first_name}\n
            User id ${req.params.id}`)


})




app.listen(PORT, () => { console.log("server started") })

