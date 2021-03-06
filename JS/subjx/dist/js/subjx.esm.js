/*@license
 * Drag/Rotate/Resize Library
 * Released under the MIT license, 2018-2020
 * Karen Sarksyan
 * nichollascarter@gmail.com
 */
const t = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(t) {
    return setTimeout(t, 1e3 / 60)
},
e = window.cancelAnimationFrame || window.mozCancelAnimationFrame || function(t) {
    clearTimeout(t)
},
{
    forEach: s,
    slice: o,
    map: n,
    reduce: r
} = Array.prototype,
{
    warn: a
} = console;

function i(t) {
return null != t
}

function c(t) {
return null == t
}

function l(t) {
return "function" == typeof t
}

function h(t) {
return l(t) ? function() {
    t.call(this, ...arguments)
} : () => {}
}
class u {
constructor(t) {
    if ("string" == typeof t) {
        const e = document.querySelectorAll(t);
        this.length = e.length;
        for (let t = 0; t < this.length; t++) this[t] = e[t]
    } else if ("object" != typeof t || 1 !== t.nodeType && t !== document)
        if (t instanceof u) {
            this.length = t.length;
            for (let e = 0; e < this.length; e++) this[e] = t[e]
        } else {
            if (!i(e = t) || "object" != typeof e || !(Array.isArray(e) || i(window.Symbol) && "function" == typeof e[window.Symbol.iterator] || i(e.forEach) || "number" == typeof e.length && (0 === e.length || e.length > 0 && e.length - 1 in e))) throw new Error("Passed parameter must be selector/element/elementArray");
            this.length = 0;
            for (let e = 0; e < this.length; e++) 1 === t.nodeType && (this[e] = t[e], this.length++)
        } else this[0] = t, this.length = 1;
    var e
}
css(t) {
    const e = {
        setStyle(t) {
            return ((t, e) => {
                let s = t.length;
                for (; s--;)
                    for (const o in e) t[s].style[o] = e[o];
                return t.style
            })(this, t)
        }, getStyle() {
            return (e => {
                let s = e.length;
                for (; s--;) return e[s].currentStyle ? e[s].currentStyle[t] : document.defaultView && document.defaultView.getComputedStyle ? document.defaultView.getComputedStyle(e[s], "")[t] : e[s].style[t]
            })(this)
        }
    };
    return "string" == typeof t ? e.getStyle.apply(this, o.call(arguments, 1)) : "object" != typeof t && t ? (a(`Method ${t} does not exist`), !1) : e.setStyle.apply(this, arguments)
}
on() {
    let t = this.length;
    for (; t--;) this[t].events || (this[t].events = {}, this[t].events[arguments[0]] = []), "string" != typeof arguments[1] ? document.addEventListener ? this[t].addEventListener(arguments[0], arguments[1], arguments[2] || {
        passive: !1
    }) : document.attachEvent ? this[t].attachEvent(`on${arguments[0]}`, arguments[1]) : this[t][`on${arguments[0]}`] = arguments[1] : d(this[t], arguments[0], arguments[1], arguments[2], arguments[3], !0);
    return this
}
off() {
    let t = this.length;
    for (; t--;) this[t].events || (this[t].events = {}, this[t].events[arguments[0]] = []), "string" != typeof arguments[1] ? document.removeEventListener ? this[t].removeEventListener(arguments[0], arguments[1], arguments[2]) : document.detachEvent ? this[t].detachEvent(`on${arguments[0]}`, arguments[1]) : this[t][`on${arguments[0]}`] = null : d(this[t], arguments[0], arguments[1], arguments[2], arguments[3], !1);
    return this
}
is(t) {
    if (c(t)) return !1;
    const e = p(t);
    let s = this.length;
    for (; s--;)
        if (this[s] === e[s]) return !0;
    return !1
}
}

function d(t, e, s, o, n, r) {
const a = function(t) {
    let e = t.target;
    for (; e && e !== this;) e.matches(s) && o.call(e, t), e = e.parentNode
};
!0 === r ? document.addEventListener ? t.addEventListener(e, a, n || {
    passive: !1
}) : document.attachEvent ? t.attachEvent(`on${e}`, a) : t[`on${e}`] = a : document.removeEventListener ? t.removeEventListener(e, a, n || {
    passive: !1
}) : document.detachEvent ? t.detachEvent(`on${e}`, a) : t[`on${e}`] = null
}

function p(t) {
return new u(t)
}
class f {
constructor() {
    this.observers = {}
}
subscribe(t, e) {
    const s = this.observers;
    return c(s[t]) && Object.defineProperty(s, t, {
        value: []
    }), s[t].push(e), this
}
unsubscribe(t, e) {
    const s = this.observers;
    if (i(s[t])) {
        const o = s[t].indexOf(e);
        s[t].splice(o, 1)
    }
    return this
}
notify(t, e, s) {
    c(this.observers[t]) || this.observers[t].forEach(o => {
        if (e !== o) switch (t) {
            case "onmove":
                o.notifyMove(s);
                break;
            case "onrotate":
                o.notifyRotate(s);
                break;
            case "onresize":
                o.notifyResize(s);
                break;
            case "onapply":
                o.notifyApply(s);
                break;
            case "ongetstate":
                o.notifyGetState(s)
        }
    })
}
}
class x {
constructor(t) {
    this.name = t, this.callbacks = []
}
registerCallback(t) {
    this.callbacks.push(t)
}
removeCallback(t) {
    const e = this.callbacks(t);
    this.callbacks.splice(e, 1)
}
}
class y {
constructor() {
    this.events = {}
}
registerEvent(t) {
    this.events[t] = new x(t)
}
emit(t, e, s) {
    this.events[e].callbacks.forEach(e => {
        e.call(t, s)
    })
}
addEventListener(t, e) {
    this.events[t].registerCallback(e)
}
removeEventListener(t, e) {
    this.events[t].removeCallback(e)
}
}
class b {
constructor(t) {
    this.el = t, this.storage = null, this.proxyMethods = null, this.eventDispatcher = new y, this._onMouseDown = this._onMouseDown.bind(this), this._onTouchStart = this._onTouchStart.bind(this), this._onMouseMove = this._onMouseMove.bind(this), this._onTouchMove = this._onTouchMove.bind(this), this._onMouseUp = this._onMouseUp.bind(this), this._onTouchEnd = this._onTouchEnd.bind(this), this._animate = this._animate.bind(this)
}
enable(t) {
    this._processOptions(t), this._init(this.el), this.proxyMethods.onInit.call(this, this.el)
}
disable() {
    m()
}
_init() {
    m()
}
_destroy() {
    m()
}
_processOptions() {
    m()
}
_start() {
    m()
}
_moving() {
    m()
}
_end() {
    m()
}
_animate() {
    m()
}
_drag({
    dx: t,
    dy: e,
    ...s
}) {
    const o = {
        dx: t,
        dy: e,
        transform: this._processMove(t, e),
        ...s
    };
    this.proxyMethods.onMove.call(this, o), this._emitEvent("drag", o)
}
_draw() {
    this._animate()
}
_onMouseDown(t) {
    this._start(t), p(document).on("mousemove", this._onMouseMove).on("mouseup", this._onMouseUp)
}
_onTouchStart(t) {
    this._start(t.touches[0]), p(document).on("touchmove", this._onTouchMove).on("touchend", this._onTouchEnd)
}
_onMouseMove(t) {
    t.preventDefault && t.preventDefault(), this._moving(t, this.el)
}
_onTouchMove(t) {
    t.preventDefault && t.preventDefault(), this._moving(t.touches[0], this.el)
}
_onMouseUp(t) {
    p(document).off("mousemove", this._onMouseMove).off("mouseup", this._onMouseUp), this._end(t, this.el)
}
_onTouchEnd(t) {
    p(document).off("touchmove", this._onTouchMove).off("touchend", this._onTouchEnd), 0 === t.touches.length && this._end(t.changedTouches[0], this.el)
}
_emitEvent() {
    this.eventDispatcher.emit(this, ...arguments)
}
on(t, e) {
    return this.eventDispatcher.addEventListener(t, e), this
}
off(t, e) {
    return this.eventDispatcher.removeEventListener(t, e), this
}
}

function m() {
throw Error("Method not implemented")
}
const g = ["dragStart", "drag", "dragEnd", "resizeStart", "resize", "resizeEnd", "rotateStart", "rotate", "rotateEnd", "setPointStart", "setPointEnd"],
v = Math.PI / 180;

function _(t, e) {
if (0 === e) return t; {
    const s = function(t, e) {
        return 0 === e ? t : Math.round(t / e) * e
    }(t, e);
    if (s - t < e) return s
}
}

