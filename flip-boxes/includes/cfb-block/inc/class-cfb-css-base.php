<?php
namespace CoolPlugins\GutenbergBlocks;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Base class for managing CSS related functionality for CoolPlugins Gutenberg Blocks.
 *
 * This class provides methods for managing the CSS namespace, version, block classes, Google fonts, and Font Awesome library.
 *
 * @package CoolPlugins\GutenbergBlocks
 */
class Cfb_CSS_Base {

	/**
	 * The namespace for the REST API routes related to CoolPlugins Gutenberg Blocks.
	 *
	 * @var string
	 */
	public $namespace = 'cfb/';

	/**
	 * The version of the REST API routes related to CoolPlugins Gutenberg Blocks.
	 *
	 * @var string
	 */
	public $version = 'v1';

	/**
	 * The namespace under which the block classes are saved.
	 *
	 * @var array
	 */
	protected static $blocks_classes = array();

	/**
	 * The namespace under which the Google Fonts are saved.
	 *
	 * @var array
	 */
	protected static $google_fonts = array();

	/**
	 * Indicates whether the Font Awesome library is loaded for CoolPlugins Gutenberg Blocks.
	 *
	 * @var bool
	 */
	protected static $font_awesome_library_load = false;

	/**
	 * Initializes the Cfb_CSS_Base class.
	 *
	 * This constructor sets up the action to autoload block classes.
	 *
	 * @since   1.3.0
	 * @access  public
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'autoload_block_classes' ), 99 );
	}

	/**
	 * Autoloads classes for each block.
	 *
	 * This method sets the block classes to be autoloaded.
	 *
	 * @since   1.3.0
	 * @access  public
	 */
	public function autoload_block_classes() {
		self::$blocks_classes = array(
			'\CoolPlugins\GutenbergBlocks\CSS\Blocks\CFB_BLOCK_Style',
		);
	}

	/**
	 * Loads the Font Awesome library if the content type includes an icon.
	 *
	 * This method checks if the content type includes an icon and loads the Font Awesome library accordingly.
	 *
	 * @param array $attr Attributes array.
	 * @return void
	 * @since   1.3.0
	 * @access  public
	 */
	public function font_awesome_library( $attr ) {
		// Check if content type includes an icon.
		$back_content_type = isset( $attr['backContentType'] ) ? $attr['backContentType'] : 'none';
		$front_icon        = ! isset( $attr['frontContentType'] ) ? true : false;
		$cfb_flipbox       = isset( $attr['cfbBlockFlipboxVersion'] ) ? true : false;
		$data              = array();
		$data['back']      = $back_content_type;
		$data['front']     = $front_icon;
		if ( $cfb_flipbox && ( 'icon' === $back_content_type || $front_icon ) ) {
			self::$font_awesome_library_load = true;
		}
	}

	/**
	 * Retrieves the Google Fonts.
	 *
	 * This method retrieves the Google Fonts based on the provided attributes.
	 *
	 * @param array $attr Attr values.
	 *
	 * @since   1.3.0
	 * @access  public
	 */
	public function get_google_fonts( $attr ) {
		$sides      = array( 'front', 'back' );
		$fonts_tags = array( 'Title', 'Desc' );
		foreach ( $sides as $side ) {
			foreach ( $fonts_tags as $font_tag ) {
				$font_enable = $side . $font_tag . 'GoogleFont';
				if ( array_key_exists( $font_enable, $attr ) && $attr[ $font_enable ] ) {
					$font_family = $attr[ $side . $font_tag . 'FontFamily' ];
					$font_weight = $attr[ $side . $font_tag . 'FontWeight' ];
					$font        = $font_family . $font_weight;
					if ( ! array_key_exists( $font, self::$google_fonts ) ) {
						self::$google_fonts[ $font ] = array(
							'family' => $font_family,
							'weight' => $font_weight,
						);
					}
				}
			}
		}
	}

