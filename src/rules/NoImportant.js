StylusLint.defineRule('NoImportant', {
	severity: StylusLint.ERROR,

	msg: '!important is forbidden',

	true(type, val, tok) {
		return (type === 'ident' && val === '!important');
	}
});
