// arada bir mailini kontrol et koçum benim hepinize iyi kullanımlar boklu slow bir kod'u karşınıza sundum sıra sizde
// bu sanalda kimseye güvenmeyeceksiniz kardeşlerim benim
import tls from "tls";
import http2 from "http2";
import WebSocket from "ws";
import fs from "fs";
const discordundomaini = "canary.discord.com";
const discordunportuistekardesim = 443;
const urlyicekeceginsunucu = "1421582566472945704";
const istekatacaktoken = "";
let mfaToken = "";
function mfayiyukle() {
  try {
    const raw = fs.readFileSync("mfa_token.json", "utf8");
    const json = JSON.parse(raw);
    if (json.istekatacaktoken) mfaToken = json.istekatacaktoken;
  } catch {}
}
mfayiyukle();
fs.watch("mfa_token.json", () => mfayiyiyukle());
function tlsbaglantisi(cb) {
  const socket = tls.connect(
    discordunportuistekardesim,
    discordundomaini,
    {
      servername: discordundomaini,
      ALPNProtocols: ["http/1.1"],
      minVersion: "TLSv1.2",
      maxVersion: "TLSv1.2",
      handshaketimeout: 1000
    },
    () => cb(socket)
  );
  return socket;
}
function allaherseyiduzenleyaratmistir(socket, code) {
  const jsonPayload = `{ "code": "${code}" }`;
  const header = 
    `PATCH /api/v9/guilds/${urlyicekeceginsunucu}/vanity-url HTTP/1.1\r\n` +
    `Host: ${discordundomaini}\r\n` +
    `Authorization: ${istekatacaktoken}\r\n` +
    `x-discord-mfa-authorization: ${mfaToken}\r\n` +
    `User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)\r\n` +
    `x-super-properties: eyJicm93c2VyIjoiQ2hyb21lIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiQ2hyb21lIiwiY2xpZW50X2J1aWxkX251bWJlciI6MzU1NjI0fQ==\r\n` +
    `Content-Type: application/json\r\n` +
    `Content-Length: ${Buffer.byteLength(jsonPayload)}\r\n\r\n`;
  for (let i = 0; i < header.length; i += 4) {
    socket.write(Buffer.from(header.slice(i, i + 4)));
  }
  for (let i = 0; i < jsonPayload.length; i++) {
    socket.write(Buffer.from(jsonPayload[i]));
  }
}
const havuzbaglantisi2 = [];
const havuzbaglantisi = 5;
function esreftek2sezon(index) {
  const client = http2.connect(`https://${discordundomaini}`, {
    minVersion: "TLSv1.2",
    maxVersion: "TLSv1.2",
    ALPNProtocols: ["h2"],
    keepAlive: true,
  });
  client.on("error", () => {
    setTimeout(() => { havuzbaglantisi2[index] = esreftek2sezon(index); }, 1000);
  });
  client.on("close", () => {
    setTimeout(() => { havuzbaglantisi2[index] = esreftek2sezon(index); }, 1000);
  });
  return client;
}
function createhavuzbaglantisi2() {
  for (let i = 0; i < havuzbaglantisi; i++) {
    havuzbaglantisi2[i] = esreftek2sezon(i);
  }
}
createhavuzbaglantisi2();
function esreftekistegi(code) {
  const headers = {
    ":method": "PATCH",
    ":path": `/api/v9/guilds/${urlyicekeceginsunucu}/vanity-url`,
    "authorization": istekatacaktoken,
    "x-discord-mfa-authorization": mfaToken,
    "user-agent": "lamboreq",
    "x-super-properties": "eyJicm93c2VyIjoiQ2hyb21lIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiQ2hyb21lIiwiY2xpZW50X2J1aWxkX251bWJlciI6MzU1NjI0fQ==",
    "content-type": "application/json",
  };
  const payload = JSON.stringify({ code });
  havuzbaglantisi2.forEach((client) => {
    const req = client.request(headers);
    req.on("response", (resHeaders) => {
      if (resHeaders[":status"] === 200) console.log(`[H2] OK: ${code}`);
    });
    req.on("error", () => {});
    for (let i = 0; i < payload.length; i++) {
      req.write(Buffer.from(payload[i]));
    }
    req.end();
  });
}
function websocketebaglanamk() {
  const ws = new WebSocket("wss://gateway-us-east1-b.discord.gg", { perMessageDeflate: false });
  ws.on("open", () => {
  });
  ws.on("message", (msg) => {
    const { d, op, t } = JSON.parse(msg);
    if (t === "READY") console.log("urlleri aldim.");
    if (t === "GUILD_UPDATE" && d.vanity_url_code) {
      tlsbaglantisi((socket) => { allaherseyiduzenleyaratmistir(socket, d.vanity_url_code); });
      esreftekistegi(d.vanity_url_code);
    }
    if (op === 10) {
      ws.send(JSON.stringify({
        op: 2,
        d: {
          istekatacaktoken: istekatacaktoken,
          intents: 1 << 0,
          properties: { os: "linux", browser: "firefox", device: "lambo" },
        }
      }));
      setInterval(() => { if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ op: 1, d: null })); }, d.heartbeat_interval);
    }
  });
  ws.on("close", () => setTimeout(websocketebaglanamk, 5000));
  ws.on("error", () => ws.close());
}
websocketebaglanamk();
