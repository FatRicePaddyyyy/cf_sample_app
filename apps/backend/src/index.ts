import { OpenAPIHono } from "@hono/zod-openapi";
import { corsMiddleware } from "./middlewares/cors";
import { apiKeyAuthMiddleware } from "./middlewares/secret-key"
import { auth } from "./lib/better-auth";
import { createSeedUserRouteHandler } from "./routes/add-seed-user/post"
import { swaggerUI } from "@hono/swagger-ui";
import { helloRouteHandler } from "./routes/hello/post"
import { authMiddleware } from "./middlewares/auth";

const app = new OpenAPIHono<{
  Bindings: CloudflareBindings;
}>();

app.use("/*", corsMiddleware);

app.on(["GET", "POST"], "/api/v1/auth/*", (c) =>
  auth(c.env).handler(c.req.raw),
);

app.use("/api/v1/secret/*", apiKeyAuthMiddleware);
app.use("/api/v1/secure/*", authMiddleware);
export const routes = app.route("/", createSeedUserRouteHandler)
.route("/", helloRouteHandler);

routes  
  .doc("/api", {
    openapi: "3.0.0",
    info: {
      title: "API",
      version: "1.0.0",
    },
  })
  .get(
    "/docs",
    swaggerUI<{ Bindings: CloudflareBindings}>({
      url: "/api",
    }),
  );

export type ApiType = typeof routes;

export default routes;