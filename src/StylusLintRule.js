class StylusLintRule {
	severity = StylusLintRule.WARN;

	constructor(name, config) {
		Object.defineProperty(this, 'name', {
			value: name
		});
		Object.keys(config).forEach((key) => {
			if (key === 'msg') {
				Object.defineProperty(this, key, {
					get: () => {
						if (typeof config[key] === 'function') {
							return config[key]();
						}
						return config[key];
					}
				});
			} else {
				this[key] = config[key];
			}
		});
	}

	get msg() {
		return this.name + ' is invalid';
	}

	true() {

	}

	false() {

	}

	val() {

	}
}
