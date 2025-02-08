import G, { app as m, protocol as I, net as J, BrowserWindow as A, ipcMain as P } from "electron";
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
var $ = { exports: {} }, q = { exports: {} }, C = { exports: {} }, S, j;
function ee() {
  if (j) return S;
  j = 1;
  var o = 1e3, e = o * 60, u = e * 60, c = u * 24, f = c * 365.25;
  S = function(r, t) {
    t = t || {};
    var i = typeof r;
    if (i === "string" && r.length > 0)
      return g(r);
    if (i === "number" && isNaN(r) === !1)
      return t.long ? w(r) : v(r);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(r)
    );
  };
  function g(r) {
    if (r = String(r), !(r.length > 100)) {
      var t = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
        r
      );
      if (t) {
        var i = parseFloat(t[1]), d = (t[2] || "ms").toLowerCase();
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
    return a(r, c, "day") || a(r, u, "hour") || a(r, e, "minute") || a(r, o, "second") || r + " ms";
  }
  function a(r, t, i) {
    if (!(r < t))
      return r < t * 1.5 ? Math.floor(r / t) + " " + i : Math.ceil(r / t) + " " + i + "s";
  }
  return S;
}
var B;
function W() {
  return B || (B = 1, function(o, e) {
    e = o.exports = f.debug = f.default = f, e.coerce = a, e.disable = v, e.enable = g, e.enabled = w, e.humanize = ee(), e.names = [], e.skips = [], e.formatters = {};
    var u;
    function c(r) {
      var t = 0, i;
      for (i in r)
        t = (t << 5) - t + r.charCodeAt(i), t |= 0;
      return e.colors[Math.abs(t) % e.colors.length];
    }
    function f(r) {
      function t() {
        if (t.enabled) {
          var i = t, d = +/* @__PURE__ */ new Date(), s = d - (u || d);
          i.diff = s, i.prev = u, i.curr = d, u = d;
          for (var n = new Array(arguments.length), p = 0; p < n.length; p++)
            n[p] = arguments[p];
          n[0] = e.coerce(n[0]), typeof n[0] != "string" && n.unshift("%O");
          var l = 0;
          n[0] = n[0].replace(/%([a-zA-Z%])/g, function(b, N) {
            if (b === "%%") return b;
            l++;
            var U = e.formatters[N];
            if (typeof U == "function") {
              var z = n[l];
              b = U.call(i, z), n.splice(l, 1), l--;
            }
            return b;
          }), e.formatArgs.call(i, n);
          var y = t.log || e.log || console.log.bind(console);
          y.apply(i, n);
        }
      }
      return t.namespace = r, t.enabled = e.enabled(r), t.useColors = e.useColors(), t.color = c(r), typeof e.init == "function" && e.init(t), t;
    }
    function g(r) {
      e.save(r), e.names = [], e.skips = [];
      for (var t = (typeof r == "string" ? r : "").split(/[\s,]+/), i = t.length, d = 0; d < i; d++)
        t[d] && (r = t[d].replace(/\*/g, ".*?"), r[0] === "-" ? e.skips.push(new RegExp("^" + r.substr(1) + "$")) : e.names.push(new RegExp("^" + r + "$")));
    }
    function v() {
      e.enable("");
    }
    function w(r) {
      var t, i;
      for (t = 0, i = e.skips.length; t < i; t++)
        if (e.skips[t].test(r))
          return !1;
      for (t = 0, i = e.names.length; t < i; t++)
        if (e.names[t].test(r))
          return !0;
      return !1;
    }
    function a(r) {
      return r instanceof Error ? r.stack || r.message : r;
    }
  }(C, C.exports)), C.exports;
}
var F;
function re() {
  return F || (F = 1, function(o, e) {
    e = o.exports = W(), e.log = f, e.formatArgs = c, e.save = g, e.load = v, e.useColors = u, e.storage = typeof chrome < "u" && typeof chrome.storage < "u" ? chrome.storage.local : w(), e.colors = [
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
        var t = "color: " + this.color;
        a.splice(1, 0, t, "color: inherit");
        var i = 0, d = 0;
        a[0].replace(/%[a-zA-Z%]/g, function(s) {
          s !== "%%" && (i++, s === "%c" && (d = i));
        }), a.splice(d, 0, t);
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
var E = { exports: {} }, R;
function te() {
  return R || (R = 1, function(o, e) {
    var u = Y, c = K;
    e = o.exports = W(), e.init = d, e.log = a, e.formatArgs = w, e.save = r, e.load = t, e.useColors = v, e.colors = [6, 2, 3, 4, 5, 1], e.inspectOpts = Object.keys(process.env).filter(function(s) {
      return /^debug_/i.test(s);
    }).reduce(function(s, n) {
      var p = n.substring(6).toLowerCase().replace(/_([a-z])/g, function(y, b) {
        return b.toUpperCase();
      }), l = process.env[n];
      return /^(yes|on|true|enabled)$/i.test(l) ? l = !0 : /^(no|off|false|disabled)$/i.test(l) ? l = !1 : l === "null" ? l = null : l = Number(l), s[p] = l, s;
    }, {});
    var f = parseInt(process.env.DEBUG_FD, 10) || 2;
    f !== 1 && f !== 2 && c.deprecate(function() {
    }, "except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)")();
    var g = f === 1 ? process.stdout : f === 2 ? process.stderr : i(f);
    function v() {
      return "colors" in e.inspectOpts ? !!e.inspectOpts.colors : u.isatty(f);
    }
    e.formatters.o = function(s) {
      return this.inspectOpts.colors = this.useColors, c.inspect(s, this.inspectOpts).split(`
`).map(function(n) {
        return n.trim();
      }).join(" ");
    }, e.formatters.O = function(s) {
      return this.inspectOpts.colors = this.useColors, c.inspect(s, this.inspectOpts);
    };
    function w(s) {
      var n = this.namespace, p = this.useColors;
      if (p) {
        var l = this.color, y = "  \x1B[3" + l + ";1m" + n + " \x1B[0m";
        s[0] = y + s[0].split(`
`).join(`
` + y), s.push("\x1B[3" + l + "m+" + e.humanize(this.diff) + "\x1B[0m");
      } else
        s[0] = (/* @__PURE__ */ new Date()).toUTCString() + " " + n + " " + s[0];
    }
    function a() {
      return g.write(c.format.apply(c, arguments) + `
`);
    }
    function r(s) {
      s == null ? delete process.env.DEBUG : process.env.DEBUG = s;
    }
    function t() {
      return process.env.DEBUG;
    }
    function i(s) {
      var n, p = process.binding("tty_wrap");
      switch (p.guessHandleType(s)) {
        case "TTY":
          n = new u.WriteStream(s), n._type = "tty", n._handle && n._handle.unref && n._handle.unref();
          break;
        case "FILE":
          var l = Q;
          n = new l.SyncWriteStream(s, { autoClose: !1 }), n._type = "fs";
          break;
        case "PIPE":
        case "TCP":
          var y = X;
          n = new y.Socket({
            fd: s,
            readable: !1,
            writable: !0
          }), n.readable = !1, n.read = null, n._type = "pipe", n._handle && n._handle.unref && n._handle.unref();
          break;
        default:
          throw new Error("Implement me. Unknown stream file type!");
      }
      return n.fd = s, n._isStdio = !0, n;
    }
    function d(s) {
      s.inspectOpts = {};
      for (var n = Object.keys(e.inspectOpts), p = 0; p < n.length; p++)
        s.inspectOpts[n[p]] = e.inspectOpts[n[p]];
    }
    e.enable(t());
  }(E, E.exports)), E.exports;
}
typeof process < "u" && process.type === "renderer" ? $.exports = re() : $.exports = te();
var ne = $.exports, k = h, oe = Z.spawn, L = ne("electron-squirrel-startup"), _ = G.app, T = function(o, e) {
  var u = k.resolve(k.dirname(process.execPath), "..", "Update.exe");
  L("Spawning `%s` with args `%s`", u, o), oe(u, o, {
    detached: !0
  }).on("close", e);
}, ie = function() {
  if (process.platform === "win32") {
    var o = process.argv[1];
    L("processing squirrel command `%s`", o);
    var e = k.basename(process.execPath);
    if (o === "--squirrel-install" || o === "--squirrel-updated")
      return T(["--createShortcut=" + e], _.quit), !0;
    if (o === "--squirrel-uninstall")
      return T(["--removeShortcut=" + e], _.quit), !0;
    if (o === "--squirrel-obsolete")
      return _.quit(), !0;
  }
  return !1;
}, se = ie();
const ae = /* @__PURE__ */ x(se);
var ue = { main_window: "http://localhost:5173" };
process.stdout.on("error", (o) => {
  if (o.code !== "EIO")
    throw o;
});
process.stderr.on("error", (o) => {
  if (o.code !== "EIO")
    throw o;
});
ae && m.quit();
m.requestSingleInstanceLock() || m.quit();
m.on("second-instance", (o, e, u, c) => {
  D();
});
const M = "app", O = h.join(m.getAppPath(), ".vite/main_window/"), ce = h.join(import.meta.dirname, "../../static/");
I.registerSchemesAsPrivileged([
  {
    scheme: M,
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
  I.handle(M, async (o) => {
    const e = h.normalize(
      decodeURIComponent(new URL(o.url).pathname)
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
P.on("toggleDevTools", (o) => o.sender.toggleDevTools());
P.on("setTitleBarColors", (o, e, u) => {
  const c = A.fromWebContents(o.sender);
  c !== null && c.setTitleBarOverlay !== void 0 && c.setTitleBarOverlay({
    color: e,
    symbolColor: u,
    height: 40
  });
});