function M(t, e = 6) {
return Number(t.toFixed(e))
}

function w(t) {
return t.getBoundingClientRect()
}

function E(t) {
return t.css("-webkit-transform") || t.css("-moz-transform") || t.css("-ms-transform") || t.css("-o-transform") || t.css("transform") || "none"
}

function j(t) {
const e = t.match(/[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/g);
return e ? e.map(t => parseFloat(t)) : [1, 0, 0, 1, 0, 0]
}

function V(t, e) {
if (e) {
    if (t.classList) {
        if (!(e.indexOf(" ") > -1)) return t.classList.add(e);
        e.split(/\s+/).forEach(e => t.classList.add(e))
    }
    return t
}
}

function T(t, e) {
if (e) {
    if (t.classList) {
        if (!(e.indexOf(" ") > -1)) return t.classList.remove(e);
        e.split(/\s+/).forEach(e => t.classList.remove(e))
    }
    return t
}
}

function k(t) {
const e = `matrix(${t.join()})`;
return {
    transform: e,
    webkitTranform: e,
    mozTransform: e,
    msTransform: e,
    otransform: e
}
}
class C extends b {
constructor(t, e, s) {
    if (super(t), this.constructor === C) throw new TypeError("Cannot construct Transformable instances directly");
    this.observable = s, g.forEach(t => {
        this.eventDispatcher.registerEvent(t)
    }), this.enable(e)
}
_cursorPoint() {
    throw Error("'_cursorPoint()' method not implemented")
}
_rotate({
    radians: t,
    ...e
}) {
    const s = {
        transform: this._processRotate(t),
        delta: t,
        ...e
    };
    this.proxyMethods.onRotate.call(this, s), this._emitEvent("rotate", s)
}
_resize({
    dx: t,
    dy: e,
    ...s
}) {
    const o = {...this._processResize(t, e), dx: t, dy: e, ...s
    };
    this.proxyMethods.onResize.call(this, o), this._emitEvent("resize", o)
}
_processOptions(t) {
    const {
        el: e
    } = this;
    V(e, "sjx-drag");
    const s = {
            x: 10,
            y: 10,
            angle: 10 * v
        },
        o = {
            move: !1,
            resize: !1,
            rotate: !1
        };
    let n = null,
        r = !1,
        a = "xy",
        l = "auto",
        u = "auto",
        d = "auto",
        f = "#00a8ff",
        x = !1,
        y = !0,
        b = !0,
        m = !0,
        g = () => {},
        _ = () => {},
        M = () => {},
        w = () => {},
        E = () => {},
        j = () => {},
        T = e.parentNode;
    if (i(t)) {
        const {
            snap: V,
            each: k,
            axis: C,
            cursorMove: S,
            cursorResize: z,
            cursorRotate: A,
            rotationPoint: X,
            restrict: Y,
            draggable: D,
            resizable: N,
            rotatable: R,
            onInit: P,
            onDrop: $,
            onMove: L,
            onResize: B,
            onRotate: O,
            onDestroy: H,
            container: F,
            proportions: W,
            themeColor: q
        } = t;
        if (i(V)) {
            const {
                x: t,
                y: e,
                angle: o
            } = V;
            s.x = c(t) ? 10 : t, s.y = c(e) ? 10 : e, s.angle = c(o) ? s.angle : o * v
        }
        if (i(k)) {
            const {
                move: t,
                resize: e,
                rotate: s
            } = k;
            o.move = t || !1, o.resize = e || !1, o.rotate = s || !1
        }
        i(Y) && (n = "parent" === Y ? e.parentNode : p(Y)[0] || document), f = q || "#00a8ff", l = S || "auto", u = z || "auto", d = A || "auto", a = C || "xy", T = i(F) && p(F)[0] ? p(F)[0] : T, x = X || !1, r = W || !1, y = !i(D) || D, b = !i(N) || N, m = !i(R) || R, g = h(P), E = h($), _ = h(L), w = h(B), M = h(O), j = h(H)
    }
    this.options = {
        axis: a,
        themeColor: f,
        cursorMove: l,
        cursorRotate: d,
        cursorResize: u,
        rotationPoint: x,
        restrict: n,
        container: T,
        snap: s,
        each: o,
        proportions: r,
        draggable: y,
        resizable: b,
        rotatable: m
    }, this.proxyMethods = {
        onInit: g,
        onDrop: E,
        onMove: _,
        onResize: w,
        onRotate: M,
        onDestroy: j
    }, this.subscribe(o)
}
_animate() {
    const e = this,
        {
            observable: s,
            storage: o,
            options: n
        } = e;
    if (c(o)) return;
    if (o.frame = t(e._animate), !o.doDraw) return;
    o.doDraw = !1;
    let {
        dox: r,
        doy: a,
        clientX: l,
        clientY: h,
        doDrag: u,
        doResize: d,
        doRotate: p,
        doSetCenter: f,
        revX: x,
        revY: y
    } = o;
    const {
        snap: b,
        each: {
            move: m,
            resize: g,
            rotate: v
        },
        restrict: M,
        draggable: w,
        resizable: E,
        rotatable: j
    } = n;
    if (d && E) {
        const {
            transform: t,
            cx: n,
            cy: i
        } = o, {
            x: c,
            y: u
        } = this._pointToElement({
            x: l,
            y: h
        });
        let d = r ? _(c - n, b.x / t.scX) : 0,
            p = a ? _(u - i, b.y / t.scY) : 0;
        const f = {
            dx: d = r ? x ? -d : d : 0,
            dy: p = a ? y ? -p : p : 0,
            clientX: l,
            clientY: h
        };
        e._resize(f), g && s.notify("onresize", e, f)
    }
    if (u && w) {
        const {
            restrictOffset: t,
            elementOffset: n,
            nx: c,
            ny: u
        } = o;
        i(M) && (l - t.left < c - n.left && (l = c - n.left + t.left), h - t.top < u - n.top && (h = u - n.top + t.top));
        const d = {
            dx: r ? _(l - c, b.x) : 0,
            dy: a ? _(h - u, b.y) : 0,
            clientX: l,
            clientY: h
        };
        e._drag(d), m && s.notify("onmove", e, d)
    }
    if (p && j) {
        const {
            pressang: t,
            center: n
        } = o, r = Math.atan2(h - n.y, l - n.x) - t, a = {
            clientX: l,
            clientY: h
        };
        e._rotate({
            radians: _(r, b.angle),
            ...a
        }), v && s.notify("onrotate", e, {
            radians: r,
            ...a
        })
    }
    if (f && j) {
        const {
            bx: t,
            by: s
        } = o, {
            x: n,
            y: r
        } = this._pointToControls({
            x: l,
            y: h
        });
        e._moveCenterHandle(n - t, r - s)
    }
}
_start(t) {
    const {
        observable: e,
        storage: s,
        options: {
            axis: o,
            restrict: n,
            each: r
        },
        el: a
    } = this, c = this._compute(t);
    Object.keys(c).forEach(t => {
        s[t] = c[t]
    });
    const {
        onRightEdge: l,
        onBottomEdge: h,
        onTopEdge: u,
        onLeftEdge: d,
        handle: p,
        factor: f,
        revX: x,
        revY: y,
        doW: b,
        doH: m
    } = c, g = l || h || u || d, {
        handles: v
    } = s, {
        rotator: _,
        center: M,
        radius: E
    } = v;
    i(E) && T(E, "sjx-hidden");
    const j = p.is(_),
        V = !!i(M) && p.is(M),
        k = !(j || g || V),
        {
            clientX: C,
            clientY: S
        } = t,
        {
            x: z,
            y: A
        } = this._cursorPoint({
            clientX: C,
            clientY: S
        }),
        {
            x: X,
            y: Y
        } = this._pointToElement({
            x: z,
            y: A
        }),
        {
            x: D,
            y: N
        } = this._pointToControls({
            x: z,
            y: A
        }),
        R = {
            clientX: C,
            clientY: S,
            nx: z,
            ny: A,
            cx: X,
            cy: Y,
            bx: D,
            by: N,
            doResize: g,
            doDrag: k,
            doRotate: j,
            doSetCenter: V,
            onExecution: !0,
            cursor: null,
            elementOffset: w(a),
            restrictOffset: i(n) ? w(n) : null,
            dox: /\x/.test(o) && (!g || (p.is(v.ml) || p.is(v.mr) || p.is(v.tl) || p.is(v.tr) || p.is(v.bl) || p.is(v.br))),
            doy: /\y/.test(o) && (!g || (p.is(v.br) || p.is(v.bl) || p.is(v.bc) || p.is(v.tr) || p.is(v.tl) || p.is(v.tc)))
        };
    this.storage = {...s, ...R
    };
    const P = {
        clientX: C,
        clientY: S
    };
    g ? this._emitEvent("resizeStart", P) : j ? this._emitEvent("rotateStart", P) : k && this._emitEvent("dragStart", P);
    const {
        move: $,
        resize: L,
        rotate: B
    } = r, O = g ? "resize" : j ? "rotate" : "drag", H = g && L || j && B || k && $;
    e.notify("ongetstate", this, {
        clientX: C,
        clientY: S,
        actionName: O,
        triggerEvent: H,
        factor: f,
        revX: x,
        revY: y,
        doW: b,
        doH: m
    }), this._draw()
}
_moving(t) {
    const {
        storage: e,
        options: s
    } = this, {
        x: o,
        y: n
    } = this._cursorPoint(t);
    e.e = t, e.clientX = o, e.clientY = n, e.doDraw = !0;
    let {
        doRotate: r,
        doDrag: a,
        doResize: i,
        cursor: l
    } = e;
    const {
        cursorMove: h,
        cursorResize: u,
        cursorRotate: d
    } = s;
    c(l) && (a ? l = h : r ? l = d : i && (l = u), p(document.body).css({
        cursor: l
    }))
}
_end({
    clientX: t,
    clientY: s
}) {
    const {
        options: {
            each: o
        },
        observable: n,
        storage: r,
        proxyMethods: a
    } = this, {
        doResize: c,
        doDrag: l,
        doRotate: h,
        frame: u,
        handles: {
            radius: d
        }
    } = r, f = c ? "resize" : l ? "drag" : "rotate";
    r.doResize = !1, r.doDrag = !1, r.doRotate = !1, r.doSetCenter = !1, r.doDraw = !1, r.onExecution = !1, r.cursor = null, this._apply(f);
    const x = {
        clientX: t,
        clientY: s
    };
    a.onDrop.call(this, x), c ? this._emitEvent("resizeEnd", x) : h ? this._emitEvent("rotateEnd", x) : l && this._emitEvent("dragEnd", x);
    const {
        move: y,
        resize: b,
        rotate: m
    } = o, g = c && b || h && m || l && y;
    n.notify("onapply", this, {
        clientX: t,
        clientY: s,
        actionName: f,
        triggerEvent: g
    }), e(u), p(document.body).css({
        cursor: "auto"
    }), i(d) && V(d, "sjx-hidden")
}
_compute(t) {
    const {
        handles: e
    } = this.storage, s = p(t.target), {
        revX: o,
        revY: n,
        doW: r,
        doH: a,
        ...i
    } = this._checkHandles(s, e), c = this._getState({
        revX: o,
        revY: n,
        doW: r,
        doH: a
    }), {
        x: l,
        y: h
    } = this._cursorPoint(t), u = Math.atan2(h - c.center.y, l - c.center.x);
    return {...c, ...i, handle: s, pressang: u
    }
}
_checkHandles(t, e) {
    const {
        tl: s,
        tc: o,
        tr: n,
        bl: r,
        br: a,
        bc: c,
        ml: l,
        mr: h
    } = e, u = !!i(s) && t.is(s), d = !!i(o) && t.is(o), p = !!i(n) && t.is(n), f = !!i(r) && t.is(r), x = !!i(c) && t.is(c), y = !!i(a) && t.is(a), b = !!i(l) && t.is(l), m = !!i(h) && t.is(h);
    return {
        revX: u || b || f || d,
        revY: u || p || d || b,
        onTopEdge: d || p || u,
        onLeftEdge: u || b || f,
        onRightEdge: p || m || y,
        onBottomEdge: y || x || f,
        doW: b || m,
        doH: d || x
    }
}
notifyMove() {
    this._drag(...arguments)
}
notifyRotate({
    radians: t,
    ...e
}) {
    const {
        snap: {
            angle: s
        }
    } = this.options;
    this._rotate({
        radians: _(t, s),
        ...e
    })
}
notifyResize() {
    this._resize(...arguments)
}
notifyApply({
    clientX: t,
    clientY: e,
    actionName: s,
    triggerEvent: o
}) {
    this.proxyMethods.onDrop.call(this, {
        clientX: t,
        clientY: e
    }), o && (this._apply(s), this._emitEvent(`${s}End`, {
        clientX: t,
        clientY: e
    }))
}
notifyGetState({
    clientX: t,
    clientY: e,
    actionName: s,
    triggerEvent: o,
    ...n
}) {
    if (o) {
        const o = this._getState(n);
        this.storage = {...this.storage, ...o
        }, this._emitEvent(`${s}Start`, {
            clientX: t,
            clientY: e
        })
    }
}
subscribe({
    resize: t,
    move: e,
    rotate: s
}) {
    const {
        observable: o
    } = this;
    (e || t || s) && o.subscribe("ongetstate", this).subscribe("onapply", this), e && o.subscribe("onmove", this), t && o.subscribe("onresize", this), s && o.subscribe("onrotate", this)
}
unsubscribe() {
    const {
        observable: t
    } = this;
    t.unsubscribe("ongetstate", this).unsubscribe("onapply", this).unsubscribe("onmove", this).unsubscribe("onresize", this).unsubscribe("onrotate", this)
}
disable() {
    const {
        storage: t,
        proxyMethods: e,
        el: s
    } = this;
    c(t) || (t.onExecution && (this._end(), p(document).off("mousemove", this._onMouseMove).off("mouseup", this._onMouseUp).off("touchmove", this._onTouchMove).off("touchend", this._onTouchEnd)), T(s, "sjx-drag"), this._destroy(), this.unsubscribe(), e.onDestroy.call(this, s), delete this.storage)
}
exeDrag({
    dx: t,
    dy: e
}) {
    const {
        draggable: s
    } = this.options;
    s && (this.storage = {...this.storage, ...this._getState({
            revX: !1,
            revY: !1,
            doW: !1,
            doH: !1
        })
    }, this._drag({
        dx: t,
        dy: e
    }), this._apply("drag"))
}
exeResize({
    dx: t,
    dy: e,
    revX: s,
    revY: o,
    doW: n,
    doH: r
}) {
    const {
        resizable: a
    } = this.options;
    a && (this.storage = {...this.storage, ...this._getState({
            revX: s || !1,
            revY: o || !1,
            doW: n || !1,
            doH: r || !1
        })
    }, this._resize({
        dx: t,
        dy: e
    }), this._apply("resize"))
}
exeRotate({
    delta: t
}) {
    const {
        rotatable: e
    } = this.options;
    e && (this.storage = {...this.storage, ...this._getState({
            revX: !1,
            revY: !1,
            doW: !1,
            doH: !1
        })
    }, this._rotate({
        radians: t
    }), this._apply("rotate"))
}
}

function S({
x: t,
y: e
}, s) {
const [o, n, r, a, i, c] = s;
return {
    x: o * t + r * e + i,
    y: n * t + a * e + c
}
}

function z(t) {
const e = [
    [t[0], t[2], t[4]],
    [t[1], t[3], t[5]],
    [0, 0, 1]
];
if (e.length !== e[0].length) return;
const s = e.length,
    o = [],
    n = [];
for (let t = 0; t < s; t += 1) {
    o[o.length] = [], n[n.length] = [];
    for (let r = 0; r < s; r += 1) o[t][r] = t == r ? 1 : 0, n[t][r] = e[t][r]
}
for (let t = 0; t < s; t += 1) {
    let e = n[t][t];
    if (0 === e) {
        for (let r = t + 1; r < s; r += 1)
            if (0 !== n[r][t]) {
                for (let a = 0; a < s; a++) e = n[t][a], n[t][a] = n[r][a], n[r][a] = e, e = o[t][a], o[t][a] = o[r][a], o[r][a] = e;
                break
            }
        if (0 === (e = n[t][t])) return
    }
    for (let r = 0; r < s; r++) n[t][r] = n[t][r] / e, o[t][r] = o[t][r] / e;
    for (let r = 0; r < s; r++)
        if (r != t) {
            e = n[r][t];
            for (let a = 0; a < s; a++) n[r][a] -= e * n[t][a], o[r][a] -= e * o[t][a]
        }
}
return [o[0][0], o[1][0], o[0][1], o[1][1], o[0][2], o[1][2]]
}

function A([t, e, s, o, n, r], [a, i, c, l, h, u]) {
const d = [
        [t, s, n],
        [e, o, r],
        [0, 0, 1]
    ],
    p = [
        [a, c, h],
        [i, l, u],
        [0, 0, 1]
    ],
    f = [];
for (let t = 0; t < p.length; t++) {
    f[t] = [];
    for (let e = 0; e < d[0].length; e++) {
        let s = 0;
        for (let o = 0; o < d.length; o++) s += d[o][e] * p[t][o];
        f[t].push(s)
    }
}
return [f[0][0], f[1][0], f[0][1], f[1][1], f[0][2], f[1][2]]
}

function X(t, e, s, o, n, r, a, i, c) {
const l = parseFloat(s) / 2,
    h = parseFloat(o) / 2,
    u = t + l,
    d = e + h,
    p = t - u,
    f = e - d,
    x = Math.atan2(i ? 0 : f, c ? 0 : p) + n,
    y = Math.sqrt(Math.pow(c ? 0 : l, 2) + Math.pow(i ? 0 : h, 2));
let b = Math.cos(x),
    m = Math.sin(x);
const g = d + y * (m = !0 === a ? -m : m);
return {
    left: M(u + y * (b = !0 === r ? -b : b)),
    top: M(g)
}
}
const Y = 2,
D = 7;
class N extends C {
_init(t) {
    const {
        rotationPoint: e,
        container: s,
        resizable: o,
        rotatable: n
    } = this.options, {
        left: r,
        top: a,
        width: l,
        height: h
    } = t.style, u = document.createElement("div");
    V(u, "sjx-wrapper"), s.appendChild(u);
    const d = p(t),
        f = l || d.css("width"),
        x = h || d.css("height"),
        y = {
            top: a || d.css("top"),
            left: r || d.css("left"),
            width: f,
            height: x,
            transform: E(d)
        },
        b = document.createElement("div");
    V(b, "sjx-controls");
    const m = {...n && {
            normal: ["sjx-normal"],
            rotator: ["sjx-hdl", "sjx-hdl-m", "sjx-rotator"]
        }, ...o && {
            tl: ["sjx-hdl", "sjx-hdl-t", "sjx-hdl-l", "sjx-hdl-tl"],
            tr: ["sjx-hdl", "sjx-hdl-t", "sjx-hdl-r", "sjx-hdl-tr"],
            br: ["sjx-hdl", "sjx-hdl-b", "sjx-hdl-r", "sjx-hdl-br"],
            bl: ["sjx-hdl", "sjx-hdl-b", "sjx-hdl-l", "sjx-hdl-bl"],
            tc: ["sjx-hdl", "sjx-hdl-t", "sjx-hdl-c", "sjx-hdl-tc"],
            bc: ["sjx-hdl", "sjx-hdl-b", "sjx-hdl-c", "sjx-hdl-bc"],
            ml: ["sjx-hdl", "sjx-hdl-m", "sjx-hdl-l", "sjx-hdl-ml"],
            mr: ["sjx-hdl", "sjx-hdl-m", "sjx-hdl-r", "sjx-hdl-mr"]
        }, center: e && n ? ["sjx-hdl", "sjx-hdl-m", "sjx-hdl-c", "sjx-hdl-mc"] : void 0
    };
    if (Object.keys(m).forEach(t => {
            const e = m[t];
            if (c(e)) return;
            const s = function(t) {
                const e = document.createElement("div");
                return t.forEach(t => {
                    V(e, t)
                }), e
            }(e);
            m[t] = s, b.appendChild(s)
        }), i(m.center)) {
        p(m.center).css({
            left: `${t.getAttribute("data-cx")}px`,
            top: `${t.getAttribute("data-cy")}px`
        })
    }
    u.appendChild(b);
    const g = p(b);
    g.css(y), this.storage = {
        controls: b,
        handles: m,
        radius: void 0,
        parent: t.parentNode
    }, g.on("mousedown", this._onMouseDown).on("touchstart", this._onTouchStart)
}
_destroy() {
    const {
        controls: t
    } = this.storage;
    p(t).off("mousedown", this._onMouseDown).off("touchstart", this._onTouchStart);
    const e = t.parentNode;
    e.parentNode.removeChild(e)
}
_pointToElement({
    x: t,
    y: e
}) {
    const {
        transform: s
    } = this.storage, o = [...s.matrix];
    return o[4] = o[5] = 0, this._applyMatrixToPoint(z(o), t, e)
}
_pointToControls(t) {
    return this._pointToElement(t)
}
_applyMatrixToPoint(t, e, s) {
    return S({
        x: e,
        y: s
    }, t)
}
_cursorPoint({
    clientX: t,
    clientY: e
}) {
    const {
        container: s
    } = this.options;
    return S({
        x: t,
        y: e
    }, z(j(E(p(s)))))
}
_apply() {
    const {
        el: t,
        storage: e
    } = this, {
        controls: s,
        handles: o
    } = e, n = p(s), r = parseFloat(n.css("width")) / 2, a = parseFloat(n.css("height")) / 2, {
        center: c
    } = o, l = i(c), h = l ? parseFloat(p(c).css("left")) : r, u = l ? parseFloat(p(c).css("top")) : a;
    t.setAttribute("data-cx", h), t.setAttribute("data-cy", u), this.storage.cached = null
}
_processResize(t, e) {
    const {
        el: s,
        storage: o,
        options: {
            proportions: n
        }
    } = this, {
        controls: r,
        coords: a,
        cw: i,
        ch: c,
        transform: l,
        refang: h,
        revX: u,
        revY: d,
        doW: f,
        doH: x
    } = o, y = f || !f && !x ? (i + t) / i : (c + e) / c, b = n ? i * y : i + t, m = n ? c * y : c + e;
    if (b < Y || m < Y) return;
    const g = [...l.matrix],
        v = X(g[4], g[5], b, m, h, u, d, f, x),
        _ = a.left - v.left,
        M = a.top - v.top;
    g[4] += _, g[5] += M;
    const w = k(g);
    return w.width = `${b}px`, w.height = `${m}px`, p(r).css(w), p(s).css(w), o.cached = {
        dx: _,
        dy: M
    }, {
        width: b,
        height: m,
        ox: _,
        oy: M
    }
}
_processMove(t, e) {
    const {
        el: s,
        storage: o
    } = this, {
        controls: n,
        transform: {
            matrix: r,
            parentMatrix: a
        }
    } = o, i = [...a];
    i[4] = i[5] = 0;
    const c = [...r];
    c[4] = r[4] + t, c[5] = r[5] + e;
    const l = k(c);
    return p(n).css(l), p(s).css(l), o.cached = {
        dx: t,
        dy: e
    }, c
}
_processRotate(t) {
    const {
        el: e,
        storage: {
            controls: s,
            transform: o,
            center: n
        }
    } = this, {
        matrix: r,
        parentMatrix: a
    } = o, i = M(Math.cos(t), 4), c = M(Math.sin(t), 4), l = [1, 0, 0, 1, n.cx, n.cy], h = [i, c, -c, i, 0, 0], u = [...a];
    u[4] = u[5] = 0;
    const d = A(z(u), A(h, u)),
        f = A(A(l, d), z(l)),
        x = A(f, r),
        y = k(x);
    return p(s).css(y), p(e).css(y), x
}
_getState(t) {
    const {
        revX: e,
        revY: s,
        doW: o,
        doH: n
    } = t, r = e !== s ? -1 : 1, {
        el: a,
        storage: {
            handles: c,
            controls: l,
            parent: h
        },
        options: {
            container: u
        }
    } = this, {
        center: d
    } = c, f = p(l), x = j(E(p(u))), y = j(E(p(l))), b = j(E(p(h))), m = Math.atan2(y[1], y[0]) * r, g = h !== u ? A(b, x) : x, v = {
        matrix: y,
        parentMatrix: g,
        scX: Math.sqrt(y[0] * y[0] + y[1] * y[1]),
        scY: Math.sqrt(y[2] * y[2] + y[3] * y[3])
    }, _ = parseFloat(f.css("width")), M = parseFloat(f.css("height")), V = X(y[4], y[5], _, M, m, e, s, o, n), T = _ / 2, k = M / 2, C = w(a), Y = i(d), N = Y ? parseFloat(p(d).css("left")) : T, R = Y ? parseFloat(p(d).css("top")) : k, P = Y ? D : 0, {
        x: $,
        y: L
    } = S({
        x: C.left,
        y: C.top
    }, z(g));
    return {
        transform: v,
        cw: _,
        ch: M,
        coords: V,
        center: {
            x: $ + N - P,
            y: L + R - P,
            cx: -N + T - P,
            cy: -R + k - P,
            hx: N,
            hy: R
        },
        factor: r,
        refang: m,
        revX: e,
        revY: s,
        doW: o,
        doH: n
    }
}
_moveCenterHandle(t, e) {
    const {
        handles: {
            center: s
        },
        center: {
            hx: o,
            hy: n
        }
    } = this.storage, r = `${o+t}px`, a = `${n+e}px`;
    p(s).css({
        left: r,
        top: a
    })
}
resetCenterPoint() {
    const {
        handles: {
            center: t
        }
    } = this.storage;
    p(t).css({
        left: null,
        top: null
    })
}
fitControlsToSize() {}
get controls() {
    return this.storage.controls
}
}
const R = B("svg").createSVGPoint(),
P = /[+-]?\d+(\.\d+)?/g,
$ = ["circle", "ellipse", "image", "line", "path", "polygon", "polyline", "rect", "text", "g"];

function L(t) {
const e = [];
return G(t) ? s.call(t.childNodes, t => {
    if (1 === t.nodeType) {
        const s = t.tagName.toLowerCase(); - 1 !== $.indexOf(s) && ("g" === s && e.push(...L(t)), e.push(t))
    }
}) : e.push(t), e
}

function B(t) {
return document.createElementNS("http://www.w3.org/2000/svg", t)
}

function O() {
return B("svg").createSVGMatrix()
}

function H(t, e) {
return (e.getScreenCTM() || O()).inverse().multiply(t.getScreenCTM() || O())
}

function F(t) {
const {
    a: e,
    b: s,
    c: o,
    d: n,
    e: r,
    f: a
} = t;
return `matrix(${e},${s},${o},${n},${r},${a})`
}

function W(t, e, s) {
return R.x = e, R.y = s, R.matrixTransform(t)
}

function q(t) {
const e = O();
return e.a = t.a, e.b = t.b, e.c = t.c, e.d = t.d, e.e = t.e, e.f = t.f, e
}

function I(t, e, s) {
if (c(e) || c(s)) return null;
const o = t.createSVGPoint();
return o.x = e, o.y = s, o
}

function G(t) {
return "g" === t.tagName.toLowerCase()
}

function U(t) {
return t.match(P).reduce((t, e, s, o) => (s % 2 == 0 && t.push(o.slice(s, s + 2)), t), [])
}
const Q = /\s*([achlmqstvz])([^achlmqstvz]*)\s*/gi,
Z = /\s*,\s*|\s+/g;

function J(t) {
let e = Q.lastIndex = 0;
const s = [];
for (; e = Q.exec(t);) {
    const t = e[1],
        o = t.toUpperCase(),
        n = e[2].replace(/([^e])-/g, "$1 -").replace(/ +/g, " ");
    s.push({
        relative: t !== o,
        key: o,
        cmd: t,
        values: n.trim().split(Z).map(t => {
            if (!isNaN(t)) return Number(t)
        })
    })
}
return s
}

function K(t) {
const {
    path: e,
    dx: s,
    dy: o
} = t;
try {
    const t = J(e);
    let n = "",
        r = " ",
        a = !0;
    for (let e = 0, i = t.length; e < i; e++) {
        const i = t[e],
            {
                values: c,
                key: l,
                relative: h
            } = i,
            u = [];
        switch (l) {
            case "M":
                for (let t = 0, e = c.length; t < e; t += 2) {
                    let [e, n] = c.slice(t, t + 2);
                    h && !a || (e += s, n += o), u.push(e, n), a = !1
                }
                break;
            case "A":
                for (let t = 0, e = c.length; t < e; t += 7) {
                    const e = c.slice(t, t + 7);
                    h || (e[5] += s, e[6] += o), u.push(...e)
                }
                break;
            case "C":
                for (let t = 0, e = c.length; t < e; t += 6) {
                    const e = c.slice(t, t + 6);
                    h || (e[0] += s, e[1] += o, e[2] += s, e[3] += o, e[4] += s, e[5] += o), u.push(...e)
                }
                break;
            case "H":
                for (let t = 0, e = c.length; t < e; t += 1) {
                    const e = c.slice(t, t + 1);
                    h || (e[0] += s), u.push(e[0])
                }
                break;
            case "V":
                for (let t = 0, e = c.length; t < e; t += 1) {
                    const e = c.slice(t, t + 1);
                    h || (e[0] += o), u.push(e[0])
                }
                break;
            case "L":
            case "T":
                for (let t = 0, e = c.length; t < e; t += 2) {
                    let [e, n] = c.slice(t, t + 2);
                    h || (e += s, n += o), u.push(e, n)
                }
                break;
            case "Q":
            case "S":
                for (let t = 0, e = c.length; t < e; t += 4) {
                    let [e, n, r, a] = c.slice(t, t + 4);
                    h || (e += s, n += o, r += s, a += o), u.push(e, n, r, a)
                }
                break;
            case "Z":
                c[0] = "", r = ""
        }
        n += i.cmd + u.join(",") + r
    }
    return n
} catch (t) {
    a("Path parsing error: " + t)
}
}

function tt(t) {
const {
    path: e,
    localCTM: s
} = t;
try {
    const t = J(e);
    let o = "",
        n = " ";
    const r = [];
    let a = !0;
    for (let e = 0, i = t.length; e < i; e++) {
        const i = t[e],
            {
                values: c,
                key: l,
                relative: h
            } = i;
        switch (l) {
            case "A":
                {
                    const t = [];
                    for (let e = 0, o = c.length; e < o; e += 7) {
                        const [o, n, r, a, i, l, u] = c.slice(e, e + 7), d = q(s);
                        h && (d.e = d.f = 0);
                        const {
                            x: p,
                            y: f
                        } = W(d, l, u);
                        t.push(M(p), M(f)), d.e = d.f = 0;
                        const {
                            x: x,
                            y: y
                        } = W(d, o, n);
                        t.unshift(M(x), M(y), r, a, i)
                    }
                    r.push(t);
                    break
                }
            case "C":
                {
                    const t = [];
                    for (let e = 0, o = c.length; e < o; e += 6) {
                        const [o, n, r, a, i, l] = c.slice(e, e + 6), u = q(s);
                        h && (u.e = u.f = 0);
                        const {
                            x: d,
                            y: p
                        } = W(u, o, n), {
                            x: f,
                            y: x
                        } = W(u, r, a), {
                            x: y,
                            y: b
                        } = W(u, i, l);
                        t.push(M(d), M(p), M(f), M(x), M(y), M(b))
                    }
                    r.push(t);
                    break
                }
            case "H":
                {
                    const t = [];
                    for (let e = 0, o = c.length; e < o; e += 1) {
                        const [o] = c.slice(e, e + 1), n = q(s);
                        h && (n.e = n.f = 0);
                        const {
                            x: r
                        } = W(n, o, 0);
                        t.push(M(r))
                    }
                    r.push(t);
                    break
                }
            case "V":
                {
                    const t = [];
                    for (let e = 0, o = c.length; e < o; e += 1) {
                        const [o] = c.slice(e, e + 1), n = q(s);
                        h && (n.e = n.f = 0);
                        const {
                            y: r
                        } = W(n, 0, o);
                        t.push(M(r))
                    }
                    r.push(t);
                    break
                }
            case "T":
            case "L":
                {
                    const t = [];
                    for (let e = 0, o = c.length; e < o; e += 2) {
                        const [o, n] = c.slice(e, e + 2), r = q(s);
                        h && (r.e = r.f = 0);
                        const {
                            x: a,
                            y: i
                        } = W(r, o, n);
                        t.push(M(a), M(i))
                    }
                    r.push(t);
                    break
                }
            case "M":
                {
                    const t = [];
                    for (let e = 0, o = c.length; e < o; e += 2) {
                        const [o, n] = c.slice(e, e + 2), r = q(s);
                        h && !a && (r.e = r.f = 0);
                        const {
                            x: i,
                            y: l
                        } = W(r, o, n);
                        t.push(M(i), M(l)), a = !1
                    }
                    r.push(t);
                    break
                }
            case "Q":
                {
                    const t = [];
                    for (let e = 0, o = c.length; e < o; e += 4) {
                        const [o, n, r, a] = c.slice(e, e + 4), i = q(s);
                        h && (i.e = i.f = 0);
                        const {
                            x: l,
                            y: u
                        } = W(i, o, n), {
                            x: d,
                            y: p
                        } = W(i, r, a);
                        t.push(M(l), M(u), M(d), M(p))
                    }
                    r.push(t);
                    break
                }
            case "S":
                {
                    const t = [];
                    for (let e = 0, o = c.length; e < o; e += 4) {
                        const [o, n, r, a] = c.slice(e, e + 4), i = q(s);
                        h && (i.e = i.f = 0);
                        const {
                            x: l,
                            y: u
                        } = W(i, o, n), {
                            x: d,
                            y: p
                        } = W(i, r, a);
                        t.push(M(l), M(u), M(d), M(p))
                    }
                    r.push(t);
                    break
                }
            case "Z":
                r.push([""]), n = ""
        }
        o += i.cmd + r[e].join(",") + n
    }
    return o
} catch (t) {
    a("Path parsing error: " + t)
}
}
const et = 5,
st = 50;
class ot extends C {
_init(t) {
    const {
        rotationPoint: e,
        container: s,
        themeColor: o,
        resizable: n,
        rotatable: r
    } = this.options, a = B("g");
    V(a, "sjx-svg-wrapper"), s.appendChild(a);
    const {
        width: i,
        height: l,
        x: h,
        y: u
    } = t.getBBox(), d = H(t, s), f = B("rect");
    [
        ["width", i],
        ["height", l],
        ["x", h],
        ["y", u],
        ["fill", o],
        ["fill-opacity", .1],
        ["stroke", o],
        ["stroke-dasharray", "3 3"],
        ["vector-effect", "non-scaling-stroke"],
        ["transform", F(d)]
    ].forEach(([t, e]) => {
        f.setAttribute(t, e)
    });
    const x = B("g"),
        y = B("g"),
        b = B("g");
    V(b, "sjx-svg-box-group"), V(x, "sjx-svg-handles"), V(y, "sjx-svg-normal-group"), b.appendChild(f), a.appendChild(b), a.appendChild(y), a.appendChild(x);
    const {
        x: m,
        y: g,
        width: v,
        height: _
    } = f.getBBox(), M = t.getAttribute("data-cx"), w = t.getAttribute("data-cy"), E = H(f, f.parentNode), j = W(E, m + v / 2, g + _ / 2), T = W(E, m, g), k = W(E, m + v, g), C = W(E, m + v, g + _ / 2), S = {
        tl: T,
        tr: k,
        br: W(E, m + v, g + _),
        bl: W(E, m, g + _),
        tc: W(E, m + v / 2, g),
        bc: W(E, m + v / 2, g + _),
        ml: W(E, m, g + _ / 2),
        mr: C
    };
    let z = {},
        A = null;
    if (r) {
        const t = Math.atan2(T.y - k.y, T.x - k.x);
        A = {
            x: C.x - st * Math.cos(t),
            y: C.y - st * Math.sin(t)
        };
        const s = B("line");
        s.x1.baseVal.value = C.x, s.y1.baseVal.value = C.y, s.x2.baseVal.value = A.x, s.y2.baseVal.value = A.y, it(s, o), y.appendChild(s);
        let n = null;
        e && (V(n = B("line"), "sjx-hidden"), n.x1.baseVal.value = j.x, n.y1.baseVal.value = j.y, n.x2.baseVal.value = M || j.x, n.y2.baseVal.value = w || j.y, it(n, "#fe3232"), n.setAttribute("opacity", .5), y.appendChild(n)), z = {
            normal: s,
            radius: n
        }
    }
    const X = {...n && S, rotator: A, center: e && r ? I(s, M, w) || j : void 0
    };
    Object.keys(X).forEach(t => {
        const e = X[t];
        if (c(e)) return;
        const {
            x: s,
            y: n
        } = e, r = "center" === t ? "#fe3232" : o;
        X[t] = function(t, e, s, o) {
            const n = B("circle");
            V(n, `sjx-svg-hdl-${o}`);
            const r = {
                cx: t,
                cy: e,
                r: 5.5,
                fill: s,
                stroke: "#fff",
                "fill-opacity": 1,
                "vector-effect": "non-scaling-stroke",
                "stroke-width": 1
            };
            return Object.keys(r).map(t => {
                n.setAttribute(t, r[t])
            }), n
        }(s, n, r, t), x.appendChild(X[t])
    }), this.storage = {
        wrapper: a,
        box: f,
        handles: {...X, ...z
        },
        parent: t.parentNode,
        center: {}
    }, p(a).on("mousedown", this._onMouseDown).on("touchstart", this._onTouchStart)
}
_destroy() {
    const {
        wrapper: t
    } = this.storage;
    p(t).off("mousedown", this._onMouseDown).off("touchstart", this._onTouchStart), t.parentNode.removeChild(t)
}
_cursorPoint({
    clientX: t,
    clientY: e
}) {
    const {
        container: s
    } = this.options;
    return W(s.getScreenCTM().inverse(), t, e)
}
_pointToElement({
    x: t,
    y: e
}) {
    const {
        transform: s
    } = this.storage, {
        ctm: o
    } = s, n = o.inverse();
    return n.e = n.f = 0, this._applyMatrixToPoint(n, t, e)
}
_pointToControls({
    x: t,
    y: e
}) {
    const {
        transform: s
    } = this.storage, {
        boxCTM: o
    } = s, n = o.inverse();
    return n.e = n.f = 0, this._applyMatrixToPoint(n, t, e)
}
_applyMatrixToPoint(t, e, s) {
    const {
        container: o
    } = this.options, n = o.createSVGPoint();
    return n.x = e, n.y = s, n.matrixTransform(t)
}
_apply(t) {
    const {
        el: e,
        storage: s,
        options: {
            container: o
        }
    } = this, {
        box: n,
        handles: r,
        cached: a,
        transform: l
    } = s, {
        matrix: h,
        boxCTM: u,
        bBox: d,
        ctm: p
    } = l, f = e.getBBox(), {
        x: x,
        y: y,
        width: b,
        height: m
    } = f, g = i(r.center) ? W(u, r.center.cx.baseVal.value, r.center.cy.baseVal.value) : W(h, x + b / 2, y + m / 2);
    if (e.setAttribute("data-cx", g.x), e.setAttribute("data-cy", g.y), c(a)) return;
    const {
        scaleX: v,
        scaleY: _,
        dx: M,
        dy: w,
        ox: E,
        oy: j
    } = a;
    if ("drag" === t) {
        if (0 === M && 0 === w) return;
        const t = O();
        t.e = M, t.f = w;
        const s = t.multiply(h).multiply(t.inverse());
        if (e.setAttribute("transform", F(s)), G(e)) {
            L(e).forEach(t => {
                const s = o.createSVGPoint(),
                    n = H(e.parentNode, o).inverse();
                s.x = E, s.y = j, n.e = n.f = 0;
                const r = s.matrixTransform(n),
                    a = O();
                a.e = M, a.f = w;
                const i = a.multiply(H(t, t.parentNode)).multiply(a.inverse());
                (function(t) {
                    const {
                        a: e,
                        b: s,
                        c: o,
                        d: n,
                        e: r,
                        f: a
                    } = t;
                    return 1 === e && 0 === s && 0 === o && 1 === n && 0 === r && 0 === a
                })(i) || t.setAttribute("transform", F(i)), G(t) || nt(t, {
                    x: r.x,
                    y: r.y
                })
            })
        } else nt(e, {
            x: M,
            y: w
        })
    }
    if ("resize" === t) {
        const {
            x: t,
            y: r,
            width: a,
            height: i
        } = n.getBBox();
        if (at(s, {
                x: t,
                y: r,
                width: a,
                height: i,
                boxMatrix: null
            }), G(e)) {
            L(e).forEach(t => {
                G(t) || rt(t, {
                    scaleX: v,
                    scaleY: _,
                    defaultCTM: t.__ctm__,
                    bBox: d,
                    container: o,
                    storage: s
                })
            })
        } else rt(e, {
            scaleX: v,
            scaleY: _,
            defaultCTM: p,
            bBox: d,
            container: o,
            storage: s
        });
        e.setAttribute("transform", F(h))
    }
    this.storage.cached = null
}
_processResize(t, e) {
    const {
        el: s,
        storage: o,
        options: {
            proportions: n
        }
    } = this, {
        left: r,
        top: a,
        cw: i,
        ch: c,
        transform: l,
        revX: h,
        revY: u,
        doW: d,
        doH: p
    } = o, {
        matrix: f,
        scMatrix: x,
        trMatrix: y,
        scaleX: b,
        scaleY: m
    } = l;
    let {
        width: g,
        height: v
    } = s.getBBox();
    const _ = d || !d && !p ? (i + t) / i : (c + e) / c;
    if (g = n ? i * _ : i + t, v = n ? c * _ : c + e, Math.abs(g) < et || Math.abs(v) < et) return;
    const M = g / i,
        w = v / c;
    x.a = M, x.b = 0, x.c = 0, x.d = w, x.e = 0, x.f = 0, y.e = b, y.f = m;
    const E = y.multiply(x).multiply(y.inverse()),
        j = f.multiply(E);
    s.setAttribute("transform", F(j));
    const V = r - (g - i) * (p ? .5 : h ? 1 : 0),
        T = a - (v - c) * (d ? .5 : u ? 1 : 0);
    this.storage.cached = {
        scaleX: M,
        scaleY: w
    };
    const k = {
        x: V,
        y: T,
        width: g,
        height: v
    };
    return at(o, {...k, boxMatrix: null
    }), k
}
_processMove(t, e) {
    const {
        transform: s,
        wrapper: o,
        center: n
    } = this.storage, {
        matrix: r,
        trMatrix: a,
        scMatrix: i,
        wrapperMatrix: c,
        parentMatrix: l
    } = s;
    i.e = t, i.f = e;
    const h = i.multiply(c);
    o.setAttribute("transform", F(h)), l.e = l.f = 0;
    const {
        x: u,
        y: d
    } = W(l.inverse(), t, e);
    a.e = u, a.f = d;
    const p = a.multiply(r);
    if (this.el.setAttribute("transform", F(p)), this.storage.cached = {
            dx: u,
            dy: d,
            ox: t,
            oy: e
        }, n.isShifted) {
        const s = c.inverse();
        s.e = s.f = 0;
        const {
            x: o,
            y: n
        } = W(s, t, e);
        this._moveCenterHandle(-o, -n)
    }
    return p
}
_processRotate(t) {
    const {
        center: e,
        transform: s,
        wrapper: o
    } = this.storage, {
        matrix: n,
        wrapperMatrix: r,
        parentMatrix: a,
        trMatrix: i,
        scMatrix: c,
        rotMatrix: l
    } = s, h = M(Math.cos(t)), u = M(Math.sin(t));
    i.e = e.x, i.f = e.y, l.a = h, l.b = u, l.c = -u, l.d = h;
    const d = i.multiply(l).multiply(i.inverse()).multiply(r);
    o.setAttribute("transform", F(d)), c.e = e.el_x, c.f = e.el_y, a.e = a.f = 0;
    const p = a.inverse().multiply(l).multiply(a),
        f = c.multiply(p).multiply(c.inverse()).multiply(n);
    return this.el.setAttribute("transform", F(f)), f
}
_getState({
    revX: t,
    revY: e,
    doW: s,
    doH: o
}) {
    const {
        el: n,
        storage: r,
        options: {
            container: a
        }
    } = this, {
        box: c,
        wrapper: l,
        parent: h,
        handles: {
            center: u
        }
    } = r, d = n.getBBox(), {
        x: p,
        y: f,
        width: x,
        height: y
    } = d, {
        width: b,
        height: m,
        x: g,
        y: v
    } = c.getBBox(), _ = H(n, h), w = H(n, a), E = H(c.parentNode, a), j = H(h, a), V = p + x * (o ? .5 : t ? 1 : 0), T = f + y * (s ? .5 : e ? 1 : 0), k = {
        matrix: _,
        ctm: w,
        boxCTM: E,
        parentMatrix: j,
        wrapperMatrix: H(l, l.parentNode),
        trMatrix: O(),
        scMatrix: O(),
        rotMatrix: O(),
        scaleX: V,
        scaleY: T,
        scX: Math.sqrt(w.a * w.a + w.b * w.b),
        scY: Math.sqrt(w.c * w.c + w.d * w.d),
        bBox: d
    }, C = g + b / 2, S = v + m / 2, z = u ? u.cx.baseVal.value : C, A = u ? u.cy.baseVal.value : S, {
        x: X,
        y: Y
    } = W(E, z, A), {
        x: D,
        y: N
    } = i(u) ? W(j.inverse(), X, Y) : W(_, p + x / 2, f + y / 2), {
        x: R,
        y: P
    } = W(H(c, a), C, S);
    return L(n).forEach(t => {
        t.__ctm__ = H(t, a)
    }), {
        transform: k,
        cw: b,
        ch: m,
        center: {
            x: u ? X : R,
            y: u ? Y : P,
            el_x: D,
            el_y: N,
            hx: u ? u.cx.baseVal.value : null,
            hy: u ? u.cy.baseVal.value : null,
            isShifted: M(R, 3) !== M(X, 3) && M(P, 3) !== M(Y, 3)
        },
        left: g,
        top: v,
        revX: t,
        revY: e,
        doW: s,
        doH: o
    }
}
_moveCenterHandle(t, e) {
    const {
        handles: {
            center: s,
            radius: o
        },
        center: {
            hx: n,
            hy: r
        }
    } = this.storage;
    if (c(s)) return;
    const a = n + t,
        i = r + e;
    s.cx.baseVal.value = a, s.cy.baseVal.value = i, o.x2.baseVal.value = a, o.y2.baseVal.value = i
}
resetCenterPoint() {
    const {
        box: t,
        handles: {
            center: e,
            radius: s
        }
    } = this.storage, {
        width: o,
        height: n,
        x: r,
        y: a
    } = t.getBBox(), i = H(t, t.parentNode), {
        x: c,
        y: l
    } = W(i, r + o / 2, a + n / 2);
    e.cx.baseVal.value = c, e.cy.baseVal.value = l, e.isShifted = !1, s.x2.baseVal.value = c, s.y2.baseVal.value = l
}
fitControlsToSize() {
    const {
        el: t,
        storage: {
            box: e,
            wrapper: s
        },
        options: {
            container: o
        }
    } = this, {
        width: n,
        height: r,
        x: a,
        y: i
    } = t.getBBox(), c = H(t, o);
    s.removeAttribute("transform"), e.setAttribute("transform", F(c)), at(this.storage, {
        x: a,
        y: i,
        width: n,
        height: r,
        boxMatrix: c
    })
}
get controls() {
    return this.storage.wrapper
}
}

function nt(t, {
x: e,
y: s
}) {
const o = [];
switch (t.tagName.toLowerCase()) {
    case "text":
        {
            const n = i(t.x.baseVal[0]) ? t.x.baseVal[0].value + e : (Number(t.getAttribute("x")) || 0) + e,
                r = i(t.y.baseVal[0]) ? t.y.baseVal[0].value + s : (Number(t.getAttribute("y")) || 0) + s;
            o.push(["x", n], ["y", r]);
            break
        }
    case "use":
    case "image":
    case "rect":
        {
            const n = i(t.x.baseVal.value) ? t.x.baseVal.value + e : (Number(t.getAttribute("x")) || 0) + e,
                r = i(t.y.baseVal.value) ? t.y.baseVal.value + s : (Number(t.getAttribute("y")) || 0) + s;
            o.push(["x", n], ["y", r]);
            break
        }
    case "circle":
    case "ellipse":
        {
            const n = t.cx.baseVal.value + e,
                r = t.cy.baseVal.value + s;
            o.push(["cx", n], ["cy", r]);
            break
        }
    case "line":
        {
            const n = t.x1.baseVal.value + e,
                r = t.y1.baseVal.value + s,
                a = t.x2.baseVal.value + e,
                i = t.y2.baseVal.value + s;
            o.push(["x1", n], ["y1", r], ["x2", a], ["y2", i]);
            break
        }
    case "polygon":
    case "polyline":
        {
            const n = U(t.getAttribute("points")).map(t => (t[0] = Number(t[0]) + e, t[1] = Number(t[1]) + s, t.join(" "))).join(" ");
            o.push(["points", n]);
            break
        }
    case "path":
        {
            const n = t.getAttribute("d");
            o.push(["d", K({
                path: n,
                dx: e,
                dy: s
            })]);
            break
        }
}
o.forEach(e => {
    t.setAttribute(e[0], e[1])
})
}

function rt(t, e) {
const {
    scaleX: s,
    scaleY: o,
    bBox: n,
    defaultCTM: r,
    container: a
} = e, {
    width: c,
    height: l
} = n, h = [], u = H(t, a), d = r.inverse().multiply(u);
switch (t.tagName.toLowerCase()) {
    case "text":
        {
            const e = i(t.x.baseVal[0]) ? t.x.baseVal[0].value : Number(t.getAttribute("x")) || 0,
                n = i(t.y.baseVal[0]) ? t.y.baseVal[0].value : Number(t.getAttribute("y")) || 0,
                {
                    x: r,
                    y: a
                } = W(d, e, n);
            h.push(["x", r + (s < 0 ? c : 0)], ["y", a + (o < 0 ? l : 0)]);
            break
        }
    case "circle":
        {
            const e = t.r.baseVal.value,
                n = t.cx.baseVal.value,
                r = t.cy.baseVal.value,
                a = e * (Math.abs(s) + Math.abs(o)) / 2,
                {
                    x: i,
                    y: c
                } = W(d, n, r);
            h.push(["r", a], ["cx", i], ["cy", c]);
            break
        }
    case "image":
    case "rect":
        {
            const e = t.width.baseVal.value,
                n = t.height.baseVal.value,
                r = t.x.baseVal.value,
                a = t.y.baseVal.value,
                {
                    x: i,
                    y: c
                } = W(d, r, a),
                l = Math.abs(e * s),
                u = Math.abs(n * o);
            h.push(["x", i - (s < 0 ? l : 0)], ["y", c - (o < 0 ? u : 0)], ["width", l], ["height", u]);
            break
        }
    case "ellipse":
        {
            const e = t.rx.baseVal.value,
                n = t.ry.baseVal.value,
                r = t.cx.baseVal.value,
                a = t.cy.baseVal.value,
                {
                    x: i,
                    y: c
                } = W(d, r, a),
                l = O();
            l.a = s, l.d = o;
            const {
                x: u,
                y: p
            } = W(l, e, n);
            h.push(["rx", Math.abs(u)], ["ry", Math.abs(p)], ["cx", i], ["cy", c]);
            break
        }
    case "line":
        {
            const e = t.x1.baseVal.value,
                s = t.y1.baseVal.value,
                o = t.x2.baseVal.value,
                n = t.y2.baseVal.value,
                {
                    x: r,
                    y: a
                } = W(d, e, s),
                {
                    x: i,
                    y: c
                } = W(d, o, n);
            h.push(["x1", r], ["y1", a], ["x2", i], ["y2", c]);
            break
        }
    case "polygon":
    case "polyline":
        {
            const e = U(t.getAttribute("points")).map(t => {
                const {
                    x: e,
                    y: s
                } = W(d, Number(t[0]), Number(t[1]));
                return t[0] = e, t[1] = s, t.join(" ")
            }).join(" ");
            h.push(["points", e]);
            break
        }
    case "path":
        {
            const e = t.getAttribute("d");
            h.push(["d", tt({
                path: e,
                localCTM: d
            })]);
            break
        }
}
h.forEach(([e, s]) => {
    t.setAttribute(e, s)
})
}

function at(t, e) {
const {
    box: s,
    handles: o,
    center: n
} = t;
let {
    x: r,
    y: a,
    width: l,
    height: h,
    boxMatrix: u
} = e;
const d = l / 2,
    p = h / 2,
    f = null !== u ? u : H(s, s.parentNode),
    x = W(f, r + d, a + p),
    y = {
        tl: W(f, r, a),
        tr: W(f, r + l, a),
        br: W(f, r + l, a + h),
        bl: W(f, r, a + h),
        tc: W(f, r + d, a),
        bc: W(f, r + d, a + h),
        ml: W(f, r, a + p),
        mr: W(f, r + l, a + p),
        rotator: {},
        center: i(o.center) && !n.isShifted ? x : void 0
    },
    b = Math.atan2(y.tl.y - y.tr.y, y.tl.x - y.tr.x);
y.rotator.x = y.mr.x - st * Math.cos(b), y.rotator.y = y.mr.y - st * Math.sin(b);
const {
    normal: m,
    radius: g
} = o;
i(m) && (m.x1.baseVal.value = y.mr.x, m.y1.baseVal.value = y.mr.y, m.x2.baseVal.value = y.rotator.x, m.y2.baseVal.value = y.rotator.y), i(g) && (g.x1.baseVal.value = x.x, g.y1.baseVal.value = x.y, n.isShifted || (g.x2.baseVal.value = x.x, g.y2.baseVal.value = x.y));
const v = {
    x: r += l < 0 ? l : 0,
    y: a += h < 0 ? h : 0,
    width: Math.abs(l),
    height: Math.abs(h)
};
Object.keys(v).forEach(t => {
    s.setAttribute(t, v[t])
}), Object.keys(y).forEach(t => {
    const e = o[t],
        s = y[t];
    c(s) || c(e) || (e.setAttribute("cx", s.x), e.setAttribute("cy", s.y))
})
}

function it(t, e) {
t.setAttribute("stroke", e), t.setAttribute("stroke-dasharray", "3 3"), t.setAttribute("vector-effect", "non-scaling-stroke")
}

function ct(t, e) {
if (this.length) {
    const s = i(e) && e instanceof f ? e : new f;
    return r.call(this, (e, o) => (o instanceof SVGElement ? function(t) {
        const e = t.tagName.toLowerCase();
        return -1 !== $.indexOf(e) || (a("Selected element is not allowed to transform. Allowed elements:\ncircle, ellipse, image, line, path, polygon, polyline, rect, text, g"), !1)
    }(o) && e.push(new ot(o, t, s)) : e.push(new N(o, t, s)), e), [])
}
}
class lt extends b {
constructor(t, e) {
    super(t), this.enable(e)
}
_init() {
    const {
        el: t,
        options: e
    } = this, s = p(t), {
        style: o,
        appendTo: n
    } = e, r = {
        position: "absolute",
        "z-index": "2147483647",
        ...o
    };
    this.storage = {
        css: r,
        parent: i(n) ? p(n)[0] : document.body
    }, s.on("mousedown", this._onMouseDown).on("touchstart", this._onTouchStart), g.slice(0, 3).forEach(t => {
        this.eventDispatcher.registerEvent(t)
    })
}
_processOptions(t) {
    let e = {},
        s = null,
        o = document,
        n = () => {},
        r = () => {},
        a = () => {},
        c = () => {};
    if (i(t)) {
        const {
            style: o,
            appendTo: u,
            stack: d,
            onInit: f,
            onMove: x,
            onDrop: y,
            onDestroy: b
        } = t;
        e = i(o) && "object" == typeof o ? o : e, s = u || null;
        const m = i(d) ? p(d)[0] : document;
        n = h(f), r = h(x), a = l(y) ? function(t) {
            const {
                clone: e
            } = this.storage;
            (function(t, e) {
                const {
                    top: s,
                    left: o
                } = w(t), {
                    top: n,
                    left: r
                } = w(e), a = p(t), i = p(e);
                return !(s < n || s + parseFloat(a.css("height")) > n + parseFloat(i.css("height")) || o < r || o + parseFloat(a.css("width")) > r + parseFloat(i.css("width")))
            })(e, m) && y.call(this, t, this.el, e)
        } : () => {}, c = h(b)
    }
    this.options = {
        style: e,
        appendTo: s,
        stack: o
    }, this.proxyMethods = {
        onInit: n,
        onDrop: a,
        onMove: r,
        onDestroy: c
    }
}
_start({
    clientX: t,
    clientY: e
}) {
    const {
        storage: s,
        el: o
    } = this, {
        parent: n,
        css: r
    } = s, {
        left: a,
        top: i
    } = w(n);
    r.left = `${t-a}px`, r.top = `${e-i}px`;
    const c = o.cloneNode(!0);
    p(c).css(r), s.clientX = t, s.clientY = e, s.cx = t, s.cy = e, s.clone = c, p(n)[0].appendChild(c), this._draw()
}
_moving({
    clientX: t,
    clientY: e
}) {
    const {
        storage: s
    } = this;
    s.clientX = t, s.clientY = e, s.doDraw = !0, s.doMove = !0
}
_end(t) {
    const {
        storage: s
    } = this, {
        clone: o,
        frameId: n
    } = s;
    s.doDraw = !1, e(n), c(o) || (this.proxyMethods.onDrop.call(this, t), o.parentNode.removeChild(o), delete s.clone)
}
_animate() {
    const {
        storage: e
    } = this;
    e.frameId = t(this._animate);
    const {
        doDraw: s,
        clientX: o,
        clientY: n,
        cx: r,
        cy: a
    } = e;
    s && (e.doDraw = !1, this._drag({
        dx: o - r,
        dy: n - a
    }))
}
_processMove(t, e) {
    const {
        clone: s
    } = this.storage, o = `translate(${t}px, ${e}px)`;
    p(s).css({
        transform: o,
        webkitTranform: o,
        mozTransform: o,
        msTransform: o,
        otransform: o
    })
}
_destroy() {
    const {
        storage: t,
        proxyMethods: e,
        el: s
    } = this;
    c(t) || (p(s).off("mousedown", this._onMouseDown).off("touchstart", this._onTouchStart), e.onDestroy.call(this, s), delete this.storage)
}
disable() {
    this._destroy()
}
}

function ht(t) {
if (this.length) return n.call(this, e => new lt(e, t))
}
class ut extends u {
drag() {
    return ct.call(this, ...arguments)
}
clone() {
    return ht.call(this, ...arguments)
}
}

function dt(t) {
return new ut(t)
}
Object.defineProperty(dt, "createObservable", {
value: () => new f
}), Object.defineProperty(dt, "Subjx", {
value: ut
}), Object.defineProperty(dt, "Observable", {
value: f
});
export default dt;