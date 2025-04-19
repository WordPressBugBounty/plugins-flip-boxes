/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
/**
 * Internal dependencies
 */
import metadata from './block.json';
// import { flipIcon as icon } from '../../helpers/icons.js';
import edit from './edit.js';
import save from './save.js';
// css-handler to save css in post meta using api 
import './css-handler/index.js';

const { name } = metadata;

const iconImg=window.cfbBlockGutenbergObject.cfbBlockIcon;

const icon=<img src={iconImg} className="cfb-block-dashboard-logo" width="30px"></img>

registerBlockType( name, {
	...metadata,
	title: __( 'Cool Flipbox', 'cfb-block' ),
	description: __( 'Dynamically highlight content with the animated Cool Flipbox Block.', 'cfb-block' ),
	icon,
	keywords: [
		'flip box', 'cool flipbox', 'flipbox', 'animation'
	],
	edit,
	save,
	example: {
		attributes: {
			preview: true
		}
	}
});
