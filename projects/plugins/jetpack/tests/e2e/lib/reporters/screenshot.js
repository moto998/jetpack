/**
 * External dependencies
 */
import path from 'path';
import mkdirp from 'mkdirp';

const screenshotsPath = path.resolve( global.SCREENSHOTS_DIR, 'screenshots' );
const toFilename = s => s.replace( /[^a-z0-9.-]+/gi, '-' );

export async function takeScreenshot( currentBlock, name ) {
	mkdirp.sync( screenshotsPath );
	let filePath;

	const pages = context.pages().concat( context.backgroundPages() );

	await pages.forEach( p => {
		const fileName = toFilename( `${ new Date().toISOString() }-${ currentBlock }-${ name }.png` );
		filePath = path.join( screenshotsPath, fileName );
		p.screenshot( {
			path: filePath,
			fullPage: true,
		} );
	} );

	// todo: this should return an array of all screenshot paths instead of only the last one
	return filePath;
}
