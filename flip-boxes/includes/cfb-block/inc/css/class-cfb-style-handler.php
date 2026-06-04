<?php
namespace CoolPlugins\GutenbergBlocks;

use CoolPlugins\GutenbergBlocks\Cfb_CSS_Base;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class representing the style handler for CFB blocks.
 * Extends the Cfb_CSS_Base class to inherit its functionality.
 */
class CFB_Style_Handler extends Cfb_CSS_Base {

	/**
	 * The main instance variable for CFB_Style_Handler.
	 *
	 * @var CFB_Style_Handler|null
	 */
	public static $instance = null;

	/**
	 * Initializes the class and sets up the necessary actions.
	 */
	public function init() {
		// Register REST API route for CFB blocks.
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
		// Autoload block classes for CFB blocks.
		add_action( 'rest_api_init', array( $this, 'autoload_block_classes' ) );
		// Delete CSS file before post deletion for CFB blocks.
		add_action( 'before_delete_post', array( __CLASS__, 'delete_css_file' ) );
	}

	/**
	 * Register REST API route for saving post CSS.
	 *
	 * Registers a REST API route for saving post CSS. This method is accessible since version 1.3.0 and is public.
	 *
	 * @since   1.3.0
	 * @access  public
	 */
	public function register_routes() {
		$namespace = $this->namespace . $this->version;

		register_rest_route(
			$namespace,
			'/post_styles/(?P<id>\d+)',
			array(
				array(
					'methods'             => \WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'save_post_meta' ),
					'args'                => array(
						'id' => array(
							'type'              => 'integer',
							'required'          => true,
							'description'       => __( 'ID of the Post.', 'flip-boxes' ),
							'validate_callback' => function ( $param, $request, $key ) {
								return is_numeric( $param );
							},
						),
					),
					'permission_callback' => function ( $request ) {
						$post_id = absint( $request['id'] );
						$post    = get_post( $post_id );
						if ( $post && in_array( $post->post_type, array( 'wp_template', 'wp_template_part' ), true ) ) {
							return current_user_can( 'edit_theme_options' );
						}
						return current_user_can( 'edit_post', $post_id );
					},
				),
			)
		);
	}

	/**
	 * Function to save post CSS.
	 *
	 * Saves the CSS for a post. This method is accessible since version 1.3.0 and is public.
	 *
	 * @param \WP_REST_Request $request Rest request.
	 *
	 * @return mixed
	 * @since   1.3.0
	 * @access  public
	 */
	public function save_post_meta( \WP_REST_Request $request ) {
		$post_id = absint( $request->get_param( 'id' ) );
		$post    = get_post( $post_id );

		if ( $post && in_array( $post->post_type, array( 'wp_template', 'wp_template_part' ), true ) ) {
			if ( ! current_user_can( 'edit_theme_options' ) ) {
				return new WP_Error( 'rest_forbidden', __( 'Forbidden', 'flip-boxes' ), array( 'status' => 403 ) );
			}
		} elseif ( ! current_user_can( 'edit_post', $post_id ) ) {
			return new WP_Error( 'rest_forbidden', __( 'Forbidden', 'flip-boxes' ), array( 'status' => 403 ) );
		}
      
		self::generate_css_file( $post_id );
		return rest_ensure_response( array( 'message' => __( 'CSS updated.', 'flip-boxes' ) ) );
	}

	/**
	 * Generate CSS file for the specified post.
	 *
	 * This method generates the CSS file for the specified post by retrieving the CSS content using the get_blocks_css method and then saving it using the save_css_file method.
	 *
	 * @param int $post_id The ID of the post for which the CSS file is to be generated.
	 */
	public static function generate_css_file( $post_id ) {

		$css = self::instance()->get_blocks_css( $post_id );
		self::save_css_file( $post_id, $css );
	}

	/**
	 * Get the URL of the CSS file for the specified post.
	 *
	 * This method retrieves the URL of the CSS file for the specified post or widget.
	 *
	 * @param int|string $type The ID of the post or the type of widget for which the CSS URL is to be retrieved.
	 *
	 * @return string|false The URL of the CSS file, or false if no CSS file is found.
	 */
	public static function get_css_url( $type = 'widgets' ) {
		$file_name = '';

		if ( 'widgets' === $type ) {
			$file_name = get_option( 'CoolPlugins_blocks_widgets_css_file' );
		} else {
			$file_name = get_post_meta( $type, '_CoolPlugins_gutenberg_block_stylesheet', true );
		}

		if ( empty( $file_name ) ) {
			return false;
		}

		$wp_upload_dir = wp_upload_dir( null, false );
		$baseurl       = $wp_upload_dir['baseurl'] . '/CoolPlugins-gutenberg/';

		return $baseurl . $file_name . '.css';
	}
     
	/**
	 * Check if a CSS file exists for the specified post or widget.
	 *
	 * This method checks if a CSS file exists for the specified post or widget by checking the option for widgets or retrieving the post meta for the block stylesheet.
	 *
	 * @param int|string $type The ID of the post or the type of widget.
	 *
	 * @return bool True if the CSS file exists, false otherwise.
	 */
	public static function has_css_file( $type = 'widgets' ) {
		$file_name = '';

		if ( 'widgets' === $type ) {
			$file_name = get_option( 'CoolPlugins_blocks_widgets_css_file' );
		} else {
			$file_name = get_post_meta( $type, '_CoolPlugins_gutenberg_block_stylesheet', true );
		}

		if ( empty( $file_name ) ) {
			return false;
		}

		$wp_upload_dir = wp_upload_dir( null, false );
		$basedir       = $wp_upload_dir['basedir'] . '/CoolPlugins-gutenberg/';
		$file_path     = $basedir . $file_name . '.css';

		return is_file( $file_path );
	}

	/**
	 * Save the CSS content into the WordPress Filesystem.
	 *
	 * This method saves the CSS content into the WordPress Filesystem by generating a unique file name, filtering and compressing the CSS content, and updating the post meta for block styles and fonts.
	 *
	 * @param int    $post_id The ID of the post for which the CSS file is to be saved.
	 * @param string $css The CSS content to be saved.
	 *
	 * @since   1.3.0
	 * @access  public
	 */
	public static function save_css_file( $post_id, $css ) {

		if ( self::$font_awesome_library_load ) {
			update_post_meta( $post_id, '_CoolPlugins_gutenberg_block_fontawesome_libraray', true );
		} else {
			delete_post_meta( $post_id, '_CoolPlugins_gutenberg_block_fontawesome_libraray' );
		}

		if ( empty( $css ) ) {
			return self::delete_css_file( $post_id );
		}

		global $wp_filesystem;
		require_once ABSPATH . '/wp-admin/includes/file.php';
		WP_Filesystem();

		$file_name     = 'post-v2-' . $post_id . '-' . time();
		$wp_upload_dir = wp_upload_dir( null, false );
		$upload_dir    = $wp_upload_dir['basedir'] . '/CoolPlugins-gutenberg/';
		$file_path     = $upload_dir . $file_name . '.css';

		$css = wp_filter_nohtml_kses( $css );

		$css = htmlspecialchars_decode( $css );
		$css = preg_replace( '/\\\\/', '', $css );

		$css = self::compress( $css );
		update_post_meta( $post_id, '_CoolPlugins_gutenberg_block_styles', $css );

		$existing_file      = get_post_meta( $post_id, '_CoolPlugins_gutenberg_block_stylesheet', true );
		$existing_file_path = $upload_dir . $existing_file . '.css';

		if ( $existing_file && is_file( $existing_file_path ) ) {
			self::delete_css_file( $post_id );
		}

		if ( count( self::$google_fonts ) > 0 ) {
			update_post_meta( $post_id, '_CoolPlugins_gutenberg_block_fonts', self::$google_fonts );
		} else {
			if ( get_post_meta( $post_id, '_CoolPlugins_gutenberg_block_fonts', true ) ) {
				delete_post_meta( $post_id, '_CoolPlugins_gutenberg_block_fonts' );
			}
		}

		if ( self::is_writable() ) {
			$target_dir = $wp_filesystem->is_dir( $upload_dir );

			if ( ! $wp_filesystem->is_writable( $wp_upload_dir['basedir'] ) ) {
				return false;
			}

			if ( ! $target_dir ) {
				wp_mkdir_p( $upload_dir );
			}

			$wp_filesystem->put_contents( $file_path, stripslashes( $css ), FS_CHMOD_FILE );

			if ( file_exists( $file_path ) ) {
				update_post_meta( $post_id, '_CoolPlugins_gutenberg_block_stylesheet', $file_name );
			}
		}
	}

	/**
	 * Deletes the CSS file from the WordPress Filesystem.
	 *
	 * This function deletes the CSS file associated with the given post ID from the WordPress Filesystem.
	 *
	 * @param int $post_id The ID of the post.
	 * @since   1.3.0
	 * @access  public
	 */
	public static function delete_css_file( $post_id ) {
		global $wp_filesystem;

		// Check if the current user has the capability to edit posts.
		if ( ! current_user_can( 'edit_posts' ) ) {
			return false;
		}

		// Include the WordPress filesystem API.
		require_once ABSPATH . '/wp-admin/includes/file.php';
		WP_Filesystem();

		// Get the upload directory path.
		$wp_upload_dir = wp_upload_dir( null, false );

		// Check if the upload directory is writable.
		if ( ! $wp_filesystem->is_writable( $wp_upload_dir['basedir'] ) ) {
			return;
		}

		// Get the file name from post meta.
		$file_name = get_post_meta( $post_id, '_CoolPlugins_gutenberg_block_stylesheet', true );

		// Delete the post meta for the stylesheet.
		if ( $file_name ) {
			delete_post_meta( $post_id, '_CoolPlugins_gutenberg_block_stylesheet' );
		}

		// Set the upload directory and file path.
		$upload_dir = $wp_upload_dir['basedir'] . '/CoolPlugins-gutenberg/';
		$file_path  = $upload_dir . $file_name . '.css';

		// Check if the file exists and is writable.
		if ( ! file_exists( $file_path ) || ! self::is_writable() ) {
			return;
		}

		// Delete the CSS file from the filesystem.
		$wp_filesystem->delete( $file_path, true );
	}

	/**
	 * Check if the upload directory is writable.
	 *
	 * This function checks if the upload directory is writable by utilizing the WordPress Filesystem API.
	 *
	 * @return bool Whether the upload directory is writable or not.
	 * @since   2.0.0
	 * @access  public
	 */
	public static function is_writable() {
		global $wp_filesystem;
		include_once ABSPATH . 'wp-admin/includes/file.php';
		WP_Filesystem();

		$wp_upload_dir = wp_upload_dir( null, false );
		$upload_dir    = $wp_upload_dir['basedir'];

		if ( ! function_exists( 'WP_Filesystem' ) ) {
			return false;
		}

		$writable = WP_Filesystem( false, $upload_dir );

		return $writable && 'direct' === $wp_filesystem->method;
	}

	/**
	 *
	 * @param string $css The CSS to be compressed.
	 *
	 * @since   1.3.0
	 * @access  public
	 */
	public static function compress( $css ) {
		// Remove comments.
		$buffer = preg_replace( '!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $css );
		// Remove space after colons.
		$buffer = str_replace( ': ', ':', $buffer );
		// Remove whitespace.
		$buffer = str_replace( array( "\r\n", "\r", "\n", "\t" ), '', $buffer );
		$buffer = preg_replace( ' {2,}', ' ', $buffer );
		// Write everything out.
		return $buffer;
	}

	/**
	 * The instance method for the static class.
	 * Defines and returns the instance of the static class.
	 *
	 * @static
	 * @return CFB_Style_Handler The instance of the static class.
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
