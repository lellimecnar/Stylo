'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _stylus = require('stylus');

var _stylus2 = _interopRequireDefault(_stylus);

var _stylusLibLexer = require('stylus/lib/lexer');

var _stylusLibLexer2 = _interopRequireDefault(_stylusLibLexer);

var _stylusLibParser = require('stylus/lib/parser');

var _stylusLibParser2 = _interopRequireDefault(_stylusLibParser);

var _vinyl = require('vinyl');

var _vinyl2 = _interopRequireDefault(_vinyl);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _merge = require('merge');

var _merge2 = _interopRequireDefault(_merge);

var files = [],
    isFile = (function () {
	var dummyKeys = JSON.stringify(Object.keys(new _vinyl2['default']()).sort());

	return function isFile(obj) {
		return obj.constructor.name === 'File' && JSON.stringify(Object.keys(obj).sort()) === dummyKeys;
	};
})(),
    rules = null,
    ruleDefinitions = {};

function log() {}

var StylusLint = (function () {
	_createClass(StylusLint, null, [{
		key: 'ERROR',
		get: function get() {
			return 0;
		}
	}, {
		key: 'WARN',
		get: function get() {
			return 1;
		}
	}, {
		key: 'INFO',
		get: function get() {
			return 2;
		}
	}, {
		key: 'DEBUG',
		get: function get() {
			return 3;
		}
	}]);

	function StylusLint() {
		_classCallCheck(this, StylusLint);

		throw new Error('StylusLint cannot be instantiated!');
	}

	_createClass(StylusLint, null, [{
		key: 'addFile',
		value: function addFile(file) {
			if (isFile(file)) {
				files.push(file);
			}
		}
	}, {
		key: 'defineRule',
		value: function defineRule(name, config) {
			ruleDefinitions[name] = new StylusLintRule(name, config);
		}
	}, {
		key: 'config',
		value: function config(_config) {
			rules = (0, _merge2['default'])({
				NoImportant: true
			}, _config || {});
		}
	}, {
		key: 'run',
		value: function run(config) {
			if (typeof config !== 'undefined' || rules === null) {
				StylusLint.config(config);
			}

			files.some(function (file) {
				var lex = new _stylusLibLexer2['default'](file.contents.toString()),
				    tok = undefined,
				    val = undefined;

				while ('eos' != (tok = lex.next()).type) {
					val = tok.val || tok.name || tok.string;
					if (typeof val !== 'undefined') {
						val = val.val || val.name || val.string || val;
					}

					Object.keys(rules).forEach(function (key) {
						var rule = ruleDefinitions[key],
						    method = typeof rules[key] === 'boolean' ? rules[key].toString() : 'val';

						if (!rule) {
							throw new Error(key + ' is not a valid rule');
						}

						if (rule[method](tok.type, val, tok)) {
							if (rule.severity === StylusLint.ERROR) {
								console.error(rule.msg);
							}
						}
					});
				}
			});
		}
	}, {
		key: 'Rule',
		get: function get() {
			return StylusLintRule;
		}
	}]);

	return StylusLint;
})();

exports['default'] = StylusLint;

var StylusLintRule = (function () {
	function StylusLintRule(name, config) {
		var _this = this;

		_classCallCheck(this, StylusLintRule);

		this.severity = StylusLintRule.WARN;

		Object.defineProperty(this, 'name', {
			value: name
		});
		Object.keys(config).forEach(function (key) {
			if (key === 'msg') {
				Object.defineProperty(_this, key, {
					get: function get() {
						if (typeof config[key] === 'function') {
							return config[key]();
						}
						return config[key];
					}
				});
			} else {
				_this[key] = config[key];
			}
		});
	}

	_createClass(StylusLintRule, [{
		key: 'true',
		value: function _true() {}
	}, {
		key: 'false',
		value: function _false() {}
	}, {
		key: 'val',
		value: function val() {}
	}, {
		key: 'msg',
		get: function get() {
			return this.name + ' is invalid';
		}
	}]);

	return StylusLintRule;
})();

StylusLint.defineRule('NoImportant', {
	severity: StylusLint.ERROR,

	msg: '!important is forbidden',

	'true': function _true(type, val, tok) {
		return type === 'ident' && val === '!important';
	}
});
module.exports = exports['default'];