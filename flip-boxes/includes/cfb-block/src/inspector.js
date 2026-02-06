/**
 * External dependencies
 */
import {
	alignCenter,
	alignLeft,
	alignRight,
	currencyEuro,
	media
} from '@wordpress/icons';
import FontAwesomePicker from './components/font-awesome-control/index.js';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import {
	isEmpty,
	isNumber,
	pick
} from 'lodash';

import {
	__experimentalColorGradientControl as ColorGradientControl,
	InspectorControls,
	PanelColorSettings,
	MediaPlaceholder
} from '@wordpress/block-editor';

import {
	BaseControl,
	Button,
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
	__experimentalUnitControl as UnitControl,
	__experimentalBoxControl as BoxControl,
	TabPanel,
	Card,
	CardBody
} from '@wordpress/components';

import {
	Fragment
} from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	BackgroundSelectorControl,
	ButtonToggleControl,
	ControlPanelControl,
	ToogleGroupControl,
	TypographyControl
} from './components/index.js';

import {
	mergeBoxDefaultValues,
	removeBoxDefaultValues,
	stringToBox,
	_px,
	numberToBox
} from './helpers/helper-functions.js';

import { alignBottom, alignTop, alignCenter as cfbAlignCenter } from './helpers/icons.js';

const Inspector = ({
	attributes,
	setAttributes,
	setSide,
	currentSide
}) => {

	const changeBoxShadowColor = value => {
		setAttributes({
			boxShadowColor: (100 > attributes.boxShadowColorOpacity && value?.includes('var(')) ?
				getComputedStyle(document.documentElement, null).getPropertyValue(value?.replace('var(', '')?.replace(')', '')) :
				value
		});
	};

	const changeBoxShadowColorOpacity = value => {
		const changes = { boxShadowColorOpacity: value };
		if (100 > value && attributes.boxShadowColor?.includes('var(')) {
			changes.boxShadowColor = getComputedStyle(document.documentElement, null).getPropertyValue(attributes.boxShadowColor.replace('var(', '').replace(')', ''));
		}
		setAttributes(changes);
	};

	const coolFlipDirectionBtn = <ButtonToggleControl
		label={__('Current Side', 'cfb-blocks')}
		options={[
			{
				label: __('Front', 'cfb-blocks'),
				value: 'front'
			},
			{
				label: __('Back', 'cfb-blocks'),
				value: 'back'
			}
		]}
		value={currentSide ?? 'none'}
		onChange={v => {
			setSide(v);
		}}
		className='cfb-block-direction-selector'
	/>

	const coolFlipboxReviewBox = <PanelBody title={__("Please Share Your Valuable Feedback.", "timeline-block")}>
		<CardBody className={"cfb-block-review-tab"}>{__("We hope you liked our plugin created Flipbox. Please share your valuable feedback.", "cfb-block")}<br></br><a href="https://wordpress.org/support/plugin/flip-boxes/reviews/#new-post" className="components-button is-primary is-small" target="_blank" >Rate Us<span> ★★★★★</span></a>
		</CardBody>
	</PanelBody>

	const coolFlipboxSettings = <CardBody>
		<Fragment>
			{coolFlipDirectionBtn}
			<PanelBody
				title={__('Flip Settings', 'cfb-blocks')}
			>
				<SelectControl
					label={__('Flip Direction', 'cfb-blocks')}
					value={attributes.animType}
					options={[
						{ label: __('Bottom to Top', 'cfb-blocks'), value: 'flipX' },
						{ label: __('Top to Bottom', 'cfb-blocks'), value: 'flipX-rev' },
						{ label: __('Left to Right', 'cfb-blocks'), value: 'flipY' },
						{ label: __('Right to Left', 'cfb-blocks'), value: 'flipY-rev' }
					]}
					onChange={animType => setAttributes({ animType })}
				/>
			</PanelBody>
			<PanelBody
				title={__(`${currentSide} Side Content`, 'cfb-blocks')}
				initialOpen={false}
			>
				<ToogleGroupControl
					value={attributes[`${currentSide}ContentType`] ?? 'none'}
					options={[
						{
							label: __('None', 'cfb-blocks'),
							value: 'none'
						},
						{
							label: __('Image', 'cfb-blocks'),
							value: 'image'
						},
						{
							label: __('Icon', 'cfb-blocks'),
							value: 'icon'
						}
					]}
					onChange={v => {
						const attrs = {};
						attrs[`${currentSide}ContentType`] = !isEmpty(v) && 'none' !== v ? v : 'none';
						if (isEmpty(v) || 'none' === v) {
							attrs[`${currentSide}Media`] = undefined;
						}
						setAttributes(attrs);
					}}
				/>
				{
					'image' === attributes[`${currentSide}ContentType`] && (
						<Fragment>
							<BaseControl
								label={__('Media Image', 'cfb-blocks')}
								help={__('Set an image as showcase.', 'cfb-blocks')}
							>
								{!(attributes[`${currentSide}Media`]?.url) ? (
									<MediaPlaceholder
										labels={{
											title: __('Media Image', 'cfb-blocks')
										}}
										accept="image/*"
										allowedTypes={['image']}
										value={attributes[`${currentSide}Media`]}
										onSelect={
											value => {
												const attr = {};
												attr[`${currentSide}Media`] = pick(value, ['id', 'alt', 'url']),
													attr[`${currentSide}MediaHeight`] = '100%',
													attr[`${currentSide}MediaWidth`] = _px(value?.sizes?.medium?.width)
												setAttributes(attr);
											}
										}
									/>
								) : (
									<BaseControl
									>
										<img
											src={attributes[`${currentSide}Media`].url}
											alt={attributes[`${currentSide}Media`].alt}
											style={{
												border: '2px solid var( --wp-admin-theme-color)',
												maxHeight: '250px'
											}}
										/>
										<Button
											isSecondary
											onClick={() => {
												const attr = {};
												attr[`${currentSide}Media`] = undefined;
												setAttributes(attr)
											}}
										>
											{__('Remove image', 'cfb-blocks')}
										</Button>
									</BaseControl>
								)}
							</BaseControl>
							<UnitControl
								onChange={MediaWidth => {
									const attr = {};
									attr[`${currentSide}MediaWidth`] = MediaWidth;
									setAttributes(attr)
								}}
								label={__('Media Width', 'cfb-blocks')}
								isUnitSelectTabbable
								isResetValueOnUnitChange
								value={_px(attributes[`${currentSide}MediaWidth`])}
							/>
							<br />
							<UnitControl
								onChange={MediaHeight => {
									const attr = {};
									attr[`${currentSide}MediaHeight`] = MediaHeight;
									setAttributes(attr)
								}}
								label={__('Media Height', 'cfb-blocks')}
								isUnitSelectTabbable
								isResetValueOnUnitChange
								value={_px(attributes[`${currentSide}MediaHeight`])}
							/>
						</Fragment>
					)
				}
				{'icon' === attributes[`${currentSide}ContentType`] &&
					<Fragment>
						<FontAwesomePicker
							label={__('Icon Picker', 'cfb-blocks')}
							attrName={`${currentSide}IconData`}
							iconObj={attributes[`${currentSide}IconData`]}
							fontSizeLabel={`${currentSide}IconSize`}
							fontSize={attributes[`${currentSide}IconSize`]}
							setAttributes={setAttributes}
							fontColorLabel={[`${currentSide}IconColor`]}
							fontColor={attributes[`${currentSide}IconColor`]}
						/>
					</Fragment>
				}
			</PanelBody>
			<PanelBody
				title={__(`${currentSide} Alignment`, 'cfb-blocks')}
				initialOpen={false}
			>
				<Fragment>
					<BaseControl
						label={__('Vertical', 'cfb-blocks')}
					>
						<ToogleGroupControl
							options={[
								{
									icon: alignTop,
									value: 'flex-start'
								},
								{
									icon: cfbAlignCenter,
									value: 'center'
								},
								{
									icon: alignBottom,
									value: 'flex-end'
								}
							]}
							value={attributes[`${currentSide}VerticalAlign`] ?? 'center'}
							onChange={value => {
								const attr = {};
								attr[`${currentSide}VerticalAlign`] = value;
								setAttributes(attr)
							}}
						/>
					</BaseControl>
					<BaseControl
						label={__('Horizontal', 'cfb-blocks')}
					>
						<ToogleGroupControl
							options={[
								{
									icon: alignLeft,
									value: 'flex-start'
								},
								{
									icon: alignCenter,
									value: 'center'
								},
								{
									icon: alignRight,
									value: 'flex-end'
								}
							]}
							value={attributes[`${currentSide}HorizontalAlign`] ?? 'center'}
							onChange={value => {
								const attr = {};
								attr[`${currentSide}HorizontalAlign`] = value;
								const valueSplit = value.split("-")?.[1];
								const textAlign = valueSplit ? valueSplit : value;
								attr[`${currentSide}TextAlign`] = textAlign;
								setAttributes(attr)
							}}
						/>
					</BaseControl>
				</Fragment>
			</PanelBody>
		</Fragment>
	</CardBody>;

	const coolFlipboxStyleSettings = <CardBody>
		<Fragment>
			{coolFlipDirectionBtn}
			<PanelBody
				title={__('Container Dimensions', 'cfb-blocks')}
			>
				<UnitControl
					label={__('Width', 'cfb-blocks')}
					value={isNumber(attributes.width) ? _px(attributes.width) : attributes?.width ?? '100%'}
					onChange={width => setAttributes({ width })}
					isUnitSelectTabbable
					isResetValueOnUnitChange
					allowReset={true}
				/>
				<br />
				<UnitControl
					label={__('Height', 'cfb-blocks')}
					value={isNumber(attributes.height) ? _px(attributes.height) : attributes?.height ?? '400px'}
					onChange={value => {
						const height = '' !== value ? value : 'auto';
						setAttributes({ height })
					}}
					isUnitSelectTabbable
					isResetValueOnUnitChange
					allowReset={true}
					units={[
						{
							default: 300,
							label: 'px',
							value: 'px'
						},
						{
							default: 20,
							label: 'em',
							value: 'em'
						},
						{
							default: 20,
							label: 'rem',
							value: 'rem'
						},
						{
							default: 30,
							label: 'vw',
							value: 'vw'
						},
						{
							default: 35,
							label: 'vh',
							value: 'vh'
						}
					]}
				/>
				<br />
				<BoxControl
					label={__('Padding', 'cfb-blocks')}
					values={attributes?.padding ?? { top: '0px', bottom: '0px', left: '0px', right: '0px' }}
					onChange={value => {
						let result = {};
						if ('object' === typeof value) {
							result = Object.fromEntries(Object.entries(pick(value, ['top', 'bottom', 'left', 'right'])).filter(([_, v]) => null !== v && undefined !== v));
						}
						if (isEmpty(result)) {
							result = undefined;
						}
						setAttributes({ padding: result });
					}}
					allowReset
				/>
			</PanelBody>
			<PanelBody
				title={__(`Background ${currentSide} Side`, 'cfb-blocks')}
				initialOpen={false}
			>
				<BackgroundSelectorControl
					backgroundType={attributes[`${currentSide}BackgroundType`]}
					backgroundColor={attributes[`${currentSide}BackgroundColor`]}
					image={attributes[`${currentSide}BackgroundImage`]}
					gradient={attributes[`${currentSide}BackgroundGradient`]}
					focalPoint={attributes[`${currentSide}BackgroundPosition`]}
					backgroundAttachment={attributes[`${currentSide}BackgroundAttachment`]}
					backgroundRepeat={attributes[`${currentSide}BackgroundRepeat`]}
					backgroundSize={attributes[`${currentSide}BackgroundSize`]}
					setAttributes={setAttributes}
					currentSide={currentSide}
					changeBackgroundType={value => {
						const attr = {};
						attr[`${currentSide}BackgroundType`] = value;
						setAttributes(attr)
					}
					}
					changeImage={value => {
						const attr = {};
						attr[`${currentSide}BackgroundImage`] = pick(value, ['id', 'url']);
						setAttributes(attr)
					}
					}
					removeImage={() => {
						setAttributes({ frontBackgroundImage: undefined })
					}
					}
					changeColor={value => {
						const attr = {};
						attr[`${currentSide}BackgroundColor`] = value;
						setAttributes(attr)
					}
					}
					changeGradient={value => {
						const attr = {};
						attr[`${currentSide}BackgroundGradient`] = value;
						setAttributes(attr)
					}
					}
					changeBackgroundAttachment={value => {
						const attr = {};
						attr[`${currentSide}BackgroundAttachment`] = value;
						setAttributes(attr)
					}
					}
					changeBackgroundRepeat={value => {
						const attr = {};
						attr[`${currentSide}BackgroundRepeat`] = value;
						setAttributes(attr)
					}
					}
					changeFocalPoint={value => {
						const attr = {};
						attr[`${currentSide}BackgroundPosition`] = value;
						setAttributes(attr)
					}
					}
					changeBackgroundSize={value => {
						const attr = {};
						attr[`${currentSide}BackgroundSize`] = value;
						setAttributes(attr)
					}
					}
				/>
			</PanelBody>
			<PanelBody
				title={__(`Typography ${currentSide} Side`, 'cfb-blocks')}
				initialOpen={false}
			>
				<TypographyControl
					label={__("Title", 'cfb-blocks')}
					attributes={attributes}
					setAttributes={setAttributes}
					loadGoogleFonts={{ value: attributes[`${currentSide}TitleGoogleFont`], label: `${currentSide}TitleGoogleFont` }}
					fontFamily={{ value: attributes[`${currentSide}TitleFontFamily`], label: `${currentSide}TitleFontFamily` }}
					fontWeight={{ value: attributes[`${currentSide}TitleFontWeight`], label: `${currentSide}TitleFontWeight` }}
					fontSize={{ value: attributes[`${currentSide}TitleFontSize`], label: `${currentSide}TitleFontSize` }}
					lineHeight={{ value: attributes[`${currentSide}TitleLineHeight`], label: `${currentSide}TitleLineHeight` }}
				/>
				<TypographyControl
					label={__("Description", 'cfb-blocks')}
					attributes={attributes}
					setAttributes={setAttributes}
					loadGoogleFonts={{ value: attributes[`${currentSide}DescGoogleFont`], label: `${currentSide}DescGoogleFont` }}
					fontFamily={{ value: attributes[`${currentSide}DescFontFamily`], label: `${currentSide}DescFontFamily` }}
					fontWeight={{ value: attributes[`${currentSide}DescFontWeight`], label: `${currentSide}DescFontWeight` }}
					fontSize={{ value: attributes[`${currentSide}DescFontSize`], label: `${currentSide}DescFontSize` }}
					lineHeight={{ value: attributes[`${currentSide}DescLineHeight`], label: `${currentSide}DescLineHeight` }}
				/>
			</PanelBody>
			<PanelColorSettings
				title={__('Color', 'cfb-blocks')}
				initialOpen={true}
				colorSettings={[
					{
						value: attributes.borderColor,
						onChange: borderColor => setAttributes({ borderColor }),
						label: __('Border', 'cfb-blocks'),
						isShownByDefault: false
					},
					{
						value: attributes.titleColor,
						onChange: titleColor => setAttributes({ titleColor }),
						label: __('Title', 'cfb-blocks'),
						isShownByDefault: false
					},
					{
						value: attributes.descriptionColor,
						onChange: descriptionColor => setAttributes({ descriptionColor }),
						label: __('Description', 'cfb-blocks'),
						isShownByDefault: false
					}
				]}
			/>
			<PanelBody
				title={__('Border', 'cfb-blocks')}
				initialOpen={false}
			>
				<BoxControl
					label={__('Width', 'cfb-blocks')}
					values={
						mergeBoxDefaultValues(
							numberToBox(attributes.borderWidth),
							stringToBox('1px')
						)
					}
					onChange={value => {
						setAttributes({
							borderWidth: removeBoxDefaultValues(value, { left: '1px', right: '1px', bottom: '1px', top: '1px' })
						});
					}}
					allowReset
				/>
				<BoxControl
					id="cfb-border-raduis-box"
					label={__('Radius', 'cfb-blocks')}
					values={
						mergeBoxDefaultValues(
							numberToBox(attributes.borderRadius),
							stringToBox('10px')
						)
					}
					onChange={value => {
						setAttributes({
							borderRadius: removeBoxDefaultValues(value, { left: '10px', right: '10px', bottom: '10px', top: '10px' })
						});
					}}
					allowReset
				/>
				<ToggleControl
					label={__('Shadow Properties', 'cfb-blocks')}
					checked={attributes.boxShadow}
					onChange={boxShadow => setAttributes({ boxShadow })}
				/>
				{attributes.boxShadow && (
					<Fragment>
						<ColorGradientControl
							label={__('Color', 'cfb-blocks')}
							colorValue={attributes.boxShadowColor}
							onColorChange={changeBoxShadowColor}
						/>
						<ControlPanelControl
							label={__('Shadow Properties', 'cfb-blocks')}
						>
							<RangeControl
								label={__('Opacity', 'cfb-blocks')}
								value={attributes.boxShadowColorOpacity}
								onChange={changeBoxShadowColorOpacity}
								min={0}
								max={100}
								allowReset
							/>
							<RangeControl
								label={__('Blur', 'cfb-blocks')}
								value={attributes.boxShadowBlur}
								onChange={boxShadowBlur => setAttributes({ boxShadowBlur })}
								min={0}
								max={100}
								allowReset
							/>
							<RangeControl
								label={__('Horizontal', 'cfb-blocks')}
								value={attributes.boxShadowHorizontal}
								onChange={boxShadowHorizontal => setAttributes({ boxShadowHorizontal })}
								min={-100}
								max={100}
								allowReset
							/>
							<RangeControl
								label={__('Vertical', 'cfb-blocks')}
								value={attributes.boxShadowVertical}
								onChange={boxShadowVertical => setAttributes({ boxShadowVertical })}
								min={-100}
								max={100}
								allowReset
							/>
						</ControlPanelControl>
					</Fragment>
				)}
			</PanelBody>
		</Fragment>
	</CardBody>
	return (
		<InspectorControls>
			<TabPanel
				className="cfb-block-settings"
				activeClass="active-tab"
				tabs={[
					{
						name: 'timeline_setting',
						title: 'Settings',
						className: 'cfb-block-tabs cfb-block-general-tab',
						content: coolFlipboxSettings
					},
					{
						name: 'general_setting',
						title: 'Style',
						className: 'cfb-block-tabs  cfb-block-style-tab',
						content: coolFlipboxStyleSettings
					},
				]}
			>
				{(tab) =>
					<Card>
						{tab.content}
					</Card>
				}
			</TabPanel>
			<PanelBody title={__("View Cool Flipbox video", "cfb-blocks")} initialOpen={false}>
				<CardBody className="cfb-block-demo-button">

					<a target="_blank" className="button button-primary" href="https://www.youtube.com/watch?v=qjC_TXUJ3-w">Watch Video</a>
				</CardBody>
			</PanelBody>
			{coolFlipboxReviewBox}
		</InspectorControls>
	);
};

export default Inspector;
