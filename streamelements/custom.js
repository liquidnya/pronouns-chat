/*!
You can change this like this:

const overrides = {
"ffz": {
"emote_id": "other_emote_id", // replace emote
"emote_id": null, // remove emote
},
"bttv": {
"emote_id": "other_emote_id", // replace emote
"emote_id": null, // remove emote
},
"7tv": {
"emote_id": "other_emote_id", // replace emote
"emote_id": null, // remove emote
}
};
*/
const overrides = {
	"ffz": {},
	"bttv": {},
	"7tv": {}
};
const userAgent = "pronouns-chat/8.0.4 (https://github.com/liquidnya/pronouns-chat)";
/*! version 8.0.4 */
(function() {
	//#region \0rolldown/runtime.js
	var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
	//#endregion
	//#region node_modules/zod/v4/core/util.js
	function jsonStringifyReplacer(_, value) {
		if (typeof value === "bigint") return value.toString();
		return value;
	}
	var Cached = class {
		constructor(getter) {
			this._getter = getter;
			this._value = void 0;
		}
		get value() {
			const getter = this._getter;
			if (getter !== void 0) {
				this._value = getter();
				this._getter = void 0;
			}
			return this._value;
		}
	};
	function cached(getter) {
		return new Cached(getter);
	}
	function cleanRegex(source) {
		const start = source.startsWith("^") ? 1 : 0;
		const end = source.endsWith("$") ? source.length - 1 : source.length;
		return source.slice(start, end);
	}
	function assignProp(target, prop, value) {
		Object.defineProperty(target, prop, {
			value,
			writable: true,
			enumerable: true,
			configurable: true
		});
	}
	var captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {};
	function isObject(data) {
		return typeof data === "object" && data !== null && !Array.isArray(data);
	}
	function isPlainObject(o) {
		if (isObject(o) === false) return false;
		const ctor = o.constructor;
		if (ctor === void 0) return true;
		if (typeof ctor !== "function") return true;
		const prot = ctor.prototype;
		if (isObject(prot) === false) return false;
		if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) return false;
		return true;
	}
	function shallowClone(o) {
		if (isPlainObject(o)) return { ...o };
		if (Array.isArray(o)) return [...o];
		if (o instanceof Map) return new Map(o);
		if (o instanceof Set) return new Set(o);
		return o;
	}
	function escapeRegex(str) {
		return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	}
	function clone(inst, def, params) {
		const cl = new inst._zod.constr(def ?? inst._zod.def);
		if (!def || params?.parent) cl._zod.parent = inst;
		return cl;
	}
	function normalizeParams(_params) {
		const params = _params;
		if (!params) return {};
		if (typeof params === "string") return { error: () => params };
		if (params?.message !== void 0) {
			if (params?.error !== void 0) throw new Error("Cannot specify both `message` and `error` params");
			params.error = params.message;
		}
		delete params.message;
		if (typeof params.error === "string") return {
			...params,
			error: () => params.error
		};
		return params;
	}
	function optionalKeys(shape) {
		return Object.keys(shape).filter((k) => {
			return shape[k]._zod.optin !== void 0 && shape[k]._zod.optout === "optional";
		});
	}
	var NUMBER_FORMAT_RANGES = /*@__PURE__*/ (() => ({
		safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
		int32: [-2147483648, 2147483647],
		uint32: [0, 4294967295],
		float32: [-34028234663852886e22, 34028234663852886e22],
		float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
	}))();
	function aborted(x, startIndex = 0) {
		if (x.aborted === true) return true;
		for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue !== true) return true;
		return false;
	}
	function explicitlyAborted(x, startIndex = 0) {
		if (x.aborted === true) return true;
		for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue === false) return true;
		return false;
	}
	function prefixIssues(path, issues) {
		return issues.map((iss) => {
			var _a;
			(_a = iss).path ?? (_a.path = []);
			iss.path.unshift(path);
			return iss;
		});
	}
	function unwrapMessage(message) {
		return typeof message === "string" ? message : message?.message;
	}
	function attachSchema(issues, start, inst) {
		var _a;
		for (let i = start; i < issues.length; i++) (_a = issues[i]).schema ?? (_a.schema = inst);
	}
	function finalizeIssue(iss, ctx, config) {
		var _a;
		const traits = iss.inst?._zod?.traits;
		if (traits?.has("$ZodType")) {
			if (traits.has("$ZodCheck")) (_a = iss).schema ?? (_a.schema = iss.inst);
			else iss.schema = iss.inst;
		}
		const schemaError = iss.schema !== iss.inst ? iss.schema?._zod.def?.error : void 0;
		const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(schemaError?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config.customError?.(iss)) ?? unwrapMessage(config.localeError?.(iss)) ?? "Invalid input";
		const full = {};
		for (const k of Object.keys(iss)) {
			if (k === "inst" || k === "schema" || k === "continue" || k === "input" || k === "__proto__") continue;
			full[k] = iss[k];
		}
		full.path ?? (full.path = []);
		full.message = message;
		if (ctx?.reportInput) full.input = iss.input;
		return full;
	}
	function members(proto, table) {
		for (const key in table) {
			const desc = Object.getOwnPropertyDescriptor(table, key);
			if (desc.get) Object.defineProperty(proto, key, {
				...desc,
				enumerable: false
			});
			else defineBound(proto, key, desc.value);
		}
	}
	function own(inst, key, value, enumerable = true) {
		Object.defineProperty(inst, key, {
			configurable: true,
			writable: true,
			enumerable,
			value
		});
		return value;
	}
	function hide(inst, key, value) {
		return own(inst, key, value, false);
	}
	function defineBound(proto, key, fn) {
		Object.defineProperty(proto, key, {
			configurable: true,
			get() {
				return this == null ? fn : own(this, key, fn.bind(this));
			},
			set(value) {
				own(this, key, value);
			}
		});
	}
	function claim(inst, sentinel) {
		const proto = Object.getPrototypeOf(inst);
		return sentinel in proto ? void 0 : proto;
	}
	var installing;
	var broke = false;
	var breaker = {
		configurable: true,
		get() {
			broke = true;
		}
	};
	function defineLazyInternal(inst, key, compute) {
		const proto = Object.getPrototypeOf(inst._zod);
		if (key in proto && installing !== inst._zod) {
			installing = void 0;
			return;
		}
		installing = inst._zod;
		Object.defineProperty(proto, key, {
			configurable: true,
			get() {
				Object.defineProperty(this, key, breaker);
				const outer = broke;
				broke = false;
				try {
					const value = compute(this);
					if (broke) delete this[key];
					else Object.defineProperty(this, key, {
						configurable: true,
						writable: true,
						value
					});
					broke = broke || outer;
					return value;
				} catch (err) {
					delete this[key];
					broke = broke || outer;
					throw err;
				}
			},
			set(value) {
				Object.defineProperty(this, key, {
					configurable: true,
					writable: true,
					value
				});
			}
		});
	}
	function installLazyProp(inst, key, make, enumerable) {
		const proto = claim(inst, key);
		if (!proto) return;
		Object.defineProperty(proto, key, {
			configurable: true,
			get() {
				const desc = {
					configurable: true,
					writable: true,
					enumerable,
					value: void 0
				};
				Object.defineProperty(this, key, desc);
				desc.value = make(this);
				Object.defineProperty(this, key, desc);
				return desc.value;
			},
			set(value) {
				Object.defineProperty(this, key, {
					configurable: true,
					writable: true,
					enumerable,
					value
				});
			}
		});
	}
	//#endregion
	//#region node_modules/zod/v4/core/core.js
	var _a;
	var _zodDesc = {
		value: void 0,
		enumerable: false
	};
	var _E = "captureStackTrace" in Error ? Error : null;
	function newError(Definition) {
		const E = _E;
		if (E) {
			const saved = E.stackTraceLimit;
			if (typeof saved === "number") {
				try {
					E.stackTraceLimit = 0;
				} catch {
					_E = null;
					return new Definition();
				}
				try {
					return new Definition();
				} finally {
					E.stackTraceLimit = saved;
				}
			}
		}
		return new Definition();
	}
	function $constructor(name, initializer, proto, params) {
		const zodProto = {};
		function Internals(def) {
			this.def = def;
			this.constr = _;
			this.traits = /* @__PURE__ */ new Set();
		}
		Internals.prototype = zodProto;
		const protoMembers = proto;
		const initialized = protoMembers && /* @__PURE__ */ new WeakSet();
		function init(inst, def) {
			if (!inst._zod) {
				_zodDesc.value = new Internals(def);
				try {
					Object.defineProperty(inst, "_zod", _zodDesc);
				} finally {
					_zodDesc.value = void 0;
				}
			} else if (inst._zod.traits.has(name)) return;
			inst._zod.traits.add(name);
			initializer(inst, def);
			if (initialized) {
				const own = Object.getPrototypeOf(inst);
				const ctorProto = inst._zod.constr.prototype;
				let up = own;
				while (up && up !== ctorProto) up = Object.getPrototypeOf(up);
				const target = up ?? own;
				if (!initialized.has(target)) {
					initialized.add(target);
					members(target, protoMembers);
				}
			}
			const proto = _.prototype;
			for (const k in proto) {
				if (!Object.prototype.hasOwnProperty.call(proto, k)) continue;
				if (!(k in inst)) inst[k] = proto[k].bind(inst);
			}
		}
		const Parent = params?.Parent ?? Object;
		class Definition extends Parent {}
		Object.defineProperty(Definition, "name", { value: name });
		function _(def) {
			const inst = params?.Parent ? newError(Definition) : this;
			init(inst, def);
			const deferred = inst._zod.deferred;
			if (deferred) {
				for (const fn of deferred) fn();
				inst._zod.deferred = void 0;
			}
			const pp = globalThis.__zod_globalConfig?.postProcessor;
			if (pp) pp(inst);
			return inst;
		}
		Object.defineProperty(_, "init", { value: init });
		Object.defineProperty(_, Symbol.hasInstance, { value: (inst) => {
			if (params?.Parent && inst instanceof params.Parent) return true;
			return inst?._zod?.traits?.has(name);
		} });
		Object.defineProperty(_, "name", { value: name });
		return _;
	}
	var $ZodAsyncError = class extends Error {
		constructor() {
			super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
		}
	};
	var $ZodEncodeError = class extends Error {
		constructor(name) {
			super(`Encountered unidirectional transform during encode: ${name}`);
			this.name = "ZodEncodeError";
		}
	};
	(_a = globalThis).__zod_globalConfig ?? (_a.__zod_globalConfig = {});
	var globalConfig = globalThis.__zod_globalConfig;
	function config(newConfig) {
		if (newConfig) Object.assign(globalConfig, newConfig);
		return globalConfig;
	}
	//#endregion
	//#region node_modules/zod/v4/core/errors.js
	function _getMessage() {
		const internals = this._zod;
		internals.message ?? (internals.message = JSON.stringify(internals.def, jsonStringifyReplacer, 2));
		return internals.message;
	}
	function _setMessage(value) {
		this._zod.message = value;
	}
	var _messageDesc = {
		get: _getMessage,
		set: _setMessage,
		enumerable: true,
		configurable: true
	};
	var _issuesDesc = {
		value: void 0,
		enumerable: false
	};
	var _installedToString = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]);
	var initializer = (inst, def) => {
		inst.name = "$ZodError";
		_issuesDesc.value = def;
		Object.defineProperty(inst, "issues", _issuesDesc);
		_issuesDesc.value = void 0;
		Object.defineProperty(inst, "message", _messageDesc);
		const proto = Object.getPrototypeOf(inst);
		if (!_installedToString.has(proto)) {
			_installedToString.add(proto);
			Object.defineProperty(proto, "toString", {
				configurable: true,
				enumerable: false,
				get() {
					const value = () => this.message;
					Object.defineProperty(this, "toString", {
						value,
						configurable: true,
						writable: true
					});
					return value;
				},
				set(value) {
					Object.defineProperty(this, "toString", {
						value,
						configurable: true,
						writable: true
					});
				}
			});
		}
	};
	$constructor("$ZodError", initializer);
	var $ZodRealError = $constructor("$ZodError", initializer, void 0, { Parent: Error });
	//#endregion
	//#region node_modules/zod/v4/core/parse.js
	var _parse = (_Err) => {
		const fn = (schema, value, _ctx, _params) => {
			const ctx = _ctx ? {
				..._ctx,
				async: false
			} : { async: false };
			const result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) throw new $ZodAsyncError();
			if (result.issues.length) {
				const e = new ((_params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
				captureStackTrace(e, _params?.callee ?? fn);
				throw e;
			}
			return result.value;
		};
		return fn;
	};
	var parse = /* @__PURE__*/ _parse($ZodRealError);
	var _parseAsync = (_Err) => {
		const fn = async (schema, value, _ctx, params) => {
			const ctx = _ctx ? {
				..._ctx,
				async: true
			} : { async: true };
			let result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) result = await result;
			if (result.issues.length) {
				const e = new ((params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
				captureStackTrace(e, params?.callee ?? fn);
				throw e;
			}
			return result.value;
		};
		return fn;
	};
	var parseAsync = /* @__PURE__*/ _parseAsync($ZodRealError);
	var _safeParse = (_Err) => (schema, value, _ctx) => {
		const ctx = _ctx ? {
			..._ctx,
			async: false
		} : { async: false };
		const result = schema._zod.run({
			value,
			issues: []
		}, ctx);
		if (result instanceof Promise) throw new $ZodAsyncError();
		return result.issues.length ? failure(_Err, result.issues, ctx) : {
			success: true,
			data: result.value
		};
	};
	var safeParse = /* @__PURE__*/ _safeParse($ZodRealError);
	function failure(Err, issues, ctx) {
		let error;
		return {
			success: false,
			get error() {
				if (!error) {
					error = new Err(issues.map((iss) => finalizeIssue(iss, ctx, config())));
					issues = void 0;
					ctx = void 0;
				}
				return error;
			},
			set error(e) {
				error = e;
				issues = void 0;
				ctx = void 0;
			}
		};
	}
	var _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
		const ctx = _ctx ? {
			..._ctx,
			async: true
		} : { async: true };
		let result = schema._zod.run({
			value,
			issues: []
		}, ctx);
		if (result instanceof Promise) result = await result;
		return result.issues.length ? failure(_Err, result.issues, ctx) : {
			success: true,
			data: result.value
		};
	};
	var safeParseAsync = /* @__PURE__*/ _safeParseAsync($ZodRealError);
	//#endregion
	//#region node_modules/zod/v4/core/regexes.js
	var anyString = /^[\s\S]{0,}$/;
	var number$1 = /^-?\d+(?:\.\d+)?$/;
	var boolean$1 = /^(?:true|false)$/i;
	//#endregion
	//#region node_modules/zod/v4/core/checks.js
	var $ZodCheck = /*@__PURE__*/ $constructor("$ZodCheck", (inst, def) => {
		var _a;
		inst._zod ?? (inst._zod = {});
		inst._zod.def = def;
		(_a = inst._zod).onattach ?? (_a.onattach = []);
	});
	var numericOriginMap = {
		number: "number",
		bigint: "bigint",
		object: "date"
	};
	var $ZodCheckGreaterThan = /*@__PURE__*/ $constructor("$ZodCheckGreaterThan", (inst, def) => {
		$ZodCheck.init(inst, def);
		const origin = numericOriginMap[typeof def.value];
		inst._zod.check = (payload) => {
			if (def.inclusive ? payload.value >= def.value : payload.value > def.value) return;
			payload.issues.push({
				origin: numericOriginMap[typeof payload.value] ?? origin,
				code: "too_small",
				minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
				input: payload.value,
				inclusive: def.inclusive,
				inst,
				continue: !def.abort
			});
		};
	});
	var $ZodCheckNumberFormat = /*@__PURE__*/ $constructor("$ZodCheckNumberFormat", (inst, def) => {
		$ZodCheck.init(inst, def);
		def.format = def.format || "float64";
		const isInt = def.format?.includes("int");
		const origin = isInt ? "int" : "number";
		const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
		inst._zod.check = (payload) => {
			const input = payload.value;
			if (isInt) {
				if (!Number.isInteger(input)) {
					payload.issues.push({
						expected: origin,
						format: def.format,
						code: "invalid_type",
						continue: false,
						input,
						inst
					});
					return;
				}
				if (!Number.isSafeInteger(input)) {
					if (input > 0) payload.issues.push({
						input,
						code: "too_big",
						maximum: Number.MAX_SAFE_INTEGER,
						note: "Integers must be within the safe integer range.",
						inst,
						origin,
						inclusive: true,
						continue: !def.abort
					});
					else payload.issues.push({
						input,
						code: "too_small",
						minimum: Number.MIN_SAFE_INTEGER,
						note: "Integers must be within the safe integer range.",
						inst,
						origin,
						inclusive: true,
						continue: !def.abort
					});
					return;
				}
			}
			if (input < minimum) payload.issues.push({
				origin: "number",
				input,
				code: "too_small",
				minimum,
				inclusive: true,
				inst,
				continue: !def.abort
			});
			if (input > maximum) payload.issues.push({
				origin: "number",
				input,
				code: "too_big",
				maximum,
				inclusive: true,
				inst,
				continue: !def.abort
			});
		};
	});
	//#endregion
	//#region node_modules/zod/v4/core/versions.js
	var version = {
		major: 4,
		minor: 6,
		patch: 5
	};
	//#endregion
	//#region node_modules/zod/v4/core/schemas.js
	var $ZodType = /*@__PURE__*/ $constructor("$ZodType", (inst, def) => {
		var _a;
		inst ?? (inst = {});
		inst._zod.def = def;
		inst._zod.bag = inst._zod.bag || {};
		inst._zod.version = version;
		const defChecks = inst._zod.def.checks;
		const checks = inst._zod.traits.has("$ZodCheck") ? [inst, ...defChecks ?? []] : defChecks?.length ? [...defChecks] : [];
		for (const ch of checks) for (const fn of ch._zod.onattach) fn(inst);
		if (checks.length === 0) {
			(_a = inst._zod).deferred ?? (_a.deferred = []);
			inst._zod.deferred?.push(() => {
				inst._zod.run = inst._zod.parse;
			});
		} else {
			const runChecks = (payload, checks, ctx) => {
				if (payload.memo) return payload;
				let isAborted = aborted(payload);
				let asyncResult;
				for (const ch of checks) {
					if (ch._zod.def.when) {
						if (explicitlyAborted(payload)) continue;
						if (!ch._zod.def.when(payload)) continue;
					} else if (isAborted) continue;
					const currLen = payload.issues.length;
					const _ = ch._zod.check(payload);
					if (_ instanceof Promise && ctx?.async === false) throw new $ZodAsyncError();
					if (asyncResult || _ instanceof Promise) asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
						await _;
						if (payload.issues.length === currLen) return;
						attachSchema(payload.issues, currLen, inst);
						if (!isAborted) isAborted = aborted(payload, currLen);
					});
					else {
						if (payload.issues.length === currLen) continue;
						attachSchema(payload.issues, currLen, inst);
						if (!isAborted) isAborted = aborted(payload, currLen);
					}
				}
				if (asyncResult) return asyncResult.then(() => {
					return payload;
				});
				return payload;
			};
			const handleCanaryResult = (canary, payload, ctx) => {
				if (aborted(canary)) {
					canary.aborted = true;
					return canary;
				}
				const checkResult = runChecks(payload, checks, ctx);
				if (checkResult instanceof Promise) {
					if (ctx.async === false) throw new $ZodAsyncError();
					return checkResult.then((checkResult) => inst._zod.parse(checkResult, ctx));
				}
				return inst._zod.parse(checkResult, ctx);
			};
			inst._zod.run = (payload, ctx) => {
				if (ctx.skipChecks) return inst._zod.parse(payload, ctx);
				if (ctx.direction === "backward") {
					const canary = inst._zod.parse({
						value: payload.value,
						issues: []
					}, {
						...ctx,
						skipChecks: true
					});
					if (canary instanceof Promise) return canary.then((canary) => {
						return handleCanaryResult(canary, payload, ctx);
					});
					return handleCanaryResult(canary, payload, ctx);
				}
				const result = inst._zod.parse(payload, ctx);
				if (result instanceof Promise) {
					if (ctx.async === false) throw new $ZodAsyncError();
					return result.then((result) => runChecks(result, checks, ctx));
				}
				return runChecks(result, checks, ctx);
			};
		}
	}, {
		get "~standard"() {
			return hide(this, "~standard", standardProps(this));
		},
		set "~standard"(value) {
			own(this, "~standard", value);
		}
	});
	var toStandardResult = (r, ctx) => r.issues.length ? { issues: r.issues.map((iss) => finalizeIssue(iss, ctx, config())) } : { value: r.value };
	async function validateAsync(inst, value) {
		const ctx = { async: true };
		return toStandardResult(await inst._zod.run({
			value,
			issues: []
		}, ctx), ctx);
	}
	function standardProps(inst) {
		return {
			validate: (value) => {
				const ctx = { async: false };
				try {
					const r = inst._zod.run({
						value,
						issues: []
					}, ctx);
					if (!(r instanceof Promise)) return toStandardResult(r, ctx);
				} catch (_) {}
				return validateAsync(inst, value);
			},
			vendor: "zod",
			version: 1
		};
	}
	var $ZodString = /*@__PURE__*/ $constructor("$ZodString", (inst, def) => {
		$ZodType.init(inst, def);
		inst._zod.pattern = def.pattern ?? anyString;
		inst._zod.parse = (payload, _) => {
			if (def.coerce) try {
				payload.value = String(payload.value);
			} catch (_) {}
			if (typeof payload.value === "string") return payload;
			payload.issues.push({
				expected: "string",
				code: "invalid_type",
				input: payload.value,
				inst
			});
			return payload;
		};
	});
	var $ZodNumber = /*@__PURE__*/ $constructor("$ZodNumber", (inst, def) => {
		$ZodType.init(inst, def);
		inst._zod.pattern = number$1;
		inst._zod.parse = (payload, _ctx) => {
			if (def.coerce) try {
				payload.value = Number(payload.value);
			} catch (_) {}
			const input = payload.value;
			if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) return payload;
			const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? String(input) : void 0 : void 0;
			payload.issues.push({
				expected: "number",
				code: "invalid_type",
				input,
				inst,
				...received ? { received } : {}
			});
			return payload;
		};
	});
	var $ZodNumberFormat = /*@__PURE__*/ $constructor("$ZodNumberFormat", (inst, def) => {
		$ZodCheckNumberFormat.init(inst, def);
		$ZodNumber.init(inst, def);
	});
	var $ZodBoolean = /*@__PURE__*/ $constructor("$ZodBoolean", (inst, def) => {
		$ZodType.init(inst, def);
		inst._zod.pattern = boolean$1;
		inst._zod.parse = (payload, _ctx) => {
			if (def.coerce) try {
				payload.value = Boolean(payload.value);
			} catch (_) {}
			const input = payload.value;
			if (typeof input === "boolean") return payload;
			payload.issues.push({
				expected: "boolean",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		};
	});
	var $ZodAny = /*@__PURE__*/ $constructor("$ZodAny", (inst, def) => {
		$ZodType.init(inst, def);
		inst._zod.parse = (payload) => payload;
	});
	var $ZodUnknown = /*@__PURE__*/ $constructor("$ZodUnknown", (inst, def) => {
		$ZodType.init(inst, def);
		inst._zod.parse = (payload) => payload;
	});
	function handleArrayResult(result, final, index) {
		if (result.issues.length) final.issues.push(...prefixIssues(index, result.issues));
		final.value[index] = result.value;
	}
	var $ZodArray = /*@__PURE__*/ $constructor("$ZodArray", (inst, def) => {
		$ZodType.init(inst, def);
		const memo = globalConfig.memoizer;
		memo?.attach(inst);
		inst._zod.parse = (payload, ctx) => {
			const input = payload.value;
			if (!Array.isArray(input)) {
				payload.issues.push({
					expected: "array",
					code: "invalid_type",
					input,
					inst
				});
				return payload;
			}
			payload.value = memo ? memo.alloc(inst, payload, Array(input.length), ctx) : Array(input.length);
			const proms = [];
			const abortEarly = ctx?.abortEarly;
			for (let i = 0; i < input.length; i++) {
				const item = input[i];
				const result = def.element._zod.run({
					value: item,
					issues: []
				}, ctx);
				if (result instanceof Promise) proms.push(result.then((result) => handleArrayResult(result, payload, i)));
				else {
					handleArrayResult(result, payload, i);
					if (abortEarly && result.issues.length !== 0 && aborted(result)) break;
				}
			}
			if (proms.length) return Promise.all(proms).then(() => payload);
			return payload;
		};
	});
	function handlePropertyResult(result, final, key, input, optin, optout) {
		const isPresent = key in input;
		const isOptionalOut = optout === "optional";
		if (!isPresent && isOptionalOut && optin === "optional") return;
		if (result.issues.length) {
			if (optin !== void 0 && isOptionalOut && !isPresent) return;
			final.issues.push(...prefixIssues(key, result.issues));
		}
		if (!isPresent && optin === void 0) {
			if (!result.issues.length) final.issues.push({
				code: "invalid_type",
				expected: "nonoptional",
				input: void 0,
				path: [key]
			});
			return;
		}
		if (result.value === void 0) {
			if (isPresent || optin === "defaulted" && !isOptionalOut) final.value[key] = void 0;
		} else final.value[key] = result.value;
	}
	var NO_SYMBOL_KEYS = [];
	function normalizeDef(def) {
		const keys = Object.keys(def.shape);
		const ownSymbols = Object.getOwnPropertySymbols(def.shape);
		const symbolKeys = ownSymbols.length ? ownSymbols : NO_SYMBOL_KEYS;
		const allKeys = symbolKeys.length ? [...keys, ...symbolKeys] : keys;
		for (const k of allKeys) if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) throw new Error(`Invalid element at key "${String(k)}": expected a Zod schema`);
		const okeys = optionalKeys(def.shape);
		return {
			...def,
			allKeys,
			symbolKeys,
			keySet: new Set(keys),
			numKeys: keys.length,
			optionalKeys: new Set(okeys)
		};
	}
	function handleCatchall(proms, input, payload, ctx, def, inst, abortEarly) {
		const unrecognized = [];
		const keySet = def.keySet;
		const _catchall = def.catchall._zod;
		const t = _catchall.def.type;
		const optin = _catchall.optin;
		const optout = _catchall.optout;
		let seen = 0;
		for (const key in input) {
			if (abortEarly && payload.issues.length !== seen) {
				if (aborted(payload, seen)) break;
				seen = payload.issues.length;
			}
			if (keySet.has(key)) continue;
			if (key === "__proto__") {
				if (t === "never") unrecognized.push(key);
				continue;
			}
			if (t === "never") {
				unrecognized.push(key);
				continue;
			}
			const r = _catchall.run({
				value: input[key],
				issues: []
			}, ctx);
			if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, optin, optout)));
			else handlePropertyResult(r, payload, key, input, optin, optout);
		}
		if (unrecognized.length) payload.issues.push({
			code: "unrecognized_keys",
			keys: unrecognized,
			input,
			inst,
			continue: true
		});
		if (!proms.length) return payload;
		return Promise.all(proms).then(() => {
			return payload;
		});
	}
	var $ZodObject = /*@__PURE__*/ $constructor("$ZodObject", (inst, def) => {
		$ZodType.init(inst, def);
		const desc = Object.getOwnPropertyDescriptor(def, "shape");
		const sh = desc?.get ? desc.get.raw : def.shape ?? {};
		if (sh) {
			const get = () => {
				const newSh = { ...sh };
				Object.defineProperty(def, "shape", { value: newSh });
				get.raw = newSh;
				return newSh;
			};
			get.raw = sh;
			Object.defineProperty(def, "shape", { get });
		}
		const _normalized = cached(() => normalizeDef(def));
		defineLazyInternal(inst, "propValues", (zod) => {
			const shape = zod.def.shape;
			const propValues = {};
			for (const key in shape) {
				const field = shape[key]._zod;
				if (field.values) {
					if (!Object.prototype.hasOwnProperty.call(propValues, key)) assignProp(propValues, key, /* @__PURE__ */ new Set());
					for (const v of field.values) propValues[key].add(v);
					if (field.optin !== void 0) propValues[key].add(void 0);
				}
			}
			return propValues;
		});
		const isObject$2 = isObject;
		const catchall = def.catchall;
		let value;
		const memo = globalConfig.memoizer;
		memo?.attach(inst);
		inst._zod.parse = (payload, ctx) => {
			value ?? (value = _normalized.value);
			const input = payload.value;
			if (!isObject$2(input)) {
				payload.issues.push({
					expected: "object",
					code: "invalid_type",
					input,
					inst
				});
				return payload;
			}
			payload.value = memo ? memo.alloc(inst, payload, {}, ctx) : {};
			const proms = [];
			const shape = value.shape;
			const abortEarly = ctx?.abortEarly;
			let seen = payload.issues.length;
			for (const key of value.allKeys) {
				if (abortEarly && payload.issues.length !== seen) {
					if (aborted(payload, seen)) break;
					seen = payload.issues.length;
				}
				if (key === "__proto__") continue;
				const el = shape[key];
				const optin = el._zod.optin;
				const optout = el._zod.optout;
				const r = el._zod.run({
					value: input[key],
					issues: []
				}, ctx);
				if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, optin, optout)));
				else handlePropertyResult(r, payload, key, input, optin, optout);
			}
			if (!catchall) return proms.length ? Promise.all(proms).then(() => payload) : payload;
			return handleCatchall(proms, input, payload, ctx, _normalized.value, inst, abortEarly === true);
		};
	});
	function handleUnionResults(results, final, inst, ctx) {
		for (const result of results) if (result.issues.length === 0) {
			final.value = result.value;
			return final;
		}
		const nonaborted = results.filter((r) => !aborted(r));
		if (nonaborted.length === 1) {
			final.value = nonaborted[0].value;
			return nonaborted[0];
		}
		final.issues.push({
			code: "invalid_union",
			input: final.value,
			inst,
			errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
		});
		return final;
	}
	var $ZodUnion = /*@__PURE__*/ $constructor("$ZodUnion", (inst, def) => {
		$ZodType.init(inst, def);
		defineLazyInternal(inst, "optin", (zod) => zod.def.options.some((o) => o._zod.optin === "defaulted") ? "defaulted" : zod.def.options.some((o) => o._zod.optin !== void 0) ? "optional" : void 0);
		defineLazyInternal(inst, "optout", (zod) => zod.def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0);
		defineLazyInternal(inst, "values", (zod) => {
			if (zod.def.options.every((o) => o._zod.values)) return new Set(zod.def.options.flatMap((option) => Array.from(option._zod.values)));
		});
		defineLazyInternal(inst, "pattern", (zod) => {
			if (zod.def.options.every((o) => o._zod.pattern)) {
				const patterns = zod.def.options.map((o) => o._zod.pattern);
				return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
			}
		});
		const first = def.options.length === 1 ? def.options[0]._zod.run : null;
		inst._zod.parse = (payload, ctx) => {
			if (first) return first(payload, ctx);
			let async = false;
			const results = [];
			for (const option of def.options) {
				const result = option._zod.run({
					value: payload.value,
					issues: []
				}, ctx);
				if (result instanceof Promise) {
					results.push(result);
					async = true;
				} else {
					if (result.issues.length === 0) return result;
					results.push(result);
				}
			}
			if (!async) return handleUnionResults(results, payload, inst, ctx);
			return Promise.all(results).then((results) => {
				return handleUnionResults(results, payload, inst, ctx);
			});
		};
	});
	var $ZodRecord = /*@__PURE__*/ $constructor("$ZodRecord", (inst, def) => {
		$ZodType.init(inst, def);
		const memo = globalConfig.memoizer;
		memo?.attach(inst);
		inst._zod.parse = (payload, ctx) => {
			const input = payload.value;
			if (!isPlainObject(input)) {
				payload.issues.push({
					expected: "record",
					code: "invalid_type",
					input,
					inst
				});
				return payload;
			}
			const proms = [];
			const values = def.keyType._zod.values;
			if (values && !def.partial) {
				payload.value = memo ? memo.alloc(inst, payload, {}, ctx) : {};
				const recordKeys = /* @__PURE__ */ new Set();
				for (const key of values) if (typeof key === "string" || typeof key === "number" || typeof key === "symbol") {
					recordKeys.add(typeof key === "number" ? key.toString() : key);
					if (key === "__proto__") continue;
					const keyResult = def.keyType._zod.run({
						value: key,
						issues: []
					}, ctx);
					if (keyResult instanceof Promise) throw new Error("Async schemas not supported in object keys currently");
					if (keyResult.issues.length) {
						payload.issues.push({
							code: "invalid_key",
							origin: "record",
							issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
							input: key,
							path: [key],
							inst
						});
						continue;
					}
					const outKey = keyResult.value;
					if (outKey === "__proto__") continue;
					const result = def.valueType._zod.run({
						value: input[key],
						issues: []
					}, ctx);
					if (result instanceof Promise) proms.push(result.then((result) => {
						if (result.issues.length) payload.issues.push(...prefixIssues(key, result.issues));
						payload.value[outKey] = result.value;
					}));
					else {
						if (result.issues.length) payload.issues.push(...prefixIssues(key, result.issues));
						payload.value[outKey] = result.value;
					}
				}
				let unrecognized;
				for (const key in input) if (!recordKeys.has(key)) {
					if (def.mode === "loose") {
						if (key === "__proto__") continue;
						payload.value[key] = input[key];
					} else {
						unrecognized = unrecognized ?? [];
						unrecognized.push(key);
					}
				}
				if (unrecognized && unrecognized.length > 0) payload.issues.push({
					code: "unrecognized_keys",
					input,
					inst,
					keys: unrecognized,
					continue: true
				});
			} else {
				payload.value = memo ? memo.alloc(inst, payload, {}, ctx) : {};
				let unrecognized;
				for (const key of Reflect.ownKeys(input)) {
					if (key === "__proto__") continue;
					if (!Object.prototype.propertyIsEnumerable.call(input, key)) continue;
					let keyResult = def.keyType._zod.run({
						value: key,
						issues: []
					}, ctx);
					if (keyResult instanceof Promise) throw new Error("Async schemas not supported in object keys currently");
					if (typeof key === "string" && number$1.test(key) && keyResult.issues.length) {
						const retryResult = def.keyType._zod.run({
							value: Number(key),
							issues: []
						}, ctx);
						if (retryResult instanceof Promise) throw new Error("Async schemas not supported in object keys currently");
						if (retryResult.issues.length === 0) keyResult = retryResult;
					}
					if (keyResult.issues.length) {
						if (def.mode === "loose") payload.value[key] = input[key];
						else if (values) {
							unrecognized = unrecognized ?? [];
							unrecognized.push(key);
						} else payload.issues.push({
							code: "invalid_key",
							origin: "record",
							issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
							input: key,
							path: [key],
							inst
						});
						continue;
					}
					const outKey = keyResult.value;
					if (outKey === "__proto__") continue;
					const result = def.valueType._zod.run({
						value: input[key],
						issues: []
					}, ctx);
					if (result instanceof Promise) proms.push(result.then((result) => {
						if (result.issues.length) payload.issues.push(...prefixIssues(key, result.issues));
						payload.value[outKey] = result.value;
					}));
					else {
						if (result.issues.length) payload.issues.push(...prefixIssues(key, result.issues));
						payload.value[outKey] = result.value;
					}
				}
				if (unrecognized && unrecognized.length > 0) payload.issues.push({
					code: "unrecognized_keys",
					input,
					inst,
					keys: unrecognized,
					continue: true
				});
			}
			if (proms.length) return Promise.all(proms).then(() => payload);
			return payload;
		};
	});
	var $ZodLiteral = /*@__PURE__*/ $constructor("$ZodLiteral", (inst, def) => {
		$ZodType.init(inst, def);
		const values = new Set(def.values);
		inst._zod.values = values;
		defineLazyInternal(inst, "pattern", (zod) => {
			const vals = zod.def.values;
			return new RegExp(vals.length ? `^(${vals.map((o) => typeof o === "string" ? escapeRegex(o) : o ? escapeRegex(o.toString()) : String(o)).join("|")})$` : "^[^\\s\\S]$");
		});
		inst._zod.parse = (payload, _ctx) => {
			const input = payload.value;
			if (values.has(input)) return payload;
			payload.issues.push({
				code: "invalid_value",
				values: def.values,
				input,
				inst
			});
			return payload;
		};
	});
	var $ZodTransform = /*@__PURE__*/ $constructor("$ZodTransform", (inst, def) => {
		$ZodType.init(inst, def);
		inst._zod.optin = "optional";
		globalConfig.memoizer?.guard(inst);
		inst._zod.parse = (payload, ctx) => {
			if (ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
			const _out = def.transform(payload.value, payload);
			if (ctx.async) return (_out instanceof Promise ? _out : Promise.resolve(_out)).then((output) => {
				payload.value = output;
				return payload;
			});
			if (_out instanceof Promise) throw new $ZodAsyncError();
			payload.value = _out;
			return payload;
		};
	});
	function handleOptionalResult(payload, result) {
		payload.value = result.issues.length ? void 0 : result.value;
		return payload;
	}
	var $ZodOptional = /*@__PURE__*/ $constructor("$ZodOptional", (inst, def) => {
		$ZodType.init(inst, def);
		defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional");
		inst._zod.optout = "optional";
		defineLazyInternal(inst, "values", (zod) => {
			const values = zod.def.innerType._zod.values;
			return values ? /* @__PURE__ */ new Set([...values, void 0]) : void 0;
		});
		defineLazyInternal(inst, "pattern", (zod) => {
			const pattern = zod.def.innerType._zod.pattern;
			return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
		});
		inst._zod.parse = (payload, ctx) => {
			if (payload.value === void 0) {
				if (def.innerType._zod.optin !== "defaulted") return payload;
				const result = def.innerType._zod.run({
					value: payload.value,
					issues: []
				}, ctx);
				if (result instanceof Promise) return result.then((result) => handleOptionalResult(payload, result));
				return handleOptionalResult(payload, result);
			}
			return def.innerType._zod.run(payload, ctx);
		};
	});
	var $ZodNullable = /*@__PURE__*/ $constructor("$ZodNullable", (inst, def) => {
		$ZodType.init(inst, def);
		defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin);
		defineLazyInternal(inst, "optout", (zod) => zod.def.innerType._zod.optout);
		defineLazyInternal(inst, "pattern", (zod) => {
			const pattern = zod.def.innerType._zod.pattern;
			return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
		});
		defineLazyInternal(inst, "values", (zod) => {
			return zod.def.innerType._zod.values ? /* @__PURE__ */ new Set([...zod.def.innerType._zod.values, null]) : void 0;
		});
		inst._zod.parse = (payload, ctx) => {
			if (payload.value === null) return payload;
			return def.innerType._zod.run(payload, ctx);
		};
	});
	var $ZodDefault = /*@__PURE__*/ $constructor("$ZodDefault", (inst, def) => {
		$ZodType.init(inst, def);
		inst._zod.optin = "defaulted";
		defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
		inst._zod.parse = (payload, ctx) => {
			if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
			if (payload.value === void 0) {
				payload.value = def.defaultValue;
				return payload;
			}
			const result = def.innerType._zod.run(payload, ctx);
			if (result instanceof Promise) return result.then((result) => handleDefaultResult(result, def));
			return handleDefaultResult(result, def);
		};
	});
	function handleDefaultResult(payload, def) {
		if (payload.value === void 0) payload.value = def.defaultValue;
		return payload;
	}
	var $ZodPipe = /*@__PURE__*/ $constructor("$ZodPipe", (inst, def) => {
		$ZodType.init(inst, def);
		defineLazyInternal(inst, "values", (zod) => zod.def.in._zod.values);
		defineLazyInternal(inst, "optin", (zod) => zod.def.in._zod.optin);
		defineLazyInternal(inst, "optout", (zod) => zod.def.out._zod.optout);
		defineLazyInternal(inst, "propValues", (zod) => zod.def.in._zod.propValues);
		inst._zod.parse = (payload, ctx) => {
			if (ctx.direction === "backward") {
				const right = def.out._zod.run(payload, ctx);
				if (right instanceof Promise) return right.then((right) => handlePipeResult(right, def.in, ctx));
				return handlePipeResult(right, def.in, ctx);
			}
			const left = def.in._zod.run(payload, ctx);
			if (left instanceof Promise) return left.then((left) => handlePipeResult(left, def.out, ctx));
			return handlePipeResult(left, def.out, ctx);
		};
	});
	function handlePipeResult(left, next, ctx) {
		if (left.issues.some((iss) => iss.code !== "unrecognized_keys")) {
			left.aborted = true;
			return left;
		}
		return next._zod.run({
			value: left.value,
			issues: left.issues
		}, ctx);
	}
	var $ZodCodec = /*@__PURE__*/ $constructor("$ZodCodec", (inst, def) => {
		$ZodType.init(inst, def);
		defineLazyInternal(inst, "values", (zod) => zod.def.in._zod.values);
		defineLazyInternal(inst, "optin", (zod) => zod.def.in._zod.optin);
		defineLazyInternal(inst, "optout", (zod) => zod.def.out._zod.optout);
		defineLazyInternal(inst, "propValues", (zod) => zod.def.in._zod.propValues);
		inst._zod.parse = (payload, ctx) => {
			if ((ctx.direction || "forward") === "forward") {
				const left = def.in._zod.run(payload, ctx);
				if (left instanceof Promise) return left.then((left) => handleCodecAResult(left, def, ctx));
				return handleCodecAResult(left, def, ctx);
			} else {
				const right = def.out._zod.run(payload, ctx);
				if (right instanceof Promise) return right.then((right) => handleCodecAResult(right, def, ctx));
				return handleCodecAResult(right, def, ctx);
			}
		};
	});
	function handleCodecAResult(result, def, ctx) {
		if (result.issues.length) {
			result.aborted = true;
			return result;
		}
		if ((ctx.direction || "forward") === "forward") {
			const transformed = def.transform(result.value, result);
			if (transformed instanceof Promise) return transformed.then((value) => handleCodecTxResult(result, value, def.out, ctx));
			return handleCodecTxResult(result, transformed, def.out, ctx);
		} else {
			const transformed = def.reverseTransform(result.value, result);
			if (transformed instanceof Promise) return transformed.then((value) => handleCodecTxResult(result, value, def.in, ctx));
			return handleCodecTxResult(result, transformed, def.in, ctx);
		}
	}
	function handleCodecTxResult(left, value, nextSchema, ctx) {
		if (left.issues.length) {
			left.aborted = true;
			return left;
		}
		return nextSchema._zod.run({
			value,
			issues: left.issues
		}, ctx);
	}
	//#endregion
	//#region node_modules/zod/v4/core/api.js
	function snapshotChecks(def) {
		if (def.checks) def.checks = [...def.checks];
		return def;
	}
	// @__NO_SIDE_EFFECTS__
	function _string(Class, params) {
		return new Class(snapshotChecks({
			type: "string",
			...normalizeParams(params)
		}));
	}
	// @__NO_SIDE_EFFECTS__
	function _number(Class, params) {
		return new Class(snapshotChecks({
			type: "number",
			checks: [],
			...normalizeParams(params)
		}));
	}
	// @__NO_SIDE_EFFECTS__
	function _int(Class, params) {
		return new Class({
			type: "number",
			check: "number_format",
			abort: false,
			format: "safeint",
			...normalizeParams(params)
		});
	}
	// @__NO_SIDE_EFFECTS__
	function _boolean(Class, params) {
		return new Class({
			type: "boolean",
			...normalizeParams(params)
		});
	}
	// @__NO_SIDE_EFFECTS__
	function _any(Class) {
		return new Class({ type: "any" });
	}
	// @__NO_SIDE_EFFECTS__
	function _unknown(Class) {
		return new Class({ type: "unknown" });
	}
	// @__NO_SIDE_EFFECTS__
	function _gte(value, params) {
		return new $ZodCheckGreaterThan({
			check: "greater_than",
			...normalizeParams(params),
			value,
			inclusive: true
		});
	}
	// @__NO_SIDE_EFFECTS__
	function _nonnegative(params) {
		return /* @__PURE__ */ _gte(0, params);
	}
	// @__NO_SIDE_EFFECTS__
	function _stringbool(Classes, _params) {
		const params = normalizeParams(_params);
		let truthyArray = params.truthy ?? [
			"true",
			"1",
			"yes",
			"on",
			"y",
			"enabled"
		];
		let falsyArray = params.falsy ?? [
			"false",
			"0",
			"no",
			"off",
			"n",
			"disabled"
		];
		if (params.case !== "sensitive") {
			truthyArray = truthyArray.map((v) => typeof v === "string" ? v.toLowerCase() : v);
			falsyArray = falsyArray.map((v) => typeof v === "string" ? v.toLowerCase() : v);
		}
		const truthySet = new Set(truthyArray);
		const falsySet = new Set(falsyArray);
		const _Codec = Classes.Codec ?? $ZodCodec;
		const _Boolean = Classes.Boolean ?? $ZodBoolean;
		const codec = new _Codec({
			type: "pipe",
			in: new (Classes.String ?? $ZodString)({
				type: "string",
				error: params.error
			}),
			out: new _Boolean({
				type: "boolean",
				error: params.error
			}),
			transform: ((input, payload) => {
				let data = input;
				if (params.case !== "sensitive") data = data.toLowerCase();
				if (truthySet.has(data)) return true;
				else if (falsySet.has(data)) return false;
				else {
					payload.issues.push({
						code: "invalid_value",
						expected: "stringbool",
						values: [...truthySet, ...falsySet],
						input: payload.value,
						inst: codec,
						continue: false
					});
					return {};
				}
			}),
			reverseTransform: ((input, _payload) => {
				if (input === true) return truthyArray[0] || "true";
				else return falsyArray[0] || "false";
			}),
			error: params.error
		});
		codec._zod.bag.truthy = truthyArray;
		codec._zod.bag.falsy = falsyArray;
		codec._zod.bag.case = params.case ?? "insensitive";
		return codec;
	}
	//#endregion
	//#region node_modules/zod/v4/mini/schemas.js
	var ZodMiniType = /*@__PURE__*/ $constructor("ZodMiniType", (inst, def) => {
		if (!inst._zod) throw new Error("Uninitialized schema in ZodMiniType.");
		$ZodType.init(inst, def);
		inst.def = def;
		inst.type = def.type;
	}, {
		get with() {
			return this.check;
		},
		set with(value) {
			own(this, "with", value);
		},
		parse(data, params) {
			return parse(this, data, params, { callee: this.parse });
		},
		parseAsync(data, params) {
			return parseAsync(this, data, params, { callee: this.parseAsync });
		},
		safeParse(data, params) {
			return safeParse(this, data, params);
		},
		safeParseAsync(data, params) {
			return safeParseAsync(this, data, params);
		},
		check(...checks) {
			const def = this.def;
			return this.clone({
				...def,
				checks: [...def.checks ?? [], ...checks.map((ch) => typeof ch === "function" ? { _zod: {
					check: ch,
					def: { check: "custom" },
					onattach: []
				} } : ch)]
			}, { parent: true });
		},
		clone(_def, params) {
			return clone(this, _def, params);
		},
		brand() {
			return this;
		},
		register(reg, meta) {
			reg.add(this, meta);
			return this;
		},
		apply(fn, ...args) {
			return args.length === 0 ? fn(this) : fn(this, ...args);
		}
	});
	var ZodMiniString = /*@__PURE__*/ $constructor("ZodMiniString", (inst, def) => {
		$ZodString.init(inst, def);
		ZodMiniType.init(inst, def);
	});
	// @__NO_SIDE_EFFECTS__
	function string(params) {
		return /* @__PURE__ */ _string(ZodMiniString, params);
	}
	var ZodMiniNumber = /*@__PURE__*/ $constructor("ZodMiniNumber", (inst, def) => {
		$ZodNumber.init(inst, def);
		ZodMiniType.init(inst, def);
	});
	// @__NO_SIDE_EFFECTS__
	function number(params) {
		return /* @__PURE__ */ _number(ZodMiniNumber, params);
	}
	var ZodMiniNumberFormat = /*@__PURE__*/ $constructor("ZodMiniNumberFormat", (inst, def) => {
		$ZodNumberFormat.init(inst, def);
		ZodMiniNumber.init(inst, def);
	});
	function int(params) {
		return /* @__PURE__ */ _int(ZodMiniNumberFormat, params);
	}
	var ZodMiniBoolean = /*@__PURE__*/ $constructor("ZodMiniBoolean", (inst, def) => {
		$ZodBoolean.init(inst, def);
		ZodMiniType.init(inst, def);
	});
	// @__NO_SIDE_EFFECTS__
	function boolean(params) {
		return /* @__PURE__ */ _boolean(ZodMiniBoolean, params);
	}
	var ZodMiniAny = /*@__PURE__*/ $constructor("ZodMiniAny", (inst, def) => {
		$ZodAny.init(inst, def);
		ZodMiniType.init(inst, def);
	});
	// @__NO_SIDE_EFFECTS__
	function any() {
		return /* @__PURE__ */ _any(ZodMiniAny);
	}
	var ZodMiniUnknown = /*@__PURE__*/ $constructor("ZodMiniUnknown", (inst, def) => {
		$ZodUnknown.init(inst, def);
		ZodMiniType.init(inst, def);
	});
	// @__NO_SIDE_EFFECTS__
	function unknown() {
		return /* @__PURE__ */ _unknown(ZodMiniUnknown);
	}
	var ZodMiniArray = /*@__PURE__*/ $constructor("ZodMiniArray", (inst, def) => {
		$ZodArray.init(inst, def);
		ZodMiniType.init(inst, def);
	});
	// @__NO_SIDE_EFFECTS__
	function array(element, params) {
		return new ZodMiniArray({
			type: "array",
			element,
			...normalizeParams(params)
		});
	}
	var ZodMiniObject = /*@__PURE__*/ $constructor("ZodMiniObject", (inst, def) => {
		$ZodObject.init(inst, def);
		ZodMiniType.init(inst, def);
		installLazyProp(inst, "shape", (self) => self._zod.def.shape, false);
	});
	// @__NO_SIDE_EFFECTS__
	function object(shape, params) {
		return new ZodMiniObject({
			type: "object",
			shape: shape ?? {},
			...normalizeParams(params)
		});
	}
	// @__NO_SIDE_EFFECTS__
	function looseObject(shape, params) {
		return new ZodMiniObject({
			type: "object",
			shape,
			catchall: /* @__PURE__ */ unknown(),
			...normalizeParams(params)
		});
	}
	var ZodMiniUnion = /*@__PURE__*/ $constructor("ZodMiniUnion", (inst, def) => {
		$ZodUnion.init(inst, def);
		ZodMiniType.init(inst, def);
	});
	// @__NO_SIDE_EFFECTS__
	function union(options, params) {
		return new ZodMiniUnion({
			type: "union",
			options,
			...normalizeParams(params)
		});
	}
	var ZodMiniRecord = /*@__PURE__*/ $constructor("ZodMiniRecord", (inst, def) => {
		$ZodRecord.init(inst, def);
		ZodMiniType.init(inst, def);
	});
	// @__NO_SIDE_EFFECTS__
	function record(keyType, valueType, params) {
		if (!valueType || !valueType._zod) return new ZodMiniRecord({
			type: "record",
			keyType: /* @__PURE__ */ string(),
			valueType: keyType,
			...normalizeParams(valueType)
		});
		return new ZodMiniRecord({
			type: "record",
			keyType,
			valueType,
			...normalizeParams(params)
		});
	}
	var ZodMiniLiteral = /*@__PURE__*/ $constructor("ZodMiniLiteral", (inst, def) => {
		$ZodLiteral.init(inst, def);
		ZodMiniType.init(inst, def);
	});
	// @__NO_SIDE_EFFECTS__
	function literal(value, params) {
		return new ZodMiniLiteral({
			type: "literal",
			values: Array.isArray(value) ? value : [value],
			...normalizeParams(params)
		});
	}
	var ZodMiniTransform = /*@__PURE__*/ $constructor("ZodMiniTransform", (inst, def) => {
		$ZodTransform.init(inst, def);
		ZodMiniType.init(inst, def);
	});
	// @__NO_SIDE_EFFECTS__
	function transform(fn) {
		return new ZodMiniTransform({
			type: "transform",
			transform: fn
		});
	}
	var ZodMiniOptional = /*@__PURE__*/ $constructor("ZodMiniOptional", (inst, def) => {
		$ZodOptional.init(inst, def);
		ZodMiniType.init(inst, def);
	});
	// @__NO_SIDE_EFFECTS__
	function optional(innerType) {
		return new ZodMiniOptional({
			type: "optional",
			innerType
		});
	}
	var ZodMiniNullable = /*@__PURE__*/ $constructor("ZodMiniNullable", (inst, def) => {
		$ZodNullable.init(inst, def);
		ZodMiniType.init(inst, def);
	});
	// @__NO_SIDE_EFFECTS__
	function nullable(innerType) {
		return new ZodMiniNullable({
			type: "nullable",
			innerType
		});
	}
	// @__NO_SIDE_EFFECTS__
	function nullish(innerType) {
		return /* @__PURE__ */ optional(/* @__PURE__ */ nullable(innerType));
	}
	var ZodMiniDefault = /*@__PURE__*/ $constructor("ZodMiniDefault", (inst, def) => {
		$ZodDefault.init(inst, def);
		ZodMiniType.init(inst, def);
	});
	// @__NO_SIDE_EFFECTS__
	function _default(innerType, defaultValue) {
		return new ZodMiniDefault({
			type: "default",
			innerType,
			get defaultValue() {
				return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
			}
		});
	}
	var ZodMiniPipe = /*@__PURE__*/ $constructor("ZodMiniPipe", (inst, def) => {
		$ZodPipe.init(inst, def);
		ZodMiniType.init(inst, def);
	});
	// @__NO_SIDE_EFFECTS__
	function pipe(in_, out) {
		return new ZodMiniPipe({
			type: "pipe",
			in: in_,
			out
		});
	}
	var ZodMiniCodec = /*@__PURE__*/ $constructor("ZodMiniCodec", (inst, def) => {
		ZodMiniPipe.init(inst, def);
		$ZodCodec.init(inst, def);
	});
	var stringbool = (...args) => /* @__PURE__ */ _stringbool({
		Codec: ZodMiniCodec,
		Boolean: ZodMiniBoolean,
		String: ZodMiniString
	}, ...args);
	//#endregion
	//#region node_modules/color2k/dist/index.exports.import.es.mjs
	function guard(low, high, value) {
		return Math.min(Math.max(low, value), high);
	}
	var ColorError = class extends Error {
		constructor(color) {
			super(`Failed to parse color: "${color}"`);
		}
	};
	function parseToRgba(color) {
		if (typeof color !== "string") throw new ColorError(color);
		if (color.trim().toLowerCase() === "transparent") return [
			0,
			0,
			0,
			0
		];
		let normalizedColor = color.trim();
		normalizedColor = namedColorRegex.test(color) ? nameToHex(color) : color;
		const reducedHexMatch = reducedHexRegex.exec(normalizedColor);
		if (reducedHexMatch) {
			const arr = Array.from(reducedHexMatch).slice(1);
			return [...arr.slice(0, 3).map((x) => parseInt(r(x, 2), 16)), parseInt(r(arr[3] || "f", 2), 16) / 255];
		}
		const hexMatch = hexRegex.exec(normalizedColor);
		if (hexMatch) {
			const arr = Array.from(hexMatch).slice(1);
			return [...arr.slice(0, 3).map((x) => parseInt(x, 16)), parseInt(arr[3] || "ff", 16) / 255];
		}
		const rgbaMatch = rgbaRegex.exec(normalizedColor);
		if (rgbaMatch) {
			const arr = Array.from(rgbaMatch).slice(1);
			return [...arr.slice(0, 3).map((x) => parseInt(x, 10)), parseFloat(arr[3] || "1")];
		}
		const hslaMatch = hslaRegex.exec(normalizedColor);
		if (hslaMatch) {
			const [h, s, l, a] = Array.from(hslaMatch).slice(1).map(parseFloat);
			if (guard(0, 100, s) !== s) throw new ColorError(color);
			if (guard(0, 100, l) !== l) throw new ColorError(color);
			return [...hslToRgb(h, s, l), Number.isNaN(a) ? 1 : a];
		}
		throw new ColorError(color);
	}
	function hash$1(str) {
		let hash = 5381;
		let i = str.length;
		while (i) hash = hash * 33 ^ str.charCodeAt(--i);
		return (hash >>> 0) % 2341;
	}
	var colorToInt = (x) => parseInt(x.replace(/_/g, ""), 36);
	var compressedColorMap = "1q29ehhb 1n09sgk7 1kl1ekf_ _yl4zsno 16z9eiv3 1p29lhp8 _bd9zg04 17u0____ _iw9zhe5 _to73___ _r45e31e _7l6g016 _jh8ouiv _zn3qba8 1jy4zshs 11u87k0u 1ro9yvyo 1aj3xael 1gz9zjz0 _3w8l4xo 1bf1ekf_ _ke3v___ _4rrkb__ 13j776yz _646mbhl _nrjr4__ _le6mbhl 1n37ehkb _m75f91n _qj3bzfz 1939yygw 11i5z6x8 _1k5f8xs 1509441m 15t5lwgf _ae2th1n _tg1ugcv 1lp1ugcv 16e14up_ _h55rw7n _ny9yavn _7a11xb_ 1ih442g9 _pv442g9 1mv16xof 14e6y7tu 1oo9zkds 17d1cisi _4v9y70f _y98m8kc 1019pq0v 12o9zda8 _348j4f4 1et50i2o _8epa8__ _ts6senj 1o350i2o 1mi9eiuo 1259yrp0 1ln80gnw _632xcoy 1cn9zldc _f29edu4 1n490c8q _9f9ziet 1b94vk74 _m49zkct 1kz6s73a 1eu9dtog _q58s1rz 1dy9sjiq __u89jo3 _aj5nkwg _ld89jo3 13h9z6wx _qa9z2ii _l119xgq _bs5arju 1hj4nwk9 1qt4nwk9 1ge6wau6 14j9zlcw 11p1edc_ _ms1zcxe _439shk6 _jt9y70f _754zsow 1la40eju _oq5p___ _x279qkz 1fa5r3rv _yd2d9ip _424tcku _8y1di2_ _zi2uabw _yy7rn9h 12yz980_ __39ljp6 1b59zg0x _n39zfzp 1fy9zest _b33k___ _hp9wq92 1il50hz4 _io472ub _lj9z3eo 19z9ykg0 _8t8iu3a 12b9bl4a 1ak5yw0o _896v4ku _tb8k8lv _s59zi6t _c09ze0p 1lg80oqn 1id9z8wb _238nba5 1kq6wgdi _154zssg _tn3zk49 _da9y6tc 1sg7cv4f _r12jvtt 1gq5fmkz 1cs9rvci _lp9jn1c _xw1tdnb 13f9zje6 16f6973h _vo7ir40 _bt5arjf _rc45e4t _hr4e100 10v4e100 _hc9zke2 _w91egv_ _sj2r1kk 13c87yx8 _vqpds__ _ni8ggk8 _tj9yqfb 1ia2j4r4 _7x9b10u 1fc9ld4j 1eq9zldr _5j9lhpx _ez9zl6o _md61fzm".split(" ").reduce((acc, next) => {
		const key = colorToInt(next.substring(0, 3));
		const hex = colorToInt(next.substring(3)).toString(16);
		let prefix = "";
		for (let i = 0; i < 6 - hex.length; i++) prefix += "0";
		acc[key] = `${prefix}${hex}`;
		return acc;
	}, {});
	function nameToHex(color) {
		const result = compressedColorMap[hash$1(color.toLowerCase().trim())];
		if (!result) throw new ColorError(color);
		return `#${result}`;
	}
	var r = (str, amount) => Array.from(Array(amount)).map(() => str).join("");
	var reducedHexRegex = new RegExp(`^#${r("([a-f0-9])", 3)}([a-f0-9])?$`, "i");
	var hexRegex = new RegExp(`^#${r("([a-f0-9]{2})", 3)}([a-f0-9]{2})?$`, "i");
	var rgbaRegex = new RegExp(`^rgba?\\(\\s*(\\d+)\\s*${r(",\\s*(\\d+)\\s*", 2)}(?:,\\s*([\\d.]+))?\\s*\\)$`, "i");
	var hslaRegex = /^hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%(?:\s*,\s*([\d.]+))?\s*\)$/i;
	var namedColorRegex = /^[a-z]+$/i;
	var roundColor = (color) => {
		return Math.round(color * 255);
	};
	var hslToRgb = (hue, saturation, lightness) => {
		let l = lightness / 100;
		if (saturation === 0) return [
			l,
			l,
			l
		].map(roundColor);
		const huePrime = (hue % 360 + 360) % 360 / 60;
		const chroma = (1 - Math.abs(2 * l - 1)) * (saturation / 100);
		const secondComponent = chroma * (1 - Math.abs(huePrime % 2 - 1));
		let red = 0;
		let green = 0;
		let blue = 0;
		if (huePrime >= 0 && huePrime < 1) {
			red = chroma;
			green = secondComponent;
		} else if (huePrime >= 1 && huePrime < 2) {
			red = secondComponent;
			green = chroma;
		} else if (huePrime >= 2 && huePrime < 3) {
			green = chroma;
			blue = secondComponent;
		} else if (huePrime >= 3 && huePrime < 4) {
			green = secondComponent;
			blue = chroma;
		} else if (huePrime >= 4 && huePrime < 5) {
			red = secondComponent;
			blue = chroma;
		} else if (huePrime >= 5 && huePrime < 6) {
			red = chroma;
			blue = secondComponent;
		}
		const lightnessModification = l - chroma / 2;
		return [
			red + lightnessModification,
			green + lightnessModification,
			blue + lightnessModification
		].map(roundColor);
	};
	function parseToHsla(color) {
		const [red, green, blue, alpha] = parseToRgba(color).map((value, index) => index === 3 ? value : value / 255);
		const max = Math.max(red, green, blue);
		const min = Math.min(red, green, blue);
		const lightness = (max + min) / 2;
		if (max === min) return [
			0,
			0,
			lightness,
			alpha
		];
		const delta = max - min;
		const saturation = lightness > .5 ? delta / (2 - max - min) : delta / (max + min);
		return [
			60 * (red === max ? (green - blue) / delta + (green < blue ? 6 : 0) : green === max ? (blue - red) / delta + 2 : (red - green) / delta + 4),
			saturation,
			lightness,
			alpha
		];
	}
	function hsla(hue, saturation, lightness, alpha) {
		return `hsla(${(hue % 360).toFixed()}, ${guard(0, 100, saturation * 100).toFixed()}%, ${guard(0, 100, lightness * 100).toFixed()}%, ${parseFloat(guard(0, 1, alpha).toFixed(3))})`;
	}
	function darken(color, amount) {
		const [hue, saturation, lightness, alpha] = parseToHsla(color);
		return hsla(hue, saturation, lightness - amount, alpha);
	}
	function getLuminance(color) {
		if (color === "transparent") return 0;
		function f(x) {
			const channel = x / 255;
			return channel <= .04045 ? channel / 12.92 : Math.pow((channel + .055) / 1.055, 2.4);
		}
		const [r, g, b] = parseToRgba(color);
		return .2126 * f(r) + .7152 * f(g) + .0722 * f(b);
	}
	function getContrast(color1, color2) {
		const luminance1 = getLuminance(color1);
		const luminance2 = getLuminance(color2);
		return luminance1 > luminance2 ? (luminance1 + .05) / (luminance2 + .05) : (luminance2 + .05) / (luminance1 + .05);
	}
	var guidelines = {
		decorative: 1.5,
		readable: 3,
		aa: 4.5,
		aaa: 7
	};
	function hasBadContrast(color, standard = "aa", background = "#fff") {
		return getContrast(color, background) < guidelines[standard];
	}
	function lighten(color, amount) {
		return darken(color, -amount);
	}
	//#endregion
	//#region src/features/name-color.ts
	var nameColor = {
		setNameColor(name) {
			if (name.dataset["color"] != null) {
				let color = name.dataset["color"];
				let count = 0;
				while (hasBadContrast(color, "readable", "black")) {
					color = lighten(color, .1);
					count++;
					if (count >= 5) break;
				}
				name.style.color = color;
			}
		},
		async load(api) {
			api.forClass("name", HTMLElement, this.setNameColor.bind(this));
		}
	};
	//#endregion
	//#region node_modules/@twemoji/api/dist/twemoji.esm.js
	/*! Copyright Twitter Inc. and other contributors. Licensed under MIT */
	var twemoji$1 = function() {
		"use strict";
		var twemoji = {
			base: "https://cdn.jsdelivr.net/gh/jdecked/twemoji@17.0.3/assets/",
			ext: ".png",
			size: "72x72",
			className: "emoji",
			convert: {
				fromCodePoint,
				toCodePoint
			},
			onerror: function onerror() {
				if (this.parentNode) this.parentNode.replaceChild(createText(this.alt, false), this);
			},
			parse,
			replace,
			test
		}, escaper = {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			"'": "&#39;",
			"\"": "&quot;"
		}, re = /(?:\ud83d\udc68\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83e\uddd1\ud83c[\udffc-\udfff]|\ud83e\uddd1\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83e\uddd1\ud83c[\udffb\udffd-\udfff]|\ud83e\uddd1\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83e\uddd1\ud83c[\udffb\udffc\udffe\udfff]|\ud83e\uddd1\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83e\uddd1\ud83c[\udffb-\udffd\udfff]|\ud83e\uddd1\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83e\uddd1\ud83c[\udffb-\udffe]|\ud83d\udc68\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffb\u200d\ud83d\udc30\u200d\ud83d\udc68\ud83c[\udffc-\udfff]|\ud83d\udc68\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffc-\udfff]|\ud83d\udc68\ud83c\udffb\u200d\ud83e\udeef\u200d\ud83d\udc68\ud83c[\udffc-\udfff]|\ud83d\udc68\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffc\u200d\ud83d\udc30\u200d\ud83d\udc68\ud83c[\udffb\udffd-\udfff]|\ud83d\udc68\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffd-\udfff]|\ud83d\udc68\ud83c\udffc\u200d\ud83e\udeef\u200d\ud83d\udc68\ud83c[\udffb\udffd-\udfff]|\ud83d\udc68\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffd\u200d\ud83d\udc30\u200d\ud83d\udc68\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc68\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc68\ud83c\udffd\u200d\ud83e\udeef\u200d\ud83d\udc68\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc68\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffe\u200d\ud83d\udc30\u200d\ud83d\udc68\ud83c[\udffb-\udffd\udfff]|\ud83d\udc68\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffd\udfff]|\ud83d\udc68\ud83c\udffe\u200d\ud83e\udeef\u200d\ud83d\udc68\ud83c[\udffb-\udffd\udfff]|\ud83d\udc68\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udfff\u200d\ud83d\udc30\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc68\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc68\ud83c\udfff\u200d\ud83e\udeef\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\ud83d\udc30\u200d\ud83d\udc69\ud83c[\udffc-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffc-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffc-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\ud83e\udeef\u200d\ud83d\udc69\ud83c[\udffc-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83d\udc30\u200d\ud83d\udc69\ud83c[\udffb\udffd-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffd-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb\udffd-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83e\udeef\u200d\ud83d\udc69\ud83c[\udffb\udffd-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\ud83d\udc30\u200d\ud83d\udc69\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc69\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc69\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc69\ud83c\udffd\u200d\ud83e\udeef\u200d\ud83d\udc69\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc69\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffe\u200d\ud83d\udc30\u200d\ud83d\udc69\ud83c[\udffb-\udffd\udfff]|\ud83d\udc69\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffd\udfff]|\ud83d\udc69\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb-\udffd\udfff]|\ud83d\udc69\ud83c\udffe\u200d\ud83e\udeef\u200d\ud83d\udc69\ud83c[\udffb-\udffd\udfff]|\ud83d\udc69\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udfff\u200d\ud83d\udc30\u200d\ud83d\udc69\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udfff\u200d\ud83e\udeef\u200d\ud83d\udc69\ud83c[\udffb-\udffe]|\ud83e\uddd1\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83e\uddd1\ud83c[\udffc-\udfff]|\ud83e\uddd1\ud83c\udffb\u200d\ud83d\udc30\u200d\ud83e\uddd1\ud83c[\udffc-\udfff]|\ud83e\uddd1\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffb\u200d\ud83e\udeef\u200d\ud83e\uddd1\ud83c[\udffc-\udfff]|\ud83e\uddd1\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83e\uddd1\ud83c[\udffb\udffd-\udfff]|\ud83e\uddd1\ud83c\udffc\u200d\ud83d\udc30\u200d\ud83e\uddd1\ud83c[\udffb\udffd-\udfff]|\ud83e\uddd1\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffc\u200d\ud83e\udeef\u200d\ud83e\uddd1\ud83c[\udffb\udffd-\udfff]|\ud83e\uddd1\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83e\uddd1\ud83c[\udffb\udffc\udffe\udfff]|\ud83e\uddd1\ud83c\udffd\u200d\ud83d\udc30\u200d\ud83e\uddd1\ud83c[\udffb\udffc\udffe\udfff]|\ud83e\uddd1\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffd\u200d\ud83e\udeef\u200d\ud83e\uddd1\ud83c[\udffb\udffc\udffe\udfff]|\ud83e\uddd1\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83e\uddd1\ud83c[\udffb-\udffd\udfff]|\ud83e\uddd1\ud83c\udffe\u200d\ud83d\udc30\u200d\ud83e\uddd1\ud83c[\udffb-\udffd\udfff]|\ud83e\uddd1\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffe\u200d\ud83e\udeef\u200d\ud83e\uddd1\ud83c[\udffb-\udffd\udfff]|\ud83e\uddd1\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83e\uddd1\ud83c[\udffb-\udffe]|\ud83e\uddd1\ud83c\udfff\u200d\ud83d\udc30\u200d\ud83e\uddd1\ud83c[\udffb-\udffe]|\ud83e\uddd1\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udfff\u200d\ud83e\udeef\u200d\ud83e\uddd1\ud83c[\udffb-\udffe]|\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d[\udc68\udc69]|\ud83e\udef1\ud83c\udffb\u200d\ud83e\udef2\ud83c[\udffc-\udfff]|\ud83e\udef1\ud83c\udffc\u200d\ud83e\udef2\ud83c[\udffb\udffd-\udfff]|\ud83e\udef1\ud83c\udffd\u200d\ud83e\udef2\ud83c[\udffb\udffc\udffe\udfff]|\ud83e\udef1\ud83c\udffe\u200d\ud83e\udef2\ud83c[\udffb-\udffd\udfff]|\ud83e\udef1\ud83c\udfff\u200d\ud83e\udef2\ud83c[\udffb-\udffe]|\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc68|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d[\udc68\udc69]|\ud83e\uddd1\u200d\ud83e\udd1d\u200d\ud83e\uddd1|\ud83d\udc6f\ud83c\udffb\u200d\u2640\ufe0f|\ud83d\udc6f\ud83c\udffb\u200d\u2642\ufe0f|\ud83d\udc6f\ud83c\udffc\u200d\u2640\ufe0f|\ud83d\udc6f\ud83c\udffc\u200d\u2642\ufe0f|\ud83d\udc6f\ud83c\udffd\u200d\u2640\ufe0f|\ud83d\udc6f\ud83c\udffd\u200d\u2642\ufe0f|\ud83d\udc6f\ud83c\udffe\u200d\u2640\ufe0f|\ud83d\udc6f\ud83c\udffe\u200d\u2642\ufe0f|\ud83d\udc6f\ud83c\udfff\u200d\u2640\ufe0f|\ud83d\udc6f\ud83c\udfff\u200d\u2642\ufe0f|\ud83e\udd3c\ud83c\udffb\u200d\u2640\ufe0f|\ud83e\udd3c\ud83c\udffb\u200d\u2642\ufe0f|\ud83e\udd3c\ud83c\udffc\u200d\u2640\ufe0f|\ud83e\udd3c\ud83c\udffc\u200d\u2642\ufe0f|\ud83e\udd3c\ud83c\udffd\u200d\u2640\ufe0f|\ud83e\udd3c\ud83c\udffd\u200d\u2642\ufe0f|\ud83e\udd3c\ud83c\udffe\u200d\u2640\ufe0f|\ud83e\udd3c\ud83c\udffe\u200d\u2642\ufe0f|\ud83e\udd3c\ud83c\udfff\u200d\u2640\ufe0f|\ud83e\udd3c\ud83c\udfff\u200d\u2642\ufe0f|\ud83d\udc6f\u200d\u2640\ufe0f|\ud83d\udc6f\u200d\u2642\ufe0f|\ud83e\udd3c\u200d\u2640\ufe0f|\ud83e\udd3c\u200d\u2642\ufe0f|\ud83d\udc6b\ud83c[\udffb-\udfff]|\ud83d\udc6c\ud83c[\udffb-\udfff]|\ud83d\udc6d\ud83c[\udffb-\udfff]|\ud83d\udc6f\ud83c[\udffb-\udfff]|\ud83d\udc8f\ud83c[\udffb-\udfff]|\ud83d\udc91\ud83c[\udffb-\udfff]|\ud83e\udd1d\ud83c[\udffb-\udfff]|\ud83e\udd3c\ud83c[\udffb-\udfff]|\ud83d[\udc6b-\udc6d\udc6f\udc8f\udc91]|\ud83e[\udd1d\udd3c])|(?:\ud83d[\udc68\udc69]|\ud83e\uddd1)(?:\ud83c[\udffb-\udfff])?\u200d(?:\u2695\ufe0f|\u2696\ufe0f|\u2708\ufe0f|\ud83c[\udf3e\udf73\udf7c\udf84\udf93\udfa4\udfa8\udfeb\udfed]|\ud83d[\udcbb\udcbc\udd27\udd2c\ude80\ude92]|\ud83e[\uddaf-\uddb3\uddbc\uddbd\ude70])(?:\u200d\u27a1\ufe0f)?|(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75]|\u26f9)((?:\ud83c[\udffb-\udfff]|\ufe0f)\u200d[\u2640\u2642]\ufe0f(?:\u200d\u27a1\ufe0f)?)|(?:\ud83c[\udfc3\udfc4\udfca]|\ud83d[\udc6e\udc70\udc71\udc73\udc77\udc81\udc82\udc86\udc87\ude45-\ude47\ude4b\ude4d\ude4e\udea3\udeb4-\udeb6]|\ud83e[\udd26\udd35\udd37-\udd39\udd3d\udd3e\uddb8\uddb9\uddcd-\uddcf\uddd4\uddd6-\udddd])(?:\ud83c[\udffb-\udfff])?\u200d[\u2640\u2642]\ufe0f(?:\u200d\u27a1\ufe0f)?|(?:\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83e\uddd1\u200d\ud83e\uddd1\u200d\ud83e\uddd2\u200d\ud83e\uddd2|\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83e\uddd1\u200d\ud83e\uddd1\u200d\ud83e\uddd2|\ud83e\uddd1\u200d\ud83e\uddd2\u200d\ud83e\uddd2|\ud83d\udc41\ufe0f\u200d\ud83d\udde8\ufe0f|\ud83c\udff3\ufe0f\u200d\u26a7\ufe0f|\ud83c\udff3\ufe0f\u200d\ud83c\udf08|\ud83d\ude36\u200d\ud83c\udf2b\ufe0f|\u26d3\ufe0f\u200d\ud83d\udca5|\u2764\ufe0f\u200d\ud83d\udd25|\u2764\ufe0f\u200d\ud83e\ude79|\ud83c\udf44\u200d\ud83d\udfeb|\ud83c\udf4b\u200d\ud83d\udfe9|\ud83c\udff4\u200d\u2620\ufe0f|\ud83d\udc15\u200d\ud83e\uddba|\ud83d\udc26\u200d\ud83d\udd25|\ud83d\udc3b\u200d\u2744\ufe0f|\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\ude2e\u200d\ud83d\udca8|\ud83d\ude35\u200d\ud83d\udcab|\ud83d\ude42\u200d\u2194\ufe0f|\ud83d\ude42\u200d\u2195\ufe0f|\ud83e\uddd1\u200d\ud83e\uddd2|\ud83e\uddde\u200d\u2640\ufe0f|\ud83e\uddde\u200d\u2642\ufe0f|\ud83e\udddf\u200d\u2640\ufe0f|\ud83e\udddf\u200d\u2642\ufe0f|\ud83d\udc08\u200d\u2b1b|\ud83d\udc26\u200d\u2b1b)|[#*0-9]\ufe0f?\u20e3|(?:(?:\ud83c[\udd70\udd71\udd7e\udd7f\ude02\ude37\udf21\udf24-\udf2c\udf36\udf7d\udf96\udf97\udf99-\udf9b\udf9e\udf9f\udfcd\udfce\udfd4-\udfdf\udff3\udff5\udff7]|\ud83d[\udc3f\udc41\udcfd\udd49\udd4a\udd6f\udd70\udd73\udd76-\udd79\udd87\udd8a-\udd8d\udda5\udda8\uddb1\uddb2\uddbc\uddc2-\uddc4\uddd1-\uddd3\udddc-\uddde\udde1\udde3\udde8\uddef\uddf3\uddfa\udecb\udecd-\udecf\udee0-\udee5\udee9\udef0\udef3]|[©®\u203c\u2049\u2122\u2139\u2194-\u2199\u21a9\u21aa\u2328\u23cf\u23ed-\u23ef\u23f1\u23f2\u23f8-\u23fa\u24c2\u25aa\u25ab\u25b6\u25c0\u25fb\u25fc\u2600-\u2604\u260e\u2611\u2618\u2620\u2622\u2623\u2626\u262a\u262e\u262f\u2638-\u263a\u2640\u2642\u265f\u2660\u2663\u2665\u2666\u2668\u267b\u267e\u2692\u2694-\u2697\u2699\u269b\u269c\u26a0\u26a7\u26b0\u26b1\u26c8\u26cf\u26d1\u26d3\u26e9\u26f0\u26f1\u26f4\u26f8\u2702\u2708\u2709\u270f\u2712\u2714\u2716\u271d\u2721\u2733\u2734\u2744\u2747\u2763\u27a1\u2934\u2935\u2b05-\u2b07\u3030\u303d\u3297\u3299])\ufe0f)|(?:\ud83c[\udc04\ude1a\ude2f]|[\u231a\u231b\u25fd\u25fe\u2614\u2615\u2648-\u2653\u267f\u2693\u26a1\u26aa\u26ab\u26bd\u26be\u26c4\u26c5\u26d4\u26ea\u26f2\u26f3\u26f5\u26fa\u26fd\u2757\u2764\u2b1b\u2b1c\u2b50\u2b55])(?:\ufe0f|(?!\ufe0e))|(?:(?:\ud83e\udef0)(?:\ufe0f|(?!\ufe0e))|(?:\ud83c\udfc3|\ud83d\udeb6|\ud83e\uddce)(?:\ud83c[\udffb-\udfff])?(?:\u200d\u27a1\ufe0f)?|(?:\ud83c[\udf85\udfc2\udfc4\udfc7\udfca]|\ud83d[\udc42\udc43\udc46-\udc50\udc66-\udc69\udc6e\udc70-\udc78\udc7c\udc81-\udc83\udc85-\udc87\udcaa\udd7a\udd95\udd96\ude45-\ude47\ude4b-\ude4f\udea3\udeb4\udeb5\udec0\udecc]|\ud83e[\udd0c\udd0f\udd18-\udd1c\udd1e\udd1f\udd26\udd30-\udd39\udd3d\udd3e\udd77\uddb5\uddb6\uddb8\uddb9\uddbb\uddcd\uddcf\uddd1-\udddd\udec3-\udec5\udef1-\udef8]|[\u270a\u270b]))(?:\ud83c[\udffb-\udfff])?|(?:\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc73\udb40\udc63\udb40\udc74\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc77\udb40\udc6c\udb40\udc73\udb40\udc7f|\ud83c\udde6\ud83c[\udde8-\uddec\uddee\uddf1\uddf2\uddf4\uddf6-\uddfa\uddfc\uddfd\uddff]|\ud83c\udde7\ud83c[\udde6\udde7\udde9-\uddef\uddf1-\uddf4\uddf6-\uddf9\uddfb\uddfc\uddfe\uddff]|\ud83c\udde8\ud83c[\udde6\udde8\udde9\uddeb-\uddee\uddf0-\uddf7\uddfa-\uddff]|\ud83c\udde9\ud83c[\uddea\uddec\uddef\uddf0\uddf2\uddf4\uddff]|\ud83c\uddea\ud83c[\udde6\udde8\uddea\uddec\udded\uddf7-\uddfa]|\ud83c\uddeb\ud83c[\uddee-\uddf0\uddf2\uddf4\uddf7]|\ud83c\uddec\ud83c[\udde6\udde7\udde9-\uddee\uddf1-\uddf3\uddf5-\uddfa\uddfc\uddfe]|\ud83c\udded\ud83c[\uddf0\uddf2\uddf3\uddf7\uddf9\uddfa]|\ud83c\uddee\ud83c[\udde8-\uddea\uddf1-\uddf4\uddf6-\uddf9]|\ud83c\uddef\ud83c[\uddea\uddf2\uddf4\uddf5]|\ud83c\uddf0\ud83c[\uddea\uddec-\uddee\uddf2\uddf3\uddf5\uddf7\uddfc\uddfe\uddff]|\ud83c\uddf1\ud83c[\udde6-\udde8\uddee\uddf0\uddf7-\uddfb\uddfe]|\ud83c\uddf2\ud83c[\udde6\udde8-\udded\uddf0-\uddff]|\ud83c\uddf3\ud83c[\udde6\udde8\uddea-\uddec\uddee\uddf1\uddf4\uddf5\uddf7\uddfa\uddff]|\ud83c\uddf4\ud83c\uddf2|\ud83c\uddf5\ud83c[\udde6\uddea-\udded\uddf0-\uddf3\uddf7-\uddf9\uddfc\uddfe]|\ud83c\uddf6\ud83c\udde6|\ud83c\uddf7\ud83c[\uddea\uddf4\uddf8\uddfa\uddfc]|\ud83c\uddf8\ud83c[\udde6-\uddea\uddec-\uddf4\uddf7-\uddf9\uddfb\uddfd-\uddff]|\ud83c\uddf9\ud83c[\udde6\udde8\udde9\uddeb-\udded\uddef-\uddf4\uddf7\uddf9\uddfb\uddfc\uddff]|\ud83c\uddfa\ud83c[\udde6\uddec\uddf2\uddf3\uddf8\uddfe\uddff]|\ud83c\uddfb\ud83c[\udde6\udde8\uddea\uddec\uddee\uddf3\uddfa]|\ud83c\uddfc\ud83c[\uddeb\uddf8]|\ud83c\uddfd\ud83c\uddf0|\ud83c\uddfe\ud83c[\uddea\uddf9]|\ud83c\uddff\ud83c[\udde6\uddf2\uddfc]|\ud83c[\udccf\udd8e\udd91-\udd9a\udde6-\uddff\ude01\ude32-\ude36\ude38-\ude3a\ude50\ude51\udf00-\udf20\udf2d-\udf35\udf37-\udf7c\udf7e-\udf84\udf86-\udf93\udfa0-\udfc1\udfc5\udfc6\udfc8\udfc9\udfcf-\udfd3\udfe0-\udff0\udff4\udff8-\udfff]|\ud83d[\udc00-\udc3e\udc40\udc44\udc45\udc51-\udc65\udc6a\udc79-\udc7b\udc7d-\udc80\udc84\udc88-\udc8e\udc90\udc92-\udca9\udcab-\udcfc\udcff-\udd3d\udd4b-\udd4e\udd50-\udd67\udda4\uddfb-\ude44\ude48-\ude4a\ude80-\udea2\udea4-\udeb3\udeb7-\udebf\udec1-\udec5\uded0-\uded2\uded5-\uded8\udedc-\udedf\udeeb\udeec\udef4-\udefc\udfe0-\udfeb\udff0]|\ud83e[\udd0d\udd0e\udd10-\udd17\udd20-\udd25\udd27-\udd2f\udd3a\udd3f-\udd45\udd47-\udd76\udd78-\uddb4\uddb7\uddba\uddbc-\uddcc\uddd0\uddde-\uddff\ude70-\ude7c\ude80-\ude8a\ude8e-\udec2\udec6\udec8\udecd-\udedc\udedf-\udeea\udeef]|[\u23e9-\u23ec\u23f0\u23f3\u26ce\u2705\u2728\u274c\u274e\u2753-\u2755\u2795-\u2797\u27b0\u27bf\ue50a])|\ufe0f/g, UFE0Fg = /\uFE0F/g, U200D = String.fromCharCode(8205), rescaper = /[&<>'"]/g, shouldntBeParsed = /^(?:iframe|noframes|noscript|script|select|style|textarea)$/, fromCharCode = String.fromCharCode;
		return twemoji;
		function createText(text, clean) {
			return document.createTextNode(clean ? text.replace(UFE0Fg, "") : text);
		}
		function escapeHTML(s) {
			return s.replace(rescaper, replacer);
		}
		function defaultImageSrcGenerator(icon, options) {
			return "".concat(options.base, options.size, "/", icon, options.ext);
		}
		function grabAllTextNodes(node, allText) {
			var childNodes = node.childNodes, length = childNodes.length, subnode, nodeType;
			while (length--) {
				subnode = childNodes[length];
				nodeType = subnode.nodeType;
				if (nodeType === 3) allText.push(subnode);
				else if (nodeType === 1 && !("ownerSVGElement" in subnode) && !shouldntBeParsed.test(subnode.nodeName.toLowerCase())) grabAllTextNodes(subnode, allText);
			}
			return allText;
		}
		function grabTheRightIcon(rawText) {
			return toCodePoint(rawText.indexOf(U200D) < 0 ? rawText.replace(UFE0Fg, "") : rawText);
		}
		function parseNode(node, options) {
			var allText = grabAllTextNodes(node, []), length = allText.length, attrib, attrname, modified, fragment, subnode, text, match, i, index, img, rawText, iconId, src;
			while (length--) {
				modified = false;
				fragment = document.createDocumentFragment();
				subnode = allText[length];
				text = subnode.nodeValue;
				i = 0;
				while (match = re.exec(text)) {
					index = match.index;
					if (index !== i) fragment.appendChild(createText(text.slice(i, index), true));
					rawText = match[0];
					iconId = grabTheRightIcon(rawText);
					i = index + rawText.length;
					src = options.callback(iconId, options);
					if (iconId && src) {
						img = new Image();
						img.onerror = options.onerror;
						img.setAttribute("draggable", "false");
						attrib = options.attributes(rawText, iconId);
						for (attrname in attrib) if (attrib.hasOwnProperty(attrname) && attrname.indexOf("on") !== 0 && !img.hasAttribute(attrname)) img.setAttribute(attrname, attrib[attrname]);
						img.className = options.className;
						img.alt = rawText;
						img.src = src;
						modified = true;
						fragment.appendChild(img);
					}
					if (!img) fragment.appendChild(createText(rawText, false));
					img = null;
				}
				if (modified) {
					if (i < text.length) fragment.appendChild(createText(text.slice(i), true));
					subnode.parentNode.replaceChild(fragment, subnode);
				}
			}
			return node;
		}
		function parseString(str, options) {
			return replace(str, function(rawText) {
				var ret = rawText, iconId = grabTheRightIcon(rawText), src = options.callback(iconId, options), attrib, attrname;
				if (iconId && src) {
					ret = "<img ".concat("class=\"", options.className, "\" ", "draggable=\"false\" ", "alt=\"", rawText, "\"", " src=\"", src, "\"");
					attrib = options.attributes(rawText, iconId);
					for (attrname in attrib) if (attrib.hasOwnProperty(attrname) && attrname.indexOf("on") !== 0 && ret.indexOf(" " + attrname + "=") === -1) ret = ret.concat(" ", attrname, "=\"", escapeHTML(attrib[attrname]), "\"");
					ret = ret.concat("/>");
				}
				return ret;
			});
		}
		function replacer(m) {
			return escaper[m];
		}
		function returnNull() {
			return null;
		}
		function toSizeSquaredAsset(value) {
			return typeof value === "number" ? value + "x" + value : value;
		}
		function fromCodePoint(codepoint) {
			var code = typeof codepoint === "string" ? parseInt(codepoint, 16) : codepoint;
			if (code < 65536) return fromCharCode(code);
			code -= 65536;
			return fromCharCode(55296 + (code >> 10), 56320 + (code & 1023));
		}
		function parse(what, how) {
			if (!how || typeof how === "function") how = { callback: how };
			return (typeof what === "string" ? parseString : parseNode)(what, {
				callback: how.callback || defaultImageSrcGenerator,
				attributes: typeof how.attributes === "function" ? how.attributes : returnNull,
				base: typeof how.base === "string" ? how.base : twemoji.base,
				ext: how.ext || twemoji.ext,
				size: how.folder || toSizeSquaredAsset(how.size || twemoji.size),
				className: how.className || twemoji.className,
				onerror: how.onerror || twemoji.onerror
			});
		}
		function replace(text, callback) {
			return String(text).replace(re, callback);
		}
		function test(text) {
			re.lastIndex = 0;
			var result = re.test(text);
			re.lastIndex = 0;
			return result;
		}
		function toCodePoint(unicodeSurrogates, sep) {
			var r = [], c = 0, p = 0, i = 0;
			while (i < unicodeSurrogates.length) {
				c = unicodeSurrogates.charCodeAt(i++);
				if (p) {
					r.push((65536 + (p - 55296 << 10) + (c - 56320)).toString(16));
					p = 0;
				} else if (55296 <= c && c <= 56319) p = c;
				else r.push(c.toString(16));
			}
			return r.join(sep || "-");
		}
	}();
	//#endregion
	//#region src/features/twemoji.ts
	var twemoji = {
		replaceMessage(message) {
			twemoji$1.parse(message);
		},
		async load(api) {
			api.forClass("message", HTMLElement, this.replaceMessage.bind(this));
		}
	};
	//#endregion
	//#region src/features/ffz.ts
	/*! modified code of FFZ emote modifiers implementation */
	/*! https://github.com/FrankerFaceZ/FrankerFaceZ/blob/daa193aa030cc29fd5706351677ddeb9079741ae/src/modules/chat/emotes.js */
	/*!
	Copyright 2016 Dan Salvato LLC
	
	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at
	
	http://www.apache.org/licenses/LICENSE-2.0
	
	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
	*/
	var license = () => {
		console.log(">w<");
	};
	var EmoteModifiers = class {
		className = "modified-emote";
		datasetName = "effects";
		modifiers = {
			"720507": 12289,
			"720508": 3,
			"720509": 5,
			"720510": 2049,
			"720729": 16385,
			"720730": 32769,
			"721137": 65537
		};
		effects = {
			3: (effects) => {
				effects.transform.push("scaleX(-1)");
			},
			5: (effects) => {
				effects.transform.push("scaleY(-1)");
			},
			2049: (effects) => {
				effects.animation.push((effects) => {
					if (effects.filter.length) return "ffz-effect-rainbow-filter 2s linear infinite";
					else return "ffz-effect-rainbow 2s linear infinite";
				});
			},
			4097: (effects) => {
				effects.filter.push("brightness(0.2) sepia(1) brightness(2.2) contrast(3) saturate(8)");
				effects.animation.push((effects) => {
					if (effects.transform.length) return "ffz-effect-shake-transform 0.1s linear infinite";
					else return "ffz-effect-shake 0.1s linear infinite";
				});
			},
			16385: (effects) => {
				effects.filter.push("grayscale(1) brightness(0.7) contrast(2.5)");
			},
			32769: (effects) => {
				effects.animation.push((effects) => {
					if (effects.transform.length) return "ffz-effect-jam-transform 0.6s linear infinite";
					else return "ffz-effect-jam 0.6s linear infinite";
				});
			},
			65537: (effects) => {
				effects.transformOrigin = "bottom center";
				effects.animation.push((effects) => {
					if (effects.transform.length) return "ffz-effect-bounce-transform 0.5s linear infinite";
					else return "ffz-effect-bounce 0.5s linear infinite";
				});
			},
			65541: (effects) => {
				effects.transform.push("translateY(100%)");
			}
		};
		getEffect(node) {
			const match = node.style.backgroundImage.match(/(^|")https:\/\/cdn.frankerfacez.com\/emote\/(?<modifiers>[^/]+)\/[^/]+("|$)/);
			if (match && match.groups && match.groups.modifiers in this.modifiers) return this.modifiers[match.groups.modifiers];
			return 0;
		}
		createEffects(effectFlags) {
			const effects = {
				transformOrigin: null,
				filter: [],
				transform: [],
				animation: [],
				applyEffects(node) {
					if (this.filter.length) {
						node.style.setProperty("--ffz-effect-filters", this.filter.join(" "));
						node.style.filter = "var(--ffz-effect-filters)";
					}
					if (this.transformOrigin != null) node.style.transformOrigin = this.transformOrigin;
					if (this.transform.length) {
						node.style.setProperty("--ffz-effect-transforms", this.transform.join(" "));
						node.style.transform = "var(--ffz-effect-transforms)";
					}
					if (this.animation.length) {
						node.style.setProperty("--ffz-effect-animations", this.animation.map((animation) => animation(this)).join(", "));
						node.style.animation = "var(--ffz-effect-animations)";
					}
				}
			};
			for (const [key, addEffect] of Object.entries(this.effects)) {
				const flags = parseInt(key);
				if ((flags & effectFlags) == flags) addEffect(effects);
			}
			return effects;
		}
		applyEffects(node, effectFlags) {
			node.classList.add(this.className);
			node.dataset[this.datasetName] = String(effectFlags);
			const effects = this.createEffects(effectFlags);
			[...node.getElementsByTagName("img")].forEach((img) => effects.applyEffects(img));
		}
		applyModifiers(message) {
			const modifierNodes = [];
			for (const node of message.children) {
				if (!(node instanceof HTMLElement)) continue;
				if (node.className == "emote" || node.className == "emoji") {
					const textNodes = [];
					let effectFlags = 0;
					for (let modifier = node.nextSibling; modifier != null; modifier = modifier?.nextSibling ?? null) {
						if (modifier == null) break;
						if (!(modifier instanceof HTMLElement)) continue;
						if (modifier.nodeType == Node.TEXT_NODE) {
							if (modifier.nodeValue == null || modifier.nodeValue.trim() == "") {
								textNodes.push(modifier);
								continue;
							}
						} else if ("className" in modifier && modifier.className == "emote") {
							const effect = this.getEffect(modifier);
							if (effect) {
								effectFlags |= effect;
								textNodes.forEach((modifier) => modifierNodes.push(modifier));
								modifierNodes.push(modifier);
								continue;
							}
						}
						break;
					}
					if (effectFlags != 0) {
						if (node.className == "emoji") {
							const span = document.createElement("span");
							node.replaceWith(span);
							span.append(node);
							this.applyEffects(span, effectFlags);
						} else this.applyEffects(node, effectFlags);
					}
				}
			}
			modifierNodes.forEach((modifier) => modifier.replaceWith());
		}
	};
	var ffz = {
		emoteModifiers: new EmoteModifiers(),
		replaceMessage(message) {
			this.emoteModifiers.applyModifiers(message);
		},
		async load(api) {
			api.forClass("message", HTMLElement, this.replaceMessage.bind(this));
		}
	};
	//#endregion
	//#region node_modules/@inventivetalent/loading-cache/dist/esm/CacheEvents.js
	var import_events = (/* @__PURE__ */ __commonJSMin(((exports, module) => {
		var R = typeof Reflect === "object" ? Reflect : null;
		var ReflectApply = R && typeof R.apply === "function" ? R.apply : function ReflectApply(target, receiver, args) {
			return Function.prototype.apply.call(target, receiver, args);
		};
		var ReflectOwnKeys;
		if (R && typeof R.ownKeys === "function") ReflectOwnKeys = R.ownKeys;
		else if (Object.getOwnPropertySymbols) ReflectOwnKeys = function ReflectOwnKeys(target) {
			return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
		};
		else ReflectOwnKeys = function ReflectOwnKeys(target) {
			return Object.getOwnPropertyNames(target);
		};
		function ProcessEmitWarning(warning) {
			if (console && console.warn) console.warn(warning);
		}
		var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
			return value !== value;
		};
		function EventEmitter() {
			EventEmitter.init.call(this);
		}
		module.exports = EventEmitter;
		module.exports.once = once;
		EventEmitter.EventEmitter = EventEmitter;
		EventEmitter.prototype._events = void 0;
		EventEmitter.prototype._eventsCount = 0;
		EventEmitter.prototype._maxListeners = void 0;
		var defaultMaxListeners = 10;
		function checkListener(listener) {
			if (typeof listener !== "function") throw new TypeError("The \"listener\" argument must be of type Function. Received type " + typeof listener);
		}
		Object.defineProperty(EventEmitter, "defaultMaxListeners", {
			enumerable: true,
			get: function() {
				return defaultMaxListeners;
			},
			set: function(arg) {
				if (typeof arg !== "number" || arg < 0 || NumberIsNaN(arg)) throw new RangeError("The value of \"defaultMaxListeners\" is out of range. It must be a non-negative number. Received " + arg + ".");
				defaultMaxListeners = arg;
			}
		});
		EventEmitter.init = function() {
			if (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) {
				this._events = Object.create(null);
				this._eventsCount = 0;
			}
			this._maxListeners = this._maxListeners || void 0;
		};
		EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
			if (typeof n !== "number" || n < 0 || NumberIsNaN(n)) throw new RangeError("The value of \"n\" is out of range. It must be a non-negative number. Received " + n + ".");
			this._maxListeners = n;
			return this;
		};
		function _getMaxListeners(that) {
			if (that._maxListeners === void 0) return EventEmitter.defaultMaxListeners;
			return that._maxListeners;
		}
		EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
			return _getMaxListeners(this);
		};
		EventEmitter.prototype.emit = function emit(type) {
			var args = [];
			for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
			var doError = type === "error";
			var events = this._events;
			if (events !== void 0) doError = doError && events.error === void 0;
			else if (!doError) return false;
			if (doError) {
				var er;
				if (args.length > 0) er = args[0];
				if (er instanceof Error) throw er;
				var err = /* @__PURE__ */ new Error("Unhandled error." + (er ? " (" + er.message + ")" : ""));
				err.context = er;
				throw err;
			}
			var handler = events[type];
			if (handler === void 0) return false;
			if (typeof handler === "function") ReflectApply(handler, this, args);
			else {
				var len = handler.length;
				var listeners = arrayClone(handler, len);
				for (var i = 0; i < len; ++i) ReflectApply(listeners[i], this, args);
			}
			return true;
		};
		function _addListener(target, type, listener, prepend) {
			var m;
			var events;
			var existing;
			checkListener(listener);
			events = target._events;
			if (events === void 0) {
				events = target._events = Object.create(null);
				target._eventsCount = 0;
			} else {
				if (events.newListener !== void 0) {
					target.emit("newListener", type, listener.listener ? listener.listener : listener);
					events = target._events;
				}
				existing = events[type];
			}
			if (existing === void 0) {
				existing = events[type] = listener;
				++target._eventsCount;
			} else {
				if (typeof existing === "function") existing = events[type] = prepend ? [listener, existing] : [existing, listener];
				else if (prepend) existing.unshift(listener);
				else existing.push(listener);
				m = _getMaxListeners(target);
				if (m > 0 && existing.length > m && !existing.warned) {
					existing.warned = true;
					var w = /* @__PURE__ */ new Error("Possible EventEmitter memory leak detected. " + existing.length + " " + String(type) + " listeners added. Use emitter.setMaxListeners() to increase limit");
					w.name = "MaxListenersExceededWarning";
					w.emitter = target;
					w.type = type;
					w.count = existing.length;
					ProcessEmitWarning(w);
				}
			}
			return target;
		}
		EventEmitter.prototype.addListener = function addListener(type, listener) {
			return _addListener(this, type, listener, false);
		};
		EventEmitter.prototype.on = EventEmitter.prototype.addListener;
		EventEmitter.prototype.prependListener = function prependListener(type, listener) {
			return _addListener(this, type, listener, true);
		};
		function onceWrapper() {
			if (!this.fired) {
				this.target.removeListener(this.type, this.wrapFn);
				this.fired = true;
				if (arguments.length === 0) return this.listener.call(this.target);
				return this.listener.apply(this.target, arguments);
			}
		}
		function _onceWrap(target, type, listener) {
			var state = {
				fired: false,
				wrapFn: void 0,
				target,
				type,
				listener
			};
			var wrapped = onceWrapper.bind(state);
			wrapped.listener = listener;
			state.wrapFn = wrapped;
			return wrapped;
		}
		EventEmitter.prototype.once = function once(type, listener) {
			checkListener(listener);
			this.on(type, _onceWrap(this, type, listener));
			return this;
		};
		EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
			checkListener(listener);
			this.prependListener(type, _onceWrap(this, type, listener));
			return this;
		};
		EventEmitter.prototype.removeListener = function removeListener(type, listener) {
			var list, events, position, i, originalListener;
			checkListener(listener);
			events = this._events;
			if (events === void 0) return this;
			list = events[type];
			if (list === void 0) return this;
			if (list === listener || list.listener === listener) {
				if (--this._eventsCount === 0) this._events = Object.create(null);
				else {
					delete events[type];
					if (events.removeListener) this.emit("removeListener", type, list.listener || listener);
				}
			} else if (typeof list !== "function") {
				position = -1;
				for (i = list.length - 1; i >= 0; i--) if (list[i] === listener || list[i].listener === listener) {
					originalListener = list[i].listener;
					position = i;
					break;
				}
				if (position < 0) return this;
				if (position === 0) list.shift();
				else spliceOne(list, position);
				if (list.length === 1) events[type] = list[0];
				if (events.removeListener !== void 0) this.emit("removeListener", type, originalListener || listener);
			}
			return this;
		};
		EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
		EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
			var listeners, events = this._events, i;
			if (events === void 0) return this;
			if (events.removeListener === void 0) {
				if (arguments.length === 0) {
					this._events = Object.create(null);
					this._eventsCount = 0;
				} else if (events[type] !== void 0) {
					if (--this._eventsCount === 0) this._events = Object.create(null);
					else delete events[type];
				}
				return this;
			}
			if (arguments.length === 0) {
				var keys = Object.keys(events);
				var key;
				for (i = 0; i < keys.length; ++i) {
					key = keys[i];
					if (key === "removeListener") continue;
					this.removeAllListeners(key);
				}
				this.removeAllListeners("removeListener");
				this._events = Object.create(null);
				this._eventsCount = 0;
				return this;
			}
			listeners = events[type];
			if (typeof listeners === "function") this.removeListener(type, listeners);
			else if (listeners !== void 0) for (i = listeners.length - 1; i >= 0; i--) this.removeListener(type, listeners[i]);
			return this;
		};
		function _listeners(target, type, unwrap) {
			var events = target._events;
			if (events === void 0) return [];
			var evlistener = events[type];
			if (evlistener === void 0) return [];
			if (typeof evlistener === "function") return unwrap ? [evlistener.listener || evlistener] : [evlistener];
			return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
		}
		EventEmitter.prototype.listeners = function listeners(type) {
			return _listeners(this, type, true);
		};
		EventEmitter.prototype.rawListeners = function rawListeners(type) {
			return _listeners(this, type, false);
		};
		EventEmitter.listenerCount = function(emitter, type) {
			if (typeof emitter.listenerCount === "function") return emitter.listenerCount(type);
			else return listenerCount.call(emitter, type);
		};
		EventEmitter.prototype.listenerCount = listenerCount;
		function listenerCount(type) {
			var events = this._events;
			if (events !== void 0) {
				var evlistener = events[type];
				if (typeof evlistener === "function") return 1;
				else if (evlistener !== void 0) return evlistener.length;
			}
			return 0;
		}
		EventEmitter.prototype.eventNames = function eventNames() {
			return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
		};
		function arrayClone(arr, n) {
			var copy = new Array(n);
			for (var i = 0; i < n; ++i) copy[i] = arr[i];
			return copy;
		}
		function spliceOne(list, index) {
			for (; index + 1 < list.length; index++) list[index] = list[index + 1];
			list.pop();
		}
		function unwrapListeners(arr) {
			var ret = new Array(arr.length);
			for (var i = 0; i < ret.length; ++i) ret[i] = arr[i].listener || arr[i];
			return ret;
		}
		function once(emitter, name) {
			return new Promise(function(resolve, reject) {
				function errorListener(err) {
					emitter.removeListener(name, resolver);
					reject(err);
				}
				function resolver() {
					if (typeof emitter.removeListener === "function") emitter.removeListener("error", errorListener);
					resolve([].slice.call(arguments));
				}
				eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
				if (name !== "error") addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
			});
		}
		function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
			if (typeof emitter.on === "function") eventTargetAgnosticAddListener(emitter, "error", handler, flags);
		}
		function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
			if (typeof emitter.on === "function") {
				if (flags.once) emitter.once(name, listener);
				else emitter.on(name, listener);
			} else if (typeof emitter.addEventListener === "function") emitter.addEventListener(name, function wrapListener(arg) {
				if (flags.once) emitter.removeEventListener(name, wrapListener);
				listener(arg);
			});
			else throw new TypeError("The \"emitter\" argument must be of type EventEmitter. Received type " + typeof emitter);
		}
	})))();
	var CacheEvents = class CacheEvents {
		static forward(source, emitter) {
			CacheEvents.ALL.forEach((e) => {
				source.on(e, (...args) => emitter.emit(e, ...args));
			});
		}
	};
	CacheEvents.EXPIRE = "expire";
	CacheEvents.STAT = "stat";
	CacheEvents.ERROR = "error";
	CacheEvents.ALL = [
		CacheEvents.EXPIRE,
		CacheEvents.STAT,
		CacheEvents.ERROR
	];
	//#endregion
	//#region node_modules/@inventivetalent/loading-cache/dist/esm/CacheStats.js
	var CacheStats = class extends import_events.EventEmitter {
		constructor() {
			super(...arguments);
			this.map = /* @__PURE__ */ new Map();
		}
		inc(key, amount = 1) {
			if (amount === 0) return;
			const prev = this.get(key);
			this.map.set(key, prev + amount);
			try {
				this.emit(CacheEvents.STAT, key, amount, prev);
			} catch (e) {
				console.error(e);
			}
		}
		get(key) {
			return this.map.get(key) || 0;
		}
		reset() {
			this.map.clear();
		}
		toObject() {
			return Object.fromEntries(this.map);
		}
		toString() {
			return JSON.stringify(this.toObject(), null, 2);
		}
	};
	CacheStats.HIT = "hit";
	CacheStats.MISS = "miss";
	CacheStats.LOAD_SUCCESS = "load_success";
	CacheStats.LOAD_FAIL = "load_failure";
	CacheStats.EXPIRE = "expire";
	CacheStats.ALL = [
		CacheStats.HIT,
		CacheStats.MISS,
		CacheStats.LOAD_SUCCESS,
		CacheStats.LOAD_FAIL,
		CacheStats.EXPIRE
	];
	//#endregion
	//#region node_modules/@inventivetalent/loading-cache/dist/esm/util.js
	function asArray(iterable) {
		if (iterable instanceof Array) return iterable;
		return Array.from(iterable);
	}
	function keyCompletablePromiseMapToPromiseContainingMap(keyToPromiseMap) {
		const keys = asArray(keyToPromiseMap.keys());
		const values = asArray(keyToPromiseMap.values());
		return Promise.all(values.map((p) => p.promise)).then((resolvedValues) => {
			const valueMap = /* @__PURE__ */ new Map();
			keys.forEach((key, i) => {
				const value = resolvedValues[i];
				if (typeof value !== "undefined") valueMap.set(key, value);
			});
			return valueMap;
		});
	}
	var CompletablePromise = class CompletablePromise {
		constructor() {
			this._settled = false;
			this._promise = new Promise((resolve, reject) => {
				this._resolve = resolve;
				this._reject = reject;
			});
		}
		static of(value) {
			const promise = new CompletablePromise();
			value.then((v) => promise.resolve(v), (e) => promise.reject(e));
			return promise;
		}
		static completedPromise(value) {
			const completable = new CompletablePromise();
			completable.resolve(value);
			return completable;
		}
		get promise() {
			return this._promise;
		}
		get settled() {
			return this._settled;
		}
		get resolved() {
			return this._settled;
		}
		resolve(value) {
			if (this._settled) return;
			this._settled = true;
			this._resolve(value);
		}
		reject(reason) {
			if (this._settled) return;
			this._settled = true;
			this._reject(reason);
		}
		ignoreRejection() {
			this._promise.catch(() => {});
			return this;
		}
		then(fulfilled, rejected) {
			return this._promise.then(fulfilled, rejected);
		}
		catch(rejected) {
			return this._promise.catch(rejected);
		}
	};
	function isValue(value) {
		return typeof value !== "undefined" && value !== null;
	}
	//#endregion
	//#region node_modules/@inventivetalent/time/dist/esm/Time.js
	var Time = class {
		static millis(m) {
			return m;
		}
		static seconds(s) {
			return this.millis(s * 1e3);
		}
		static minutes(m) {
			return this.seconds(m * 60);
		}
		static hours(h) {
			return this.minutes(h * 60);
		}
		static days(d) {
			return this.hours(d * 24);
		}
		static get now() {
			return Date.now();
		}
	};
	//#endregion
	//#region node_modules/@inventivetalent/loading-cache/dist/esm/cache/CacheBase.js
	var DEFAULT_OPTIONS = {
		expireAfterAccess: 0,
		expireAfterWrite: 0,
		deleteOnExpiration: true,
		expirationInterval: Time.minutes(5),
		recordStats: true
	};
	function resolveOptions(options = {}) {
		return {
			expireAfterAccess: options.expireAfterAccess ?? DEFAULT_OPTIONS.expireAfterAccess,
			expireAfterWrite: options.expireAfterWrite ?? DEFAULT_OPTIONS.expireAfterWrite,
			deleteOnExpiration: options.deleteOnExpiration ?? DEFAULT_OPTIONS.deleteOnExpiration,
			expirationInterval: options.expirationInterval ?? DEFAULT_OPTIONS.expirationInterval,
			recordStats: options.recordStats ?? DEFAULT_OPTIONS.recordStats
		};
	}
	var CacheBase = class extends import_events.EventEmitter {
		constructor(options) {
			super({});
			this.data = /* @__PURE__ */ new Map();
			this._stats = new CacheStats();
			this._options = resolveOptions(options);
			this.runCleanup();
			CacheEvents.forward(this._stats, this);
		}
		get options() {
			return this._options;
		}
		get stats() {
			return this._stats;
		}
		runCleanup() {
			if (this.options.deleteOnExpiration) {
				this.deleteExpiredEntries();
				if (this.options.expirationInterval > 0) {
					this._cleanupTimeout = setTimeout(() => this.runCleanup(), this.options.expirationInterval);
					if (typeof this._cleanupTimeout?.unref === "function") this._cleanupTimeout.unref();
				}
			}
		}
		stopCleanupTimer() {
			if (typeof this._cleanupTimeout !== "undefined") {
				clearTimeout(this._cleanupTimeout);
				this._cleanupTimeout = void 0;
			}
		}
		deleteExpiredEntries(recordStats = this.options.recordStats) {
			const toDelete = [];
			this.data.forEach((entry) => {
				if (entry.isExpired(this.options)) toDelete.push(entry);
			});
			toDelete.forEach((entry) => {
				this.invalidateEntry(entry.peekKey());
				try {
					this.emit(CacheEvents.EXPIRE, entry.peekKey(), entry.peekValue());
				} catch (e) {
					console.error(e);
				}
			});
			if (recordStats) this.stats.inc(CacheStats.EXPIRE, toDelete.length);
		}
		getEntryDirect(key) {
			return this.data.get(key);
		}
		getEntryIfPresent(key, recordStats = this.options.recordStats) {
			const entry = this.getEntryDirect(key);
			if (typeof entry === "undefined") {
				if (recordStats) this.stats.inc(CacheStats.MISS);
				return;
			}
			if (entry.isExpired(this.options)) {
				if (this.options.deleteOnExpiration) {
					this.invalidateEntry(key);
					if (recordStats) this.stats.inc(CacheStats.EXPIRE);
				}
				if (recordStats) this.stats.inc(CacheStats.MISS);
				return;
			}
			if (recordStats) this.stats.inc(CacheStats.HIT);
			return entry;
		}
		putEntry(key, entry) {
			this.data.set(key, entry);
		}
		invalidateEntry(key) {
			return this.data.delete(key);
		}
		allKeys() {
			return asArray(this.data.keys());
		}
		keys() {
			const keys = [];
			this.data.forEach((entry, key) => {
				if (!entry.isExpired(this.options)) keys.push(key);
			});
			return keys;
		}
		has(key) {
			const entry = this.data.get(key);
			return typeof entry !== "undefined" && !entry.isExpired(this.options);
		}
		end() {
			this.stopCleanupTimer();
			this.data.clear();
		}
	};
	var Entry = class Entry {
		constructor(key) {
			this.key = key;
			this.accessTime = Time.now;
			this.writeTime = Time.now;
		}
		static fromJson(key, value) {
			const entry = new Entry(key);
			entry.value = value["value"];
			entry.accessTime = value["accessTime"];
			entry.writeTime = value["writeTime"];
			return entry;
		}
		peekKey() {
			return this.key;
		}
		peekValue() {
			return this.value;
		}
		getKey() {
			this.accessTime = Time.now;
			return this.key;
		}
		getValue() {
			this.accessTime = Time.now;
			return this.value;
		}
		setValue(v) {
			this.accessTime = Time.now;
			this.writeTime = Time.now;
			return this.value = v;
		}
		isExpired(options) {
			const expireAfterAccess = options.expireAfterAccess ?? 0;
			const expireAfterWrite = options.expireAfterWrite ?? 0;
			if (expireAfterAccess > 0 && Time.now - this.accessTime > expireAfterAccess) return true;
			if (expireAfterWrite > 0 && Time.now - this.writeTime > expireAfterWrite) return true;
			return false;
		}
	};
	//#endregion
	//#region node_modules/@inventivetalent/loading-cache/dist/esm/cache/SimpleCache.js
	var SimpleCache = class extends CacheBase {
		constructor(options) {
			super(options);
		}
		getIfPresent(key) {
			const entry = this.getEntryIfPresent(key);
			if (typeof entry === "undefined") return;
			return entry.getValue();
		}
		get(key, mappingFunction) {
			return this._get(key, mappingFunction);
		}
		peek(key) {
			const entry = this.getEntryDirect(key);
			if (typeof entry === "undefined" || entry.isExpired(this.options)) return;
			return entry.peekValue();
		}
		_get(key, mappingFunction, forceLoad = false) {
			if (!forceLoad) {
				const entry = this.getEntryIfPresent(key);
				if (entry) return entry.getValue();
			}
			if (mappingFunction) {
				const mapped = mappingFunction(key);
				const loaded = isValue(mapped);
				if (loaded) this.put(key, mapped);
				if (this.options.recordStats) {
					if (loaded) this.stats.inc(CacheStats.LOAD_SUCCESS);
					else this.stats.inc(CacheStats.LOAD_FAIL);
				}
				return mapped;
			}
		}
		getAllPresentEntries(keys) {
			const map = /* @__PURE__ */ new Map();
			for (let key of keys) {
				let val = this.getEntryIfPresent(key);
				if (typeof val !== "undefined") map.set(key, val);
			}
			return map;
		}
		getAllEntries(keys) {
			return this.getAllPresentEntries(keys);
		}
		getAllPresent(keys) {
			const entryMap = this.getAllPresentEntries(keys);
			const map = /* @__PURE__ */ new Map();
			entryMap.forEach((v, k) => map.set(k, v.getValue()));
			return map;
		}
		getAll(keys, mappingFunction) {
			const keyArray = asArray(keys);
			const present = this.getAllPresent(keys);
			if (mappingFunction && present.size < keyArray.length) {
				const missingKeys = asArray(new Set(keyArray.filter((k) => !present.has(k))));
				if (missingKeys.length > 0) {
					const mapped = mappingFunction(missingKeys);
					if (typeof mapped === "undefined") {
						if (this.options.recordStats) this.stats.inc(CacheStats.LOAD_FAIL, missingKeys.length);
						return present;
					}
					this.putAll(mapped);
					const combined = /* @__PURE__ */ new Map();
					present.forEach((v, k) => combined.set(k, v));
					mapped.forEach((v, k) => combined.set(k, v));
					if (this.options.recordStats) {
						const loadedCount = missingKeys.filter((k) => mapped.has(k)).length;
						this.stats.inc(CacheStats.LOAD_SUCCESS, loadedCount);
						this.stats.inc(CacheStats.LOAD_FAIL, missingKeys.length - loadedCount);
					}
					return combined;
				}
			}
			return present;
		}
		put(key, value) {
			let entry = this.getEntryIfPresent(key, false);
			if (typeof entry === "undefined") entry = new Entry(key);
			entry.setValue(value);
			this.putEntry(key, entry);
		}
		putAll(map) {
			map.forEach((v, k) => this.put(k, v));
		}
		invalidate(key) {
			this.invalidateEntry(key);
		}
		invalidateAll(keys) {
			if (!keys) keys = this.allKeys();
			for (let key of keys) this.invalidate(key);
		}
		refresh(key) {
			return this.getIfPresent(key);
		}
	};
	//#endregion
	//#region node_modules/@inventivetalent/loading-cache/dist/esm/cache/LoadingCache.js
	var LoadingCache = class extends import_events.EventEmitter {
		constructor(options, loader, multiLoader, internalCache) {
			super({});
			if (internalCache) this._cache = internalCache(options);
			else this._cache = new SimpleCache(options);
			this.loader = loader;
			this.multiLoader = multiLoader;
			CacheEvents.forward(this._cache, this);
		}
		get cache() {
			return this._cache;
		}
		get options() {
			return this.cache.options;
		}
		get stats() {
			return this.cache.stats;
		}
		getIfPresent(key) {
			return this.cache.getIfPresent(key);
		}
		get(key, mappingFunction, forceLoad = false) {
			return this._get(key, mappingFunction, forceLoad);
		}
		_get(key, mappingFunction, forceLoad = false) {
			if (!forceLoad) {
				const present = this.getIfPresent(key);
				if (typeof present !== "undefined") return present;
			}
			if (mappingFunction) return this.cache._get(key, mappingFunction, true);
			if (this.loader) return this._get(key, this.loader, true);
		}
		getAllPresent(keys) {
			return this.cache.getAllPresent(keys);
		}
		getAll(keys, mappingFunction) {
			return this._getAll(keys, mappingFunction);
		}
		_getAll(keys, mappingFunction) {
			if (mappingFunction) return this.cache.getAll(keys, mappingFunction);
			if (this.multiLoader) return this.cache.getAll(keys, this.multiLoader);
			const present = this.cache.getAllPresent(keys);
			if (this.loader) {
				for (let key of keys) if (!present.has(key)) {
					const loaded = this.get(key, this.loader);
					if (typeof loaded !== "undefined") present.set(key, loaded);
				}
			}
			return present;
		}
		put(key, value) {
			this.cache.put(key, value);
		}
		putAll(map) {
			this.cache.putAll(map);
		}
		invalidate(key) {
			this.cache.invalidate(key);
		}
		invalidateAll(keys) {
			if (keys) this.cache.invalidateAll(keys);
			else this.cache.invalidateAll();
		}
		refresh(key) {
			return this._get(key, void 0, true);
		}
		keys() {
			return this.cache.keys();
		}
		has(key) {
			return this.cache.has(key);
		}
		end() {
			this.cache.end();
		}
	};
	//#endregion
	//#region node_modules/@inventivetalent/loading-cache/dist/esm/cache/AsyncLoadingCache.js
	var AsyncLoadingCache = class extends import_events.EventEmitter {
		constructor(options, loader, multiLoader, internalCache) {
			super({});
			if (typeof internalCache !== "undefined") this._cache = internalCache(options);
			else this._cache = new SimpleCache(options);
			this.loader = loader;
			this.multiLoader = multiLoader;
			CacheEvents.forward(this._cache, this);
		}
		get options() {
			return this.cache.options;
		}
		get cache() {
			return this._cache;
		}
		get stats() {
			return this.cache.stats;
		}
		getIfPresent(key) {
			return this.cache.getIfPresent(key)?.promise;
		}
		get(key, mappingFunction, forceLoad = false) {
			return this._get(key, mappingFunction, forceLoad);
		}
		_get(key, mappingFunction, forceLoad = false) {
			if (!forceLoad) {
				const present = this.getIfPresent(key);
				if (typeof present !== "undefined") return present;
			}
			if (mappingFunction) {
				const mapped = mappingFunction(key);
				let mappedPromise;
				if (mapped instanceof Promise) mappedPromise = mapped;
				else mappedPromise = Promise.resolve(mapped);
				const completable = CompletablePromise.of(mappedPromise);
				this.cache.put(key, completable);
				this.trackLoad(key, completable, mappedPromise);
				return mappedPromise;
			}
			if (this.loader) return this._get(key, this.loader, true);
			return Promise.resolve(void 0);
		}
		trackLoad(key, completable, promise) {
			completable.ignoreRejection();
			promise.then((value) => {
				const loaded = isValue(value);
				if (this.options.recordStats) this.stats.inc(loaded ? CacheStats.LOAD_SUCCESS : CacheStats.LOAD_FAIL);
				if (!loaded) this.invalidateIfSame(key, completable);
			}, (error) => {
				if (this.options.recordStats) this.stats.inc(CacheStats.LOAD_FAIL);
				this.invalidateIfSame(key, completable);
				this.emitError(error);
			});
		}
		invalidateIfSame(key, completable) {
			if (this.cache.peek(key) === completable) this.cache.invalidate(key);
		}
		emitError(error) {
			if (this.listenerCount(CacheEvents.ERROR) > 0) try {
				this.emit(CacheEvents.ERROR, error);
			} catch (e) {
				console.error(e);
			}
		}
		getAllPresent(keys) {
			return keyCompletablePromiseMapToPromiseContainingMap(this.cache.getAllPresent(keys));
		}
		getAll(keys, mappingFunction) {
			return this._getAll(keys, mappingFunction);
		}
		_getAll(keys, mappingFunction) {
			const keyArray = asArray(keys);
			const present = this.cache.getAllPresent(keys);
			if (mappingFunction) {
				const missingKeys = asArray(new Set(keyArray.filter((k) => !present.has(k))));
				if (missingKeys.length > 0) {
					const mapped = mappingFunction(missingKeys);
					let mappedPromise;
					if (mapped instanceof Promise) mappedPromise = mapped;
					else mappedPromise = Promise.resolve(mapped);
					const pending = /* @__PURE__ */ new Map();
					for (let key of missingKeys) {
						const completable = new CompletablePromise();
						completable.ignoreRejection();
						pending.set(key, completable);
						this.cache.put(key, completable);
					}
					const loaded = mappedPromise.then((mappedMap) => {
						const newMap = mappedMap ?? /* @__PURE__ */ new Map();
						let loadedCount = 0;
						pending.forEach((completable, key) => {
							const value = newMap.get(key);
							completable.resolve(value);
							if (isValue(value)) loadedCount++;
							else this.invalidateIfSame(key, completable);
						});
						if (this.options.recordStats) {
							this.stats.inc(CacheStats.LOAD_SUCCESS, loadedCount);
							this.stats.inc(CacheStats.LOAD_FAIL, missingKeys.length - loadedCount);
						}
						return newMap;
					}, (error) => {
						pending.forEach((completable, key) => {
							completable.reject(error);
							this.invalidateIfSame(key, completable);
						});
						if (this.options.recordStats) this.stats.inc(CacheStats.LOAD_FAIL, missingKeys.length);
						this.emitError(error);
						throw error;
					});
					return Promise.all([keyCompletablePromiseMapToPromiseContainingMap(present), loaded]).then(([presentMap, newMap]) => {
						const combined = /* @__PURE__ */ new Map();
						presentMap.forEach((v, k) => combined.set(k, v));
						newMap.forEach((v, k) => combined.set(k, v));
						return combined;
					});
				}
				return keyCompletablePromiseMapToPromiseContainingMap(present);
			}
			if (this.multiLoader) return this.getAll(keys, this.multiLoader);
			if (this.loader) {
				for (let key of keys) if (!present.has(key)) present.set(key, CompletablePromise.of(this.get(key)).ignoreRejection());
			}
			return keyCompletablePromiseMapToPromiseContainingMap(present);
		}
		put(key, value) {
			if (value instanceof Promise) this.cache.put(key, CompletablePromise.of(value).ignoreRejection());
			else this.cache.put(key, CompletablePromise.completedPromise(value));
		}
		putAll(map) {
			map.forEach((v, k) => {
				this.cache.put(k, CompletablePromise.completedPromise(v));
			});
		}
		invalidate(key) {
			this.cache.invalidate(key);
		}
		invalidateAll(keys) {
			if (keys) this.cache.invalidateAll(keys);
			else this.cache.invalidateAll();
		}
		refresh(key) {
			return this._get(key, void 0, true);
		}
		keys() {
			return this.cache.keys();
		}
		has(key) {
			return this.cache.has(key);
		}
		end() {
			this.cache.end();
		}
	};
	//#endregion
	//#region node_modules/@inventivetalent/loading-cache/dist/esm/Caches.js
	var CacheBuilder = class {
		constructor() {
			this.options = {};
		}
		expireAfterAccess(expireAfterAccess) {
			this.options.expireAfterAccess = expireAfterAccess;
			return this;
		}
		expireAfterWrite(expireAfterWrite) {
			this.options.expireAfterWrite = expireAfterWrite;
			return this;
		}
		deleteOnExpiration(deleteOnExpiration) {
			this.options.deleteOnExpiration = deleteOnExpiration;
			return this;
		}
		expirationInterval(expirationInterval) {
			this.options.expirationInterval = expirationInterval;
			return this;
		}
		recordStats(recordStats) {
			this.options.recordStats = recordStats;
			return this;
		}
		build(loader, multiLoader, loadingInternalCache) {
			if (typeof loader === "undefined") {
				if (loadingInternalCache) return loadingInternalCache(this.options);
				return new SimpleCache(this.options);
			}
			return new LoadingCache(this.options, loader, multiLoader, loadingInternalCache);
		}
		buildAsync(loader, multiLoader, loadingInternalCache) {
			return new AsyncLoadingCache(this.options, loader, multiLoader, loadingInternalCache);
		}
	};
	var Caches = class extends CacheBuilder {
		constructor() {
			super();
		}
		static builder() {
			return new CacheBuilder();
		}
	};
	//#endregion
	//#region src/features/pronouns/api.pronouns.alejo.io.ts
	var PronounsResponse = /* @__PURE__ */ record(/* @__PURE__ */ string(), /* @__PURE__ */ looseObject({
		name: /* @__PURE__ */ string(),
		subject: /* @__PURE__ */ string(),
		object: /* @__PURE__ */ nullish(/* @__PURE__ */ string()),
		singular: /* @__PURE__ */ boolean()
	}));
	var UserResponse = /* @__PURE__ */ looseObject({
		channel_id: /* @__PURE__ */ string(),
		channel_login: /* @__PURE__ */ string(),
		pronoun_id: /* @__PURE__ */ string(),
		alt_pronoun_id: /* @__PURE__ */ nullish(/* @__PURE__ */ string())
	});
	var pronounsService$1 = {
		pronounsApi: "https://api.pronouns.alejo.io/v1/",
		map: null,
		cache: null,
		async getPronouns(userId, username) {
			if (userId == null || username == null) return null;
			if (!await this.loadPronounsMap() || this.cache == null || this.map == null) return null;
			const map = this.map;
			const key = "users/" + username;
			const result = await this.cache.get(key);
			if (result == null) return null;
			const response = UserResponse.safeParse(result);
			if (!response.success) {
				console.error(`error parsing data: ${response.error}`);
				return null;
			}
			if (response.data.channel_id != userId) return null;
			const pronouns = [response.data.pronoun_id, response.data.alt_pronoun_id].flatMap((item) => item === null || item === void 0 || item === "" || !(item in map) ? [] : [map[item]]);
			if (pronouns.length <= 0) return null;
			if (pronouns.length == 1) {
				const [pronoun] = pronouns;
				if (pronoun.singular || pronoun.object === null || pronoun.object === void 0 || pronoun.object === "") return pronoun.subject;
				else return `${pronoun.subject}/${pronoun.object}`;
			} else return pronouns.map((pronoun) => pronoun.subject).join("/");
		},
		async loadPronounsMap() {
			if (this.map == null) {
				const result = await this.createPronounsMap();
				if (result == null) return false;
				this.map = result;
			}
			return true;
		},
		async createPronounsMap() {
			if (this.cache == null) return null;
			const result = await this.cache.get("pronouns");
			if (result == null) return null;
			const response = PronounsResponse.safeParse(result);
			if (!response.success) {
				console.error(`error parsing data: ${response.error}`);
				return null;
			}
			console.log("pronouns definitions loaded");
			return response.data;
		},
		async fetchPronouns(key) {
			console.log(`loading pronouns: ${key}`);
			try {
				const result = await fetch(this.pronounsApi + key).then((resp) => resp.ok ? resp.json() : null);
				console.log(`loaded pronouns: ${key} (${result === null ? "empty" : "response"})`);
				return result;
			} catch (error) {
				console.error(error);
				return null;
			}
		},
		async load(api) {
			if (api.settings.pronouns.includes("api.pronouns.alejo.io")) {
				this.map = null;
				this.cache = Caches.builder().expireAfterWrite(Time.minutes(5)).buildAsync((key) => this.fetchPronouns(key));
				this.loadPronounsMap();
			}
		}
	};
	//#endregion
	//#region src/features/pronouns/pronoundb.org.ts
	var LookupResponse = /* @__PURE__ */ record(/* @__PURE__ */ string(), /* @__PURE__ */ looseObject({ sets: /* @__PURE__ */ record(/* @__PURE__ */ string(), /* @__PURE__ */ array(/* @__PURE__ */ string())) }));
	var subjectToObject = {
		he: "him",
		it: "its",
		she: "her",
		they: "them",
		ae: "aer",
		e: "em",
		fae: "faer",
		per: "per",
		ve: "ver",
		xe: "xem",
		zie: "hier"
	};
	var capitalize = (value) => value === "" ? "" : value.charAt(0).toUpperCase() + value.slice(1);
	function withResolvers() {
		let resolve, reject;
		return {
			promise: new Promise((res, rej) => {
				resolve = res;
				reject = rej;
			}),
			resolve,
			reject
		};
	}
	function createBatch(fetchFn, batchLimit, waitTime = 500) {
		let queue = {
			items: [],
			done: true
		};
		const runFetch = (queue) => {
			if (!queue.done) {
				queue.done = true;
				fetchFn(queue.items.map((item) => item.key)).then((value) => queue.items.forEach((item) => item.resolve(value))).catch((reason) => queue.items.forEach((item) => item.reject(reason)));
			}
		};
		return { get(key) {
			const { promise, resolve, reject } = withResolvers();
			const item = {
				key,
				resolve,
				reject
			};
			if (queue.done) {
				queue = {
					items: [item],
					done: false
				};
				const queueInTimer = queue;
				setTimeout(() => runFetch(queueInTimer), waitTime);
			} else {
				queue.items.push(item);
				if (queue.items.length >= batchLimit) runFetch(queue);
			}
			return promise;
		} };
	}
	//#endregion
	//#region src/features/pronouns-replacer.ts
	var knownServices = {
		"api.pronouns.alejo.io": pronounsService$1,
		"pronoundb.org": {
			pronounsApi: "https://pronoundb.org/api/v2/lookup",
			cache: null,
			async getPronouns(userId) {
				if (userId == null) return null;
				if (this.cache == null) return null;
				const result = await this.cache.get(userId);
				if (result == null) return null;
				const response = LookupResponse.safeParse(result);
				if (!response.success) {
					console.error(`error parsing data: ${response.error}`);
					return null;
				}
				if (!(userId in response.data)) return null;
				if (!("en" in response.data[userId].sets)) return null;
				const pronouns = response.data[userId].sets["en"];
				if (pronouns.length <= 0) return null;
				if (pronouns.length == 1) {
					const [pronoun] = pronouns;
					if (!(pronoun in subjectToObject)) return capitalize(pronoun);
					else return `${capitalize(pronoun)}/${capitalize(subjectToObject[pronoun])}`;
				} else return pronouns.map((pronoun) => capitalize(pronoun)).join("/");
			},
			async fetchPronounsBatch(ids) {
				console.log(`loading pronouns: ${ids.join(",")}`);
				try {
					const url = new URL(this.pronounsApi);
					url.searchParams.append("platform", "twitch");
					url.searchParams.append("ids", ids.join(","));
					const result = await fetch(url, { headers: { "X-PronounDB-Source": userAgent } }).then((resp) => resp.ok ? resp.json() : null);
					console.log(`loaded pronouns: ${ids.join(",")} (${result === null ? "empty" : "response"})`);
					return result;
				} catch (error) {
					console.error(error);
					return null;
				}
			},
			async load(api) {
				if (api.settings.pronouns.includes("pronoundb.org")) {
					const batch = createBatch((ids) => this.fetchPronounsBatch(ids), 50);
					this.cache = Caches.builder().expireAfterWrite(Time.minutes(5)).buildAsync((id) => batch.get(id));
				}
			}
		}
	};
	var fontRenderer = { getCachedImage(text) {
		return document.createTextNode(text);
	} };
	var pronounsReplacer = {
		async replacePronouns(node, userId, username, options) {
			for (const service of options.services) {
				const pronouns = await service.getPronouns(userId, username);
				if (pronouns != null) {
					node.replaceChildren(fontRenderer.getCachedImage(options.capitalizePronouns ? pronouns : pronouns.toLowerCase()));
					break;
				}
			}
		},
		async load(api) {
			if (api.settings.pronouns.length > 0) {
				const services = [];
				for (const pronounsApi of api.settings.pronouns) if (pronounsApi in knownServices) services.push(knownServices[pronounsApi]);
				api.forClass("pronouns", Element, (nodes, context) => {
					if (context.service.includes("twitch")) this.replacePronouns(nodes, context.user.id, context.user.name, {
						capitalizePronouns: api.settings.capitalizePronouns,
						services
					});
				});
				await Promise.all(services.map((service) => service.load(api)));
			}
		}
	};
	//#endregion
	//#region src/features/emotes.ts
	var KNOWN_FROGS = {
		bttv: {
			"55b6524154eefd53777b2580": "FeelsBirthdayMan",
			"56e9f494fff3cc5c35e5287e": "monkaS",
			"566c9fc265dbbdab32ec053b": "FeelsBadMan",
			"566c9fde65dbbdab32ec053e": "FeelsGoodMan",
			"5733ff12e72c3c0814233e20": "FeelsAmazingMan"
		},
		"7tv": {
			"60e5d610a69fc8d27f2737b7": "Stare",
			"62f9c69136c62011a8c3cb80": "PepePls",
			"647c81cdd4b5d6083e9200fc": "peepoPls",
			"6297ed14d1b61557a52b21cb": "Gayge",
			"63018e81f7723932b45bff60": "peepoHappy",
			"63019cd97f31c2c757a21162": "peepoSad",
			"63045f7dd9bf10a26e1a1d02": "knaDyppaHopeep",
			"63065b00b7e5a120600a2df6": "FeelsStrongMan",
			"63065b70be8c19d70f9d6633": "ppL",
			"63071b80942ffb69e13d700f": "EZ",
			"63071bb9464de28875c52531": "FeelsDankMan",
			"6306606b28f42e96cc0df332": "FeelsWeirdMan",
			"62589908caeec18915c90a9b": "ApuApustaja",
			"630660200e929d2fde44db5b": "FeelsOkayMan"
		}
	};
	function identity(a) {
		return a;
	}
	var RemoveImageError = class extends Error {
		replaceWith;
		constructor(message, replaceWith) {
			super(message);
			Object.setPrototypeOf(this, new.target.prototype);
			this.replaceWith = replaceWith;
		}
	};
	function overrideString(result) {
		if (result == null) throw new RemoveImageError();
		return result;
	}
	function overrideFunction(overrides, type, showFrogEmotes) {
		if (!(!showFrogEmotes && type in KNOWN_FROGS) && !(overrides != null && type in overrides && overrides[type] != null && Object.keys(overrides[type]).length > 0)) return identity;
		const map = overrides[type];
		return (id) => {
			if (id in map) return overrideString(map[id]);
			else if ("*" in map) return overrideString(map["*"]);
			else if (!showFrogEmotes) {
				if (type in KNOWN_FROGS && id in KNOWN_FROGS[type]) throw new RemoveImageError("frog", KNOWN_FROGS[type][id]);
			}
			return id;
		};
	}
	var emotes = {
		ffz: identity,
		twitch: identity,
		bttv: identity,
		"7tv": identity,
		fixEmote(emote) {
			emote.style.backgroundImage = this.fixEmoteUrl(emote.style.backgroundImage);
			[...emote.getElementsByTagName("img")].forEach((img) => this.fixEmoteImg(img));
		},
		fixEmoteImg(img) {
			img.src = this.fixEmoteUrl(img.src);
		},
		fixEmoteUrl(url) {
			return url.replace(/(^|")(https:\/\/cdn.frankerfacez.com\/emote\/)([^/]+)\/(1|2|4)("|$)/g, (_match, p1, p2, id, _scale, p5) => `${p1}${p2}${this.ffz(id)}/4${p5}`).replace(/(^|")(https:\/\/static-cdn.jtvnw.net\/emoticons\/v1\/)([^/]+)\/(1|2|3).0("|$)/g, (_match, p1, p2, id, _scale, p5) => `${p1}${p2}${this.twitch(id)}/3.0${p5}`).replace(/(^|")(https:\/\/static-cdn.jtvnw.net\/emoticons\/v2\/)([^/]+)(\/(?:default|static|animated)\/(?:dark|light))\/(1|2|3).0("|$)/g, (_match, p1, p2, id, p4, _scale, p6) => `${p1}${p2}${this.twitch(id)}${p4}/3.0${p6}`).replace(/(^|")(https:\/\/cdn.betterttv.net\/emote\/)([^/]+)\/(1|2|3)x(\.webp|\.gif)?("|$)/g, (_match, p1, p2, id, _scale, p5, p6) => `${p1}${p2}${this.bttv(id)}/3x${p5 ?? ""}${p6}`).replace(/(^|")(https:\/\/cdn.7tv.app\/emote\/)([^/]+)\/(1|2|3|4)x.webp("|$)/g, (_match, p1, p2, id, _scale, p5) => `${p1}${p2}${this["7tv"](id)}/4x.webp${p5}`);
		},
		createEmoteNode(emote) {
			let url = emote.urls[4];
			if (emote.type === "twitch" || emote.type === "ffz" || emote.type === "bttv" || emote.type === "7tv") {
				const replacedId = this[emote.type](emote.id);
				if (replacedId !== emote.id) url = url.replace(emote.id, replacedId);
			}
			const span = document.createElement("span");
			span.className = "emote";
			span.style.backgroundImage = `url(${url})`;
			const img = document.createElement("img");
			img.src = url;
			span.append(img);
			return span;
		},
		renderText(text) {
			return [document.createTextNode(text)];
		},
		renderMessage(context) {
			const result = [];
			let index = 0;
			for (const emote of context.emotes) {
				if (emote.start > index) result.push(...this.renderText(context.message.substring(index, emote.start)));
				index = emote.end + 1;
				try {
					result.push(this.createEmoteNode(emote));
				} catch (e) {
					if (e instanceof RemoveImageError) result.push(...this.renderText(emote.name ?? context.message.substring(emote.start, index)));
					else throw e;
				}
			}
			if (context.message.length > index) result.push(...this.renderText(context.message.substring(index, context.message.length)));
			return result;
		},
		fixMessage(message, context) {
			if (context.render) {
				message.replaceChildren(...this.renderMessage(context));
				return;
			}
			let index = 0;
			const words = context.message.trim().split(/\s+/);
			let lastReplacedText = null;
			for (const node of message.childNodes) {
				if (node instanceof HTMLElement && node.classList.contains("emote") || node instanceof HTMLImageElement) {
					let text = null;
					try {
						this.fixEmote(node);
					} catch (e) {
						if (e instanceof RemoveImageError) {
							text = document.createTextNode(e.replaceWith ?? words[index] ?? "");
							node.replaceWith(text);
						} else throw e;
					}
					index++;
					lastReplacedText = text;
				}
				if (node instanceof Text && node.textContent != null) {
					const text = node.textContent.trim();
					if (text != "") {
						const textWords = text.split(/\s+/);
						if ((textWords[0].startsWith("!") || textWords[0].startsWith(".") || textWords[0].startsWith(",")) && lastReplacedText != null && lastReplacedText.textContent != null && lastReplacedText.textContent.endsWith(textWords[0])) lastReplacedText.textContent = lastReplacedText.textContent.substring(0, lastReplacedText.textContent.length - textWords[0].length);
						index += textWords.length;
						lastReplacedText = null;
					}
				}
			}
		},
		async load(api) {
			api.forClass("message", HTMLElement, this.fixMessage.bind(this));
			this["7tv"] = overrideFunction(api.overrides, "7tv", api.settings.showFrogEmotes);
			this.bttv = overrideFunction(api.overrides, "bttv", api.settings.showFrogEmotes);
			this.ffz = overrideFunction(api.overrides, "ffz", api.settings.showFrogEmotes);
			this.twitch = overrideFunction(api.overrides, "twitch", api.settings.showFrogEmotes);
		}
	};
	//#endregion
	//#region node_modules/hash-it/dist/es/index.mjs
	var XML_ELEMENT_REGEXP = /\[object ((?:HTML|MathML|SVG)(.*)Element)\]/;
	var CLASSES = {
		"[object Arguments]": 0,
		"[object Array]": 1,
		"[object ArrayBuffer]": 2,
		"[object AsyncFunction]": 3,
		"[object AsyncGeneratorFunction]": 4,
		"[object BigInt]": 5,
		"[object BigInt64Array]": 6,
		"[object BigUint64Array]": 7,
		"[object Blob]": 8,
		"[object Boolean]": 9,
		"[object DataView]": 10,
		"[object Date]": 11,
		"[object DocumentFragment]": 12,
		"[object Error]": 13,
		"[object Event]": 14,
		"[object Float16Array]": 15,
		"[object Float32Array]": 16,
		"[object Float64Array]": 17,
		"[object Function]": 18,
		"[object Generator]": 19,
		"[object GeneratorFunction]": 20,
		"[object Int8Array]": 21,
		"[object Int16Array]": 22,
		"[object Int32Array]": 23,
		"[object Map]": 24,
		"[object Number]": 25,
		"[object Object]": 26,
		"[object Promise]": 27,
		"[object RegExp]": 28,
		"[object Set]": 29,
		"[object SharedArrayBuffer]": 30,
		"[object String]": 31,
		"[object Symbol]": 32,
		"[object Uint8Array]": 33,
		"[object Uint8ClampedArray]": 34,
		"[object Uint16Array]": 35,
		"[object Uint32Array]": 36,
		"[object WeakMap]": 37,
		"[object WeakRef]": 38,
		"[object WeakSet]": 39,
		CUSTOM: 40,
		ELEMENT: 41
	};
	var ARRAY_LIKE_CLASSES = {
		"[object Arguments]": 1,
		"[object Array]": 2
	};
	var NON_ENUMERABLE_CLASSES = {
		"[object Blob]": 1,
		"[object Generator]": 2,
		"[object Promise]": 3,
		"[object WeakMap]": 4,
		"[object WeakRef]": 5,
		"[object WeakSet]": 6
	};
	var PRIMITIVE_WRAPPER_CLASSES = {
		"[object BigInt]": 1,
		"[object Boolean]": 2,
		"[object Number]": 3,
		"[object String]": 4,
		"[object Symbol]": 5
	};
	var TYPED_ARRAY_CLASSES = {
		"[object BigInt64Array]": 1,
		"[object BigUint64Array]": 2,
		"[object Float16Array]": 3,
		"[object Float32Array]": 4,
		"[object Float64Array]": 5,
		"[object Int8Array]": 6,
		"[object Int16Array]": 7,
		"[object Int32Array]": 8,
		"[object Uint8Array]": 9,
		"[object Uint8ClampedArray]": 10,
		"[object Uint16Array]": 11,
		"[object Uint32Array]": 12
	};
	var RECURSIVE_CLASSES = {
		"[object Arguments]": 1,
		"[object Array]": 2,
		"[object ArrayBuffer]": 3,
		"[object BigInt64Array]": 4,
		"[object BigUint64Array]": 5,
		"[object DataView]": 6,
		"[object Float16Array]": 7,
		"[object Float32Array]": 8,
		"[object Float64Array]": 9,
		"[object Int8Array]": 10,
		"[object Int16Array]": 11,
		"[object Int32Array]": 12,
		"[object Map]": 13,
		"[object Object]": 14,
		"[object Set]": 15,
		"[object SharedArrayBuffer]": 16,
		"[object Uint8Array]": 17,
		"[object Uint8ClampedArray]": 18,
		"[object Uint16Array]": 19,
		"[object Uint32Array]": 20,
		CUSTOM: 21
	};
	function imulFallback(first, second) {
		const firstHigh = first >>> 16 & 65535;
		const firstLow = first & 65535;
		const secondHigh = second >>> 16 & 65535;
		const secondLow = second & 65535;
		return firstLow * secondLow + (firstHigh * secondLow + firstLow * secondHigh << 16 >>> 0) | 0;
	}
	var imul = typeof Math.imul === "function" ? Math.imul : imulFallback;
	var MULTIPLIER_A = 2654435761;
	var MULTIPLIER_B = 1597334677;
	var SEED_A = 5381;
	var SEED_B = 52711;
	var TAG_BIGINT = 0;
	var TAG_BOOLEAN = 1;
	var TAG_EMPTY = 2;
	var TAG_FUNCTION = 3;
	var TAG_NUMBER = 4;
	var TAG_NUMBER_INTEGER = 5;
	var TAG_NUMBER_NAN = 6;
	var TAG_STRING = 7;
	var TAG_SYMBOL = 8;
	var TAG_KEY = 9;
	var CLASS_TAG_OFFSET = 16;
	var TAG_RECURSIVE = 2048;
	var TAG_ARRAY_PROPERTIES = 2049;
	var TAG_COUNT = 2051;
	var TAG_UNSUPPORTED = 2052;
	var CLASS_TAGS = Object.keys(CLASSES).reduce((tags, classType) => {
		tags[classType] = CLASSES[classType] + CLASS_TAG_OFFSET;
		return tags;
	}, {});
	var NON_ENUMERABLE_REF_IDS = /* @__PURE__ */ new WeakMap();
	var refId = 0;
	function getUnsupportedRefId(value) {
		const cached = NON_ENUMERABLE_REF_IDS.get(value);
		if (cached !== void 0) return cached;
		const id = ++refId;
		NON_ENUMERABLE_REF_IDS.set(value, id);
		return id;
	}
	function createFoldState() {
		return {
			a: 0,
			b: 0,
			cache: void 0,
			cycles: 0,
			depth: 0
		};
	}
	var { keys } = Object;
	var toString = Object.prototype.toString;
	var FLOAT_SCRATCH = typeof Float64Array === "function" ? /* @__PURE__ */ new Float64Array(1) : void 0;
	var FLOAT_BITS = FLOAT_SCRATCH && typeof Uint32Array === "function" ? new Uint32Array(FLOAT_SCRATCH.buffer) : void 0;
	var HAS_UINT8_ARRAY = typeof Uint8Array === "function";
	function avalanche(value) {
		value ^= value >>> 16;
		value = imul(value, 2246822507);
		value ^= value >>> 13;
		value = imul(value, 3266489909);
		return value ^ value >>> 16;
	}
	function foldString(string, tag, state) {
		let index = string.length;
		let hashA = imul(SEED_A ^ tag, MULTIPLIER_A);
		let hashB = imul(SEED_B ^ tag, MULTIPLIER_B);
		let charCode;
		hashA = imul(hashA ^ index, MULTIPLIER_A);
		hashB = imul(hashB ^ index, MULTIPLIER_B);
		while (index--) {
			charCode = string.charCodeAt(index);
			hashA = imul(hashA ^ charCode, MULTIPLIER_A);
			hashB = imul(hashB ^ charCode, MULTIPLIER_B);
		}
		state.a = avalanche(hashA);
		state.b = avalanche(hashB);
	}
	function foldNumber(value, tag, state) {
		let hashA = imul(SEED_A ^ tag, MULTIPLIER_A);
		let hashB = imul(SEED_B ^ tag, MULTIPLIER_B);
		if ((value | 0) === value) {
			hashA = imul(hashA ^ TAG_NUMBER_INTEGER, MULTIPLIER_A);
			hashB = imul(hashB ^ TAG_NUMBER_INTEGER, MULTIPLIER_B);
			hashA = imul(hashA ^ value, MULTIPLIER_A);
			hashB = imul(hashB ^ value, MULTIPLIER_B);
			state.a = avalanche(hashA);
			state.b = avalanche(hashB);
			return;
		}
		if (value !== value) {
			hashA = imul(hashA ^ TAG_NUMBER_NAN, MULTIPLIER_A);
			hashB = imul(hashB ^ TAG_NUMBER_NAN, MULTIPLIER_B);
			state.a = avalanche(hashA);
			state.b = avalanche(hashB);
			return;
		}
		if (FLOAT_BITS && FLOAT_SCRATCH) {
			FLOAT_SCRATCH[0] = value;
			const low = FLOAT_BITS[0];
			const high = FLOAT_BITS[1];
			hashA = imul(hashA ^ low, MULTIPLIER_A);
			hashB = imul(hashB ^ low, MULTIPLIER_B);
			hashA = imul(hashA ^ high, MULTIPLIER_A);
			hashB = imul(hashB ^ high, MULTIPLIER_B);
			state.a = avalanche(hashA);
			state.b = avalanche(hashB);
			return;
		}
		foldString("" + value, tag, state);
	}
	function mixA(accumulator, value) {
		return imul(accumulator ^ value, MULTIPLIER_A);
	}
	function mixB(accumulator, value) {
		return imul(accumulator ^ value, MULTIPLIER_B);
	}
	function foldBytes(bytes, tag, state) {
		const length = bytes.length;
		let hashA = imul(SEED_A ^ tag, MULTIPLIER_A);
		let hashB = imul(SEED_B ^ tag, MULTIPLIER_B);
		hashA = imul(hashA ^ length, MULTIPLIER_A);
		hashB = imul(hashB ^ length, MULTIPLIER_B);
		let index = 0;
		for (; index + 3 < length; index += 4) {
			const word = bytes[index] | bytes[index + 1] << 8 | bytes[index + 2] << 16 | bytes[index + 3] << 24;
			hashA = imul(hashA ^ word, MULTIPLIER_A);
			hashB = imul(hashB ^ word, MULTIPLIER_B);
		}
		for (; index < length; ++index) {
			hashA = imul(hashA ^ bytes[index], MULTIPLIER_A);
			hashB = imul(hashB ^ bytes[index], MULTIPLIER_B);
		}
		state.a = avalanche(hashA);
		state.b = avalanche(hashB);
	}
	function foldArrayBufferLike(buffer, byteOffset, byteLength, tag, state) {
		if (!HAS_UINT8_ARRAY) {
			foldString("UNSUPPORTED", tag, state);
			return;
		}
		foldBytes(new Uint8Array(buffer, byteOffset, byteLength), tag, state);
	}
	function foldComplexType(value, classType, state) {
		if (RECURSIVE_CLASSES[classType]) {
			foldRecursive(classType, value, state);
			return;
		}
		const tag = CLASS_TAGS[classType];
		if (classType === "[object Date]") {
			foldNumber(value.getTime(), tag, state);
			return;
		}
		if (classType === "[object RegExp]") {
			foldString(value.toString(), tag, state);
			return;
		}
		if (classType === "[object Event]") {
			foldEvent(value, state, tag);
			return;
		}
		if (classType === "[object Error]") {
			let hashA = imul(SEED_A ^ tag, MULTIPLIER_A);
			let hashB = imul(SEED_B ^ tag, MULTIPLIER_B);
			foldString("" + value.message, TAG_STRING, state);
			hashA = mixA(hashA, state.a);
			hashB = mixB(hashB, state.b);
			foldString("" + value.stack, TAG_STRING, state);
			hashA = mixA(hashA, state.a);
			hashB = mixB(hashB, state.b);
			state.a = avalanche(hashA);
			state.b = avalanche(hashB);
			return;
		}
		if (classType === "[object DocumentFragment]") {
			foldDocumentFragment(value, tag, state);
			return;
		}
		const element = classType.match(XML_ELEMENT_REGEXP);
		if (element) {
			const elementTag = CLASS_TAGS.ELEMENT;
			let hashA = imul(SEED_A ^ elementTag, MULTIPLIER_A);
			let hashB = imul(SEED_B ^ elementTag, MULTIPLIER_B);
			foldString(element[1], TAG_STRING, state);
			hashA = mixA(hashA, state.a);
			hashB = mixB(hashB, state.b);
			foldString(value.outerHTML, TAG_STRING, state);
			hashA = mixA(hashA, state.a);
			hashB = mixB(hashB, state.b);
			state.a = avalanche(hashA);
			state.b = avalanche(hashB);
			return;
		}
		if (NON_ENUMERABLE_CLASSES[classType]) {
			foldUnsupported(value, tag, state);
			return;
		}
		if (PRIMITIVE_WRAPPER_CLASSES[classType]) {
			foldString(value.toString(), tag, state);
			return;
		}
		foldRecursive("CUSTOM", value, state);
	}
	function foldUnsupported(value, tag, state) {
		let hashA = imul(SEED_A ^ tag, MULTIPLIER_A);
		let hashB = imul(SEED_B ^ tag, MULTIPLIER_B);
		hashA = imul(hashA ^ TAG_UNSUPPORTED, MULTIPLIER_A);
		hashB = imul(hashB ^ TAG_UNSUPPORTED, MULTIPLIER_B);
		const refId = getUnsupportedRefId(value);
		hashA = imul(hashA ^ refId, MULTIPLIER_A);
		hashB = imul(hashB ^ refId, MULTIPLIER_B);
		state.a = avalanche(hashA);
		state.b = avalanche(hashB);
	}
	function foldRecursive(classType, value, state) {
		var _a;
		const cache = (_a = state.cache) !== null && _a !== void 0 ? _a : state.cache = /* @__PURE__ */ new WeakMap();
		const cached = cache.get(value);
		if (cached != null) {
			if (typeof cached === "number") {
				++state.cycles;
				const tag = CLASS_TAGS[classType];
				let hashA = imul(SEED_A ^ tag, MULTIPLIER_A);
				let hashB = imul(SEED_B ^ tag, MULTIPLIER_B);
				hashA = imul(hashA ^ TAG_RECURSIVE, MULTIPLIER_A);
				hashB = imul(hashB ^ TAG_RECURSIVE, MULTIPLIER_B);
				hashA = imul(hashA ^ cached, MULTIPLIER_A);
				hashB = imul(hashB ^ cached, MULTIPLIER_B);
				state.a = avalanche(hashA);
				state.b = avalanche(hashB);
				return;
			}
			state.a = cached[0];
			state.b = cached[1];
			return;
		}
		const cycles = state.cycles;
		cache.set(value, state.depth++);
		foldRecursiveValue(classType, value, state);
		--state.depth;
		if (state.cycles === cycles) cache.set(value, [state.a, state.b]);
		else cache.delete(value);
	}
	var FLOAT_TYPED_ARRAY_CLASSES = {
		"[object Float16Array]": 1,
		"[object Float32Array]": 2,
		"[object Float64Array]": 3
	};
	function foldRecursiveValue(classType, value, state) {
		const tag = CLASS_TAGS[classType];
		if (classType === "[object Object]") {
			foldObject(value, state, tag);
			return;
		}
		if (ARRAY_LIKE_CLASSES[classType]) {
			foldArray(value, state, tag);
			return;
		}
		if (classType === "[object Map]") {
			foldMap(value, state, tag);
			return;
		}
		if (classType === "[object Set]") {
			foldSet(value, state, tag);
			return;
		}
		if (TYPED_ARRAY_CLASSES[classType]) {
			if (FLOAT_TYPED_ARRAY_CLASSES[classType]) foldFloatArray(value, tag, state);
			else foldArrayBufferLike(value.buffer, value.byteOffset, value.byteLength, tag, state);
			return;
		}
		if (classType === "[object ArrayBuffer]" || classType === "[object SharedArrayBuffer]") {
			foldArrayBufferLike(value, 0, value.byteLength, tag, state);
			return;
		}
		if (classType === "[object DataView]") {
			foldArrayBufferLike(value.buffer, value.byteOffset, value.byteLength, tag, state);
			return;
		}
		if (NON_ENUMERABLE_CLASSES[classType]) {
			foldUnsupported(value, tag, state);
			return;
		}
		foldObject(value, state, CLASS_TAGS.CUSTOM);
	}
	function foldFloatArray(value, tag, state) {
		const length = value.length;
		let hashA = imul(SEED_A ^ tag, MULTIPLIER_A);
		let hashB = imul(SEED_B ^ tag, MULTIPLIER_B);
		hashA = imul(hashA ^ length, MULTIPLIER_A);
		hashB = imul(hashB ^ length, MULTIPLIER_B);
		for (let index = 0; index < length; ++index) {
			foldNumber(value[index], TAG_NUMBER, state);
			hashA = mixA(hashA, state.a);
			hashB = mixB(hashB, state.b);
		}
		state.a = avalanche(hashA);
		state.b = avalanche(hashB);
	}
	function foldArray(value, state, tag) {
		const length = value.length;
		let hashA = imul(SEED_A ^ tag, MULTIPLIER_A);
		let hashB = imul(SEED_B ^ tag, MULTIPLIER_B);
		hashA = imul(hashA ^ length, MULTIPLIER_A);
		hashB = imul(hashB ^ length, MULTIPLIER_B);
		for (let index = 0; index < length; ++index) {
			foldValue(value[index], state);
			hashA = mixA(hashA, state.a);
			hashB = mixB(hashB, state.b);
		}
		const properties = keys(value);
		let start = properties.length;
		while (--start >= 0) {
			const key = properties[start];
			const asIndex = +key;
			if (asIndex >= 0 && asIndex < length && "" + asIndex === key) break;
		}
		if (++start !== properties.length) {
			hashA = imul(hashA ^ TAG_ARRAY_PROPERTIES, MULTIPLIER_A);
			hashB = imul(hashB ^ TAG_ARRAY_PROPERTIES, MULTIPLIER_B);
			const extras = properties.slice(start).sort();
			for (const property of extras) {
				foldString(property, TAG_KEY, state);
				hashA = mixA(hashA, state.a);
				hashB = mixB(hashB, state.b);
				foldValue(value[property], state);
				hashA = mixA(hashA, state.a);
				hashB = mixB(hashB, state.b);
			}
			hashA = imul(hashA ^ (extras.length ^ TAG_COUNT), MULTIPLIER_A);
			hashB = imul(hashB ^ (extras.length ^ TAG_COUNT), MULTIPLIER_B);
		}
		state.a = avalanche(hashA);
		state.b = avalanche(hashB);
	}
	function foldObject(value, state, tag) {
		const properties = keys(value).sort();
		const length = properties.length;
		let hashA = imul(SEED_A ^ tag, MULTIPLIER_A);
		let hashB = imul(SEED_B ^ tag, MULTIPLIER_B);
		hashA = imul(hashA ^ length, MULTIPLIER_A);
		hashB = imul(hashB ^ length, MULTIPLIER_B);
		for (let index = 0; index < length; ++index) {
			const property = properties[index];
			foldString(property, TAG_KEY, state);
			hashA = mixA(hashA, state.a);
			hashB = mixB(hashB, state.b);
			foldValue(value[property], state);
			hashA = mixA(hashA, state.a);
			hashB = mixB(hashB, state.b);
		}
		state.a = avalanche(hashA);
		state.b = avalanche(hashB);
	}
	var HAS_FLOAT64_ARRAY = typeof Float64Array === "function";
	function combine(hashA, hashB) {
		return (hashA >>> 0) * 2097152 + (hashB >>> 11);
	}
	var Order = HAS_FLOAT64_ARRAY ? Float64Array : Array;
	var ascending = HAS_FLOAT64_ARRAY ? void 0 : (first, second) => first - second;
	function foldOrdering(ordering, size, tag, state) {
		ordering.sort(ascending);
		let hashA = imul(SEED_A ^ tag, MULTIPLIER_A);
		let hashB = imul(SEED_B ^ tag, MULTIPLIER_B);
		hashA = imul(hashA ^ size, MULTIPLIER_A);
		hashB = imul(hashB ^ size, MULTIPLIER_B);
		for (let index = 0; index < size; ++index) {
			const member = ordering[index];
			const low = member >>> 0;
			const high = (member - low) / 4294967296;
			hashA = mixA(hashA, high);
			hashB = mixB(hashB, low);
			hashA = mixA(hashA, low);
			hashB = mixB(hashB, high);
		}
		state.a = avalanche(hashA);
		state.b = avalanche(hashB);
	}
	function foldMap(map, state, tag) {
		const size = map.size;
		const ordering = new Order(size);
		let index = 0;
		map.forEach((value, key) => {
			let entryA = imul(7431, MULTIPLIER_A);
			let entryB = imul(50661, MULTIPLIER_B);
			foldValue(key, state);
			entryA = mixA(entryA, state.a);
			entryB = mixB(entryB, state.b);
			foldValue(value, state);
			entryA = mixA(entryA, state.a);
			entryB = mixB(entryB, state.b);
			ordering[index++] = combine(avalanche(entryA), avalanche(entryB));
		});
		foldOrdering(ordering, size, tag, state);
	}
	function foldSet(set, state, tag) {
		const size = set.size;
		const ordering = new Order(size);
		let index = 0;
		set.forEach((value) => {
			foldValue(value, state);
			ordering[index++] = combine(state.a, state.b);
		});
		foldOrdering(ordering, size, tag, state);
	}
	function foldDocumentFragment(fragment, tag, state) {
		const children = fragment.children;
		const length = children.length;
		let hashA = imul(SEED_A ^ tag, MULTIPLIER_A);
		let hashB = imul(SEED_B ^ tag, MULTIPLIER_B);
		hashA = imul(hashA ^ length, MULTIPLIER_A);
		hashB = imul(hashB ^ length, MULTIPLIER_B);
		for (let index = 0; index < length; ++index) {
			foldString(children[index].outerHTML, TAG_STRING, state);
			hashA = mixA(hashA, state.a);
			hashB = mixB(hashB, state.b);
		}
		state.a = avalanche(hashA);
		state.b = avalanche(hashB);
	}
	function foldEvent(value, state, tag) {
		let hashA = imul(SEED_A ^ tag, MULTIPLIER_A);
		let hashB = imul(SEED_B ^ tag, MULTIPLIER_B);
		const fields = [
			value.bubbles,
			value.cancelBubble,
			value.cancelable,
			value.composed,
			value.currentTarget,
			value.defaultPrevented,
			value.eventPhase,
			value.isTrusted,
			value.returnValue,
			value.target,
			value.type
		];
		for (const field of fields) {
			foldValue(field, state);
			hashA = mixA(hashA, state.a);
			hashB = mixB(hashB, state.b);
		}
		state.a = avalanche(hashA);
		state.b = avalanche(hashB);
	}
	function foldValue(value, state) {
		const type = typeof value;
		if (value == null) {
			foldString("" + value, TAG_EMPTY, state);
			return;
		}
		if (type === "object") {
			foldComplexType(value, toString.call(value), state);
			return;
		}
		if (type === "string") {
			foldString(value, TAG_STRING, state);
			return;
		}
		if (type === "number") {
			foldNumber(value, TAG_NUMBER, state);
			return;
		}
		if (type === "function") {
			foldString(value.toString(), TAG_FUNCTION, state);
			return;
		}
		if (type === "symbol") {
			foldString(value.toString(), TAG_SYMBOL, state);
			return;
		}
		if (type === "boolean") {
			foldNumber(+value, TAG_BOOLEAN, state);
			return;
		}
		foldString("" + value, TAG_BIGINT, state);
	}
	function hash(value) {
		const state = createFoldState();
		foldValue(value, state);
		return (state.a >>> 0) * 2097152 + (state.b >>> 11);
	}
	//#endregion
	//#region src/streamelements/custom.ts
	license();
	var Boolean$1 = stringbool();
	var LoadEventDetail = /* @__PURE__ */ looseObject({ fieldData: /* @__PURE__ */ looseObject({
		showPronouns: /* @__PURE__ */ union([/* @__PURE__ */ pipe(stringbool(), /* @__PURE__ */ transform((value) => value ? ["api.pronouns.alejo.io", "pronoundb.org"] : [])), /* @__PURE__ */ pipe(/* @__PURE__ */ string(), /* @__PURE__ */ transform((list) => list.split(",").map((value) => value.trim())))]),
		showFrogEmotes: Boolean$1,
		capitalizePronouns: /* @__PURE__ */ optional(Boolean$1),
		fontFamily: /* @__PURE__ */ string(),
		fontSize: /* @__PURE__ */ number(),
		textColor: /* @__PURE__ */ string(),
		padding: /* @__PURE__ */ number(),
		border: Boolean$1,
		messageDelay: /* @__PURE__ */ pipe(/* @__PURE__ */ number(), /* @__PURE__ */ transform((value) => value * 1e3)),
		hideMessage: Boolean$1,
		messageHideDelay: /* @__PURE__ */ pipe(/* @__PURE__ */ number(), /* @__PURE__ */ transform((value) => value * 1e3)),
		hideCommands: Boolean$1,
		mutedChatters: /* @__PURE__ */ pipe(/* @__PURE__ */ string(), /* @__PURE__ */ transform((value) => new Set(value.split(/(\s|,)+/).map((chatter) => chatter.trim()).filter((chatter) => chatter != ""))))
	}) });
	var RANDOM_COLORS = [
		"#f7a6a7",
		"#f7d0a6",
		"#f7eda6",
		"#b4f7a6",
		"#a6d4f7",
		"#c8a6f7",
		"#f7a6ed",
		"#a6f7e8"
	];
	var EventDetail = /* @__PURE__ */ union([
		/* @__PURE__ */ object({
			listener: /* @__PURE__ */ literal("message"),
			event: /* @__PURE__ */ object({
				service: /* @__PURE__ */ string(),
				data: /* @__PURE__ */ pipe(/* @__PURE__ */ looseObject({
					badges: /* @__PURE__ */ _default(/* @__PURE__ */ array(/* @__PURE__ */ object({
						type: /* @__PURE__ */ string(),
						version: /* @__PURE__ */ string(),
						url: /* @__PURE__ */ string()
					})), []),
					displayColor: /* @__PURE__ */ optional(/* @__PURE__ */ string()),
					displayName: /* @__PURE__ */ string(),
					emotes: /* @__PURE__ */ pipe(/* @__PURE__ */ _default(/* @__PURE__ */ array(/* @__PURE__ */ any()), []), /* @__PURE__ */ transform((array) => {
						return array.map((item) => (/* @__PURE__ */ object({
							name: /* @__PURE__ */ string(),
							type: /* @__PURE__ */ string(),
							id: /* @__PURE__ */ string(),
							urls: /* @__PURE__ */ record(/* @__PURE__ */ union([/* @__PURE__ */ number(), /* @__PURE__ */ string()]), /* @__PURE__ */ string()),
							gif: /* @__PURE__ */ optional(/* @__PURE__ */ boolean()),
							start: /* @__PURE__ */ optional((/* @__PURE__ */ number()).check(/* @__PURE__ */ _nonnegative(), int())),
							end: /* @__PURE__ */ optional((/* @__PURE__ */ number()).check(/* @__PURE__ */ _nonnegative(), int()))
						})).safeParse(item)).flatMap((result) => {
							if (result.success) return [result.data];
							else return [];
						});
					})),
					tags: /* @__PURE__ */ looseObject({ emotes: /* @__PURE__ */ optional(/* @__PURE__ */ string()) }),
					msgId: /* @__PURE__ */ string(),
					nick: /* @__PURE__ */ string(),
					text: /* @__PURE__ */ string(),
					userId: /* @__PURE__ */ string()
				}), /* @__PURE__ */ transform((value) => {
					if (value.displayColor == null || value.displayColor == "") {
						const index = Math.abs(hash(value.userId)) % RANDOM_COLORS.length;
						return {
							...value,
							displayColor: RANDOM_COLORS[index]
						};
					}
					return value;
				}))
			})
		}),
		/* @__PURE__ */ object({
			listener: /* @__PURE__ */ literal("delete-messages"),
			event: /* @__PURE__ */ looseObject({ userId: /* @__PURE__ */ optional(/* @__PURE__ */ string()) })
		}),
		/* @__PURE__ */ object({
			listener: /* @__PURE__ */ literal("delete-message"),
			event: /* @__PURE__ */ looseObject({ msgId: /* @__PURE__ */ string() })
		})
	]);
	var MessageHandler = class {
		log = null;
		fieldData = null;
		features;
		actions;
		constructor(features) {
			this.features = features;
			this.actions = {};
		}
		renderMessage(event) {
			const badges = document.createElement("span");
			badges.className = "badges";
			const allBadges = event.data.badges.map((badge) => {
				const img = document.createElement("img");
				img.src = badge.url;
				img.classList.add("badge", `${badge.type}-icon`);
				return img;
			});
			badges.append(...allBadges);
			const pronouns = document.createElement("span");
			pronouns.className = "pronouns";
			const name = document.createElement("span");
			name.className = "name";
			name.dataset.color = event.data.displayColor;
			name.append(document.createTextNode(event.data.displayName.replace("\\s", " ")));
			const meta = document.createElement("span");
			meta.className = "meta";
			meta.append(badges, pronouns, name);
			const message = document.createElement("span");
			message.className = "message";
			message.append(document.createTextNode(event.data.text));
			const container = document.createElement("div");
			if (this.fieldData != null && !this.fieldData.hideMessage) container.style.setProperty("--message-hide-delay", "99999999s");
			container.dataset.userDisplayName = event.data.displayName;
			container.dataset.userName = event.data.nick;
			container.dataset.userId = event.data.userId;
			container.dataset.id = event.data.msgId;
			if (this.fieldData != null && this.fieldData.messageDelay > 0) {
				container.style.display = "none";
				setTimeout(() => container.style.display = "block", this.fieldData.messageDelay);
			}
			container.append(meta, message);
			const context = {
				emotes: event.data.emotes.filter((emote) => emote.start != null && emote.end != null),
				message: event.data.text,
				user: {
					id: event.data.userId,
					name: event.data.nick,
					displayName: event.data.displayName
				},
				render: true,
				service: event.service
			};
			this.runAction("message", message, context);
			this.runAction("name", name, context);
			this.runAction("pronouns", pronouns, context);
			this.runAction("badge", allBadges, context);
			return container;
		}
		handleMessage(event) {
			if (this.fieldData != null) {
				if (this.fieldData.hideCommands && event.data.text.startsWith("!")) return;
				if (this.fieldData.mutedChatters.has(event.data.nick) || this.fieldData.mutedChatters.has(event.data.displayName)) return;
			}
			this.log?.append(this.renderMessage(event));
		}
		handleEvent(obj) {
			if (obj instanceof CustomEvent) {
				const detail = EventDetail.safeParse(obj.detail);
				if (detail.success) {
					if (detail.data.listener === "message") this.handleMessage(detail.data.event);
					else if (detail.data.listener === "delete-messages") {
						const userId = detail.data.event.userId;
						if (userId == null) this.removeAllLogs();
						else this.removeAllBySelector("[data-user-id=\"" + userId + "\"]");
					} else if (detail.data.listener === "delete-message") this.removeAllBySelector("[data-id=\"" + detail.data.event.msgId + "\"]");
				} else console.log(detail.error);
			}
		}
		removeAllBySelector(selector) {
			document.querySelectorAll(selector).forEach((node) => node.remove());
		}
		removeAllLogs() {
			if (this.log != null) this.log.replaceChildren();
		}
		runAction(className, elements, context) {
			if (className in this.actions) {
				const elementsArray = Array.isArray(elements) ? elements : [elements];
				this.actions[className].forEach((action) => elementsArray.forEach((element) => action(element, context)));
			}
		}
		addAction(className, type, action) {
			if (!(className in this.actions)) this.actions[className] = [];
			this.actions[className].push((element, context) => {
				if (element instanceof type) action(element, context);
			});
		}
		async load(obj) {
			if (obj instanceof CustomEvent) {
				const detail = LoadEventDetail.parse(obj.detail);
				if (!detail.fieldData.border) document.body.style.filter = "none";
				this.log = document.getElementById("log");
				this.fieldData = detail.fieldData;
				const api = {
					forClass: this.addAction.bind(this),
					overrides,
					settings: {
						showFrogEmotes: detail.fieldData.showFrogEmotes,
						pronouns: detail.fieldData.showPronouns,
						capitalizePronouns: detail.fieldData.capitalizePronouns ?? true
					}
				};
				await Promise.all(this.features.map((feature) => feature.load(api)));
				window.addEventListener("onEventReceived", this.handleEvent.bind(this));
			}
		}
	};
	var handler = new MessageHandler([
		nameColor,
		emotes,
		twemoji,
		ffz,
		pronounsReplacer
	]);
	window.addEventListener("onWidgetLoad", handler.load.bind(handler));
	//#endregion
})();
/*!
Bundled license information:
This file was generated with the generate-license-file npm package!
https://www.npmjs.com/package/generate-license-file

The following npm package may be included in this product:

- fs-extra@8.1.0

This package contains the following license:

(The MIT License)

Copyright (c) 2011-2017 JP Richardson

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files
(the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify,
merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

-----------

The following npm packages may be included in this product:

- jsonfile@4.0.0
- jsonfile@5.0.0

These packages each contain the following license:

(The MIT License)

Copyright (c) 2012-2015, JP Richardson <jprichardson@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files
(the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify,
merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

-----------

The following npm package may be included in this product:

- universalify@0.1.2

This package contains the following license:

(The MIT License)

Copyright (c) 2017, Ryan Zimmerman <opensrc@ryanzim.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the 'Software'), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

-----------

The following npm package may be included in this product:

- events@3.3.0

This package contains the following license:

MIT

Copyright Joyent, Inc. and other Node contributors.

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the
following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
USE OR OTHER DEALINGS IN THE SOFTWARE.

-----------

The following npm package may be included in this product:

- color2k@2.0.4

This package contains the following license:

MIT License

Copyright (c) 2020 Rico Kahler

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

-----------

The following npm package may be included in this product:

- @twemoji/api@17.0.3

This package contains the following license:

MIT License

Copyright (c) 2022–present Jason Sofonia & Justine De Caires
Copyright (c) 2014–2021 Twitter

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

-----------

The following npm package may be included in this product:

- @twemoji/parser@17.0.2

This package contains the following license:

MIT License

Copyright (c) 2022–present Jason Sofonia & Justine De Caires
Copyright (c) 2018–2021 Twitter

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

-----------

The following npm package may be included in this product:

- zod@4.6.5

This package contains the following license:

MIT License

Copyright (c) 2025 Colin McDonnell

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

-----------

The following npm package may be included in this product:

- hash-it@7.1.1

This package contains the following license:

MIT License

Copyright (c) 2025 Tony Quetano

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

-----------

The following npm package may be included in this product:

- @inventivetalent/loading-cache@1.0.0

This package contains the following license:

MIT License

Copyright (c) 2020 Haylee Schäfer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

-----------

The following npm package may be included in this product:

- @inventivetalent/time@1.0.4

This package contains the following license:

MIT License

Copyright (c) 2021 Haylee Schäfer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

-----------

The following npm package may be included in this product:

- graceful-fs@4.2.11

This package contains the following license:

The ISC License

Copyright (c) 2011-2022 Isaac Z. Schlueter, Ben Noordhuis, and Contributors

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR
IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

-----------

The following npm package may be included in this product:

- animate.css@4.1.1

This package contains the following license:

The MIT License (MIT)

Copyright (c) 2020 Daniel Eden

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

-----------

The following files have their license information within the file itself:
- src/features/ffz.ts
- src/features/ffz.css
- streamlabs/custom.css
- streamlabs/custom.js
- streamelements/custom.css
- streamelements/custom.js

All other fies are distributed under the following license:

MIT License

Copyright (c) 2025 Alice ✨🌙 Luna <alice@liquidnya.dev>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

-----------

This file was generated with the generate-license-file npm package!
https://www.npmjs.com/package/generate-license-file

*/