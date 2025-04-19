/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import { trash } from '@wordpress/icons';

import {
	__experimentalColorGradientControl as ColorGradientControl,
	MediaPlaceholder,
	MediaReplaceFlow
} from '@wordpress/block-editor';

import {
	FocalPointPicker,
	MenuItem,
	SelectControl
} from '@wordpress/components';

import { useInstanceId } from '@wordpress/compose';

import { Fragment } from '@wordpress/element';

/**
 * Internal dependencies
 */
import './editor.scss';
import ControlPanelControl from '../control-panel-control/index.js';
import ToogleGroupControl from '../toogle-group-control/index.js';

const BackgroundSelectorControl = ({
	backgroundType,
	backgroundColor,
	image,
	gradient,
	backgroundAttachment,
	backgroundRepeat,
	backgroundSize,
	focalPoint,
	changeImage,
	changeColor,
	removeImage,
	changeBackgroundType,
	changeGradient,
	changeBackgroundAttachment,
	changeBackgroundRepeat,
	changeBackgroundSize,
	changeFocalPoint,
	currentSide,
	setAttributes
}) => {
	const instanceId = useInstanceId( BackgroundSelectorControl );

	const id = `inspector-background-selector-control-${ instanceId }`;

	return (
		<div id={ id } className="components-base-control cfb-background-selector-control">
			<ToogleGroupControl
				value={ backgroundType }
				options={[
					{
						label: __( 'Color', 'cfb-blocks' ),
						value: 'color'
					},
					{
						label: __( 'Image', 'cfb-blocks' ),
						value: 'image'
					},
					{
						label: __( 'Gradient', 'cfb-blocks' ),
						value: 'gradient'
					}
				]}
				onChange={ changeBackgroundType }
			/>

			{
				( 'color' === backgroundType || undefined === backgroundType ) && (
					<ColorGradientControl
						label={ __( 'Background Color', 'cfb-blocks' ) }
						colorValue={ backgroundColor }
						onColorChange={ (v)=>{
							const attr={};
							const value='undefined' === typeof v ? 'transparent' : v;
							attr[`${currentSide}BackgroundColor`]=value;
							setAttributes(attr); 
						}
					}
					/>
				)
			}
			{
				'image' === backgroundType && (
					image?.url ? (
						<Fragment>
							<FocalPointPicker
								label={ __( 'Focal point picker', 'cfb-blocks' ) }
								url={ image.url }
								value={ focalPoint }
								onDragStart={ changeFocalPoint }
								onDrag={ changeFocalPoint }
								onChange={ changeFocalPoint }
							/>

							<div className="cfb-background-image-manage">
								<MediaReplaceFlow
									name={ __( 'Manage Image', 'cfb-blocks' ) }
									mediaURL={ image.url }
									mediaId={ image?.id }
									accept="image/*"
									allowedTypes={ [ 'image' ] }
									onSelect={ changeImage }
								>
									<MenuItem
										icon={ trash }
										onClick={ removeImage }
									>
										{ __( 'Clear Image', 'cfb-blocks' ) }
									</MenuItem>
								</MediaReplaceFlow>
							</div>

							<ControlPanelControl
								label={ __( 'Background Settings', 'cfb-blocks' ) }
							>
								<SelectControl
									label={ __( 'Background Attachment', 'cfb-blocks' ) }
									value={ backgroundAttachment }
									options={ [
										{ label: __( 'Scroll', 'cfb-blocks' ), value: 'scroll' },
										{ label: __( 'Fixed', 'cfb-blocks' ), value: 'fixed' },
										{ label: __( 'Local', 'cfb-blocks' ), value: 'local' }
									] }
									onChange={ changeBackgroundAttachment }
								/>

								<SelectControl
									label={ __( 'Background Repeat', 'cfb-blocks' ) }
									value={ backgroundRepeat }
									options={ [
										{ label: __( 'Repeat', 'cfb-blocks' ), value: 'repeat' },
										{ label: __( 'No-repeat', 'cfb-blocks' ), value: 'no-repeat' }
									] }
									onChange={ changeBackgroundRepeat }
								/>

								<SelectControl
									label={ __( 'Background Size', 'cfb-blocks' ) }
									value={ backgroundSize }
									options={ [
										{ label: __( 'Auto', 'cfb-blocks' ), value: 'auto' },
										{ label: __( 'Cover', 'cfb-blocks' ), value: 'cover' },
										{ label: __( 'Contain', 'cfb-blocks' ), value: 'contain' }
									] }
									onChange={ changeBackgroundSize }
								/>
							</ControlPanelControl>
						</Fragment>
					) : (
						<Fragment>
							<br />

							<MediaPlaceholder
								icon="format-image"
								labels={ {
									title: __( 'Background Image', 'cfb-blocks' ),
									name: __( 'an image', 'cfb-blocks' )
								} }
								value={ image?.id }
								onSelect={ changeImage }
								accept="image/*"
								allowedTypes={ [ 'image' ] }
							/>
						</Fragment>
					)
				)
			}
			{
				'gradient' === backgroundType && (
					<ColorGradientControl
						label={ __( 'Background Gradient', 'cfb-blocks' ) }
						gradientValue={ gradient }
						disableCustomColors={ true }
						onGradientChange={ changeGradient }
						clearable={ false }
					/>
				)
			}
		</div>
	);
};

export default BackgroundSelectorControl;
