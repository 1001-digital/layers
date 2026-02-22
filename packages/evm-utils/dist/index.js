import { defineChain as p, isAddress as h } from "viem";
import { mainnet as g, sepolia as w, holesky as E, optimism as b, arbitrum as y, base as N, polygon as S, localhost as v } from "viem/chains";
import { normalize as d } from "viem/ens";
import { ref as x } from "vue";
const z = (t, e = 3) => t.substring(0, e + 2) + "..." + t.substring(t.length - e);
function A(t, e) {
  const r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  function o() {
    const s = Date.now();
    for (const [n, c] of r)
      c.expiresAt <= s && r.delete(n);
    if (r.size > e) {
      const n = r.size - e, c = r.keys();
      for (let l = 0; l < n; l++)
        r.delete(c.next().value);
    }
  }
  function a(s) {
    const n = r.get(s);
    if (n) {
      if (n.expiresAt <= Date.now()) {
        r.delete(s);
        return;
      }
      return n.data;
    }
  }
  function f(s, n) {
    const c = a(s);
    if (c) return Promise.resolve(c);
    const l = i.get(s);
    if (l) return l;
    const m = n().then((u) => (r.set(s, { data: u, expiresAt: Date.now() + t }), i.delete(s), r.size > e && o(), u)).catch((u) => {
      throw i.delete(s), u;
    });
    return i.set(s, m), m;
  }
  return { get: a, fetch: f };
}
const F = [g, w, E, b, y, N, S, v], T = new Map(F.map((t) => [t.id, t])), J = (t) => T.get(t) ?? p({
  id: t,
  name: `Chain ${t}`,
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: [] } }
}), C = ["avatar", "header", "description", "url", "email", "com.twitter", "com.github"], K = ["avatar"], U = [...C], H = A(300 * 1e3, 500);
async function M(t, e) {
  let r;
  for (const i of e)
    try {
      const o = await fetch(`${i}/${t}`);
      if (!o.ok) throw new Error(`HTTP ${o.status}`);
      return await o.json();
    } catch (o) {
      r = o;
    }
  throw r ?? new Error("No indexer URLs provided");
}
async function R(t, e, r = []) {
  const i = h(t);
  let o, a;
  if (i)
    o = t, a = await e.getEnsName({ address: t }) ?? null;
  else {
    a = t;
    const n = await e.getEnsAddress({ name: d(t) });
    if (!n) return { address: "", ens: a, data: null };
    o = n;
  }
  if (!a || !r.length) return { address: o, ens: a ?? null, data: null };
  const f = d(a), s = await Promise.all(
    r.map((n) => e.getEnsText({ name: f, key: n }).catch(() => null))
  );
  return { address: o, ens: a, data: D(r, s.map((n) => n || "")) };
}
function D(t, e) {
  const r = (i) => e[t.indexOf(i)] || "";
  return {
    avatar: r("avatar"),
    header: r("header"),
    description: r("description"),
    links: {
      url: r("url"),
      email: r("email"),
      twitter: r("com.twitter"),
      github: r("com.github")
    }
  };
}
function Y(t, e = 3) {
  const r = typeof t == "string" ? parseFloat(t) : t;
  if (isNaN(r))
    throw new Error("Invalid number input");
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: e
  }).format(r);
}
const O = (t, e) => typeof e == "bigint" ? e.toString() + "n" : e, _ = (t, e) => typeof e == "string" && /^\d+n$/.test(e) ? BigInt(e.slice(0, -1)) : e, V = (t) => JSON.stringify(t, O), j = (t) => JSON.parse(t, _), B = (t, e = 2) => t == null ? void 0 : t.toLocaleString("en-US", { maximumFractionDigits: e }), W = () => {
  const t = x(!1);
  let e = null;
  return {
    copy: async (i) => {
      try {
        return await navigator.clipboard.writeText(i), t.value = !0, e && clearTimeout(e), e = setTimeout(() => {
          t.value = !1;
        }, 2e3), !0;
      } catch (o) {
        return console.error("Failed to copy to clipboard:", o), !1;
      }
    },
    copied: t
  };
};
export {
  K as ENS_KEYS_AVATAR,
  U as ENS_KEYS_PROFILE,
  A as createCache,
  H as ensCache,
  R as fetchEnsFromChain,
  M as fetchEnsFromIndexer,
  Y as formatETH,
  B as formatPrice,
  j as parseJSON,
  J as resolveChain,
  z as shortAddress,
  V as stringifyJSON,
  W as useClipboard
};
