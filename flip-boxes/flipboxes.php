<?php
/*
 Plugin Name:Cool Flipbox
 Plugin URI:https://coolplugins.net/
 Description:Use animated Flip Boxes WordPress plugin to highlight your content inside your page in a great way. Use shortcode to add anywhere.
 Version:2.0.0
 Author:Cool Plugins
 Author URI:https://coolplugins.net/?utm_source=cfb_plugin&utm_medium=inside&utm_campaign=author_page&utm_content=plugins_list
 License:GPL2
 License URI:https://www.gnu.org/licenses/gpl-2.0.html
 Text Domain: flip-boxes
*/
defined( 'ABSPATH' ) or die( 'No script kiddies please!' );
define('CFB_VERSION', '2.0.0');
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

			if (!get_option( 'cfb-initial-save-version' ) ) {
                add_option( 'cfb-initial-save-version', CFB_VERSION );
            }
            if(!get_option( 'cfb-install-date' ) ) {
                add_option( 'cfb-install-date', gmdate('Y-m-d h:i:s') );
            }
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
                $nonce = wp_create_nonce( 'cfb_activation_redirect' );
        
                // Safe redirect
                wp_safe_redirect( admin_url( 'options-general.php?page=cfb_settings&_wpnonce=' . $nonce ) );
        
                exit; // must be separate after wp_safe_redirect()
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
            require_once CFB_DIR_PATH . 'admin/feedback/cfb-feedback-notice.php';

			
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
            update_option('Flip-Boxes-installDate', gmdate('Y-m-d H:i:s'));
            update_option('Flip-Boxes-ratingDiv', 'no', false);
        }
		// END public static function activate

		/**
		 * Deactivate the plugin
		 */
		public static function deactivate() {
			// Do nothing
		}


		public static function cfb_get_user_info(){
        global $wpdb;
        // Server and WP environment details
        $server_info = [

            
            'server_software'        => isset($_SERVER['SERVER_SOFTWARE']) ? sanitize_text_field( wp_unslash( $_SERVER['SERVER_SOFTWARE'] ) ) : 'N/A',
            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
            'mysql_version'          => $wpdb ? sanitize_text_field($wpdb->get_var("SELECT VERSION()")) : 'N/A',
            'php_version'            => sanitize_text_field(phpversion() ?: 'N/A'),
            'wp_version'             => sanitize_text_field(get_bloginfo('version') ?: 'N/A'),
            'wp_debug'               => (defined('WP_DEBUG') && WP_DEBUG) ? 'Enabled' : 'Disabled',
            'wp_memory_limit'        => sanitize_text_field(ini_get('memory_limit') ?: 'N/A'),
            'wp_max_upload_size'     => sanitize_text_field(ini_get('upload_max_filesize') ?: 'N/A'),
            'wp_permalink_structure' => sanitize_text_field(get_option('permalink_structure') ?: 'Default'),
            'wp_multisite'           => is_multisite() ? 'Enabled' : 'Disabled',
            'wp_language'            => sanitize_text_field(get_option('WPLANG') ?: get_locale()),
            'wp_prefix'              => isset($wpdb->prefix) ? sanitize_key($wpdb->prefix) : 'N/A',
        ];
        // Theme details
        $theme = wp_get_theme();
        $theme_data = [
            'name'      => sanitize_text_field($theme->get('Name')),
            'version'   => sanitize_text_field($theme->get('Version')),
            'theme_uri' => esc_url($theme->get('ThemeURI')),
        ];
        if (!function_exists('get_plugins')) {
            require_once ABSPATH . 'wp-admin/includes/plugin.php';
        }
        if (!function_exists('get_plugin_data')) {
            require_once ABSPATH . 'wp-admin/includes/plugin.php';
        }
        $plugin_data = [];
        $active_plugins = get_option('active_plugins', []);
        foreach ($active_plugins as $plugin_path) {
            $plugin_file = WP_PLUGIN_DIR . '/' . ltrim($plugin_path, '/');
            if (file_exists($plugin_file)) {
                $plugin_info = get_plugin_data($plugin_file, false, false);
                $plugin_url = !empty($plugin_info['PluginURI']) ? esc_url($plugin_info['PluginURI']) : (!empty($plugin_info['AuthorURI']) ? esc_url($plugin_info['AuthorURI']) : 'N/A');
                $plugin_data[] = [
                    'name'       => sanitize_text_field($plugin_info['Name']),
                    'version'    => sanitize_text_field($plugin_info['Version']),
                    'plugin_uri' => !empty($plugin_url) ? $plugin_url : 'N/A',
                ];
            }
        }

         
        return [
            'server_info'   => $server_info,
            'extra_details' => [
                'wp_theme'       => $theme_data,
                'active_plugins' => $plugin_data,
            ],
        ];
	}
}

}

// Installation and uninstallation hooks
register_activation_hook(__FILE__, [CflipBoxes::class, 'activate']);
register_deactivation_hook(__FILE__, [CflipBoxes::class, 'deactivate']);
// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
$CflipBoxes_obj = new CflipBoxes(); // initialization of plugin

