/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import FontFamilyControl from "./font-typography.js";
import RangeTypographyControl from "./range-typography.js";

const {
	Button,
	Dashicon
} = wp.components

import './editor.scss';


// Extend component
const { Component, Fragment } = wp.element

class TypographyControl extends Component {
	constructor() {
		super( ...arguments )
		this.onAdvancedControlClick  = this.onAdvancedControlClick.bind( this )
		this.onAdvancedControlReset  = this.onAdvancedControlReset.bind( this )
		this.timeline_settings_apply;
	}
	valueupdate(){
		let valueupdates=[
			this.props.fontSize.value,
			this.props.fontFamily.value == 'Default' ? undefined : this.props.fontFamily.value,
			this.props.fontWeight.value,
			this.props.lineHeight.value,
		];
		for(let i = 0; i<valueupdates.length; i++){
			if(valueupdates[i] != undefined){
				this.timeline_settings_apply=' cp-timeline-typography_apply';
				break;
			}
			this.timeline_settings_apply = '';
		};
	}
	onAdvancedControlClick() {

		let control = true
		let label = __( "Hide Advanced",'cfb-block' )

		if( this.state !== null && this.state.showAdvancedControls === true ) {
			control = false
			label = __( "Advanced",'cfb-block' )
		}

		this.setState(
			{
				showAdvancedControls: control,
				showAdvancedControlsLabel: label
			}
		)
	}
	onAdvancedControlReset() {

		const { setAttributes } = this.props

		// Reset Font family to default.
		setAttributes( { [ this.props.fontFamily.label ]: "Default" } )
		setAttributes( { [ this.props.fontWeight.label ]: undefined } )

		// Reset Font Size to default.
		setAttributes( { [ this.props.fontSize.label ]: undefined } )

		// Reset Line Height to default.
		setAttributes( { [ this.props.lineHeight.label ]: undefined } )

		// Reset Google Fonts to default.
		setAttributes( { [ this.props.loadGoogleFonts.label ]: false } )
	}

	render() {
		this.valueupdate();
		let fontSize
		let lineHeight
		let fontFamily
		let fontAdvancedControls
		let fontTypoAdvancedControls
		let showAdvancedFontControls
		let resetFontAdvancedControls

		const {
			disableFontFamily,
			disableFontSize,
			disableLineHeight,
			disableAdvancedOptions = false
		} = this.props

		if( true !== disableFontFamily ) {
			fontFamily = (
				<FontFamilyControl
					{ ...this.props }
				/>
			)
		}

		if( true !== disableLineHeight ) {
			lineHeight = (
				<RangeTypographyControl
					size = { this.props.lineHeight }
					sizeLabel = { this.props.lineHeight.label }
					sizeText = { __( "Line Height",'cfb-block' ) }
					initialPosition={0}
					defaultValue={0}
					{ ...this.props }
				/>
			)
		}

		if( true !== disableFontSize ) {
			fontSize = (
				<RangeTypographyControl
					size = { this.props.fontSize }
					sizeLabel = { this.props.fontSize.label }
					sizeText = { ( ! this.props.fontSizeLabel ) ? __( "Font Size",'cfb-block' ) : this.props.fontSizeLabel }
					initialPosition={this.props.fontSize.label == 'subHeadFontSize' ? 14 : 18}
					defaultValue={18}
					{ ...this.props }
				/>
			)
		}
		

		if( true !== disableFontFamily && true !== disableFontSize ) {
			fontAdvancedControls =  (
				<Button
					className="cfb-block-size-btn cfb-block-typography-control-btn"
					isSmall
					aria-pressed={ ( this.state !== null ) }
					onClick={ this.onAdvancedControlClick }
				><Dashicon icon="admin-tools" /></Button>
			)

			resetFontAdvancedControls =  (
				<div
					className="components-button is-secondary is-small"
					onClick={ this.onAdvancedControlReset }
				>Reset</div>
			)
		} else {
			showAdvancedFontControls = (
				<Fragment>
					{ fontSize }
					{ fontFamily }
					{ lineHeight }
				</Fragment>
			)
		}


		if( this.state !== null && this.state.showAdvancedControls === true ) {

			showAdvancedFontControls = (
				<div className="cfb-block-typography-advanced">
					{ fontSize }
					{ fontFamily }
					{ lineHeight }
				</div>
			)
		}

		if( true !== disableFontFamily && true !== disableFontSize ) {
			fontTypoAdvancedControls =  (
				<div className="cfb-block-typography-option-actions">
					<div>{ this.props.label }</div>
					{ fontAdvancedControls }
					{ resetFontAdvancedControls }
				</div>
			)
		}
		return (
			<div className={`cfb-block-typography-options${this.timeline_settings_apply}`}>
				{ !disableAdvancedOptions &&
					<Fragment>
						{ fontTypoAdvancedControls }
						{ showAdvancedFontControls }
					</Fragment>
				}
			</div>
		)
	}
}

export default TypographyControl
