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
	global.page = await global.context.newPage();
	await maybePreConnect();
	// await global.page.close();
} );

beforeEach( async () => {
	logger.debug( '>>>>> beforeEach' );
	global.page = await global.context.newPage();

	// todo this fails, fix it
	// page.on( 'dialog', async dialog => {
	// 	await dialog.accept();
	// } );

	// todo change user agent
	const userAgent = await page.evaluate( () => navigator.userAgent );
	logger.info( chalk.yellow( `User agent: ${ userAgent }` ) );
} );

afterEach( async () => {
	logger.debug( '>>>>> afterEach' );
	// await global.page.close();
} );

afterAll( async () => {
	logger.debug( '>>>>> afterAll' );
} );
