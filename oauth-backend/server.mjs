import http from "node:http";
import crypto from "node:crypto";
import {readFile, writeFile, rename, mkdir} from "node:fs/promises";
import {dirname, resolve} from "node:path";

const PORT = Number(process.env.PORT || 8787);
const APP_ORIGIN = String(process.env.APP_ORIGIN || "").replace(/\/$/, "");
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const STORE_FILE = resolve(process.env.OAUTH_STORE_FILE || "./data/oauth-sessions.json");
const GOOGLE_TOKEN_ENDPOINT = process.env.GOOGLE_TOKEN_ENDPOINT || "https://oauth2.googleapis.com/token";
const GOOGLE_REVOKE_ENDPOINT = process.env.GOOGLE_REVOKE_ENDPOINT || "https://oauth2.googleapis.com/revoke";
const ENCRYPTION_KEY = crypto.createHash("sha256").update(process.env.OAUTH_ENCRYPTION_KEY || "").digest();
if (!APP_ORIGIN || !CLIENT_ID || !CLIENT_SECRET || !process.env.OAUTH_ENCRYPTION_KEY) throw new Error("APP_ORIGIN, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET ja OAUTH_ENCRYPTION_KEY ovat pakollisia.");

let store = {};
try { store = JSON.parse(await readFile(STORE_FILE, "utf8")); } catch (error) { if (error.code !== "ENOENT") throw error; }
const persist = async () => {
  await mkdir(dirname(STORE_FILE), {recursive:true});
  const temp = `${STORE_FILE}.tmp`;
  await writeFile(temp, JSON.stringify(store), {mode:0o600});
  await rename(temp, STORE_FILE);
};
const encrypt = value => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);
  const data = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), data]).toString("base64url");
};
const decrypt = value => {
  const data = Buffer.from(value, "base64url"), iv = data.subarray(0,12), tag = data.subarray(12,28);
  const decipher = crypto.createDecipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data.subarray(28)), decipher.final()]).toString("utf8");
};
const cookies = req => Object.fromEntries(String(req.headers.cookie || "").split(";").map(v => v.trim().split("=")).filter(v => v.length === 2));
const readJson = req => new Promise((resolveBody, reject) => {
  let body="";
  req.on("data", chunk => { body += chunk; if (body.length > 100000) req.destroy(); });
  req.on("end", () => { try { resolveBody(body ? JSON.parse(body) : {}); } catch (error) { reject(error); } });
  req.on("error", reject);
});
const reply = (res, status, data, extra = {}) => {
  res.writeHead(status, {"Content-Type":"application/json","Access-Control-Allow-Origin":APP_ORIGIN,"Access-Control-Allow-Credentials":"true","Vary":"Origin",...extra});
  res.end(JSON.stringify(data));
};
const googleToken = async params => {
  const response = await fetch(GOOGLE_TOKEN_ENDPOINT, {method:"POST", headers:{"Content-Type":"application/x-www-form-urlencoded"}, body:new URLSearchParams(params)});
  const data = await response.json().catch(() => ({}));
  return {response,data};
};

const server = http.createServer(async (req,res) => {
  const origin = String(req.headers.origin || "").replace(/\/$/, "");
  if (origin !== APP_ORIGIN) return reply(res, 403, {code:"origin_denied",message:"Origin ei ole sallittu."});
  if (req.method === "OPTIONS") {
    res.writeHead(204,{"Access-Control-Allow-Origin":APP_ORIGIN,"Access-Control-Allow-Credentials":"true","Access-Control-Allow-Methods":"POST,OPTIONS","Access-Control-Allow-Headers":"Content-Type,X-Requested-With","Vary":"Origin"}); return res.end();
  }
  if (req.method !== "POST" || req.headers["x-requested-with"] !== "XmlHttpRequest") return reply(res, 405, {code:"method_denied",message:"Pyyntö hylättiin."});
  const sid = cookies(req).lj_oauth || "";
  try {
    if (req.url === "/oauth/google/exchange") {
      const body = await readJson(req);
      if (!body.code || body.redirectUri !== APP_ORIGIN) return reply(res,400,{code:"bad_request",message:"Valtuutuskoodi tai redirect URI puuttuu."});
      const {response,data} = await googleToken({code:body.code,client_id:CLIENT_ID,client_secret:CLIENT_SECRET,redirect_uri:APP_ORIGIN,grant_type:"authorization_code"});
      if (!response.ok || !data.access_token) return reply(res,response.status || 400,{code:data.error || "exchange_failed",message:data.error_description || "Google-valtuutuksen vaihto epäonnistui."});
      const sessionId = sid && store[sid] ? sid : crypto.randomUUID();
      // Google ei aina palauta refresh tokenia uudessa valtuutuksessa. Säilytä vanha.
      if (data.refresh_token) store[sessionId] = {refreshToken:encrypt(data.refresh_token),updatedAt:new Date().toISOString()};
      else if (!store[sessionId]?.refreshToken) return reply(res,409,{code:"refresh_token_missing",message:"Google ei palauttanut pitkäkestoista valtuutusta. Poista sovelluksen lupa Google-tililtä ja yhdistä kerran uudelleen."});
      await persist();
      console.info("OAuth-koodi vaihdettu; refresh token säilytetty salattuna.");
      return reply(res,200,{access_token:data.access_token,expires_in:data.expires_in || 3600},{"Set-Cookie":`lj_oauth=${sessionId}; HttpOnly; Secure; SameSite=None; Partitioned; Path=/; Max-Age=15552000`});
    }
    if (req.url === "/oauth/google/token") {
      if (!sid || !store[sid]?.refreshToken) return reply(res,401,{code:"authorization_required",message:"Pitkäkestoista Google-valtuutusta ei löytynyt."});
      const {response,data} = await googleToken({refresh_token:decrypt(store[sid].refreshToken),client_id:CLIENT_ID,client_secret:CLIENT_SECRET,grant_type:"refresh_token"});
      if (!response.ok || !data.access_token) {
        if (data.error === "invalid_grant") { delete store[sid]; await persist(); }
        console.warn("Access tokenin uusinta epäonnistui", {status:response.status,code:data.error || "refresh_failed"});
        return reply(res,response.status || 401,{code:data.error || "refresh_failed",message:data.error_description || "Google-valtuutus on uusittava."});
      }
      console.info("Access token uusittiin onnistuneesti.");
      return reply(res,200,{access_token:data.access_token,expires_in:data.expires_in || 3600});
    }
    if (req.url === "/oauth/google/disconnect") {
      if (sid && store[sid]?.refreshToken) {
        const token = decrypt(store[sid].refreshToken);
        await fetch(`${GOOGLE_REVOKE_ENDPOINT}?token=${encodeURIComponent(token)}`, {method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"}}).catch(() => {});
        delete store[sid]; await persist();
      }
      return reply(res,200,{ok:true},{"Set-Cookie":"lj_oauth=; HttpOnly; Secure; SameSite=None; Partitioned; Path=/; Max-Age=0"});
    }
    return reply(res,404,{code:"not_found",message:"Tuntematon osoite."});
  } catch (error) {
    console.error("OAuth-palvelimen virhe", {name:error.name,message:error.message});
    return reply(res,500,{code:"server_error",message:"OAuth-palvelimen sisäinen virhe."});
  }
});
server.listen(PORT, () => console.info(`Lähetejaon OAuth-palvelin kuuntelee porttia ${PORT}.`));
