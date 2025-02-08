import G, { app as m, protocol as I, net as J, BrowserWindow as D, ipcMain as P } from "electron";
import h from "path";
import V from "url";
import { stat as H } from "node:fs/promises";
import Z from "child_process";
import Y from "tty";
import K from "util";
import Q from "fs";
import X from "net";
function x(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var $ = { exports: {} }, q = { exports: {} }, C = { exports: {} }, _, j;
function ee() {
  if (j) return _;
  j = 1;
  var t = 1e3, e = t * 60, u = e * 60, c = u * 24, f = c * 365.25;
  _ = function(r, n) {
    n = n || {};
    var s = typeof r;
    if (s === "string" && r.length > 0)
      return g(r);
    if (s === "number" && isNaN(r) === !1)
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
        var s = parseFloat(n[1]), d = (n[2] || "ms").toLowerCase();
        switch (d) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return s * f;
          case "days":
          case "day":
          case "d":
            return s * c;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return s * u;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return s * e;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return s * t;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return s;
          default:
            return;
        }
      }
    }
  }
  function v(r) {
    return r >= c ? Math.round(r / c) + "d" : r >= u ? Math.round(r / u) + "h" : r >= e ? Math.round(r / e) + "m" : r >= t ? Math.round(r / t) + "s" : r + "ms";
  }
  function w(r) {
    return a(r, c, "day") || a(r, u, "hour") || a(r, e, "minute") || a(r, t, "second") || r + " ms";
  }
  function a(r, n, s) {
    if (!(r < n))
      return r < n * 1.5 ? Math.floor(r / n) + " " + s : Math.ceil(r / n) + " " + s + "s";
  }
  return _;
}
var F;
function L() {
  return F || (F = 1, function(t, e) {
    e = t.exports = f.debug = f.default = f, e.coerce = a, e.disable = v, e.enable = g, e.enabled = w, e.humanize = ee(), e.names = [], e.skips = [], e.formatters = {};
    var u;
    function c(r) {
      var n = 0, s;
      for (s in r)
        n = (n << 5) - n + r.charCodeAt(s), n |= 0;
      return e.colors[Math.abs(n) % e.colors.length];
    }
    function f(r) {
      function n() {
        if (n.enabled) {
          var s = n, d = +/* @__PURE__ */ new Date(), i = d - (u || d);
          s.diff = i, s.prev = u, s.curr = d, u = d;
          for (var o = new Array(arguments.length), p = 0; p < o.length; p++)
            o[p] = arguments[p];
          o[0] = e.coerce(o[0]), typeof o[0] != "string" && o.unshift("%O");
          var l = 0;
          o[0] = o[0].replace(/%([a-zA-Z%])/g, function(b, N) {
            if (b === "%%") return b;
            l++;
            var U = e.formatters[N];
            if (typeof U == "function") {
              var z = o[l];
              b = U.call(s, z), o.splice(l, 1), l--;
            }
            return b;
          }), e.formatArgs.call(s, o);
          var y = n.log || e.log || console.log.bind(console);
          y.apply(s, o);
        }
      }
      return n.namespace = r, n.enabled = e.enabled(r), n.useColors = e.useColors(), n.color = c(r), typeof e.init == "function" && e.init(n), n;
    }
    function g(r) {
      e.save(r), e.names = [], e.skips = [];
      for (var n = (typeof r == "string" ? r : "").split(/[\s,]+/), s = n.length, d = 0; d < s; d++)
        n[d] && (r = n[d].replace(/\*/g, ".*?"), r[0] === "-" ? e.skips.push(new RegExp("^" + r.substr(1) + "$")) : e.names.push(new RegExp("^" + r + "$")));
    }
    function v() {
      e.enable("");
    }
    function w(r) {
      var n, s;
      for (n = 0, s = e.skips.length; n < s; n++)
        if (e.skips[n].test(r))
          return !1;
      for (n = 0, s = e.names.length; n < s; n++)
        if (e.names[n].test(r))
          return !0;
      return !1;
    }
    function a(r) {
      return r instanceof Error ? r.stack || r.message : r;
    }
  }(C, C.exports)), C.exports;
}
var R;
function re() {
  return R || (R = 1, function(t, e) {
    e = t.exports = L(), e.log = f, e.formatArgs = c, e.save = g, e.load = v, e.useColors = u, e.storage = typeof chrome < "u" && typeof chrome.storage < "u" ? chrome.storage.local : w(), e.colors = [
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
    e.formatters.j = function(a) {
      try {
        return JSON.stringify(a);
      } catch (r) {
        return "[UnexpectedJSONParseError]: " + r.message;
      }
    };
    function c(a) {
      var r = this.useColors;
      if (a[0] = (r ? "%c" : "") + this.namespace + (r ? " %c" : " ") + a[0] + (r ? "%c " : " ") + "+" + e.humanize(this.diff), !!r) {
        var n = "color: " + this.color;
        a.splice(1, 0, n, "color: inherit");
        var s = 0, d = 0;
        a[0].replace(/%[a-zA-Z%]/g, function(i) {
          i !== "%%" && (s++, i === "%c" && (d = s));
        }), a.splice(d, 0, n);
      }
    }
    function f() {
      return typeof console == "object" && console.log && Function.prototype.apply.call(console.log, console, arguments);
    }
    function g(a) {
      try {
        a == null ? e.storage.removeItem("debug") : e.storage.debug = a;
      } catch {
      }
    }
    function v() {
      var a;
      try {
        a = e.storage.debug;
      } catch {
      }
      return !a && typeof process < "u" && "env" in process && (a = process.env.DEBUG), a;
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
var E = { exports: {} }, T;
function ne() {
  return T || (T = 1, function(t, e) {
    var u = Y, c = K;
    e = t.exports = L(), e.init = d, e.log = a, e.formatArgs = w, e.save = r, e.load = n, e.useColors = v, e.colors = [6, 2, 3, 4, 5, 1], e.inspectOpts = Object.keys(process.env).filter(function(i) {
      return /^debug_/i.test(i);
    }).reduce(function(i, o) {
      var p = o.substring(6).toLowerCase().replace(/_([a-z])/g, function(y, b) {
        return b.toUpperCase();
      }), l = process.env[o];
      return /^(yes|on|true|enabled)$/i.test(l) ? l = !0 : /^(no|off|false|disabled)$/i.test(l) ? l = !1 : l === "null" ? l = null : l = Number(l), i[p] = l, i;
    }, {});
    var f = parseInt(process.env.DEBUG_FD, 10) || 2;
    f !== 1 && f !== 2 && c.deprecate(function() {
    }, "except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)")();
    var g = f === 1 ? process.stdout : f === 2 ? process.stderr : s(f);
    function v() {
      return "colors" in e.inspectOpts ? !!e.inspectOpts.colors : u.isatty(f);
    }
    e.formatters.o = function(i) {
      return this.inspectOpts.colors = this.useColors, c.inspect(i, this.inspectOpts).split(`
`).map(function(o) {
        return o.trim();
      }).join(" ");
    }, e.formatters.O = function(i) {
      return this.inspectOpts.colors = this.useColors, c.inspect(i, this.inspectOpts);
    };
    function w(i) {
      var o = this.namespace, p = this.useColors;
      if (p) {
        var l = this.color, y = "  \x1B[3" + l + ";1m" + o + " \x1B[0m";
        i[0] = y + i[0].split(`
`).join(`
` + y), i.push("\x1B[3" + l + "m+" + e.humanize(this.diff) + "\x1B[0m");
      } else
        i[0] = (/* @__PURE__ */ new Date()).toUTCString() + " " + o + " " + i[0];
    }
    function a() {
      return g.write(c.format.apply(c, arguments) + `
`);
    }
    function r(i) {
      i == null ? delete process.env.DEBUG : process.env.DEBUG = i;
    }
    function n() {
      return process.env.DEBUG;
    }
    function s(i) {
      var o, p = process.binding("tty_wrap");
      switch (p.guessHandleType(i)) {
        case "TTY":
          o = new u.WriteStream(i), o._type = "tty", o._handle && o._handle.unref && o._handle.unref();
          break;
        case "FILE":
          var l = Q;
          o = new l.SyncWriteStream(i, { autoClose: !1 }), o._type = "fs";
          break;
        case "PIPE":
        case "TCP":
          var y = X;
          o = new y.Socket({
            fd: i,
            readable: !1,
            writable: !0
          }), o.readable = !1, o.read = null, o._type = "pipe", o._handle && o._handle.unref && o._handle.unref();
          break;
        default:
          throw new Error("Implement me. Unknown stream file type!");
      }
      return o.fd = i, o._isStdio = !0, o;
    }
    function d(i) {
      i.inspectOpts = {};
      for (var o = Object.keys(e.inspectOpts), p = 0; p < o.length; p++)
        i.inspectOpts[o[p]] = e.inspectOpts[o[p]];
    }
    e.enable(n());
  }(E, E.exports)), E.exports;
}
typeof process < "u" && process.type === "renderer" ? $.exports = re() : $.exports = ne();
var te = $.exports, k = h, oe = Z.spawn, M = te("electron-squirrel-startup"), S = G.app, B = function(t, e) {
  var u = k.resolve(k.dirname(process.execPath), "..", "Update.exe");
  M("Spawning `%s` with args `%s`", u, t), oe(u, t, {
    detached: !0
  }).on("close", e);
}, se = function() {
  if (process.platform === "win32") {
    var t = process.argv[1];
    M("processing squirrel command `%s`", t);
    var e = k.basename(process.execPath);
    if (t === "--squirrel-install" || t === "--squirrel-updated")
      return B(["--createShortcut=" + e], S.quit), !0;
    if (t === "--squirrel-uninstall")
      return B(["--removeShortcut=" + e], S.quit), !0;
    if (t === "--squirrel-obsolete")
      return S.quit(), !0;
  }
  return !1;
}, ie = se();
const ae = /* @__PURE__ */ x(ie);
var ue = { main_window: "http://localhost:5173" };
process.stdout.on("error", (t) => {
  if (t.code !== "EIO")
    throw t;
});
process.stderr.on("error", (t) => {
  if (t.code !== "EIO")
    throw t;
});
ae && m.quit();
m.requestSingleInstanceLock() || m.quit();
m.on("second-instance", (t, e, u, c) => {
  A();
});
const W = "app", O = h.join(m.getAppPath(), ".vite/main_window/"), ce = h.join(import.meta.dirname, "../../static/");
I.registerSchemesAsPrivileged([
  {
    scheme: W,
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
  I.handle(W, async (t) => {
    const e = h.normalize(
      decodeURIComponent(new URL(t.url).pathname)
    );
    async function u(f) {
      try {
        if ((await H(f)).isFile()) return f;
      } catch {
      }
    }
    const c = await u(h.join(O, e)) ?? await u(
      h.join(
        O,
        h.dirname(e),
        `${h.basename(e) || "index"}.html`
      )
    ) ?? h.join(O, "200.html");
    return await J.fetch(V.pathToFileURL(c).toString());
  });
});
function A() {
  const t = new D({
    icon: h.join(ce, "/icon.png"),
    x: 2048,
    y: 0,
    width: 1800,
    height: 1e3,
    minWidth: 400,
    minHeight: 200,
    backgroundColor: "#374151",
    show: !1,
    webPreferences: {
      preload: h.join(import.meta.dirname, "../preload/preload.js")
    }
  });
  t.loadURL(ue.main_window), t.on("ready-to-show", () => {
    t.show(), t.webContents.openDevTools();
  });
}
m.on("ready", A);
m.on("window-all-closed", () => {
  process.platform !== "darwin" && m.quit();
});
m.on("activate", () => {
  D.getAllWindows().length === 0 && A();
});
P.on("toggleDevTools", (t) => t.sender.toggleDevTools());
P.on("setTitleBarColors", (t, e, u) => {
  const c = D.fromWebContents(t.sender);
  c !== null && c.setTitleBarOverlay !== void 0 && c.setTitleBarOverlay({
    color: e,
    symbolColor: u,
    height: 40
  });
});
