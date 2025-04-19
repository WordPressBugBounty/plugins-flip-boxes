<?php

use CoolPlugins\GutenbergBlocks\Registration;

/**
 * Class Cfb_Block
 *
 * The Cfb_Block class represents a block in the CoolPlugins Gutenberg Blocks plugin.
 * This class provides methods for initializing hooks, including required files, and autoloading classes for each block.
 *
 * @package CoolPlugins\GutenbergBlocks
 */
class Cfb_Block {
	/**
	 * Singleton method to initialize the class instance.
	 *
	 * This method ensures that only one instance of the class is created and returns that instance.
	 *
	 * @static
	 * @return Cfb_Block
	 * @access public
	 */
	protected static $instance = null;

	/**
	 * Method to define hooks needed for initializing the class.
	 *
	 * This method initializes the necessary hooks for the class to work properly.
	 *
	 * @since   1.0.0
	 * @access  public
	 */
	public function init() {
		// Add action to autoload classes on WordPress initialization.
		add_action( 'init', array( $this, 'autoload_classes' ), 9 );
	}

	/**
	 * Include required files for the story timeline.
	 *
	 * This method includes the necessary files for the story timeline functionality to work properly.
	 *
	 * @since   1.0.0
	 * @access  public
	 */
	public function required_files() {
		require_once CFB_DIR_PATH . '/includes/cfb-block/inc/class-registration.php';
		require_once CFB_DIR_PATH . '/includes/cfb-block/inc/class-cfb-css-base.php';
		require_once CFB_DIR_PATH . '/includes/cfb-block/inc/css/class-cfb-block-frontend.php';
		require_once CFB_DIR_PATH . '/includes/cfb-block/inc/css/class-cfb-style-handler.php';
		require_once CFB_DIR_PATH . 'includes/cfb-block/inc/css/class-cfb-style-utility.php';
		require_once CFB_DIR_PATH . '/includes/cfb-block/inc/css/class-cfb-block-style.php';
	}

	/**
	 * Autoload classes for each block and initialize them if they have an 'instance' method.
	 *
	 * This method autoloads the classes required for each block and initializes them if they have an 'instance' method.
	 * It also loads the plugin text domain and applies filters to the class names for autoloading.
	 *
	 * @since   1.0.0
	 * @access  public
	 */
	public function autoload_classes() {
		$this->required_files();
		load_plugin_textdomain( 'cfb-blocks', false, basename( CFB_DIR_PATH ) . '/languages/' );

		$classnames = array(
			'CoolPlugins\GutenbergBlocks\Registration',
			'CoolPlugins\GutenbergBlocks\CFB_Block_Frontend',
			'CoolPlugins\GutenbergBlocks\CFB_Style_Handler',
		);

		$classnames = apply_filters( 'cfb_blocks_autoloader', $classnames );

		foreach ( $classnames as $classname ) {
			$classname = new $classname();

			if ( method_exists( $classname, 'instance' ) ) {
				$classname->instance();
			}
		}
	}

	/**
	 * Get the single instance of the Cfb_Block class.
	 *
	 * This method returns the single instance of the Cfb_Block class, initializing it if it's not already initialized.
	 *
	 * @static
	 * @return  Cfb_Block The single instance of the Cfb_Block class.
	 * @access  public
	 */
	public static function instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
			self::$instance->init();
		}

		return self::$instance;
	}
}
