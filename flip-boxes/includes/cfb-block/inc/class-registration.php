<?php
namespace CoolPlugins\GutenbergBlocks;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class Registration
 *
 * This class handles the registration of custom Gutenberg blocks.
 */
class Registration {

	/**
	 * The main instance variable for the Registration class.
	 *
	 * @var Registration|null
	 */
	public static $instance = null;

	/**
	 * An array containing all the registered blocks.
	 *
	 * @var array
	 */
	public static $blocks = array();


	/**
	 * Initializes the class and registers the blocks.
	 */
	public function init() {
		add_action( 'init', array( $this, 'register_blocks' ) );
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_block_editor_assets' ) );
		add_action( 'enqueue_block_assets', array( $this, 'enqueue_block_assets' ) );
	}

	/**
	 * Retrieves block metadata from a file.
	 *
	 * @param string $metadata_file The link to the metadata file.
	 *
	 * @return mixed The block metadata if found, false otherwise.
	 * @since   2.0.0
	 * @access public
	 */
	public function get_metadata( $metadata_file ) {
		if ( ! file_exists( $metadata_file ) ) {
			return false;
		}

		$metadata = json_decode( file_get_contents( $metadata_file ), true );

		if ( ! is_array( $metadata ) || empty( $metadata['name'] ) ) {
			return false;
		}

		return $metadata;
	}

	/**
	 * Enqueue assets for the Gutenberg block editor.
	 *
	 * This method enqueues the necessary scripts and styles for the Gutenberg block editor.
	 *
	 * @since   2.0.0
	 * @access  public
	 */
	public function enqueue_block_editor_assets() {
		$asset_file = include CFB_DIR_PATH . 'includes/cfb-block/build/index.asset.php';

		$current_screen = get_current_screen();

		wp_enqueue_script(
			'cfb-blocks',
			CFB_URL . 'includes/cfb-block/build/index.js',
			array_merge(
				$asset_file['dependencies']
			),
			$asset_file['version'],
			true
		);

		wp_localize_script(
			'cfb-blocks',
			'cfbBlockGutenbergObject',
			array(
				'isBlockEditor' => 'post' === $current_screen->base,
				'cfbBlockIcon'  => CFB_URL . 'assets/images/flip-icon-90x90.png',
				'cfbBlockUrl'   => CFB_URL,
			)
		);

		wp_enqueue_style( 'cfb-block-editor', CFB_URL . 'includes/cfb-block/build/index.css', array( 'wp-edit-blocks' ), $asset_file['version'] );
		wp_enqueue_style( 'cfb-block-fontawesome', CFB_URL . 'assets/fontawesome/css/font-awesome.min.css', array(), CFB_VERSION );
	}

	/**
	 * Enqueue frontend assets for the cool flip box blocks.
	 *
	 * This method enqueues the necessary scripts and styles for the cool flip box blocks on the frontend.
	 *
	 * @since   2.0.0
	 * @access  public
	 */
	public function enqueue_block_assets() {

		/**
		 * Check if the current context is in the admin area and return early if true.
		 */
		if ( is_admin() ) {
			return;
		}

		/**
		 * Enqueue block styles if the current context is singular.
		 */
		if ( is_singular() ) {
			$this->enqueue_block_styles();
		}

	}

	/**
	 * Enqueue block styles for the cool flip box blocks.
	 *
	 * This method enqueues the necessary styles for the cool flip box blocks in the editor.
	 *
	 * @since   2.0.0
	 * @param null $post Current post.
	 * @access  public
	 */
	public function enqueue_block_styles( $post = null ) {
		// Check if the cool flip box block is present in the post.
		if ( has_block( 'cp/cool-flipbox-block', $post ) ) {
			// Define the path for the block and style files.
			$block_path    = CFB_DIR_PATH . 'includes/cfb-block/build';
			$metadata_file = trailingslashit( $block_path ) . 'block.json';
			$style_file    = trailingslashit( $block_path ) . 'style-index.css';
			$metadata      = $this->get_metadata( $metadata_file );
			$style_path    = CFB_URL . 'includes/cfb-block/build/style-index.css';
			// Enqueue the block styles if metadata is available.
			if ( false !== $metadata ) {
				$asset_file = include $block_path . '/index.asset.php';
				// Register and enqueue the block style.
				if ( file_exists( $style_file ) && ! empty( $metadata['style'] ) ) {
					wp_register_style(
						$metadata['style'],
						$style_path,
						array(),
						$asset_file['version']
					);
					wp_style_add_data( $metadata['style'], 'path', $style_path );
				}
			}
		}
	}

	/**
	 * Register the cool flip box blocks.
	 *
	 * This method registers the cool flip box blocks and enqueues the necessary editor styles.
	 *
	 * @since   2.0.0
	 * @access  public
	 */
	public function register_blocks() {
		// Define the path for the block and editor style files.
		$block_path    = CFB_DIR_PATH . 'includes/cfb-block/build/';
		$editor_style  = CFB_URL . 'includes/cfb-block/build/index.css';
		$metadata_file = trailingslashit( $block_path ) . 'block.json';
		$metadata      = $this->get_metadata( $metadata_file );
		$asset_file    = include CFB_DIR_PATH . 'includes/cfb-block/build/index.asset.php';
		$deps          = array();
		// Enqueue the editor styles if metadata is available.
		if ( file_exists( $editor_style ) && ! empty( $metadata['editorStyle'] ) ) {
			wp_register_style(
				$metadata['editorStyle'],
				$editor_style,
				$deps,
				$asset_file['version']
			);
		}
		// Register the block type from metadata.
		register_block_type_from_metadata( $metadata_file );
	}

	/**
	 * Returns the instance of the static class.
	 *
	 * This method ensures that only one instance of the class is created and returns that instance.
	 *
	 * @static
	 * @since 1.0.0
	 * @access public
	 * @return Registration
	 */
	public static function instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
			self::$instance->init();
		}

		return self::$instance;
	}
}

