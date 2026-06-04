<?php
namespace CoolPlugins\GutenbergBlocks;

use CoolPlugins\GutenbergBlocks\Cfb_CSS_Base;


if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class CFB_Block_Frontend
 */
class CFB_Block_Frontend extends Cfb_CSS_Base {

	/**
	 * The main instance variable for the CFB_Block_Frontend class.
	 *
	 * @var CFB_Block_Frontend|null
	 */
	public static $instance = null;

	/**
	 * This variable is used to check if the post has an excerpt.
	 *
	 * @var bool $has_excerpt True if the post has an excerpt, false otherwise.
	 */
	private $has_excerpt = false;

	/**
	 * Total size of inline CSS.
	 *
	 * @var int $total_inline_size The total size of inline CSS in pixels.
	 */
	private $total_inline_size = 0;

	/**
	 * Initializes the class and adds necessary actions for rendering post CSS, font awesome, and Google fonts.
	 *
	 * This method initializes the class and adds actions for rendering post CSS, font awesome, and Google fonts. It hooks into the 'wp', 'wp_enqueue_scripts', 'wp_head', and 'wp_footer' actions to enqueue the necessary assets and styles.
	 */
	public function init() {
		add_action( 'wp', array( $this, 'render_post_css' ), 10 );
		add_action( 'wp_enqueue_scripts', array( $this, 'cfb_flipbox_font_awesome' ), 19 );
		add_action( 'wp_enqueue_scripts', array( $this, 'cfb_flipbox_google_fonts' ), 19 );
		add_action( 'wp_head', array( $this, 'enqueue_assets' ) );
		add_action( 'wp_footer', array( $this, 'enqueue_global_styles' ) );
	}

	/**
	 * Method to enqueue Font Awesome CSS for flipbox.
	 *
	 * This method enqueues the Font Awesome CSS for flipbox if the post is singular and the font awesome library is available. It checks if the font awesome library is enqueued and then enqueues the CSS file accordingly.
	 *
	 * @param int|null $post_id Post ID.
	 *
	 * @since   1.3.0
	 * @access  public
	 */
	public function cfb_flipbox_font_awesome( $post_id = null ) {
		if ( ! is_singular() && ! $post_id ) {
			return;
		}

		$post_id              = $post_id ? $post_id : get_the_ID();
		$font_awesome_library = get_post_meta( $post_id, '_CoolPlugins_gutenberg_block_fontawesome_libraray', true );
		if ( $font_awesome_library ) {
			if ( ! wp_script_is( 'cfb-block-fontawesome', 'enqueued' ) ) {
				wp_enqueue_style( 'cfb-block-fontawesome', CFB_URL . 'assets/fontawesome/css/font-awesome.min.css', array(), CFB_VERSION ); // phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion
			}
		}
	}

	/**
	 * Method to enqueue Google Fonts CSS for flipbox.
	 *
	 * This method enqueues the Google Fonts CSS for flipbox if the post is singular and the specified fonts are available. It retrieves the fonts list from the post meta, generates the fonts URL, and enqueues the CSS file if the fonts are not already enqueued.
	 *
	 * @param int|null $post_id Post ID.
	 *
	 * @since   1.3.0
	 * @access  public
	 */
	public function cfb_flipbox_google_fonts( $post_id = null ) {
		if ( ! is_singular() && ! $post_id ) {
			return;
		}

		$post_id    = $post_id ? $post_id : get_the_ID();
		$fonts_list = get_post_meta( $post_id, '_CoolPlugins_gutenberg_block_fonts', true );
		$content    = get_post_field( 'post_content', $post_id );
		$blocks     = parse_blocks( $content );
		if ( empty( $fonts_list ) ) {
			return;
		}

		if ( count( $fonts_list ) > 0 ) {
			$fonts = $this->get_fonts( $fonts_list );
			if ( count( $fonts['fonts'] ) > 0 ) {
				if ( ! wp_script_is( 'cfb-block-google-fonts', 'enqueued' ) ) {
					wp_enqueue_style( 'cfb-block-google-fonts', $fonts['url'], array(), null ); // phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion
				}
			}
		}
	}

