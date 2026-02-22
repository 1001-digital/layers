import { openBlock as a, createElementBlock as f, renderSlot as u, defineComponent as p, inject as O, computed as _, createBlock as c, unref as s, createCommentVNode as m, Transition as K, withCtx as i, normalizeClass as k, createVNode as r, resolveDynamicComponent as B, mergeProps as F, createElementVNode as S, toDisplayString as h, ref as T, useModel as I, Teleport as W, withModifiers as N, mergeModels as $, Fragment as A, renderList as R, createTextVNode as C, useTemplateRef as X, onMounted as Z, withDirectives as ee, vModelText as te, watch as oe } from "vue";
import { useLocalStorage as le } from "@vueuse/core";
import { Icon as ae } from "@iconify/vue";
import { DropdownMenuRoot as se, DropdownMenuTrigger as ne, DropdownMenuPortal as E, DropdownMenuContent as de, DropdownMenuArrow as ie, DropdownMenuCheckboxItem as re, DropdownMenuItemIndicator as j, DropdownMenuGroup as ue, DropdownMenuItem as ce, DropdownMenuLabel as fe, DropdownMenuRadioGroup as pe, DropdownMenuRadioItem as me, DropdownMenuSeparator as ve, DropdownMenuSub as ye, DropdownMenuSubTrigger as ge, DropdownMenuSubContent as be, CheckboxRoot as _e, CheckboxIndicator as $e, RadioGroupRoot as we, RadioGroupItem as he, RadioGroupIndicator as ke, SelectRoot as Ie, SelectTrigger as De, SelectValue as Se, SelectIcon as Ce, SelectPortal as xe, SelectContent as Ve, SelectViewport as Me, SelectItem as Be, SelectItemText as Te, SelectItemIndicator as Pe, PopoverRoot as Oe, PopoverTrigger as Fe, PopoverPortal as Ae, PopoverContent as Re, PopoverClose as Le, PopoverArrow as Ue, ToastProvider as Ge, ToastRoot as Ke, ToastTitle as Ne, ToastDescription as Ee, ToastAction as je, ToastClose as qe, ToastViewport as ze, TooltipProvider as He, TooltipRoot as Ye, TooltipTrigger as Je, TooltipPortal as Qe, TooltipContent as We, TooltipArrow as Xe } from "reka-ui";
import { DateTime as q } from "luxon";
const y = (e, t) => {
  const o = e.__vccOpts || e;
  for (const [l, n] of t)
    o[l] = n;
  return o;
}, Ze = {}, et = { class: "actions" };
function tt(e, t) {
  return a(), f("menu", et, [
    u(e.$slots, "default", {}, void 0, !0)
  ]);
}
const ot = /* @__PURE__ */ y(Ze, [["render", tt], ["__scopeId", "data-v-8a7f3ae0"]]), lt = Symbol("IconAliases"), at = {
  add: "lucide:plus",
  check: "lucide:check",
  close: "lucide:x",
  "chevron-down": "lucide:chevron-down",
  "chevron-right": "lucide:chevron-right",
  copy: "lucide:copy",
  edit: "lucide:pencil",
  help: "lucide:circle-question-mark",
  home: "lucide:house",
  link: "lucide:link",
  loader: "lucide:loader-2",
  wallet: "lucide:wallet"
}, st = /* @__PURE__ */ p({
  __name: "Icon",
  props: {
    type: {}
  },
  setup(e) {
    const t = e, o = O(lt, at), l = _(() => o[t.type] || t.type);
    return (n, d) => l.value ? (a(), c(s(ae), {
      key: 0,
      icon: l.value,
      class: "icon"
    }, null, 8, ["icon"])) : m("", !0);
  }
}), w = /* @__PURE__ */ y(st, [["__scopeId", "data-v-4c2009b2"]]), nt = /* @__PURE__ */ p({
  __name: "Alert",
  props: {
    type: {},
    dismiss: {}
  },
  setup(e) {
    const t = e, o = _(() => `alert:${t.dismiss}`), l = le(o.value, !1), n = _(() => !!t.dismiss), d = () => {
      l.value = !0;
    };
    return (v, D) => (a(), c(K, { name: "fade" }, {
      default: i(() => [
        s(l) ? m("", !0) : (a(), f("aside", {
          key: 0,
          class: k(["alert", [e.type]])
        }, [
          n.value ? (a(), f("button", {
            key: 0,
            onClick: d,
            class: "close"
          }, [
            r(w, { type: "close" })
          ])) : m("", !0),
          u(v.$slots, "default", {}, void 0, !0)
        ], 2))
      ]),
      _: 3
    }));
  }
}), oo = /* @__PURE__ */ y(nt, [["__scopeId", "data-v-d804c366"]]), z = Symbol("LinkComponent"), dt = { key: 1 }, it = /* @__PURE__ */ p({
  __name: "Button",
  props: {
    to: {},
    target: { default: "_self" },
    exact: { type: Boolean }
  },
  setup(e) {
    const t = e, o = O(z, "a"), l = _(() => typeof o == "string" ? { href: t.to, target: t.target } : { to: t.to, target: t.target, exact: t.exact });
    return (n, d) => e.to ? (a(), c(B(s(o)), F({ key: 0 }, l.value, { class: ["button"] }), {
      default: i(() => [
        u(n.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 16)) : (a(), f("button", dt, [
      u(n.$slots, "default", {}, void 0, !0)
    ]));
  }
}), M = /* @__PURE__ */ y(it, [["__scopeId", "data-v-1314890c"]]), rt = /* @__PURE__ */ p({
  __name: "Card",
  props: {
    as: { default: "article" }
  },
  setup(e) {
    return (t, o) => (a(), c(B(e.as), { class: "card" }, {
      default: i(() => [
        u(t.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }));
  }
}), lo = /* @__PURE__ */ y(rt, [["__scopeId", "data-v-8ce02c56"]]), ut = /* @__PURE__ */ p({
  __name: "CardLink",
  props: {
    to: {},
    title: { default: "View" }
  },
  setup(e) {
    const t = e, o = O(z, "a"), l = _(() => typeof o == "string" ? { href: t.to } : { to: t.to });
    return (n, d) => (a(), c(B(s(o)), F(l.value, { class: "card-link" }), {
      default: i(() => [
        S("span", null, h(e.title), 1)
      ]),
      _: 1
    }, 16));
  }
}), ao = /* @__PURE__ */ y(ut, [["__scopeId", "data-v-5aa7aca2"]]), ct = { key: 0 }, ft = ["title"], pt = { key: 2 }, so = /* @__PURE__ */ p({
  __name: "Dialog",
  props: /* @__PURE__ */ $({
    title: {},
    class: {},
    clickOutside: { type: Boolean, default: !0 },
    closable: { type: Boolean, default: !0 },
    compat: { type: Boolean },
    large: { type: Boolean }
  }, {
    open: { type: Boolean, required: !0 },
    openModifiers: {}
  }),
  emits: /* @__PURE__ */ $(["closed"], ["update:open"]),
  setup(e, { emit: t }) {
    const o = T(null), l = e, n = t, d = I(e, "open"), v = _(() => l.compat ? "article" : "dialog"), D = _(() => {
      let g = {
        dialog: !0,
        compat: !!l.compat,
        large: !!l.large
      };
      return typeof l.class == "string" ? g[l.class] = !0 : Array.isArray(l.class) ? l.class.forEach((b) => {
        g[b] = !0;
      }) : typeof l.class == "object" && (g = { ...g, ...l.class }), l.compat && (g.open = !0), g;
    }), P = (g, b) => {
      l.compat || g.showModal(), g.focus(), b();
    }, J = (g, b) => {
      g.addEventListener("transitionend", (x) => {
        x.propertyName === "opacity" && b();
      }), l.compat ? g.classList.remove("open") : g.close();
    }, Q = (g) => {
      l.compat || g.target !== o.value || L();
    }, L = () => {
      l.clickOutside && (d.value = !1);
    };
    return (g, b) => (a(), c(W, { to: "body" }, [
      r(K, {
        css: !1,
        onEnter: P,
        onLeave: J,
        onAfterLeave: b[3] || (b[3] = () => n("closed"))
      }, {
        default: i(() => [
          d.value ? (a(), c(B(v.value), {
            key: 0,
            ref_key: "dialog",
            ref: o,
            class: k(D.value),
            tabindex: "-1",
            onCancel: b[2] || (b[2] = N((x) => e.closable && (d.value = !1), ["stop", "prevent"])),
            onClick: Q
          }, {
            default: i(() => [
              e.title ? (a(), f("h1", ct, h(e.title), 1)) : m("", !0),
              e.closable ? (a(), f("button", {
                key: 1,
                class: "close",
                title: `Close ${e.title || "Dialog"}`,
                onPointerdown: b[0] || (b[0] = (x) => d.value = !1),
                onClick: b[1] || (b[1] = (x) => d.value = !1)
              }, [
                r(w, { type: "close" })
              ], 40, ft)) : m("", !0),
              S("section", null, [
                u(g.$slots, "default")
              ]),
              g.$slots.footer ? (a(), f("footer", pt, [
                u(g.$slots, "footer")
              ])) : m("", !0)
            ]),
            _: 3
          }, 40, ["class"])) : m("", !0)
        ]),
        _: 3
      }),
      e.compat && d.value ? (a(), f("div", {
        key: 0,
        class: "overlay",
        onClick: L
      })) : m("", !0)
    ]));
  }
}), mt = { class: "dropdown-items" }, no = /* @__PURE__ */ p({
  __name: "Dropdown",
  props: /* @__PURE__ */ $({
    class: {},
    side: { default: "bottom" },
    align: { default: "start" },
    sideOffset: { default: 4 },
    alignOffset: {},
    avoidCollisions: { type: Boolean, default: !0 },
    collisionPadding: { default: 8 },
    arrow: { type: Boolean },
    modal: { type: Boolean },
    loop: { type: Boolean, default: !0 },
    dir: {}
  }, {
    open: { type: Boolean, required: !0 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const t = e, o = I(e, "open");
    return (l, n) => (a(), c(s(se), {
      open: o.value,
      "onUpdate:open": n[0] || (n[0] = (d) => o.value = d),
      modal: e.modal,
      dir: e.dir
    }, {
      default: i(() => [
        r(s(ne), { "as-child": "" }, {
          default: i(() => [
            u(l.$slots, "trigger")
          ]),
          _: 3
        }),
        r(s(E), null, {
          default: i(() => [
            r(s(de), {
              class: k(["dropdown", t.class]),
              side: e.side,
              align: e.align,
              "side-offset": e.sideOffset,
              "align-offset": e.alignOffset,
              "avoid-collisions": e.avoidCollisions,
              "collision-padding": e.collisionPadding,
              loop: e.loop
            }, {
              default: i(() => [
                S("div", mt, [
                  u(l.$slots, "default")
                ]),
                e.arrow ? (a(), c(s(ie), {
                  key: 0,
                  class: "dropdown-arrow"
                })) : m("", !0)
              ]),
              _: 3
            }, 8, ["class", "side", "align", "side-offset", "align-offset", "avoid-collisions", "collision-padding", "loop"])
          ]),
          _: 3
        })
      ]),
      _: 3
    }, 8, ["open", "modal", "dir"]));
  }
}), io = /* @__PURE__ */ p({
  __name: "DropdownCheckboxItem",
  props: /* @__PURE__ */ $({
    disabled: { type: Boolean },
    textValue: {}
  }, {
    modelValue: { type: [Boolean, String], default: !1 },
    modelModifiers: {}
  }),
  emits: /* @__PURE__ */ $(["select"], ["update:modelValue"]),
  setup(e, { emit: t }) {
    const o = I(e, "modelValue"), l = t;
    return (n, d) => (a(), c(s(re), {
      class: "dropdown-item",
      checked: o.value,
      disabled: e.disabled,
      "text-value": e.textValue,
      "onUpdate:checked": d[0] || (d[0] = (v) => o.value = v),
      onSelect: d[1] || (d[1] = (v) => l("select", v))
    }, {
      default: i(() => [
        r(s(j), { class: "dropdown-item-indicator" }, {
          default: i(() => [
            r(w, { type: "check" })
          ]),
          _: 1
        }),
        u(n.$slots, "default")
      ]),
      _: 3
    }, 8, ["checked", "disabled", "text-value"]));
  }
}), ro = /* @__PURE__ */ p({
  __name: "DropdownGroup",
  setup(e) {
    return (t, o) => (a(), c(s(ue), null, {
      default: i(() => [
        u(t.$slots, "default")
      ]),
      _: 3
    }));
  }
}), uo = /* @__PURE__ */ p({
  __name: "DropdownItem",
  props: {
    disabled: { type: Boolean },
    textValue: {}
  },
  emits: ["select"],
  setup(e, { emit: t }) {
    const o = t;
    return (l, n) => (a(), c(s(ce), {
      class: "dropdown-item",
      disabled: e.disabled,
      "text-value": e.textValue,
      onSelect: n[0] || (n[0] = (d) => o("select", d))
    }, {
      default: i(() => [
        u(l.$slots, "default")
      ]),
      _: 3
    }, 8, ["disabled", "text-value"]));
  }
}), co = /* @__PURE__ */ p({
  __name: "DropdownLabel",
  setup(e) {
    return (t, o) => (a(), c(s(fe), { class: "dropdown-label" }, {
      default: i(() => [
        u(t.$slots, "default")
      ]),
      _: 3
    }));
  }
}), fo = /* @__PURE__ */ p({
  __name: "DropdownRadioGroup",
  props: {
    modelValue: {},
    modelModifiers: {}
  },
  emits: ["update:modelValue"],
  setup(e) {
    const t = I(e, "modelValue");
    return (o, l) => (a(), c(s(pe), {
      "model-value": t.value,
      "onUpdate:modelValue": l[0] || (l[0] = (n) => t.value = n)
    }, {
      default: i(() => [
        u(o.$slots, "default")
      ]),
      _: 3
    }, 8, ["model-value"]));
  }
}), po = /* @__PURE__ */ p({
  __name: "DropdownRadioItem",
  props: {
    value: {},
    disabled: { type: Boolean },
    textValue: {}
  },
  emits: ["select"],
  setup(e, { emit: t }) {
    const o = t;
    return (l, n) => (a(), c(s(me), {
      class: "dropdown-item",
      value: e.value,
      disabled: e.disabled,
      "text-value": e.textValue,
      onSelect: n[0] || (n[0] = (d) => o("select", d))
    }, {
      default: i(() => [
        r(s(j), { class: "dropdown-item-indicator" }, {
          default: i(() => [
            r(w, { type: "check" })
          ]),
          _: 1
        }),
        u(l.$slots, "default")
      ]),
      _: 3
    }, 8, ["value", "disabled", "text-value"]));
  }
}), mo = /* @__PURE__ */ p({
  __name: "DropdownSeparator",
  setup(e) {
    return (t, o) => (a(), c(s(ve), { class: "dropdown-separator" }));
  }
}), vo = /* @__PURE__ */ p({
  __name: "DropdownSub",
  props: /* @__PURE__ */ $({
    class: {},
    disabled: { type: Boolean },
    sideOffset: { default: -4 },
    alignOffset: {},
    avoidCollisions: { type: Boolean, default: !0 },
    collisionPadding: { default: 8 },
    loop: { type: Boolean, default: !0 }
  }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const t = e, o = I(e, "open");
    return (l, n) => (a(), c(s(ye), {
      open: o.value,
      "onUpdate:open": n[0] || (n[0] = (d) => o.value = d)
    }, {
      default: i(() => [
        r(s(ge), {
          class: "dropdown-item dropdown-sub-trigger",
          disabled: e.disabled
        }, {
          default: i(() => [
            u(l.$slots, "trigger"),
            r(w, {
              class: "dropdown-sub-icon",
              type: "chevron-right"
            })
          ]),
          _: 3
        }, 8, ["disabled"]),
        r(s(E), null, {
          default: i(() => [
            r(s(be), {
              class: k(["dropdown", t.class]),
              "side-offset": e.sideOffset,
              "align-offset": e.alignOffset,
              "avoid-collisions": e.avoidCollisions,
              "collision-padding": e.collisionPadding,
              loop: e.loop
            }, {
              default: i(() => [
                u(l.$slots, "default")
              ]),
              _: 3
            }, 8, ["class", "side-offset", "align-offset", "avoid-collisions", "collision-padding", "loop"])
          ]),
          _: 3
        })
      ]),
      _: 3
    }, 8, ["open"]));
  }
}), vt = {}, yt = { class: "form" };
function gt(e, t) {
  return a(), f("form", yt, [
    u(e.$slots, "default", {}, void 0, !0)
  ]);
}
const yo = /* @__PURE__ */ y(vt, [["render", gt], ["__scopeId", "data-v-51b64cbf"]]), bt = { class: "form-checkbox" }, _t = { key: 0 }, $t = /* @__PURE__ */ p({
  __name: "FormCheckbox",
  props: /* @__PURE__ */ $({
    disabled: {
      type: Boolean,
      default: !1
    },
    name: {
      type: String,
      default: void 0
    },
    value: {
      type: String,
      default: "on"
    }
  }, {
    modelValue: { type: [Boolean, String] },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e) {
    const t = I(e, "modelValue");
    return (o, l) => (a(), f("label", bt, [
      r(s(_e), {
        modelValue: t.value,
        "onUpdate:modelValue": l[0] || (l[0] = (n) => t.value = n),
        disabled: e.disabled,
        name: e.name,
        value: e.value,
        class: "form-checkbox-button"
      }, {
        default: i(() => [
          r(s($e), { class: "form-checkbox-indicator" }, {
            default: i(() => [
              r(w, { type: "check" })
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["modelValue", "disabled", "name", "value"]),
      o.$slots.default ? (a(), f("span", _t, [
        u(o.$slots, "default", {}, void 0, !0)
      ])) : m("", !0)
    ]));
  }
}), go = /* @__PURE__ */ y($t, [["__scopeId", "data-v-484223f1"]]), wt = /* @__PURE__ */ p({
  __name: "FormGroup",
  props: {
    radio: { type: Boolean }
  },
  setup(e) {
    return (t, o) => (a(), f("div", {
      class: k(["form-group", { radio: e.radio }])
    }, [
      u(t.$slots, "default", {}, void 0, !0)
    ], 2));
  }
}), bo = /* @__PURE__ */ y(wt, [["__scopeId", "data-v-37c02f69"]]), ht = {}, kt = { class: "input-group" };
function It(e, t) {
  return a(), f("div", kt, [
    u(e.$slots, "default", {}, void 0, !0)
  ]);
}
const _o = /* @__PURE__ */ y(ht, [["render", It], ["__scopeId", "data-v-46355d79"]]), Dt = {}, St = { class: "form-item" }, Ct = {
  key: 0,
  class: "prefix"
}, xt = {
  key: 1,
  class: "suffix"
};
function Vt(e, t) {
  return a(), f("div", St, [
    e.$slots.prefix ? (a(), f("span", Ct, [
      u(e.$slots, "prefix", {}, void 0, !0)
    ])) : m("", !0),
    u(e.$slots, "default", {}, void 0, !0),
    e.$slots.suffix ? (a(), f("span", xt, [
      u(e.$slots, "suffix", {}, void 0, !0)
    ])) : m("", !0)
  ]);
}
const $o = /* @__PURE__ */ y(Dt, [["render", Vt], ["__scopeId", "data-v-90060d6c"]]), Mt = { class: "form-label" }, Bt = { key: 0 }, Tt = /* @__PURE__ */ p({
  __name: "FormLabel",
  props: {
    label: {}
  },
  setup(e) {
    return (t, o) => (a(), f("label", Mt, [
      e.label ? (a(), f("span", Bt, h(e.label), 1)) : m("", !0),
      u(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}), wo = /* @__PURE__ */ y(Tt, [["__scopeId", "data-v-0f9b06e5"]]), Pt = /* @__PURE__ */ p({
  __name: "FormRadioGroup",
  props: /* @__PURE__ */ $({
    options: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: !1
    },
    orientation: {
      type: String,
      default: "horizontal"
    },
    valueKey: {
      type: String,
      default: "value"
    },
    labelKey: {
      type: String,
      default: "label"
    },
    name: {
      type: String,
      default: void 0
    }
  }, {
    modelValue: {},
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e) {
    const t = I(e, "modelValue");
    return (o, l) => (a(), c(s(we), {
      modelValue: t.value,
      "onUpdate:modelValue": l[0] || (l[0] = (n) => t.value = n),
      disabled: e.disabled,
      name: e.name,
      orientation: e.orientation,
      class: "form-radio-group"
    }, {
      default: i(() => [
        (a(!0), f(A, null, R(e.options, (n) => (a(), f("label", {
          key: n[e.valueKey],
          class: "form-radio-item"
        }, [
          r(s(he), {
            value: n[e.valueKey],
            class: "form-radio-button"
          }, {
            default: i(() => [
              r(s(ke), { class: "form-radio-indicator" })
            ]),
            _: 1
          }, 8, ["value"]),
          S("span", null, h(n[e.labelKey]), 1)
        ]))), 128))
      ]),
      _: 1
    }, 8, ["modelValue", "disabled", "name", "orientation"]));
  }
}), ho = /* @__PURE__ */ y(Pt, [["__scopeId", "data-v-7892ffef"]]), Ot = /* @__PURE__ */ p({
  __name: "FormSelect",
  props: /* @__PURE__ */ $({
    options: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: "Select..."
    },
    multiple: {
      type: Boolean,
      default: !1
    },
    disabled: {
      type: Boolean,
      default: !1
    },
    valueKey: {
      type: String,
      default: "value"
    },
    labelKey: {
      type: String,
      default: "label"
    },
    name: {
      type: String,
      default: void 0
    }
  }, {
    modelValue: {},
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e) {
    const t = I(e, "modelValue");
    return (o, l) => (a(), c(s(Ie), {
      modelValue: t.value,
      "onUpdate:modelValue": l[0] || (l[0] = (n) => t.value = n),
      multiple: e.multiple,
      disabled: e.disabled,
      name: e.name
    }, {
      default: i(() => [
        r(s(De), { class: "form-select-trigger" }, {
          default: i(() => [
            r(s(Se), { placeholder: e.placeholder }, null, 8, ["placeholder"]),
            r(s(Ce), { class: "form-select-icon" }, {
              default: i(() => [
                r(w, { type: "chevron-down" })
              ]),
              _: 1
            })
          ]),
          _: 1
        }),
        r(s(xe), null, {
          default: i(() => [
            r(s(Ve), {
              position: "popper",
              "side-offset": 4,
              class: "form-select-content"
            }, {
              default: i(() => [
                r(s(Me), { class: "form-select-viewport" }, {
                  default: i(() => [
                    (a(!0), f(A, null, R(e.options, (n) => (a(), c(s(Be), {
                      key: n[e.valueKey],
                      value: n[e.valueKey],
                      class: "form-select-item"
                    }, {
                      default: i(() => [
                        r(s(Te), null, {
                          default: i(() => [
                            C(h(n[e.labelKey]), 1)
                          ]),
                          _: 2
                        }, 1024),
                        r(s(Pe), { class: "form-select-indicator" }, {
                          default: i(() => [
                            r(w, { type: "check" })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 2
                    }, 1032, ["value"]))), 128))
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 8, ["modelValue", "multiple", "disabled", "name"]));
  }
}), ko = /* @__PURE__ */ y(Ot, [["__scopeId", "data-v-9181123b"]]), Ft = ["rows"], At = /* @__PURE__ */ p({
  __name: "FormTextarea",
  props: /* @__PURE__ */ $({
    rows: { default: 4 }
  }, {
    modelValue: {},
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e) {
    const t = I(e, "modelValue"), o = X("textarea");
    function l() {
      const n = o.value;
      n && (n.style.height = "auto", n.style.height = `${n.scrollHeight}px`);
    }
    return Z(l), (n, d) => ee((a(), f("textarea", F({
      ref_key: "textarea",
      ref: o,
      "onUpdate:modelValue": d[0] || (d[0] = (v) => t.value = v),
      rows: e.rows
    }, n.$attrs, { onInput: l }), null, 16, Ft)), [
      [te, t.value]
    ]);
  }
}), Io = /* @__PURE__ */ y(At, [["__scopeId", "data-v-e57d3064"]]), Rt = {
  key: 0,
  class: "spinner",
  "aria-hidden": "true"
}, Lt = {
  key: 1,
  class: "text"
}, Ut = /* @__PURE__ */ p({
  __name: "Loading",
  props: {
    txt: { default: "Loading..." },
    spinner: { type: Boolean, default: !1 },
    stacked: { type: Boolean }
  },
  setup(e) {
    return (t, o) => (a(), f("div", {
      class: k(["loader", { stacked: e.stacked }])
    }, [
      e.spinner ? (a(), f("span", Rt)) : m("", !0),
      e.txt ? (a(), f("span", Lt, h(e.txt), 1)) : m("", !0)
    ], 2));
  }
}), Do = /* @__PURE__ */ y(Ut, [["__scopeId", "data-v-f236e5fb"]]), Gt = { key: 0 }, Kt = /* @__PURE__ */ p({
  __name: "Popover",
  props: /* @__PURE__ */ $({
    class: {},
    side: { default: "bottom" },
    align: { default: "center" },
    sideOffset: { default: 4 },
    alignOffset: {},
    avoidCollisions: { type: Boolean, default: !0 },
    collisionPadding: { default: 8 },
    title: {},
    arrow: { type: Boolean },
    closable: { type: Boolean },
    dismissable: { type: Boolean, default: !0 },
    modal: { type: Boolean }
  }, {
    open: { type: Boolean, required: !0 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const t = e, o = I(e, "open"), l = (d) => {
      var v;
      (v = d.target) == null || v.focus();
    }, n = (d) => {
      t.dismissable || d.preventDefault();
    };
    return (d, v) => (a(), c(s(Oe), {
      open: o.value,
      "onUpdate:open": v[0] || (v[0] = (D) => o.value = D),
      modal: e.modal
    }, {
      default: i(() => [
        r(s(Fe), { "as-child": "" }, {
          default: i(() => [
            u(d.$slots, "trigger", {}, void 0, !0)
          ]),
          _: 3
        }),
        r(s(Ae), null, {
          default: i(() => [
            r(s(Re), {
              class: k(["popover", t.class]),
              side: e.side,
              align: e.align,
              "side-offset": e.sideOffset,
              "align-offset": e.alignOffset,
              "avoid-collisions": e.avoidCollisions,
              "collision-padding": e.collisionPadding,
              onOpenAutoFocus: N(l, ["prevent"]),
              onInteractOutside: n
            }, {
              default: i(() => [
                e.title || d.$slots.title ? (a(), f("h1", Gt, [
                  u(d.$slots, "title", {}, () => [
                    C(h(e.title), 1)
                  ], !0)
                ])) : m("", !0),
                e.closable ? (a(), c(s(Le), {
                  key: 1,
                  as: M,
                  class: "popover-close tertiary",
                  "aria-label": "Close"
                }, {
                  default: i(() => [
                    r(w, { type: "close" })
                  ]),
                  _: 1
                })) : m("", !0),
                S("section", null, [
                  u(d.$slots, "default", {}, void 0, !0)
                ]),
                e.arrow ? (a(), c(s(Ue), {
                  key: 2,
                  class: "popover-arrow"
                })) : m("", !0)
              ]),
              _: 3
            }, 8, ["class", "side", "align", "side-offset", "align-offset", "avoid-collisions", "collision-padding"])
          ]),
          _: 3
        })
      ]),
      _: 3
    }, 8, ["open", "modal"]));
  }
}), So = /* @__PURE__ */ y(Kt, [["__scopeId", "data-v-50582992"]]), Nt = { class: "tag" }, Et = /* @__PURE__ */ p({
  __name: "Tag",
  props: {
    dismissable: { type: Boolean }
  },
  emits: ["dismiss"],
  setup(e, { emit: t }) {
    const o = t;
    return (l, n) => (a(), f("span", Nt, [
      S("span", null, [
        u(l.$slots, "default", {}, void 0, !0)
      ]),
      e.dismissable ? (a(), c(M, {
        key: 0,
        onClick: n[0] || (n[0] = (d) => o("dismiss"))
      }, {
        default: i(() => [
          r(w, { type: "close" })
        ]),
        _: 1
      })) : m("", !0)
    ]));
  }
}), Co = /* @__PURE__ */ y(Et, [["__scopeId", "data-v-9dbf55ce"]]), jt = {}, qt = { class: "tags" };
function zt(e, t) {
  return a(), f("div", qt, [
    u(e.$slots, "default", {}, void 0, !0)
  ]);
}
const xo = /* @__PURE__ */ y(jt, [["render", zt], ["__scopeId", "data-v-4be1b681"]]), V = T([]), Ht = () => ({ toasts: V, add: (o) => {
  V.value.push({ ...o, id: crypto.randomUUID() });
}, dismiss: (o) => {
  V.value = V.value.filter((l) => l.id !== o);
} }), Yt = /* @__PURE__ */ p({
  __name: "Toast",
  props: {
    duration: { default: 5e3 },
    swipeDirection: { default: "right" },
    position: { default: "bottom-right" }
  },
  setup(e) {
    const { toasts: t, dismiss: o } = Ht();
    return (l, n) => (a(), c(s(Ge), {
      duration: e.duration,
      "swipe-direction": e.swipeDirection
    }, {
      default: i(() => [
        (a(!0), f(A, null, R(s(t), (d) => (a(), c(s(Ke), {
          key: d.id,
          duration: d.duration,
          class: k(["toast", [d.variant || "info"]]),
          "onUpdate:open": (v) => !v && s(o)(d.id)
        }, {
          default: i(() => [
            d.title ? (a(), c(s(Ne), {
              key: 0,
              class: "toast-title"
            }, {
              default: i(() => [
                C(h(d.title), 1)
              ]),
              _: 2
            }, 1024)) : m("", !0),
            d.description ? (a(), c(s(Ee), {
              key: 1,
              class: "toast-description"
            }, {
              default: i(() => [
                C(h(d.description), 1)
              ]),
              _: 2
            }, 1024)) : m("", !0),
            d.action ? (a(), c(s(je), {
              key: 2,
              "alt-text": d.action.label,
              as: ot,
              class: "left"
            }, {
              default: i(() => [
                r(M, {
                  class: "small",
                  onClick: (v) => d.action.onClick()
                }, {
                  default: i(() => [
                    C(h(d.action.label), 1)
                  ]),
                  _: 2
                }, 1032, ["onClick"])
              ]),
              _: 2
            }, 1032, ["alt-text"])) : m("", !0),
            r(s(qe), {
              class: "toast-close small tertiary",
              as: M,
              "aria-label": "Close"
            }, {
              default: i(() => [
                r(w, { type: "close" })
              ]),
              _: 1
            })
          ]),
          _: 2
        }, 1032, ["duration", "class", "onUpdate:open"]))), 128)),
        r(s(ze), {
          class: k(["toast-viewport", [e.position]])
        }, null, 8, ["class"])
      ]),
      _: 1
    }, 8, ["duration", "swipe-direction"]));
  }
}), Vo = /* @__PURE__ */ y(Yt, [["__scopeId", "data-v-78099701"]]), Mo = /* @__PURE__ */ p({
  __name: "Tooltip",
  props: {
    class: {},
    side: { default: "top" },
    align: { default: "center" },
    sideOffset: { default: 4 },
    alignOffset: {},
    avoidCollisions: { type: Boolean, default: !0 },
    collisionPadding: { default: 8 },
    arrow: { type: Boolean, default: !0 },
    delayDuration: { default: 300 }
  },
  setup(e) {
    const t = e;
    return (o, l) => (a(), c(s(He), { "delay-duration": e.delayDuration }, {
      default: i(() => [
        r(s(Ye), null, {
          default: i(() => [
            r(s(Je), { "as-child": "" }, {
              default: i(() => [
                u(o.$slots, "trigger")
              ]),
              _: 3
            }),
            r(s(Qe), null, {
              default: i(() => [
                r(s(We), {
                  class: k(["tooltip", t.class]),
                  side: e.side,
                  align: e.align,
                  "side-offset": e.sideOffset,
                  "align-offset": e.alignOffset,
                  "avoid-collisions": e.avoidCollisions,
                  "collision-padding": e.collisionPadding
                }, {
                  default: i(() => [
                    u(o.$slots, "default"),
                    e.arrow ? (a(), c(s(Xe), {
                      key: 0,
                      class: "tooltip-arrow"
                    })) : m("", !0)
                  ]),
                  _: 3
                }, 8, ["class", "side", "align", "side-offset", "align-offset", "avoid-collisions", "collision-padding"])
              ]),
              _: 3
            })
          ]),
          _: 3
        })
      ]),
      _: 3
    }, 8, ["delay-duration"]));
  }
}), Bo = (e) => new Promise((t) => setTimeout(t, e)), To = (e) => e * 60 * 60 * 24, H = () => Math.floor(Date.now() / 1e3), Po = (e) => e ? q.utc(
  e.getFullYear(),
  e.getMonth() + 1,
  e.getDate(),
  e.getHours(),
  e.getMinutes(),
  e.getSeconds()
) : null;
let U;
const G = T(H()), Jt = () => (typeof window < "u" && !U && (U = setInterval(() => {
  G.value = H();
}, 1e3)), G), Oo = (e, t = 60) => {
  const o = _(() => Math.abs(Number(e.value))), l = _(() => o.value % 60), n = _(() => Math.floor(o.value / 60) % 60), d = _(() => Math.floor(o.value / 60 / 60) % 24), v = _(() => Math.floor(o.value / 60 / 60 / 24)), D = _(
    () => [
      v.value ? `${v.value}d` : null,
      d.value ? `${d.value}h` : null,
      n.value ? `${n.value}m` : null,
      o.value < t && l.value ? `${l.value}s` : null
    ].filter((P) => !!P).join(" ")
  );
  return {
    seconds: l,
    minutes: n,
    hours: d,
    days: v,
    str: D
  };
}, Qt = (e) => {
  const t = T(), o = Jt();
  return oe(
    o,
    () => {
      e.value && (t.value = q.fromISO(e.value).toRelative({ style: "short", locale: "en" }) ?? void 0);
    },
    {
      immediate: !0
    }
  ), t;
}, Fo = (...e) => (console.warn("[deprecated] useSecondsAgo is deprecated, use useTimeAgo instead."), Qt(...e)), Y = (e) => e == null ? void 0 : e.toLocaleString("en-US"), Ao = (e, t = 2) => {
  const o = Math.pow(10, t), l = Math.round(e * o) / o;
  return Y(l === e ? e : l);
}, Ro = (e = 0, t = 1) => Y(Math.round(e / t * 100));
function Lo(e, t = 0) {
  const o = typeof e == "string" ? parseFloat(e) : e;
  if (isNaN(o))
    throw new Error("Invalid number input");
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: t,
    maximumFractionDigits: t
  }).format(o);
}
export {
  ot as Actions,
  oo as Alert,
  M as Button,
  lo as Card,
  ao as CardLink,
  so as Dialog,
  no as Dropdown,
  io as DropdownCheckboxItem,
  ro as DropdownGroup,
  uo as DropdownItem,
  co as DropdownLabel,
  fo as DropdownRadioGroup,
  po as DropdownRadioItem,
  mo as DropdownSeparator,
  vo as DropdownSub,
  yo as Form,
  go as FormCheckbox,
  bo as FormGroup,
  _o as FormInputGroup,
  $o as FormItem,
  wo as FormLabel,
  ho as FormRadioGroup,
  ko as FormSelect,
  Io as FormTextarea,
  w as Icon,
  lt as IconAliasesKey,
  z as LinkComponentKey,
  Do as Loading,
  So as Popover,
  Co as Tag,
  xo as Tags,
  Vo as Toast,
  Mo as Tooltip,
  Ro as asPercentageOf,
  Po as asUTCDate,
  To as daysInSeconds,
  at as defaultIconAliases,
  Bo as delay,
  Y as formatNumber,
  Lo as formatUSD,
  H as nowInSeconds,
  Ao as roundAndFormatNumber,
  Oo as useCountDown,
  Jt as useSeconds,
  Fo as useSecondsAgo,
  Qt as useTimeAgo,
  Ht as useToast
};
