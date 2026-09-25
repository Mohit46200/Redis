import  {Worker} from "bullmq"
import {connection} from './queue'


const worker = new Worker(
    "emails",
    async (job) =>{
        console.log("Processing email job ...",Job.id, Job.name, Job.data),
        await new Promise((resolve ) => setTimeout(resolve,1500)),
        console.log("Email job completed ",Job.id, Job.name, Job.data)
    },
    {connection}
)

worker.on("complete",(job) => {
    console.log("Job completed ", job.id, job.name, job.data)
})
worker.on("failed",(job,err) =>{
    console.log("Job Failed ",job.id,job.name,job.data,err)
})