	/**
	 * Method to Get Fonts URL.
	 *
	 * This method retrieves the fonts URL for the specified fonts list. It constructs the fonts URL by formatting the fonts list and adding necessary query parameters. The constructed URL is then filtered using the 'cfb_blocks_google_fonts_url' filter. The method returns an array containing the fonts list and the formatted URL.
	 *
	 * @param array $fonts_list Fonts List.
	 *
	 * @since   2.0.5
	 * @access  public
	 */
	public function get_fonts( $fonts_list = array() ) {
		$fonts = array();
		foreach ( $fonts_list as $font ) {

			$item = str_replace( ' ', '+', $font['family'] );
			if ( isset( $font['weight'] ) && ! empty( $font['weight'] ) ) {
				$item .= ':wght@' . $font['weight'];
			}
			array_push( $fonts, $item );
		}

		$fonts_url = add_query_arg(
			array(
				'family'  => implode( '&family=', $fonts ),
				'display' => 'swap',
			),
			'https://fonts.googleapis.com/css2'
		);
		// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound
		$fonts_url = apply_filters( 'cfb_blocks_google_fonts_url', $fonts_url );

		$obj = array(
			'fonts' => $fonts,
			'url'   => esc_url_raw( $fonts_url ),
		);

		return $obj;
	}

	/**
	 * Database post ID of the block template used on this request (FSE / block themes).
	 *
	 * @return int Template wp_template post ID, or 0.
	 */
	public static function get_active_block_template_post_id() {
		if ( ! function_exists( 'wp_is_block_theme' ) || ! wp_is_block_theme() ) {
			return 0;
		}

		global $_wp_current_template_id;
		if ( ! empty( $_wp_current_template_id ) ) {
			return (int) $_wp_current_template_id;
		}

		$slug = 'index';

		if ( is_404() ) {
			$slug = '404';
		} elseif ( is_search() ) {
			$slug = 'search';
		} elseif ( is_front_page() && is_home() ) {
			$slug = 'home';
		} elseif ( is_front_page() ) {
			$slug = 'front-page';
		} elseif ( is_home() ) {
			$slug = 'home';
		} elseif ( is_archive() ) {
			$slug = 'archive';
		} elseif ( is_singular() ) {
			$post_type = get_post_type();
			$slug      = ( $post_type && 'page' !== $post_type ) ? 'single-' . $post_type : 'single';
		}

		$theme    = get_stylesheet();
		$template = get_block_template( $theme . '//' . $slug, 'wp_template' );

		if ( ( ! $template || empty( $template->wp_id ) ) && 'index' !== $slug ) {
			$template = get_block_template( $theme . '//index', 'wp_template' );
		}

		return ( ! empty( $template->wp_id ) ) ? (int) $template->wp_id : 0;
	}

	/**
	 * Render server-side CSS
	 *
	 * @since   1.3.0
	 * @access  public
	 */
	public function render_post_css() {
		$id       = 0;
		$enqueued = array();

		if ( is_singular() ) {
			$id = get_the_ID();
			$this->enqueue_styles( $id );
			$enqueued[] = $id;
		}

		$template_id = self::get_active_block_template_post_id();
		if ( $template_id && ! in_array( $template_id, $enqueued, true ) ) {
			if ( ! $id ) {
				$id = $template_id;
			}
			$this->enqueue_styles( $template_id );
			$enqueued[] = $template_id;
		}

		// Enqueue styles for other posts that display the_content, if any.
		add_filter(
			'the_content',
			function ( $content ) use ( $id ) {
				$post_id = get_the_ID();

				if ( $this->has_excerpt || ( $id && $id === $post_id ) ) {
					return $content;
				}

				$this->enqueue_styles( $post_id );
				$this->cfb_flipbox_font_awesome( $post_id );
				$this->cfb_flipbox_google_fonts( $post_id );

				return $content;
			}
		);
	}

