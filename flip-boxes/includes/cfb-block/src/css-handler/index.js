/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import { debounce } from 'lodash';

import apiFetch from '@wordpress/api-fetch';

import {
	dispatch,
	select,
	subscribe
} from '@wordpress/data';

let isSavingCSS = false;

const { createNotice } = dispatch( 'core/notices' );

const savePostMeta = debounce( async() => {
	const { getCurrentPostId } = select( 'core/editor' );
	const postId = getCurrentPostId();
	createNotice(
		'info',
		__( 'Saving CSS…', 'cfb-blocks' ),
		{
			isDismissible: true,
			type: 'snackbar',
			id: 'saving-css'
		}
	);

	await apiFetch({ path: `cfb/v1/post_styles/${ postId }`, method: 'POST' });

	createNotice(
		'info',
		__( 'CSS saved.', 'cfb-blocks' ),
		{
			isDismissible: true,
			type: 'snackbar',
			id: 'saving-css'
		}
	);

	isSavingCSS = false;
}, 1000 );

subscribe( () => {
	if ( Boolean( window.cfbBlockGutenbergObject.isBlockEditor ) && select( 'core/editor' ) ) {
		const {
			isCurrentPostPublished,
			isSavingPost,
			isPublishingPost,
			isAutosavingPost,
		} = select( 'core/editor' );

		const isAutoSaving = isAutosavingPost();
		const isPublishing = isPublishingPost();
		const isSaving = isSavingPost();
		const postPublished = isCurrentPostPublished();

		if ( ( isPublishing || ( postPublished && isSaving ) ) && ! isAutoSaving && ! isSavingCSS ) {
			isSavingCSS = true;
			const blocks=wp.data.select('core/block-editor').getBlocks();
			const blockNames=Object.values(blocks).map((block)=>{
				return block.name;
			});

			if(blockNames.includes('cp/cool-flipbox-block')){
				savePostMeta();
			}
		}
	}
});
