const express = require('express')
const app = express();
const PORT = 3000
app.get('/',(req,res)=>{
    res.json({
        msg: "homepage"
    })
})


app.listen(PORT,()=>{
    console.log(`The app is running on port: ${PORT}`)
})