	/**
	 * Enqueue CSS file for the specified post or the current post being viewed.
	 *
	 * @param int|null $post_id Post ID.
	 * @since   1.3.0
	 * @access  public
	 */
	public function enqueue_styles( $post_id = null ) {
		$post_id = $post_id ? $post_id : get_the_ID();

		if ( ! function_exists( 'has_blocks' ) ) {
			return;
		}

		if ( ! has_blocks( $post_id ) ) {
			return;
		}

		if ( is_preview() ) {
			add_action(
				'wp_footer',
				function () use ( $post_id ) {
					return $this->get_post_css( $post_id );
				},
				'the_content' === current_filter() ? PHP_INT_MAX : 10
			);

			return;
		}

		if ( ! CFB_Style_Handler::has_css_file( $post_id ) ) {
			if ( CFB_Style_Handler::is_writable() ) {
				CFB_Style_Handler::generate_css_file( $post_id );
			}

			add_action(
				'wp_footer',
				function () use ( $post_id ) {
					return $this->get_post_css( $post_id );
				},
				'the_content' === current_filter() ? PHP_INT_MAX : 10
			);

			return;
		}

		$file_url = CFB_Style_Handler::get_css_url( $post_id );

		$file_name = basename( $file_url );

		$content = get_post_field( 'post_content', $post_id );

		$blocks = parse_blocks( $content );

		if ( is_array( $blocks ) ) {
			$this->enqueue_reusable_styles( $blocks );
		}

		$total_inline_limit = 20000;
		// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound
		$total_inline_limit = apply_filters( 'styles_inline_size_limit', 20000 );

		$wp_upload_dir = wp_upload_dir( null, false );
		$basedir       = $wp_upload_dir['basedir'] . '/CoolPlugins-gutenberg/';
		$file_path     = $basedir . $file_name;
		$file_size     = filesize( $file_path );

		if ( $this->total_inline_size + $file_size < $total_inline_limit ) {
			add_action(
				'wp_footer',
				function () use ( $post_id ) {
					return $this->get_post_css( $post_id );
				},
				'the_content' === current_filter() ? PHP_INT_MAX : 10
			);

			$this->total_inline_size += (int) $file_size;
			return;
		}

		if ( 'the_content' === current_filter() ) {
			wp_enqueue_style( 'cfb-' . $file_name, $file_url, array(), CFB_VERSION );
			return;
		}

		add_action(
			'wp_footer',
			function () use ( $file_name, $file_url ) {
				wp_enqueue_style( 'cfb-' . $file_name, $file_url, array(), CFB_VERSION );
			}
		);
	}

	/**
	 * Enqueue CSS file for Reusable Blocks.
	 *
	 * This method enqueues the CSS file for the reusable blocks present in the provided list of blocks.
	 *
	 * @param array $blocks List of blocks to enqueue CSS for.
	 *
	 * @since   1.3.0
	 * @access  public
	 */
	public function enqueue_reusable_styles( $blocks ) {
		foreach ( $blocks as $block ) {
			if ( 'core/block' === $block['blockName'] && ! empty( $block['attrs']['ref'] ) ) {
				$this->enqueue_styles( $block['attrs']['ref'] );
			}

			if ( isset( $block['innerBlocks'] ) && ! empty( $block['innerBlocks'] ) && is_array( $block['innerBlocks'] ) ) {
				$this->enqueue_reusable_styles( $block['innerBlocks'] );
			}
		}
	}

	/**
	 * Get Post CSS.
	 *
	 * This method retrieves and outputs the CSS for a specific post.
	 *
	 * @param int $post_id Post ID for which to retrieve the CSS.
	 *
	 * @since   1.3.0
	 * @access  public
	 */
	public function get_post_css( $post_id = null ) {
		$post_id = $post_id ? $post_id : get_the_ID();
		if ( function_exists( 'has_blocks' ) && has_blocks( $post_id ) ) {
			$css = $this->get_page_css_meta( $post_id );

			if ( empty( $css ) || is_preview() ) {
				$css = $this->get_page_css_inline( $post_id );
			}
			if ( empty( $css ) ) {
				return;
			}

			$style  = "\n" . '<style type="text/css" media="all">' . "\n";
			echo '<style type="text/css">' . wp_strip_all_tags( $css ) . '</style>'; // phpcs:ignore
			$style .= "\n" . '</style>' . "\n";

		}
	}

