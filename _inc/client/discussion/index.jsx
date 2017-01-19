/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import { getModule } from 'state/modules';
import { getSettings } from 'state/settings';
import { isDevMode, isUnavailableInDevMode } from 'state/connection';
import { isModuleFound as _isModuleFound } from 'state/search';
import QuerySite from 'components/data/query-site';
import { Comments } from './comments';
import { Subscriptions } from './subscriptions';

export const Discussion = React.createClass( {
	displayName: 'DiscussionSettings',

	render() {
		const commonProps = {
			settings: this.props.settings,
			getModule: this.props.module,
			isDevMode: this.props.isDevMode,
			isUnavailableInDevMode: this.props.isUnavailableInDevMode
		};

		let found = {
			comments: this.props.isModuleFound( 'comments' ),
			subscriptions: this.props.isModuleFound( 'subscriptions' )
		};

		if ( ! this.props.searchTerm && ! this.props.active ) {
			return <span />;
		}

		let commentsSettings = (
			<Comments
				{ ...commonProps }
			/>
		);
		let subscriptionsSettings = (
			<Subscriptions
				{ ...commonProps }
				siteRawUrl={ this.props.siteRawUrl }
			/>
		);

		return (
			<div>
				<QuerySite />
				{ found.comments && commentsSettings }
				{ found.subscriptions && subscriptionsSettings }
			</div>
		);
	}
} );

export default connect(
	( state ) => {
		return {
			module: module_name => getModule( state, module_name ),
			settings: getSettings( state ),
			isDevMode: isDevMode( state ),
			isUnavailableInDevMode: module_name => isUnavailableInDevMode( state, module_name ),
			isModuleFound: ( module_name ) => _isModuleFound( state, module_name ),
		}
	}
)( Discussion );
