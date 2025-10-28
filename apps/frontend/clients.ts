import { hc } from "hono/client";
import type { InferResponseType, InferRequestType } from "hono/client";
import type { ApiType } from "backend";

const client = (baseUrl: string) => hc<ApiType>(
  baseUrl,
  {
    init: {
      credentials: "include",
    },
  },
).api.v1;

// api/v1/secure/hello を呼び出す関数を作成
export const $getHello = client(process.env.NEXT_PUBLIC_BACKEND_URL!).secure.hello.$post;
export type GetHelloRequest = InferRequestType<typeof $getHello>;
export type GetHelloResponse = InferResponseType<typeof $getHello>;