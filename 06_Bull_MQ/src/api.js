import express from "express"
import {emailQueue} from "./queue"
import { Backoffs } from "bullmq"


const app = express()
app.use(express.json())

app.post("/welcome-email",async (req,res) => {
    const job = emailQueue.add(
        "Send-welcome-email",
        {
            to:req.body.to,
            name:req.body.name || "Learners"
        },
        {
            attempts:3,
            backoffs:{
                type:"exponential",
                delay:1000
            }
        }
    )
    res.json({message: "Welcome email job added to the queue", jobID:job.id})
})


app.listen(3000,()=>{
    console.log("Server running at port http://localhost:3000")
})