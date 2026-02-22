import { inject as pe, ref as C, computed as h, toValue as J, watch as K, reactive as ve, defineComponent as L, renderSlot as F, createElementVNode as b, toDisplayString as $, onMounted as ae, openBlock as p, createElementBlock as R, Fragment as W, createTextVNode as P, createVNode as D, unref as v, normalizeClass as oe, withCtx as y, createBlock as w, createCommentVNode as A, renderList as he, useSlots as ye } from "vue";
import { defineChain as ge, isAddress as we, formatEther as X, formatGwei as V } from "viem";
import { mainnet as Ce, sepolia as ke, holesky as Ee, optimism as be, arbitrum as Se, base as _e, polygon as xe, localhost as Ue } from "viem/chains";
import { normalize as Z } from "viem/ens";
import { useSwitchChain as Re, useConnection as z, useConfig as Q, useBlockNumber as De, useChainId as Ie, useConnect as Te } from "@wagmi/vue";
import { getPublicClient as Ae, getGasPrice as Ne, readContract as Fe, watchChainId as $e, waitForTransactionReceipt as Me } from "@wagmi/core";
import { useQuery as Pe } from "@tanstack/vue-query";
import { Button as M, Icon as O, Dialog as se, Alert as re, Loading as le } from "@1001-digital/components";
import qe from "qrcode";
const Be = Symbol("EvmConfig"), Le = {
  title: "EVM Layer",
  defaultChain: "mainnet",
  chains: {
    mainnet: { id: 1, blockExplorer: "https://etherscan.io" }
  },
  ens: { mode: "indexer" }
}, Y = () => pe(Be, Le), We = (e, t = 3) => e.substring(0, t + 2) + "..." + e.substring(e.length - t);
function Oe(e, t) {
  const n = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
  function i() {
    const o = Date.now();
    for (const [l, f] of n)
      f.expiresAt <= o && n.delete(l);
    if (n.size > t) {
      const l = n.size - t, f = n.keys();
      for (let a = 0; a < l; a++)
        n.delete(f.next().value);
    }
  }
  function d(o) {
    const l = n.get(o);
    if (l) {
      if (l.expiresAt <= Date.now()) {
        n.delete(o);
        return;
      }
      return l.data;
    }
  }
  function m(o, l) {
    const f = d(o);
    if (f) return Promise.resolve(f);
    const a = s.get(o);
    if (a) return a;
    const I = l().then((S) => (n.set(o, { data: S, expiresAt: Date.now() + e }), s.delete(o), n.size > t && i(), S)).catch((S) => {
      throw s.delete(o), S;
    });
    return s.set(o, I), I;
  }
  return { get: d, fetch: m };
}
const Ke = [Ce, ke, Ee, be, Se, _e, xe, Ue], Qe = new Map(Ke.map((e) => [e.id, e])), $t = (e) => Qe.get(e) ?? ge({
  id: e,
  name: `Chain ${e}`,
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: [] } }
}), He = ["avatar", "header", "description", "url", "email", "com.twitter", "com.github"], Ve = ["avatar"], je = [...He], ze = Oe(300 * 1e3, 500);
async function Ye(e, t) {
  let n;
  for (const s of t)
    try {
      const i = await fetch(`${s}/${e}`);
      if (!i.ok) throw new Error(`HTTP ${i.status}`);
      return await i.json();
    } catch (i) {
      n = i;
    }
  throw n ?? new Error("No indexer URLs provided");
}
async function Ge(e, t, n = []) {
  const s = we(e);
  let i, d;
  if (s)
    i = e, d = await t.getEnsName({ address: e }) ?? null;
  else {
    d = e;
    const l = await t.getEnsAddress({ name: Z(e) });
    if (!l) return { address: "", ens: d, data: null };
    i = l;
  }
  if (!d || !n.length) return { address: i, ens: d ?? null, data: null };
  const m = Z(d), o = await Promise.all(
    n.map((l) => t.getEnsText({ name: m, key: l }).catch(() => null))
  );
  return { address: i, ens: d, data: Je(n, o.map((l) => l || "")) };
}
function Je(e, t) {
  const n = (s) => t[e.indexOf(s)] || "";
  return {
    avatar: n("avatar"),
    header: n("header"),
    description: n("description"),
    links: {
      url: n("url"),
      email: n("email"),
      twitter: n("com.twitter"),
      github: n("com.github")
    }
  };
}
function Mt(e, t = 3) {
  const n = typeof e == "string" ? parseFloat(e) : e;
  if (isNaN(n))
    throw new Error("Invalid number input");
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: t
  }).format(n);
}
const Xe = (e, t) => typeof t == "bigint" ? t.toString() + "n" : t, Ze = (e, t) => typeof t == "string" && /^\d+n$/.test(t) ? BigInt(t.slice(0, -1)) : t, et = (e) => JSON.stringify(e, Xe), tt = (e) => JSON.parse(e, Ze), ee = (e, t = 2) => e == null ? void 0 : e.toLocaleString("en-US", { maximumFractionDigits: t }), nt = () => {
  const t = Y().baseURL || "/";
  return t.endsWith("/") ? t : t + "/";
}, ie = (e) => {
  const t = Y(), n = e || t.defaultChain || "mainnet", s = t.chains[n];
  return {
    id: (s == null ? void 0 : s.id) ?? 1,
    blockExplorer: (s == null ? void 0 : s.blockExplorer) ?? "https://etherscan.io"
  };
}, at = () => ie().id, ot = (e) => ie(e).blockExplorer, st = () => {
  const e = at(), { switchChain: t } = Re(), { chainId: n } = z();
  return async () => (e !== n.value && t({ chainId: e }), e === n.value);
}, rt = () => {
  const e = C(!1);
  let t = null;
  return {
    copy: async (s) => {
      try {
        return await navigator.clipboard.writeText(s), e.value = !0, t && clearTimeout(t), t = setTimeout(() => {
          e.value = !1;
        }, 2e3), !0;
      } catch (i) {
        return console.error("Failed to copy to clipboard:", i), !1;
      }
    },
    copied: e
  };
};
async function lt(e, t, n, s, i) {
  for (const d of t)
    try {
      if (d === "indexer") {
        if (!n.length) continue;
        return await Ye(e, n);
      }
      if (d === "chain") {
        const m = Ae(s, { chainId: 1 });
        if (!m) continue;
        return await Ge(e, m, i);
      }
    } catch {
      continue;
    }
  return { address: e, ens: null, data: null };
}
function G(e, t, n, s = {}) {
  const i = Q(), d = Y(), m = h(() => {
    var f;
    return J(s.mode) || ((f = d.ens) == null ? void 0 : f.mode) || "indexer";
  }), o = h(() => {
    var f;
    return ((f = d.ens) == null ? void 0 : f.indexerUrls) || [];
  }), l = h(() => J(t));
  return Pe({
    queryKey: ["ens", e, l],
    queryFn: async () => {
      const f = l.value;
      if (!f) return null;
      const a = m.value === "indexer" ? ["indexer", "chain"] : ["chain", "indexer"];
      return ze.fetch(
        `ens-${e}-${f}`,
        () => lt(f, a, o.value, i, n)
      );
    },
    enabled: () => !!l.value,
    staleTime: 300 * 1e3
  });
}
const it = (e, t) => G("resolve", e, [], t), Pt = (e, t) => G("avatar", e, [...Ve], t), qt = (e, t) => G("profile", e, [...je], t);
let te = null;
const N = C(0n), Bt = () => {
  const e = Q(), { data: t } = De(), n = async () => {
    N.value = await Ne(e);
  };
  return te || (n(), te = K(t, () => n())), h(() => ({
    wei: N.value,
    gwei: V(N.value),
    eth: X(N.value),
    formatted: {
      gwei: N.value > 2000000000000n ? Math.round(parseFloat(V(N.value))) : parseFloat(V(N.value)).toFixed(1),
      eth: X(N.value)
    }
  }));
}, j = (e) => new Promise((t) => setTimeout(t, e)), ne = () => Math.floor(Date.now() / 1e3), ct = [
  {
    inputs: [],
    name: "latestRoundData",
    outputs: [
      { internalType: "uint80", name: "roundId", type: "uint80" },
      { internalType: "int256", name: "answer", type: "int256" },
      { internalType: "uint256", name: "startedAt", type: "uint256" },
      { internalType: "uint256", name: "updatedAt", type: "uint256" },
      { internalType: "uint80", name: "answeredInRound", type: "uint80" }
    ],
    stateMutability: "view",
    type: "function"
  }
], ut = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419", ce = "evm:price-feed", dt = 3600, g = ve({
  ethUSDRaw: null,
  lastUpdated: 0
});
function ft() {
  if (!(typeof window > "u"))
    try {
      const e = localStorage.getItem(ce);
      if (!e) return;
      const t = tt(e);
      t.ethUSDRaw && (g.ethUSDRaw = t.ethUSDRaw), t.lastUpdated && (g.lastUpdated = t.lastUpdated);
    } catch {
    }
}
function mt() {
  if (!(typeof window > "u"))
    try {
      localStorage.setItem(ce, et({
        ethUSDRaw: g.ethUSDRaw,
        lastUpdated: g.lastUpdated
      }));
    } catch {
    }
}
const Lt = () => {
  const e = Q();
  g.lastUpdated || ft();
  const t = h(() => g.ethUSDRaw ? g.ethUSDRaw / BigInt(1e8) : 0n), n = h(() => g.ethUSDRaw ? g.ethUSDRaw / BigInt(1e6) : 0n), s = h(() => ee(Number(n.value) / 100, 2)), i = (m) => {
    const o = m * (g.ethUSDRaw || 0n) / 10n ** 18n / 10n ** 6n;
    return ee(Number(o) / 100, 2);
  };
  async function d() {
    if (!(ne() - g.lastUpdated < dt))
      try {
        const [, m] = await Fe(e, {
          address: ut,
          abi: ct,
          functionName: "latestRoundData",
          chainId: 1
        });
        g.ethUSDRaw = m, g.lastUpdated = ne(), mt();
      } catch (m) {
        console.warn("Error fetching ETH/USD price:", m);
      }
  }
  return {
    ethUSDRaw: h(() => g.ethUSDRaw),
    ethUSD: t,
    ethUSC: n,
    ethUSDFormatted: s,
    weiToUSD: i,
    fetchPrice: d
  };
}, pt = /* @__PURE__ */ L({
  __name: "EvmAccount",
  props: {
    address: {},
    mode: {}
  },
  setup(e) {
    const t = e, n = h(() => t.address), { address: s } = z(), i = h(
      () => {
        var o, l;
        return ((o = s.value) == null ? void 0 : o.toLowerCase()) === ((l = n.value) == null ? void 0 : l.toLowerCase());
      }
    ), { data: d } = it(n, { mode: h(() => t.mode) }), m = h(() => {
      var o;
      return ((o = d.value) == null ? void 0 : o.ens) || We(n.value);
    });
    return (o, l) => F(o.$slots, "default", {
      display: m.value,
      isCurrent: i.value
    }, () => [
      b("span", null, $(m.value), 1)
    ]);
  }
}), vt = { class: "qr-frame" }, ht = { class: "uri-display" }, yt = /* @__PURE__ */ L({
  __name: "EvmConnectorQR",
  props: {
    uri: {}
  },
  setup(e) {
    const t = e, n = C(null), { copy: s, copied: i } = rt(), d = async () => {
      if (!(!n.value || !t.uri))
        try {
          await qe.toCanvas(n.value, t.uri, {
            width: 300,
            margin: 2,
            color: {
              dark: "#000000",
              light: "#FFFFFF"
            }
          });
        } catch (o) {
          console.error("Failed to generate QR code:", o);
        }
    }, m = () => s(t.uri);
    return K(() => t.uri, d, { immediate: !0 }), ae(() => {
      d();
    }), (o, l) => (p(), R(W, null, [
      b("p", null, [
        F(o.$slots, "instruction", {}, () => [
          l[0] || (l[0] = P("Scan the code in your wallet application", -1))
        ], !0)
      ]),
      b("div", vt, [
        b("canvas", {
          ref_key: "qrCanvas",
          ref: n
        }, null, 512)
      ]),
      l[1] || (l[1] = b("p", { class: "uri-label" }, "Or copy the connection URI:", -1)),
      b("div", ht, [
        b("code", null, $(e.uri), 1),
        D(v(M), {
          onClick: m,
          class: oe(["copy-button", { copied: v(i) }])
        }, {
          default: y(() => [
            D(v(O), {
              type: v(i) ? "check" : "copy"
            }, null, 8, ["type"])
          ]),
          _: 1
        }, 8, ["class"])
      ])
    ], 64));
  }
}), ue = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, i] of t)
    n[s] = i;
  return n;
}, de = /* @__PURE__ */ ue(yt, [["__scopeId", "data-v-50db2d1d"]]), gt = /* @__PURE__ */ L({
  __name: "EvmWalletConnectQR",
  props: {
    uri: {}
  },
  setup(e) {
    return (t, n) => (p(), w(de, { uri: e.uri }, {
      instruction: y(() => [...n[0] || (n[0] = [
        P(" Scan the code in your wallet application ", -1)
      ])]),
      _: 1
    }, 8, ["uri"]));
  }
}), wt = /* @__PURE__ */ L({
  __name: "EvmMetaMaskQR",
  props: {
    uri: {}
  },
  setup(e) {
    return (t, n) => (p(), w(de, { uri: e.uri }, {
      instruction: y(() => [...n[0] || (n[0] = [
        P(" Scan the code in your MetaMask mobile app ", -1)
      ])]),
      _: 1
    }, 8, ["uri"]));
  }
}), Ct = {
  key: 4,
  class: "wallet-options"
}, kt = ["src", "alt"], Et = {
  key: 1,
  class: "default-wallet-icon"
}, bt = /* @__PURE__ */ L({
  __name: "EvmConnect",
  props: {
    className: {}
  },
  emits: ["connected", "disconnected"],
  setup(e, { emit: t }) {
    const n = {
      "Coinbase Wallet": "coinbase.svg",
      MetaMask: "metamask.svg",
      Phantom: "phantom.svg",
      "Rabby Wallet": "rabby.svg",
      Rainbow: "rainbow.svg",
      WalletConnect: "walletconnect.svg"
    }, s = {
      WalletConnect: 20,
      "Coinbase Wallet": 10
    }, i = t, d = nt(), m = Ie(), { connectors: o, connectAsync: l } = Te(), { address: f, isConnected: a } = z(), I = h(() => !a.value), S = h(() => {
      const c = Array.from(
        new Map(
          o == null ? void 0 : o.map((r) => [r.name, r])
        ).values()
      );
      return (c.length > 1 ? c.filter((r) => r.id !== "injected") : c).sort((r, U) => {
        const fe = s[r.name] ?? 5, me = s[U.name] ?? 5;
        return fe - me;
      });
    }), k = C(!1), E = C(""), T = C(!1), _ = C(""), x = C(""), q = async (c) => {
      E.value = "", T.value = !0, _.value = "", x.value = "";
      const u = (r) => {
        r.type === "display_uri" && typeof r.data == "string" && (c.id === "walletConnect" ? _.value = r.data : c.id === "metaMaskSDK" && (x.value = r.data));
      };
      (c.id === "walletConnect" || c.id === "metaMaskSDK") && c.emitter.on("message", u);
      try {
        await l({ connector: c, chainId: m.value }), setTimeout(() => {
          k.value = !1, T.value = !1, _.value = "", x.value = "";
        }, 100);
      } catch (r) {
        T.value = !1, _.value = "", x.value = "";
        const U = r instanceof Error ? r.message : "";
        U.includes("User rejected") || U.includes("rejected") || U.includes("denied") ? E.value = "Connection cancelled. Please try again." : E.value = "Failed to connect. Please try again.", console.error("Wallet connection error:", r);
      } finally {
        (c.id === "walletConnect" || c.id === "metaMaskSDK") && c.emitter.off("message", u);
      }
    }, H = () => {
      E.value = "", T.value = !1, _.value = "", x.value = "";
    }, B = () => a.value ? i("connected", { address: f.value }) : i("disconnected");
    return K(a, () => B()), ae(() => B()), (c, u) => (p(), R(W, null, [
      I.value ? (p(), w(v(M), {
        key: 0,
        onClick: u[0] || (u[0] = (r) => k.value = !0),
        class: oe(e.className)
      }, {
        default: y(() => [
          F(c.$slots, "default", {}, () => [
            u[2] || (u[2] = P("Connect Wallet", -1))
          ], !0)
        ]),
        _: 3
      }, 8, ["class"])) : F(c.$slots, "connected", {
        key: 1,
        address: v(f)
      }, () => [
        D(pt, { address: v(f) }, null, 8, ["address"])
      ], !0),
      I.value ? (p(), w(v(se), {
        key: 2,
        title: "Connect Wallet",
        open: k.value,
        "onUpdate:open": u[1] || (u[1] = (r) => k.value = r),
        onClosed: H
      }, {
        default: y(() => [
          E.value ? (p(), w(v(re), {
            key: 0,
            type: "error"
          }, {
            default: y(() => [
              P($(E.value), 1)
            ]),
            _: 1
          })) : A("", !0),
          _.value ? (p(), w(gt, {
            key: 1,
            uri: _.value
          }, null, 8, ["uri"])) : x.value ? (p(), w(wt, {
            key: 2,
            uri: x.value
          }, null, 8, ["uri"])) : T.value ? (p(), w(v(le), {
            key: 3,
            txt: "Waiting for wallet confirmation...",
            spinner: "",
            stacked: ""
          })) : (p(), R("div", Ct, [
            (p(!0), R(W, null, he(S.value, (r) => (p(), w(v(M), {
              key: r.uid,
              onClick: () => q(r),
              class: "choose-connector"
            }, {
              default: y(() => [
                n[r.name] ? (p(), R("img", {
                  key: 0,
                  src: r.icon || `${v(d)}icons/wallets/${n[r.name]}`,
                  alt: r.name
                }, null, 8, kt)) : (p(), R("div", Et, [
                  D(v(O), { type: "wallet" })
                ])),
                b("span", null, $(r.name), 1)
              ]),
              _: 2
            }, 1032, ["onClick"]))), 128)),
            D(v(M), {
              to: "https://ethereum.org/wallets/",
              target: "_blank",
              class: "link muted small"
            }, {
              default: y(() => [
                D(v(O), { type: "help" }),
                u[3] || (u[3] = b("span", null, "New to wallets?", -1))
              ]),
              _: 1
            })
          ]))
        ]),
        _: 1
      }, 8, ["open"])) : A("", !0)
    ], 64));
  }
}), Wt = /* @__PURE__ */ ue(bt, [["__scopeId", "data-v-6066f026"]]), St = { key: 1 }, _t = { key: 0 }, Ot = /* @__PURE__ */ L({
  __name: "EvmTransactionFlow",
  props: {
    text: {},
    request: {},
    delayAfter: { default: 2e3 },
    delayAutoclose: { default: 2e3 },
    skipConfirmation: { type: Boolean, default: !1 },
    autoCloseSuccess: { type: Boolean, default: !0 },
    dismissable: { type: Boolean, default: !0 }
  },
  emits: ["complete", "cancel"],
  setup(e, { expose: t, emit: n }) {
    const s = {
      title: {
        confirm: "Confirm Transaction",
        chain: "Switch Network",
        requesting: "Requesting",
        waiting: "Processing",
        complete: "Complete",
        error: "Error"
      },
      lead: {
        confirm: "Please review and confirm this transaction.",
        chain: "Please switch to the correct network to continue.",
        requesting: "Requesting transaction signature...",
        waiting: "Waiting for transaction confirmation...",
        complete: "Transaction confirmed successfully."
      },
      action: {
        confirm: "Execute",
        error: "Try Again"
      }
    };
    ye();
    const i = st(), d = Q(), m = ot(), o = e, l = n, f = h(() => {
      var c, u, r;
      return {
        title: { ...s.title, ...(c = o.text) == null ? void 0 : c.title },
        lead: { ...s.lead, ...(u = o.text) == null ? void 0 : u.lead },
        action: { ...s.action, ...(r = o.text) == null ? void 0 : r.action }
      };
    }), a = C("idle"), I = h({
      get: () => a.value !== "idle",
      set: (c) => {
        c || (a.value = "idle", k.value = "");
      }
    });
    $e(d, {
      async onChange() {
        a.value === "chain" && await i() && q();
      }
    });
    const S = C(o.request);
    K(
      () => o.request,
      (c) => {
        S.value = c;
      }
    );
    const k = C(""), E = C(null), T = C(null), _ = h(() => `${m}/tx/${E.value}`), x = h(
      () => o.dismissable && a.value !== "requesting" && a.value !== "waiting"
    ), q = async (c = S.value) => {
      var u;
      if (S.value = c, k.value = "", E.value = null, T.value = null, a.value = "confirm", !await i()) {
        a.value = "chain";
        return;
      }
      try {
        a.value = "requesting", E.value = await c(), a.value = "waiting";
        const r = await Me(d, {
          hash: E.value
        });
        await j(o.delayAfter), T.value = r, l("complete", r), a.value = "complete";
      } catch (r) {
        const U = r;
        ((u = U == null ? void 0 : U.cause) == null ? void 0 : u.code) === 4001 ? (k.value = "Transaction rejected by user.", a.value = "error") : (k.value = U.shortMessage || "Error submitting transaction request.", a.value = "error"), console.log(r);
      }
      return o.autoCloseSuccess && a.value === "complete" && (await j(o.delayAutoclose), a.value = "idle", await j(300)), T.value;
    }, H = () => {
      if (o.skipConfirmation && a.value === "idle") {
        q();
        return;
      }
      a.value = "confirm";
    }, B = () => {
      a.value = "idle", k.value = "", l("cancel");
    };
    return t({
      initializeRequest: q
    }), (c, u) => (p(), R(W, null, [
      F(c.$slots, "start", {
        start: H,
        step: a.value,
        open: I.value
      }),
      D(v(se), {
        open: I.value,
        "onUpdate:open": u[1] || (u[1] = (r) => I.value = r),
        closable: x.value,
        "click-outside": x.value,
        title: f.value.title[a.value],
        class: "transaction-flow"
      }, {
        footer: y(() => [
          a.value === "chain" ? (p(), w(v(M), {
            key: 0,
            onClick: B,
            class: "secondary"
          }, {
            default: y(() => [...u[3] || (u[3] = [
              P("Cancel", -1)
            ])]),
            _: 1
          })) : A("", !0),
          a.value === "confirm" || a.value === "error" ? (p(), R(W, { key: 1 }, [
            D(v(M), {
              onClick: B,
              class: "secondary"
            }, {
              default: y(() => [...u[4] || (u[4] = [
                P("Cancel", -1)
              ])]),
              _: 1
            }),
            D(v(M), {
              onClick: u[0] || (u[0] = () => q())
            }, {
              default: y(() => [
                P($(f.value.action[a.value] || "Execute"), 1)
              ]),
              _: 1
            })
          ], 64)) : A("", !0),
          F(c.$slots, "actions", {
            step: a.value,
            cancel: B,
            execute: () => q(),
            txLink: _.value
          })
        ]),
        default: y(() => [
          F(c.$slots, "before"),
          a.value === "requesting" || a.value === "waiting" ? (p(), w(v(le), {
            key: 0,
            spinner: "",
            stacked: "",
            txt: f.value.lead[a.value] || ""
          }, null, 8, ["txt"])) : A("", !0),
          a.value !== "requesting" && a.value !== "waiting" && a.value !== "error" && f.value.lead[a.value] ? (p(), R("p", St, $(f.value.lead[a.value]), 1)) : A("", !0),
          k.value ? (p(), w(v(re), {
            key: 2,
            type: "error"
          }, {
            default: y(() => [
              f.value.lead[a.value] ? (p(), R("p", _t, $(f.value.lead[a.value]), 1)) : A("", !0),
              b("p", null, $(k.value), 1)
            ]),
            _: 1
          })) : A("", !0),
          a.value === "waiting" ? (p(), w(v(M), {
            key: 3,
            to: _.value,
            target: "_blank",
            class: "link muted small centered"
          }, {
            default: y(() => [
              D(v(O), { type: "link" }),
              u[2] || (u[2] = b("span", null, "View on Block Explorer", -1))
            ]),
            _: 1
          }, 8, ["to"])) : A("", !0),
          F(c.$slots, a.value, { cancel: B })
        ]),
        _: 3
      }, 8, ["open", "closable", "click-outside", "title"])
    ], 64));
  }
});
export {
  Ve as ENS_KEYS_AVATAR,
  je as ENS_KEYS_PROFILE,
  pt as EvmAccount,
  Be as EvmConfigKey,
  Wt as EvmConnect,
  de as EvmConnectorQR,
  wt as EvmMetaMaskQR,
  Ot as EvmTransactionFlow,
  gt as EvmWalletConnectQR,
  Oe as createCache,
  Le as defaultEvmConfig,
  j as delay,
  ze as ensCache,
  Ge as fetchEnsFromChain,
  Ye as fetchEnsFromIndexer,
  Mt as formatETH,
  ee as formatPrice,
  ne as nowInSeconds,
  tt as parseJSON,
  $t as resolveChain,
  We as shortAddress,
  et as stringifyJSON,
  nt as useBaseURL,
  ot as useBlockExplorer,
  ie as useChainConfig,
  rt as useClipboard,
  it as useEns,
  qt as useEnsProfile,
  Pt as useEnsWithAvatar,
  st as useEnsureChainIdCheck,
  Y as useEvmConfig,
  Bt as useGasPrice,
  at as useMainChainId,
  Lt as usePriceFeed
};
