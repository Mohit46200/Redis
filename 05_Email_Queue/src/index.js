import express from "express"
import Redis from "ioredis"

const app = express()
app.use(express.json())
const redis = new Redis(process.env.REDIS_URL ||  'redis://localhost:6379')

const QUEUE_KEY = "queue:list"


//Drawbacks

// Job Loss:-
// If a worker or service fails while processing a job, the job may be lost before it is completed. Without proper persistence or acknowledgment mechanisms, the job might never be processed again.

// Retry System:-
// If a job fails, the system needs a retry mechanism to attempt the job again. Without retries, temporary failures such as network issues can cause the job to permanently fail.

// Parallel Workers:-
// Multiple workers processing jobs at the same time can improve speed, but they can also create problems such as two workers processing the same job simultaneously if the queue isn't designed to handle concurrent access safely.


app.post("/emails", async (req, res) => {
  const job = {
    to: req.body.to,
    subject: req.body.subject || "No subject",
    body: req.body.body || "No content",
    createdAt: new Date().toISOString(),
  };

  await redis.lpush(QUEUE_KEY, JSON.stringify(job));

  res.json({ queued: true, job });
});

app.get("/emails/process-one", async (req, res) => {
  const rawJob = await redis.rpop(QUEUE_KEY);

  if (!rawJob) {
    return res.json({ message: "No jobs in the queue" });
  }

  const job = JSON.parse(rawJob);

  // Simulate email sending
  res.json({ message: "Email sent", job });
});

app.listen(3000, () => {
  console.log("Server is running on port http://localhost:3000");
});