	/**
	 * Retrieve the CSS for the blocks from post meta.
	 *
	 * Retrieves and returns the CSS for the blocks from the post meta based on the provided post ID.
	 *
	 * @param int $post_id Post ID for which to retrieve the CSS.
	 * @return string CSS for the blocks.
	 * @since   1.3.0
	 * @access  public
	 */
	public function get_page_css_meta( $post_id ) {
		$style = '';
		if ( function_exists( 'has_blocks' ) && has_blocks( $post_id ) ) {
		    $style .= get_post_meta( $post_id, '_coolPlugins_gutenberg_block_styles', true );

			$content = get_post_field( 'post_content', $post_id );

			$blocks = parse_blocks( $content );

			if ( ! is_array( $blocks ) || empty( $blocks ) ) {
				return $style;
			}
		}

		return $style;
	}

	/**
	 * Retrieve the CSS for the blocks inline.
	 *
	 * Retrieves and returns the CSS for the blocks inline based on the provided post ID.
	 *
	 * @param int $post_id Post ID for which to retrieve the CSS.
	 * @return string CSS for the blocks inline.
	 * @since   1.3.0
	 * @access  public
	 */
	public function get_page_css_inline( $post_id ) {
		global $post;

		// Do an early return if the condition if ( function_exists( 'has_blocks' ) && has_blocks( $post_id ) ) { isn't met.
		if ( ! function_exists( 'has_blocks' ) || ! has_blocks( $post_id ) ) {
			return '';
		}

		if ( is_preview() && ( $post_id === $post->ID ) ) {
			$content = $post->post_content;
		} else {
			$content = get_post_field( 'post_content', $post_id );
		}

		$blocks = parse_blocks( $content );

		if ( ! is_array( $blocks ) || empty( $blocks ) ) {
			return '';
		}

		$animations = boolval( preg_match( '/\banimated\b/', $content ) );

		$css = $this->cycle_through_blocks( $blocks, $animations );

		return stripslashes( $css );
	}

	/**
	 * Cycle through Blocks and generate block styles.
	 *
	 * This method cycles through the provided list of blocks and generates the corresponding block styles based on the animations parameter.
	 *
	 * @param array $blocks     List of blocks to cycle through.
	 * @param bool  $animations Whether to check for animations or not.
	 * @return string Block styles generated from the provided blocks.
	 * @since   1.3.0
	 * @access  public
	 */
	public function cycle_through_blocks( $blocks, $animations ) {
		$style  = '';
		$style .= $this->cycle_through_static_blocks( $blocks, $animations );
		// $style .= $this->cycle_through_reusable_blocks( $blocks );

		return $style;
	}

	/**
	 * Enqueue global default styles.
	 *
	 * This method enqueues the global default styles generated from the cycle_through_global_styles method.
	 *
	 * @since   2.0.0
	 * @access  public
	 */
	public function enqueue_global_styles() {
		$css = $this->cycle_through_global_styles();

		if ( empty( $css ) ) {
			return;
		}

		$style  = "\n" . '<style type="text/css" media="all">' . "\n";
		$style .= $css;
		$style .= "\n" . '</style>' . "\n";

		echo '<style type="text/css">' . wp_strip_all_tags( $css ) . '</style>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}

	/**
	 * Enqueue assets for third-party products to hook CFB styles.
	 *
	 * This method enqueues assets for third-party products to hook CFB styles by applying filters and processing the posts array.
	 *
	 * @since   2.0.1
	 * @access  public
	 */
	public function enqueue_assets() {
		$posts = apply_filters( 'coolplugins_gutenberg_blocks_enqueue_assets', array() );

		if ( 0 < count( $posts ) ) {
			foreach ( $posts as $post ) {
				$class = Registration::instance();
				$class->enqueue_block_styles( $post );
				$this->enqueue_styles( $post );
			}
		}
	}

	/**
	 * The instance method for the static class.
	 * Defines and returns the instance of the static class.
	 *
	 * @static
	 * @return CFB_Block_Frontend
	 * @since 1.3.0
	 * @access public
	 */
	public static function instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
			self::$instance->init();
		}

		return self::$instance;
	}
}
