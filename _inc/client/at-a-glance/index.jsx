/**
 * External dependencies
 */
import React from 'react';
import Card from 'components/card';
import SectionHeader from 'components/section-header';
import DashItem from 'components/dash-item';
import DashSectionHeader from 'components/dash-section-header';
import ExpandedCard from 'components/expanded-card';

/**
 * Internal dependencies
 */
import DashStats from './stats';
import DashProtect from './protect';
import DashMonitor from './monitor';
import DashScan from './scan';
import DashAkismet from './akismet';
import DashBackups from './backups';
import DashPluginUpdates from './plugins';
import DashPhoton from './photon';
import DashSiteVerify from './site-verification';

export default ( props ) =>
	<div>
		<DashStats { ...props } />

		{
			// Site Security
		}
		<DashSectionHeader
			label="Site Security"
			settingsPath="#security"
			externalLink="Manage Security on WordPress.com"
			externalLinkPath={ 'https://wordpress.com/settings/security/' + window.Initial_State.rawUrl } />

		<DashProtect { ...props } />
		<DashScan { ...props } />
		<DashMonitor { ...props } />

		{
			// Site Health
		}
		<DashSectionHeader
			label="Site Health"
			settingsPath="#health" />

		<DashAkismet { ...props } />
		<DashBackups { ...props } />
		<DashPluginUpdates { ...props } />

		{
			// Traffic Tools
		}
		<DashSectionHeader
			label="Traffic Tools"
			settingsPath="#engagement" />
		<DashPhoton { ...props } />
		<DashSiteVerify { ...props } />

		<Card>
			<p className="jp-dash-item__description">[make dismissable notice] What would you like to see on your Jetpack Dashboard. <a href="https://jetpack.com/contact" target="_blank">Send us some feedback and let us know!</a></p>
		</Card>
	</div>
