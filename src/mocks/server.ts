import { setupServer } from "msw/node";
import { handlers } from "./handlers";
import { assetServiceHandlers } from "~/apis/handlers/assets/mockHandlers";

export const server = setupServer(...handlers, ...assetServiceHandlers);
