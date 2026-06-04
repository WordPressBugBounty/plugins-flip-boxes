<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

if (!class_exists('CFB_Functions')) {

    class CFB_Functions {
    
        private const PREFIX = '_cfb_';
    
        public static function cfb_admin_assets() {
            $id = get_the_ID();
            if (get_post_type($id) === 'flipboxes' && get_post_status($id) === 'publish') {
                self::enqueue_conditional_styles($id);
                self::cfb_enqueue_scripts();
            }
        }
    
        private static function enqueue_conditional_styles($id) {
            if (get_post_meta($id, self::PREFIX . 'bootstrap', true) === 'enable') {
                wp_enqueue_style('cfb-flexboxgrid-style');
            }
            if (get_post_meta($id, self::PREFIX . 'font', true) === 'enable') {
                wp_enqueue_style('cfb-fontawesome');
            }else{
                wp_enqueue_script(
                    'cfb-remove-icons-admin',
                    CFB_URL . 'assets/js/remove-flipbox-icons.js',
                    [ 'jquery' ],
                    CFB_VERSION,
                    true
                );
                // 2) pass the current post ID so the script can target the right container
                wp_localize_script(
                    'cfb-remove-icons-admin',
                    'cfbPreviewData',
                    [ 'postId' => $id ]
                );
            }
        }
    
        public static function cfb_enqueue_scripts() {    
            wp_enqueue_style('cfb-styles');
            wp_enqueue_script('cfb-jquery-flip');
            wp_enqueue_script('cfb-imagesloader');  
            wp_enqueue_script('cfb-custom-js');   
        }
    
    public static function cfb_display_live_preview() {
        // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Reading URL parameter in admin context for display purposes only
        if (isset($_REQUEST['post']) && !is_array($_REQUEST['post'])) {
            // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Reading URL parameter in admin context for display purposes only
            $id=(int) filter_var( wp_unslash( $_REQUEST['post'] ), FILTER_SANITIZE_NUMBER_INT );
                return do_shortcode("[flipboxes id='$id']") . 
                       '<br><br><p><strong class="micon-info-circled"></strong>' .
                       'Backend preview may be a little bit different from frontend / actual view. ' .
                       "Add this shortcode on any page for frontend view - <code>[flipboxes id=$id]</code></p>";
            }
            return '<h4><strong class="micon-info-circled"></strong> Publish to preview the Flip Boxes.</h4>';
        }
    
        public static function cfb_get_post_type_page() {
            global $post, $typenow, $current_screen;
            
        if ($post && $post->post_type) return $post->post_type;
        if ($typenow) return $typenow;
        if ($current_screen && $current_screen->post_type) return $current_screen->post_type;
        // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Reading URL parameter in admin context to determine current post type
        if (isset($_REQUEST['post_type'])) return sanitize_key( wp_unslash($_REQUEST['post_type']));
        // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Reading URL parameter in admin context to determine current post type
        if (isset($_REQUEST['post'])) return get_post_type(absint($_REQUEST['post']));  
            return null;
        }
    }
}