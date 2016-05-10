/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import DashItem from 'components/dash-item';
import DashSectionHeader from 'components/dash-section-header';
import Spinner from 'components/spinner';

/**
 * Internal dependencies
 */
import QueryVaultPressData from 'components/data/query-vaultpress-data';
import {
	isModuleActivated as _isModuleActivated,
	activateModule,
	isActivatingModule,
	isFetchingModulesList as _isFetchingModulesList
} from 'state/modules';
import {
	getVaultPressScanThreatCount as _getVaultPressScanThreatCount,
	getVaultPressData as _getVaultPressData
} from 'state/at-a-glance';

const DashScan = React.createClass( {
	getContent: function() {
		if ( this.props.isModuleActivated( 'vaultpress' )  ) {
			let vpData = this.props.getVaultPressData();

			if ( vpData === 'N/A' ) {
				return(
					<DashItem label="Security Scan (VaultPress)">
						<Spinner />
					</DashItem>
				);
			}

			// Check for threats
			const threats = this.props.getScanThreats();
			if ( threats !== 0 ) {
				return(
					<DashItem label="Security Scan (VaultPress)" status="is-error">
						<h3>Uh oh, { threats } found!</h3>
						<p className="jp-dash-item__description"><a href="#">Do something. (null)</a></p>
					</DashItem>
				);
			}

			// All good
			if ( vpData.code === 'success' ) {
				return(
					<DashItem label="Security Scan (VaultPress)" status="is-working">
						<h3>No threats found, you're good to go!</h3>
						<p className="jp-dash-item__description">[number] files scanned, [time] hours ago.</p>
					</DashItem>
				);
			}
		}

		return(
			<DashItem label="Security Scan (VaultPress)" className="jp-dash-item__is-inactive" status="is-premium-inactive">
				<p className="jp-dash-item__description">To automatically scan your site for malicious threats, please <a href="#">upgrade your account (null)</a> or <a href="#">learn more (null)</a>.</p>
			</DashItem>
		);
	},

	render: function() {
		return(
			<div>
				<QueryVaultPressData />
				{ this.getContent() }
			</div>
		);
	}
} );

export default connect(
	( state ) => {
		return {
			isModuleActivated: ( module_name ) => _isModuleActivated( state, module_name ),
			isFetchingModulesList: () => _isFetchingModulesList( state ),
			getVaultPressData: () => _getVaultPressData( state ),
			getScanThreats: () => _getVaultPressScanThreatCount( state )
		};
	},
	( dispatch ) => {
		return {
			activateModule: ( slug ) => {
				return dispatch( activateModule( slug ) );
			}
		};
	}
)( DashScan );