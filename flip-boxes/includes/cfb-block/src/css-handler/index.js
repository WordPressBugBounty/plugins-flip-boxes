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

const FLIPBOX_BLOCK = 'cp/cool-flipbox-block';//for template compatible

/**
 * Flipbox block dhundo — root level + group/columns ke andar (templates).
 */
function editorHasFlipboxBlock() {
	const blockEditor = select( 'core/block-editor' );
	if ( ! blockEditor ) {
		return false;
	}
	if ( typeof blockEditor.getGlobalBlockCount === 'function' ) {
		return blockEditor.getGlobalBlockCount( FLIPBOX_BLOCK ) > 0;
	}
	const walk = ( blocks ) =>
		blocks?.some(
			( block ) =>
				block.name === FLIPBOX_BLOCK || walk( block.innerBlocks )
		) ?? false;
	return walk( blockEditor.getBlocks() );
}

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
			if ( editorHasFlipboxBlock() ) {
				isSavingCSS = true;
				savePostMeta();
			}
		}
	}
});


