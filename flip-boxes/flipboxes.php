<?php
/*
 Plugin Name:Cool Flipbox
 Plugin URI:https://coolplugins.net/
 Description:Use animated Flip Boxes WordPress plugin to highlight your content inside your page in a great way. Use shortcode to add anywhere.
 Version:1.9.3
 License:GPL2
 Author:Cool Plugins
 Author URI:https://coolplugins.net/?utm_source=cfb_plugin&utm_medium=inside&utm_campaign=author_page&utm_content=plugins_list
 License URI:https://www.gnu.org/licenses/gpl-2.0.html
 Domain Path: /languages
 Text Domain:c-flipboxes
*/
defined( 'ABSPATH' ) or die( 'No script kiddies please!' );
define('CFB_VERSION', '1.9.3');
define('CFB_DIR_PATH', plugin_dir_path(__FILE__));
define('CFB_URL', plugin_dir_url(__FILE__));

if ( ! class_exists( 'CflipBoxes' ) ) {

	/**
	 * Class CflipBoxes
	 */
	class CflipBoxes {

		/**
		 * Initializes the plugin functions
		 */
		function __construct() {
			if ( is_admin() ) {
				require_once CFB_DIR_PATH . 'admin/feedback/admin-feedback-form.php';  // Include admin feedback form
			}
			$this->cfb_includes(); // Include necessary files
			add_action( 'plugins_loaded',array($this,'text_domain_path_set'));
			add_action( 'admin_enqueue_scripts', array( 'CFB_Functions', 'cfb_admin_assets' ) );  // Add action for admin assets
			add_action( 'activated_plugin', array( $this, 'cfb_activation_redirect' ) );
			add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), array( $this, 'cfb_plugin_action_links' ) );
			add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), array( $this, 'cfb_plugin_action_links' ) );
		}

		function text_domain_path_set(){
			load_plugin_textdomain( 'c-flipboxes', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
		}
		// added setting page link to the plugin
		function cfb_plugin_action_links( $links ) {
			$settings_link = '<a href="' . esc_url(admin_url( 'options-general.php?page=cfb_settings' )) . '">Settings</a>';
			array_unshift( $links, $settings_link );
			return $links;
		}

		// redirect to the setting sub menu page when plugin is activated
		function cfb_activation_redirect( $plugin ) {
			if ( $plugin == plugin_basename( __FILE__ ) ) {
				// Add nonce verification
				$nonce = wp_create_nonce('cfb_activation_redirect');
				exit( wp_redirect( admin_url( 'options-general.php?page=cfb_settings&_wpnonce=' . $nonce ) ) );
			}
		}
		/**
		 * Include necessary files
		 */
		public function cfb_includes() {
			require_once CFB_DIR_PATH . '/includes/cfb-functions.php';  // Include plugin functions
			$flip_type_option = sanitize_text_field(get_option('cfb_flip_type_option', 'post'));
			if ($flip_type_option === 'post') {
				require_once CFB_DIR_PATH . '/includes/cfb-shortcode.php';  // Include shortcode
				new CFB_Shortcode();    // Initialize shortcode
			} else {
				require_once CFB_DIR_PATH . '/includes/cfb-block/inc/class-cfb-block.php';
				Cfb_Block::instance();
			}

            $flip_type = get_option('cfb_flip_type_option', 'post');
            if ($flip_type === 'post') {
                require_once CFB_DIR_PATH . '/includes/cfb-shortcode.php';
                new CFB_Shortcode();
            } else {
                require_once CFB_DIR_PATH . '/includes/cfb-block/inc/class-cfb-block.php';
                Cfb_Block::instance();
            }

            if (is_admin()) {
                $this->load_admin_files();
            }
        }

		private function load_admin_files() {
            require_once CFB_DIR_PATH . 'admin/feedback/admin-feedback-form.php';
            require_once CFB_DIR_PATH . '/admin/cfb-post-type.php';
            new CFB_post_type();
            require_once CFB_DIR_PATH . '/includes/cfb-feedback-notice.php';
            new CFB_CoolPlugins_Review_Notice();

            if (CFB_Functions::cfb_get_post_type_page() === 'flipboxes') {
                $this->load_cmb2_files();
            }
        }

		private function load_cmb2_files() {
            $cmb2_init_file = CFB_DIR_PATH . '/admin/CMB2/init.php';
            if (file_exists($cmb2_init_file)) {
                require_once $cmb2_init_file;
                require_once CFB_DIR_PATH . '/admin/CMB2/cmb2-fontawesome-picker.php';
            }
        }

		/**
		 * Activating plugin and adding some info
		 */
        public static function activate() {
            update_option('Flip-Boxes-v', CFB_VERSION);
            update_option('Flip-Boxes-type', 'FREE');
            update_option('Flip-Boxes-installDate', date('Y-m-d H:i:s'));
            update_option('Flip-Boxes-ratingDiv', 'no', false);
        }
		// END public static function activate

		/**
		 * Deactivate the plugin
		 */
		public static function deactivate() {
			// Do nothing
		}

	}//end class

}

// Installation and uninstallation hooks
register_activation_hook(__FILE__, [CflipBoxes::class, 'activate']);
register_deactivation_hook(__FILE__, [CflipBoxes::class, 'deactivate']);

$CflipBoxes_obj = new CflipBoxes(); // initialization of plugin

