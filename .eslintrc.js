module.exports = {
	extends: '@d-fischer',

	rules: {
		'@typescript-eslint/ban-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'prefer-rest-params': 'off',
		'jsdoc/check-tag-names': [
			'error',
			{
				definedTags: ['inheritDoc', 'expandParams', 'hideProtected', 'eventListener']
			}
		]
	}
};
