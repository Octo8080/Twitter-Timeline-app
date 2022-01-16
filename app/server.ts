import "https://deno.land/x/dotenv/load.ts";
import { app, CORS, OakSession, router, ultra } from "./deps.ts";
import { addCustomRoutes } from "./routes/custom_routes.ts";

const session = new OakSession(app);

app.use(CORS({
  origin: Deno.env.get("ORIGIN"),
  credentials: true,
}));

addCustomRoutes(router);

await ultra({
  importmap: await Deno.readTextFile("importmap.json"),
});
