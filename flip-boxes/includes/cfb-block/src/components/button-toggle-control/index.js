import classnames from 'classnames' ;
/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';

import {
	BaseControl,
	Button
} from '@wordpress/components';

/**
 * Internal dependencies.
 */
import './editor.scss';

const ButtonToggleControl = ({
	label,
	help,
	options,
	value,
	onChange,
	className
}) => {
	return (
		<div className={className}>
		<BaseControl
			label={ label }
			help={ help }
		>
			<div className="cfb-block-button-toggle">
				{ options.map( option => {
					return (
						<Button
							className={ classnames(
								'cfb-block-button-toggle__item',
								{
									'is-active': option.value === value
								}
							) }
							key={ option.value }
							variant="secondary"
							label={ option.label }
							aria-current={ option.value === value }
							onClick={ () => onChange( option.value ) }
						>
							{ option.label }
						</Button>
					);
				}) }
			</div>
		</BaseControl>
		</div>
	);
};

export default ButtonToggleControl;
