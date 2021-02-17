/**
 * For a detailed explanation of configuration properties, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

const OUTPUT_DIR = 'output';
const REPORTS_DIR = `${ OUTPUT_DIR }/reports`;

if ( process.env.E2E_DEBUG ) {
	process.env.DEBUG = 'pw:browser|api|error';
	process.env.HEADLESS = 'false';
}

module.exports = {
	testRunner: 'jest-circus/runner',
	globalSetup: '<rootDir>/lib/env/global-setup.js',
	globalTeardown: '<rootDir>/lib/env/global-teardown.js',
	setupFilesAfterEnv: [ '<rootDir>/lib/env/test-setup.js' ],
	testEnvironment: '<rootDir>/lib/env/playwright-environment.js',
	globals: {
		OUTPUT_DIR,
		REPORTS_DIR: `${ OUTPUT_DIR }/reports`,
		VIDEO_DIR: `${ OUTPUT_DIR }/video`,
		LOGS_DIR: `${ OUTPUT_DIR }/logs`,
		SCREENSHOTS_DIR: `${ OUTPUT_DIR }/screenshots`,
	},
	testMatch: [ '**/specs/**/*.test.js' ],
	verbose: true,
	reporters: [
		'default',
		[
			'jest-junit',
			{
				suiteName: 'E2E Jetpack tests',
				outputDirectory: REPORTS_DIR,
				outputName: 'junit-results.xml',
				uniqueOutputName: 'true',
			},
		],
		[
			'jest-html-reporters',
			{
				publicPath: `${ REPORTS_DIR }/html-reporter`,
				filename: 'test-report.html',
				expand: true,
			},
		],
		[
			'jest-stare',
			{
				resultDir: `${ REPORTS_DIR }/jest-stare`,
				reportTitle: 'jest-stare!',
			},
		],
	],
};
