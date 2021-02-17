const NodeEnvironment = require( 'jest-environment-node' );
const fs = require( 'fs' );
const path = require( 'path' );
const { chromium } = require( 'playwright' );
const os = require( 'os' );

const DIR = path.join( os.tmpdir(), 'jest_pw_global_setup' );
const { CI } = process.env;

class PlaywrightEnvironment extends NodeEnvironment {
	async setup() {
		await super.setup();
		const wsEndpoint = fs.readFileSync( path.join( DIR, 'wsEndpoint' ), 'utf8' );
		if ( ! wsEndpoint ) {
			throw new Error( 'wsEndpoint not found' );
		}

		this.global.browser = await chromium.connect( {
			wsEndpoint,
		} );
	}

	async teardown() {
		await super.teardown();
	}

	async handleTestEvent( event ) {
		// console.log( event.name );
		let testName = 'na';

		if ( event.test ) {
			testName = `${ event.test.parent.name }_${ event.test.name }`;
		}

		if ( event.name === 'test_start' ) {
			console.log( `START: ${ testName }` );
		}

		if ( event.name === 'test_skip' ) {
			console.log( `SKIP: ${ testName }` );
		}

		if ( event.name === 'test_done' ) {
			console.log( `END: ${ testName }` );
		}

		if ( event.name === 'test_done' && event.test.errors.length > 0 && this.global.page ) {
			console.log( `WITH ERRORS: ${ testName }` );
			const filePath = `${ this.global.SCREENSHOTS_DIR }/${ testName.replace(
				/\\W/g,
				'-'
			) }_${ new Date().toISOString() }.png`;

			await this.global.page.screenshot( {
				path: filePath,
			} );

			if ( CI ) {
				// await logDebugLog();
				// logger.slack( {
				// 	type: 'failure',
				// 	message: { block: parentName, specName, err },
				// } );
				// if ( filePath ) {
				// 	logger.slack( { type: 'file', message: filePath } );
				// }
			}
		}
	}

	runScript( script ) {
		return super.runScript( script );
	}
}

module.exports = PlaywrightEnvironment;
