import { getStore } from "@netlify/blobs";
import { createHmac, createHash, randomBytes, timingSafeEqual } from "node:crypto";

const DEFAULT_DATA = JSON.parse("{\"nom\":\"Pain Parfait 243\",\"slogan\":\"Le goût parfait, à la congolaise\",\"sousTitre\":\"Fast-food et pâtisserie fraîche, préparés pour toi. Commande ici, paie au retrait.\",\"annonce\":\"Pour 5 produit acheté 1 offert hâtez vous 🔥\",\"whatsapp\":\"243800 499 116\",\"logo\":\"/assets/logo.jpg\",\"devise\":\"FC\",\"adresse\":\"C/mnt ngafula2 Q/mitendi av/oleko 85\",\"horaires\":\"Lundi au vendredi : 8h – 20h\",\"telephone\":\"+243 800 499 116\",\"promos\":[{\"titre\":\"FRAIS DE LIVRAISON -100%\",\"texte\":\"Les frais des livraisons sont annulés pour toutes commandes de plus de 10000fc \",\"image\":\"\"}],\"produits\":[{\"cat\":\"Fast-food\",\"nom\":\"Chicken Kebab\",\"desc\":\"Poulet, frites, sauce maison, mayo et ketchup. À consommer chaud\",\"prix\":4000,\"emoji\":\"🌯\",\"image\":\"/assets/product-1.jpg\",\"id\":\"product-1\"},{\"cat\":\"Fast-food\",\"nom\":\"Samoussas\",\"desc\":\"Croustillants, dorés à la minute\",\"prix\":1500,\"emoji\":\"🥟\",\"image\":\"/assets/product-2.jpg\",\"id\":\"product-2\"},{\"cat\":\"Pâtisserie\",\"nom\":\"Gaufres\",\"desc\":\"Chaudes et moelleuses, coeur de chocolat \",\"prix\":1500,\"emoji\":\"🧇\",\"image\":\"/assets/product-3.jpg\",\"id\":\"product-3\"},{\"cat\":\"Pains\",\"nom\":\"Brioche en spirale\",\"desc\":\"Pain au lait doré, sorti du four\",\"prix\":500,\"emoji\":\"🥐\",\"image\":\"/assets/product-4.jpg\",\"id\":\"product-4\"},{\"id\":\"gateau-chocolat\",\"cat\":\"Pâtisserie\",\"nom\":\"Gâteau aux chocolats\",\"desc\":\"Gâteau aux chocolats et à la vanille\",\"prix\":35000,\"emoji\":\"🍰\",\"image\":\"/assets/gateau-chocolat.jpg\"}]}");
const COOKIE = "__Host-pp_admin";
const store = getStore("pain-parfait-243-data");
const json = (body, status=200, headers={}) => new Response(JSON.stringify(body), { status, headers: { "content-type":"application/json; charset=utf-8", "cache-control":"no-store", ...headers } });
const cookie = (value, maxAge) => `${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
function signature(value) { return createHmac("sha256", process.env.ADMIN_SESSION_SECRET || "").update(value).digest("base64url"); }
function createSession() { const exp = Date.now() + 8*60*60*1000; const raw = `${exp}.${randomBytes(24).toString("base64url")}`; return `${raw}.${signature(raw)}`; }
function validSession(request) {
  const rawCookie = request.headers.get("cookie") || "";
  const token = rawCookie.split(";").map(x=>x.trim()).find(x=>x.startsWith(COOKIE+"="))?.slice(COOKIE.length+1);
  if (!token) return false;
  const parts=token.split("."); if(parts.length!==3) return false;
  const raw=`${parts[0]}.${parts[1]}`;
  if(!/^\d+$/.test(parts[0]) || Number(parts[0])<Date.now()) return false;
  const expected=Buffer.from(signature(raw)); const got=Buffer.from(parts[2]);
  return expected.length===got.length && timingSafeEqual(expected,got);
}
function sameOrigin(request) {
  const origin=request.headers.get("origin");
  if(!origin) return false;
  try { return new URL(origin).host===new URL(request.url).host; } catch { return false; }
}
function validData(d) {
  if(!d || typeof d!=="object" || !Array.isArray(d.produits) || !Array.isArray(d.promos)) return false;
  if(d.produits.length>300 || d.promos.length>40) return false;
  return d.produits.every(p=>p && typeof p.nom==="string" && p.nom.length<=120 && typeof p.desc==="string" && p.desc.length<=500 && Number.isFinite(Number(p.prix)) && Number(p.prix)>=0 && Number(p.prix)<=100000000 && typeof p.cat==="string" && p.cat.length<=80 && (!p.image || (typeof p.image==="string" && p.image.length<=1800000)));
}
export default async (request) => {
  const method=request.method;
  if(method==="GET") {
    try { const saved=await store.get("site-config",{type:"json"}); return json(saved || DEFAULT_DATA); }
    catch(e) { console.error(e); return json({error:"Données momentanément indisponibles"},500); }
  }
  if(method!=="POST") return json({error:"Méthode non autorisée"},405,{allow:"GET, POST"});
  if(!sameOrigin(request)) return json({error:"Origine non autorisée"},403);
  let body; try { body=await request.json(); } catch { return json({error:"Requête invalide"},400); }
  if(body.action==="login") {
    const configured=process.env.ADMIN_PASSWORD, secret=process.env.ADMIN_SESSION_SECRET;
    if(!configured || !secret || secret.length<32) return json({error:"L'administration n'est pas encore configurée dans Netlify."},503);
    const given=String(body.password||"");
    const a=createHash("sha256").update(given).digest(), b=createHash("sha256").update(configured).digest();
    if(given.length>256 || !timingSafeEqual(a,b)) return json({error:"Mot de passe incorrect."},401);
    return json({ok:true},200,{"set-cookie":cookie(createSession(),8*60*60)});
  }
  if(body.action==="logout") return json({ok:true},200,{"set-cookie":cookie("",0)});
  if(!validSession(request)) return json({error:"Session expirée. Connecte-toi à nouveau."},401);
  if(body.action==="check") return json({ok:true});
  if(body.action==="save") {
    if(!validData(body.data)) return json({error:"Certaines informations sont invalides. Vérifie les produits et les prix."},400);
    try { await store.setJSON("site-config",body.data); return json({ok:true,savedAt:new Date().toISOString()}); }
    catch(e) { console.error(e); return json({error:"Impossible d'enregistrer les modifications."},500); }
  }
  return json({error:"Action inconnue"},400);
};
