import express  from "express"
import Redis from "ioredis"

const app = express()
app.use(express.json())
const redis  = new Redis (process.env.REDIS_URL || 'redis://localhost:6379')

// set command store single variable
// hset command in redis store object
// hgetall command in redis helps to take the entire object
//similarly there are -> hget(to get the single key value),hdel,hexists(to know that field is available or not)

app.post("/user/:id/json", async (req,res) => {
    await redis.set(`user:${req.params.id}:json`, JSON.stringify(req.body))
    res.json({"savedAs": "json"})
})

app.get("/user/:id/json", async (req, res) => {
  const raw = await redis.get(`user:${req.params.id}:json`);

  res.json({user: raw ? JSON.parse(raw) : null});
});

// we use hash method to store user profile because in that we do have have to convert the data into string and 
//then while getting the data we do not have to again convert it to object
//the problem is string data in immutable i.e we have to use dsa to change the string data 
//but if it is stored in object form then we can edid the data easily


app.post("/user/:id/hash", async (req, res) => {
  await redis.hset(`user:${req.params.id}:hash`, req.body);

  res.json({
    savedAs: "hash"
  });
});

app.get("/user/:id/hash", async (req, res) => {
  const user = await redis.hgetall(`user:${req.params.id}:hash`);

  res.json({ user });
});

app.listen(3000, () => {
  console.log("Server is running on port http://localhost:3000");
});