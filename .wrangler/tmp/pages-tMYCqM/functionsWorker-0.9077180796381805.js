var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// api/checkout.js
async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}
__name(onRequestOptions, "onRequestOptions");
async function onRequestPost(context) {
  const { request, env } = context;
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json"
  };
  try {
    const body = await request.json().catch(() => ({}));
    const { rank, brandName, url, tagline, bidAmountUSD, logoBg, logoText, logoUrl, returnUrl } = body;
    const amount = Number(bidAmountUSD);
    if (!amount || amount <= 0) {
      return new Response(JSON.stringify({ error: "Valid bid amount is required" }), {
        status: 400,
        headers: corsHeaders
      });
    }
    const apiKey = env?.DODO_PAYMENTS_API_KEY || "0sBurbjtawrdLcLg.Q9oitL5QLFBaz4AnTfcZnccjANGl6Cj0iCGIG-T2wLUTA6vF";
    const productId = env?.DODO_PRODUCT_ID || "pdt_0Nm5UYjiECVXnZNzh0a2X";
    const isLive = env?.DODO_PAYMENTS_MODE === "live";
    const endpoint = isLive ? "https://live.dodopayments.com/checkouts" : "https://test.dodopayments.com/checkouts";
    const origin = new URL(request.url).origin;
    const finalReturnUrl = returnUrl || `${origin}/?success=true&rank=${rank}&brand=${encodeURIComponent(brandName || "")}`;
    const dodoPayload = {
      product_cart: [
        {
          product_id: productId,
          quantity: Math.max(1, Math.round(amount))
        }
      ],
      return_url: finalReturnUrl,
      metadata: {
        rank: String(rank),
        brandName: String(brandName || ""),
        url: String(url || ""),
        tagline: String(tagline || "")
      }
    };
    const dodoRes = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dodoPayload)
    });
    const dodoData = await dodoRes.json();
    if (!dodoRes.ok) {
      console.error("Dodo Payments API error:", dodoData);
      return new Response(JSON.stringify({
        error: dodoData.message || dodoData.error || "Failed to create Dodo Payments checkout",
        details: dodoData
      }), {
        status: dodoRes.status,
        headers: corsHeaders
      });
    }
    if (env?.DB && dodoData.session_id) {
      try {
        await env.DB.prepare(
          `INSERT OR REPLACE INTO checkout_sessions (session_id, rank, brand_name, url, tagline, bid_amount_usd, logo_bg, logo_text, logo_url, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`
        ).bind(
          dodoData.session_id,
          Number(rank),
          String(brandName || ""),
          String(url || ""),
          String(tagline || ""),
          amount,
          logoBg || "#1d1d1f",
          logoText || String(brandName || "").slice(0, 2),
          logoUrl || null
        ).run();
      } catch (dbErr) {
        console.warn("DB session log warning:", dbErr.message);
      }
    }
    return new Response(JSON.stringify({
      success: true,
      checkout_url: dodoData.checkout_url,
      session_id: dodoData.session_id,
      mode: isLive ? "live" : "test"
    }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (err) {
    console.error("Checkout function error:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal error" }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
__name(onRequestPost, "onRequestPost");

// api/claim.js
async function onRequestOptions2() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}
__name(onRequestOptions2, "onRequestOptions");
async function onRequestPost2(context) {
  const { request, env } = context;
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json"
  };
  try {
    const body = await request.json().catch(() => ({}));
    const {
      rank,
      brandName,
      url,
      tagline,
      bidAmountUSD,
      logoBg,
      logoText,
      logoUrl
    } = body;
    const targetRank = Number(rank);
    const amountUSD = Number(bidAmountUSD);
    if (!targetRank || targetRank < 1 || !amountUSD || amountUSD <= 0) {
      return new Response(JSON.stringify({ error: "Valid rank and bid amount required" }), {
        status: 400,
        headers: corsHeaders
      });
    }
    const cleanBrand = String(brandName || "").trim() || "Anonymous Sponsor";
    const cleanUrl = String(url || "").trim().startsWith("http") ? String(url).trim() : `https://${String(url || "").trim()}`;
    const cleanTagline = String(tagline || "").trim() || "Official sponsor on iPhone Fold";
    const screen = targetRank <= 5 ? "outside" : "inside";
    const amountINR = Math.round(amountUSD * 83.3055);
    if (env?.DB) {
      const existing = await env.DB.prepare(
        "SELECT brand_name FROM spots WHERE rank = ?"
      ).bind(targetRank).first();
      const previousBrand = existing ? existing.brand_name : null;
      const { results: spotsToShift } = await env.DB.prepare(
        "SELECT rank FROM spots WHERE rank >= ? ORDER BY rank DESC"
      ).bind(targetRank).all();
      if (spotsToShift && spotsToShift.length > 0) {
        for (const s of spotsToShift) {
          const oldRank = s.rank;
          const newRank = oldRank + 1;
          const newScreen = newRank <= 5 ? "outside" : "inside";
          await env.DB.prepare(
            "UPDATE spots SET rank = ?, screen = ? WHERE rank = ?"
          ).bind(newRank, newScreen, oldRank).run();
        }
      }
      await env.DB.prepare(
        `INSERT OR REPLACE INTO spots (rank, brand_name, url, tagline, logo_bg, logo_text, logo_url, bid_amount_usd, bid_amount_inr, screen, claimed_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
      ).bind(
        targetRank,
        cleanBrand,
        cleanUrl,
        cleanTagline,
        logoBg || "#1d1d1f",
        logoText || cleanBrand.slice(0, 2),
        logoUrl || null,
        amountUSD,
        amountINR,
        screen
      ).run();
      const activityId = `act_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      await env.DB.prepare(
        `INSERT INTO activity (id, type, rank, brand_name, previous_brand_name, amount_usd, created_at)
         VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
      ).bind(
        activityId,
        previousBrand ? "outbid" : "claim",
        targetRank,
        cleanBrand,
        previousBrand,
        amountUSD
      ).run();
      const { results: allSpots } = await env.DB.prepare(
        "SELECT * FROM spots ORDER BY rank ASC"
      ).all();
      const { results: allActivity } = await env.DB.prepare(
        "SELECT * FROM activity ORDER BY created_at DESC LIMIT 20"
      ).all();
      return new Response(JSON.stringify({
        success: true,
        spots: allSpots,
        activity: allActivity
      }), {
        status: 200,
        headers: corsHeaders
      });
    }
    return new Response(JSON.stringify({
      success: true,
      simulated: true,
      spot: {
        rank: targetRank,
        brand_name: cleanBrand,
        url: cleanUrl,
        tagline: cleanTagline,
        bid_amount_usd: amountUSD,
        screen
      }
    }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (err) {
    console.error("Error claiming spot in D1:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
__name(onRequestPost2, "onRequestPost");

// api/reset.js
async function onRequestPost3(context) {
  const { env } = context;
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json"
  };
  try {
    if (env?.DB) {
      await env.DB.prepare("DELETE FROM spots").run();
      await env.DB.prepare("DELETE FROM activity").run();
      await env.DB.prepare("DELETE FROM checkout_sessions").run();
    }
    return new Response(JSON.stringify({ success: true, message: "Database reset to scratch (0 spots)" }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
__name(onRequestPost3, "onRequestPost");

// api/spots.js
async function onRequestGet(context) {
  const { env } = context;
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate"
  };
  try {
    if (env?.DB) {
      const { results: spots } = await env.DB.prepare(
        "SELECT * FROM spots ORDER BY rank ASC"
      ).all();
      const { results: activity } = await env.DB.prepare(
        "SELECT * FROM activity ORDER BY created_at DESC LIMIT 20"
      ).all();
      return new Response(JSON.stringify({
        spots: spots || [],
        activity: activity || []
      }), {
        status: 200,
        headers: corsHeaders
      });
    }
    return new Response(JSON.stringify({ spots: [], activity: [] }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (err) {
    console.error("Error fetching spots from D1:", err);
    return new Response(JSON.stringify({ spots: [], activity: [], error: err.message }), {
      status: 200,
      headers: corsHeaders
    });
  }
}
__name(onRequestGet, "onRequestGet");

// ../.wrangler/tmp/pages-tMYCqM/functionsRoutes-0.8734101803890657.mjs
var routes = [
  {
    routePath: "/api/checkout",
    mountPath: "/api",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions]
  },
  {
    routePath: "/api/checkout",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost]
  },
  {
    routePath: "/api/claim",
    mountPath: "/api",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions2]
  },
  {
    routePath: "/api/claim",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost2]
  },
  {
    routePath: "/api/reset",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost3]
  },
  {
    routePath: "/api/spots",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet]
  }
];

// ../node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
export {
  pages_template_worker_default as default
};
