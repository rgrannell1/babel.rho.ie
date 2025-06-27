import { config } from "./deps.ts";

const env = config();

export default {
  OPENAPI_APPLICATION: env.OPENAPI_APPLICATION,
  OPENAPI_EMAIL: env.OPENAPI_EMAIL,
};
