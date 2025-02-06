import G, { app as m, protocol as P, net as J, BrowserWindow as A, ipcMain as W } from "electron";
import h from "path";
import V from "url";
import { stat as H } from "node:fs/promises";
import Z from "child_process";
import Y from "tty";
import K from "util";
import Q from "fs";
import X from "net";
function x(o) {
  return o && o.__esModule && Object.prototype.hasOwnProperty.call(o, "default") ? o.default : o;
}
var O = { exports: {} }, q = { exports: {} }, C = { exports: {} }, _, j;
function ee() {
  if (j) return _;
  j = 1;
  var o = 1e3, e = o * 60, u = e * 60, c = u * 24, f = c * 365.25;
  _ = function(r, n) {
    n = n || {};
    var i = typeof r;
    if (i === "string" && r.length > 0)
      return g(r);
    if (i === "number" && isNaN(r) === !1)
      return n.long ? w(r) : v(r);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(r)
    );
  };
  function g(r) {
    if (r = String(r), !(r.length > 100)) {
      var n = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
        r
      );
      if (n) {
        var i = parseFloat(n[1]), d = (n[2] || "ms").toLowerCase();
        switch (d) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return i * f;
          case "days":
          case "day":
          case "d":
            return i * c;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return i * u;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return i * e;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return i * o;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return i;
          default:
            return;
        }
      }
    }
  }
  function v(r) {
    return r >= c ? Math.round(r / c) + "d" : r >= u ? Math.round(r / u) + "h" : r >= e ? Math.round(r / e) + "m" : r >= o ? Math.round(r / o) + "s" : r + "ms";
  }
  function w(r) {
    return s(r, c, "day") || s(r, u, "hour") || s(r, e, "minute") || s(r, o, "second") || r + " ms";
  }
  function s(r, n, i) {
    if (!(r < n))
      return r < n * 1.5 ? Math.floor(r / n) + " " + i : Math.ceil(r / n) + " " + i + "s";
  }
  return _;
}
var B;
function L() {
  return B || (B = 1, function(o, e) {
    e = o.exports = f.debug = f.default = f, e.coerce = s, e.disable = v, e.enable = g, e.enabled = w, e.humanize = ee(), e.names = [], e.skips = [], e.formatters = {};
    var u;
    function c(r) {
      var n = 0, i;
      for (i in r)
        n = (n << 5) - n + r.charCodeAt(i), n |= 0;
      return e.colors[Math.abs(n) % e.colors.length];
    }
    function f(r) {
      function n() {
        if (n.enabled) {
          var i = n, d = +/* @__PURE__ */ new Date(), a = d - (u || d);
          i.diff = a, i.prev = u, i.curr = d, u = d;
          for (var t = new Array(arguments.length), p = 0; p < t.length; p++)
            t[p] = arguments[p];
          t[0] = e.coerce(t[0]), typeof t[0] != "string" && t.unshift("%O");
          var l = 0;
          t[0] = t[0].replace(/%([a-zA-Z%])/g, function(b, N) {
            if (b === "%%") return b;
            l++;
            var U = e.formatters[N];
            if (typeof U == "function") {
              var z = t[l];
              b = U.call(i, z), t.splice(l, 1), l--;
            }
            return b;
          }), e.formatArgs.call(i, t);
          var y = n.log || e.log || console.log.bind(console);
          y.apply(i, t);
        }
      }
      return n.namespace = r, n.enabled = e.enabled(r), n.useColors = e.useColors(), n.color = c(r), typeof e.init == "function" && e.init(n), n;
    }
    function g(r) {
      e.save(r), e.names = [], e.skips = [];
      for (var n = (typeof r == "string" ? r : "").split(/[\s,]+/), i = n.length, d = 0; d < i; d++)
        n[d] && (r = n[d].replace(/\*/g, ".*?"), r[0] === "-" ? e.skips.push(new RegExp("^" + r.substr(1) + "$")) : e.names.push(new RegExp("^" + r + "$")));
    }
    function v() {
      e.enable("");
    }
    function w(r) {
      var n, i;
      for (n = 0, i = e.skips.length; n < i; n++)
        if (e.skips[n].test(r))
          return !1;
      for (n = 0, i = e.names.length; n < i; n++)
        if (e.names[n].test(r))
          return !0;
      return !1;
    }
    function s(r) {
      return r instanceof Error ? r.stack || r.message : r;
    }
  }(C, C.exports)), C.exports;
}
var F;
function re() {
  return F || (F = 1, function(o, e) {
    e = o.exports = L(), e.log = f, e.formatArgs = c, e.save = g, e.load = v, e.useColors = u, e.storage = typeof chrome < "u" && typeof chrome.storage < "u" ? chrome.storage.local : w(), e.colors = [
      "lightseagreen",
      "forestgreen",
      "goldenrod",
      "dodgerblue",
      "darkorchid",
      "crimson"
    ];
    function u() {
      return typeof window < "u" && window.process && window.process.type === "renderer" ? !0 : typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    e.formatters.j = function(s) {
      try {
        return JSON.stringify(s);
      } catch (r) {
        return "[UnexpectedJSONParseError]: " + r.message;
      }
    };
    function c(s) {
      var r = this.useColors;
      if (s[0] = (r ? "%c" : "") + this.namespace + (r ? " %c" : " ") + s[0] + (r ? "%c " : " ") + "+" + e.humanize(this.diff), !!r) {
        var n = "color: " + this.color;
        s.splice(1, 0, n, "color: inherit");
        var i = 0, d = 0;
        s[0].replace(/%[a-zA-Z%]/g, function(a) {
          a !== "%%" && (i++, a === "%c" && (d = i));
        }), s.splice(d, 0, n);
      }
    }
    function f() {
      return typeof console == "object" && console.log && Function.prototype.apply.call(console.log, console, arguments);
    }
    function g(s) {
      try {
        s == null ? e.storage.removeItem("debug") : e.storage.debug = s;
      } catch {
      }
    }
    function v() {
      var s;
      try {
        s = e.storage.debug;
      } catch {
      }
      return !s && typeof process < "u" && "env" in process && (s = process.env.DEBUG), s;
    }
    e.enable(v());
    function w() {
      try {
        return window.localStorage;
      } catch {
      }
    }
  }(q, q.exports)), q.exports;
}
var S = { exports: {} }, R;
function ne() {
  return R || (R = 1, function(o, e) {
    var u = Y, c = K;
    e = o.exports = L(), e.init = d, e.log = s, e.formatArgs = w, e.save = r, e.load = n, e.useColors = v, e.colors = [6, 2, 3, 4, 5, 1], e.inspectOpts = Object.keys(process.env).filter(function(a) {
      return /^debug_/i.test(a);
    }).reduce(function(a, t) {
      var p = t.substring(6).toLowerCase().replace(/_([a-z])/g, function(y, b) {
        return b.toUpperCase();
      }), l = process.env[t];
      return /^(yes|on|true|enabled)$/i.test(l) ? l = !0 : /^(no|off|false|disabled)$/i.test(l) ? l = !1 : l === "null" ? l = null : l = Number(l), a[p] = l, a;
    }, {});
    var f = parseInt(process.env.DEBUG_FD, 10) || 2;
    f !== 1 && f !== 2 && c.deprecate(function() {
    }, "except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)")();
    var g = f === 1 ? process.stdout : f === 2 ? process.stderr : i(f);
    function v() {
      return "colors" in e.inspectOpts ? !!e.inspectOpts.colors : u.isatty(f);
    }
    e.formatters.o = function(a) {
      return this.inspectOpts.colors = this.useColors, c.inspect(a, this.inspectOpts).split(`
`).map(function(t) {
        return t.trim();
      }).join(" ");
    }, e.formatters.O = function(a) {
      return this.inspectOpts.colors = this.useColors, c.inspect(a, this.inspectOpts);
    };
    function w(a) {
      var t = this.namespace, p = this.useColors;
      if (p) {
        var l = this.color, y = "  \x1B[3" + l + ";1m" + t + " \x1B[0m";
        a[0] = y + a[0].split(`
`).join(`
` + y), a.push("\x1B[3" + l + "m+" + e.humanize(this.diff) + "\x1B[0m");
      } else
        a[0] = (/* @__PURE__ */ new Date()).toUTCString() + " " + t + " " + a[0];
    }
    function s() {
      return g.write(c.format.apply(c, arguments) + `
`);
    }
    function r(a) {
      a == null ? delete process.env.DEBUG : process.env.DEBUG = a;
    }
    function n() {
      return process.env.DEBUG;
    }
    function i(a) {
      var t, p = process.binding("tty_wrap");
      switch (p.guessHandleType(a)) {
        case "TTY":
          t = new u.WriteStream(a), t._type = "tty", t._handle && t._handle.unref && t._handle.unref();
          break;
        case "FILE":
          var l = Q;
          t = new l.SyncWriteStream(a, { autoClose: !1 }), t._type = "fs";
          break;
        case "PIPE":
        case "TCP":
          var y = X;
          t = new y.Socket({
            fd: a,
            readable: !1,
            writable: !0
          }), t.readable = !1, t.read = null, t._type = "pipe", t._handle && t._handle.unref && t._handle.unref();
          break;
        default:
          throw new Error("Implement me. Unknown stream file type!");
      }
      return t.fd = a, t._isStdio = !0, t;
    }
    function d(a) {
      a.inspectOpts = {};
      for (var t = Object.keys(e.inspectOpts), p = 0; p < t.length; p++)
        a.inspectOpts[t[p]] = e.inspectOpts[t[p]];
    }
    e.enable(n());
  }(S, S.exports)), S.exports;
}
typeof process < "u" && process.type === "renderer" ? O.exports = re() : O.exports = ne();
var te = O.exports, k = h, oe = Z.spawn, M = te("electron-squirrel-startup"), E = G.app, T = function(o, e) {
  var u = k.resolve(k.dirname(process.execPath), "..", "Update.exe");
  M("Spawning `%s` with args `%s`", u, o), oe(u, o, {
    detached: !0
  }).on("close", e);
}, ie = function() {
  if (process.platform === "win32") {
    var o = process.argv[1];
    M("processing squirrel command `%s`", o);
    var e = k.basename(process.execPath);
    if (o === "--squirrel-install" || o === "--squirrel-updated")
      return T(["--createShortcut=" + e], E.quit), !0;
    if (o === "--squirrel-uninstall")
      return T(["--removeShortcut=" + e], E.quit), !0;
    if (o === "--squirrel-obsolete")
      return E.quit(), !0;
  }
  return !1;
}, ae = ie();
const se = /* @__PURE__ */ x(ae);
var ue = { main_window: "http://localhost:5173" };
se && m.quit();
m.requestSingleInstanceLock() || m.quit();
m.on("second-instance", (o, e, u, c) => {
  D();
});
const I = "app", $ = h.join(m.getAppPath(), ".vite/main_window/"), ce = h.join(import.meta.dirname, "../../static/");
P.registerSchemesAsPrivileged([
  {
    scheme: I,
    privileges: {
      standard: !0,
      secure: !0,
      allowServiceWorkers: !0,
      supportFetchAPI: !0,
      corsEnabled: !1
    }
  }
]);
m.on("ready", () => {
  P.handle(I, async (o) => {
    const e = h.normalize(decodeURIComponent(new URL(o.url).pathname));
    async function u(f) {
      try {
        if ((await H(f)).isFile()) return f;
      } catch {
      }
    }
    const c = await u(h.join($, e)) ?? await u(h.join($, h.dirname(e), `${h.basename(e) || "index"}.html`)) ?? h.join($, "200.html");
    return await J.fetch(V.pathToFileURL(c).toString());
  });
});
function D() {
  new A({
    icon: h.join(ce, "/icon.png"),
    width: 900,
    height: 700,
    minWidth: 400,
    minHeight: 200,
    // Window Controls Overlay API - https://developer.mozilla.org/en-US/docs/Web/API/Window_Controls_Overlay_API
    // Allows for a custom window header while overlaying native window controls in the corner.
    // https://www.electronjs.org/docs/latest/tutorial/window-customization#window-controls-overlay
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "#374151",
      symbolColor: "#f8fafc",
      height: 40
    },
    backgroundColor: "#374151",
    webPreferences: {
      preload: h.join(import.meta.dirname, "../preload/preload.js")
    }
  }).loadURL(ue.main_window);
}
m.on("ready", D);
m.on("window-all-closed", () => {
  process.platform !== "darwin" && m.quit();
});
m.on("activate", () => {
  A.getAllWindows().length === 0 && D();
});
W.on("toggleDevTools", (o) => o.sender.toggleDevTools());
W.on("setTitleBarColors", (o, e, u) => {
  const c = A.fromWebContents(o.sender);
  c !== null && c.setTitleBarOverlay !== void 0 && c.setTitleBarOverlay({
    color: e,
    symbolColor: u,
    height: 40
  });
});
