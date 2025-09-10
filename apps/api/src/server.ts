import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: (origin, cb) => {
    const allowed = (process.env.ALLOWED_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean);
    if (!origin || allowed.length === 0 || allowed.includes(origin)) cb(null, true);
    else cb(new Error("Not allowed"), false);
  }
});
await app.register(helmet);

app.get("/health", async () => ({ ok: true }));
app.get("/v1/ping", async () => ({ status: "altrii-api alive" }));

app.post("/webhooks/stripe", async (_req, reply) => { reply.code(204); });

const port = Number(process.env.PORT ?? 4000);
app.listen({ port, host: "0.0.0.0" }).catch((err) => { app.log.error(err); process.exit(1); });
