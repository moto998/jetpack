import TunnelManager from '../tunnel-manager';

const { chromium } = require( 'playwright' );
const mkdirp = require( 'mkdirp' );
const path = require( 'path' );
const fs = require( 'fs' );
const os = require( 'os' );

const DIR = path.join( os.tmpdir(), 'jest_pw_global_setup' );
const { HEADLESS, SLOWMO, DEVTOOLS } = process.env;

// Any globals defined here are only available in global-teardown and nowhere else!
// https://jestjs.io/docs/en/configuration.html#globalsetup-string
module.exports = async function () {
	console.log( '>>>>> global-setup' );
	global.tunnelManager = new TunnelManager();
	await global.tunnelManager.create( process.env.SKIP_CONNECT );

	// Launch a browser server that client can connect to
	global.browser = await chromium.launchServer( {
		headless: HEADLESS !== 'false',
		slowMo: parseInt( SLOWMO, 10 ) || 0,
		devtools: DEVTOOLS === 'true',
	} );
	mkdirp.sync( DIR );
	fs.writeFileSync( path.join( DIR, 'wsEndpoint' ), global.browser.wsEndpoint() );
};
