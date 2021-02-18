const NodeEnvironment = require( 'jest-environment-node' );
const fs = require( 'fs' );
const path = require( 'path' );
const { chromium } = require( 'playwright' );
const os = require( 'os' );

const DIR = path.join( os.tmpdir(), 'jest_pw_global_setup' );
const { CI } = process.env;

class PlaywrightEnvironment extends NodeEnvironment {
	async setup() {
		console.log( '>>>>> pw-env-setup' );
		await super.setup();
		const wsEndpoint = fs.readFileSync( path.join( DIR, 'wsEndpoint' ), 'utf8' );
		if ( ! wsEndpoint ) {
			throw new Error( 'wsEndpoint not found' );
		}

		this.global.browser = await chromium.connect( {
			wsEndpoint,
		} );

		this.global.context = await this.global.browser.newContext( {
			viewport: {
				width: 1280,
				height: 1024,
			},
			recordVideo: {
				dir: this.global.VIDEO_DIR,
				//todo revisit video resolution with Playwright 1.9.0
				size: {
					width: 800,
					height: 600,
				},
			},
		} );
	}

	async teardown() {
		console.log( '>>>>> pw-env-teardown' );
		// await this.global.context.close();
		await super.teardown();
	}

	async handleTestEvent( event ) {
		let testName = 'na';

		if ( event.test ) {
			testName = `${ event.test.parent.name } - ${ event.test.name }`;
		}

		switch ( event.name ) {
			case 'setup':
				break;
			case 'add_hook':
				break;
			case 'add_test':
				break;
			case 'run_start':
				break;
			case 'test_skip':
				console.log( `SKIP: ${ testName }` );
				break;
			case 'test_todo':
				break;
			case 'start_describe_definition':
				break;
			case 'finish_describe_definition':
				break;
			case 'run_describe_start':
				break;
			case 'test_start':
				console.log( `START: ${ testName }` );
				break;
			case 'hook_start':
				break;
			case 'hook_success':
				break;
			case 'hook_failure':
				break;
			case 'test_fn_start':
				break;
			case 'test_fn_success':
				break;
			case 'test_fn_failure':
				break;
			case 'test_done':
				console.log( `DONE: ${ testName }` );

				if ( event.test.errors.length > 0 && this.global.page ) {
					console.log( `WITH ERRORS: ${ testName }` );
					const fileName = testName.replace( /\\W/g, '-' );
					const sFilePath = `${
						this.global.SCREENSHOTS_DIR
					}/${ fileName }_${ new Date().toISOString() }.png`;

					// take screenshot
					await this.global.page.screenshot( {
						path: sFilePath,
					} );

					// saves page html
					const bodyHTML = await this.global.page.evaluate( () => document.body.innerHTML );
					const htmlFilePath = `${
						this.global.LOGS_DIR
					}/${ fileName }_${ new Date().toISOString() }.html`;
					fs.writeFileSync( htmlFilePath, bodyHTML );

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
				break;
			case 'run_describe_finish':
				break;
			case 'run_finish':
				break;
			case 'teardown':
				break;
			case 'error':
				break;
			default:
				break;
		}
	}

	runScript( script ) {
		return super.runScript( script );
	}

	async logHTML( filePath ) {
		const bodyHTML = await page.evaluate( () => document.body.innerHTML );

		fs.writeFileSync( filePath, bodyHTML );
	}
}

module.exports = PlaywrightEnvironment;
