<?php

namespace CoolPlugins\GutenbergBlocks\CSS;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Utility class for managing styles related to CoolPlugins Gutenberg Blocks on the frontend.
 *
 * This class provides methods for managing block styles, media items, and custom CSS arrays.
 *
 * @package CoolPlugins\GutenbergBlocks\CSS
 * @since 1.0.0
 */
class CFB_Style_Utility {

	/**
	 * Array to hold block settings.
	 *
	 * @var array
	 */
	public $block = array();

	/**
	 * Array to hold media items settings.
	 *
	 * @var array
	 */
	public $media_items = array();

	/**
	 * Array to hold CSS properties.
	 *
	 * @var array
	 */
	public $css_array = array();

	/**
	 * Custom block ID.
	 *
	 * @var string
	 */
	public $block_id;

	/**
	 * Constructor for initializing the block object.
	 *
	 * @access public
	 * @param array $block - The block object containing block settings.
	 */
	public function __construct( $block = array() ) {
		$this->block = $block;
	}

	/**
	 * Add a style to the CSS array.
	 *
	 * @access public
	 * @since 1.6.0
	 * @param array $params - CSS object parameters including query, selector, and properties.
	 */
	public function add_item( $params ) {
		$params = wp_parse_args(
			$params,
			array(
				'query'      => 'global',
				'selector'   => '',
				'properties' => '',
			)
		);

		if ( ! isset( $this->css_array[ $params['query'] ] ) ) {
			$this->css_array[ $params['query'] ] = array();
		}

		if ( ! isset( $this->css_array[ $params['query'] ][ $params['selector'] ] ) ) {
			$this->css_array[ $params['query'] ][ $params['selector'] ] = $params['properties'];
		} else {
			$this->css_array[ $params['query'] ][ $params['selector'] ] = array_merge(
				$this->css_array[ $params['query'] ][ $params['selector'] ],
				$params['properties']
			);
		}
	}

	/**
	 * Generate CSS from provided values.
	 * This method generates CSS based on the provided values and block attributes.
	 *
	 * @access public
	 * @since 1.6.0
	 * @return string The generated CSS string.
	 */
	public function generate() {

		$style = '';

		$attrs = $this->block['attrs'];

		if ( empty( $this->block_id ) ) {
			if ( isset( $attrs['id'] ) ) {
				$this->block_id = $attrs['id'];
			}
		}

		foreach ( $this->css_array as $media_query => $css_items ) {
			$style .= ( 'global' !== $media_query ) ? $media_query . '{' : '';

			foreach ( $css_items as $selector => $properties ) {
				$item_style = '';

				foreach ( $properties as $property ) {
					$property = wp_parse_args(
						$property,
						array(
							'unit' => '',
						)
					);

					// If the item supports global default, check if the global default is active.
					if ( isset( $property['property'] ) && isset( $property['value'] ) && isset( $property['hasSync'] ) && ! empty( $property['hasSync'] ) && ( isset( $attrs['isSynced'] ) && in_array( $property['value'], $attrs['isSynced'] ) ) ) {
						$item_style .= $property['property'] . ': var( --' . $property['hasSync'] . ( isset( $property['default'] ) ? ', ' . $property['default'] : '' ) . ' );';
						continue;
					}

					// If the item contains a condition, check if it is true or bail out.
					if ( isset( $property['condition'] ) && is_callable( $property['condition'] ) && ! $property['condition']( $attrs ) ) {
						continue;
					}

					if ( isset( $property['property'] ) && ( ( isset( $property['value'] ) && isset( $attrs[ $property['value'] ] ) ) || isset( $property['default'] ) ) ) {
						$value = ( ( isset( $property['value'] ) && isset( $attrs[ $property['value'] ] ) ) ? $attrs[ $property['value'] ] : $property['default'] );

						if ( isset( $property['format'] ) && is_callable( $property['format'] ) ) {
							$value = $property['format']( $value, $attrs );
						}

						$value = $value . $property['unit'];
						if ( ! empty( $value ) ) {
							$item_style .= $property['property'] . ': ' . $value . ';';
						}
					}

					if ( isset( $property['property'] ) && ( isset( $property['pattern'] ) && isset( $property['pattern_values'] ) ) ) {
						$pattern = $property['pattern'];

						foreach ( $property['pattern_values'] as $value_key => $pattern_value ) {
							$pattern_value = wp_parse_args(
								$pattern_value,
								array(
									'unit' => '',
								)
							);

							if ( ( ( isset( $pattern_value['value'] ) && isset( $attrs[ $pattern_value['value'] ] ) ) || isset( $pattern_value['default'] ) ) ) {
								$value = ( ( isset( $pattern_value['value'] ) && isset( $attrs[ $pattern_value['value'] ] ) ) ? $attrs[ $pattern_value['value'] ] : $pattern_value['default'] );

								if ( isset( $pattern_value['format'] ) && is_callable( $pattern_value['format'] ) ) {
									$value = $pattern_value['format']( $value, $attrs );
								}

								$value   = $value . $pattern_value['unit'];
								$pattern = preg_replace( '/\b' . $value_key . '\b/', $value, $pattern );
							}
						}

						$item_style .= $property['property'] . ': ' . $pattern . ';';
					}
				}

				if ( '' !== $item_style ) {
					if ( ! ( ! isset( $attrs['id'] ) && ! empty( $selector ) ) ) {
						$selector = strpos( $selector, '[id]' ) !== false ? str_replace( '[id]', '#' . $this->block_id, $selector ) : '#' . $this->block_id . $selector;
					}

					$style .= $selector . ' {' . $item_style . '}';
				}
			}

			$style .= ( 'global' !== $media_query ) ? '}' : '';
		}

		return $style;
	}

