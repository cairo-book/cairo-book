/*!
  Highlight.js v11.10.0 (git: 1a2ec4c539)
  (c) 2006-2024 Josh Goebel <hello@joshgoebel.com> and other contributors
  License: BSD-3-Clause
 */
  var hljs = (function () {
    "use strict";
    function e(n) {
      return (
        n instanceof Map
          ? (n.clear =
              n.delete =
              n.set =
                () => {
                  throw Error("map is read-only");
                })
          : n instanceof Set &&
            (n.add =
              n.clear =
              n.delete =
                () => {
                  throw Error("set is read-only");
                }),
        Object.freeze(n),
        Object.getOwnPropertyNames(n).forEach((t) => {
          const s = n[t],
            a = typeof s;
          ("object" !== a && "function" !== a) || Object.isFrozen(s) || e(s);
        }),
        n
      );
    }
    class n {
      constructor(e) {
        void 0 === e.data && (e.data = {}),
          (this.data = e.data),
          (this.isMatchIgnored = !1);
      }
      ignoreMatch() {
        this.isMatchIgnored = !0;
      }
    }
    function t(e) {
      return e
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;");
    }
    function s(e, ...n) {
      const t = Object.create(null);
      for (const n in e) t[n] = e[n];
      return (
        n.forEach((e) => {
          for (const n in e) t[n] = e[n];
        }),
        t
      );
    }
    const a = (e) => !!e.scope;
    class i {
      constructor(e, n) {
        (this.buffer = ""), (this.classPrefix = n.classPrefix), e.walk(this);
      }
      addText(e) {
        this.buffer += t(e);
      }
      openNode(e) {
        if (!a(e)) return;
        const n = ((e, { prefix: n }) => {
          if (e.startsWith("language:"))
            return e.replace("language:", "language-");
          if (e.includes(".")) {
            const t = e.split(".");
            return [
              `${n}${t.shift()}`,
              ...t.map((e, n) => `${e}${"_".repeat(n + 1)}`),
            ].join(" ");
          }
          return `${n}${e}`;
        })(e.scope, { prefix: this.classPrefix });
        this.span(n);
      }
      closeNode(e) {
        a(e) && (this.buffer += "</span>");
      }
      value() {
        return this.buffer;
      }
      span(e) {
        this.buffer += `<span class="${e}">`;
      }
    }
    const r = (e = {}) => {
      const n = { children: [] };
      return Object.assign(n, e), n;
    };
    class o {
      constructor() {
        (this.rootNode = r()), (this.stack = [this.rootNode]);
      }
      get top() {
        return this.stack[this.stack.length - 1];
      }
      get root() {
        return this.rootNode;
      }
      add(e) {
        this.top.children.push(e);
      }
      openNode(e) {
        const n = r({ scope: e });
        this.add(n), this.stack.push(n);
      }
      closeNode() {
        if (this.stack.length > 1) return this.stack.pop();
      }
      closeAllNodes() {
        for (; this.closeNode(); );
      }
      toJSON() {
        return JSON.stringify(this.rootNode, null, 4);
      }
      walk(e) {
        return this.constructor._walk(e, this.rootNode);
      }
      static _walk(e, n) {
        return (
          "string" == typeof n
            ? e.addText(n)
            : n.children &&
              (e.openNode(n),
              n.children.forEach((n) => this._walk(e, n)),
              e.closeNode(n)),
          e
        );
      }
      static _collapse(e) {
        "string" != typeof e &&
          e.children &&
          (e.children.every((e) => "string" == typeof e)
            ? (e.children = [e.children.join("")])
            : e.children.forEach((e) => {
                o._collapse(e);
              }));
      }
    }
    class c extends o {
      constructor(e) {
        super(), (this.options = e);
      }
      addText(e) {
        "" !== e && this.add(e);
      }
      startScope(e) {
        this.openNode(e);
      }
      endScope() {
        this.closeNode();
      }
      __addSublanguage(e, n) {
        const t = e.root;
        n && (t.scope = "language:" + n), this.add(t);
      }
      toHTML() {
        return new i(this, this.options).value();
      }
      finalize() {
        return this.closeAllNodes(), !0;
      }
    }
    function l(e) {
      return e ? ("string" == typeof e ? e : e.source) : null;
    }
    function d(e) {
      return u("(?=", e, ")");
    }
    function p(e) {
      return u("(?:", e, ")*");
    }
    function m(e) {
      return u("(?:", e, ")?");
    }
    function u(...e) {
      return e.map((e) => l(e)).join("");
    }
    function b(...e) {
      const n = ((e) => {
        const n = e[e.length - 1];
        return "object" == typeof n && n.constructor === Object
          ? (e.splice(e.length - 1, 1), n)
          : {};
      })(e);
      return "(" + (n.capture ? "" : "?:") + e.map((e) => l(e)).join("|") + ")";
    }
    function g(e) {
      return RegExp(e.toString() + "|").exec("").length - 1;
    }
    const v = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
    function _(e, { joinWith: n }) {
      let t = 0;
      return e
        .map((e) => {
          t += 1;
          const n = t;
          let s = l(e),
            a = "";
          for (; s.length > 0; ) {
            const e = v.exec(s);
            if (!e) {
              a += s;
              break;
            }
            (a += s.substring(0, e.index)),
              (s = s.substring(e.index + e[0].length)),
              "\\" === e[0][0] && e[1]
                ? (a += "\\" + (Number(e[1]) + n))
                : ((a += e[0]), "(" === e[0] && t++);
          }
          return a;
        })
        .map((e) => `(${e})`)
        .join(n);
    }
    const f = "[a-zA-Z]\\w*",
      h = "[a-zA-Z_]\\w*",
      E = "\\b\\d+(\\.\\d+)?",
      w =
        "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",
      y = "\\b(0b[01]+)",
      N = {
        begin: "\\\\[\\s\\S]",
        relevance: 0,
      },
      x = {
        scope: "string",
        begin: "'",
        end: "'",
        illegal: "\\n",
        contains: [N],
      },
      k = {
        scope: "string",
        begin: '"',
        end: '"',
        illegal: "\\n",
        contains: [N],
      },
      O = (e, n, t = {}) => {
        const a = s({ scope: "comment", begin: e, end: n, contains: [] }, t);
        a.contains.push({
          scope: "doctag",
          begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
          end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
          excludeBegin: !0,
          relevance: 0,
        });
        const i = b(
          "I",
          "a",
          "is",
          "so",
          "us",
          "to",
          "at",
          "if",
          "in",
          "it",
          "on",
          /[A-Za-z]+['](d|ve|re|ll|t|s|n)/,
          /[A-Za-z]+[-][a-z]+/,
          /[A-Za-z][a-z]{2,}/
        );
        return (
          a.contains.push({
            begin: u(/[ ]+/, "(", i, /[.]?[:]?([.][ ]|[ ])/, "){3}"),
          }),
          a
        );
      },
      M = O("//", "$"),
      A = O("/\\*", "\\*/"),
      S = O("#", "$");
    var C = Object.freeze({
      __proto__: null,
      APOS_STRING_MODE: x,
      BACKSLASH_ESCAPE: N,
      BINARY_NUMBER_MODE: {
        scope: "number",
        begin: y,
        relevance: 0,
      },
      BINARY_NUMBER_RE: y,
      COMMENT: O,
      C_BLOCK_COMMENT_MODE: A,
      C_LINE_COMMENT_MODE: M,
      C_NUMBER_MODE: { scope: "number", begin: w, relevance: 0 },
      C_NUMBER_RE: w,
      END_SAME_AS_BEGIN: (e) =>
        Object.assign(e, {
          "on:begin": (e, n) => {
            n.data._beginMatch = e[1];
          },
          "on:end": (e, n) => {
            n.data._beginMatch !== e[1] && n.ignoreMatch();
          },
        }),
      HASH_COMMENT_MODE: S,
      IDENT_RE: f,
      MATCH_NOTHING_RE: /\b\B/,
      METHOD_GUARD: { begin: "\\.\\s*" + h, relevance: 0 },
      NUMBER_MODE: { scope: "number", begin: E, relevance: 0 },
      NUMBER_RE: E,
      PHRASAL_WORDS_MODE: {
        begin:
          /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/,
      },
      QUOTE_STRING_MODE: k,
      REGEXP_MODE: {
        scope: "regexp",
        begin: /\/(?=[^/\n]*\/)/,
        end: /\/[gimuy]*/,
        contains: [N, { begin: /\[/, end: /\]/, relevance: 0, contains: [N] }],
      },
      RE_STARTERS_RE:
        "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",
      SHEBANG: (e = {}) => {
        const n = /^#![ ]*\//;
        return (
          e.binary && (e.begin = u(n, /.*\b/, e.binary, /\b.*/)),
          s(
            {
              scope: "meta",
              begin: n,
              end: /$/,
              relevance: 0,
              "on:begin": (e, n) => {
                0 !== e.index && n.ignoreMatch();
              },
            },
            e
          )
        );
      },
      TITLE_MODE: { scope: "title", begin: f, relevance: 0 },
      UNDERSCORE_IDENT_RE: h,
      UNDERSCORE_TITLE_MODE: { scope: "title", begin: h, relevance: 0 },
    });
    function T(e, n) {
      "." === e.input[e.index - 1] && n.ignoreMatch();
    }
    function q(e, n) {
      void 0 !== e.className && ((e.scope = e.className), delete e.className);
    }
    function D(e, n) {
      n &&
        e.beginKeywords &&
        ((e.begin =
          "\\b(" + e.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)"),
        (e.__beforeBegin = T),
        (e.keywords = e.keywords || e.beginKeywords),
        delete e.beginKeywords,
        void 0 === e.relevance && (e.relevance = 0));
    }
    function R(e, n) {
      Array.isArray(e.illegal) && (e.illegal = b(...e.illegal));
    }
    function I(e, n) {
      if (e.match) {
        if (e.begin || e.end)
          throw Error("begin & end are not supported with match");
        (e.begin = e.match), delete e.match;
      }
    }
    function L(e, n) {
      void 0 === e.relevance && (e.relevance = 1);
    }
    const B = (e, n) => {
        if (!e.beforeMatch) return;
        if (e.starts) throw Error("beforeMatch cannot be used with starts");
        const t = Object.assign({}, e);
        Object.keys(e).forEach((n) => {
          delete e[n];
        }),
          (e.keywords = t.keywords),
          (e.begin = u(t.beforeMatch, d(t.begin))),
          (e.starts = {
            relevance: 0,
            contains: [Object.assign(t, { endsParent: !0 })],
          }),
          (e.relevance = 0),
          delete t.beforeMatch;
      },
      z = [
        "of",
        "and",
        "for",
        "in",
        "not",
        "or",
        "if",
        "then",
        "parent",
        "list",
        "value",
      ],
      F = "keyword";
    function $(e, n, t = F) {
      const s = Object.create(null);
      return (
        "string" == typeof e
          ? a(t, e.split(" "))
          : Array.isArray(e)
          ? a(t, e)
          : Object.keys(e).forEach((t) => {
              Object.assign(s, $(e[t], n, t));
            }),
        s
      );
      function a(e, t) {
        n && (t = t.map((e) => e.toLowerCase())),
          t.forEach((n) => {
            const t = n.split("|");
            s[t[0]] = [e, U(t[0], t[1])];
          });
      }
    }
    function U(e, n) {
      return n ? Number(n) : ((e) => z.includes(e.toLowerCase()))(e) ? 0 : 1;
    }
    const P = {},
      j = (e) => {
        console.error(e);
      },
      K = (e, ...n) => {
        console.log("WARN: " + e, ...n);
      },
      H = (e, n) => {
        P[`${e}/${n}`] ||
          (console.log(`Deprecated as of ${e}. ${n}`), (P[`${e}/${n}`] = !0));
      },
      Z = Error();
    function G(e, n, { key: t }) {
      let s = 0;
      const a = e[t],
        i = {},
        r = {};
      for (let e = 1; e <= n.length; e++)
        (r[e + s] = a[e]), (i[e + s] = !0), (s += g(n[e - 1]));
      (e[t] = r), (e[t]._emit = i), (e[t]._multi = !0);
    }
    function W(e) {
      ((e) => {
        e.scope &&
          "object" == typeof e.scope &&
          null !== e.scope &&
          ((e.beginScope = e.scope), delete e.scope);
      })(e),
        "string" == typeof e.beginScope &&
          (e.beginScope = {
            _wrap: e.beginScope,
          }),
        "string" == typeof e.endScope && (e.endScope = { _wrap: e.endScope }),
        ((e) => {
          if (Array.isArray(e.begin)) {
            if (e.skip || e.excludeBegin || e.returnBegin)
              throw (
                (j(
                  "skip, excludeBegin, returnBegin not compatible with beginScope: {}"
                ),
                Z)
              );
            if ("object" != typeof e.beginScope || null === e.beginScope)
              throw (j("beginScope must be object"), Z);
            G(e, e.begin, { key: "beginScope" }),
              (e.begin = _(e.begin, { joinWith: "" }));
          }
        })(e),
        ((e) => {
          if (Array.isArray(e.end)) {
            if (e.skip || e.excludeEnd || e.returnEnd)
              throw (
                (j(
                  "skip, excludeEnd, returnEnd not compatible with endScope: {}"
                ),
                Z)
              );
            if ("object" != typeof e.endScope || null === e.endScope)
              throw (j("endScope must be object"), Z);
            G(e, e.end, { key: "endScope" }),
              (e.end = _(e.end, { joinWith: "" }));
          }
        })(e);
    }
    function Q(e) {
      function n(n, t) {
        return RegExp(
          l(n),
          "m" +
            (e.case_insensitive ? "i" : "") +
            (e.unicodeRegex ? "u" : "") +
            (t ? "g" : "")
        );
      }
      class t {
        constructor() {
          (this.matchIndexes = {}),
            (this.regexes = []),
            (this.matchAt = 1),
            (this.position = 0);
        }
        addRule(e, n) {
          (n.position = this.position++),
            (this.matchIndexes[this.matchAt] = n),
            this.regexes.push([n, e]),
            (this.matchAt += g(e) + 1);
        }
        compile() {
          0 === this.regexes.length && (this.exec = () => null);
          const e = this.regexes.map((e) => e[1]);
          (this.matcherRe = n(_(e, { joinWith: "|" }), !0)), (this.lastIndex = 0);
        }
        exec(e) {
          this.matcherRe.lastIndex = this.lastIndex;
          const n = this.matcherRe.exec(e);
          if (!n) return null;
          const t = n.findIndex((e, n) => n > 0 && void 0 !== e),
            s = this.matchIndexes[t];
          return n.splice(0, t), Object.assign(n, s);
        }
      }
      class a {
        constructor() {
          (this.rules = []),
            (this.multiRegexes = []),
            (this.count = 0),
            (this.lastIndex = 0),
            (this.regexIndex = 0);
        }
        getMatcher(e) {
          if (this.multiRegexes[e]) return this.multiRegexes[e];
          const n = new t();
          return (
            this.rules.slice(e).forEach(([e, t]) => n.addRule(e, t)),
            n.compile(),
            (this.multiRegexes[e] = n),
            n
          );
        }
        resumingScanAtSamePosition() {
          return 0 !== this.regexIndex;
        }
        considerAll() {
          this.regexIndex = 0;
        }
        addRule(e, n) {
          this.rules.push([e, n]), "begin" === n.type && this.count++;
        }
        exec(e) {
          const n = this.getMatcher(this.regexIndex);
          n.lastIndex = this.lastIndex;
          let t = n.exec(e);
          if (this.resumingScanAtSamePosition())
            if (t && t.index === this.lastIndex);
            else {
              const n = this.getMatcher(0);
              (n.lastIndex = this.lastIndex + 1), (t = n.exec(e));
            }
          return (
            t &&
              ((this.regexIndex += t.position + 1),
              this.regexIndex === this.count && this.considerAll()),
            t
          );
        }
      }
      if (
        (e.compilerExtensions || (e.compilerExtensions = []),
        e.contains && e.contains.includes("self"))
      )
        throw Error(
          "ERR: contains `self` is not supported at the top-level of a language.  See documentation."
        );
      return (
        (e.classNameAliases = s(e.classNameAliases || {})),
        (function t(i, r) {
          const o = i;
          if (i.isCompiled) return o;
          [q, I, W, B].forEach((e) => e(i, r)),
            e.compilerExtensions.forEach((e) => e(i, r)),
            (i.__beforeBegin = null),
            [D, R, L].forEach((e) => e(i, r)),
            (i.isCompiled = !0);
          let c = null;
          return (
            "object" == typeof i.keywords &&
              i.keywords.$pattern &&
              ((i.keywords = Object.assign({}, i.keywords)),
              (c = i.keywords.$pattern),
              delete i.keywords.$pattern),
            (c = c || /\w+/),
            i.keywords && (i.keywords = $(i.keywords, e.case_insensitive)),
            (o.keywordPatternRe = n(c, !0)),
            r &&
              (i.begin || (i.begin = /\B|\b/),
              (o.beginRe = n(o.begin)),
              i.end || i.endsWithParent || (i.end = /\B|\b/),
              i.end && (o.endRe = n(o.end)),
              (o.terminatorEnd = l(o.end) || ""),
              i.endsWithParent &&
                r.terminatorEnd &&
                (o.terminatorEnd += (i.end ? "|" : "") + r.terminatorEnd)),
            i.illegal && (o.illegalRe = n(i.illegal)),
            i.contains || (i.contains = []),
            (i.contains = [].concat(
              ...i.contains.map((e) =>
                ((e) => (
                  e.variants &&
                    !e.cachedVariants &&
                    (e.cachedVariants = e.variants.map((n) =>
                      s(
                        e,
                        {
                          variants: null,
                        },
                        n
                      )
                    )),
                  e.cachedVariants
                    ? e.cachedVariants
                    : X(e)
                    ? s(e, {
                        starts: e.starts ? s(e.starts) : null,
                      })
                    : Object.isFrozen(e)
                    ? s(e)
                    : e
                ))("self" === e ? i : e)
              )
            )),
            i.contains.forEach((e) => {
              t(e, o);
            }),
            i.starts && t(i.starts, r),
            (o.matcher = ((e) => {
              const n = new a();
              return (
                e.contains.forEach((e) =>
                  n.addRule(e.begin, { rule: e, type: "begin" })
                ),
                e.terminatorEnd && n.addRule(e.terminatorEnd, { type: "end" }),
                e.illegal && n.addRule(e.illegal, { type: "illegal" }),
                n
              );
            })(o)),
            o
          );
        })(e)
      );
    }
    function X(e) {
      return !!e && (e.endsWithParent || X(e.starts));
    }
    class V extends Error {
      constructor(e, n) {
        super(e), (this.name = "HTMLInjectionError"), (this.html = n);
      }
    }
    const J = t,
      Y = s,
      ee = Symbol("nomatch"),
      ne = (t) => {
        const s = Object.create(null),
          a = Object.create(null),
          i = [];
        let r = !0;
        const o =
            "Could not find the language '{}', did you forget to load/include a language module?",
          l = {
            disableAutodetect: !0,
            name: "Plain text",
            contains: [],
          };
        let g = {
          ignoreUnescapedHTML: !1,
          throwUnescapedHTML: !1,
          noHighlightRe: /^(no-?highlight)$/i,
          languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
          classPrefix: "hljs-",
          cssSelector: "pre code",
          languages: null,
          __emitter: c,
        };
        function v(e) {
          return g.noHighlightRe.test(e);
        }
        function _(e, n, t) {
          let s = "",
            a = "";
          "object" == typeof n
            ? ((s = e), (t = n.ignoreIllegals), (a = n.language))
            : (H("10.7.0", "highlight(lang, code, ...args) has been deprecated."),
              H(
                "10.7.0",
                "Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277"
              ),
              (a = e),
              (s = n)),
            void 0 === t && (t = !0);
          const i = { code: s, language: a };
          O("before:highlight", i);
          const r = i.result ? i.result : f(i.language, i.code, t);
          return (r.code = i.code), O("after:highlight", r), r;
        }
        function f(e, t, a, i) {
          const c = Object.create(null);
          function l() {
            if (!O.keywords) return void A.addText(S);
            let e = 0;
            O.keywordPatternRe.lastIndex = 0;
            let n = O.keywordPatternRe.exec(S),
              t = "";
            for (; n; ) {
              t += S.substring(e, n.index);
              const a = y.case_insensitive ? n[0].toLowerCase() : n[0],
                i = ((s = a), O.keywords[s]);
              if (i) {
                const [e, s] = i;
                if (
                  (A.addText(t),
                  (t = ""),
                  (c[a] = (c[a] || 0) + 1),
                  c[a] <= 7 && (C += s),
                  e.startsWith("_"))
                )
                  t += n[0];
                else {
                  const t = y.classNameAliases[e] || e;
                  p(n[0], t);
                }
              } else t += n[0];
              (e = O.keywordPatternRe.lastIndex),
                (n = O.keywordPatternRe.exec(S));
            }
            var s;
            (t += S.substring(e)), A.addText(t);
          }
          function d() {
            null != O.subLanguage
              ? (() => {
                  if ("" === S) return;
                  let e = null;
                  if ("string" == typeof O.subLanguage) {
                    if (!s[O.subLanguage]) return void A.addText(S);
                    (e = f(O.subLanguage, S, !0, M[O.subLanguage])),
                      (M[O.subLanguage] = e._top);
                  } else e = h(S, O.subLanguage.length ? O.subLanguage : null);
                  O.relevance > 0 && (C += e.relevance),
                    A.__addSublanguage(e._emitter, e.language);
                })()
              : l(),
              (S = "");
          }
          function p(e, n) {
            "" !== e && (A.startScope(n), A.addText(e), A.endScope());
          }
          function m(e, n) {
            let t = 1;
            const s = n.length - 1;
            for (; t <= s; ) {
              if (!e._emit[t]) {
                t++;
                continue;
              }
              const s = y.classNameAliases[e[t]] || e[t],
                a = n[t];
              s ? p(a, s) : ((S = a), l(), (S = "")), t++;
            }
          }
          function u(e, n) {
            return (
              e.scope &&
                "string" == typeof e.scope &&
                A.openNode(y.classNameAliases[e.scope] || e.scope),
              e.beginScope &&
                (e.beginScope._wrap
                  ? (p(
                      S,
                      y.classNameAliases[e.beginScope._wrap] || e.beginScope._wrap
                    ),
                    (S = ""))
                  : e.beginScope._multi && (m(e.beginScope, n), (S = ""))),
              (O = Object.create(e, {
                parent: {
                  value: O,
                },
              })),
              O
            );
          }
          function b(e, t, s) {
            let a = ((e, n) => {
              const t = e && e.exec(n);
              return t && 0 === t.index;
            })(e.endRe, s);
            if (a) {
              if (e["on:end"]) {
                const s = new n(e);
                e["on:end"](t, s), s.isMatchIgnored && (a = !1);
              }
              if (a) {
                for (; e.endsParent && e.parent; ) e = e.parent;
                return e;
              }
            }
            if (e.endsWithParent) return b(e.parent, t, s);
          }
          function v(e) {
            return 0 === O.matcher.regexIndex ? ((S += e[0]), 1) : ((D = !0), 0);
          }
          function _(e) {
            const n = e[0],
              s = t.substring(e.index),
              a = b(O, e, s);
            if (!a) return ee;
            const i = O;
            O.endScope && O.endScope._wrap
              ? (d(), p(n, O.endScope._wrap))
              : O.endScope && O.endScope._multi
              ? (d(), m(O.endScope, e))
              : i.skip
              ? (S += n)
              : (i.returnEnd || i.excludeEnd || (S += n),
                d(),
                i.excludeEnd && (S = n));
            do {
              O.scope && A.closeNode(),
                O.skip || O.subLanguage || (C += O.relevance),
                (O = O.parent);
            } while (O !== a.parent);
            return a.starts && u(a.starts, e), i.returnEnd ? 0 : n.length;
          }
          let E = {};
          function w(s, i) {
            const o = i && i[0];
            if (((S += s), null == o)) return d(), 0;
            if (
              "begin" === E.type &&
              "end" === i.type &&
              E.index === i.index &&
              "" === o
            ) {
              if (((S += t.slice(i.index, i.index + 1)), !r)) {
                const n = Error(`0 width match regex (${e})`);
                throw ((n.languageName = e), (n.badRule = E.rule), n);
              }
              return 1;
            }
            if (((E = i), "begin" === i.type))
              return ((e) => {
                const t = e[0],
                  s = e.rule,
                  a = new n(s),
                  i = [s.__beforeBegin, s["on:begin"]];
                for (const n of i)
                  if (n && (n(e, a), a.isMatchIgnored)) return v(t);
                return (
                  s.skip
                    ? (S += t)
                    : (s.excludeBegin && (S += t),
                      d(),
                      s.returnBegin || s.excludeBegin || (S = t)),
                  u(s, e),
                  s.returnBegin ? 0 : t.length
                );
              })(i);
            if ("illegal" === i.type && !a) {
              const e = Error(
                'Illegal lexeme "' +
                  o +
                  '" for mode "' +
                  (O.scope || "<unnamed>") +
                  '"'
              );
              throw ((e.mode = O), e);
            }
            if ("end" === i.type) {
              const e = _(i);
              if (e !== ee) return e;
            }
            if ("illegal" === i.type && "" === o) return 1;
            if (q > 1e5 && q > 3 * i.index)
              throw Error(
                "potential infinite loop, way more iterations than matches"
              );
            return (S += o), o.length;
          }
          const y = N(e);
          if (!y)
            throw (j(o.replace("{}", e)), Error('Unknown language: "' + e + '"'));
          const x = Q(y);
          let k = "",
            O = i || x;
          const M = {},
            A = new g.__emitter(g);
          (() => {
            const e = [];
            for (let n = O; n !== y; n = n.parent) n.scope && e.unshift(n.scope);
            e.forEach((e) => A.openNode(e));
          })();
          let S = "",
            C = 0,
            T = 0,
            q = 0,
            D = !1;
          try {
            if (y.__emitTokens) y.__emitTokens(t, A);
            else {
              for (O.matcher.considerAll(); ; ) {
                q++,
                  D ? (D = !1) : O.matcher.considerAll(),
                  (O.matcher.lastIndex = T);
                const e = O.matcher.exec(t);
                if (!e) break;
                const n = w(t.substring(T, e.index), e);
                T = e.index + n;
              }
              w(t.substring(T));
            }
            return (
              A.finalize(),
              (k = A.toHTML()),
              {
                language: e,
                value: k,
                relevance: C,
                illegal: !1,
                _emitter: A,
                _top: O,
              }
            );
          } catch (n) {
            if (n.message && n.message.includes("Illegal"))
              return {
                language: e,
                value: J(t),
                illegal: !0,
                relevance: 0,
                _illegalBy: {
                  message: n.message,
                  index: T,
                  context: t.slice(T - 100, T + 100),
                  mode: n.mode,
                  resultSoFar: k,
                },
                _emitter: A,
              };
            if (r)
              return {
                language: e,
                value: J(t),
                illegal: !1,
                relevance: 0,
                errorRaised: n,
                _emitter: A,
                _top: O,
              };
            throw n;
          }
        }
        function h(e, n) {
          n = n || g.languages || Object.keys(s);
          const t = ((e) => {
              const n = {
                value: J(e),
                illegal: !1,
                relevance: 0,
                _top: l,
                _emitter: new g.__emitter(g),
              };
              return n._emitter.addText(e), n;
            })(e),
            a = n
              .filter(N)
              .filter(k)
              .map((n) => f(n, e, !1));
          a.unshift(t);
          const i = a.sort((e, n) => {
              if (e.relevance !== n.relevance) return n.relevance - e.relevance;
              if (e.language && n.language) {
                if (N(e.language).supersetOf === n.language) return 1;
                if (N(n.language).supersetOf === e.language) return -1;
              }
              return 0;
            }),
            [r, o] = i,
            c = r;
          return (c.secondBest = o), c;
        }
        function E(e) {
          let n = null;
          const t = ((e) => {
            let n = e.className + " ";
            n += e.parentNode ? e.parentNode.className : "";
            const t = g.languageDetectRe.exec(n);
            if (t) {
              const n = N(t[1]);
              return (
                n ||
                  (K(o.replace("{}", t[1])),
                  K("Falling back to no-highlight mode for this block.", e)),
                n ? t[1] : "no-highlight"
              );
            }
            return n.split(/\s+/).find((e) => v(e) || N(e));
          })(e);
          if (v(t)) return;
          if (
            (O("before:highlightElement", { el: e, language: t }),
            e.dataset.highlighted)
          )
            return void console.log(
              "Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",
              e
            );
          if (
            e.children.length > 0 &&
            (g.ignoreUnescapedHTML ||
              (console.warn(
                "One of your code blocks includes unescaped HTML. This is a potentially serious security risk."
              ),
              console.warn(
                "https://github.com/highlightjs/highlight.js/wiki/security"
              ),
              console.warn("The element with unescaped HTML:"),
              console.warn(e)),
            g.throwUnescapedHTML)
          )
            throw new V(
              "One of your code blocks includes unescaped HTML.",
              e.innerHTML
            );
          n = e;
          const s = n.textContent,
            i = t ? _(s, { language: t, ignoreIllegals: !0 }) : h(s);
          (e.innerHTML = i.value),
            (e.dataset.highlighted = "yes"),
            ((e, n, t) => {
              const s = (n && a[n]) || t;
              e.classList.add("hljs"), e.classList.add("language-" + s);
            })(e, t, i.language),
            (e.result = {
              language: i.language,
              re: i.relevance,
              relevance: i.relevance,
            }),
            i.secondBest &&
              (e.secondBest = {
                language: i.secondBest.language,
                relevance: i.secondBest.relevance,
              }),
            O("after:highlightElement", { el: e, result: i, text: s });
        }
        let w = !1;
        function y() {
          "loading" !== document.readyState
            ? document.querySelectorAll(g.cssSelector).forEach(E)
            : (w = !0);
        }
        function N(e) {
          return (e = (e || "").toLowerCase()), s[e] || s[a[e]];
        }
        function x(e, { languageName: n }) {
          "string" == typeof e && (e = [e]),
            e.forEach((e) => {
              a[e.toLowerCase()] = n;
            });
        }
        function k(e) {
          const n = N(e);
          return n && !n.disableAutodetect;
        }
        function O(e, n) {
          const t = e;
          i.forEach((e) => {
            e[t] && e[t](n);
          });
        }
        "undefined" != typeof window &&
          window.addEventListener &&
          window.addEventListener(
            "DOMContentLoaded",
            () => {
              w && y();
            },
            !1
          ),
          Object.assign(t, {
            highlight: _,
            highlightAuto: h,
            highlightAll: y,
            highlightElement: E,
            highlightBlock: (e) => (
              H("10.7.0", "highlightBlock will be removed entirely in v12.0"),
              H("10.7.0", "Please use highlightElement now."),
              E(e)
            ),
            configure: (e) => {
              g = Y(g, e);
            },
            initHighlighting: () => {
              y(),
                H(
                  "10.6.0",
                  "initHighlighting() deprecated.  Use highlightAll() now."
                );
            },
            initHighlightingOnLoad: () => {
              y(),
                H(
                  "10.6.0",
                  "initHighlightingOnLoad() deprecated.  Use highlightAll() now."
                );
            },
            registerLanguage: (e, n) => {
              let a = null;
              try {
                a = n(t);
              } catch (n) {
                if (
                  (j(
                    "Language definition for '{}' could not be registered.".replace(
                      "{}",
                      e
                    )
                  ),
                  !r)
                )
                  throw n;
                j(n), (a = l);
              }
              a.name || (a.name = e),
                (s[e] = a),
                (a.rawDefinition = n.bind(null, t)),
                a.aliases &&
                  x(a.aliases, {
                    languageName: e,
                  });
            },
            unregisterLanguage: (e) => {
              delete s[e];
              for (const n of Object.keys(a)) a[n] === e && delete a[n];
            },
            listLanguages: () => Object.keys(s),
            getLanguage: N,
            registerAliases: x,
            autoDetection: k,
            inherit: Y,
            addPlugin: (e) => {
              ((e) => {
                e["before:highlightBlock"] &&
                  !e["before:highlightElement"] &&
                  (e["before:highlightElement"] = (n) => {
                    e["before:highlightBlock"](Object.assign({ block: n.el }, n));
                  }),
                  e["after:highlightBlock"] &&
                    !e["after:highlightElement"] &&
                    (e["after:highlightElement"] = (n) => {
                      e["after:highlightBlock"](
                        Object.assign({ block: n.el }, n)
                      );
                    });
              })(e),
                i.push(e);
            },
            removePlugin: (e) => {
              const n = i.indexOf(e);
              -1 !== n && i.splice(n, 1);
            },
          }),
          (t.debugMode = () => {
            r = !1;
          }),
          (t.safeMode = () => {
            r = !0;
          }),
          (t.versionString = "11.10.0"),
          (t.regex = {
            concat: u,
            lookahead: d,
            either: b,
            optional: m,
            anyNumberOfTimes: p,
          });
        for (const n in C) "object" == typeof C[n] && e(C[n]);
        return Object.assign(t, C), t;
      },
      te = ne({});
    te.newInstance = () => ne({});
    const se = (e) => ({
        IMPORTANT: { scope: "meta", begin: "!important" },
        BLOCK_COMMENT: e.C_BLOCK_COMMENT_MODE,
        HEXCOLOR: {
          scope: "number",
          begin: /#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/,
        },
        FUNCTION_DISPATCH: { className: "built_in", begin: /[\w-]+(?=\()/ },
        ATTRIBUTE_SELECTOR_MODE: {
          scope: "selector-attr",
          begin: /\[/,
          end: /\]/,
          illegal: "$",
          contains: [e.APOS_STRING_MODE, e.QUOTE_STRING_MODE],
        },
        CSS_NUMBER_MODE: {
          scope: "number",
          begin:
            e.NUMBER_RE +
            "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
          relevance: 0,
        },
        CSS_VARIABLE: { className: "attr", begin: /--[A-Za-z_][A-Za-z0-9_-]*/ },
      }),
      ae = [
        "a",
        "abbr",
        "address",
        "article",
        "aside",
        "audio",
        "b",
        "blockquote",
        "body",
        "button",
        "canvas",
        "caption",
        "cite",
        "code",
        "dd",
        "del",
        "details",
        "dfn",
        "div",
        "dl",
        "dt",
        "em",
        "fieldset",
        "figcaption",
        "figure",
        "footer",
        "form",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "header",
        "hgroup",
        "html",
        "i",
        "iframe",
        "img",
        "input",
        "ins",
        "kbd",
        "label",
        "legend",
        "li",
        "main",
        "mark",
        "menu",
        "nav",
        "object",
        "ol",
        "optgroup",
        "option",
        "p",
        "picture",
        "q",
        "quote",
        "samp",
        "section",
        "select",
        "source",
        "span",
        "strong",
        "summary",
        "sup",
        "table",
        "tbody",
        "td",
        "textarea",
        "tfoot",
        "th",
        "thead",
        "time",
        "tr",
        "ul",
        "var",
        "video",
        "defs",
        "g",
        "marker",
        "mask",
        "pattern",
        "svg",
        "switch",
        "symbol",
        "feBlend",
        "feColorMatrix",
        "feComponentTransfer",
        "feComposite",
        "feConvolveMatrix",
        "feDiffuseLighting",
        "feDisplacementMap",
        "feFlood",
        "feGaussianBlur",
        "feImage",
        "feMerge",
        "feMorphology",
        "feOffset",
        "feSpecularLighting",
        "feTile",
        "feTurbulence",
        "linearGradient",
        "radialGradient",
        "stop",
        "circle",
        "ellipse",
        "image",
        "line",
        "path",
        "polygon",
        "polyline",
        "rect",
        "text",
        "use",
        "textPath",
        "tspan",
        "foreignObject",
        "clipPath",
      ],
      ie = [
        "any-hover",
        "any-pointer",
        "aspect-ratio",
        "color",
        "color-gamut",
        "color-index",
        "device-aspect-ratio",
        "device-height",
        "device-width",
        "display-mode",
        "forced-colors",
        "grid",
        "height",
        "hover",
        "inverted-colors",
        "monochrome",
        "orientation",
        "overflow-block",
        "overflow-inline",
        "pointer",
        "prefers-color-scheme",
        "prefers-contrast",
        "prefers-reduced-motion",
        "prefers-reduced-transparency",
        "resolution",
        "scan",
        "scripting",
        "update",
        "width",
        "min-width",
        "max-width",
        "min-height",
        "max-height",
      ]
        .sort()
        .reverse(),
      re = [
        "active",
        "any-link",
        "blank",
        "checked",
        "current",
        "default",
        "defined",
        "dir",
        "disabled",
        "drop",
        "empty",
        "enabled",
        "first",
        "first-child",
        "first-of-type",
        "fullscreen",
        "future",
        "focus",
        "focus-visible",
        "focus-within",
        "has",
        "host",
        "host-context",
        "hover",
        "indeterminate",
        "in-range",
        "invalid",
        "is",
        "lang",
        "last-child",
        "last-of-type",
        "left",
        "link",
        "local-link",
        "not",
        "nth-child",
        "nth-col",
        "nth-last-child",
        "nth-last-col",
        "nth-last-of-type",
        "nth-of-type",
        "only-child",
        "only-of-type",
        "optional",
        "out-of-range",
        "past",
        "placeholder-shown",
        "read-only",
        "read-write",
        "required",
        "right",
        "root",
        "scope",
        "target",
        "target-within",
        "user-invalid",
        "valid",
        "visited",
        "where",
      ]
        .sort()
        .reverse(),
      oe = [
        "after",
        "backdrop",
        "before",
        "cue",
        "cue-region",
        "first-letter",
        "first-line",
        "grammar-error",
        "marker",
        "part",
        "placeholder",
        "selection",
        "slotted",
        "spelling-error",
      ]
        .sort()
        .reverse(),
      ce = [
        "accent-color",
        "align-content",
        "align-items",
        "align-self",
        "alignment-baseline",
        "all",
        "anchor-name",
        "animation",
        "animation-composition",
        "animation-delay",
        "animation-direction",
        "animation-duration",
        "animation-fill-mode",
        "animation-iteration-count",
        "animation-name",
        "animation-play-state",
        "animation-range",
        "animation-range-end",
        "animation-range-start",
        "animation-timeline",
        "animation-timing-function",
        "appearance",
        "aspect-ratio",
        "backdrop-filter",
        "backface-visibility",
        "background",
        "background-attachment",
        "background-blend-mode",
        "background-clip",
        "background-color",
        "background-image",
        "background-origin",
        "background-position",
        "background-position-x",
        "background-position-y",
        "background-repeat",
        "background-size",
        "baseline-shift",
        "block-size",
        "border",
        "border-block",
        "border-block-color",
        "border-block-end",
        "border-block-end-color",
        "border-block-end-style",
        "border-block-end-width",
        "border-block-start",
        "border-block-start-color",
        "border-block-start-style",
        "border-block-start-width",
        "border-block-style",
        "border-block-width",
        "border-bottom",
        "border-bottom-color",
        "border-bottom-left-radius",
        "border-bottom-right-radius",
        "border-bottom-style",
        "border-bottom-width",
        "border-collapse",
        "border-color",
        "border-end-end-radius",
        "border-end-start-radius",
        "border-image",
        "border-image-outset",
        "border-image-repeat",
        "border-image-slice",
        "border-image-source",
        "border-image-width",
        "border-inline",
        "border-inline-color",
        "border-inline-end",
        "border-inline-end-color",
        "border-inline-end-style",
        "border-inline-end-width",
        "border-inline-start",
        "border-inline-start-color",
        "border-inline-start-style",
        "border-inline-start-width",
        "border-inline-style",
        "border-inline-width",
        "border-left",
        "border-left-color",
        "border-left-style",
        "border-left-width",
        "border-radius",
        "border-right",
        "border-right-color",
        "border-right-style",
        "border-right-width",
        "border-spacing",
        "border-start-end-radius",
        "border-start-start-radius",
        "border-style",
        "border-top",
        "border-top-color",
        "border-top-left-radius",
        "border-top-right-radius",
        "border-top-style",
        "border-top-width",
        "border-width",
        "bottom",
        "box-align",
        "box-decoration-break",
        "box-direction",
        "box-flex",
        "box-flex-group",
        "box-lines",
        "box-ordinal-group",
        "box-orient",
        "box-pack",
        "box-shadow",
        "box-sizing",
        "break-after",
        "break-before",
        "break-inside",
        "caption-side",
        "caret-color",
        "clear",
        "clip",
        "clip-path",
        "clip-rule",
        "color",
        "color-interpolation",
        "color-interpolation-filters",
        "color-profile",
        "color-rendering",
        "color-scheme",
        "column-count",
        "column-fill",
        "column-gap",
        "column-rule",
        "column-rule-color",
        "column-rule-style",
        "column-rule-width",
        "column-span",
        "column-width",
        "columns",
        "contain",
        "contain-intrinsic-block-size",
        "contain-intrinsic-height",
        "contain-intrinsic-inline-size",
        "contain-intrinsic-size",
        "contain-intrinsic-width",
        "container",
        "container-name",
        "container-type",
        "content",
        "content-visibility",
        "counter-increment",
        "counter-reset",
        "counter-set",
        "cue",
        "cue-after",
        "cue-before",
        "cursor",
        "cx",
        "cy",
        "direction",
        "display",
        "dominant-baseline",
        "empty-cells",
        "enable-background",
        "field-sizing",
        "fill",
        "fill-opacity",
        "fill-rule",
        "filter",
        "flex",
        "flex-basis",
        "flex-direction",
        "flex-flow",
        "flex-grow",
        "flex-shrink",
        "flex-wrap",
        "float",
        "flood-color",
        "flood-opacity",
        "flow",
        "font",
        "font-display",
        "font-family",
        "font-feature-settings",
        "font-kerning",
        "font-language-override",
        "font-optical-sizing",
        "font-palette",
        "font-size",
        "font-size-adjust",
        "font-smooth",
        "font-smoothing",
        "font-stretch",
        "font-style",
        "font-synthesis",
        "font-synthesis-position",
        "font-synthesis-small-caps",
        "font-synthesis-style",
        "font-synthesis-weight",
        "font-variant",
        "font-variant-alternates",
        "font-variant-caps",
        "font-variant-east-asian",
        "font-variant-emoji",
        "font-variant-ligatures",
        "font-variant-numeric",
        "font-variant-position",
        "font-variation-settings",
        "font-weight",
        "forced-color-adjust",
        "gap",
        "glyph-orientation-horizontal",
        "glyph-orientation-vertical",
        "grid",
        "grid-area",
        "grid-auto-columns",
        "grid-auto-flow",
        "grid-auto-rows",
        "grid-column",
        "grid-column-end",
        "grid-column-start",
        "grid-gap",
        "grid-row",
        "grid-row-end",
        "grid-row-start",
        "grid-template",
        "grid-template-areas",
        "grid-template-columns",
        "grid-template-rows",
        "hanging-punctuation",
        "height",
        "hyphenate-character",
        "hyphenate-limit-chars",
        "hyphens",
        "icon",
        "image-orientation",
        "image-rendering",
        "image-resolution",
        "ime-mode",
        "initial-letter",
        "initial-letter-align",
        "inline-size",
        "inset",
        "inset-area",
        "inset-block",
        "inset-block-end",
        "inset-block-start",
        "inset-inline",
        "inset-inline-end",
        "inset-inline-start",
        "isolation",
        "justify-content",
        "justify-items",
        "justify-self",
        "kerning",
        "left",
        "letter-spacing",
        "lighting-color",
        "line-break",
        "line-height",
        "line-height-step",
        "list-style",
        "list-style-image",
        "list-style-position",
        "list-style-type",
        "margin",
        "margin-block",
        "margin-block-end",
        "margin-block-start",
        "margin-bottom",
        "margin-inline",
        "margin-inline-end",
        "margin-inline-start",
        "margin-left",
        "margin-right",
        "margin-top",
        "margin-trim",
        "marker",
        "marker-end",
        "marker-mid",
        "marker-start",
        "marks",
        "mask",
        "mask-border",
        "mask-border-mode",
        "mask-border-outset",
        "mask-border-repeat",
        "mask-border-slice",
        "mask-border-source",
        "mask-border-width",
        "mask-clip",
        "mask-composite",
        "mask-image",
        "mask-mode",
        "mask-origin",
        "mask-position",
        "mask-repeat",
        "mask-size",
        "mask-type",
        "masonry-auto-flow",
        "math-depth",
        "math-shift",
        "math-style",
        "max-block-size",
        "max-height",
        "max-inline-size",
        "max-width",
        "min-block-size",
        "min-height",
        "min-inline-size",
        "min-width",
        "mix-blend-mode",
        "nav-down",
        "nav-index",
        "nav-left",
        "nav-right",
        "nav-up",
        "none",
        "normal",
        "object-fit",
        "object-position",
        "offset",
        "offset-anchor",
        "offset-distance",
        "offset-path",
        "offset-position",
        "offset-rotate",
        "opacity",
        "order",
        "orphans",
        "outline",
        "outline-color",
        "outline-offset",
        "outline-style",
        "outline-width",
        "overflow",
        "overflow-anchor",
        "overflow-block",
        "overflow-clip-margin",
        "overflow-inline",
        "overflow-wrap",
        "overflow-x",
        "overflow-y",
        "overlay",
        "overscroll-behavior",
        "overscroll-behavior-block",
        "overscroll-behavior-inline",
        "overscroll-behavior-x",
        "overscroll-behavior-y",
        "padding",
        "padding-block",
        "padding-block-end",
        "padding-block-start",
        "padding-bottom",
        "padding-inline",
        "padding-inline-end",
        "padding-inline-start",
        "padding-left",
        "padding-right",
        "padding-top",
        "page",
        "page-break-after",
        "page-break-before",
        "page-break-inside",
        "paint-order",
        "pause",
        "pause-after",
        "pause-before",
        "perspective",
        "perspective-origin",
        "place-content",
        "place-items",
        "place-self",
        "pointer-events",
        "position",
        "position-anchor",
        "position-visibility",
        "print-color-adjust",
        "quotes",
        "r",
        "resize",
        "rest",
        "rest-after",
        "rest-before",
        "right",
        "rotate",
        "row-gap",
        "ruby-align",
        "ruby-position",
        "scale",
        "scroll-behavior",
        "scroll-margin",
        "scroll-margin-block",
        "scroll-margin-block-end",
        "scroll-margin-block-start",
        "scroll-margin-bottom",
        "scroll-margin-inline",
        "scroll-margin-inline-end",
        "scroll-margin-inline-start",
        "scroll-margin-left",
        "scroll-margin-right",
        "scroll-margin-top",
        "scroll-padding",
        "scroll-padding-block",
        "scroll-padding-block-end",
        "scroll-padding-block-start",
        "scroll-padding-bottom",
        "scroll-padding-inline",
        "scroll-padding-inline-end",
        "scroll-padding-inline-start",
        "scroll-padding-left",
        "scroll-padding-right",
        "scroll-padding-top",
        "scroll-snap-align",
        "scroll-snap-stop",
        "scroll-snap-type",
        "scroll-timeline",
        "scroll-timeline-axis",
        "scroll-timeline-name",
        "scrollbar-color",
        "scrollbar-gutter",
        "scrollbar-width",
        "shape-image-threshold",
        "shape-margin",
        "shape-outside",
        "shape-rendering",
        "speak",
        "speak-as",
        "src",
        "stop-color",
        "stop-opacity",
        "stroke",
        "stroke-dasharray",
        "stroke-dashoffset",
        "stroke-linecap",
        "stroke-linejoin",
        "stroke-miterlimit",
        "stroke-opacity",
        "stroke-width",
        "tab-size",
        "table-layout",
        "text-align",
        "text-align-all",
        "text-align-last",
        "text-anchor",
        "text-combine-upright",
        "text-decoration",
        "text-decoration-color",
        "text-decoration-line",
        "text-decoration-skip",
        "text-decoration-skip-ink",
        "text-decoration-style",
        "text-decoration-thickness",
        "text-emphasis",
        "text-emphasis-color",
        "text-emphasis-position",
        "text-emphasis-style",
        "text-indent",
        "text-justify",
        "text-orientation",
        "text-overflow",
        "text-rendering",
        "text-shadow",
        "text-size-adjust",
        "text-transform",
        "text-underline-offset",
        "text-underline-position",
        "text-wrap",
        "text-wrap-mode",
        "text-wrap-style",
        "timeline-scope",
        "top",
        "touch-action",
        "transform",
        "transform-box",
        "transform-origin",
        "transform-style",
        "transition",
        "transition-behavior",
        "transition-delay",
        "transition-duration",
        "transition-property",
        "transition-timing-function",
        "translate",
        "unicode-bidi",
        "user-modify",
        "user-select",
        "vector-effect",
        "vertical-align",
        "view-timeline",
        "view-timeline-axis",
        "view-timeline-inset",
        "view-timeline-name",
        "view-transition-name",
        "visibility",
        "voice-balance",
        "voice-duration",
        "voice-family",
        "voice-pitch",
        "voice-range",
        "voice-rate",
        "voice-stress",
        "voice-volume",
        "white-space",
        "white-space-collapse",
        "widows",
        "width",
        "will-change",
        "word-break",
        "word-spacing",
        "word-wrap",
        "writing-mode",
        "x",
        "y",
        "z-index",
        "zoom",
      ]
        .sort()
        .reverse(),
      le = re.concat(oe).sort().reverse();
    var de = "[0-9](_*[0-9])*",
      pe = `\\.(${de})`,
      me = "[0-9a-fA-F](_*[0-9a-fA-F])*",
      ue = {
        className: "number",
        variants: [
          {
            begin: `(\\b(${de})((${pe})|\\.)?|(${pe}))[eE][+-]?(${de})[fFdD]?\\b`,
          },
          {
            begin: `\\b(${de})((${pe})[fFdD]?\\b|\\.([fFdD]\\b)?)`,
          },
          {
            begin: `(${pe})[fFdD]?\\b`,
          },
          { begin: `\\b(${de})[fFdD]\\b` },
          {
            begin: `\\b0[xX]((${me})\\.?|(${me})?\\.(${me}))[pP][+-]?(${de})[fFdD]?\\b`,
          },
          {
            begin: "\\b(0|[1-9](_*[0-9])*)[lL]?\\b",
          },
          { begin: `\\b0[xX](${me})[lL]?\\b` },
          {
            begin: "\\b0(_*[0-7])*[lL]?\\b",
          },
          { begin: "\\b0[bB][01](_*[01])*[lL]?\\b" },
        ],
        relevance: 0,
      };
    function be(e, n, t) {
      return -1 === t ? "" : e.replace(n, (s) => be(e, n, t - 1));
    }
    const ge = "[A-Za-z$_][0-9A-Za-z$_]*",
      ve = [
        "as",
        "in",
        "of",
        "if",
        "for",
        "while",
        "finally",
        "var",
        "new",
        "function",
        "do",
        "return",
        "void",
        "else",
        "break",
        "catch",
        "instanceof",
        "with",
        "throw",
        "case",
        "default",
        "try",
        "switch",
        "continue",
        "typeof",
        "delete",
        "let",
        "yield",
        "const",
        "class",
        "debugger",
        "async",
        "await",
        "static",
        "import",
        "from",
        "export",
        "extends",
      ],
      _e = ["true", "false", "null", "undefined", "NaN", "Infinity"],
      fe = [
        "Object",
        "Function",
        "Boolean",
        "Symbol",
        "Math",
        "Date",
        "Number",
        "BigInt",
        "String",
        "RegExp",
        "Array",
        "Float32Array",
        "Float64Array",
        "Int8Array",
        "Uint8Array",
        "Uint8ClampedArray",
        "Int16Array",
        "Int32Array",
        "Uint16Array",
        "Uint32Array",
        "BigInt64Array",
        "BigUint64Array",
        "Set",
        "Map",
        "WeakSet",
        "WeakMap",
        "ArrayBuffer",
        "SharedArrayBuffer",
        "Atomics",
        "DataView",
        "JSON",
        "Promise",
        "Generator",
        "GeneratorFunction",
        "AsyncFunction",
        "Reflect",
        "Proxy",
        "Intl",
        "WebAssembly",
      ],
      he = [
        "Error",
        "EvalError",
        "InternalError",
        "RangeError",
        "ReferenceError",
        "SyntaxError",
        "TypeError",
        "URIError",
      ],
      Ee = [
        "setInterval",
        "setTimeout",
        "clearInterval",
        "clearTimeout",
        "require",
        "exports",
        "eval",
        "isFinite",
        "isNaN",
        "parseFloat",
        "parseInt",
        "decodeURI",
        "decodeURIComponent",
        "encodeURI",
        "encodeURIComponent",
        "escape",
        "unescape",
      ],
      we = [
        "arguments",
        "this",
        "super",
        "console",
        "window",
        "document",
        "localStorage",
        "sessionStorage",
        "module",
        "global",
      ],
      ye = [].concat(Ee, fe, he);
    function Ne(e) {
      const n = e.regex,
        t = ge,
        s = {
          begin: /<[A-Za-z0-9\\._:-]+/,
          end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
          isTrulyOpeningTag: (e, n) => {
            const t = e[0].length + e.index,
              s = e.input[t];
            if ("<" === s || "," === s) return void n.ignoreMatch();
            let a;
            ">" === s &&
              (((e, { after: n }) => {
                const t = "</" + e[0].slice(1);
                return -1 !== e.input.indexOf(t, n);
              })(e, { after: t }) ||
                n.ignoreMatch());
            const i = e.input.substring(t);
            ((a = i.match(/^\s*=/)) ||
              ((a = i.match(/^\s+extends\s+/)) && 0 === a.index)) &&
              n.ignoreMatch();
          },
        },
        a = {
          $pattern: ge,
          keyword: ve,
          literal: _e,
          built_in: ye,
          "variable.language": we,
        },
        i = "[0-9](_?[0-9])*",
        r = `\\.(${i})`,
        o = "0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*",
        c = {
          className: "number",
          variants: [
            {
              begin: `(\\b(${o})((${r})|\\.)?|(${r}))[eE][+-]?(${i})\\b`,
            },
            {
              begin: `\\b(${o})\\b((${r})\\b|\\.)?|(${r})\\b`,
            },
            {
              begin: "\\b(0|[1-9](_?[0-9])*)n\\b",
            },
            {
              begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b",
            },
            {
              begin: "\\b0[bB][0-1](_?[0-1])*n?\\b",
            },
            { begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" },
            {
              begin: "\\b0[0-7]+n?\\b",
            },
          ],
          relevance: 0,
        },
        l = {
          className: "subst",
          begin: "\\$\\{",
          end: "\\}",
          keywords: a,
          contains: [],
        },
        d = {
          begin: ".?html`",
          end: "",
          starts: {
            end: "`",
            returnEnd: !1,
            contains: [e.BACKSLASH_ESCAPE, l],
            subLanguage: "xml",
          },
        },
        p = {
          begin: ".?css`",
          end: "",
          starts: {
            end: "`",
            returnEnd: !1,
            contains: [e.BACKSLASH_ESCAPE, l],
            subLanguage: "css",
          },
        },
        m = {
          begin: ".?gql`",
          end: "",
          starts: {
            end: "`",
            returnEnd: !1,
            contains: [e.BACKSLASH_ESCAPE, l],
            subLanguage: "graphql",
          },
        },
        u = {
          className: "string",
          begin: "`",
          end: "`",
          contains: [e.BACKSLASH_ESCAPE, l],
        },
        b = {
          className: "comment",
          variants: [
            e.COMMENT(/\/\*\*(?!\/)/, "\\*/", {
              relevance: 0,
              contains: [
                {
                  begin: "(?=@[A-Za-z]+)",
                  relevance: 0,
                  contains: [
                    { className: "doctag", begin: "@[A-Za-z]+" },
                    {
                      className: "type",
                      begin: "\\{",
                      end: "\\}",
                      excludeEnd: !0,
                      excludeBegin: !0,
                      relevance: 0,
                    },
                    {
                      className: "variable",
                      begin: t + "(?=\\s*(-)|$)",
                      endsParent: !0,
                      relevance: 0,
                    },
                    { begin: /(?=[^\n])\s/, relevance: 0 },
                  ],
                },
              ],
            }),
            e.C_BLOCK_COMMENT_MODE,
            e.C_LINE_COMMENT_MODE,
          ],
        },
        g = [
          e.APOS_STRING_MODE,
          e.QUOTE_STRING_MODE,
          d,
          p,
          m,
          u,
          { match: /\$\d+/ },
          c,
        ];
      l.contains = g.concat({
        begin: /\{/,
        end: /\}/,
        keywords: a,
        contains: ["self"].concat(g),
      });
      const v = [].concat(b, l.contains),
        _ = v.concat([
          {
            begin: /(\s*)\(/,
            end: /\)/,
            keywords: a,
            contains: ["self"].concat(v),
          },
        ]),
        f = {
          className: "params",
          begin: /(\s*)\(/,
          end: /\)/,
          excludeBegin: !0,
          excludeEnd: !0,
          keywords: a,
          contains: _,
        },
        h = {
          variants: [
            {
              match: [
                /class/,
                /\s+/,
                t,
                /\s+/,
                /extends/,
                /\s+/,
                n.concat(t, "(", n.concat(/\./, t), ")*"),
              ],
              scope: {
                1: "keyword",
                3: "title.class",
                5: "keyword",
                7: "title.class.inherited",
              },
            },
            {
              match: [/class/, /\s+/, t],
              scope: { 1: "keyword", 3: "title.class" },
            },
          ],
        },
        E = {
          relevance: 0,
          match: n.either(
            /\bJSON/,
            /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,
            /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,
            /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/
          ),
          className: "title.class",
          keywords: { _: [...fe, ...he] },
        },
        w = {
          variants: [
            {
              match: [/function/, /\s+/, t, /(?=\s*\()/],
            },
            { match: [/function/, /\s*(?=\()/] },
          ],
          className: { 1: "keyword", 3: "title.function" },
          label: "func.def",
          contains: [f],
          illegal: /%/,
        },
        y = {
          match: n.concat(
            /\b/,
            ((N = [...Ee, "super", "import"].map((e) => e + "\\s*\\(")),
            n.concat("(?!", N.join("|"), ")")),
            t,
            n.lookahead(/\s*\(/)
          ),
          className: "title.function",
          relevance: 0,
        };
      var N;
      const x = {
          begin: n.concat(/\./, n.lookahead(n.concat(t, /(?![0-9A-Za-z$_(])/))),
          end: t,
          excludeBegin: !0,
          keywords: "prototype",
          className: "property",
          relevance: 0,
        },
        k = {
          match: [/get|set/, /\s+/, t, /(?=\()/],
          className: { 1: "keyword", 3: "title.function" },
          contains: [{ begin: /\(\)/ }, f],
        },
        O =
          "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" +
          e.UNDERSCORE_IDENT_RE +
          ")\\s*=>",
        M = {
          match: [
            /const|var|let/,
            /\s+/,
            t,
            /\s*/,
            /=\s*/,
            /(async\s*)?/,
            n.lookahead(O),
          ],
          keywords: "async",
          className: { 1: "keyword", 3: "title.function" },
          contains: [f],
        };
      return {
        name: "JavaScript",
        aliases: ["js", "jsx", "mjs", "cjs"],
        keywords: a,
        exports: {
          PARAMS_CONTAINS: _,
          CLASS_REFERENCE: E,
        },
        illegal: /#(?![$_A-z])/,
        contains: [
          e.SHEBANG({ label: "shebang", binary: "node", relevance: 5 }),
          {
            label: "use_strict",
            className: "meta",
            relevance: 10,
            begin: /^\s*['"]use (strict|asm)['"]/,
          },
          e.APOS_STRING_MODE,
          e.QUOTE_STRING_MODE,
          d,
          p,
          m,
          u,
          b,
          { match: /\$\d+/ },
          c,
          E,
          {
            className: "attr",
            begin: t + n.lookahead(":"),
            relevance: 0,
          },
          M,
          {
            begin: "(" + e.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
            keywords: "return throw case",
            relevance: 0,
            contains: [
              b,
              e.REGEXP_MODE,
              {
                className: "function",
                begin: O,
                returnBegin: !0,
                end: "\\s*=>",
                contains: [
                  {
                    className: "params",
                    variants: [
                      { begin: e.UNDERSCORE_IDENT_RE, relevance: 0 },
                      {
                        className: null,
                        begin: /\(\s*\)/,
                        skip: !0,
                      },
                      {
                        begin: /(\s*)\(/,
                        end: /\)/,
                        excludeBegin: !0,
                        excludeEnd: !0,
                        keywords: a,
                        contains: _,
                      },
                    ],
                  },
                ],
              },
              { begin: /,/, relevance: 0 },
              { match: /\s+/, relevance: 0 },
              {
                variants: [
                  { begin: "<>", end: "</>" },
                  {
                    match: /<[A-Za-z0-9\\._:-]+\s*\/>/,
                  },
                  { begin: s.begin, "on:begin": s.isTrulyOpeningTag, end: s.end },
                ],
                subLanguage: "xml",
                contains: [
                  {
                    begin: s.begin,
                    end: s.end,
                    skip: !0,
                    contains: ["self"],
                  },
                ],
              },
            ],
          },
          w,
          {
            beginKeywords: "while if switch catch for",
          },
          {
            begin:
              "\\b(?!function)" +
              e.UNDERSCORE_IDENT_RE +
              "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
            returnBegin: !0,
            label: "func.def",
            contains: [
              f,
              e.inherit(e.TITLE_MODE, { begin: t, className: "title.function" }),
            ],
          },
          { match: /\.\.\./, relevance: 0 },
          x,
          { match: "\\$" + t, relevance: 0 },
          {
            match: [/\bconstructor(?=\s*\()/],
            className: { 1: "title.function" },
            contains: [f],
          },
          y,
          {
            relevance: 0,
            match: /\b[A-Z][A-Z_0-9]+\b/,
            className: "variable.constant",
          },
          h,
          k,
          { match: /\$[(.]/ },
        ],
      };
    }
    const xe = (e) => u(/\b/, e, /\w$/.test(e) ? /\b/ : /\B/),
      ke = ["Protocol", "Type"].map(xe),
      Oe = ["init", "self"].map(xe),
      Me = ["Any", "Self"],
      Ae = [
        "actor",
        "any",
        "associatedtype",
        "async",
        "await",
        /as\?/,
        /as!/,
        "as",
        "borrowing",
        "break",
        "case",
        "catch",
        "class",
        "consume",
        "consuming",
        "continue",
        "convenience",
        "copy",
        "default",
        "defer",
        "deinit",
        "didSet",
        "distributed",
        "do",
        "dynamic",
        "each",
        "else",
        "enum",
        "extension",
        "fallthrough",
        /fileprivate\(set\)/,
        "fileprivate",
        "final",
        "for",
        "func",
        "get",
        "guard",
        "if",
        "import",
        "indirect",
        "infix",
        /init\?/,
        /init!/,
        "inout",
        /internal\(set\)/,
        "internal",
        "in",
        "is",
        "isolated",
        "nonisolated",
        "lazy",
        "let",
        "macro",
        "mutating",
        "nonmutating",
        /open\(set\)/,
        "open",
        "operator",
        "optional",
        "override",
        "package",
        "postfix",
        "precedencegroup",
        "prefix",
        /private\(set\)/,
        "private",
        "protocol",
        /public\(set\)/,
        "public",
        "repeat",
        "required",
        "rethrows",
        "return",
        "set",
        "some",
        "static",
        "struct",
        "subscript",
        "super",
        "switch",
        "throws",
        "throw",
        /try\?/,
        /try!/,
        "try",
        "typealias",
        /unowned\(safe\)/,
        /unowned\(unsafe\)/,
        "unowned",
        "var",
        "weak",
        "where",
        "while",
        "willSet",
      ],
      Se = ["false", "nil", "true"],
      Ce = [
        "assignment",
        "associativity",
        "higherThan",
        "left",
        "lowerThan",
        "none",
        "right",
      ],
      Te = [
        "#colorLiteral",
        "#column",
        "#dsohandle",
        "#else",
        "#elseif",
        "#endif",
        "#error",
        "#file",
        "#fileID",
        "#fileLiteral",
        "#filePath",
        "#function",
        "#if",
        "#imageLiteral",
        "#keyPath",
        "#line",
        "#selector",
        "#sourceLocation",
        "#warning",
      ],
      qe = [
        "abs",
        "all",
        "any",
        "assert",
        "assertionFailure",
        "debugPrint",
        "dump",
        "fatalError",
        "getVaList",
        "isKnownUniquelyReferenced",
        "max",
        "min",
        "numericCast",
        "pointwiseMax",
        "pointwiseMin",
        "precondition",
        "preconditionFailure",
        "print",
        "readLine",
        "repeatElement",
        "sequence",
        "stride",
        "swap",
        "swift_unboxFromSwiftValueWithType",
        "transcode",
        "type",
        "unsafeBitCast",
        "unsafeDowncast",
        "withExtendedLifetime",
        "withUnsafeMutablePointer",
        "withUnsafePointer",
        "withVaList",
        "withoutActuallyEscaping",
        "zip",
      ],
      De = b(
        /[/=\-+!*%<>&|^~?]/,
        /[\u00A1-\u00A7]/,
        /[\u00A9\u00AB]/,
        /[\u00AC\u00AE]/,
        /[\u00B0\u00B1]/,
        /[\u00B6\u00BB\u00BF\u00D7\u00F7]/,
        /[\u2016-\u2017]/,
        /[\u2020-\u2027]/,
        /[\u2030-\u203E]/,
        /[\u2041-\u2053]/,
        /[\u2055-\u205E]/,
        /[\u2190-\u23FF]/,
        /[\u2500-\u2775]/,
        /[\u2794-\u2BFF]/,
        /[\u2E00-\u2E7F]/,
        /[\u3001-\u3003]/,
        /[\u3008-\u3020]/,
        /[\u3030]/
      ),
      Re = b(
        De,
        /[\u0300-\u036F]/,
        /[\u1DC0-\u1DFF]/,
        /[\u20D0-\u20FF]/,
        /[\uFE00-\uFE0F]/,
        /[\uFE20-\uFE2F]/
      ),
      Ie = u(De, Re, "*"),
      Le = b(
        /[a-zA-Z_]/,
        /[\u00A8\u00AA\u00AD\u00AF\u00B2-\u00B5\u00B7-\u00BA]/,
        /[\u00BC-\u00BE\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF]/,
        /[\u0100-\u02FF\u0370-\u167F\u1681-\u180D\u180F-\u1DBF]/,
        /[\u1E00-\u1FFF]/,
        /[\u200B-\u200D\u202A-\u202E\u203F-\u2040\u2054\u2060-\u206F]/,
        /[\u2070-\u20CF\u2100-\u218F\u2460-\u24FF\u2776-\u2793]/,
        /[\u2C00-\u2DFF\u2E80-\u2FFF]/,
        /[\u3004-\u3007\u3021-\u302F\u3031-\u303F\u3040-\uD7FF]/,
        /[\uF900-\uFD3D\uFD40-\uFDCF\uFDF0-\uFE1F\uFE30-\uFE44]/,
        /[\uFE47-\uFEFE\uFF00-\uFFFD]/
      ),
      Be = b(Le, /\d/, /[\u0300-\u036F\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F]/),
      ze = u(Le, Be, "*"),
      Fe = u(/[A-Z]/, Be, "*"),
      $e = [
        "attached",
        "autoclosure",
        u(/convention\(/, b("swift", "block", "c"), /\)/),
        "discardableResult",
        "dynamicCallable",
        "dynamicMemberLookup",
        "escaping",
        "freestanding",
        "frozen",
        "GKInspectable",
        "IBAction",
        "IBDesignable",
        "IBInspectable",
        "IBOutlet",
        "IBSegueAction",
        "inlinable",
        "main",
        "nonobjc",
        "NSApplicationMain",
        "NSCopying",
        "NSManaged",
        u(/objc\(/, ze, /\)/),
        "objc",
        "objcMembers",
        "propertyWrapper",
        "requires_stored_property_inits",
        "resultBuilder",
        "Sendable",
        "testable",
        "UIApplicationMain",
        "unchecked",
        "unknown",
        "usableFromInline",
        "warn_unqualified_access",
      ],
      Ue = [
        "iOS",
        "iOSApplicationExtension",
        "macOS",
        "macOSApplicationExtension",
        "macCatalyst",
        "macCatalystApplicationExtension",
        "watchOS",
        "watchOSApplicationExtension",
        "tvOS",
        "tvOSApplicationExtension",
        "swift",
      ];
    var Pe = Object.freeze({
      __proto__: null,
      grmr_apache: (e) => {
        const n = {
          className: "number",
          begin: /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d{1,5})?/,
        };
        return {
          name: "Apache config",
          aliases: ["apacheconf"],
          case_insensitive: !0,
          contains: [
            e.HASH_COMMENT_MODE,
            {
              className: "section",
              begin: /<\/?/,
              end: />/,
              contains: [
                n,
                { className: "number", begin: /:\d{1,5}/ },
                e.inherit(e.QUOTE_STRING_MODE, { relevance: 0 }),
              ],
            },
            {
              className: "attribute",
              begin: /\w+/,
              relevance: 0,
              keywords: {
                _: [
                  "order",
                  "deny",
                  "allow",
                  "setenv",
                  "rewriterule",
                  "rewriteengine",
                  "rewritecond",
                  "documentroot",
                  "sethandler",
                  "errordocument",
                  "loadmodule",
                  "options",
                  "header",
                  "listen",
                  "serverroot",
                  "servername",
                ],
              },
              starts: {
                end: /$/,
                relevance: 0,
                keywords: { literal: "on off all deny allow" },
                contains: [
                  { className: "meta", begin: /\s\[/, end: /\]$/ },
                  {
                    className: "variable",
                    begin: /[\$%]\{/,
                    end: /\}/,
                    contains: ["self", { className: "number", begin: /[$%]\d+/ }],
                  },
                  n,
                  { className: "number", begin: /\b\d+/ },
                  e.QUOTE_STRING_MODE,
                ],
              },
            },
          ],
          illegal: /\S/,
        };
      },
      grmr_armasm: (e) => {
        const n = {
          variants: [
            e.COMMENT("^[ \\t]*(?=#)", "$", { relevance: 0, excludeBegin: !0 }),
            e.COMMENT("[;@]", "$", { relevance: 0 }),
            e.C_LINE_COMMENT_MODE,
            e.C_BLOCK_COMMENT_MODE,
          ],
        };
        return {
          name: "ARM Assembly",
          case_insensitive: !0,
          aliases: ["arm"],
          keywords: {
            $pattern: "\\.?" + e.IDENT_RE,
            meta: ".2byte .4byte .align .ascii .asciz .balign .byte .code .data .else .end .endif .endm .endr .equ .err .exitm .extern .global .hword .if .ifdef .ifndef .include .irp .long .macro .rept .req .section .set .skip .space .text .word .arm .thumb .code16 .code32 .force_thumb .thumb_func .ltorg ALIAS ALIGN ARM AREA ASSERT ATTR CN CODE CODE16 CODE32 COMMON CP DATA DCB DCD DCDU DCDO DCFD DCFDU DCI DCQ DCQU DCW DCWU DN ELIF ELSE END ENDFUNC ENDIF ENDP ENTRY EQU EXPORT EXPORTAS EXTERN FIELD FILL FUNCTION GBLA GBLL GBLS GET GLOBAL IF IMPORT INCBIN INCLUDE INFO KEEP LCLA LCLL LCLS LTORG MACRO MAP MEND MEXIT NOFP OPT PRESERVE8 PROC QN READONLY RELOC REQUIRE REQUIRE8 RLIST FN ROUT SETA SETL SETS SN SPACE SUBT THUMB THUMBX TTL WHILE WEND ",
            built_in:
              "r0 r1 r2 r3 r4 r5 r6 r7 r8 r9 r10 r11 r12 r13 r14 r15 w0 w1 w2 w3 w4 w5 w6 w7 w8 w9 w10 w11 w12 w13 w14 w15 w16 w17 w18 w19 w20 w21 w22 w23 w24 w25 w26 w27 w28 w29 w30 x0 x1 x2 x3 x4 x5 x6 x7 x8 x9 x10 x11 x12 x13 x14 x15 x16 x17 x18 x19 x20 x21 x22 x23 x24 x25 x26 x27 x28 x29 x30 pc lr sp ip sl sb fp a1 a2 a3 a4 v1 v2 v3 v4 v5 v6 v7 v8 f0 f1 f2 f3 f4 f5 f6 f7 p0 p1 p2 p3 p4 p5 p6 p7 p8 p9 p10 p11 p12 p13 p14 p15 c0 c1 c2 c3 c4 c5 c6 c7 c8 c9 c10 c11 c12 c13 c14 c15 q0 q1 q2 q3 q4 q5 q6 q7 q8 q9 q10 q11 q12 q13 q14 q15 cpsr_c cpsr_x cpsr_s cpsr_f cpsr_cx cpsr_cxs cpsr_xs cpsr_xsf cpsr_sf cpsr_cxsf spsr_c spsr_x spsr_s spsr_f spsr_cx spsr_cxs spsr_xs spsr_xsf spsr_sf spsr_cxsf s0 s1 s2 s3 s4 s5 s6 s7 s8 s9 s10 s11 s12 s13 s14 s15 s16 s17 s18 s19 s20 s21 s22 s23 s24 s25 s26 s27 s28 s29 s30 s31 d0 d1 d2 d3 d4 d5 d6 d7 d8 d9 d10 d11 d12 d13 d14 d15 d16 d17 d18 d19 d20 d21 d22 d23 d24 d25 d26 d27 d28 d29 d30 d31 {PC} {VAR} {TRUE} {FALSE} {OPT} {CONFIG} {ENDIAN} {CODESIZE} {CPU} {FPU} {ARCHITECTURE} {PCSTOREOFFSET} {ARMASM_VERSION} {INTER} {ROPI} {RWPI} {SWST} {NOSWST} . @",
          },
          contains: [
            {
              className: "keyword",
              begin:
                "\\b(adc|(qd?|sh?|u[qh]?)?add(8|16)?|usada?8|(q|sh?|u[qh]?)?(as|sa)x|and|adrl?|sbc|rs[bc]|asr|b[lx]?|blx|bxj|cbn?z|tb[bh]|bic|bfc|bfi|[su]bfx|bkpt|cdp2?|clz|clrex|cmp|cmn|cpsi[ed]|cps|setend|dbg|dmb|dsb|eor|isb|it[te]{0,3}|lsl|lsr|ror|rrx|ldm(([id][ab])|f[ds])?|ldr((s|ex)?[bhd])?|movt?|mvn|mra|mar|mul|[us]mull|smul[bwt][bt]|smu[as]d|smmul|smmla|mla|umlaal|smlal?([wbt][bt]|d)|mls|smlsl?[ds]|smc|svc|sev|mia([bt]{2}|ph)?|mrr?c2?|mcrr2?|mrs|msr|orr|orn|pkh(tb|bt)|rbit|rev(16|sh)?|sel|[su]sat(16)?|nop|pop|push|rfe([id][ab])?|stm([id][ab])?|str(ex)?[bhd]?|(qd?)?sub|(sh?|q|u[qh]?)?sub(8|16)|[su]xt(a?h|a?b(16)?)|srs([id][ab])?|swpb?|swi|smi|tst|teq|wfe|wfi|yield)(eq|ne|cs|cc|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al|hs|lo)?[sptrx]?(?=\\s)",
            },
            n,
            e.QUOTE_STRING_MODE,
            { className: "string", begin: "'", end: "[^\\\\]'", relevance: 0 },
            {
              className: "title",
              begin: "\\|",
              end: "\\|",
              illegal: "\\n",
              relevance: 0,
            },
            {
              className: "number",
              variants: [
                { begin: "[#$=]?0x[0-9a-f]+" },
                { begin: "[#$=]?0b[01]+" },
                { begin: "[#$=]\\d+" },
                { begin: "\\b\\d+" },
              ],
              relevance: 0,
            },
            {
              className: "symbol",
              variants: [
                { begin: "^[ \\t]*[a-z_\\.\\$][a-z0-9_\\.\\$]+:" },
                {
                  begin: "^[a-z_\\.\\$][a-z0-9_\\.\\$]+",
                },
                { begin: "[=#]\\w+" },
              ],
              relevance: 0,
            },
          ],
        };
      },
      grmr_bash: (e) => {
        const n = e.regex,
          t = {},
          s = {
            begin: /\$\{/,
            end: /\}/,
            contains: [
              "self",
              {
                begin: /:-/,
                contains: [t],
              },
            ],
          };
        Object.assign(t, {
          className: "variable",
          variants: [
            {
              begin: n.concat(/\$[\w\d#@][\w\d_]*/, "(?![\\w\\d])(?![$])"),
            },
            s,
          ],
        });
        const a = {
            className: "subst",
            begin: /\$\(/,
            end: /\)/,
            contains: [e.BACKSLASH_ESCAPE],
          },
          i = e.inherit(e.COMMENT(), {
            match: [/(^|\s)/, /#.*$/],
            scope: { 2: "comment" },
          }),
          r = {
            begin: /<<-?\s*(?=\w+)/,
            starts: {
              contains: [
                e.END_SAME_AS_BEGIN({
                  begin: /(\w+)/,
                  end: /(\w+)/,
                  className: "string",
                }),
              ],
            },
          },
          o = {
            className: "string",
            begin: /"/,
            end: /"/,
            contains: [e.BACKSLASH_ESCAPE, t, a],
          };
        a.contains.push(o);
        const c = {
            begin: /\$?\(\(/,
            end: /\)\)/,
            contains: [
              { begin: /\d+#[0-9a-f]+/, className: "number" },
              e.NUMBER_MODE,
              t,
            ],
          },
          l = e.SHEBANG({
            binary: "(fish|bash|zsh|sh|csh|ksh|tcsh|dash|scsh)",
            relevance: 10,
          }),
          d = {
            className: "function",
            begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/,
            returnBegin: !0,
            contains: [e.inherit(e.TITLE_MODE, { begin: /\w[\w\d_]*/ })],
            relevance: 0,
          };
        return {
          name: "Bash",
          aliases: ["sh", "zsh"],
          keywords: {
            $pattern: /\b[a-z][a-z0-9._-]+\b/,
            keyword: [
              "if",
              "then",
              "else",
              "elif",
              "fi",
              "for",
              "while",
              "until",
              "in",
              "do",
              "done",
              "case",
              "esac",
              "function",
              "select",
            ],
            literal: ["true", "false"],
            built_in: [
              "break",
              "cd",
              "continue",
              "eval",
              "exec",
              "exit",
              "export",
              "getopts",
              "hash",
              "pwd",
              "readonly",
              "return",
              "shift",
              "test",
              "times",
              "trap",
              "umask",
              "unset",
              "alias",
              "bind",
              "builtin",
              "caller",
              "command",
              "declare",
              "echo",
              "enable",
              "help",
              "let",
              "local",
              "logout",
              "mapfile",
              "printf",
              "read",
              "readarray",
              "source",
              "sudo",
              "type",
              "typeset",
              "ulimit",
              "unalias",
              "set",
              "shopt",
              "autoload",
              "bg",
              "bindkey",
              "bye",
              "cap",
              "chdir",
              "clone",
              "comparguments",
              "compcall",
              "compctl",
              "compdescribe",
              "compfiles",
              "compgroups",
              "compquote",
              "comptags",
              "comptry",
              "compvalues",
              "dirs",
              "disable",
              "disown",
              "echotc",
              "echoti",
              "emulate",
              "fc",
              "fg",
              "float",
              "functions",
              "getcap",
              "getln",
              "history",
              "integer",
              "jobs",
              "kill",
              "limit",
              "log",
              "noglob",
              "popd",
              "print",
              "pushd",
              "pushln",
              "rehash",
              "sched",
              "setcap",
              "setopt",
              "stat",
              "suspend",
              "ttyctl",
              "unfunction",
              "unhash",
              "unlimit",
              "unsetopt",
              "vared",
              "wait",
              "whence",
              "where",
              "which",
              "zcompile",
              "zformat",
              "zftp",
              "zle",
              "zmodload",
              "zparseopts",
              "zprof",
              "zpty",
              "zregexparse",
              "zsocket",
              "zstyle",
              "ztcp",
              "chcon",
              "chgrp",
              "chown",
              "chmod",
              "cp",
              "dd",
              "df",
              "dir",
              "dircolors",
              "ln",
              "ls",
              "mkdir",
              "mkfifo",
              "mknod",
              "mktemp",
              "mv",
              "realpath",
              "rm",
              "rmdir",
              "shred",
              "sync",
              "touch",
              "truncate",
              "vdir",
              "b2sum",
              "base32",
              "base64",
              "cat",
              "cksum",
              "comm",
              "csplit",
              "cut",
              "expand",
              "fmt",
              "fold",
              "head",
              "join",
              "md5sum",
              "nl",
              "numfmt",
              "od",
              "paste",
              "ptx",
              "pr",
              "sha1sum",
              "sha224sum",
              "sha256sum",
              "sha384sum",
              "sha512sum",
              "shuf",
              "sort",
              "split",
              "sum",
              "tac",
              "tail",
              "tr",
              "tsort",
              "unexpand",
              "uniq",
              "wc",
              "arch",
              "basename",
              "chroot",
              "date",
              "dirname",
              "du",
              "echo",
              "env",
              "expr",
              "factor",
              "groups",
              "hostid",
              "id",
              "link",
              "logname",
              "nice",
              "nohup",
              "nproc",
              "pathchk",
              "pinky",
              "printenv",
              "printf",
              "pwd",
              "readlink",
              "runcon",
              "seq",
              "sleep",
              "stat",
              "stdbuf",
              "stty",
              "tee",
              "test",
              "timeout",
              "tty",
              "uname",
              "unlink",
              "uptime",
              "users",
              "who",
              "whoami",
              "yes",
            ],
          },
          contains: [
            l,
            e.SHEBANG(),
            d,
            c,
            i,
            r,
            { match: /(\/[a-z._-]+)+/ },
            o,
            { match: /\\"/ },
            {
              className: "string",
              begin: /'/,
              end: /'/,
            },
            { match: /\\'/ },
            t,
          ],
        };
      },
      grmr_c: (e) => {
        const n = e.regex,
          t = e.COMMENT("//", "$", { contains: [{ begin: /\\\n/ }] }),
          s = "decltype\\(auto\\)",
          a = "[a-zA-Z_]\\w*::",
          i =
            "(" +
            s +
            "|" +
            n.optional(a) +
            "[a-zA-Z_]\\w*" +
            n.optional("<[^<>]+>") +
            ")",
          r = {
            className: "type",
            variants: [
              { begin: "\\b[a-z\\d_]*_t\\b" },
              {
                match: /\batomic_[a-z]{3,6}\b/,
              },
            ],
          },
          o = {
            className: "string",
            variants: [
              {
                begin: '(u8?|U|L)?"',
                end: '"',
                illegal: "\\n",
                contains: [e.BACKSLASH_ESCAPE],
              },
              {
                begin:
                  "(u8?|U|L)?'(\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)|.)",
                end: "'",
                illegal: ".",
              },
              e.END_SAME_AS_BEGIN({
                begin: /(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/,
                end: /\)([^()\\ ]{0,16})"/,
              }),
            ],
          },
          c = {
            className: "number",
            variants: [
              { begin: "\\b(0b[01']+)" },
              {
                begin:
                  "(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)((ll|LL|l|L)(u|U)?|(u|U)(ll|LL|l|L)?|f|F|b|B)",
              },
              {
                begin:
                  "(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)",
              },
            ],
            relevance: 0,
          },
          l = {
            className: "meta",
            begin: /#\s*[a-z]+\b/,
            end: /$/,
            keywords: {
              keyword:
                "if else elif endif define undef warning error line pragma _Pragma ifdef ifndef elifdef elifndef include",
            },
            contains: [
              { begin: /\\\n/, relevance: 0 },
              e.inherit(o, { className: "string" }),
              {
                className: "string",
                begin: /<.*?>/,
              },
              t,
              e.C_BLOCK_COMMENT_MODE,
            ],
          },
          d = {
            className: "title",
            begin: n.optional(a) + e.IDENT_RE,
            relevance: 0,
          },
          p = n.optional(a) + e.IDENT_RE + "\\s*\\(",
          m = {
            keyword: [
              "asm",
              "auto",
              "break",
              "case",
              "continue",
              "default",
              "do",
              "else",
              "enum",
              "extern",
              "for",
              "fortran",
              "goto",
              "if",
              "inline",
              "register",
              "restrict",
              "return",
              "sizeof",
              "typeof",
              "typeof_unqual",
              "struct",
              "switch",
              "typedef",
              "union",
              "volatile",
              "while",
              "_Alignas",
              "_Alignof",
              "_Atomic",
              "_Generic",
              "_Noreturn",
              "_Static_assert",
              "_Thread_local",
              "alignas",
              "alignof",
              "noreturn",
              "static_assert",
              "thread_local",
              "_Pragma",
            ],
            type: [
              "float",
              "double",
              "signed",
              "unsigned",
              "int",
              "short",
              "long",
              "char",
              "void",
              "_Bool",
              "_BitInt",
              "_Complex",
              "_Imaginary",
              "_Decimal32",
              "_Decimal64",
              "_Decimal96",
              "_Decimal128",
              "_Decimal64x",
              "_Decimal128x",
              "_Float16",
              "_Float32",
              "_Float64",
              "_Float128",
              "_Float32x",
              "_Float64x",
              "_Float128x",
              "const",
              "static",
              "constexpr",
              "complex",
              "bool",
              "imaginary",
            ],
            literal: "true false NULL",
            built_in:
              "std string wstring cin cout cerr clog stdin stdout stderr stringstream istringstream ostringstream auto_ptr deque list queue stack vector map set pair bitset multiset multimap unordered_set unordered_map unordered_multiset unordered_multimap priority_queue make_pair array shared_ptr abort terminate abs acos asin atan2 atan calloc ceil cosh cos exit exp fabs floor fmod fprintf fputs free frexp fscanf future isalnum isalpha iscntrl isdigit isgraph islower isprint ispunct isspace isupper isxdigit tolower toupper labs ldexp log10 log malloc realloc memchr memcmp memcpy memset modf pow printf putchar puts scanf sinh sin snprintf sprintf sqrt sscanf strcat strchr strcmp strcpy strcspn strlen strncat strncmp strncpy strpbrk strrchr strspn strstr tanh tan vfprintf vprintf vsprintf endl initializer_list unique_ptr",
          },
          u = [l, r, t, e.C_BLOCK_COMMENT_MODE, c, o],
          b = {
            variants: [
              { begin: /=/, end: /;/ },
              {
                begin: /\(/,
                end: /\)/,
              },
              { beginKeywords: "new throw return else", end: /;/ },
            ],
            keywords: m,
            contains: u.concat([
              {
                begin: /\(/,
                end: /\)/,
                keywords: m,
                contains: u.concat(["self"]),
                relevance: 0,
              },
            ]),
            relevance: 0,
          },
          g = {
            begin: "(" + i + "[\\*&\\s]+)+" + p,
            returnBegin: !0,
            end: /[{;=]/,
            excludeEnd: !0,
            keywords: m,
            illegal: /[^\w\s\*&:<>.]/,
            contains: [
              { begin: s, keywords: m, relevance: 0 },
              {
                begin: p,
                returnBegin: !0,
                contains: [e.inherit(d, { className: "title.function" })],
                relevance: 0,
              },
              { relevance: 0, match: /,/ },
              {
                className: "params",
                begin: /\(/,
                end: /\)/,
                keywords: m,
                relevance: 0,
                contains: [
                  t,
                  e.C_BLOCK_COMMENT_MODE,
                  o,
                  c,
                  r,
                  {
                    begin: /\(/,
                    end: /\)/,
                    keywords: m,
                    relevance: 0,
                    contains: ["self", t, e.C_BLOCK_COMMENT_MODE, o, c, r],
                  },
                ],
              },
              r,
              t,
              e.C_BLOCK_COMMENT_MODE,
              l,
            ],
          };
        return {
          name: "C",
          aliases: ["h"],
          keywords: m,
          disableAutodetect: !0,
          illegal: "</",
          contains: [].concat(b, g, u, [
            l,
            {
              begin: e.IDENT_RE + "::",
              keywords: m,
            },
            {
              className: "class",
              beginKeywords: "enum class struct union",
              end: /[{;:<>=]/,
              contains: [
                {
                  beginKeywords: "final class struct",
                },
                e.TITLE_MODE,
              ],
            },
          ]),
          exports: { preprocessor: l, strings: o, keywords: m },
        };
      },
      grmr_cairo: (e) => {
        const n = e.UNDERSCORE_IDENT_RE,
          t = [
            "assert ",
            "panic ",
            "Copy",
            "Send",
            "Serde",
            "Sized",
            "Sync",
            "Drop",
            "Fn",
            "FnMut",
            "FnOnce",
            "ToOwned",
            "Clone",
            "Debug",
            "PartialEq",
            "PartialOrd",
            "Eq",
            "Ord",
            "AsRef",
            "AsMut",
            "Into",
            "From",
            "Default",
            "Iterator",
            "Extend",
            "IntoIterator",
            "DoubleEndedIterator",
            "ExactSizeIterator",
            "SliceConcatExt",
            "ToString",
            "assert!",
            "assert_eq!",
            "assert_ne!",
            "assert_lt!",
            "assert_le!",
            "assert_gt!",
            "assert_ge!",
            "format!",
            "write!",
            "writeln!",
            "get_dep_component!",
            "get_dep_component_mut!",
            "component!",
            "consteval_int!",
            "array!",
            "panic!",
            "print!",
            "println!",
          ],
          s = [
            "felt252",
            "i8",
            "i16",
            "i32",
            "i64",
            "i128",
            "u8",
            "u16",
            "u32",
            "u64",
            "u128",
            "usize",
            "bool",
            "Box",
            "Option",
            "Result",
          ];
        return {
          name: "Cairo",
          aliases: ["cairo"],
          keywords: {
            $pattern: e.IDENT_RE + "!?",
            type: s,
            keyword: [
              "as",
              "break",
              "const",
              "continue",
              "else",
              "enum",
              "extern",
              "false",
              "fn",
              "if",
              "impl",
              "implicits",
              "let",
              "loop",
              "match",
              "mod",
              "mut",
              "nopanic",
              "of",
              "pub",
              "ref",
              "return",
              "self",
              "struct",
              "super",
              "trait",
              "true",
              "type",
              "use",
              "while",
            ],
            literal: ["true", "false"],
            built_in: t,
          },
          illegal: "</",
          contains: [
            e.C_LINE_COMMENT_MODE,
            e.COMMENT("/\\*", "\\*/", { contains: ["self"] }),
            e.inherit(e.QUOTE_STRING_MODE, { begin: /b?"/, illegal: null }),
            {
              className: "string",
              variants: [
                { begin: /b?r(#*)"(.|\n)*?"\1(?!#)/ },
                {
                  begin: /b?'\\?(x\w{2}|u\w{4}|U\w{8}|.)'/,
                },
              ],
            },
            { className: "symbol", begin: /'[a-zA-Z_][a-zA-Z0-9_]*/ },
            {
              className: "number",
              variants: [
                {
                  begin: "\\b0b([01_]+)",
                },
                { begin: "\\b0o([0-7_]+)" },
                { begin: "\\b0x([A-Fa-f0-9_]+)" },
                {
                  begin: "\\b(\\d[\\d_]*(\\.[0-9_]+)?([eE][+-]?[0-9_]+)?)",
                },
              ],
              relevance: 0,
            },
            {
              begin: [/fn/, /\s+/, n],
              className: { 1: "keyword", 3: "title.function" },
            },
            {
              className: "meta",
              begin: "#!?\\[",
              end: "\\]",
              contains: [
                {
                  className: "string",
                  begin: /"/,
                  end: /"/,
                  contains: [e.BACKSLASH_ESCAPE],
                },
              ],
            },
            {
              begin: [/let/, /\s+/, /(?:mut\s+)?/, n],
              className: { 1: "keyword", 3: "keyword", 4: "variable" },
            },
            {
              begin: [/for/, /\s+/, n, /\s+/, /in/],
              className: { 1: "keyword", 3: "variable", 5: "keyword" },
            },
            {
              begin: [/type/, /\s+/, n],
              className: { 1: "keyword", 3: "title.class" },
            },
            {
              begin: [/(?:trait|enum|struct|union|impl|for)/, /\s+/, n],
              className: { 1: "keyword", 3: "title.class" },
            },
            {
              begin: e.IDENT_RE + "::",
              keywords: {
                keyword: "Self",
                built_in: t,
                type: s,
              },
            },
            { className: "punctuation", begin: "->" },
          ],
        };
      },
      grmr_coffeescript: (e) => {
        const n = {
          keyword: ve
            .concat([
              "then",
              "unless",
              "until",
              "loop",
              "by",
              "when",
              "and",
              "or",
              "is",
              "isnt",
              "not",
            ])
            .filter(
              ((t = ["var", "const", "let", "function", "static"]),
              (e) => !t.includes(e))
            ),
          literal: _e.concat(["yes", "no", "on", "off"]),
          built_in: ye.concat(["npm", "print"]),
        };
        var t;
        const s = "[A-Za-z$_][0-9A-Za-z$_]*",
          a = { className: "subst", begin: /#\{/, end: /\}/, keywords: n },
          i = [
            e.BINARY_NUMBER_MODE,
            e.inherit(e.C_NUMBER_MODE, {
              starts: {
                end: "(\\s*/)?",
                relevance: 0,
              },
            }),
            {
              className: "string",
              variants: [
                { begin: /'''/, end: /'''/, contains: [e.BACKSLASH_ESCAPE] },
                { begin: /'/, end: /'/, contains: [e.BACKSLASH_ESCAPE] },
                { begin: /"""/, end: /"""/, contains: [e.BACKSLASH_ESCAPE, a] },
                { begin: /"/, end: /"/, contains: [e.BACKSLASH_ESCAPE, a] },
              ],
            },
            {
              className: "regexp",
              variants: [
                { begin: "///", end: "///", contains: [a, e.HASH_COMMENT_MODE] },
                { begin: "//[gim]{0,3}(?=\\W)", relevance: 0 },
                { begin: /\/(?![ *]).*?(?![\\]).\/[gim]{0,3}(?=\W)/ },
              ],
            },
            { begin: "@" + s },
            {
              subLanguage: "javascript",
              excludeBegin: !0,
              excludeEnd: !0,
              variants: [
                {
                  begin: "```",
                  end: "```",
                },
                { begin: "`", end: "`" },
              ],
            },
          ];
        a.contains = i;
        const r = e.inherit(e.TITLE_MODE, { begin: s }),
          o = "(\\(.*\\)\\s*)?\\B[-=]>",
          c = {
            className: "params",
            begin: "\\([^\\(]",
            returnBegin: !0,
            contains: [
              {
                begin: /\(/,
                end: /\)/,
                keywords: n,
                contains: ["self"].concat(i),
              },
            ],
          },
          l = {
            variants: [
              {
                match: [/class\s+/, s, /\s+extends\s+/, s],
              },
              { match: [/class\s+/, s] },
            ],
            scope: {
              2: "title.class",
              4: "title.class.inherited",
            },
            keywords: n,
          };
        return {
          name: "CoffeeScript",
          aliases: ["coffee", "cson", "iced"],
          keywords: n,
          illegal: /\/\*/,
          contains: [
            ...i,
            e.COMMENT("###", "###"),
            e.HASH_COMMENT_MODE,
            {
              className: "function",
              begin: "^\\s*" + s + "\\s*=\\s*" + o,
              end: "[-=]>",
              returnBegin: !0,
              contains: [r, c],
            },
            {
              begin: /[:\(,=]\s*/,
              relevance: 0,
              contains: [
                {
                  className: "function",
                  begin: o,
                  end: "[-=]>",
                  returnBegin: !0,
                  contains: [c],
                },
              ],
            },
            l,
            {
              begin: s + ":",
              end: ":",
              returnBegin: !0,
              returnEnd: !0,
              relevance: 0,
            },
          ],
        };
      },
      grmr_cpp: (e) => {
        const n = e.regex,
          t = e.COMMENT("//", "$", { contains: [{ begin: /\\\n/ }] }),
          s = "decltype\\(auto\\)",
          a = "[a-zA-Z_]\\w*::",
          i =
            "(?!struct)(" +
            s +
            "|" +
            n.optional(a) +
            "[a-zA-Z_]\\w*" +
            n.optional("<[^<>]+>") +
            ")",
          r = {
            className: "type",
            begin: "\\b[a-z\\d_]*_t\\b",
          },
          o = {
            className: "string",
            variants: [
              {
                begin: '(u8?|U|L)?"',
                end: '"',
                illegal: "\\n",
                contains: [e.BACKSLASH_ESCAPE],
              },
              {
                begin:
                  "(u8?|U|L)?'(\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)|.)",
                end: "'",
                illegal: ".",
              },
              e.END_SAME_AS_BEGIN({
                begin: /(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/,
                end: /\)([^()\\ ]{0,16})"/,
              }),
            ],
          },
          c = {
            className: "number",
            variants: [
              {
                begin:
                  "[+-]?(?:(?:[0-9](?:'?[0-9])*\\.(?:[0-9](?:'?[0-9])*)?|\\.[0-9](?:'?[0-9])*)(?:[Ee][+-]?[0-9](?:'?[0-9])*)?|[0-9](?:'?[0-9])*[Ee][+-]?[0-9](?:'?[0-9])*|0[Xx](?:[0-9A-Fa-f](?:'?[0-9A-Fa-f])*(?:\\.(?:[0-9A-Fa-f](?:'?[0-9A-Fa-f])*)?)?|\\.[0-9A-Fa-f](?:'?[0-9A-Fa-f])*)[Pp][+-]?[0-9](?:'?[0-9])*)(?:[Ff](?:16|32|64|128)?|(BF|bf)16|[Ll]|)",
              },
              {
                begin:
                  "[+-]?\\b(?:0[Bb][01](?:'?[01])*|0[Xx][0-9A-Fa-f](?:'?[0-9A-Fa-f])*|0(?:'?[0-7])*|[1-9](?:'?[0-9])*)(?:[Uu](?:LL?|ll?)|[Uu][Zz]?|(?:LL?|ll?)[Uu]?|[Zz][Uu]|)",
              },
            ],
            relevance: 0,
          },
          l = {
            className: "meta",
            begin: /#\s*[a-z]+\b/,
            end: /$/,
            keywords: {
              keyword:
                "if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include",
            },
            contains: [
              { begin: /\\\n/, relevance: 0 },
              e.inherit(o, { className: "string" }),
              {
                className: "string",
                begin: /<.*?>/,
              },
              t,
              e.C_BLOCK_COMMENT_MODE,
            ],
          },
          d = {
            className: "title",
            begin: n.optional(a) + e.IDENT_RE,
            relevance: 0,
          },
          p = n.optional(a) + e.IDENT_RE + "\\s*\\(",
          m = {
            type: [
              "bool",
              "char",
              "char16_t",
              "char32_t",
              "char8_t",
              "double",
              "float",
              "int",
              "long",
              "short",
              "void",
              "wchar_t",
              "unsigned",
              "signed",
              "const",
              "static",
            ],
            keyword: [
              "alignas",
              "alignof",
              "and",
              "and_eq",
              "asm",
              "atomic_cancel",
              "atomic_commit",
              "atomic_noexcept",
              "auto",
              "bitand",
              "bitor",
              "break",
              "case",
              "catch",
              "class",
              "co_await",
              "co_return",
              "co_yield",
              "compl",
              "concept",
              "const_cast|10",
              "consteval",
              "constexpr",
              "constinit",
              "continue",
              "decltype",
              "default",
              "delete",
              "do",
              "dynamic_cast|10",
              "else",
              "enum",
              "explicit",
              "export",
              "extern",
              "false",
              "final",
              "for",
              "friend",
              "goto",
              "if",
              "import",
              "inline",
              "module",
              "mutable",
              "namespace",
              "new",
              "noexcept",
              "not",
              "not_eq",
              "nullptr",
              "operator",
              "or",
              "or_eq",
              "override",
              "private",
              "protected",
              "public",
              "reflexpr",
              "register",
              "reinterpret_cast|10",
              "requires",
              "return",
              "sizeof",
              "static_assert",
              "static_cast|10",
              "struct",
              "switch",
              "synchronized",
              "template",
              "this",
              "thread_local",
              "throw",
              "transaction_safe",
              "transaction_safe_dynamic",
              "true",
              "try",
              "typedef",
              "typeid",
              "typename",
              "union",
              "using",
              "virtual",
              "volatile",
              "while",
              "xor",
              "xor_eq",
            ],
            literal: ["NULL", "false", "nullopt", "nullptr", "true"],
            built_in: ["_Pragma"],
            _type_hints: [
              "any",
              "auto_ptr",
              "barrier",
              "binary_semaphore",
              "bitset",
              "complex",
              "condition_variable",
              "condition_variable_any",
              "counting_semaphore",
              "deque",
              "false_type",
              "future",
              "imaginary",
              "initializer_list",
              "istringstream",
              "jthread",
              "latch",
              "lock_guard",
              "multimap",
              "multiset",
              "mutex",
              "optional",
              "ostringstream",
              "packaged_task",
              "pair",
              "promise",
              "priority_queue",
              "queue",
              "recursive_mutex",
              "recursive_timed_mutex",
              "scoped_lock",
              "set",
              "shared_future",
              "shared_lock",
              "shared_mutex",
              "shared_timed_mutex",
              "shared_ptr",
              "stack",
              "string_view",
              "stringstream",
              "timed_mutex",
              "thread",
              "true_type",
              "tuple",
              "unique_lock",
              "unique_ptr",
              "unordered_map",
              "unordered_multimap",
              "unordered_multiset",
              "unordered_set",
              "variant",
              "vector",
              "weak_ptr",
              "wstring",
              "wstring_view",
            ],
          },
          u = {
            className: "function.dispatch",
            relevance: 0,
            keywords: {
              _hint: [
                "abort",
                "abs",
                "acos",
                "apply",
                "as_const",
                "asin",
                "atan",
                "atan2",
                "calloc",
                "ceil",
                "cerr",
                "cin",
                "clog",
                "cos",
                "cosh",
                "cout",
                "declval",
                "endl",
                "exchange",
                "exit",
                "exp",
                "fabs",
                "floor",
                "fmod",
                "forward",
                "fprintf",
                "fputs",
                "free",
                "frexp",
                "fscanf",
                "future",
                "invoke",
                "isalnum",
                "isalpha",
                "iscntrl",
                "isdigit",
                "isgraph",
                "islower",
                "isprint",
                "ispunct",
                "isspace",
                "isupper",
                "isxdigit",
                "labs",
                "launder",
                "ldexp",
                "log",
                "log10",
                "make_pair",
                "make_shared",
                "make_shared_for_overwrite",
                "make_tuple",
                "make_unique",
                "malloc",
                "memchr",
                "memcmp",
                "memcpy",
                "memset",
                "modf",
                "move",
                "pow",
                "printf",
                "putchar",
                "puts",
                "realloc",
                "scanf",
                "sin",
                "sinh",
                "snprintf",
                "sprintf",
                "sqrt",
                "sscanf",
                "std",
                "stderr",
                "stdin",
                "stdout",
                "strcat",
                "strchr",
                "strcmp",
                "strcpy",
                "strcspn",
                "strlen",
                "strncat",
                "strncmp",
                "strncpy",
                "strpbrk",
                "strrchr",
                "strspn",
                "strstr",
                "swap",
                "tan",
                "tanh",
                "terminate",
                "to_underlying",
                "tolower",
                "toupper",
                "vfprintf",
                "visit",
                "vprintf",
                "vsprintf",
              ],
            },
            begin: n.concat(
              /\b/,
              /(?!decltype)/,
              /(?!if)/,
              /(?!for)/,
              /(?!switch)/,
              /(?!while)/,
              e.IDENT_RE,
              n.lookahead(/(<[^<>]+>|)\s*\(/)
            ),
          },
          b = [u, l, r, t, e.C_BLOCK_COMMENT_MODE, c, o],
          g = {
            variants: [
              { begin: /=/, end: /;/ },
              {
                begin: /\(/,
                end: /\)/,
              },
              { beginKeywords: "new throw return else", end: /;/ },
            ],
            keywords: m,
            contains: b.concat([
              {
                begin: /\(/,
                end: /\)/,
                keywords: m,
                contains: b.concat(["self"]),
                relevance: 0,
              },
            ]),
            relevance: 0,
          },
          v = {
            className: "function",
            begin: "(" + i + "[\\*&\\s]+)+" + p,
            returnBegin: !0,
            end: /[{;=]/,
            excludeEnd: !0,
            keywords: m,
            illegal: /[^\w\s\*&:<>.]/,
            contains: [
              { begin: s, keywords: m, relevance: 0 },
              {
                begin: p,
                returnBegin: !0,
                contains: [d],
                relevance: 0,
              },
              { begin: /::/, relevance: 0 },
              {
                begin: /:/,
                endsWithParent: !0,
                contains: [o, c],
              },
              { relevance: 0, match: /,/ },
              {
                className: "params",
                begin: /\(/,
                end: /\)/,
                keywords: m,
                relevance: 0,
                contains: [
                  t,
                  e.C_BLOCK_COMMENT_MODE,
                  o,
                  c,
                  r,
                  {
                    begin: /\(/,
                    end: /\)/,
                    keywords: m,
                    relevance: 0,
                    contains: ["self", t, e.C_BLOCK_COMMENT_MODE, o, c, r],
                  },
                ],
              },
              r,
              t,
              e.C_BLOCK_COMMENT_MODE,
              l,
            ],
          };
        return {
          name: "C++",
          aliases: ["cc", "c++", "h++", "hpp", "hh", "hxx", "cxx"],
          keywords: m,
          illegal: "</",
          classNameAliases: { "function.dispatch": "built_in" },
          contains: [].concat(g, v, u, b, [
            l,
            {
              begin:
                "\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array|tuple|optional|variant|function)\\s*<(?!<)",
              end: ">",
              keywords: m,
              contains: ["self", r],
            },
            { begin: e.IDENT_RE + "::", keywords: m },
            {
              match: [
                /\b(?:enum(?:\s+(?:class|struct))?|class|struct|union)/,
                /\s+/,
                /\w+/,
              ],
              className: { 1: "keyword", 3: "title.class" },
            },
          ]),
        };
      },
      grmr_csharp: (e) => {
        const n = {
            keyword: [
              "abstract",
              "as",
              "base",
              "break",
              "case",
              "catch",
              "class",
              "const",
              "continue",
              "do",
              "else",
              "event",
              "explicit",
              "extern",
              "finally",
              "fixed",
              "for",
              "foreach",
              "goto",
              "if",
              "implicit",
              "in",
              "interface",
              "internal",
              "is",
              "lock",
              "namespace",
              "new",
              "operator",
              "out",
              "override",
              "params",
              "private",
              "protected",
              "public",
              "readonly",
              "record",
              "ref",
              "return",
              "scoped",
              "sealed",
              "sizeof",
              "stackalloc",
              "static",
              "struct",
              "switch",
              "this",
              "throw",
              "try",
              "typeof",
              "unchecked",
              "unsafe",
              "using",
              "virtual",
              "void",
              "volatile",
              "while",
            ].concat([
              "add",
              "alias",
              "and",
              "ascending",
              "async",
              "await",
              "by",
              "descending",
              "equals",
              "from",
              "get",
              "global",
              "group",
              "init",
              "into",
              "join",
              "let",
              "nameof",
              "not",
              "notnull",
              "on",
              "or",
              "orderby",
              "partial",
              "remove",
              "select",
              "set",
              "unmanaged",
              "value|0",
              "var",
              "when",
              "where",
              "with",
              "yield",
            ]),
            built_in: [
              "bool",
              "byte",
              "char",
              "decimal",
              "delegate",
              "double",
              "dynamic",
              "enum",
              "float",
              "int",
              "long",
              "nint",
              "nuint",
              "object",
              "sbyte",
              "short",
              "string",
              "ulong",
              "uint",
              "ushort",
            ],
            literal: ["default", "false", "null", "true"],
          },
          t = e.inherit(e.TITLE_MODE, {
            begin: "[a-zA-Z](\\.?\\w)*",
          }),
          s = {
            className: "number",
            variants: [
              {
                begin: "\\b(0b[01']+)",
              },
              {
                begin:
                  "(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)(u|U|l|L|ul|UL|f|F|b|B)",
              },
              {
                begin:
                  "(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)",
              },
            ],
            relevance: 0,
          },
          a = {
            className: "string",
            begin: '@"',
            end: '"',
            contains: [{ begin: '""' }],
          },
          i = e.inherit(a, { illegal: /\n/ }),
          r = { className: "subst", begin: /\{/, end: /\}/, keywords: n },
          o = e.inherit(r, { illegal: /\n/ }),
          c = {
            className: "string",
            begin: /\$"/,
            end: '"',
            illegal: /\n/,
            contains: [
              { begin: /\{\{/ },
              { begin: /\}\}/ },
              e.BACKSLASH_ESCAPE,
              o,
            ],
          },
          l = {
            className: "string",
            begin: /\$@"/,
            end: '"',
            contains: [
              {
                begin: /\{\{/,
              },
              { begin: /\}\}/ },
              { begin: '""' },
              r,
            ],
          },
          d = e.inherit(l, {
            illegal: /\n/,
            contains: [{ begin: /\{\{/ }, { begin: /\}\}/ }, { begin: '""' }, o],
          });
        (r.contains = [
          l,
          c,
          a,
          e.APOS_STRING_MODE,
          e.QUOTE_STRING_MODE,
          s,
          e.C_BLOCK_COMMENT_MODE,
        ]),
          (o.contains = [
            d,
            c,
            i,
            e.APOS_STRING_MODE,
            e.QUOTE_STRING_MODE,
            s,
            e.inherit(e.C_BLOCK_COMMENT_MODE, {
              illegal: /\n/,
            }),
          ]);
        const p = {
            variants: [
              {
                className: "string",
                begin: /"""("*)(?!")(.|\n)*?"""\1/,
                relevance: 1,
              },
              l,
              c,
              a,
              e.APOS_STRING_MODE,
              e.QUOTE_STRING_MODE,
            ],
          },
          m = {
            begin: "<",
            end: ">",
            contains: [{ beginKeywords: "in out" }, t],
          },
          u =
            e.IDENT_RE +
            "(<" +
            e.IDENT_RE +
            "(\\s*,\\s*" +
            e.IDENT_RE +
            ")*>)?(\\[\\])?",
          b = {
            begin: "@" + e.IDENT_RE,
            relevance: 0,
          };
        return {
          name: "C#",
          aliases: ["cs", "c#"],
          keywords: n,
          illegal: /::/,
          contains: [
            e.COMMENT("///", "$", {
              returnBegin: !0,
              contains: [
                {
                  className: "doctag",
                  variants: [
                    { begin: "///", relevance: 0 },
                    {
                      begin: "\x3c!--|--\x3e",
                    },
                    { begin: "</?", end: ">" },
                  ],
                },
              ],
            }),
            e.C_LINE_COMMENT_MODE,
            e.C_BLOCK_COMMENT_MODE,
            {
              className: "meta",
              begin: "#",
              end: "$",
              keywords: {
                keyword:
                  "if else elif endif define undef warning error line region endregion pragma checksum",
              },
            },
            p,
            s,
            {
              beginKeywords: "class interface",
              relevance: 0,
              end: /[{;=]/,
              illegal: /[^\s:,]/,
              contains: [
                { beginKeywords: "where class" },
                t,
                m,
                e.C_LINE_COMMENT_MODE,
                e.C_BLOCK_COMMENT_MODE,
              ],
            },
            {
              beginKeywords: "namespace",
              relevance: 0,
              end: /[{;=]/,
              illegal: /[^\s:]/,
              contains: [t, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE],
            },
            {
              beginKeywords: "record",
              relevance: 0,
              end: /[{;=]/,
              illegal: /[^\s:]/,
              contains: [t, m, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE],
            },
            {
              className: "meta",
              begin: "^\\s*\\[(?=[\\w])",
              excludeBegin: !0,
              end: "\\]",
              excludeEnd: !0,
              contains: [
                {
                  className: "string",
                  begin: /"/,
                  end: /"/,
                },
              ],
            },
            {
              beginKeywords: "new return throw await else",
              relevance: 0,
            },
            {
              className: "function",
              begin: "(" + u + "\\s+)+" + e.IDENT_RE + "\\s*(<[^=]+>\\s*)?\\(",
              returnBegin: !0,
              end: /\s*[{;=]/,
              excludeEnd: !0,
              keywords: n,
              contains: [
                {
                  beginKeywords:
                    "public private protected static internal protected abstract async extern override unsafe virtual new sealed partial",
                  relevance: 0,
                },
                {
                  begin: e.IDENT_RE + "\\s*(<[^=]+>\\s*)?\\(",
                  returnBegin: !0,
                  contains: [e.TITLE_MODE, m],
                  relevance: 0,
                },
                { match: /\(\)/ },
                {
                  className: "params",
                  begin: /\(/,
                  end: /\)/,
                  excludeBegin: !0,
                  excludeEnd: !0,
                  keywords: n,
                  relevance: 0,
                  contains: [p, s, e.C_BLOCK_COMMENT_MODE],
                },
                e.C_LINE_COMMENT_MODE,
                e.C_BLOCK_COMMENT_MODE,
              ],
            },
            b,
          ],
        };
      },
      grmr_css: (e) => {
        const n = e.regex,
          t = se(e),
          s = [e.APOS_STRING_MODE, e.QUOTE_STRING_MODE];
        return {
          name: "CSS",
          case_insensitive: !0,
          illegal: /[=|'\$]/,
          keywords: {
            keyframePosition: "from to",
          },
          classNameAliases: { keyframePosition: "selector-tag" },
          contains: [
            t.BLOCK_COMMENT,
            { begin: /-(webkit|moz|ms|o)-(?=[a-z])/ },
            t.CSS_NUMBER_MODE,
            { className: "selector-id", begin: /#[A-Za-z0-9_-]+/, relevance: 0 },
            {
              className: "selector-class",
              begin: "\\.[a-zA-Z-][a-zA-Z0-9_-]*",
              relevance: 0,
            },
            t.ATTRIBUTE_SELECTOR_MODE,
            {
              className: "selector-pseudo",
              variants: [
                {
                  begin: ":(" + re.join("|") + ")",
                },
                { begin: ":(:)?(" + oe.join("|") + ")" },
              ],
            },
            t.CSS_VARIABLE,
            { className: "attribute", begin: "\\b(" + ce.join("|") + ")\\b" },
            {
              begin: /:/,
              end: /[;}{]/,
              contains: [
                t.BLOCK_COMMENT,
                t.HEXCOLOR,
                t.IMPORTANT,
                t.CSS_NUMBER_MODE,
                ...s,
                {
                  begin: /(url|data-uri)\(/,
                  end: /\)/,
                  relevance: 0,
                  keywords: { built_in: "url data-uri" },
                  contains: [
                    ...s,
                    {
                      className: "string",
                      begin: /[^)]/,
                      endsWithParent: !0,
                      excludeEnd: !0,
                    },
                  ],
                },
                t.FUNCTION_DISPATCH,
              ],
            },
            {
              begin: n.lookahead(/@/),
              end: "[{;]",
              relevance: 0,
              illegal: /:/,
              contains: [
                { className: "keyword", begin: /@-?\w[\w]*(-\w+)*/ },
                {
                  begin: /\s/,
                  endsWithParent: !0,
                  excludeEnd: !0,
                  relevance: 0,
                  keywords: {
                    $pattern: /[a-z-]+/,
                    keyword: "and or not only",
                    attribute: ie.join(" "),
                  },
                  contains: [
                    {
                      begin: /[a-z-]+(?=:)/,
                      className: "attribute",
                    },
                    ...s,
                    t.CSS_NUMBER_MODE,
                  ],
                },
              ],
            },
            {
              className: "selector-tag",
              begin: "\\b(" + ae.join("|") + ")\\b",
            },
          ],
        };
      },
      grmr_d: (e) => {
        const n = {
            $pattern: e.UNDERSCORE_IDENT_RE,
            keyword:
              "abstract alias align asm assert auto body break byte case cast catch class const continue debug default delete deprecated do else enum export extern final finally for foreach foreach_reverse|10 goto if immutable import in inout int interface invariant is lazy macro mixin module new nothrow out override package pragma private protected public pure ref return scope shared static struct super switch synchronized template this throw try typedef typeid typeof union unittest version void volatile while with __FILE__ __LINE__ __gshared|10 __thread __traits __DATE__ __EOF__ __TIME__ __TIMESTAMP__ __VENDOR__ __VERSION__",
            built_in:
              "bool cdouble cent cfloat char creal dchar delegate double dstring float function idouble ifloat ireal long real short string ubyte ucent uint ulong ushort wchar wstring",
            literal: "false null true",
          },
          t = "(0|[1-9][\\d_]*)",
          s = "(0|[1-9][\\d_]*|\\d[\\d_]*|[\\d_]+?\\d)",
          a = "([\\da-fA-F][\\da-fA-F_]*|_[\\da-fA-F][\\da-fA-F_]*)",
          i = "([eE][+-]?" + s + ")",
          r = "(" + t + "|0[bB][01_]+|0[xX]" + a + ")",
          o =
            "\\\\(['\"\\?\\\\abfnrtv]|u[\\dA-Fa-f]{4}|[0-7]{1,3}|x[\\dA-Fa-f]{2}|U[\\dA-Fa-f]{8})|&[a-zA-Z\\d]{2,};",
          c = {
            className: "number",
            begin: "\\b" + r + "(L|u|U|Lu|LU|uL|UL)?",
            relevance: 0,
          },
          l = {
            className: "number",
            begin:
              "\\b(((0[xX](" +
              a +
              "\\." +
              a +
              "|\\.?" +
              a +
              ")[pP][+-]?" +
              s +
              ")|(" +
              s +
              "(\\.\\d*|" +
              i +
              ")|\\d+\\." +
              s +
              "|\\." +
              t +
              i +
              "?))([fF]|L|i|[fF]i|Li)?|" +
              r +
              "(i|[fF]i|Li))",
            relevance: 0,
          },
          d = {
            className: "string",
            begin: "'(" + o + "|.)",
            end: "'",
            illegal: ".",
          },
          p = {
            className: "string",
            begin: '"',
            contains: [{ begin: o, relevance: 0 }],
            end: '"[cwd]?',
          },
          m = e.COMMENT("\\/\\+", "\\+\\/", {
            contains: ["self"],
            relevance: 10,
          });
        return {
          name: "D",
          keywords: n,
          contains: [
            e.C_LINE_COMMENT_MODE,
            e.C_BLOCK_COMMENT_MODE,
            m,
            {
              className: "string",
              begin: 'x"[\\da-fA-F\\s\\n\\r]*"[cwd]?',
              relevance: 10,
            },
            p,
            {
              className: "string",
              begin: '[rq]"',
              end: '"[cwd]?',
              relevance: 5,
            },
            { className: "string", begin: "`", end: "`[cwd]?" },
            { className: "string", begin: 'q"\\{', end: '\\}"' },
            l,
            c,
            d,
            {
              className: "meta",
              begin: "^#!",
              end: "$",
              relevance: 5,
            },
            { className: "meta", begin: "#(line)", end: "$", relevance: 5 },
            { className: "keyword", begin: "@[a-zA-Z_][a-zA-Z_\\d]*" },
          ],
        };
      },
      grmr_diff: (e) => {
        const n = e.regex;
        return {
          name: "Diff",
          aliases: ["patch"],
          contains: [
            {
              className: "meta",
              relevance: 10,
              match: n.either(
                /^@@ +-\d+,\d+ +\+\d+,\d+ +@@/,
                /^\*\*\* +\d+,\d+ +\*\*\*\*$/,
                /^--- +\d+,\d+ +----$/
              ),
            },
            {
              className: "comment",
              variants: [
                {
                  begin: n.either(
                    /Index: /,
                    /^index/,
                    /={3,}/,
                    /^-{3}/,
                    /^\*{3} /,
                    /^\+{3}/,
                    /^diff --git/
                  ),
                  end: /$/,
                },
                { match: /^\*{15}$/ },
              ],
            },
            { className: "addition", begin: /^\+/, end: /$/ },
            {
              className: "deletion",
              begin: /^-/,
              end: /$/,
            },
            { className: "addition", begin: /^!/, end: /$/ },
          ],
        };
      },
      grmr_go: (e) => {
        const n = {
          keyword: [
            "break",
            "case",
            "chan",
            "const",
            "continue",
            "default",
            "defer",
            "else",
            "fallthrough",
            "for",
            "func",
            "go",
            "goto",
            "if",
            "import",
            "interface",
            "map",
            "package",
            "range",
            "return",
            "select",
            "struct",
            "switch",
            "type",
            "var",
          ],
          type: [
            "bool",
            "byte",
            "complex64",
            "complex128",
            "error",
            "float32",
            "float64",
            "int8",
            "int16",
            "int32",
            "int64",
            "string",
            "uint8",
            "uint16",
            "uint32",
            "uint64",
            "int",
            "uint",
            "uintptr",
            "rune",
          ],
          literal: ["true", "false", "iota", "nil"],
          built_in: [
            "append",
            "cap",
            "close",
            "complex",
            "copy",
            "imag",
            "len",
            "make",
            "new",
            "panic",
            "print",
            "println",
            "real",
            "recover",
            "delete",
          ],
        };
        return {
          name: "Go",
          aliases: ["golang"],
          keywords: n,
          illegal: "</",
          contains: [
            e.C_LINE_COMMENT_MODE,
            e.C_BLOCK_COMMENT_MODE,
            {
              className: "string",
              variants: [
                e.QUOTE_STRING_MODE,
                e.APOS_STRING_MODE,
                { begin: "`", end: "`" },
              ],
            },
            {
              className: "number",
              variants: [
                {
                  match:
                    /-?\b0[xX]\.[a-fA-F0-9](_?[a-fA-F0-9])*[pP][+-]?\d(_?\d)*i?/,
                  relevance: 0,
                },
                {
                  match:
                    /-?\b0[xX](_?[a-fA-F0-9])+((\.([a-fA-F0-9](_?[a-fA-F0-9])*)?)?[pP][+-]?\d(_?\d)*)?i?/,
                  relevance: 0,
                },
                { match: /-?\b0[oO](_?[0-7])*i?/, relevance: 0 },
                {
                  match: /-?\.\d(_?\d)*([eE][+-]?\d(_?\d)*)?i?/,
                  relevance: 0,
                },
                {
                  match: /-?\b\d(_?\d)*(\.(\d(_?\d)*)?)?([eE][+-]?\d(_?\d)*)?i?/,
                  relevance: 0,
                },
              ],
            },
            {
              begin: /:=/,
            },
            {
              className: "function",
              beginKeywords: "func",
              end: "\\s*(\\{|$)",
              excludeEnd: !0,
              contains: [
                e.TITLE_MODE,
                {
                  className: "params",
                  begin: /\(/,
                  end: /\)/,
                  endsParent: !0,
                  keywords: n,
                  illegal: /["']/,
                },
              ],
            },
          ],
        };
      },
      grmr_graphql: (e) => {
        const n = e.regex;
        return {
          name: "GraphQL",
          aliases: ["gql"],
          case_insensitive: !0,
          disableAutodetect: !1,
          keywords: {
            keyword: [
              "query",
              "mutation",
              "subscription",
              "type",
              "input",
              "schema",
              "directive",
              "interface",
              "union",
              "scalar",
              "fragment",
              "enum",
              "on",
            ],
            literal: ["true", "false", "null"],
          },
          contains: [
            e.HASH_COMMENT_MODE,
            e.QUOTE_STRING_MODE,
            e.NUMBER_MODE,
            {
              scope: "punctuation",
              match: /[.]{3}/,
              relevance: 0,
            },
            {
              scope: "punctuation",
              begin: /[\!\(\)\:\=\[\]\{\|\}]{1}/,
              relevance: 0,
            },
            {
              scope: "variable",
              begin: /\$/,
              end: /\W/,
              excludeEnd: !0,
              relevance: 0,
            },
            { scope: "meta", match: /@\w+/, excludeEnd: !0 },
            {
              scope: "symbol",
              begin: n.concat(/[_A-Za-z][_0-9A-Za-z]*/, n.lookahead(/\s*:/)),
              relevance: 0,
            },
          ],
          illegal: [/[;<']/, /BEGIN/],
        };
      },
      grmr_handlebars: (e) => {
        const n = e.regex,
          t = {
            $pattern: /[\w.\/]+/,
            built_in: [
              "action",
              "bindattr",
              "collection",
              "component",
              "concat",
              "debugger",
              "each",
              "each-in",
              "get",
              "hash",
              "if",
              "in",
              "input",
              "link-to",
              "loc",
              "log",
              "lookup",
              "mut",
              "outlet",
              "partial",
              "query-params",
              "render",
              "template",
              "textarea",
              "unbound",
              "unless",
              "view",
              "with",
              "yield",
            ],
          },
          s = /\[\]|\[[^\]]+\]/,
          a = /[^\s!"#%&'()*+,.\/;<=>@\[\\\]^`{|}~]+/,
          i = n.either(/""|"[^"]+"/, /''|'[^']+'/, s, a),
          r = n.concat(
            n.optional(/\.|\.\/|\//),
            i,
            n.anyNumberOfTimes(n.concat(/(\.|\/)/, i))
          ),
          o = n.concat("(", s, "|", a, ")(?==)"),
          c = {
            begin: r,
          },
          l = e.inherit(c, {
            keywords: {
              $pattern: /[\w.\/]+/,
              literal: ["true", "false", "undefined", "null"],
            },
          }),
          d = { begin: /\(/, end: /\)/ },
          p = {
            className: "attr",
            begin: o,
            relevance: 0,
            starts: {
              begin: /=/,
              end: /=/,
              starts: {
                contains: [
                  e.NUMBER_MODE,
                  e.QUOTE_STRING_MODE,
                  e.APOS_STRING_MODE,
                  l,
                  d,
                ],
              },
            },
          },
          m = {
            contains: [
              e.NUMBER_MODE,
              e.QUOTE_STRING_MODE,
              e.APOS_STRING_MODE,
              {
                begin: /as\s+\|/,
                keywords: { keyword: "as" },
                end: /\|/,
                contains: [{ begin: /\w+/ }],
              },
              p,
              l,
              d,
            ],
            returnEnd: !0,
          },
          u = e.inherit(c, {
            className: "name",
            keywords: t,
            starts: e.inherit(m, { end: /\)/ }),
          });
        d.contains = [u];
        const b = e.inherit(c, {
            keywords: t,
            className: "name",
            starts: e.inherit(m, { end: /\}\}/ }),
          }),
          g = e.inherit(c, { keywords: t, className: "name" }),
          v = e.inherit(c, {
            className: "name",
            keywords: t,
            starts: e.inherit(m, { end: /\}\}/ }),
          });
        return {
          name: "Handlebars",
          aliases: ["hbs", "html.hbs", "html.handlebars", "htmlbars"],
          case_insensitive: !0,
          subLanguage: "xml",
          contains: [
            { begin: /\\\{\{/, skip: !0 },
            { begin: /\\\\(?=\{\{)/, skip: !0 },
            e.COMMENT(/\{\{!--/, /--\}\}/),
            e.COMMENT(/\{\{!/, /\}\}/),
            {
              className: "template-tag",
              begin: /\{\{\{\{(?!\/)/,
              end: /\}\}\}\}/,
              contains: [b],
              starts: { end: /\{\{\{\{\//, returnEnd: !0, subLanguage: "xml" },
            },
            {
              className: "template-tag",
              begin: /\{\{\{\{\//,
              end: /\}\}\}\}/,
              contains: [g],
            },
            {
              className: "template-tag",
              begin: /\{\{#/,
              end: /\}\}/,
              contains: [b],
            },
            {
              className: "template-tag",
              begin: /\{\{(?=else\}\})/,
              end: /\}\}/,
              keywords: "else",
            },
            {
              className: "template-tag",
              begin: /\{\{(?=else if)/,
              end: /\}\}/,
              keywords: "else if",
            },
            {
              className: "template-tag",
              begin: /\{\{\//,
              end: /\}\}/,
              contains: [g],
            },
            {
              className: "template-variable",
              begin: /\{\{\{/,
              end: /\}\}\}/,
              contains: [v],
            },
            {
              className: "template-variable",
              begin: /\{\{/,
              end: /\}\}/,
              contains: [v],
            },
          ],
        };
      },
      grmr_haskell: (e) => {
        const n = "([0-9]_*)+",
          t = "([0-9a-fA-F]_*)+",
          s =
            "([!#$%&*+.\\/<=>?@\\\\^~-]|(?!([(),;\\[\\]`|{}]|[_:\"']))(\\p{S}|\\p{P}))",
          a = {
            variants: [
              e.COMMENT("--+", "$"),
              e.COMMENT(/\{-/, /-\}/, { contains: ["self"] }),
            ],
          },
          i = {
            className: "meta",
            begin: /\{-#/,
            end: /#-\}/,
          },
          r = { className: "meta", begin: "^#", end: "$" },
          o = { className: "type", begin: "\\b[A-Z][\\w']*", relevance: 0 },
          c = {
            begin: "\\(",
            end: "\\)",
            illegal: '"',
            contains: [
              i,
              r,
              {
                className: "type",
                begin: "\\b[A-Z][\\w]*(\\((\\.\\.|,|\\w+)\\))?",
              },
              e.inherit(e.TITLE_MODE, {
                begin: "[_a-z][\\w']*",
              }),
              a,
            ],
          },
          l = {
            className: "number",
            relevance: 0,
            variants: [
              {
                match: `\\b(${n})(\\.(${n}))?([eE][+-]?(${n}))?\\b`,
              },
              {
                match: `\\b0[xX]_*(${t})(\\.(${t}))?([pP][+-]?(${n}))?\\b`,
              },
              {
                match: "\\b0[oO](([0-7]_*)+)\\b",
              },
              { match: "\\b0[bB](([01]_*)+)\\b" },
            ],
          };
        return {
          name: "Haskell",
          aliases: ["hs"],
          keywords:
            "let in if then else case of where do module import hiding qualified type data newtype deriving class instance as default infix infixl infixr foreign export ccall stdcall cplusplus jvm dotnet safe unsafe family forall mdo proc rec",
          unicodeRegex: !0,
          contains: [
            {
              beginKeywords: "module",
              end: "where",
              keywords: "module where",
              contains: [c, a],
              illegal: "\\W\\.|;",
            },
            {
              begin: "\\bimport\\b",
              end: "$",
              keywords: "import qualified as hiding",
              contains: [c, a],
              illegal: "\\W\\.|;",
            },
            {
              className: "class",
              begin: "^(\\s*)?(class|instance)\\b",
              end: "where",
              keywords: "class family instance where",
              contains: [o, c, a],
            },
            {
              className: "class",
              begin: "\\b(data|(new)?type)\\b",
              end: "$",
              keywords: "data family type newtype deriving",
              contains: [
                i,
                o,
                c,
                { begin: /\{/, end: /\}/, contains: c.contains },
                a,
              ],
            },
            { beginKeywords: "default", end: "$", contains: [o, c, a] },
            {
              beginKeywords: "infix infixl infixr",
              end: "$",
              contains: [e.C_NUMBER_MODE, a],
            },
            {
              begin: "\\bforeign\\b",
              end: "$",
              keywords:
                "foreign import export ccall stdcall cplusplus jvm dotnet safe unsafe",
              contains: [o, e.QUOTE_STRING_MODE, a],
            },
            {
              className: "meta",
              begin: "#!\\/usr\\/bin\\/env runhaskell",
              end: "$",
            },
            i,
            r,
            {
              scope: "string",
              begin: /'(?=\\?.')/,
              end: /'/,
              contains: [{ scope: "char.escape", match: /\\./ }],
            },
            e.QUOTE_STRING_MODE,
            l,
            o,
            e.inherit(e.TITLE_MODE, { begin: "^[_a-z][\\w']*" }),
            {
              begin: `(?!-)${s}--+|--+(?!-)${s}`,
            },
            a,
            { begin: "->|<-" },
          ],
        };
      },
      grmr_http: (e) => {
        const n = "HTTP/([32]|1\\.[01])",
          t = {
            className: "attribute",
            begin: e.regex.concat("^", /[A-Za-z][A-Za-z0-9-]*/, "(?=\\:\\s)"),
            starts: {
              contains: [
                {
                  className: "punctuation",
                  begin: /: /,
                  relevance: 0,
                  starts: { end: "$", relevance: 0 },
                },
              ],
            },
          },
          s = [
            t,
            { begin: "\\n\\n", starts: { subLanguage: [], endsWithParent: !0 } },
          ];
        return {
          name: "HTTP",
          aliases: ["https"],
          illegal: /\S/,
          contains: [
            {
              begin: "^(?=" + n + " \\d{3})",
              end: /$/,
              contains: [
                { className: "meta", begin: n },
                {
                  className: "number",
                  begin: "\\b\\d{3}\\b",
                },
              ],
              starts: { end: /\b\B/, illegal: /\S/, contains: s },
            },
            {
              begin: "(?=^[A-Z]+ (.*?) " + n + "$)",
              end: /$/,
              contains: [
                {
                  className: "string",
                  begin: " ",
                  end: " ",
                  excludeBegin: !0,
                  excludeEnd: !0,
                },
                {
                  className: "meta",
                  begin: n,
                },
                { className: "keyword", begin: "[A-Z]+" },
              ],
              starts: {
                end: /\b\B/,
                illegal: /\S/,
                contains: s,
              },
            },
            e.inherit(t, { relevance: 0 }),
          ],
        };
      },
      grmr_ini: (e) => {
        const n = e.regex,
          t = {
            className: "number",
            relevance: 0,
            variants: [
              {
                begin: /([+-]+)?[\d]+_[\d_]+/,
              },
              { begin: e.NUMBER_RE },
            ],
          },
          s = e.COMMENT();
        s.variants = [
          {
            begin: /;/,
            end: /$/,
          },
          { begin: /#/, end: /$/ },
        ];
        const a = {
            className: "variable",
            variants: [{ begin: /\$[\w\d"][\w\d_]*/ }, { begin: /\$\{(.*?)\}/ }],
          },
          i = {
            className: "literal",
            begin: /\bon|off|true|false|yes|no\b/,
          },
          r = {
            className: "string",
            contains: [e.BACKSLASH_ESCAPE],
            variants: [
              { begin: "'''", end: "'''", relevance: 10 },
              {
                begin: '"""',
                end: '"""',
                relevance: 10,
              },
              { begin: '"', end: '"' },
              { begin: "'", end: "'" },
            ],
          },
          o = {
            begin: /\[/,
            end: /\]/,
            contains: [s, i, a, r, t, "self"],
            relevance: 0,
          },
          c = n.either(/[A-Za-z0-9_-]+/, /"(\\"|[^"])*"/, /'[^']*'/);
        return {
          name: "TOML, also INI",
          aliases: ["toml"],
          case_insensitive: !0,
          illegal: /\S/,
          contains: [
            s,
            { className: "section", begin: /\[+/, end: /\]+/ },
            {
              begin: n.concat(
                c,
                "(\\s*\\.\\s*",
                c,
                ")*",
                n.lookahead(/\s*=\s*[^#\s]/)
              ),
              className: "attr",
              starts: { end: /$/, contains: [s, o, i, a, r, t] },
            },
          ],
        };
      },
      grmr_java: (e) => {
        const n = e.regex,
          t = "[\xc0-\u02b8a-zA-Z_$][\xc0-\u02b8a-zA-Z_$0-9]*",
          s = t + be("(?:<" + t + "~~~(?:\\s*,\\s*" + t + "~~~)*>)?", /~~~/g, 2),
          a = {
            keyword: [
              "synchronized",
              "abstract",
              "private",
              "var",
              "static",
              "if",
              "const ",
              "for",
              "while",
              "strictfp",
              "finally",
              "protected",
              "import",
              "native",
              "final",
              "void",
              "enum",
              "else",
              "break",
              "transient",
              "catch",
              "instanceof",
              "volatile",
              "case",
              "assert",
              "package",
              "default",
              "public",
              "try",
              "switch",
              "continue",
              "throws",
              "protected",
              "public",
              "private",
              "module",
              "requires",
              "exports",
              "do",
              "sealed",
              "yield",
              "permits",
              "goto",
              "when",
            ],
            literal: ["false", "true", "null"],
            type: [
              "char",
              "boolean",
              "long",
              "float",
              "int",
              "byte",
              "short",
              "double",
            ],
            built_in: ["super", "this"],
          },
          i = {
            className: "meta",
            begin: "@" + t,
            contains: [
              {
                begin: /\(/,
                end: /\)/,
                contains: ["self"],
              },
            ],
          },
          r = {
            className: "params",
            begin: /\(/,
            end: /\)/,
            keywords: a,
            relevance: 0,
            contains: [e.C_BLOCK_COMMENT_MODE],
            endsParent: !0,
          };
        return {
          name: "Java",
          aliases: ["jsp"],
          keywords: a,
          illegal: /<\/|#/,
          contains: [
            e.COMMENT("/\\*\\*", "\\*/", {
              relevance: 0,
              contains: [
                { begin: /\w+@/, relevance: 0 },
                { className: "doctag", begin: "@[A-Za-z]+" },
              ],
            }),
            {
              begin: /import java\.[a-z]+\./,
              keywords: "import",
              relevance: 2,
            },
            e.C_LINE_COMMENT_MODE,
            e.C_BLOCK_COMMENT_MODE,
            {
              begin: /"""/,
              end: /"""/,
              className: "string",
              contains: [e.BACKSLASH_ESCAPE],
            },
            e.APOS_STRING_MODE,
            e.QUOTE_STRING_MODE,
            {
              match: [
                /\b(?:class|interface|enum|extends|implements|new)/,
                /\s+/,
                t,
              ],
              className: {
                1: "keyword",
                3: "title.class",
              },
            },
            { match: /non-sealed/, scope: "keyword" },
            {
              begin: [n.concat(/(?!else)/, t), /\s+/, t, /\s+/, /=(?!=)/],
              className: { 1: "type", 3: "variable", 5: "operator" },
            },
            {
              begin: [/record/, /\s+/, t],
              className: { 1: "keyword", 3: "title.class" },
              contains: [r, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE],
            },
            {
              beginKeywords: "new throw return else",
              relevance: 0,
            },
            {
              begin: ["(?:" + s + "\\s+)", e.UNDERSCORE_IDENT_RE, /\s*(?=\()/],
              className: {
                2: "title.function",
              },
              keywords: a,
              contains: [
                {
                  className: "params",
                  begin: /\(/,
                  end: /\)/,
                  keywords: a,
                  relevance: 0,
                  contains: [
                    i,
                    e.APOS_STRING_MODE,
                    e.QUOTE_STRING_MODE,
                    ue,
                    e.C_BLOCK_COMMENT_MODE,
                  ],
                },
                e.C_LINE_COMMENT_MODE,
                e.C_BLOCK_COMMENT_MODE,
              ],
            },
            ue,
            i,
          ],
        };
      },
      grmr_javascript: Ne,
      grmr_json: (e) => {
        const n = ["true", "false", "null"],
          t = { scope: "literal", beginKeywords: n.join(" ") };
        return {
          name: "JSON",
          aliases: ["jsonc"],
          keywords: {
            literal: n,
          },
          contains: [
            {
              className: "attr",
              begin: /"(\\.|[^\\"\r\n])*"(?=\s*:)/,
              relevance: 1.01,
            },
            { match: /[{}[\],:]/, className: "punctuation", relevance: 0 },
            e.QUOTE_STRING_MODE,
            t,
            e.C_NUMBER_MODE,
            e.C_LINE_COMMENT_MODE,
            e.C_BLOCK_COMMENT_MODE,
          ],
          illegal: "\\S",
        };
      },
      grmr_julia: (e) => {
        const n = "[A-Za-z_\\u00A1-\\uFFFF][A-Za-z_0-9\\u00A1-\\uFFFF]*",
          t = {
            $pattern: n,
            keyword: [
              "baremodule",
              "begin",
              "break",
              "catch",
              "ccall",
              "const",
              "continue",
              "do",
              "else",
              "elseif",
              "end",
              "export",
              "false",
              "finally",
              "for",
              "function",
              "global",
              "if",
              "import",
              "in",
              "isa",
              "let",
              "local",
              "macro",
              "module",
              "quote",
              "return",
              "true",
              "try",
              "using",
              "where",
              "while",
            ],
            literal: [
              "ARGS",
              "C_NULL",
              "DEPOT_PATH",
              "ENDIAN_BOM",
              "ENV",
              "Inf",
              "Inf16",
              "Inf32",
              "Inf64",
              "InsertionSort",
              "LOAD_PATH",
              "MergeSort",
              "NaN",
              "NaN16",
              "NaN32",
              "NaN64",
              "PROGRAM_FILE",
              "QuickSort",
              "RoundDown",
              "RoundFromZero",
              "RoundNearest",
              "RoundNearestTiesAway",
              "RoundNearestTiesUp",
              "RoundToZero",
              "RoundUp",
              "VERSION|0",
              "devnull",
              "false",
              "im",
              "missing",
              "nothing",
              "pi",
              "stderr",
              "stdin",
              "stdout",
              "true",
              "undef",
              "\u03c0",
              "\u212f",
            ],
            built_in: [
              "AbstractArray",
              "AbstractChannel",
              "AbstractChar",
              "AbstractDict",
              "AbstractDisplay",
              "AbstractFloat",
              "AbstractIrrational",
              "AbstractMatrix",
              "AbstractRange",
              "AbstractSet",
              "AbstractString",
              "AbstractUnitRange",
              "AbstractVecOrMat",
              "AbstractVector",
              "Any",
              "ArgumentError",
              "Array",
              "AssertionError",
              "BigFloat",
              "BigInt",
              "BitArray",
              "BitMatrix",
              "BitSet",
              "BitVector",
              "Bool",
              "BoundsError",
              "CapturedException",
              "CartesianIndex",
              "CartesianIndices",
              "Cchar",
              "Cdouble",
              "Cfloat",
              "Channel",
              "Char",
              "Cint",
              "Cintmax_t",
              "Clong",
              "Clonglong",
              "Cmd",
              "Colon",
              "Complex",
              "ComplexF16",
              "ComplexF32",
              "ComplexF64",
              "CompositeException",
              "Condition",
              "Cptrdiff_t",
              "Cshort",
              "Csize_t",
              "Cssize_t",
              "Cstring",
              "Cuchar",
              "Cuint",
              "Cuintmax_t",
              "Culong",
              "Culonglong",
              "Cushort",
              "Cvoid",
              "Cwchar_t",
              "Cwstring",
              "DataType",
              "DenseArray",
              "DenseMatrix",
              "DenseVecOrMat",
              "DenseVector",
              "Dict",
              "DimensionMismatch",
              "Dims",
              "DivideError",
              "DomainError",
              "EOFError",
              "Enum",
              "ErrorException",
              "Exception",
              "ExponentialBackOff",
              "Expr",
              "Float16",
              "Float32",
              "Float64",
              "Function",
              "GlobalRef",
              "HTML",
              "IO",
              "IOBuffer",
              "IOContext",
              "IOStream",
              "IdDict",
              "IndexCartesian",
              "IndexLinear",
              "IndexStyle",
              "InexactError",
              "InitError",
              "Int",
              "Int128",
              "Int16",
              "Int32",
              "Int64",
              "Int8",
              "Integer",
              "InterruptException",
              "InvalidStateException",
              "Irrational",
              "KeyError",
              "LinRange",
              "LineNumberNode",
              "LinearIndices",
              "LoadError",
              "MIME",
              "Matrix",
              "Method",
              "MethodError",
              "Missing",
              "MissingException",
              "Module",
              "NTuple",
              "NamedTuple",
              "Nothing",
              "Number",
              "OrdinalRange",
              "OutOfMemoryError",
              "OverflowError",
              "Pair",
              "PartialQuickSort",
              "PermutedDimsArray",
              "Pipe",
              "ProcessFailedException",
              "Ptr",
              "QuoteNode",
              "Rational",
              "RawFD",
              "ReadOnlyMemoryError",
              "Real",
              "ReentrantLock",
              "Ref",
              "Regex",
              "RegexMatch",
              "RoundingMode",
              "SegmentationFault",
              "Set",
              "Signed",
              "Some",
              "StackOverflowError",
              "StepRange",
              "StepRangeLen",
              "StridedArray",
              "StridedMatrix",
              "StridedVecOrMat",
              "StridedVector",
              "String",
              "StringIndexError",
              "SubArray",
              "SubString",
              "SubstitutionString",
              "Symbol",
              "SystemError",
              "Task",
              "TaskFailedException",
              "Text",
              "TextDisplay",
              "Timer",
              "Tuple",
              "Type",
              "TypeError",
              "TypeVar",
              "UInt",
              "UInt128",
              "UInt16",
              "UInt32",
              "UInt64",
              "UInt8",
              "UndefInitializer",
              "UndefKeywordError",
              "UndefRefError",
              "UndefVarError",
              "Union",
              "UnionAll",
              "UnitRange",
              "Unsigned",
              "Val",
              "Vararg",
              "VecElement",
              "VecOrMat",
              "Vector",
              "VersionNumber",
              "WeakKeyDict",
              "WeakRef",
            ],
          },
          s = { keywords: t, illegal: /<\// },
          a = { className: "subst", begin: /\$\(/, end: /\)/, keywords: t },
          i = { className: "variable", begin: "\\$" + n },
          r = {
            className: "string",
            contains: [e.BACKSLASH_ESCAPE, a, i],
            variants: [
              { begin: /\w*"""/, end: /"""\w*/, relevance: 10 },
              { begin: /\w*"/, end: /"\w*/ },
            ],
          },
          o = {
            className: "string",
            contains: [e.BACKSLASH_ESCAPE, a, i],
            begin: "`",
            end: "`",
          },
          c = { className: "meta", begin: "@" + n };
        return (
          (s.name = "Julia"),
          (s.contains = [
            {
              className: "number",
              begin:
                /(\b0x[\d_]*(\.[\d_]*)?|0x\.\d[\d_]*)p[-+]?\d+|\b0[box][a-fA-F0-9][a-fA-F0-9_]*|(\b\d[\d_]*(\.[\d_]*)?|\.\d[\d_]*)([eEfF][-+]?\d+)?/,
              relevance: 0,
            },
            { className: "string", begin: /'(.|\\[xXuU][a-zA-Z0-9]+)'/ },
            r,
            o,
            c,
            {
              className: "comment",
              variants: [
                { begin: "#=", end: "=#", relevance: 10 },
                { begin: "#", end: "$" },
              ],
            },
            e.HASH_COMMENT_MODE,
            {
              className: "keyword",
              begin:
                "\\b(((abstract|primitive)\\s+)type|(mutable\\s+)?struct)\\b",
            },
            { begin: /<:/ },
          ]),
          (a.contains = s.contains),
          s
        );
      },
      grmr_kotlin: (e) => {
        const n = {
            keyword:
              "abstract as val var vararg get set class object open private protected public noinline crossinline dynamic final enum if else do while for when throw try catch finally import package is in fun override companion reified inline lateinit init interface annotation data sealed internal infix operator out by constructor super tailrec where const inner suspend typealias external expect actual",
            built_in:
              "Byte Short Char Int Long Boolean Float Double Void Unit Nothing",
            literal: "true false null",
          },
          t = { className: "symbol", begin: e.UNDERSCORE_IDENT_RE + "@" },
          s = {
            className: "subst",
            begin: /\$\{/,
            end: /\}/,
            contains: [e.C_NUMBER_MODE],
          },
          a = {
            className: "variable",
            begin: "\\$" + e.UNDERSCORE_IDENT_RE,
          },
          i = {
            className: "string",
            variants: [
              { begin: '"""', end: '"""(?=[^"])', contains: [a, s] },
              {
                begin: "'",
                end: "'",
                illegal: /\n/,
                contains: [e.BACKSLASH_ESCAPE],
              },
              {
                begin: '"',
                end: '"',
                illegal: /\n/,
                contains: [e.BACKSLASH_ESCAPE, a, s],
              },
            ],
          };
        s.contains.push(i);
        const r = {
            className: "meta",
            begin:
              "@(?:file|property|field|get|set|receiver|param|setparam|delegate)\\s*:(?:\\s*" +
              e.UNDERSCORE_IDENT_RE +
              ")?",
          },
          o = {
            className: "meta",
            begin: "@" + e.UNDERSCORE_IDENT_RE,
            contains: [
              {
                begin: /\(/,
                end: /\)/,
                contains: [e.inherit(i, { className: "string" }), "self"],
              },
            ],
          },
          c = ue,
          l = e.COMMENT("/\\*", "\\*/", { contains: [e.C_BLOCK_COMMENT_MODE] }),
          d = {
            variants: [
              { className: "type", begin: e.UNDERSCORE_IDENT_RE },
              { begin: /\(/, end: /\)/, contains: [] },
            ],
          },
          p = d;
        return (
          (p.variants[1].contains = [d]),
          (d.variants[1].contains = [p]),
          {
            name: "Kotlin",
            aliases: ["kt", "kts"],
            keywords: n,
            contains: [
              e.COMMENT("/\\*\\*", "\\*/", {
                relevance: 0,
                contains: [{ className: "doctag", begin: "@[A-Za-z]+" }],
              }),
              e.C_LINE_COMMENT_MODE,
              l,
              {
                className: "keyword",
                begin: /\b(break|continue|return|this)\b/,
                starts: { contains: [{ className: "symbol", begin: /@\w+/ }] },
              },
              t,
              r,
              o,
              {
                className: "function",
                beginKeywords: "fun",
                end: "[(]|$",
                returnBegin: !0,
                excludeEnd: !0,
                keywords: n,
                relevance: 5,
                contains: [
                  {
                    begin: e.UNDERSCORE_IDENT_RE + "\\s*\\(",
                    returnBegin: !0,
                    relevance: 0,
                    contains: [e.UNDERSCORE_TITLE_MODE],
                  },
                  {
                    className: "type",
                    begin: /</,
                    end: />/,
                    keywords: "reified",
                    relevance: 0,
                  },
                  {
                    className: "params",
                    begin: /\(/,
                    end: /\)/,
                    endsParent: !0,
                    keywords: n,
                    relevance: 0,
                    contains: [
                      {
                        begin: /:/,
                        end: /[=,\/]/,
                        endsWithParent: !0,
                        contains: [d, e.C_LINE_COMMENT_MODE, l],
                        relevance: 0,
                      },
                      e.C_LINE_COMMENT_MODE,
                      l,
                      r,
                      o,
                      i,
                      e.C_NUMBER_MODE,
                    ],
                  },
                  l,
                ],
              },
              {
                begin: [/class|interface|trait/, /\s+/, e.UNDERSCORE_IDENT_RE],
                beginScope: {
                  3: "title.class",
                },
                keywords: "class interface trait",
                end: /[:\{(]|$/,
                excludeEnd: !0,
                illegal: "extends implements",
                contains: [
                  {
                    beginKeywords:
                      "public protected internal private constructor",
                  },
                  e.UNDERSCORE_TITLE_MODE,
                  {
                    className: "type",
                    begin: /</,
                    end: />/,
                    excludeBegin: !0,
                    excludeEnd: !0,
                    relevance: 0,
                  },
                  {
                    className: "type",
                    begin: /[,:]\s*/,
                    end: /[<\(,){\s]|$/,
                    excludeBegin: !0,
                    returnEnd: !0,
                  },
                  r,
                  o,
                ],
              },
              i,
              {
                className: "meta",
                begin: "^#!/usr/bin/env",
                end: "$",
                illegal: "\n",
              },
              c,
            ],
          }
        );
      },
      grmr_less: (e) => {
        const n = se(e),
          t = le,
          s = "[\\w-]+",
          a = "(" + s + "|@\\{" + s + "\\})",
          i = [],
          r = [],
          o = (e) => ({
            className: "string",
            begin: "~?" + e + ".*?" + e,
          }),
          c = (e, n, t) => ({ className: e, begin: n, relevance: t }),
          l = {
            $pattern: /[a-z-]+/,
            keyword: "and or not only",
            attribute: ie.join(" "),
          },
          d = {
            begin: "\\(",
            end: "\\)",
            contains: r,
            keywords: l,
            relevance: 0,
          };
        r.push(
          e.C_LINE_COMMENT_MODE,
          e.C_BLOCK_COMMENT_MODE,
          o("'"),
          o('"'),
          n.CSS_NUMBER_MODE,
          {
            begin: "(url|data-uri)\\(",
            starts: { className: "string", end: "[\\)\\n]", excludeEnd: !0 },
          },
          n.HEXCOLOR,
          d,
          c("variable", "@@?" + s, 10),
          c("variable", "@\\{" + s + "\\}"),
          c("built_in", "~?`[^`]*?`"),
          {
            className: "attribute",
            begin: s + "\\s*:",
            end: ":",
            returnBegin: !0,
            excludeEnd: !0,
          },
          n.IMPORTANT,
          { beginKeywords: "and not" },
          n.FUNCTION_DISPATCH
        );
        const p = r.concat({
            begin: /\{/,
            end: /\}/,
            contains: i,
          }),
          m = {
            beginKeywords: "when",
            endsWithParent: !0,
            contains: [{ beginKeywords: "and not" }].concat(r),
          },
          u = {
            begin: a + "\\s*:",
            returnBegin: !0,
            end: /[;}]/,
            relevance: 0,
            contains: [
              { begin: /-(webkit|moz|ms|o)-/ },
              n.CSS_VARIABLE,
              {
                className: "attribute",
                begin: "\\b(" + ce.join("|") + ")\\b",
                end: /(?=:)/,
                starts: {
                  endsWithParent: !0,
                  illegal: "[<=$]",
                  relevance: 0,
                  contains: r,
                },
              },
            ],
          },
          b = {
            className: "keyword",
            begin:
              "@(import|media|charset|font-face|(-[a-z]+-)?keyframes|supports|document|namespace|page|viewport|host)\\b",
            starts: {
              end: "[;{}]",
              keywords: l,
              returnEnd: !0,
              contains: r,
              relevance: 0,
            },
          },
          g = {
            className: "variable",
            variants: [
              { begin: "@" + s + "\\s*:", relevance: 15 },
              { begin: "@" + s },
            ],
            starts: { end: "[;}]", returnEnd: !0, contains: p },
          },
          v = {
            variants: [
              {
                begin: "[\\.#:&\\[>]",
                end: "[;{}]",
              },
              { begin: a, end: /\{/ },
            ],
            returnBegin: !0,
            returnEnd: !0,
            illegal: "[<='$\"]",
            relevance: 0,
            contains: [
              e.C_LINE_COMMENT_MODE,
              e.C_BLOCK_COMMENT_MODE,
              m,
              c("keyword", "all\\b"),
              c("variable", "@\\{" + s + "\\}"),
              {
                begin: "\\b(" + ae.join("|") + ")\\b",
                className: "selector-tag",
              },
              n.CSS_NUMBER_MODE,
              c("selector-tag", a, 0),
              c("selector-id", "#" + a),
              c("selector-class", "\\." + a, 0),
              c("selector-tag", "&", 0),
              n.ATTRIBUTE_SELECTOR_MODE,
              {
                className: "selector-pseudo",
                begin: ":(" + re.join("|") + ")",
              },
              {
                className: "selector-pseudo",
                begin: ":(:)?(" + oe.join("|") + ")",
              },
              { begin: /\(/, end: /\)/, relevance: 0, contains: p },
              { begin: "!important" },
              n.FUNCTION_DISPATCH,
            ],
          },
          _ = {
            begin: s + ":(:)?" + `(${t.join("|")})`,
            returnBegin: !0,
            contains: [v],
          };
        return (
          i.push(
            e.C_LINE_COMMENT_MODE,
            e.C_BLOCK_COMMENT_MODE,
            b,
            g,
            _,
            u,
            v,
            m,
            n.FUNCTION_DISPATCH
          ),
          {
            name: "Less",
            case_insensitive: !0,
            illegal: "[=>'/<($\"]",
            contains: i,
          }
        );
      },
      grmr_lua: (e) => {
        const n = "\\[=*\\[",
          t = "\\]=*\\]",
          s = { begin: n, end: t, contains: ["self"] },
          a = [
            e.COMMENT("--(?!" + n + ")", "$"),
            e.COMMENT("--" + n, t, { contains: [s], relevance: 10 }),
          ];
        return {
          name: "Lua",
          keywords: {
            $pattern: e.UNDERSCORE_IDENT_RE,
            literal: "true false nil",
            keyword:
              "and break do else elseif end for goto if in local not or repeat return then until while",
            built_in:
              "_G _ENV _VERSION __index __newindex __mode __call __metatable __tostring __len __gc __add __sub __mul __div __mod __pow __concat __unm __eq __lt __le assert collectgarbage dofile error getfenv getmetatable ipairs load loadfile loadstring module next pairs pcall print rawequal rawget rawset require select setfenv setmetatable tonumber tostring type unpack xpcall arg self coroutine resume yield status wrap create running debug getupvalue debug sethook getmetatable gethook setmetatable setlocal traceback setfenv getinfo setupvalue getlocal getregistry getfenv io lines write close flush open output type read stderr stdin input stdout popen tmpfile math log max acos huge ldexp pi cos tanh pow deg tan cosh sinh random randomseed frexp ceil floor rad abs sqrt modf asin min mod fmod log10 atan2 exp sin atan os exit setlocale date getenv difftime remove time clock tmpname rename execute package preload loadlib loaded loaders cpath config path seeall string sub upper len gfind rep find match char dump gmatch reverse byte format gsub lower table setn insert getn foreachi maxn foreach concat sort remove",
          },
          contains: a.concat([
            {
              className: "function",
              beginKeywords: "function",
              end: "\\)",
              contains: [
                e.inherit(e.TITLE_MODE, {
                  begin: "([_a-zA-Z]\\w*\\.)*([_a-zA-Z]\\w*:)?[_a-zA-Z]\\w*",
                }),
                {
                  className: "params",
                  begin: "\\(",
                  endsWithParent: !0,
                  contains: a,
                },
              ].concat(a),
            },
            e.C_NUMBER_MODE,
            e.APOS_STRING_MODE,
            e.QUOTE_STRING_MODE,
            {
              className: "string",
              begin: n,
              end: t,
              contains: [s],
              relevance: 5,
            },
          ]),
        };
      },
      grmr_makefile: (e) => {
        const n = {
            className: "variable",
            variants: [
              {
                begin: "\\$\\(" + e.UNDERSCORE_IDENT_RE + "\\)",
                contains: [e.BACKSLASH_ESCAPE],
              },
              { begin: /\$[@%<?\^\+\*]/ },
            ],
          },
          t = {
            className: "string",
            begin: /"/,
            end: /"/,
            contains: [e.BACKSLASH_ESCAPE, n],
          },
          s = {
            className: "variable",
            begin: /\$\([\w-]+\s/,
            end: /\)/,
            keywords: {
              built_in:
                "subst patsubst strip findstring filter filter-out sort word wordlist firstword lastword dir notdir suffix basename addsuffix addprefix join wildcard realpath abspath error warning shell origin flavor foreach if or and call eval file value",
            },
            contains: [n, t],
          },
          a = { begin: "^" + e.UNDERSCORE_IDENT_RE + "\\s*(?=[:+?]?=)" },
          i = {
            className: "section",
            begin: /^[^\s]+:/,
            end: /$/,
            contains: [n],
          };
        return {
          name: "Makefile",
          aliases: ["mk", "mak", "make"],
          keywords: {
            $pattern: /[\w-]+/,
            keyword:
              "define endef undefine ifdef ifndef ifeq ifneq else endif include -include sinclude override export unexport private vpath",
          },
          contains: [
            e.HASH_COMMENT_MODE,
            n,
            t,
            s,
            a,
            {
              className: "meta",
              begin: /^\.PHONY:/,
              end: /$/,
              keywords: { $pattern: /[\.\w]+/, keyword: ".PHONY" },
            },
            i,
          ],
        };
      },
      grmr_markdown: (e) => {
        const n = {
            begin: /<\/?[A-Za-z_]/,
            end: ">",
            subLanguage: "xml",
            relevance: 0,
          },
          t = {
            variants: [
              { begin: /\[.+?\]\[.*?\]/, relevance: 0 },
              {
                begin:
                  /\[.+?\]\(((data|javascript|mailto):|(?:http|ftp)s?:\/\/).*?\)/,
                relevance: 2,
              },
              {
                begin: e.regex.concat(
                  /\[.+?\]\(/,
                  /[A-Za-z][A-Za-z0-9+.-]*/,
                  /:\/\/.*?\)/
                ),
                relevance: 2,
              },
              { begin: /\[.+?\]\([./?&#].*?\)/, relevance: 1 },
              {
                begin: /\[.*?\]\(.*?\)/,
                relevance: 0,
              },
            ],
            returnBegin: !0,
            contains: [
              { match: /\[(?=\])/ },
              {
                className: "string",
                relevance: 0,
                begin: "\\[",
                end: "\\]",
                excludeBegin: !0,
                returnEnd: !0,
              },
              {
                className: "link",
                relevance: 0,
                begin: "\\]\\(",
                end: "\\)",
                excludeBegin: !0,
                excludeEnd: !0,
              },
              {
                className: "symbol",
                relevance: 0,
                begin: "\\]\\[",
                end: "\\]",
                excludeBegin: !0,
                excludeEnd: !0,
              },
            ],
          },
          s = {
            className: "strong",
            contains: [],
            variants: [
              { begin: /_{2}(?!\s)/, end: /_{2}/ },
              { begin: /\*{2}(?!\s)/, end: /\*{2}/ },
            ],
          },
          a = {
            className: "emphasis",
            contains: [],
            variants: [
              { begin: /\*(?![*\s])/, end: /\*/ },
              {
                begin: /_(?![_\s])/,
                end: /_/,
                relevance: 0,
              },
            ],
          },
          i = e.inherit(s, { contains: [] }),
          r = e.inherit(a, { contains: [] });
        s.contains.push(r), a.contains.push(i);
        let o = [n, t];
        return (
          [s, a, i, r].forEach((e) => {
            e.contains = e.contains.concat(o);
          }),
          (o = o.concat(s, a)),
          {
            name: "Markdown",
            aliases: ["md", "mkdown", "mkd"],
            contains: [
              {
                className: "section",
                variants: [
                  { begin: "^#{1,6}", end: "$", contains: o },
                  {
                    begin: "(?=^.+?\\n[=-]{2,}$)",
                    contains: [
                      { begin: "^[=-]*$" },
                      { begin: "^", end: "\\n", contains: o },
                    ],
                  },
                ],
              },
              n,
              {
                className: "bullet",
                begin: "^[ \t]*([*+-]|(\\d+\\.))(?=\\s+)",
                end: "\\s+",
                excludeEnd: !0,
              },
              s,
              a,
              { className: "quote", begin: "^>\\s+", contains: o, end: "$" },
              {
                className: "code",
                variants: [
                  { begin: "(`{3,})[^`](.|\\n)*?\\1`*[ ]*" },
                  {
                    begin: "(~{3,})[^~](.|\\n)*?\\1~*[ ]*",
                  },
                  { begin: "```", end: "```+[ ]*$" },
                  {
                    begin: "~~~",
                    end: "~~~+[ ]*$",
                  },
                  { begin: "`.+?`" },
                  {
                    begin: "(?=^( {4}|\\t))",
                    contains: [{ begin: "^( {4}|\\t)", end: "(\\n)$" }],
                    relevance: 0,
                  },
                ],
              },
              {
                begin: "^[-\\*]{3,}",
                end: "$",
              },
              t,
              {
                begin: /^\[[^\n]+\]:/,
                returnBegin: !0,
                contains: [
                  {
                    className: "symbol",
                    begin: /\[/,
                    end: /\]/,
                    excludeBegin: !0,
                    excludeEnd: !0,
                  },
                  {
                    className: "link",
                    begin: /:\s*/,
                    end: /$/,
                    excludeBegin: !0,
                  },
                ],
              },
              {
                scope: "literal",
                match: /&([a-zA-Z0-9]+|#[0-9]{1,7}|#[Xx][0-9a-fA-F]{1,6});/,
              },
            ],
          }
        );
      },
      grmr_nginx: (e) => {
        const n = e.regex,
          t = {
            className: "variable",
            variants: [
              { begin: /\$\d+/ },
              {
                begin: /\$\{\w+\}/,
              },
              { begin: n.concat(/[$@]/, e.UNDERSCORE_IDENT_RE) },
            ],
          },
          s = {
            endsWithParent: !0,
            keywords: {
              $pattern: /[a-z_]{2,}|\/dev\/poll/,
              literal: [
                "on",
                "off",
                "yes",
                "no",
                "true",
                "false",
                "none",
                "blocked",
                "debug",
                "info",
                "notice",
                "warn",
                "error",
                "crit",
                "select",
                "break",
                "last",
                "permanent",
                "redirect",
                "kqueue",
                "rtsig",
                "epoll",
                "poll",
                "/dev/poll",
              ],
            },
            relevance: 0,
            illegal: "=>",
            contains: [
              e.HASH_COMMENT_MODE,
              {
                className: "string",
                contains: [e.BACKSLASH_ESCAPE, t],
                variants: [
                  { begin: /"/, end: /"/ },
                  { begin: /'/, end: /'/ },
                ],
              },
              {
                begin: "([a-z]+):/",
                end: "\\s",
                endsWithParent: !0,
                excludeEnd: !0,
                contains: [t],
              },
              {
                className: "regexp",
                contains: [e.BACKSLASH_ESCAPE, t],
                variants: [
                  { begin: "\\s\\^", end: "\\s|\\{|;", returnEnd: !0 },
                  { begin: "~\\*?\\s+", end: "\\s|\\{|;", returnEnd: !0 },
                  {
                    begin: "\\*(\\.[a-z\\-]+)+",
                  },
                  { begin: "([a-z\\-]+\\.)+\\*" },
                ],
              },
              {
                className: "number",
                begin:
                  "\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}(:\\d{1,5})?\\b",
              },
              {
                className: "number",
                begin: "\\b\\d+[kKmMgGdshdwy]?\\b",
                relevance: 0,
              },
              t,
            ],
          };
        return {
          name: "Nginx config",
          aliases: ["nginxconf"],
          contains: [
            e.HASH_COMMENT_MODE,
            {
              beginKeywords: "upstream location",
              end: /;|\{/,
              contains: s.contains,
              keywords: {
                section: "upstream location",
              },
            },
            {
              className: "section",
              begin: n.concat(e.UNDERSCORE_IDENT_RE + n.lookahead(/\s+\{/)),
              relevance: 0,
            },
            {
              begin: n.lookahead(e.UNDERSCORE_IDENT_RE + "\\s"),
              end: ";|\\{",
              contains: [
                {
                  className: "attribute",
                  begin: e.UNDERSCORE_IDENT_RE,
                  starts: s,
                },
              ],
              relevance: 0,
            },
          ],
          illegal: "[^\\s\\}\\{]",
        };
      },
      grmr_nim: (e) => ({
        name: "Nim",
        keywords: {
          keyword: [
            "addr",
            "and",
            "as",
            "asm",
            "bind",
            "block",
            "break",
            "case",
            "cast",
            "const",
            "continue",
            "converter",
            "discard",
            "distinct",
            "div",
            "do",
            "elif",
            "else",
            "end",
            "enum",
            "except",
            "export",
            "finally",
            "for",
            "from",
            "func",
            "generic",
            "guarded",
            "if",
            "import",
            "in",
            "include",
            "interface",
            "is",
            "isnot",
            "iterator",
            "let",
            "macro",
            "method",
            "mixin",
            "mod",
            "nil",
            "not",
            "notin",
            "object",
            "of",
            "or",
            "out",
            "proc",
            "ptr",
            "raise",
            "ref",
            "return",
            "shared",
            "shl",
            "shr",
            "static",
            "template",
            "try",
            "tuple",
            "type",
            "using",
            "var",
            "when",
            "while",
            "with",
            "without",
            "xor",
            "yield",
          ],
          literal: ["true", "false"],
          type: [
            "int",
            "int8",
            "int16",
            "int32",
            "int64",
            "uint",
            "uint8",
            "uint16",
            "uint32",
            "uint64",
            "float",
            "float32",
            "float64",
            "bool",
            "char",
            "string",
            "cstring",
            "pointer",
            "expr",
            "stmt",
            "void",
            "auto",
            "any",
            "range",
            "array",
            "openarray",
            "varargs",
            "seq",
            "set",
            "clong",
            "culong",
            "cchar",
            "cschar",
            "cshort",
            "cint",
            "csize",
            "clonglong",
            "cfloat",
            "cdouble",
            "clongdouble",
            "cuchar",
            "cushort",
            "cuint",
            "culonglong",
            "cstringarray",
            "semistatic",
          ],
          built_in: ["stdin", "stdout", "stderr", "result"],
        },
        contains: [
          { className: "meta", begin: /\{\./, end: /\.\}/, relevance: 10 },
          {
            className: "string",
            begin: /[a-zA-Z]\w*"/,
            end: /"/,
            contains: [{ begin: /""/ }],
          },
          { className: "string", begin: /([a-zA-Z]\w*)?"""/, end: /"""/ },
          e.QUOTE_STRING_MODE,
          { className: "type", begin: /\b[A-Z]\w+\b/, relevance: 0 },
          {
            className: "number",
            relevance: 0,
            variants: [
              {
                begin: /\b(0[xX][0-9a-fA-F][_0-9a-fA-F]*)('?[iIuU](8|16|32|64))?/,
              },
              {
                begin: /\b(0o[0-7][_0-7]*)('?[iIuUfF](8|16|32|64))?/,
              },
              {
                begin: /\b(0(b|B)[01][_01]*)('?[iIuUfF](8|16|32|64))?/,
              },
              {
                begin: /\b(\d[_\d]*)('?[iIuUfF](8|16|32|64))?/,
              },
            ],
          },
          e.HASH_COMMENT_MODE,
        ],
      }),
      grmr_nix: (e) => {
        const n = {
            keyword: [
              "rec",
              "with",
              "let",
              "in",
              "inherit",
              "assert",
              "if",
              "else",
              "then",
            ],
            literal: ["true", "false", "or", "and", "null"],
            built_in: [
              "import",
              "abort",
              "baseNameOf",
              "dirOf",
              "isNull",
              "builtins",
              "map",
              "removeAttrs",
              "throw",
              "toString",
              "derivation",
            ],
          },
          t = { className: "subst", begin: /\$\{/, end: /\}/, keywords: n },
          s = {
            className: "string",
            contains: [{ className: "char.escape", begin: /''\$/ }, t],
            variants: [
              { begin: "''", end: "''" },
              { begin: '"', end: '"' },
            ],
          },
          a = [
            e.NUMBER_MODE,
            e.HASH_COMMENT_MODE,
            e.C_BLOCK_COMMENT_MODE,
            s,
            {
              begin: /[a-zA-Z0-9-_]+(\s*=)/,
              returnBegin: !0,
              relevance: 0,
              contains: [
                {
                  className: "attr",
                  begin: /\S+/,
                  relevance: 0.2,
                },
              ],
            },
          ];
        return (
          (t.contains = a),
          { name: "Nix", aliases: ["nixos"], keywords: n, contains: a }
        );
      },
      grmr_objectivec: (e) => {
        const n = /[a-zA-Z@][a-zA-Z0-9_]*/,
          t = {
            $pattern: n,
            keyword: ["@interface", "@class", "@protocol", "@implementation"],
          };
        return {
          name: "Objective-C",
          aliases: ["mm", "objc", "obj-c", "obj-c++", "objective-c++"],
          keywords: {
            "variable.language": ["this", "super"],
            $pattern: n,
            keyword: [
              "while",
              "export",
              "sizeof",
              "typedef",
              "const",
              "struct",
              "for",
              "union",
              "volatile",
              "static",
              "mutable",
              "if",
              "do",
              "return",
              "goto",
              "enum",
              "else",
              "break",
              "extern",
              "asm",
              "case",
              "default",
              "register",
              "explicit",
              "typename",
              "switch",
              "continue",
              "inline",
              "readonly",
              "assign",
              "readwrite",
              "self",
              "@synchronized",
              "id",
              "typeof",
              "nonatomic",
              "IBOutlet",
              "IBAction",
              "strong",
              "weak",
              "copy",
              "in",
              "out",
              "inout",
              "bycopy",
              "byref",
              "oneway",
              "__strong",
              "__weak",
              "__block",
              "__autoreleasing",
              "@private",
              "@protected",
              "@public",
              "@try",
              "@property",
              "@end",
              "@throw",
              "@catch",
              "@finally",
              "@autoreleasepool",
              "@synthesize",
              "@dynamic",
              "@selector",
              "@optional",
              "@required",
              "@encode",
              "@package",
              "@import",
              "@defs",
              "@compatibility_alias",
              "__bridge",
              "__bridge_transfer",
              "__bridge_retained",
              "__bridge_retain",
              "__covariant",
              "__contravariant",
              "__kindof",
              "_Nonnull",
              "_Nullable",
              "_Null_unspecified",
              "__FUNCTION__",
              "__PRETTY_FUNCTION__",
              "__attribute__",
              "getter",
              "setter",
              "retain",
              "unsafe_unretained",
              "nonnull",
              "nullable",
              "null_unspecified",
              "null_resettable",
              "class",
              "instancetype",
              "NS_DESIGNATED_INITIALIZER",
              "NS_UNAVAILABLE",
              "NS_REQUIRES_SUPER",
              "NS_RETURNS_INNER_POINTER",
              "NS_INLINE",
              "NS_AVAILABLE",
              "NS_DEPRECATED",
              "NS_ENUM",
              "NS_OPTIONS",
              "NS_SWIFT_UNAVAILABLE",
              "NS_ASSUME_NONNULL_BEGIN",
              "NS_ASSUME_NONNULL_END",
              "NS_REFINED_FOR_SWIFT",
              "NS_SWIFT_NAME",
              "NS_SWIFT_NOTHROW",
              "NS_DURING",
              "NS_HANDLER",
              "NS_ENDHANDLER",
              "NS_VALUERETURN",
              "NS_VOIDRETURN",
            ],
            literal: [
              "false",
              "true",
              "FALSE",
              "TRUE",
              "nil",
              "YES",
              "NO",
              "NULL",
            ],
            built_in: [
              "dispatch_once_t",
              "dispatch_queue_t",
              "dispatch_sync",
              "dispatch_async",
              "dispatch_once",
            ],
            type: [
              "int",
              "float",
              "char",
              "unsigned",
              "signed",
              "short",
              "long",
              "double",
              "wchar_t",
              "unichar",
              "void",
              "bool",
              "BOOL",
              "id|0",
              "_Bool",
            ],
          },
          illegal: "</",
          contains: [
            {
              className: "built_in",
              begin:
                "\\b(AV|CA|CF|CG|CI|CL|CM|CN|CT|MK|MP|MTK|MTL|NS|SCN|SK|UI|WK|XC)\\w+",
            },
            e.C_LINE_COMMENT_MODE,
            e.C_BLOCK_COMMENT_MODE,
            e.C_NUMBER_MODE,
            e.QUOTE_STRING_MODE,
            e.APOS_STRING_MODE,
            {
              className: "string",
              variants: [
                {
                  begin: '@"',
                  end: '"',
                  illegal: "\\n",
                  contains: [e.BACKSLASH_ESCAPE],
                },
              ],
            },
            {
              className: "meta",
              begin: /#\s*[a-z]+\b/,
              end: /$/,
              keywords: {
                keyword:
                  "if else elif endif define undef warning error line pragma ifdef ifndef include",
              },
              contains: [
                { begin: /\\\n/, relevance: 0 },
                e.inherit(e.QUOTE_STRING_MODE, {
                  className: "string",
                }),
                { className: "string", begin: /<.*?>/, end: /$/, illegal: "\\n" },
                e.C_LINE_COMMENT_MODE,
                e.C_BLOCK_COMMENT_MODE,
              ],
            },
            {
              className: "class",
              begin: "(" + t.keyword.join("|") + ")\\b",
              end: /(\{|$)/,
              excludeEnd: !0,
              keywords: t,
              contains: [e.UNDERSCORE_TITLE_MODE],
            },
            { begin: "\\." + e.UNDERSCORE_IDENT_RE, relevance: 0 },
          ],
        };
      },
      grmr_perl: (e) => {
        const n = e.regex,
          t = /[dualxmsipngr]{0,12}/,
          s = {
            $pattern: /[\w.]+/,
            keyword:
              "abs accept alarm and atan2 bind binmode bless break caller chdir chmod chomp chop chown chr chroot class close closedir connect continue cos crypt dbmclose dbmopen defined delete die do dump each else elsif endgrent endhostent endnetent endprotoent endpwent endservent eof eval exec exists exit exp fcntl field fileno flock for foreach fork format formline getc getgrent getgrgid getgrnam gethostbyaddr gethostbyname gethostent getlogin getnetbyaddr getnetbyname getnetent getpeername getpgrp getpriority getprotobyname getprotobynumber getprotoent getpwent getpwnam getpwuid getservbyname getservbyport getservent getsockname getsockopt given glob gmtime goto grep gt hex if index int ioctl join keys kill last lc lcfirst length link listen local localtime log lstat lt ma map method mkdir msgctl msgget msgrcv msgsnd my ne next no not oct open opendir or ord our pack package pipe pop pos print printf prototype push q|0 qq quotemeta qw qx rand read readdir readline readlink readpipe recv redo ref rename require reset return reverse rewinddir rindex rmdir say scalar seek seekdir select semctl semget semop send setgrent sethostent setnetent setpgrp setpriority setprotoent setpwent setservent setsockopt shift shmctl shmget shmread shmwrite shutdown sin sleep socket socketpair sort splice split sprintf sqrt srand stat state study sub substr symlink syscall sysopen sysread sysseek system syswrite tell telldir tie tied time times tr truncate uc ucfirst umask undef unless unlink unpack unshift untie until use utime values vec wait waitpid wantarray warn when while write x|0 xor y|0",
          },
          a = { className: "subst", begin: "[$@]\\{", end: "\\}", keywords: s },
          i = { begin: /->\{/, end: /\}/ },
          r = { scope: "attr", match: /\s+:\s*\w+(\s*\(.*?\))?/ },
          o = {
            scope: "variable",
            variants: [
              { begin: /\$\d/ },
              {
                begin: n.concat(
                  /[$%@](?!")(\^\w\b|#\w+(::\w+)*|\{\w+\}|\w+(::\w*)*)/,
                  "(?![A-Za-z])(?![@$%])"
                ),
              },
              { begin: /[$%@](?!")[^\s\w{=]|\$=/, relevance: 0 },
            ],
            contains: [r],
          },
          c = {
            className: "number",
            variants: [
              { match: /0?\.[0-9][0-9_]+\b/ },
              {
                match: /\bv?(0|[1-9][0-9_]*(\.[0-9_]+)?|[1-9][0-9_]*)\b/,
              },
              {
                match: /\b0[0-7][0-7_]*\b/,
              },
              { match: /\b0x[0-9a-fA-F][0-9a-fA-F_]*\b/ },
              {
                match: /\b0b[0-1][0-1_]*\b/,
              },
            ],
            relevance: 0,
          },
          l = [e.BACKSLASH_ESCAPE, a, o],
          d = [/!/, /\//, /\|/, /\?/, /'/, /"/, /#/],
          p = (e, s, a = "\\1") => {
            const i = "\\1" === a ? a : n.concat(a, s);
            return n.concat(
              n.concat("(?:", e, ")"),
              s,
              /(?:\\.|[^\\\/])*?/,
              i,
              /(?:\\.|[^\\\/])*?/,
              a,
              t
            );
          },
          m = (e, s, a) =>
            n.concat(n.concat("(?:", e, ")"), s, /(?:\\.|[^\\\/])*?/, a, t),
          u = [
            o,
            e.HASH_COMMENT_MODE,
            e.COMMENT(/^=\w/, /=cut/, {
              endsWithParent: !0,
            }),
            i,
            {
              className: "string",
              contains: l,
              variants: [
                {
                  begin: "q[qwxr]?\\s*\\(",
                  end: "\\)",
                  relevance: 5,
                },
                { begin: "q[qwxr]?\\s*\\[", end: "\\]", relevance: 5 },
                { begin: "q[qwxr]?\\s*\\{", end: "\\}", relevance: 5 },
                {
                  begin: "q[qwxr]?\\s*\\|",
                  end: "\\|",
                  relevance: 5,
                },
                { begin: "q[qwxr]?\\s*<", end: ">", relevance: 5 },
                { begin: "qw\\s+q", end: "q", relevance: 5 },
                { begin: "'", end: "'", contains: [e.BACKSLASH_ESCAPE] },
                { begin: '"', end: '"' },
                { begin: "`", end: "`", contains: [e.BACKSLASH_ESCAPE] },
                { begin: /\{\w+\}/, relevance: 0 },
                {
                  begin: "-?\\w+\\s*=>",
                  relevance: 0,
                },
              ],
            },
            c,
            {
              begin:
                "(\\/\\/|" +
                e.RE_STARTERS_RE +
                "|\\b(split|return|print|reverse|grep)\\b)\\s*",
              keywords: "split return print reverse grep",
              relevance: 0,
              contains: [
                e.HASH_COMMENT_MODE,
                {
                  className: "regexp",
                  variants: [
                    {
                      begin: p("s|tr|y", n.either(...d, { capture: !0 })),
                    },
                    { begin: p("s|tr|y", "\\(", "\\)") },
                    {
                      begin: p("s|tr|y", "\\[", "\\]"),
                    },
                    { begin: p("s|tr|y", "\\{", "\\}") },
                  ],
                  relevance: 2,
                },
                {
                  className: "regexp",
                  variants: [
                    { begin: /(m|qr)\/\//, relevance: 0 },
                    {
                      begin: m("(?:m|qr)?", /\//, /\//),
                    },
                    { begin: m("m|qr", n.either(...d, { capture: !0 }), /\1/) },
                    { begin: m("m|qr", /\(/, /\)/) },
                    { begin: m("m|qr", /\[/, /\]/) },
                    {
                      begin: m("m|qr", /\{/, /\}/),
                    },
                  ],
                },
              ],
            },
            {
              className: "function",
              beginKeywords: "sub method",
              end: "(\\s*\\(.*?\\))?[;{]",
              excludeEnd: !0,
              relevance: 5,
              contains: [e.TITLE_MODE, r],
            },
            {
              className: "class",
              beginKeywords: "class",
              end: "[;{]",
              excludeEnd: !0,
              relevance: 5,
              contains: [e.TITLE_MODE, r, c],
            },
            { begin: "-\\w\\b", relevance: 0 },
            {
              begin: "^__DATA__$",
              end: "^__END__$",
              subLanguage: "mojolicious",
              contains: [{ begin: "^@@.*", end: "$", className: "comment" }],
            },
          ];
        return (
          (a.contains = u),
          (i.contains = u),
          { name: "Perl", aliases: ["pl", "pm"], keywords: s, contains: u }
        );
      },
      grmr_php: (e) => {
        const n = e.regex,
          t = /(?![A-Za-z0-9])(?![$])/,
          s = n.concat(/[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/, t),
          a = n.concat(
            /(\\?[A-Z][a-z0-9_\x7f-\xff]+|\\?[A-Z]+(?=[A-Z][a-z0-9_\x7f-\xff])){1,}/,
            t
          ),
          i = {
            scope: "variable",
            match: "\\$+" + s,
          },
          r = {
            scope: "subst",
            variants: [
              { begin: /\$\w+/ },
              {
                begin: /\{\$/,
                end: /\}/,
              },
            ],
          },
          o = e.inherit(e.APOS_STRING_MODE, { illegal: null }),
          c = "[ \t\n]",
          l = {
            scope: "string",
            variants: [
              e.inherit(e.QUOTE_STRING_MODE, {
                illegal: null,
                contains: e.QUOTE_STRING_MODE.contains.concat(r),
              }),
              o,
              {
                begin: /<<<[ \t]*(?:(\w+)|"(\w+)")\n/,
                end: /[ \t]*(\w+)\b/,
                contains: e.QUOTE_STRING_MODE.contains.concat(r),
                "on:begin": (e, n) => {
                  n.data._beginMatch = e[1] || e[2];
                },
                "on:end": (e, n) => {
                  n.data._beginMatch !== e[1] && n.ignoreMatch();
                },
              },
              e.END_SAME_AS_BEGIN({
                begin: /<<<[ \t]*'(\w+)'\n/,
                end: /[ \t]*(\w+)\b/,
              }),
            ],
          },
          d = {
            scope: "number",
            variants: [
              {
                begin: "\\b0[bB][01]+(?:_[01]+)*\\b",
              },
              { begin: "\\b0[oO][0-7]+(?:_[0-7]+)*\\b" },
              {
                begin: "\\b0[xX][\\da-fA-F]+(?:_[\\da-fA-F]+)*\\b",
              },
              {
                begin:
                  "(?:\\b\\d+(?:_\\d+)*(\\.(?:\\d+(?:_\\d+)*))?|\\B\\.\\d+)(?:[eE][+-]?\\d+)?",
              },
            ],
            relevance: 0,
          },
          p = ["false", "null", "true"],
          m = [
            "__CLASS__",
            "__DIR__",
            "__FILE__",
            "__FUNCTION__",
            "__COMPILER_HALT_OFFSET__",
            "__LINE__",
            "__METHOD__",
            "__NAMESPACE__",
            "__TRAIT__",
            "die",
            "echo",
            "exit",
            "include",
            "include_once",
            "print",
            "require",
            "require_once",
            "array",
            "abstract",
            "and",
            "as",
            "binary",
            "bool",
            "boolean",
            "break",
            "callable",
            "case",
            "catch",
            "class",
            "clone",
            "const",
            "continue",
            "declare",
            "default",
            "do",
            "double",
            "else",
            "elseif",
            "empty",
            "enddeclare",
            "endfor",
            "endforeach",
            "endif",
            "endswitch",
            "endwhile",
            "enum",
            "eval",
            "extends",
            "final",
            "finally",
            "float",
            "for",
            "foreach",
            "from",
            "global",
            "goto",
            "if",
            "implements",
            "instanceof",
            "insteadof",
            "int",
            "integer",
            "interface",
            "isset",
            "iterable",
            "list",
            "match|0",
            "mixed",
            "new",
            "never",
            "object",
            "or",
            "private",
            "protected",
            "public",
            "readonly",
            "real",
            "return",
            "string",
            "switch",
            "throw",
            "trait",
            "try",
            "unset",
            "use",
            "var",
            "void",
            "while",
            "xor",
            "yield",
          ],
          u = [
            "Error|0",
            "AppendIterator",
            "ArgumentCountError",
            "ArithmeticError",
            "ArrayIterator",
            "ArrayObject",
            "AssertionError",
            "BadFunctionCallException",
            "BadMethodCallException",
            "CachingIterator",
            "CallbackFilterIterator",
            "CompileError",
            "Countable",
            "DirectoryIterator",
            "DivisionByZeroError",
            "DomainException",
            "EmptyIterator",
            "ErrorException",
            "Exception",
            "FilesystemIterator",
            "FilterIterator",
            "GlobIterator",
            "InfiniteIterator",
            "InvalidArgumentException",
            "IteratorIterator",
            "LengthException",
            "LimitIterator",
            "LogicException",
            "MultipleIterator",
            "NoRewindIterator",
            "OutOfBoundsException",
            "OutOfRangeException",
            "OuterIterator",
            "OverflowException",
            "ParentIterator",
            "ParseError",
            "RangeException",
            "RecursiveArrayIterator",
            "RecursiveCachingIterator",
            "RecursiveCallbackFilterIterator",
            "RecursiveDirectoryIterator",
            "RecursiveFilterIterator",
            "RecursiveIterator",
            "RecursiveIteratorIterator",
            "RecursiveRegexIterator",
            "RecursiveTreeIterator",
            "RegexIterator",
            "RuntimeException",
            "SeekableIterator",
            "SplDoublyLinkedList",
            "SplFileInfo",
            "SplFileObject",
            "SplFixedArray",
            "SplHeap",
            "SplMaxHeap",
            "SplMinHeap",
            "SplObjectStorage",
            "SplObserver",
            "SplPriorityQueue",
            "SplQueue",
            "SplStack",
            "SplSubject",
            "SplTempFileObject",
            "TypeError",
            "UnderflowException",
            "UnexpectedValueException",
            "UnhandledMatchError",
            "ArrayAccess",
            "BackedEnum",
            "Closure",
            "Fiber",
            "Generator",
            "Iterator",
            "IteratorAggregate",
            "Serializable",
            "Stringable",
            "Throwable",
            "Traversable",
            "UnitEnum",
            "WeakReference",
            "WeakMap",
            "Directory",
            "__PHP_Incomplete_Class",
            "parent",
            "php_user_filter",
            "self",
            "static",
            "stdClass",
          ],
          b = {
            keyword: m,
            literal: ((e) => {
              const n = [];
              return (
                e.forEach((e) => {
                  n.push(e),
                    e.toLowerCase() === e
                      ? n.push(e.toUpperCase())
                      : n.push(e.toLowerCase());
                }),
                n
              );
            })(p),
            built_in: u,
          },
          g = (e) => e.map((e) => e.replace(/\|\d+$/, "")),
          v = {
            variants: [
              {
                match: [
                  /new/,
                  n.concat(c, "+"),
                  n.concat("(?!", g(u).join("\\b|"), "\\b)"),
                  a,
                ],
                scope: {
                  1: "keyword",
                  4: "title.class",
                },
              },
            ],
          },
          _ = n.concat(s, "\\b(?!\\()"),
          f = {
            variants: [
              {
                match: [n.concat(/::/, n.lookahead(/(?!class\b)/)), _],
                scope: { 2: "variable.constant" },
              },
              { match: [/::/, /class/], scope: { 2: "variable.language" } },
              {
                match: [a, n.concat(/::/, n.lookahead(/(?!class\b)/)), _],
                scope: { 1: "title.class", 3: "variable.constant" },
              },
              {
                match: [a, n.concat("::", n.lookahead(/(?!class\b)/))],
                scope: { 1: "title.class" },
              },
              {
                match: [a, /::/, /class/],
                scope: { 1: "title.class", 3: "variable.language" },
              },
            ],
          },
          h = {
            scope: "attr",
            match: n.concat(s, n.lookahead(":"), n.lookahead(/(?!::)/)),
          },
          E = {
            relevance: 0,
            begin: /\(/,
            end: /\)/,
            keywords: b,
            contains: [h, i, f, e.C_BLOCK_COMMENT_MODE, l, d, v],
          },
          w = {
            relevance: 0,
            match: [
              /\b/,
              n.concat(
                "(?!fn\\b|function\\b|",
                g(m).join("\\b|"),
                "|",
                g(u).join("\\b|"),
                "\\b)"
              ),
              s,
              n.concat(c, "*"),
              n.lookahead(/(?=\()/),
            ],
            scope: { 3: "title.function.invoke" },
            contains: [E],
          };
        E.contains.push(w);
        const y = [h, f, e.C_BLOCK_COMMENT_MODE, l, d, v];
        return {
          case_insensitive: !1,
          keywords: b,
          contains: [
            {
              begin: n.concat(/#\[\s*/, a),
              beginScope: "meta",
              end: /]/,
              endScope: "meta",
              keywords: { literal: p, keyword: ["new", "array"] },
              contains: [
                {
                  begin: /\[/,
                  end: /]/,
                  keywords: { literal: p, keyword: ["new", "array"] },
                  contains: ["self", ...y],
                },
                ...y,
                { scope: "meta", match: a },
              ],
            },
            e.HASH_COMMENT_MODE,
            e.COMMENT("//", "$"),
            e.COMMENT("/\\*", "\\*/", {
              contains: [
                {
                  scope: "doctag",
                  match: "@[A-Za-z]+",
                },
              ],
            }),
            {
              match: /__halt_compiler\(\);/,
              keywords: "__halt_compiler",
              starts: {
                scope: "comment",
                end: e.MATCH_NOTHING_RE,
                contains: [{ match: /\?>/, scope: "meta", endsParent: !0 }],
              },
            },
            {
              scope: "meta",
              variants: [
                {
                  begin: /<\?php/,
                  relevance: 10,
                },
                { begin: /<\?=/ },
                { begin: /<\?/, relevance: 0.1 },
                {
                  begin: /\?>/,
                },
              ],
            },
            { scope: "variable.language", match: /\$this\b/ },
            i,
            w,
            f,
            {
              match: [/const/, /\s/, s],
              scope: { 1: "keyword", 3: "variable.constant" },
            },
            v,
            {
              scope: "function",
              relevance: 0,
              beginKeywords: "fn function",
              end: /[;{]/,
              excludeEnd: !0,
              illegal: "[$%\\[]",
              contains: [
                { beginKeywords: "use" },
                e.UNDERSCORE_TITLE_MODE,
                { begin: "=>", endsParent: !0 },
                {
                  scope: "params",
                  begin: "\\(",
                  end: "\\)",
                  excludeBegin: !0,
                  excludeEnd: !0,
                  keywords: b,
                  contains: ["self", i, f, e.C_BLOCK_COMMENT_MODE, l, d],
                },
              ],
            },
            {
              scope: "class",
              variants: [
                {
                  beginKeywords: "enum",
                  illegal: /[($"]/,
                },
                { beginKeywords: "class interface trait", illegal: /[:($"]/ },
              ],
              relevance: 0,
              end: /\{/,
              excludeEnd: !0,
              contains: [
                {
                  beginKeywords: "extends implements",
                },
                e.UNDERSCORE_TITLE_MODE,
              ],
            },
            {
              beginKeywords: "namespace",
              relevance: 0,
              end: ";",
              illegal: /[.']/,
              contains: [
                e.inherit(e.UNDERSCORE_TITLE_MODE, { scope: "title.class" }),
              ],
            },
            {
              beginKeywords: "use",
              relevance: 0,
              end: ";",
              contains: [
                {
                  match: /\b(as|const|function)\b/,
                  scope: "keyword",
                },
                e.UNDERSCORE_TITLE_MODE,
              ],
            },
            l,
            d,
          ],
        };
      },
      grmr_php_template: (e) => ({
        name: "PHP template",
        subLanguage: "xml",
        contains: [
          {
            begin: /<\?(php|=)?/,
            end: /\?>/,
            subLanguage: "php",
            contains: [
              { begin: "/\\*", end: "\\*/", skip: !0 },
              { begin: 'b"', end: '"', skip: !0 },
              { begin: "b'", end: "'", skip: !0 },
              e.inherit(e.APOS_STRING_MODE, {
                illegal: null,
                className: null,
                contains: null,
                skip: !0,
              }),
              e.inherit(e.QUOTE_STRING_MODE, {
                illegal: null,
                className: null,
                contains: null,
                skip: !0,
              }),
            ],
          },
        ],
      }),
      grmr_plaintext: (e) => ({
        name: "Plain text",
        aliases: ["text", "txt"],
        disableAutodetect: !0,
      }),
      grmr_properties: (e) => {
        const n = "[ \\t\\f]*",
          t = n + "[:=]" + n,
          s = "[ \\t\\f]+",
          a = "([^\\\\:= \\t\\f\\n]|\\\\.)+",
          i = {
            end: "(" + t + "|" + s + ")",
            relevance: 0,
            starts: {
              className: "string",
              end: /$/,
              relevance: 0,
              contains: [{ begin: "\\\\\\\\" }, { begin: "\\\\\\n" }],
            },
          };
        return {
          name: ".properties",
          disableAutodetect: !0,
          case_insensitive: !0,
          illegal: /\S/,
          contains: [
            e.COMMENT("^\\s*[!#]", "$"),
            {
              returnBegin: !0,
              variants: [
                { begin: a + t },
                {
                  begin: a + s,
                },
              ],
              contains: [{ className: "attr", begin: a, endsParent: !0 }],
              starts: i,
            },
            {
              className: "attr",
              begin: a + n + "$",
            },
          ],
        };
      },
      grmr_python: (e) => {
        const n = e.regex,
          t = /[\p{XID_Start}_]\p{XID_Continue}*/u,
          s = [
            "and",
            "as",
            "assert",
            "async",
            "await",
            "break",
            "case",
            "class",
            "continue",
            "def",
            "del",
            "elif",
            "else",
            "except",
            "finally",
            "for",
            "from",
            "global",
            "if",
            "import",
            "in",
            "is",
            "lambda",
            "match",
            "nonlocal|10",
            "not",
            "or",
            "pass",
            "raise",
            "return",
            "try",
            "while",
            "with",
            "yield",
          ],
          a = {
            $pattern: /[A-Za-z]\w+|__\w+__/,
            keyword: s,
            built_in: [
              "__import__",
              "abs",
              "all",
              "any",
              "ascii",
              "bin",
              "bool",
              "breakpoint",
              "bytearray",
              "bytes",
              "callable",
              "chr",
              "classmethod",
              "compile",
              "complex",
              "delattr",
              "dict",
              "dir",
              "divmod",
              "enumerate",
              "eval",
              "exec",
              "filter",
              "float",
              "format",
              "frozenset",
              "getattr",
              "globals",
              "hasattr",
              "hash",
              "help",
              "hex",
              "id",
              "input",
              "int",
              "isinstance",
              "issubclass",
              "iter",
              "len",
              "list",
              "locals",
              "map",
              "max",
              "memoryview",
              "min",
              "next",
              "object",
              "oct",
              "open",
              "ord",
              "pow",
              "print",
              "property",
              "range",
              "repr",
              "reversed",
              "round",
              "set",
              "setattr",
              "slice",
              "sorted",
              "staticmethod",
              "str",
              "sum",
              "super",
              "tuple",
              "type",
              "vars",
              "zip",
            ],
            literal: [
              "__debug__",
              "Ellipsis",
              "False",
              "None",
              "NotImplemented",
              "True",
            ],
            type: [
              "Any",
              "Callable",
              "Coroutine",
              "Dict",
              "List",
              "Literal",
              "Generic",
              "Optional",
              "Sequence",
              "Set",
              "Tuple",
              "Type",
              "Union",
            ],
          },
          i = { className: "meta", begin: /^(>>>|\.\.\.) / },
          r = {
            className: "subst",
            begin: /\{/,
            end: /\}/,
            keywords: a,
            illegal: /#/,
          },
          o = { begin: /\{\{/, relevance: 0 },
          c = {
            className: "string",
            contains: [e.BACKSLASH_ESCAPE],
            variants: [
              {
                begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?'''/,
                end: /'''/,
                contains: [e.BACKSLASH_ESCAPE, i],
                relevance: 10,
              },
              {
                begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?"""/,
                end: /"""/,
                contains: [e.BACKSLASH_ESCAPE, i],
                relevance: 10,
              },
              {
                begin: /([fF][rR]|[rR][fF]|[fF])'''/,
                end: /'''/,
                contains: [e.BACKSLASH_ESCAPE, i, o, r],
              },
              {
                begin: /([fF][rR]|[rR][fF]|[fF])"""/,
                end: /"""/,
                contains: [e.BACKSLASH_ESCAPE, i, o, r],
              },
              { begin: /([uU]|[rR])'/, end: /'/, relevance: 10 },
              { begin: /([uU]|[rR])"/, end: /"/, relevance: 10 },
              {
                begin: /([bB]|[bB][rR]|[rR][bB])'/,
                end: /'/,
              },
              { begin: /([bB]|[bB][rR]|[rR][bB])"/, end: /"/ },
              {
                begin: /([fF][rR]|[rR][fF]|[fF])'/,
                end: /'/,
                contains: [e.BACKSLASH_ESCAPE, o, r],
              },
              {
                begin: /([fF][rR]|[rR][fF]|[fF])"/,
                end: /"/,
                contains: [e.BACKSLASH_ESCAPE, o, r],
              },
              e.APOS_STRING_MODE,
              e.QUOTE_STRING_MODE,
            ],
          },
          l = "[0-9](_?[0-9])*",
          d = `(\\b(${l}))?\\.(${l})|\\b(${l})\\.`,
          p = "\\b|" + s.join("|"),
          m = {
            className: "number",
            relevance: 0,
            variants: [
              {
                begin: `(\\b(${l})|(${d}))[eE][+-]?(${l})[jJ]?(?=${p})`,
              },
              { begin: `(${d})[jJ]?` },
              {
                begin: `\\b([1-9](_?[0-9])*|0+(_?0)*)[lLjJ]?(?=${p})`,
              },
              {
                begin: `\\b0[bB](_?[01])+[lL]?(?=${p})`,
              },
              { begin: `\\b0[oO](_?[0-7])+[lL]?(?=${p})` },
              { begin: `\\b0[xX](_?[0-9a-fA-F])+[lL]?(?=${p})` },
              { begin: `\\b(${l})[jJ](?=${p})` },
            ],
          },
          u = {
            className: "comment",
            begin: n.lookahead(/# type:/),
            end: /$/,
            keywords: a,
            contains: [
              { begin: /# type:/ },
              { begin: /#/, end: /\b\B/, endsWithParent: !0 },
            ],
          },
          b = {
            className: "params",
            variants: [
              { className: "", begin: /\(\s*\)/, skip: !0 },
              {
                begin: /\(/,
                end: /\)/,
                excludeBegin: !0,
                excludeEnd: !0,
                keywords: a,
                contains: ["self", i, m, c, e.HASH_COMMENT_MODE],
              },
            ],
          };
        return (
          (r.contains = [c, m, i]),
          {
            name: "Python",
            aliases: ["py", "gyp", "ipython"],
            unicodeRegex: !0,
            keywords: a,
            illegal: /(<\/|\?)|=>/,
            contains: [
              i,
              m,
              { scope: "variable.language", match: /\bself\b/ },
              { beginKeywords: "if", relevance: 0 },
              { match: /\bor\b/, scope: "keyword" },
              c,
              u,
              e.HASH_COMMENT_MODE,
              {
                match: [/\bdef/, /\s+/, t],
                scope: { 1: "keyword", 3: "title.function" },
                contains: [b],
              },
              {
                variants: [
                  {
                    match: [/\bclass/, /\s+/, t, /\s*/, /\(\s*/, t, /\s*\)/],
                  },
                  { match: [/\bclass/, /\s+/, t] },
                ],
                scope: {
                  1: "keyword",
                  3: "title.class",
                  6: "title.class.inherited",
                },
              },
              {
                className: "meta",
                begin: /^[\t ]*@/,
                end: /(?=#)|$/,
                contains: [m, b, c],
              },
            ],
          }
        );
      },
      grmr_python_repl: (e) => ({
        aliases: ["pycon"],
        contains: [
          {
            className: "meta.prompt",
            starts: { end: / |$/, starts: { end: "$", subLanguage: "python" } },
            variants: [
              {
                begin: /^>>>(?=[ ]|$)/,
              },
              { begin: /^\.\.\.(?=[ ]|$)/ },
            ],
          },
        ],
      }),
      grmr_r: (e) => {
        const n = e.regex,
          t = /(?:(?:[a-zA-Z]|\.[._a-zA-Z])[._a-zA-Z0-9]*)|\.(?!\d)/,
          s = n.either(
            /0[xX][0-9a-fA-F]+\.[0-9a-fA-F]*[pP][+-]?\d+i?/,
            /0[xX][0-9a-fA-F]+(?:[pP][+-]?\d+)?[Li]?/,
            /(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?[Li]?/
          ),
          a = /[=!<>:]=|\|\||&&|:::?|<-|<<-|->>|->|\|>|[-+*\/?!$&|:<=>@^~]|\*\*/,
          i = n.either(/[()]/, /[{}]/, /\[\[/, /[[\]]/, /\\/, /,/);
        return {
          name: "R",
          keywords: {
            $pattern: t,
            keyword: "function if in break next repeat else for while",
            literal:
              "NULL NA TRUE FALSE Inf NaN NA_integer_|10 NA_real_|10 NA_character_|10 NA_complex_|10",
            built_in:
              "LETTERS letters month.abb month.name pi T F abs acos acosh all any anyNA Arg as.call as.character as.complex as.double as.environment as.integer as.logical as.null.default as.numeric as.raw asin asinh atan atanh attr attributes baseenv browser c call ceiling class Conj cos cosh cospi cummax cummin cumprod cumsum digamma dim dimnames emptyenv exp expression floor forceAndCall gamma gc.time globalenv Im interactive invisible is.array is.atomic is.call is.character is.complex is.double is.environment is.expression is.finite is.function is.infinite is.integer is.language is.list is.logical is.matrix is.na is.name is.nan is.null is.numeric is.object is.pairlist is.raw is.recursive is.single is.symbol lazyLoadDBfetch length lgamma list log max min missing Mod names nargs nzchar oldClass on.exit pos.to.env proc.time prod quote range Re rep retracemem return round seq_along seq_len seq.int sign signif sin sinh sinpi sqrt standardGeneric substitute sum switch tan tanh tanpi tracemem trigamma trunc unclass untracemem UseMethod xtfrm",
          },
          contains: [
            e.COMMENT(/#'/, /$/, {
              contains: [
                {
                  scope: "doctag",
                  match: /@examples/,
                  starts: {
                    end: n.lookahead(
                      n.either(/\n^#'\s*(?=@[a-zA-Z]+)/, /\n^(?!#')/)
                    ),
                    endsParent: !0,
                  },
                },
                {
                  scope: "doctag",
                  begin: "@param",
                  end: /$/,
                  contains: [
                    {
                      scope: "variable",
                      variants: [{ match: t }, { match: /`(?:\\.|[^`\\])+`/ }],
                      endsParent: !0,
                    },
                  ],
                },
                { scope: "doctag", match: /@[a-zA-Z]+/ },
                { scope: "keyword", match: /\\[a-zA-Z]+/ },
              ],
            }),
            e.HASH_COMMENT_MODE,
            {
              scope: "string",
              contains: [e.BACKSLASH_ESCAPE],
              variants: [
                e.END_SAME_AS_BEGIN({ begin: /[rR]"(-*)\(/, end: /\)(-*)"/ }),
                e.END_SAME_AS_BEGIN({ begin: /[rR]"(-*)\{/, end: /\}(-*)"/ }),
                e.END_SAME_AS_BEGIN({ begin: /[rR]"(-*)\[/, end: /\](-*)"/ }),
                e.END_SAME_AS_BEGIN({ begin: /[rR]'(-*)\(/, end: /\)(-*)'/ }),
                e.END_SAME_AS_BEGIN({ begin: /[rR]'(-*)\{/, end: /\}(-*)'/ }),
                e.END_SAME_AS_BEGIN({ begin: /[rR]'(-*)\[/, end: /\](-*)'/ }),
                { begin: '"', end: '"', relevance: 0 },
                { begin: "'", end: "'", relevance: 0 },
              ],
            },
            {
              relevance: 0,
              variants: [
                {
                  scope: {
                    1: "operator",
                    2: "number",
                  },
                  match: [a, s],
                },
                { scope: { 1: "operator", 2: "number" }, match: [/%[^%]*%/, s] },
                { scope: { 1: "punctuation", 2: "number" }, match: [i, s] },
                {
                  scope: {
                    2: "number",
                  },
                  match: [/[^a-zA-Z0-9._]|^/, s],
                },
              ],
            },
            { scope: { 3: "operator" }, match: [t, /\s+/, /<-/, /\s+/] },
            {
              scope: "operator",
              relevance: 0,
              variants: [
                { match: a },
                {
                  match: /%[^%]*%/,
                },
              ],
            },
            { scope: "punctuation", relevance: 0, match: i },
            { begin: "`", end: "`", contains: [{ begin: /\\./ }] },
          ],
        };
      },
      grmr_ruby: (e) => {
        const n = e.regex,
          t =
            "([a-zA-Z_]\\w*[!?=]?|[-+~]@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?)",
          s = n.either(/\b([A-Z]+[a-z0-9]+)+/, /\b([A-Z]+[a-z0-9]+)+[A-Z]+/),
          a = n.concat(s, /(::\w+)*/),
          i = {
            "variable.constant": ["__FILE__", "__LINE__", "__ENCODING__"],
            "variable.language": ["self", "super"],
            keyword: [
              "alias",
              "and",
              "begin",
              "BEGIN",
              "break",
              "case",
              "class",
              "defined",
              "do",
              "else",
              "elsif",
              "end",
              "END",
              "ensure",
              "for",
              "if",
              "in",
              "module",
              "next",
              "not",
              "or",
              "redo",
              "require",
              "rescue",
              "retry",
              "return",
              "then",
              "undef",
              "unless",
              "until",
              "when",
              "while",
              "yield",
              "include",
              "extend",
              "prepend",
              "public",
              "private",
              "protected",
              "raise",
              "throw",
            ],
            built_in: [
              "proc",
              "lambda",
              "attr_accessor",
              "attr_reader",
              "attr_writer",
              "define_method",
              "private_constant",
              "module_function",
            ],
            literal: ["true", "false", "nil"],
          },
          r = { className: "doctag", begin: "@[A-Za-z]+" },
          o = {
            begin: "#<",
            end: ">",
          },
          c = [
            e.COMMENT("#", "$", { contains: [r] }),
            e.COMMENT("^=begin", "^=end", { contains: [r], relevance: 10 }),
            e.COMMENT("^__END__", e.MATCH_NOTHING_RE),
          ],
          l = { className: "subst", begin: /#\{/, end: /\}/, keywords: i },
          d = {
            className: "string",
            contains: [e.BACKSLASH_ESCAPE, l],
            variants: [
              { begin: /'/, end: /'/ },
              { begin: /"/, end: /"/ },
              { begin: /`/, end: /`/ },
              {
                begin: /%[qQwWx]?\(/,
                end: /\)/,
              },
              { begin: /%[qQwWx]?\[/, end: /\]/ },
              {
                begin: /%[qQwWx]?\{/,
                end: /\}/,
              },
              { begin: /%[qQwWx]?</, end: />/ },
              { begin: /%[qQwWx]?\//, end: /\// },
              { begin: /%[qQwWx]?%/, end: /%/ },
              { begin: /%[qQwWx]?-/, end: /-/ },
              {
                begin: /%[qQwWx]?\|/,
                end: /\|/,
              },
              { begin: /\B\?(\\\d{1,3})/ },
              {
                begin: /\B\?(\\x[A-Fa-f0-9]{1,2})/,
              },
              { begin: /\B\?(\\u\{?[A-Fa-f0-9]{1,6}\}?)/ },
              {
                begin: /\B\?(\\M-\\C-|\\M-\\c|\\c\\M-|\\M-|\\C-\\M-)[\x20-\x7e]/,
              },
              {
                begin: /\B\?\\(c|C-)[\x20-\x7e]/,
              },
              { begin: /\B\?\\?\S/ },
              {
                begin: n.concat(
                  /<<[-~]?'?/,
                  n.lookahead(/(\w+)(?=\W)[^\n]*\n(?:[^\n]*\n)*?\s*\1\b/)
                ),
                contains: [
                  e.END_SAME_AS_BEGIN({
                    begin: /(\w+)/,
                    end: /(\w+)/,
                    contains: [e.BACKSLASH_ESCAPE, l],
                  }),
                ],
              },
            ],
          },
          p = "[0-9](_?[0-9])*",
          m = {
            className: "number",
            relevance: 0,
            variants: [
              {
                begin: `\\b([1-9](_?[0-9])*|0)(\\.(${p}))?([eE][+-]?(${p})|r)?i?\\b`,
              },
              {
                begin: "\\b0[dD][0-9](_?[0-9])*r?i?\\b",
              },
              { begin: "\\b0[bB][0-1](_?[0-1])*r?i?\\b" },
              { begin: "\\b0[oO][0-7](_?[0-7])*r?i?\\b" },
              {
                begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*r?i?\\b",
              },
              {
                begin: "\\b0(_?[0-7])+r?i?\\b",
              },
            ],
          },
          u = {
            variants: [
              { match: /\(\)/ },
              {
                className: "params",
                begin: /\(/,
                end: /(?=\))/,
                excludeBegin: !0,
                endsParent: !0,
                keywords: i,
              },
            ],
          },
          b = [
            d,
            {
              variants: [
                { match: [/class\s+/, a, /\s+<\s+/, a] },
                {
                  match: [/\b(class|module)\s+/, a],
                },
              ],
              scope: { 2: "title.class", 4: "title.class.inherited" },
              keywords: i,
            },
            {
              match: [/(include|extend)\s+/, a],
              scope: {
                2: "title.class",
              },
              keywords: i,
            },
            {
              relevance: 0,
              match: [a, /\.new[. (]/],
              scope: {
                1: "title.class",
              },
            },
            {
              relevance: 0,
              match: /\b[A-Z][A-Z_0-9]+\b/,
              className: "variable.constant",
            },
            { relevance: 0, match: s, scope: "title.class" },
            {
              match: [/def/, /\s+/, t],
              scope: { 1: "keyword", 3: "title.function" },
              contains: [u],
            },
            {
              begin: e.IDENT_RE + "::",
            },
            {
              className: "symbol",
              begin: e.UNDERSCORE_IDENT_RE + "(!|\\?)?:",
              relevance: 0,
            },
            {
              className: "symbol",
              begin: ":(?!\\s)",
              contains: [d, { begin: t }],
              relevance: 0,
            },
            m,
            {
              className: "variable",
              begin: "(\\$\\W)|((\\$|@@?)(\\w+))(?=[^@$?])(?![A-Za-z])(?![@$?'])",
            },
            {
              className: "params",
              begin: /\|/,
              end: /\|/,
              excludeBegin: !0,
              excludeEnd: !0,
              relevance: 0,
              keywords: i,
            },
            {
              begin: "(" + e.RE_STARTERS_RE + "|unless)\\s*",
              keywords: "unless",
              contains: [
                {
                  className: "regexp",
                  contains: [e.BACKSLASH_ESCAPE, l],
                  illegal: /\n/,
                  variants: [
                    { begin: "/", end: "/[a-z]*" },
                    { begin: /%r\{/, end: /\}[a-z]*/ },
                    {
                      begin: "%r\\(",
                      end: "\\)[a-z]*",
                    },
                    { begin: "%r!", end: "![a-z]*" },
                    { begin: "%r\\[", end: "\\][a-z]*" },
                  ],
                },
              ].concat(o, c),
              relevance: 0,
            },
          ].concat(o, c);
        (l.contains = b), (u.contains = b);
        const g = [
          { begin: /^\s*=>/, starts: { end: "$", contains: b } },
          {
            className: "meta.prompt",
            begin:
              "^([>?]>|[\\w#]+\\(\\w+\\):\\d+:\\d+[>*]|(\\w+-)?\\d+\\.\\d+\\.\\d+(p\\d+)?[^\\d][^>]+>)(?=[ ])",
            starts: { end: "$", keywords: i, contains: b },
          },
        ];
        return (
          c.unshift(o),
          {
            name: "Ruby",
            aliases: ["rb", "gemspec", "podspec", "thor", "irb"],
            keywords: i,
            illegal: /\/\*/,
            contains: [e.SHEBANG({ binary: "ruby" })]
              .concat(g)
              .concat(c)
              .concat(b),
          }
        );
      },
      grmr_rust: (e) => {
        const n = e.regex,
          t = /(r#)?/,
          s = n.concat(t, e.UNDERSCORE_IDENT_RE),
          a = n.concat(t, e.IDENT_RE),
          i = {
            className: "title.function.invoke",
            relevance: 0,
            begin: n.concat(
              /\b/,
              /(?!let|for|while|if|else|match\b)/,
              a,
              n.lookahead(/\s*\(/)
            ),
          },
          r = "([ui](8|16|32|64|128|size)|f(32|64))?",
          o = [
            "drop ",
            "Copy",
            "Send",
            "Sized",
            "Sync",
            "Drop",
            "Fn",
            "FnMut",
            "FnOnce",
            "ToOwned",
            "Clone",
            "Debug",
            "PartialEq",
            "PartialOrd",
            "Eq",
            "Ord",
            "AsRef",
            "AsMut",
            "Into",
            "From",
            "Default",
            "Iterator",
            "Extend",
            "IntoIterator",
            "DoubleEndedIterator",
            "ExactSizeIterator",
            "SliceConcatExt",
            "ToString",
            "assert!",
            "assert_eq!",
            "bitflags!",
            "bytes!",
            "cfg!",
            "col!",
            "concat!",
            "concat_idents!",
            "debug_assert!",
            "debug_assert_eq!",
            "env!",
            "eprintln!",
            "panic!",
            "file!",
            "format!",
            "format_args!",
            "include_bytes!",
            "include_str!",
            "line!",
            "local_data_key!",
            "module_path!",
            "option_env!",
            "print!",
            "println!",
            "select!",
            "stringify!",
            "try!",
            "unimplemented!",
            "unreachable!",
            "vec!",
            "write!",
            "writeln!",
            "macro_rules!",
            "assert_ne!",
            "debug_assert_ne!",
          ],
          c = [
            "i8",
            "i16",
            "i32",
            "i64",
            "i128",
            "isize",
            "u8",
            "u16",
            "u32",
            "u64",
            "u128",
            "usize",
            "f32",
            "f64",
            "str",
            "char",
            "bool",
            "Box",
            "Option",
            "Result",
            "String",
            "Vec",
          ];
        return {
          name: "Rust",
          aliases: ["rs"],
          keywords: {
            $pattern: e.IDENT_RE + "!?",
            type: c,
            keyword: [
              "abstract",
              "as",
              "async",
              "await",
              "become",
              "box",
              "break",
              "const",
              "continue",
              "crate",
              "do",
              "dyn",
              "else",
              "enum",
              "extern",
              "false",
              "final",
              "fn",
              "for",
              "if",
              "impl",
              "in",
              "let",
              "loop",
              "macro",
              "match",
              "mod",
              "move",
              "mut",
              "override",
              "priv",
              "pub",
              "ref",
              "return",
              "self",
              "Self",
              "static",
              "struct",
              "super",
              "trait",
              "true",
              "try",
              "type",
              "typeof",
              "union",
              "unsafe",
              "unsized",
              "use",
              "virtual",
              "where",
              "while",
              "yield",
            ],
            literal: ["true", "false", "Some", "None", "Ok", "Err"],
            built_in: o,
          },
          illegal: "</",
          contains: [
            e.C_LINE_COMMENT_MODE,
            e.COMMENT("/\\*", "\\*/", { contains: ["self"] }),
            e.inherit(e.QUOTE_STRING_MODE, { begin: /b?"/, illegal: null }),
            {
              className: "string",
              variants: [
                { begin: /b?r(#*)"(.|\n)*?"\1(?!#)/ },
                {
                  begin: /b?'\\?(x\w{2}|u\w{4}|U\w{8}|.)'/,
                },
              ],
            },
            { className: "symbol", begin: /'[a-zA-Z_][a-zA-Z0-9_]*/ },
            {
              className: "number",
              variants: [
                {
                  begin: "\\b0b([01_]+)" + r,
                },
                { begin: "\\b0o([0-7_]+)" + r },
                {
                  begin: "\\b0x([A-Fa-f0-9_]+)" + r,
                },
                {
                  begin: "\\b(\\d[\\d_]*(\\.[0-9_]+)?([eE][+-]?[0-9_]+)?)" + r,
                },
              ],
              relevance: 0,
            },
            {
              begin: [/fn/, /\s+/, s],
              className: { 1: "keyword", 3: "title.function" },
            },
            {
              className: "meta",
              begin: "#!?\\[",
              end: "\\]",
              contains: [
                {
                  className: "string",
                  begin: /"/,
                  end: /"/,
                  contains: [e.BACKSLASH_ESCAPE],
                },
              ],
            },
            {
              begin: [/let/, /\s+/, /(?:mut\s+)?/, s],
              className: { 1: "keyword", 3: "keyword", 4: "variable" },
            },
            {
              begin: [/for/, /\s+/, s, /\s+/, /in/],
              className: { 1: "keyword", 3: "variable", 5: "keyword" },
            },
            {
              begin: [/type/, /\s+/, s],
              className: { 1: "keyword", 3: "title.class" },
            },
            {
              begin: [/(?:trait|enum|struct|union|impl|for)/, /\s+/, s],
              className: { 1: "keyword", 3: "title.class" },
            },
            {
              begin: e.IDENT_RE + "::",
              keywords: {
                keyword: "Self",
                built_in: o,
                type: c,
              },
            },
            { className: "punctuation", begin: "->" },
            i,
          ],
        };
      },
      grmr_scala: (e) => {
        const n = e.regex,
          t = {
            className: "subst",
            variants: [
              {
                begin: "\\$[A-Za-z0-9_]+",
              },
              { begin: /\$\{/, end: /\}/ },
            ],
          },
          s = {
            className: "string",
            variants: [
              { begin: '"""', end: '"""' },
              {
                begin: '"',
                end: '"',
                illegal: "\\n",
                contains: [e.BACKSLASH_ESCAPE],
              },
              {
                begin: '[a-z]+"',
                end: '"',
                illegal: "\\n",
                contains: [e.BACKSLASH_ESCAPE, t],
              },
              {
                className: "string",
                begin: '[a-z]+"""',
                end: '"""',
                contains: [t],
                relevance: 10,
              },
            ],
          },
          a = { className: "type", begin: "\\b[A-Z][A-Za-z0-9_]*", relevance: 0 },
          i = {
            className: "title",
            begin:
              /[^0-9\n\t "'(),.`{}\[\]:;][^\n\t "'(),.`{}\[\]:;]+|[^0-9\n\t "'(),.`{}\[\]:;=]/,
            relevance: 0,
          },
          r = {
            className: "class",
            beginKeywords: "class object trait type",
            end: /[:={\[\n;]/,
            excludeEnd: !0,
            contains: [
              e.C_LINE_COMMENT_MODE,
              e.C_BLOCK_COMMENT_MODE,
              {
                beginKeywords: "extends with",
                relevance: 10,
              },
              {
                begin: /\[/,
                end: /\]/,
                excludeBegin: !0,
                excludeEnd: !0,
                relevance: 0,
                contains: [a, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE],
              },
              {
                className: "params",
                begin: /\(/,
                end: /\)/,
                excludeBegin: !0,
                excludeEnd: !0,
                relevance: 0,
                contains: [a, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE],
              },
              i,
            ],
          },
          o = {
            className: "function",
            beginKeywords: "def",
            end: n.lookahead(/[:={\[(\n;]/),
            contains: [i],
          };
        return {
          name: "Scala",
          keywords: {
            literal: "true false null",
            keyword:
              "type yield lazy override def with val var sealed abstract private trait object if then forSome for while do throw finally protected extends import final return else break new catch super class case package default try this match continue throws implicit export enum given transparent",
          },
          contains: [
            {
              begin: ["//>", /\s+/, /using/, /\s+/, /\S+/],
              beginScope: { 1: "comment", 3: "keyword", 5: "type" },
              end: /$/,
              contains: [{ className: "string", begin: /\S+/ }],
            },
            e.C_LINE_COMMENT_MODE,
            e.C_BLOCK_COMMENT_MODE,
            s,
            a,
            o,
            r,
            e.C_NUMBER_MODE,
            {
              begin: [/^\s*/, "extension", /\s+(?=[[(])/],
              beginScope: { 2: "keyword" },
            },
            {
              begin: [/^\s*/, /end/, /\s+/, /(extension\b)?/],
              beginScope: { 2: "keyword", 4: "keyword" },
            },
            { match: /\.inline\b/ },
            { begin: /\binline(?=\s)/, keywords: "inline" },
            {
              begin: [/\(\s*/, /using/, /\s+(?!\))/],
              beginScope: { 2: "keyword" },
            },
            { className: "meta", begin: "@[A-Za-z]+" },
          ],
        };
      },
      grmr_scss: (e) => {
        const n = se(e),
          t = oe,
          s = re,
          a = "@[a-z-]+",
          i = {
            className: "variable",
            begin: "(\\$[a-zA-Z-][a-zA-Z0-9_-]*)\\b",
            relevance: 0,
          };
        return {
          name: "SCSS",
          case_insensitive: !0,
          illegal: "[=/|']",
          contains: [
            e.C_LINE_COMMENT_MODE,
            e.C_BLOCK_COMMENT_MODE,
            n.CSS_NUMBER_MODE,
            {
              className: "selector-id",
              begin: "#[A-Za-z0-9_-]+",
              relevance: 0,
            },
            {
              className: "selector-class",
              begin: "\\.[A-Za-z0-9_-]+",
              relevance: 0,
            },
            n.ATTRIBUTE_SELECTOR_MODE,
            {
              className: "selector-tag",
              begin: "\\b(" + ae.join("|") + ")\\b",
              relevance: 0,
            },
            { className: "selector-pseudo", begin: ":(" + s.join("|") + ")" },
            { className: "selector-pseudo", begin: ":(:)?(" + t.join("|") + ")" },
            i,
            { begin: /\(/, end: /\)/, contains: [n.CSS_NUMBER_MODE] },
            n.CSS_VARIABLE,
            { className: "attribute", begin: "\\b(" + ce.join("|") + ")\\b" },
            {
              begin:
                "\\b(whitespace|wait|w-resize|visible|vertical-text|vertical-ideographic|uppercase|upper-roman|upper-alpha|underline|transparent|top|thin|thick|text|text-top|text-bottom|tb-rl|table-header-group|table-footer-group|sw-resize|super|strict|static|square|solid|small-caps|separate|se-resize|scroll|s-resize|rtl|row-resize|ridge|right|repeat|repeat-y|repeat-x|relative|progress|pointer|overline|outside|outset|oblique|nowrap|not-allowed|normal|none|nw-resize|no-repeat|no-drop|newspaper|ne-resize|n-resize|move|middle|medium|ltr|lr-tb|lowercase|lower-roman|lower-alpha|loose|list-item|line|line-through|line-edge|lighter|left|keep-all|justify|italic|inter-word|inter-ideograph|inside|inset|inline|inline-block|inherit|inactive|ideograph-space|ideograph-parenthesis|ideograph-numeric|ideograph-alpha|horizontal|hidden|help|hand|groove|fixed|ellipsis|e-resize|double|dotted|distribute|distribute-space|distribute-letter|distribute-all-lines|disc|disabled|default|decimal|dashed|crosshair|collapse|col-resize|circle|char|center|capitalize|break-word|break-all|bottom|both|bolder|bold|block|bidi-override|below|baseline|auto|always|all-scroll|absolute|table|table-cell)\\b",
            },
            {
              begin: /:/,
              end: /[;}{]/,
              relevance: 0,
              contains: [
                n.BLOCK_COMMENT,
                i,
                n.HEXCOLOR,
                n.CSS_NUMBER_MODE,
                e.QUOTE_STRING_MODE,
                e.APOS_STRING_MODE,
                n.IMPORTANT,
                n.FUNCTION_DISPATCH,
              ],
            },
            {
              begin: "@(page|font-face)",
              keywords: { $pattern: a, keyword: "@page @font-face" },
            },
            {
              begin: "@",
              end: "[{;]",
              returnBegin: !0,
              keywords: {
                $pattern: /[a-z-]+/,
                keyword: "and or not only",
                attribute: ie.join(" "),
              },
              contains: [
                { begin: a, className: "keyword" },
                { begin: /[a-z-]+(?=:)/, className: "attribute" },
                i,
                e.QUOTE_STRING_MODE,
                e.APOS_STRING_MODE,
                n.HEXCOLOR,
                n.CSS_NUMBER_MODE,
              ],
            },
            n.FUNCTION_DISPATCH,
          ],
        };
      },
      grmr_shell: (e) => ({
        name: "Shell Session",
        aliases: ["console", "shellsession"],
        contains: [
          {
            className: "meta.prompt",
            begin: /^\s{0,3}[/~\w\d[\]()@-]*[>%$#][ ]?/,
            starts: { end: /[^\\](?=\s*$)/, subLanguage: "bash" },
          },
        ],
      }),
      grmr_sql: (e) => {
        const n = e.regex,
          t = e.COMMENT("--", "$"),
          s = ["true", "false", "unknown"],
          a = [
            "bigint",
            "binary",
            "blob",
            "boolean",
            "char",
            "character",
            "clob",
            "date",
            "dec",
            "decfloat",
            "decimal",
            "float",
            "int",
            "integer",
            "interval",
            "nchar",
            "nclob",
            "national",
            "numeric",
            "real",
            "row",
            "smallint",
            "time",
            "timestamp",
            "varchar",
            "varying",
            "varbinary",
          ],
          i = [
            "abs",
            "acos",
            "array_agg",
            "asin",
            "atan",
            "avg",
            "cast",
            "ceil",
            "ceiling",
            "coalesce",
            "corr",
            "cos",
            "cosh",
            "count",
            "covar_pop",
            "covar_samp",
            "cume_dist",
            "dense_rank",
            "deref",
            "element",
            "exp",
            "extract",
            "first_value",
            "floor",
            "json_array",
            "json_arrayagg",
            "json_exists",
            "json_object",
            "json_objectagg",
            "json_query",
            "json_table",
            "json_table_primitive",
            "json_value",
            "lag",
            "last_value",
            "lead",
            "listagg",
            "ln",
            "log",
            "log10",
            "lower",
            "max",
            "min",
            "mod",
            "nth_value",
            "ntile",
            "nullif",
            "percent_rank",
            "percentile_cont",
            "percentile_disc",
            "position",
            "position_regex",
            "power",
            "rank",
            "regr_avgx",
            "regr_avgy",
            "regr_count",
            "regr_intercept",
            "regr_r2",
            "regr_slope",
            "regr_sxx",
            "regr_sxy",
            "regr_syy",
            "row_number",
            "sin",
            "sinh",
            "sqrt",
            "stddev_pop",
            "stddev_samp",
            "substring",
            "substring_regex",
            "sum",
            "tan",
            "tanh",
            "translate",
            "translate_regex",
            "treat",
            "trim",
            "trim_array",
            "unnest",
            "upper",
            "value_of",
            "var_pop",
            "var_samp",
            "width_bucket",
          ],
          r = [
            "create table",
            "insert into",
            "primary key",
            "foreign key",
            "not null",
            "alter table",
            "add constraint",
            "grouping sets",
            "on overflow",
            "character set",
            "respect nulls",
            "ignore nulls",
            "nulls first",
            "nulls last",
            "depth first",
            "breadth first",
          ],
          o = i,
          c = [
            "abs",
            "acos",
            "all",
            "allocate",
            "alter",
            "and",
            "any",
            "are",
            "array",
            "array_agg",
            "array_max_cardinality",
            "as",
            "asensitive",
            "asin",
            "asymmetric",
            "at",
            "atan",
            "atomic",
            "authorization",
            "avg",
            "begin",
            "begin_frame",
            "begin_partition",
            "between",
            "bigint",
            "binary",
            "blob",
            "boolean",
            "both",
            "by",
            "call",
            "called",
            "cardinality",
            "cascaded",
            "case",
            "cast",
            "ceil",
            "ceiling",
            "char",
            "char_length",
            "character",
            "character_length",
            "check",
            "classifier",
            "clob",
            "close",
            "coalesce",
            "collate",
            "collect",
            "column",
            "commit",
            "condition",
            "connect",
            "constraint",
            "contains",
            "convert",
            "copy",
            "corr",
            "corresponding",
            "cos",
            "cosh",
            "count",
            "covar_pop",
            "covar_samp",
            "create",
            "cross",
            "cube",
            "cume_dist",
            "current",
            "current_catalog",
            "current_date",
            "current_default_transform_group",
            "current_path",
            "current_role",
            "current_row",
            "current_schema",
            "current_time",
            "current_timestamp",
            "current_path",
            "current_role",
            "current_transform_group_for_type",
            "current_user",
            "cursor",
            "cycle",
            "date",
            "day",
            "deallocate",
            "dec",
            "decimal",
            "decfloat",
            "declare",
            "default",
            "define",
            "delete",
            "dense_rank",
            "deref",
            "describe",
            "deterministic",
            "disconnect",
            "distinct",
            "double",
            "drop",
            "dynamic",
            "each",
            "element",
            "else",
            "empty",
            "end",
            "end_frame",
            "end_partition",
            "end-exec",
            "equals",
            "escape",
            "every",
            "except",
            "exec",
            "execute",
            "exists",
            "exp",
            "external",
            "extract",
            "false",
            "fetch",
            "filter",
            "first_value",
            "float",
            "floor",
            "for",
            "foreign",
            "frame_row",
            "free",
            "from",
            "full",
            "function",
            "fusion",
            "get",
            "global",
            "grant",
            "group",
            "grouping",
            "groups",
            "having",
            "hold",
            "hour",
            "identity",
            "in",
            "indicator",
            "initial",
            "inner",
            "inout",
            "insensitive",
            "insert",
            "int",
            "integer",
            "intersect",
            "intersection",
            "interval",
            "into",
            "is",
            "join",
            "json_array",
            "json_arrayagg",
            "json_exists",
            "json_object",
            "json_objectagg",
            "json_query",
            "json_table",
            "json_table_primitive",
            "json_value",
            "lag",
            "language",
            "large",
            "last_value",
            "lateral",
            "lead",
            "leading",
            "left",
            "like",
            "like_regex",
            "listagg",
            "ln",
            "local",
            "localtime",
            "localtimestamp",
            "log",
            "log10",
            "lower",
            "match",
            "match_number",
            "match_recognize",
            "matches",
            "max",
            "member",
            "merge",
            "method",
            "min",
            "minute",
            "mod",
            "modifies",
            "module",
            "month",
            "multiset",
            "national",
            "natural",
            "nchar",
            "nclob",
            "new",
            "no",
            "none",
            "normalize",
            "not",
            "nth_value",
            "ntile",
            "null",
            "nullif",
            "numeric",
            "octet_length",
            "occurrences_regex",
            "of",
            "offset",
            "old",
            "omit",
            "on",
            "one",
            "only",
            "open",
            "or",
            "order",
            "out",
            "outer",
            "over",
            "overlaps",
            "overlay",
            "parameter",
            "partition",
            "pattern",
            "per",
            "percent",
            "percent_rank",
            "percentile_cont",
            "percentile_disc",
            "period",
            "portion",
            "position",
            "position_regex",
            "power",
            "precedes",
            "precision",
            "prepare",
            "primary",
            "procedure",
            "ptf",
            "range",
            "rank",
            "reads",
            "real",
            "recursive",
            "ref",
            "references",
            "referencing",
            "regr_avgx",
            "regr_avgy",
            "regr_count",
            "regr_intercept",
            "regr_r2",
            "regr_slope",
            "regr_sxx",
            "regr_sxy",
            "regr_syy",
            "release",
            "result",
            "return",
            "returns",
            "revoke",
            "right",
            "rollback",
            "rollup",
            "row",
            "row_number",
            "rows",
            "running",
            "savepoint",
            "scope",
            "scroll",
            "search",
            "second",
            "seek",
            "select",
            "sensitive",
            "session_user",
            "set",
            "show",
            "similar",
            "sin",
            "sinh",
            "skip",
            "smallint",
            "some",
            "specific",
            "specifictype",
            "sql",
            "sqlexception",
            "sqlstate",
            "sqlwarning",
            "sqrt",
            "start",
            "static",
            "stddev_pop",
            "stddev_samp",
            "submultiset",
            "subset",
            "substring",
            "substring_regex",
            "succeeds",
            "sum",
            "symmetric",
            "system",
            "system_time",
            "system_user",
            "table",
            "tablesample",
            "tan",
            "tanh",
            "then",
            "time",
            "timestamp",
            "timezone_hour",
            "timezone_minute",
            "to",
            "trailing",
            "translate",
            "translate_regex",
            "translation",
            "treat",
            "trigger",
            "trim",
            "trim_array",
            "true",
            "truncate",
            "uescape",
            "union",
            "unique",
            "unknown",
            "unnest",
            "update",
            "upper",
            "user",
            "using",
            "value",
            "values",
            "value_of",
            "var_pop",
            "var_samp",
            "varbinary",
            "varchar",
            "varying",
            "versioning",
            "when",
            "whenever",
            "where",
            "width_bucket",
            "window",
            "with",
            "within",
            "without",
            "year",
            "add",
            "asc",
            "collation",
            "desc",
            "final",
            "first",
            "last",
            "view",
          ].filter((e) => !i.includes(e)),
          l = {
            begin: n.concat(/\b/, n.either(...o), /\s*\(/),
            relevance: 0,
            keywords: { built_in: o },
          };
        return {
          name: "SQL",
          case_insensitive: !0,
          illegal: /[{}]|<\//,
          keywords: {
            $pattern: /\b[\w\.]+/,
            keyword: ((e, { exceptions: n, when: t } = {}) => {
              const s = t;
              return (
                (n = n || []),
                e.map((e) =>
                  e.match(/\|\d+$/) || n.includes(e) ? e : s(e) ? e + "|0" : e
                )
              );
            })(c, { when: (e) => e.length < 3 }),
            literal: s,
            type: a,
            built_in: [
              "current_catalog",
              "current_date",
              "current_default_transform_group",
              "current_path",
              "current_role",
              "current_schema",
              "current_transform_group_for_type",
              "current_user",
              "session_user",
              "system_time",
              "system_user",
              "current_time",
              "localtime",
              "current_timestamp",
              "localtimestamp",
            ],
          },
          contains: [
            {
              begin: n.either(...r),
              relevance: 0,
              keywords: {
                $pattern: /[\w\.]+/,
                keyword: c.concat(r),
                literal: s,
                type: a,
              },
            },
            {
              className: "type",
              begin: n.either(
                "double precision",
                "large object",
                "with timezone",
                "without timezone"
              ),
            },
            l,
            { className: "variable", begin: /@[a-z0-9][a-z0-9_]*/ },
            {
              className: "string",
              variants: [{ begin: /'/, end: /'/, contains: [{ begin: /''/ }] }],
            },
            { begin: /"/, end: /"/, contains: [{ begin: /""/ }] },
            e.C_NUMBER_MODE,
            e.C_BLOCK_COMMENT_MODE,
            t,
            {
              className: "operator",
              begin: /[-+*/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?/,
              relevance: 0,
            },
          ],
        };
      },
      grmr_swift: (e) => {
        const n = { match: /\s+/, relevance: 0 },
          t = e.COMMENT("/\\*", "\\*/", { contains: ["self"] }),
          s = [e.C_LINE_COMMENT_MODE, t],
          a = {
            match: [/\./, b(...ke, ...Oe)],
            className: { 2: "keyword" },
          },
          i = { match: u(/\./, b(...Ae)), relevance: 0 },
          r = Ae.filter((e) => "string" == typeof e).concat(["_|0"]),
          o = {
            variants: [
              {
                className: "keyword",
                match: b(
                  ...Ae.filter((e) => "string" != typeof e)
                    .concat(Me)
                    .map(xe),
                  ...Oe
                ),
              },
            ],
          },
          c = {
            $pattern: b(/\b\w+/, /#\w+/),
            keyword: r.concat(Te),
            literal: Se,
          },
          l = [a, i, o],
          p = [
            {
              match: u(/\./, b(...qe)),
              relevance: 0,
            },
            { className: "built_in", match: u(/\b/, b(...qe), /(?=\()/) },
          ],
          m = { match: /->/, relevance: 0 },
          g = [
            m,
            {
              className: "operator",
              relevance: 0,
              variants: [{ match: Ie }, { match: `\\.(\\.|${Re})+` }],
            },
          ],
          v = "([0-9]_*)+",
          _ = "([0-9a-fA-F]_*)+",
          f = {
            className: "number",
            relevance: 0,
            variants: [
              { match: `\\b(${v})(\\.(${v}))?([eE][+-]?(${v}))?\\b` },
              {
                match: `\\b0x(${_})(\\.(${_}))?([pP][+-]?(${v}))?\\b`,
              },
              { match: /\b0o([0-7]_*)+\b/ },
              { match: /\b0b([01]_*)+\b/ },
            ],
          },
          h = (e = "") => ({
            className: "subst",
            variants: [
              {
                match: u(/\\/, e, /[0\\tnr"']/),
              },
              { match: u(/\\/, e, /u\{[0-9a-fA-F]{1,8}\}/) },
            ],
          }),
          E = (e = "") => ({
            className: "subst",
            match: u(/\\/, e, /[\t ]*(?:[\r\n]|\r\n)/),
          }),
          w = (e = "") => ({
            className: "subst",
            label: "interpol",
            begin: u(/\\/, e, /\(/),
            end: /\)/,
          }),
          y = (e = "") => ({
            begin: u(e, /"""/),
            end: u(/"""/, e),
            contains: [h(e), E(e), w(e)],
          }),
          N = (e = "") => ({
            begin: u(e, /"/),
            end: u(/"/, e),
            contains: [h(e), w(e)],
          }),
          x = {
            className: "string",
            variants: [
              y(),
              y("#"),
              y("##"),
              y("###"),
              N(),
              N("#"),
              N("##"),
              N("###"),
            ],
          },
          k = [
            e.BACKSLASH_ESCAPE,
            {
              begin: /\[/,
              end: /\]/,
              relevance: 0,
              contains: [e.BACKSLASH_ESCAPE],
            },
          ],
          O = { begin: /\/[^\s](?=[^/\n]*\/)/, end: /\//, contains: k },
          M = (e) => {
            const n = u(e, /\//),
              t = u(/\//, e);
            return {
              begin: n,
              end: t,
              contains: [
                ...k,
                { scope: "comment", begin: `#(?!.*${t})`, end: /$/ },
              ],
            };
          },
          A = {
            scope: "regexp",
            variants: [M("###"), M("##"), M("#"), O],
          },
          S = { match: u(/`/, ze, /`/) },
          C = [
            S,
            { className: "variable", match: /\$\d+/ },
            { className: "variable", match: `\\$${Be}+` },
          ],
          T = [
            {
              match: /(@|#(un)?)available/,
              scope: "keyword",
              starts: {
                contains: [
                  {
                    begin: /\(/,
                    end: /\)/,
                    keywords: Ue,
                    contains: [...g, f, x],
                  },
                ],
              },
            },
            {
              scope: "keyword",
              match: u(/@/, b(...$e), d(b(/\(/, /\s+/))),
            },
            { scope: "meta", match: u(/@/, ze) },
          ],
          q = {
            match: d(/\b[A-Z]/),
            relevance: 0,
            contains: [
              {
                className: "type",
                match: u(
                  /(AV|CA|CF|CG|CI|CL|CM|CN|CT|MK|MP|MTK|MTL|NS|SCN|SK|UI|WK|XC)/,
                  Be,
                  "+"
                ),
              },
              { className: "type", match: Fe, relevance: 0 },
              { match: /[?!]+/, relevance: 0 },
              {
                match: /\.\.\./,
                relevance: 0,
              },
              { match: u(/\s+&\s+/, d(Fe)), relevance: 0 },
            ],
          },
          D = {
            begin: /</,
            end: />/,
            keywords: c,
            contains: [...s, ...l, ...T, m, q],
          };
        q.contains.push(D);
        const R = {
            begin: /\(/,
            end: /\)/,
            relevance: 0,
            keywords: c,
            contains: [
              "self",
              {
                match: u(ze, /\s*:/),
                keywords: "_|0",
                relevance: 0,
              },
              ...s,
              A,
              ...l,
              ...p,
              ...g,
              f,
              x,
              ...C,
              ...T,
              q,
            ],
          },
          I = {
            begin: /</,
            end: />/,
            keywords: "repeat each",
            contains: [...s, q],
          },
          L = {
            begin: /\(/,
            end: /\)/,
            keywords: c,
            contains: [
              {
                begin: b(d(u(ze, /\s*:/)), d(u(ze, /\s+/, ze, /\s*:/))),
                end: /:/,
                relevance: 0,
                contains: [
                  { className: "keyword", match: /\b_\b/ },
                  { className: "params", match: ze },
                ],
              },
              ...s,
              ...l,
              ...g,
              f,
              x,
              ...T,
              q,
              R,
            ],
            endsParent: !0,
            illegal: /["']/,
          },
          B = {
            match: [/(func|macro)/, /\s+/, b(S.match, ze, Ie)],
            className: { 1: "keyword", 3: "title.function" },
            contains: [I, L, n],
            illegal: [/\[/, /%/],
          },
          z = {
            match: [/\b(?:subscript|init[?!]?)/, /\s*(?=[<(])/],
            className: { 1: "keyword" },
            contains: [I, L, n],
            illegal: /\[|%/,
          },
          F = {
            match: [/operator/, /\s+/, Ie],
            className: {
              1: "keyword",
              3: "title",
            },
          },
          $ = {
            begin: [/precedencegroup/, /\s+/, Fe],
            className: {
              1: "keyword",
              3: "title",
            },
            contains: [q],
            keywords: [...Ce, ...Se],
            end: /}/,
          },
          U = {
            begin: [
              /(struct|protocol|class|extension|enum|actor)/,
              /\s+/,
              ze,
              /\s*/,
            ],
            beginScope: { 1: "keyword", 3: "title.class" },
            keywords: c,
            contains: [
              I,
              ...l,
              {
                begin: /:/,
                end: /\{/,
                keywords: c,
                contains: [{ scope: "title.class.inherited", match: Fe }, ...l],
                relevance: 0,
              },
            ],
          };
        for (const e of x.variants) {
          const n = e.contains.find((e) => "interpol" === e.label);
          n.keywords = c;
          const t = [...l, ...p, ...g, f, x, ...C];
          n.contains = [
            ...t,
            { begin: /\(/, end: /\)/, contains: ["self", ...t] },
          ];
        }
        return {
          name: "Swift",
          keywords: c,
          contains: [
            ...s,
            B,
            z,
            U,
            F,
            $,
            { beginKeywords: "import", end: /$/, contains: [...s], relevance: 0 },
            A,
            ...l,
            ...p,
            ...g,
            f,
            x,
            ...C,
            ...T,
            q,
            R,
          ],
        };
      },
      grmr_typescript: (e) => {
        const n = Ne(e),
          t = ge,
          s = [
            "any",
            "void",
            "number",
            "boolean",
            "string",
            "object",
            "never",
            "symbol",
            "bigint",
            "unknown",
          ],
          a = {
            begin: [/namespace/, /\s+/, e.IDENT_RE],
            beginScope: { 1: "keyword", 3: "title.class" },
          },
          i = {
            beginKeywords: "interface",
            end: /\{/,
            excludeEnd: !0,
            keywords: {
              keyword: "interface extends",
              built_in: s,
            },
            contains: [n.exports.CLASS_REFERENCE],
          },
          r = {
            $pattern: ge,
            keyword: ve.concat([
              "type",
              "interface",
              "public",
              "private",
              "protected",
              "implements",
              "declare",
              "abstract",
              "readonly",
              "enum",
              "override",
              "satisfies",
            ]),
            literal: _e,
            built_in: ye.concat(s),
            "variable.language": we,
          },
          o = { className: "meta", begin: "@" + t },
          c = (e, n, t) => {
            const s = e.contains.findIndex((e) => e.label === n);
            if (-1 === s) throw Error("can not find mode to replace");
            e.contains.splice(s, 1, t);
          };
        Object.assign(n.keywords, r), n.exports.PARAMS_CONTAINS.push(o);
        const l = n.contains.find((e) => "attr" === e.className);
        return (
          n.exports.PARAMS_CONTAINS.push([n.exports.CLASS_REFERENCE, l]),
          (n.contains = n.contains.concat([o, a, i])),
          c(n, "shebang", e.SHEBANG()),
          c(n, "use_strict", {
            className: "meta",
            relevance: 10,
            begin: /^\s*['"]use strict['"]/,
          }),
          (n.contains.find((e) => "func.def" === e.label).relevance = 0),
          Object.assign(n, {
            name: "TypeScript",
            aliases: ["ts", "tsx", "mts", "cts"],
          }),
          n
        );
      },
      grmr_vbnet: (e) => {
        const n = e.regex,
          t = /\d{1,2}\/\d{1,2}\/\d{4}/,
          s = /\d{4}-\d{1,2}-\d{1,2}/,
          a = /(\d|1[012])(:\d+){0,2} *(AM|PM)/,
          i = /\d{1,2}(:\d{1,2}){1,2}/,
          r = {
            className: "literal",
            variants: [
              { begin: n.concat(/# */, n.either(s, t), / *#/) },
              {
                begin: n.concat(/# */, i, / *#/),
              },
              { begin: n.concat(/# */, a, / *#/) },
              {
                begin: n.concat(
                  /# */,
                  n.either(s, t),
                  / +/,
                  n.either(a, i),
                  / *#/
                ),
              },
            ],
          },
          o = e.COMMENT(/'''/, /$/, {
            contains: [{ className: "doctag", begin: /<\/?/, end: />/ }],
          }),
          c = e.COMMENT(null, /$/, {
            variants: [{ begin: /'/ }, { begin: /([\t ]|^)REM(?=\s)/ }],
          });
        return {
          name: "Visual Basic .NET",
          aliases: ["vb"],
          case_insensitive: !0,
          classNameAliases: { label: "symbol" },
          keywords: {
            keyword:
              "addhandler alias aggregate ansi as async assembly auto binary by byref byval call case catch class compare const continue custom declare default delegate dim distinct do each equals else elseif end enum erase error event exit explicit finally for friend from function get global goto group handles if implements imports in inherits interface into iterator join key let lib loop me mid module mustinherit mustoverride mybase myclass namespace narrowing new next notinheritable notoverridable of off on operator option optional order overloads overridable overrides paramarray partial preserve private property protected public raiseevent readonly redim removehandler resume return select set shadows shared skip static step stop structure strict sub synclock take text then throw to try unicode until using when where while widening with withevents writeonly yield",
            built_in:
              "addressof and andalso await directcast gettype getxmlnamespace is isfalse isnot istrue like mod nameof new not or orelse trycast typeof xor cbool cbyte cchar cdate cdbl cdec cint clng cobj csbyte cshort csng cstr cuint culng cushort",
            type: "boolean byte char date decimal double integer long object sbyte short single string uinteger ulong ushort",
            literal: "true false nothing",
          },
          illegal: "//|\\{|\\}|endif|gosub|variant|wend|^\\$ ",
          contains: [
            {
              className: "string",
              begin: /"(""|[^/n])"C\b/,
            },
            {
              className: "string",
              begin: /"/,
              end: /"/,
              illegal: /\n/,
              contains: [{ begin: /""/ }],
            },
            r,
            {
              className: "number",
              relevance: 0,
              variants: [
                {
                  begin:
                    /\b\d[\d_]*((\.[\d_]+(E[+-]?[\d_]+)?)|(E[+-]?[\d_]+))[RFD@!#]?/,
                },
                { begin: /\b\d[\d_]*((U?[SIL])|[%&])?/ },
                { begin: /&H[\dA-F_]+((U?[SIL])|[%&])?/ },
                {
                  begin: /&O[0-7_]+((U?[SIL])|[%&])?/,
                },
                { begin: /&B[01_]+((U?[SIL])|[%&])?/ },
              ],
            },
            {
              className: "label",
              begin: /^\w+:/,
            },
            o,
            c,
            {
              className: "meta",
              begin:
                /[\t ]*#(const|disable|else|elseif|enable|end|externalsource|if|region)\b/,
              end: /$/,
              keywords: {
                keyword:
                  "const disable else elseif enable end externalsource if region then",
              },
              contains: [c],
            },
          ],
        };
      },
      grmr_wasm: (e) => {
        e.regex;
        const n = e.COMMENT(/\(;/, /;\)/);
        return (
          n.contains.push("self"),
          {
            name: "WebAssembly",
            keywords: {
              $pattern: /[\w.]+/,
              keyword: [
                "anyfunc",
                "block",
                "br",
                "br_if",
                "br_table",
                "call",
                "call_indirect",
                "data",
                "drop",
                "elem",
                "else",
                "end",
                "export",
                "func",
                "global.get",
                "global.set",
                "local.get",
                "local.set",
                "local.tee",
                "get_global",
                "get_local",
                "global",
                "if",
                "import",
                "local",
                "loop",
                "memory",
                "memory.grow",
                "memory.size",
                "module",
                "mut",
                "nop",
                "offset",
                "param",
                "result",
                "return",
                "select",
                "set_global",
                "set_local",
                "start",
                "table",
                "tee_local",
                "then",
                "type",
                "unreachable",
              ],
            },
            contains: [
              e.COMMENT(/;;/, /$/),
              n,
              {
                match: [/(?:offset|align)/, /\s*/, /=/],
                className: { 1: "keyword", 3: "operator" },
              },
              { className: "variable", begin: /\$[\w_]+/ },
              {
                match: /(\((?!;)|\))+/,
                className: "punctuation",
                relevance: 0,
              },
              {
                begin: [/(?:func|call|call_indirect)/, /\s+/, /\$[^\s)]+/],
                className: { 1: "keyword", 3: "title.function" },
              },
              e.QUOTE_STRING_MODE,
              { match: /(i32|i64|f32|f64)(?!\.)/, className: "type" },
              {
                className: "keyword",
                match:
                  /\b(f32|f64|i32|i64)(?:\.(?:abs|add|and|ceil|clz|const|convert_[su]\/i(?:32|64)|copysign|ctz|demote\/f64|div(?:_[su])?|eqz?|extend_[su]\/i32|floor|ge(?:_[su])?|gt(?:_[su])?|le(?:_[su])?|load(?:(?:8|16|32)_[su])?|lt(?:_[su])?|max|min|mul|nearest|neg?|or|popcnt|promote\/f32|reinterpret\/[fi](?:32|64)|rem_[su]|rot[lr]|shl|shr_[su]|store(?:8|16|32)?|sqrt|sub|trunc(?:_[su]\/f(?:32|64))?|wrap\/i64|xor))\b/,
              },
              {
                className: "number",
                relevance: 0,
                match:
                  /[+-]?\b(?:\d(?:_?\d)*(?:\.\d(?:_?\d)*)?(?:[eE][+-]?\d(?:_?\d)*)?|0x[\da-fA-F](?:_?[\da-fA-F])*(?:\.[\da-fA-F](?:_?[\da-fA-D])*)?(?:[pP][+-]?\d(?:_?\d)*)?)\b|\binf\b|\bnan(?::0x[\da-fA-F](?:_?[\da-fA-D])*)?\b/,
              },
            ],
          }
        );
      },
      grmr_x86asm: (e) => ({
        name: "Intel x86 Assembly",
        case_insensitive: !0,
        keywords: {
          $pattern: "[.%]?" + e.IDENT_RE,
          keyword:
            "lock rep repe repz repne repnz xaquire xrelease bnd nobnd aaa aad aam aas adc add and arpl bb0_reset bb1_reset bound bsf bsr bswap bt btc btr bts call cbw cdq cdqe clc cld cli clts cmc cmp cmpsb cmpsd cmpsq cmpsw cmpxchg cmpxchg486 cmpxchg8b cmpxchg16b cpuid cpu_read cpu_write cqo cwd cwde daa das dec div dmint emms enter equ f2xm1 fabs fadd faddp fbld fbstp fchs fclex fcmovb fcmovbe fcmove fcmovnb fcmovnbe fcmovne fcmovnu fcmovu fcom fcomi fcomip fcomp fcompp fcos fdecstp fdisi fdiv fdivp fdivr fdivrp femms feni ffree ffreep fiadd ficom ficomp fidiv fidivr fild fimul fincstp finit fist fistp fisttp fisub fisubr fld fld1 fldcw fldenv fldl2e fldl2t fldlg2 fldln2 fldpi fldz fmul fmulp fnclex fndisi fneni fninit fnop fnsave fnstcw fnstenv fnstsw fpatan fprem fprem1 fptan frndint frstor fsave fscale fsetpm fsin fsincos fsqrt fst fstcw fstenv fstp fstsw fsub fsubp fsubr fsubrp ftst fucom fucomi fucomip fucomp fucompp fxam fxch fxtract fyl2x fyl2xp1 hlt ibts icebp idiv imul in inc incbin insb insd insw int int01 int1 int03 int3 into invd invpcid invlpg invlpga iret iretd iretq iretw jcxz jecxz jrcxz jmp jmpe lahf lar lds lea leave les lfence lfs lgdt lgs lidt lldt lmsw loadall loadall286 lodsb lodsd lodsq lodsw loop loope loopne loopnz loopz lsl lss ltr mfence monitor mov movd movq movsb movsd movsq movsw movsx movsxd movzx mul mwait neg nop not or out outsb outsd outsw packssdw packsswb packuswb paddb paddd paddsb paddsiw paddsw paddusb paddusw paddw pand pandn pause paveb pavgusb pcmpeqb pcmpeqd pcmpeqw pcmpgtb pcmpgtd pcmpgtw pdistib pf2id pfacc pfadd pfcmpeq pfcmpge pfcmpgt pfmax pfmin pfmul pfrcp pfrcpit1 pfrcpit2 pfrsqit1 pfrsqrt pfsub pfsubr pi2fd pmachriw pmaddwd pmagw pmulhriw pmulhrwa pmulhrwc pmulhw pmullw pmvgezb pmvlzb pmvnzb pmvzb pop popa popad popaw popf popfd popfq popfw por prefetch prefetchw pslld psllq psllw psrad psraw psrld psrlq psrlw psubb psubd psubsb psubsiw psubsw psubusb psubusw psubw punpckhbw punpckhdq punpckhwd punpcklbw punpckldq punpcklwd push pusha pushad pushaw pushf pushfd pushfq pushfw pxor rcl rcr rdshr rdmsr rdpmc rdtsc rdtscp ret retf retn rol ror rdm rsdc rsldt rsm rsts sahf sal salc sar sbb scasb scasd scasq scasw sfence sgdt shl shld shr shrd sidt sldt skinit smi smint smintold smsw stc std sti stosb stosd stosq stosw str sub svdc svldt svts swapgs syscall sysenter sysexit sysret test ud0 ud1 ud2b ud2 ud2a umov verr verw fwait wbinvd wrshr wrmsr xadd xbts xchg xlatb xlat xor cmove cmovz cmovne cmovnz cmova cmovnbe cmovae cmovnb cmovb cmovnae cmovbe cmovna cmovg cmovnle cmovge cmovnl cmovl cmovnge cmovle cmovng cmovc cmovnc cmovo cmovno cmovs cmovns cmovp cmovpe cmovnp cmovpo je jz jne jnz ja jnbe jae jnb jb jnae jbe jna jg jnle jge jnl jl jnge jle jng jc jnc jo jno js jns jpo jnp jpe jp sete setz setne setnz seta setnbe setae setnb setnc setb setnae setcset setbe setna setg setnle setge setnl setl setnge setle setng sets setns seto setno setpe setp setpo setnp addps addss andnps andps cmpeqps cmpeqss cmpleps cmpless cmpltps cmpltss cmpneqps cmpneqss cmpnleps cmpnless cmpnltps cmpnltss cmpordps cmpordss cmpunordps cmpunordss cmpps cmpss comiss cvtpi2ps cvtps2pi cvtsi2ss cvtss2si cvttps2pi cvttss2si divps divss ldmxcsr maxps maxss minps minss movaps movhps movlhps movlps movhlps movmskps movntps movss movups mulps mulss orps rcpps rcpss rsqrtps rsqrtss shufps sqrtps sqrtss stmxcsr subps subss ucomiss unpckhps unpcklps xorps fxrstor fxrstor64 fxsave fxsave64 xgetbv xsetbv xsave xsave64 xsaveopt xsaveopt64 xrstor xrstor64 prefetchnta prefetcht0 prefetcht1 prefetcht2 maskmovq movntq pavgb pavgw pextrw pinsrw pmaxsw pmaxub pminsw pminub pmovmskb pmulhuw psadbw pshufw pf2iw pfnacc pfpnacc pi2fw pswapd maskmovdqu clflush movntdq movnti movntpd movdqa movdqu movdq2q movq2dq paddq pmuludq pshufd pshufhw pshuflw pslldq psrldq psubq punpckhqdq punpcklqdq addpd addsd andnpd andpd cmpeqpd cmpeqsd cmplepd cmplesd cmpltpd cmpltsd cmpneqpd cmpneqsd cmpnlepd cmpnlesd cmpnltpd cmpnltsd cmpordpd cmpordsd cmpunordpd cmpunordsd cmppd comisd cvtdq2pd cvtdq2ps cvtpd2dq cvtpd2pi cvtpd2ps cvtpi2pd cvtps2dq cvtps2pd cvtsd2si cvtsd2ss cvtsi2sd cvtss2sd cvttpd2pi cvttpd2dq cvttps2dq cvttsd2si divpd divsd maxpd maxsd minpd minsd movapd movhpd movlpd movmskpd movupd mulpd mulsd orpd shufpd sqrtpd sqrtsd subpd subsd ucomisd unpckhpd unpcklpd xorpd addsubpd addsubps haddpd haddps hsubpd hsubps lddqu movddup movshdup movsldup clgi stgi vmcall vmclear vmfunc vmlaunch vmload vmmcall vmptrld vmptrst vmread vmresume vmrun vmsave vmwrite vmxoff vmxon invept invvpid pabsb pabsw pabsd palignr phaddw phaddd phaddsw phsubw phsubd phsubsw pmaddubsw pmulhrsw pshufb psignb psignw psignd extrq insertq movntsd movntss lzcnt blendpd blendps blendvpd blendvps dppd dpps extractps insertps movntdqa mpsadbw packusdw pblendvb pblendw pcmpeqq pextrb pextrd pextrq phminposuw pinsrb pinsrd pinsrq pmaxsb pmaxsd pmaxud pmaxuw pminsb pminsd pminud pminuw pmovsxbw pmovsxbd pmovsxbq pmovsxwd pmovsxwq pmovsxdq pmovzxbw pmovzxbd pmovzxbq pmovzxwd pmovzxwq pmovzxdq pmuldq pmulld ptest roundpd roundps roundsd roundss crc32 pcmpestri pcmpestrm pcmpistri pcmpistrm pcmpgtq popcnt getsec pfrcpv pfrsqrtv movbe aesenc aesenclast aesdec aesdeclast aesimc aeskeygenassist vaesenc vaesenclast vaesdec vaesdeclast vaesimc vaeskeygenassist vaddpd vaddps vaddsd vaddss vaddsubpd vaddsubps vandpd vandps vandnpd vandnps vblendpd vblendps vblendvpd vblendvps vbroadcastss vbroadcastsd vbroadcastf128 vcmpeq_ospd vcmpeqpd vcmplt_ospd vcmpltpd vcmple_ospd vcmplepd vcmpunord_qpd vcmpunordpd vcmpneq_uqpd vcmpneqpd vcmpnlt_uspd vcmpnltpd vcmpnle_uspd vcmpnlepd vcmpord_qpd vcmpordpd vcmpeq_uqpd vcmpnge_uspd vcmpngepd vcmpngt_uspd vcmpngtpd vcmpfalse_oqpd vcmpfalsepd vcmpneq_oqpd vcmpge_ospd vcmpgepd vcmpgt_ospd vcmpgtpd vcmptrue_uqpd vcmptruepd vcmplt_oqpd vcmple_oqpd vcmpunord_spd vcmpneq_uspd vcmpnlt_uqpd vcmpnle_uqpd vcmpord_spd vcmpeq_uspd vcmpnge_uqpd vcmpngt_uqpd vcmpfalse_ospd vcmpneq_ospd vcmpge_oqpd vcmpgt_oqpd vcmptrue_uspd vcmppd vcmpeq_osps vcmpeqps vcmplt_osps vcmpltps vcmple_osps vcmpleps vcmpunord_qps vcmpunordps vcmpneq_uqps vcmpneqps vcmpnlt_usps vcmpnltps vcmpnle_usps vcmpnleps vcmpord_qps vcmpordps vcmpeq_uqps vcmpnge_usps vcmpngeps vcmpngt_usps vcmpngtps vcmpfalse_oqps vcmpfalseps vcmpneq_oqps vcmpge_osps vcmpgeps vcmpgt_osps vcmpgtps vcmptrue_uqps vcmptrueps vcmplt_oqps vcmple_oqps vcmpunord_sps vcmpneq_usps vcmpnlt_uqps vcmpnle_uqps vcmpord_sps vcmpeq_usps vcmpnge_uqps vcmpngt_uqps vcmpfalse_osps vcmpneq_osps vcmpge_oqps vcmpgt_oqps vcmptrue_usps vcmpps vcmpeq_ossd vcmpeqsd vcmplt_ossd vcmpltsd vcmple_ossd vcmplesd vcmpunord_qsd vcmpunordsd vcmpneq_uqsd vcmpneqsd vcmpnlt_ussd vcmpnltsd vcmpnle_ussd vcmpnlesd vcmpord_qsd vcmpordsd vcmpeq_uqsd vcmpnge_ussd vcmpngesd vcmpngt_ussd vcmpngtsd vcmpfalse_oqsd vcmpfalsesd vcmpneq_oqsd vcmpge_ossd vcmpgesd vcmpgt_ossd vcmpgtsd vcmptrue_uqsd vcmptruesd vcmplt_oqsd vcmple_oqsd vcmpunord_ssd vcmpneq_ussd vcmpnlt_uqsd vcmpnle_uqsd vcmpord_ssd vcmpeq_ussd vcmpnge_uqsd vcmpngt_uqsd vcmpfalse_ossd vcmpneq_ossd vcmpge_oqsd vcmpgt_oqsd vcmptrue_ussd vcmpsd vcmpeq_osss vcmpeqss vcmplt_osss vcmpltss vcmple_osss vcmpless vcmpunord_qss vcmpunordss vcmpneq_uqss vcmpneqss vcmpnlt_usss vcmpnltss vcmpnle_usss vcmpnless vcmpord_qss vcmpordss vcmpeq_uqss vcmpnge_usss vcmpngess vcmpngt_usss vcmpngtss vcmpfalse_oqss vcmpfalsess vcmpneq_oqss vcmpge_osss vcmpgess vcmpgt_osss vcmpgtss vcmptrue_uqss vcmptruess vcmplt_oqss vcmple_oqss vcmpunord_sss vcmpneq_usss vcmpnlt_uqss vcmpnle_uqss vcmpord_sss vcmpeq_usss vcmpnge_uqss vcmpngt_uqss vcmpfalse_osss vcmpneq_osss vcmpge_oqss vcmpgt_oqss vcmptrue_usss vcmpss vcomisd vcomiss vcvtdq2pd vcvtdq2ps vcvtpd2dq vcvtpd2ps vcvtps2dq vcvtps2pd vcvtsd2si vcvtsd2ss vcvtsi2sd vcvtsi2ss vcvtss2sd vcvtss2si vcvttpd2dq vcvttps2dq vcvttsd2si vcvttss2si vdivpd vdivps vdivsd vdivss vdppd vdpps vextractf128 vextractps vhaddpd vhaddps vhsubpd vhsubps vinsertf128 vinsertps vlddqu vldqqu vldmxcsr vmaskmovdqu vmaskmovps vmaskmovpd vmaxpd vmaxps vmaxsd vmaxss vminpd vminps vminsd vminss vmovapd vmovaps vmovd vmovq vmovddup vmovdqa vmovqqa vmovdqu vmovqqu vmovhlps vmovhpd vmovhps vmovlhps vmovlpd vmovlps vmovmskpd vmovmskps vmovntdq vmovntqq vmovntdqa vmovntpd vmovntps vmovsd vmovshdup vmovsldup vmovss vmovupd vmovups vmpsadbw vmulpd vmulps vmulsd vmulss vorpd vorps vpabsb vpabsw vpabsd vpacksswb vpackssdw vpackuswb vpackusdw vpaddb vpaddw vpaddd vpaddq vpaddsb vpaddsw vpaddusb vpaddusw vpalignr vpand vpandn vpavgb vpavgw vpblendvb vpblendw vpcmpestri vpcmpestrm vpcmpistri vpcmpistrm vpcmpeqb vpcmpeqw vpcmpeqd vpcmpeqq vpcmpgtb vpcmpgtw vpcmpgtd vpcmpgtq vpermilpd vpermilps vperm2f128 vpextrb vpextrw vpextrd vpextrq vphaddw vphaddd vphaddsw vphminposuw vphsubw vphsubd vphsubsw vpinsrb vpinsrw vpinsrd vpinsrq vpmaddwd vpmaddubsw vpmaxsb vpmaxsw vpmaxsd vpmaxub vpmaxuw vpmaxud vpminsb vpminsw vpminsd vpminub vpminuw vpminud vpmovmskb vpmovsxbw vpmovsxbd vpmovsxbq vpmovsxwd vpmovsxwq vpmovsxdq vpmovzxbw vpmovzxbd vpmovzxbq vpmovzxwd vpmovzxwq vpmovzxdq vpmulhuw vpmulhrsw vpmulhw vpmullw vpmulld vpmuludq vpmuldq vpor vpsadbw vpshufb vpshufd vpshufhw vpshuflw vpsignb vpsignw vpsignd vpslldq vpsrldq vpsllw vpslld vpsllq vpsraw vpsrad vpsrlw vpsrld vpsrlq vptest vpsubb vpsubw vpsubd vpsubq vpsubsb vpsubsw vpsubusb vpsubusw vpunpckhbw vpunpckhwd vpunpckhdq vpunpckhqdq vpunpcklbw vpunpcklwd vpunpckldq vpunpcklqdq vpxor vrcpps vrcpss vrsqrtps vrsqrtss vroundpd vroundps vroundsd vroundss vshufpd vshufps vsqrtpd vsqrtps vsqrtsd vsqrtss vstmxcsr vsubpd vsubps vsubsd vsubss vtestps vtestpd vucomisd vucomiss vunpckhpd vunpckhps vunpcklpd vunpcklps vxorpd vxorps vzeroall vzeroupper pclmullqlqdq pclmulhqlqdq pclmullqhqdq pclmulhqhqdq pclmulqdq vpclmullqlqdq vpclmulhqlqdq vpclmullqhqdq vpclmulhqhqdq vpclmulqdq vfmadd132ps vfmadd132pd vfmadd312ps vfmadd312pd vfmadd213ps vfmadd213pd vfmadd123ps vfmadd123pd vfmadd231ps vfmadd231pd vfmadd321ps vfmadd321pd vfmaddsub132ps vfmaddsub132pd vfmaddsub312ps vfmaddsub312pd vfmaddsub213ps vfmaddsub213pd vfmaddsub123ps vfmaddsub123pd vfmaddsub231ps vfmaddsub231pd vfmaddsub321ps vfmaddsub321pd vfmsub132ps vfmsub132pd vfmsub312ps vfmsub312pd vfmsub213ps vfmsub213pd vfmsub123ps vfmsub123pd vfmsub231ps vfmsub231pd vfmsub321ps vfmsub321pd vfmsubadd132ps vfmsubadd132pd vfmsubadd312ps vfmsubadd312pd vfmsubadd213ps vfmsubadd213pd vfmsubadd123ps vfmsubadd123pd vfmsubadd231ps vfmsubadd231pd vfmsubadd321ps vfmsubadd321pd vfnmadd132ps vfnmadd132pd vfnmadd312ps vfnmadd312pd vfnmadd213ps vfnmadd213pd vfnmadd123ps vfnmadd123pd vfnmadd231ps vfnmadd231pd vfnmadd321ps vfnmadd321pd vfnmsub132ps vfnmsub132pd vfnmsub312ps vfnmsub312pd vfnmsub213ps vfnmsub213pd vfnmsub123ps vfnmsub123pd vfnmsub231ps vfnmsub231pd vfnmsub321ps vfnmsub321pd vfmadd132ss vfmadd132sd vfmadd312ss vfmadd312sd vfmadd213ss vfmadd213sd vfmadd123ss vfmadd123sd vfmadd231ss vfmadd231sd vfmadd321ss vfmadd321sd vfmsub132ss vfmsub132sd vfmsub312ss vfmsub312sd vfmsub213ss vfmsub213sd vfmsub123ss vfmsub123sd vfmsub231ss vfmsub231sd vfmsub321ss vfmsub321sd vfnmadd132ss vfnmadd132sd vfnmadd312ss vfnmadd312sd vfnmadd213ss vfnmadd213sd vfnmadd123ss vfnmadd123sd vfnmadd231ss vfnmadd231sd vfnmadd321ss vfnmadd321sd vfnmsub132ss vfnmsub132sd vfnmsub312ss vfnmsub312sd vfnmsub213ss vfnmsub213sd vfnmsub123ss vfnmsub123sd vfnmsub231ss vfnmsub231sd vfnmsub321ss vfnmsub321sd rdfsbase rdgsbase rdrand wrfsbase wrgsbase vcvtph2ps vcvtps2ph adcx adox rdseed clac stac xstore xcryptecb xcryptcbc xcryptctr xcryptcfb xcryptofb montmul xsha1 xsha256 llwpcb slwpcb lwpval lwpins vfmaddpd vfmaddps vfmaddsd vfmaddss vfmaddsubpd vfmaddsubps vfmsubaddpd vfmsubaddps vfmsubpd vfmsubps vfmsubsd vfmsubss vfnmaddpd vfnmaddps vfnmaddsd vfnmaddss vfnmsubpd vfnmsubps vfnmsubsd vfnmsubss vfrczpd vfrczps vfrczsd vfrczss vpcmov vpcomb vpcomd vpcomq vpcomub vpcomud vpcomuq vpcomuw vpcomw vphaddbd vphaddbq vphaddbw vphadddq vphaddubd vphaddubq vphaddubw vphaddudq vphadduwd vphadduwq vphaddwd vphaddwq vphsubbw vphsubdq vphsubwd vpmacsdd vpmacsdqh vpmacsdql vpmacssdd vpmacssdqh vpmacssdql vpmacsswd vpmacssww vpmacswd vpmacsww vpmadcsswd vpmadcswd vpperm vprotb vprotd vprotq vprotw vpshab vpshad vpshaq vpshaw vpshlb vpshld vpshlq vpshlw vbroadcasti128 vpblendd vpbroadcastb vpbroadcastw vpbroadcastd vpbroadcastq vpermd vpermpd vpermps vpermq vperm2i128 vextracti128 vinserti128 vpmaskmovd vpmaskmovq vpsllvd vpsllvq vpsravd vpsrlvd vpsrlvq vgatherdpd vgatherqpd vgatherdps vgatherqps vpgatherdd vpgatherqd vpgatherdq vpgatherqq xabort xbegin xend xtest andn bextr blci blcic blsi blsic blcfill blsfill blcmsk blsmsk blsr blcs bzhi mulx pdep pext rorx sarx shlx shrx tzcnt tzmsk t1mskc valignd valignq vblendmpd vblendmps vbroadcastf32x4 vbroadcastf64x4 vbroadcasti32x4 vbroadcasti64x4 vcompresspd vcompressps vcvtpd2udq vcvtps2udq vcvtsd2usi vcvtss2usi vcvttpd2udq vcvttps2udq vcvttsd2usi vcvttss2usi vcvtudq2pd vcvtudq2ps vcvtusi2sd vcvtusi2ss vexpandpd vexpandps vextractf32x4 vextractf64x4 vextracti32x4 vextracti64x4 vfixupimmpd vfixupimmps vfixupimmsd vfixupimmss vgetexppd vgetexpps vgetexpsd vgetexpss vgetmantpd vgetmantps vgetmantsd vgetmantss vinsertf32x4 vinsertf64x4 vinserti32x4 vinserti64x4 vmovdqa32 vmovdqa64 vmovdqu32 vmovdqu64 vpabsq vpandd vpandnd vpandnq vpandq vpblendmd vpblendmq vpcmpltd vpcmpled vpcmpneqd vpcmpnltd vpcmpnled vpcmpd vpcmpltq vpcmpleq vpcmpneqq vpcmpnltq vpcmpnleq vpcmpq vpcmpequd vpcmpltud vpcmpleud vpcmpnequd vpcmpnltud vpcmpnleud vpcmpud vpcmpequq vpcmpltuq vpcmpleuq vpcmpnequq vpcmpnltuq vpcmpnleuq vpcmpuq vpcompressd vpcompressq vpermi2d vpermi2pd vpermi2ps vpermi2q vpermt2d vpermt2pd vpermt2ps vpermt2q vpexpandd vpexpandq vpmaxsq vpmaxuq vpminsq vpminuq vpmovdb vpmovdw vpmovqb vpmovqd vpmovqw vpmovsdb vpmovsdw vpmovsqb vpmovsqd vpmovsqw vpmovusdb vpmovusdw vpmovusqb vpmovusqd vpmovusqw vpord vporq vprold vprolq vprolvd vprolvq vprord vprorq vprorvd vprorvq vpscatterdd vpscatterdq vpscatterqd vpscatterqq vpsraq vpsravq vpternlogd vpternlogq vptestmd vptestmq vptestnmd vptestnmq vpxord vpxorq vrcp14pd vrcp14ps vrcp14sd vrcp14ss vrndscalepd vrndscaleps vrndscalesd vrndscaless vrsqrt14pd vrsqrt14ps vrsqrt14sd vrsqrt14ss vscalefpd vscalefps vscalefsd vscalefss vscatterdpd vscatterdps vscatterqpd vscatterqps vshuff32x4 vshuff64x2 vshufi32x4 vshufi64x2 kandnw kandw kmovw knotw kortestw korw kshiftlw kshiftrw kunpckbw kxnorw kxorw vpbroadcastmb2q vpbroadcastmw2d vpconflictd vpconflictq vplzcntd vplzcntq vexp2pd vexp2ps vrcp28pd vrcp28ps vrcp28sd vrcp28ss vrsqrt28pd vrsqrt28ps vrsqrt28sd vrsqrt28ss vgatherpf0dpd vgatherpf0dps vgatherpf0qpd vgatherpf0qps vgatherpf1dpd vgatherpf1dps vgatherpf1qpd vgatherpf1qps vscatterpf0dpd vscatterpf0dps vscatterpf0qpd vscatterpf0qps vscatterpf1dpd vscatterpf1dps vscatterpf1qpd vscatterpf1qps prefetchwt1 bndmk bndcl bndcu bndcn bndmov bndldx bndstx sha1rnds4 sha1nexte sha1msg1 sha1msg2 sha256rnds2 sha256msg1 sha256msg2 hint_nop0 hint_nop1 hint_nop2 hint_nop3 hint_nop4 hint_nop5 hint_nop6 hint_nop7 hint_nop8 hint_nop9 hint_nop10 hint_nop11 hint_nop12 hint_nop13 hint_nop14 hint_nop15 hint_nop16 hint_nop17 hint_nop18 hint_nop19 hint_nop20 hint_nop21 hint_nop22 hint_nop23 hint_nop24 hint_nop25 hint_nop26 hint_nop27 hint_nop28 hint_nop29 hint_nop30 hint_nop31 hint_nop32 hint_nop33 hint_nop34 hint_nop35 hint_nop36 hint_nop37 hint_nop38 hint_nop39 hint_nop40 hint_nop41 hint_nop42 hint_nop43 hint_nop44 hint_nop45 hint_nop46 hint_nop47 hint_nop48 hint_nop49 hint_nop50 hint_nop51 hint_nop52 hint_nop53 hint_nop54 hint_nop55 hint_nop56 hint_nop57 hint_nop58 hint_nop59 hint_nop60 hint_nop61 hint_nop62 hint_nop63",
          built_in:
            "ip eip rip al ah bl bh cl ch dl dh sil dil bpl spl r8b r9b r10b r11b r12b r13b r14b r15b ax bx cx dx si di bp sp r8w r9w r10w r11w r12w r13w r14w r15w eax ebx ecx edx esi edi ebp esp eip r8d r9d r10d r11d r12d r13d r14d r15d rax rbx rcx rdx rsi rdi rbp rsp r8 r9 r10 r11 r12 r13 r14 r15 cs ds es fs gs ss st st0 st1 st2 st3 st4 st5 st6 st7 mm0 mm1 mm2 mm3 mm4 mm5 mm6 mm7 xmm0  xmm1  xmm2  xmm3  xmm4  xmm5  xmm6  xmm7  xmm8  xmm9 xmm10  xmm11 xmm12 xmm13 xmm14 xmm15 xmm16 xmm17 xmm18 xmm19 xmm20 xmm21 xmm22 xmm23 xmm24 xmm25 xmm26 xmm27 xmm28 xmm29 xmm30 xmm31 ymm0  ymm1  ymm2  ymm3  ymm4  ymm5  ymm6  ymm7  ymm8  ymm9 ymm10  ymm11 ymm12 ymm13 ymm14 ymm15 ymm16 ymm17 ymm18 ymm19 ymm20 ymm21 ymm22 ymm23 ymm24 ymm25 ymm26 ymm27 ymm28 ymm29 ymm30 ymm31 zmm0  zmm1  zmm2  zmm3  zmm4  zmm5  zmm6  zmm7  zmm8  zmm9 zmm10  zmm11 zmm12 zmm13 zmm14 zmm15 zmm16 zmm17 zmm18 zmm19 zmm20 zmm21 zmm22 zmm23 zmm24 zmm25 zmm26 zmm27 zmm28 zmm29 zmm30 zmm31 k0 k1 k2 k3 k4 k5 k6 k7 bnd0 bnd1 bnd2 bnd3 cr0 cr1 cr2 cr3 cr4 cr8 dr0 dr1 dr2 dr3 dr8 tr3 tr4 tr5 tr6 tr7 r0 r1 r2 r3 r4 r5 r6 r7 r0b r1b r2b r3b r4b r5b r6b r7b r0w r1w r2w r3w r4w r5w r6w r7w r0d r1d r2d r3d r4d r5d r6d r7d r0h r1h r2h r3h r0l r1l r2l r3l r4l r5l r6l r7l r8l r9l r10l r11l r12l r13l r14l r15l db dw dd dq dt ddq do dy dz resb resw resd resq rest resdq reso resy resz incbin equ times byte word dword qword nosplit rel abs seg wrt strict near far a32 ptr",
          meta: "%define %xdefine %+ %undef %defstr %deftok %assign %strcat %strlen %substr %rotate %elif %else %endif %if %ifmacro %ifctx %ifidn %ifidni %ifid %ifnum %ifstr %iftoken %ifempty %ifenv %error %warning %fatal %rep %endrep %include %push %pop %repl %pathsearch %depend %use %arg %stacksize %local %line %comment %endcomment .nolist __FILE__ __LINE__ __SECT__  __BITS__ __OUTPUT_FORMAT__ __DATE__ __TIME__ __DATE_NUM__ __TIME_NUM__ __UTC_DATE__ __UTC_TIME__ __UTC_DATE_NUM__ __UTC_TIME_NUM__  __PASS__ struc endstruc istruc at iend align alignb sectalign daz nodaz up down zero default option assume public bits use16 use32 use64 default section segment absolute extern global common cpu float __utf16__ __utf16le__ __utf16be__ __utf32__ __utf32le__ __utf32be__ __float8__ __float16__ __float32__ __float64__ __float80m__ __float80e__ __float128l__ __float128h__ __Infinity__ __QNaN__ __SNaN__ Inf NaN QNaN SNaN float8 float16 float32 float64 float80m float80e float128l float128h __FLOAT_DAZ__ __FLOAT_ROUND__ __FLOAT__",
        },
        contains: [
          e.COMMENT(";", "$", { relevance: 0 }),
          {
            className: "number",
            variants: [
              {
                begin:
                  "\\b(?:([0-9][0-9_]*)?\\.[0-9_]*(?:[eE][+-]?[0-9_]+)?|(0[Xx])?[0-9][0-9_]*(\\.[0-9_]*)?(?:[pP](?:[+-]?[0-9_]+)?)?)\\b",
                relevance: 0,
              },
              { begin: "\\$[0-9][0-9A-Fa-f]*", relevance: 0 },
              {
                begin:
                  "\\b(?:[0-9A-Fa-f][0-9A-Fa-f_]*[Hh]|[0-9][0-9_]*[DdTt]?|[0-7][0-7_]*[QqOo]|[0-1][0-1_]*[BbYy])\\b",
              },
              {
                begin:
                  "\\b(?:0[Xx][0-9A-Fa-f_]+|0[DdTt][0-9_]+|0[QqOo][0-7_]+|0[BbYy][0-1_]+)\\b",
              },
            ],
          },
          e.QUOTE_STRING_MODE,
          {
            className: "string",
            variants: [
              { begin: "'", end: "[^\\\\]'" },
              { begin: "`", end: "[^\\\\]`" },
            ],
            relevance: 0,
          },
          {
            className: "symbol",
            variants: [
              {
                begin: "^\\s*[A-Za-z._?][A-Za-z0-9_$#@~.?]*(:|\\s+label)",
              },
              {
                begin: "^\\s*%%[A-Za-z0-9_$#@~.?]*:",
              },
            ],
            relevance: 0,
          },
          { className: "subst", begin: "%[0-9]+", relevance: 0 },
          { className: "subst", begin: "%!S+", relevance: 0 },
          {
            className: "meta",
            begin: /^\s*\.[\w_-]+/,
          },
        ],
      }),
      grmr_xml: (e) => {
        const n = e.regex,
          t = n.concat(
            /[\p{L}_]/u,
            n.optional(/[\p{L}0-9_.-]*:/u),
            /[\p{L}0-9_.-]*/u
          ),
          s = {
            className: "symbol",
            begin: /&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/,
          },
          a = {
            begin: /\s/,
            contains: [
              {
                className: "keyword",
                begin: /#?[a-z_][a-z1-9_-]+/,
                illegal: /\n/,
              },
            ],
          },
          i = e.inherit(a, { begin: /\(/, end: /\)/ }),
          r = e.inherit(e.APOS_STRING_MODE, {
            className: "string",
          }),
          o = e.inherit(e.QUOTE_STRING_MODE, { className: "string" }),
          c = {
            endsWithParent: !0,
            illegal: /</,
            relevance: 0,
            contains: [
              { className: "attr", begin: /[\p{L}0-9._:-]+/u, relevance: 0 },
              {
                begin: /=\s*/,
                relevance: 0,
                contains: [
                  {
                    className: "string",
                    endsParent: !0,
                    variants: [
                      { begin: /"/, end: /"/, contains: [s] },
                      {
                        begin: /'/,
                        end: /'/,
                        contains: [s],
                      },
                      { begin: /[^\s"'=<>`]+/ },
                    ],
                  },
                ],
              },
            ],
          };
        return {
          name: "HTML, XML",
          aliases: [
            "html",
            "xhtml",
            "rss",
            "atom",
            "xjb",
            "xsd",
            "xsl",
            "plist",
            "wsf",
            "svg",
          ],
          case_insensitive: !0,
          unicodeRegex: !0,
          contains: [
            {
              className: "meta",
              begin: /<![a-z]/,
              end: />/,
              relevance: 10,
              contains: [
                a,
                o,
                r,
                i,
                {
                  begin: /\[/,
                  end: /\]/,
                  contains: [
                    {
                      className: "meta",
                      begin: /<![a-z]/,
                      end: />/,
                      contains: [a, i, o, r],
                    },
                  ],
                },
              ],
            },
            e.COMMENT(/<!--/, /-->/, { relevance: 10 }),
            { begin: /<!\[CDATA\[/, end: /\]\]>/, relevance: 10 },
            s,
            {
              className: "meta",
              end: /\?>/,
              variants: [
                { begin: /<\?xml/, relevance: 10, contains: [o] },
                { begin: /<\?[a-z][a-z0-9]+/ },
              ],
            },
            {
              className: "tag",
              begin: /<style(?=\s|>)/,
              end: />/,
              keywords: { name: "style" },
              contains: [c],
              starts: {
                end: /<\/style>/,
                returnEnd: !0,
                subLanguage: ["css", "xml"],
              },
            },
            {
              className: "tag",
              begin: /<script(?=\s|>)/,
              end: />/,
              keywords: { name: "script" },
              contains: [c],
              starts: {
                end: /<\/script>/,
                returnEnd: !0,
                subLanguage: ["javascript", "handlebars", "xml"],
              },
            },
            {
              className: "tag",
              begin: /<>|<\/>/,
            },
            {
              className: "tag",
              begin: n.concat(
                /</,
                n.lookahead(n.concat(t, n.either(/\/>/, />/, /\s/)))
              ),
              end: /\/?>/,
              contains: [
                { className: "name", begin: t, relevance: 0, starts: c },
              ],
            },
            {
              className: "tag",
              begin: n.concat(/<\//, n.lookahead(n.concat(t, />/))),
              contains: [
                {
                  className: "name",
                  begin: t,
                  relevance: 0,
                },
                { begin: />/, relevance: 0, endsParent: !0 },
              ],
            },
          ],
        };
      },
      grmr_yaml: (e) => {
        const n = "true false yes no null",
          t = "[\\w#;/?:@&=+$,.~*'()[\\]]+",
          s = {
            className: "string",
            relevance: 0,
            variants: [
              { begin: /'/, end: /'/ },
              { begin: /"/, end: /"/ },
              { begin: /\S+/ },
            ],
            contains: [
              e.BACKSLASH_ESCAPE,
              {
                className: "template-variable",
                variants: [
                  { begin: /\{\{/, end: /\}\}/ },
                  { begin: /%\{/, end: /\}/ },
                ],
              },
            ],
          },
          a = e.inherit(s, {
            variants: [
              { begin: /'/, end: /'/ },
              { begin: /"/, end: /"/ },
              { begin: /[^\s,{}[\]]+/ },
            ],
          }),
          i = {
            end: ",",
            endsWithParent: !0,
            excludeEnd: !0,
            keywords: n,
            relevance: 0,
          },
          r = {
            begin: /\{/,
            end: /\}/,
            contains: [i],
            illegal: "\\n",
            relevance: 0,
          },
          o = {
            begin: "\\[",
            end: "\\]",
            contains: [i],
            illegal: "\\n",
            relevance: 0,
          },
          c = [
            {
              className: "attr",
              variants: [
                {
                  begin: /\w[\w :()\./-]*:(?=[ \t]|$)/,
                },
                { begin: /"\w[\w :()\./-]*":(?=[ \t]|$)/ },
                {
                  begin: /'\w[\w :()\./-]*':(?=[ \t]|$)/,
                },
              ],
            },
            { className: "meta", begin: "^---\\s*$", relevance: 10 },
            {
              className: "string",
              begin:
                "[\\|>]([1-9]?[+-])?[ ]*\\n( +)[^ ][^\\n]*\\n(\\2[^\\n]+\\n?)*",
            },
            {
              begin: "<%[%=-]?",
              end: "[%-]?%>",
              subLanguage: "ruby",
              excludeBegin: !0,
              excludeEnd: !0,
              relevance: 0,
            },
            { className: "type", begin: "!\\w+!" + t },
            { className: "type", begin: "!<" + t + ">" },
            { className: "type", begin: "!" + t },
            { className: "type", begin: "!!" + t },
            { className: "meta", begin: "&" + e.UNDERSCORE_IDENT_RE + "$" },
            { className: "meta", begin: "\\*" + e.UNDERSCORE_IDENT_RE + "$" },
            { className: "bullet", begin: "-(?=[ ]|$)", relevance: 0 },
            e.HASH_COMMENT_MODE,
            { beginKeywords: n, keywords: { literal: n } },
            {
              className: "number",
              begin:
                "\\b[0-9]{4}(-[0-9][0-9]){0,2}([Tt \\t][0-9][0-9]?(:[0-9][0-9]){2})?(\\.[0-9]*)?([ \\t])*(Z|[-+][0-9][0-9]?(:[0-9][0-9])?)?\\b",
            },
            { className: "number", begin: e.C_NUMBER_RE + "\\b", relevance: 0 },
            r,
            o,
            s,
          ],
          l = [...c];
        return (
          l.pop(),
          l.push(a),
          (i.contains = l),
          { name: "YAML", case_insensitive: !0, aliases: ["yml"], contains: c }
        );
      },
    });
    const je = te;
    for (const e of Object.keys(Pe)) {
      const n = e.replace("grmr_", "").replace("_", "-");
      je.registerLanguage(n, Pe[e]);
    }
    return je;
  })();
  "object" == typeof exports &&
    "undefined" != typeof module &&
    (module.exports = hljs);
  