/**
 * WordPress dependencies
 */
 import { __ } from '@wordpress/i18n';
 import {
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';

const {
	RangeControl,
} = wp.components

import {
	_px,
} from '../../helpers/helper-functions.js';

// Extend component
const { Fragment } = wp.element

/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
export default function RangeTypographyControl ( props ) {
	let sizeTypes = props.size.value ? props.size.value.replace(/\d+/g, '').replace('.', '').replace('undefined','') : 'px';
	const output = <Fragment>
			<RangeControl
				label={ __( props.sizeText ) }
				value={ props.size.value }
				onChange={ ( value ) => {
					props.setAttributes( { [props.sizeLabel]: value+sizeTypes } )
				} }
				min={ 0 }
				max={ 100 }
				step={ 'em' !== sizeTypes ? 1 : 0.1 }
				beforeIcon="editor-textcolor"
				allowReset={true}
				initialPosition={props.initialPosition}
				withInputField={false}
			/>
			<UnitControl
				onChange={ sizeLabel => props.setAttributes({[props.sizeLabel] : sizeLabel}) }
				isUnitSelectTabbable
				isResetValueOnUnitChange
				value={ _px( props.size.value ) ?? props.defaultValue }
				units={[
					{ value: 'px', label: 'px', default: 0 },
					{ value: 'em', label: 'em', default: 0 },
				]}
			/>
		</Fragment>
	return (
		<div className={ 'cfb-block-typography-range-options' }>
			<div className="cfb-block-size-type-field-tabs">
				<div className="cfb-block-responsive-control-inner">
				{ output }
				</div>
			</div>
		</div>
	);
}