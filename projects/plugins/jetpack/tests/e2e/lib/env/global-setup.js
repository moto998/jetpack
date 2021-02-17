import TunnelManager from '../tunnel-manager';

const { chromium } = require( 'playwright' );
const mkdirp = require( 'mkdirp' );
const path = require( 'path' );
const fs = require( 'fs' );
const os = require( 'os' );

const DIR = path.join( os.tmpdir(), 'jest_pw_global_setup' );
const { HEADLESS, SLOWMO, DEVTOOLS } = process.env;

module.exports = async function () {
	console.log( '>>>>> global-setup' );
	global.tunnelManager = new TunnelManager();
	const tunnelUrl = await global.tunnelManager.create( process.env.SKIP_CONNECT );
	global.URL = tunnelUrl.replace( 'http:', 'https:' );
	console.log( global.URL );

	// Launch a browser server that client can connect to
	global.browser = await chromium.launchServer( {
		headless: HEADLESS !== 'false',
		slowMo: parseInt( SLOWMO, 10 ) || 0,
		devtools: DEVTOOLS === 'true',
	} );
	mkdirp.sync( DIR );
	fs.writeFileSync( path.join( DIR, 'wsEndpoint' ), global.browser.wsEndpoint() );
};