	/**
	 * Convert HEX color to RGBA format.
	 *
	 * This method takes a HEX color and an optional opacity value and converts it to RGBA format.
	 *
	 * @param string   $color    The HEX color code to be converted.
	 * @param bool|int $opacity  Optional. The opacity value. Default is false.
	 * @return mixed The converted color in RGBA format.
	 * @since   1.3.0
	 * @access  public
	 */
	public static function hex_convert_rgbs( $color, $opacity = false ) {
		$default = 'rgb(0,0,0)';

		if ( empty( $color ) ) {
			return $default;
		}

		if ( '#' == $color[0] ) {
			$color = substr( $color, 1 );
		}

		if ( strlen( $color ) == 6 ) {
			$hex = array( $color[0] . $color[1], $color[2] . $color[3], $color[4] . $color[5] );
		} elseif ( strlen( $color ) == 3 ) {
			$hex = array( $color[0] . $color[0], $color[1] . $color[1], $color[2] . $color[2] );
		} else {
			return $default;
		}

		$rgb = array_map( 'hexdec', $hex );

		if ( $opacity >= 0 ) {
			if ( abs( $opacity ) > 1 ) {
				$opacity = 1.0;
			}
			$output = 'rgba( ' . implode( ',', $rgb ) . ',' . $opacity . ' )';
		} else {
			$output = 'rgb( ' . implode( ',', $rgb ) . ' )';
		}

		return $output;
	}

	/**
	 * Retrieve the CSS for individual blocks.
	 *
	 * Retrieves the CSS for individual blocks based on the provided post ID.
	 *
	 * @param int $post_id The ID of the post.
	 * @return string|void The CSS for individual blocks, or void if no blocks are found.
	 * @since   1.3.0
	 * @access  public
	 */
	public function get_blocks_css( $post_id ) {
		if ( ! function_exists( 'has_blocks' ) ) {
			return;
		}

		$content = get_post_field( 'post_content', $post_id );
		$blocks  = parse_blocks( $content );

		if ( ! is_array( $blocks ) || empty( $blocks ) ) {
			return;
		}

		$animations = boolval( preg_match( '/\banimated\b/', $content ) );
		return $this->cycle_through_static_blocks( $blocks, $animations );
	}

	/**
	 * Retrieve the CSS for reusable blocks.
	 *
	 * Retrieves the CSS for reusable blocks based on the provided post ID.
	 *
	 * @param int $post_id The ID of the post.
	 * @return string|void The CSS for reusable blocks, or void if no reusable blocks are found.
	 * @since   1.3.0
	 * @access  public
	 */
	public function get_reusable_block_css( $post_id ) {
		$reusable_block = get_post( $post_id );
		if ( ! $reusable_block || 'wp_block' !== $reusable_block->post_type ) {
			return;
		}

		if ( 'publish' !== $reusable_block->post_status || ! empty( $reusable_block->post_password ) ) {
			return;
		}

		$blocks     = parse_blocks( $reusable_block->post_content );
		$animations = boolval( preg_match( '/\banimated\b/', $reusable_block->post_content ) );
		return $this->cycle_through_static_blocks( $blocks, $animations );
	}

	/**
	 * Cycle through static blocks and retrieve their styles.
	 *
	 * @param array $blocks The list of blocks.
	 * @param bool  $animations Whether to check for animations or not.
	 * @return string The styles for the static blocks.
	 * @since   1.3.0
	 * @access  public
	 */
	public function cycle_through_static_blocks( $blocks, $animations = true ) {
		$style = '';
		foreach ( $blocks as $block ) {
			foreach ( self::$blocks_classes as $classname ) {
				$path = new $classname();
				if ( method_exists( $path, 'render_css' ) && isset( $path->block_prefix ) ) {
					if ( 'cp/' . $path->block_prefix === $block['blockName'] ) {
						$style .= $path->render_css( $block );
					}
				}
			}
			// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound
			$custom_css = apply_filters( 'cfb_blocks_css', $block );

			if ( is_string( $custom_css ) ) {
				$style .= $custom_css;
			}

			if ( isset( $block['innerBlocks'] ) && ! empty( $block['innerBlocks'] ) && is_array( $block['innerBlocks'] ) ) {
				$style .= $this->cycle_through_static_blocks( $block['innerBlocks'], false );
			}
		}
		return $style;
	}

	/**
	 * Cycle through global styles and retrieve their styles.
	 *
	 * @return string The global styles.
	 * @since   2.0.0
	 * @access  public
	 */
	public function cycle_through_global_styles() {
		$style = '';
		foreach ( self::$blocks_classes as $classname ) {
			$path = new $classname();

			if ( method_exists( $path, 'render_global_css' ) ) {
				$style .= $path->render_global_css();
			}
		}

		return $style;
	}
}
