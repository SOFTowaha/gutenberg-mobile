/** @format */

const defaultPlatform = 'android';
const rnPlatform = process.env.TEST_RN_PLATFORM || defaultPlatform;
if ( process.env.TEST_RN_PLATFORM ) {
	// eslint-disable-next-line no-console
	console.log( 'Setting RN platform to: ' + process.env.TEST_RN_PLATFORM );
} else {
	// eslint-disable-next-line no-console
	console.log( 'Setting RN platform to: default (' + defaultPlatform + ')' );
}

const ignorePaths = [ '/node_modules/', '/gutenberg/' ];
if ( ! process.env.TEST_RN_ON_DEVICE ) {
	ignorePaths.push( '__device-tests__' );
}

module.exports = {
	preset: 'jest-react-native',
	testEnvironment: 'jsdom',
	testPathIgnorePatterns: ignorePaths,
	moduleFileExtensions: [
		'native.js',
		'android.js',
		'ios.js',
		'js',
		'native.json',
		'android.json',
		'ios.json',
		'json',
		'native.jsx',
		'android.jsx',
		'ios.jsx',
		'jsx',
		'node',
	],
	moduleNameMapper: {
		'@wordpress\\/(blocks|editor)$': '<rootDir>/gutenberg/$1',
		'@wordpress\\/(data|element|deprecated)$': '<rootDir>/gutenberg/packages/$1',
		'@gutenberg': '<rootDir>/gutenberg',

		// Mock the CSS modules. See https://facebook.github.io/jest/docs/en/webpack.html#handling-static-assets
		'\\.(scss)$': '<rootDir>/__mocks__/styleMock.js',
	},
	haste: {
		defaultPlatform: rnPlatform,
		platforms: [ 'android', 'ios', 'native' ],
		providesModuleNodeModules: [ 'react-native' ],
	},
};
