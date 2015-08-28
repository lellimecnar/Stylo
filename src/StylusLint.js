import Stylus from 'stylus';
import Lexer from 'stylus/lib/lexer';
import Parser from 'stylus/lib/parser';
import File from 'vinyl';
import Path from 'path';
import merge from 'merge';

let files = [],
	isFile = (() => {
		let dummyKeys = JSON.stringify(Object.keys(new File()).sort());

		return function isFile(obj) {
			return (
				obj.constructor.name === 'File' &&
				JSON.stringify(Object.keys(obj).sort()) === dummyKeys
			);
		};
	})(),
	rules = null,
	ruleDefinitions = {};

function log() {
	
}

export default class StylusLint {
	static get ERROR() {
		return 0;
	}
	static get WARN() {
		return 1;
	}
	static get INFO() {
		return 2;
	}
	static get DEBUG() {
		return 3;
	}

	constructor() {
		throw new Error('StylusLint cannot be instantiated!');
	}

	static get Rule() {
		return StylusLintRule;
	}

	static addFile(file) {
		if (isFile(file)) {
			files.push(file);
		}
	}

	static defineRule(name, config) {
		ruleDefinitions[name] = new StylusLintRule(name, config);
	}

	static config(config) {
		rules = merge({
			NoImportant: true
		}, config || {});
	}

	static run(config) {
		if (typeof config !== 'undefined' || rules === null) {
			StylusLint.config(config);
		}

		files.some((file) => {
			let lex = new Lexer(file.contents.toString()),
				tok,
				val;

			while ('eos' != (tok = lex.next()).type) {
				val = tok.val || tok.name || tok.string;
				if (typeof val !== 'undefined') {
					val = val.val || val.name || val.string || val;

				}

				Object.keys(rules).forEach((key) => {
					let rule = ruleDefinitions[key],
						method = (typeof rules[key] === 'boolean') ?
							rules[key].toString() :
							'val';

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
		})
	}
}
