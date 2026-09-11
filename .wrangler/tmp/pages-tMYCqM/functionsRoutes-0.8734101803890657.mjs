import { onRequestOptions as __api_checkout_js_onRequestOptions } from "/Users/rishabh/pgming/ifold/functions/api/checkout.js"
import { onRequestPost as __api_checkout_js_onRequestPost } from "/Users/rishabh/pgming/ifold/functions/api/checkout.js"
import { onRequestOptions as __api_claim_js_onRequestOptions } from "/Users/rishabh/pgming/ifold/functions/api/claim.js"
import { onRequestPost as __api_claim_js_onRequestPost } from "/Users/rishabh/pgming/ifold/functions/api/claim.js"
import { onRequestPost as __api_reset_js_onRequestPost } from "/Users/rishabh/pgming/ifold/functions/api/reset.js"
import { onRequestGet as __api_spots_js_onRequestGet } from "/Users/rishabh/pgming/ifold/functions/api/spots.js"

export const routes = [
    {
      routePath: "/api/checkout",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_checkout_js_onRequestOptions],
    },
  {
      routePath: "/api/checkout",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_checkout_js_onRequestPost],
    },
  {
      routePath: "/api/claim",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_claim_js_onRequestOptions],
    },
  {
      routePath: "/api/claim",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_claim_js_onRequestPost],
    },
  {
      routePath: "/api/reset",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_reset_js_onRequestPost],
    },
  {
      routePath: "/api/spots",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_spots_js_onRequestGet],
    },
  ]