	/**
	 * Get the CSS string for padding and margin based on the BoxControl values.
	 *
	 * This function takes the box values and the default box values and returns a CSS string representing the padding and margin.
	 *
	 * @param array $box The box values.
	 * @param array $box_default The default box values.
	 * @return string The CSS string representing the padding and margin.
	 */
	public static function box_values( $box, $box_default = array() ) {
		return self::render_box(
			array_merge(
				array(
					'left'   => '0px',
					'right'  => '0px',
					'top'    => '0px',
					'bottom' => '0px',
				),
				$box_default,
				$box
			)
		);
	}

	/**
	 * Convert a string value into a box type.
	 *
	 * This function takes a string value and converts it into an array representing the box values.
	 *
	 * @param string $value The value to be converted into box type.
	 * @return array|string[] The array representing the box values.
	 */
	public static function make_box( $value = '0px' ) {
		return array(
			'left'   => $value,
			'right'  => $value,
			'top'    => $value,
			'bottom' => $value,
		);
	}

	/**
	 * Merge the given views into a single box value.
	 *
	 * This function takes multiple views and merges them into a single box value, prioritizing the values from other viewports.
	 *
	 * @param mixed ...$views The values from other viewports.
	 * @return array|string[] The merged box value.
	 */
	public static function merge_views( ...$views ) {
		$result = self::make_box();

		$valid = array_filter(
			$views,
			function( $view ) {
				return isset( $view ) && is_array( $view );
			}
		);

		foreach ( $valid as $arr ) {
			if ( isset( $arr['top'] ) ) {
				$result['top'] = $arr['top'];
			}
			if ( isset( $arr['bottom'] ) ) {
				$result['bottom'] = $arr['bottom'];
			}
			if ( isset( $arr['right'] ) ) {
				$result['right'] = $arr['right'];
			}
			if ( isset( $arr['left'] ) ) {
				$result['left'] = $arr['left'];
			}
		}

		return $result;
	}

	/**
	 * Convert a defined box to a CSS string value.
	 *
	 * This function takes a defined box array and converts it into a CSS string value representing the box properties in the order of top, right, bottom, and left.
	 *
	 * @param array $box The box value containing the top, right, bottom, and left properties.
	 * @return string The CSS string value representing the box properties.
	 */
	public static function render_box( $box ) {
		if ( ! is_array( $box ) || count( $box ) === 0 ) {
			return '';
		}

		return $box['top'] . ' ' . $box['right'] . ' ' . $box['bottom'] . ' ' . $box['left'];
	}
}
