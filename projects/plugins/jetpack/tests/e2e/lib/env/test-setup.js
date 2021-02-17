import logger from '../logger';
import {
	connectThroughWPAdmin,
	loginToWpcomIfNeeded,
	loginToWpSite,
} from '../flows/jetpack-connect';
import { execWpCommand } from '../utils-helper';
import fs from 'fs';
import path from 'path';
import config from 'config';
import chalk from 'chalk';

async function setupContext() {
	logger.debug( `>>>>> setupContext` );
	global.context = await global.browser.newContext( {
		viewport: {
			width: 1280,
			height: 1024,
		},
		recordVideo: {
			dir: global.VIDEO_DIR,
			//todo revisit video resolution with Playwright 1.9.0
			size: {
				width: 800,
				height: 600,
			},
		},
	} );

	global.page = await global.context.newPage();

	// todo this fails, fix it
	// page.on( 'dialog', async dialog => {
	// 	await dialog.accept();
	// } );

	// todo change user agent
	const userAgent = await page.evaluate( () => navigator.userAgent );
	logger.info( chalk.yellow( `User agent: ${ userAgent }` ) );
}

async function maybePreConnect() {
	const wpcomUser = 'defaultUser';
	const mockPlanData = true;
	const plan = 'free';

	await loginToWpcomIfNeeded( wpcomUser, mockPlanData );
	await loginToWpSite( mockPlanData );

	if ( process.env.SKIP_CONNECT ) {
		return;
	}

	const status = await connectThroughWPAdmin( { mockPlanData, plan } );

	if ( status !== 'already_connected' ) {
		const result = await execWpCommand( 'wp option get jetpack_private_options --format=json' );
		fs.writeFileSync(
			path.resolve( config.get( 'configDir' ), 'jetpack-private-options.txt' ),
			result.trim()
		);
	}
}

beforeAll( async () => {
	logger.debug( '>>>>> beforeAll' );
	await setupContext();
	await maybePreConnect();
	await global.context.close();
} );

beforeEach( async () => {
	logger.debug( '>>>>> beforeEach' );
	await setupContext();
	await page.goto( URL, { waitUntil: 'domcontentloaded' } );
} );

afterEach( async () => {
	logger.debug( '>>>>> afterEach' );
	await global.context.close();
} );

afterAll( async () => {
	logger.debug( '>>>>> afterAll' );
} );
