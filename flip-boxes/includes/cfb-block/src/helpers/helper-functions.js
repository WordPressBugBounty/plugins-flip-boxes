import { isEmpty, merge, omitBy, isString, isNumber } from 'lodash';

import { __experimentalGetSettings } from '@wordpress/date';

import { __ } from '@wordpress/i18n';

/*
 +-------------------------------- CSS Utility functions --------------------------------+
*/

/**
 * Format the value based on the given unit.
 *
 * @param {number} value
 * @param {string} unit
 * @returns {string|undefined}
 */
export const _unit = ( value, unit ) => ( isNumber( value ) ? value + unit : value );

/**
 * Format the value into a `px` unit.
 *
 * @param {any} value The value.
 * @returns {string|undefined}
 */
export const _px = value => _unit( value, 'px' );

/**
 * Return the value of pair [condition, value] which has the first true condition.
 *
 * @param {([bool, any]|[any])[]} arr
 * @returns {*}
 */
export const getChoice = arr => {
	const r = arr?.filter( x => x?.[0])?.[0];
	return r?.[1] ?? r?.[0];
};

/**
 * Remove the default values from Box object.
 *
 * @param {import('./blocks').BoxType} box
 * @param {import('./blocks').BoxType} defaultBox
 * @return {import('./blocks').BoxType}
 */
export const removeBoxDefaultValues = ( box, defaultBox ) => {
	if ( defaultBox === undefined || isEmpty( defaultBox ) ) {
		return box;
	}
	const cleaned = omitBy( box, ( value, key ) => value === defaultBox?.[key]);
	return isEmpty( cleaned ) ? undefined : cleaned;
};

/**
 * Merge the Box objects.
 *
 * @param {import('./blocks').BoxType?} box
 * @param {import('./blocks').BoxType?} defaultBox
 * @return {import('./blocks').BoxType}
 */
export const mergeBoxDefaultValues = ( box, defaultBox ) => {
	return merge(
		{ left: '0px', right: '0px', bottom: '0px', top: '0px' },
		defaultBox,
		box
	);
};

/**
 * Wrap a given string in a box object.
 * @param {string|any} s The value.
 * @returns {import('./blocks').BoxType|any}
 */
export const stringToBox = ( s ) => {
	if ( ! isString( s ) ) {
		return s;
	}

	return {
		top: s,
		bottom: s,
		right: s,
		left: s
	};
};

/**
 * Make a box intro a CSS string. If it is a string, wrap it into a box.
 * @param {string|import('./blocks').BoxType | undefined} box The box.
 * @returns
 */
export const boxToCSS = ( box ) => {
	if ( box === undefined ) {
		return undefined;
	}

	const _box = isString( box ) ? mergeBoxDefaultValues( stringToBox( box ) ) : mergeBoxDefaultValues( box );
	return `${_box.top} ${_box.right} ${_box.bottom} ${_box.left}`;
};

/**
 * If the given value is a number, transform it into a Box Value with the given unit. Otherwise, return the value.
 *
 * @param {number | any} n The number to convert.
 * @param {string?} unit The unit to add.
 * @returns {import('./blocks').BoxType | any} The box value or given value.
 */
export const numberToBox = ( x, unit = 'px' ) => isNumber( x ) ? stringToBox( _unit( x, unit ) ) : x;
