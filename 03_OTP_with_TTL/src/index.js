import express from "express";
import Redis from "ioredis";

const app = express()
app.use(express.json())
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

const otpkey = (phone) =>{
    return `otp:${phone}`
}

app.post("/otp", async(req,res) => {
    const {phone} = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    await redis.set(otpkey(phone),otp,'EX',30) //valid for 30sec   EX means expiry
    res.json({message:"OTP sent",otp})   // in real application send otp via sms
})

app.post("/otp/verify",async(req,res) => {
    const {phone, otp} = req.body;
    const savedotp = await redis.get(otpkey(phone))

    if(!savedotp){
        return res.status(400).json({message:"OTP expired or not found"})
    }
    if(savedotp != otp ){
        return res.status(400).json({message:"Invalid otp"})
    }
    // write validate code that user is verifies here
    await redis.del(otpkey(phone))
})

app.get("/otp/:phone/ttl",async(req,res) => {
    const ttl = await redis.ttl(otpkey(req.params.phone))
    res.json({ttl});
})

app.listen(3000, () =>{
    console.log("Server running at port http://localhost:3000")
})