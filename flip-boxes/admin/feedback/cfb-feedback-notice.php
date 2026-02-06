<?php

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}
/*
|--------------------------------------------------------------|
|   Admin Side Plugin Review Notice - CoolPlugins.net          |
|--------------------------------------------------------------|
*/

if ( ! class_exists( 'CFB_CoolPlugins_Review_Notice' ) ) {
	class CFB_CoolPlugins_Review_Notice {

		public function __construct() {
          
         
            if(is_admin()){
                add_action( 'admin_notices',array($this,'fcb_admin_notice_for_reviews'));
                add_action( 'admin_enqueue_scripts', array($this, 'fcb_load_script' ) );
                add_action( 'wp_ajax_cfb_dismiss_notice',array($this,'fcb_dismiss_review_notice' ) );
            }
        }

        /**
         * Load script to dismiss notices.
         *
         * @return void
         */
        public function fcb_load_script() {

            
            wp_register_script( 'cfb-feedback-notice-script', plugin_dir_url(__FILE__) . 'js/cfb-review-notice.js', array( 'jquery' ), CFB_VERSION, true );
            wp_register_style( 'cfb-feedback-notice-styles', plugin_dir_url(__FILE__) . 'css/review-notice.css', array(), CFB_VERSION );
           
           
            
        }
        // ajax callback for review notice
        public function fcb_dismiss_review_notice(){
            if(!isset($_POST['private']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['private'])),'fcb_review_notice_private')){
                wp_send_json_error(array('message'=>'nonce verification failed'));
                exit;
            }
            update_option( 'Flip-Boxes-ratingDiv','yes' );
            echo  json_encode( array("success"=>"true") );
            exit;
        }
        // admin notice  
        public function fcb_admin_notice_for_reviews(){
            if( !current_user_can( 'manage_options' ) ){
                return;
            }
            // get installation dates and rated settings
            $installation_date = get_option( 'Flip-Boxes-installDate' );
            $alreadyRated =get_option( 'Flip-Boxes-ratingDiv' )!=false?get_option( 'Flip-Boxes-ratingDiv'):"no";
            
            if(null != get_option('cfb-ratingDiv')){
                $ratingDiv = get_option('cfb-ratingDiv');
                if($ratingDiv=="yes"){
                    $alreadyRated ="yes";
                }
            }

            // check user already rated 
            if( $alreadyRated=="yes") {
                    return;
                }
                
                // grab plugin installation date and compare it with current date
                $display_date = gmdate( 'Y-m-d h:i:s' );
                $install_date= new DateTime( $installation_date );
                $current_date = new DateTime( $display_date );
                $difference = $install_date->diff($current_date);
                $diff_days= $difference->days;
                
                // check if installation days is greator then week
                if (isset($diff_days) && $diff_days>=3) {
                     wp_enqueue_script( 'cfb-feedback-notice-script' );
                     wp_enqueue_style( 'cfb-feedback-notice-styles' );
                     // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
                    echo $this->create_notice_content();
                    }
        }  

        // generated review notice HTML
        function create_notice_content(){
            
            $ajax_url=admin_url( 'admin-ajax.php' );
            $ajax_callback='cfb_dismiss_notice';
            $wrap_cls="notice notice-info is-dismissible";
            $img_path=CFB_URL.'assets/images/fcb-logo.png';
            $p_name="Flip Boxes";
            $like_it_text='Rate Now! ★★★★★';
            $already_rated_text=esc_html__( 'Already Reviewed', 'flip-boxes' );
            $not_like_it_text=esc_html__( 'No, not good enough, i do not like to rate it!', 'flip-boxes' );
            $not_interested=esc_html__( 'Not Interested', 'flip-boxes' );
            $p_link=esc_url('https://wordpress.org/support/plugin/flip-boxes/reviews/#new-post');
            $nonce=wp_create_nonce('fcb_review_notice_private');
        
            $message="Thanks for using <b>$p_name</b> - WordPress plugin. We hope you liked it ! <br/>Please give us a quick rating, it works as a boost for us to keep working on more <a href='https://coolplugins.net' target='_blank'><strong>Cool Plugins</strong></a>!<br/>";
        
            $html='<div data-nonce="%11$s" data-ajax-url="%8$s"  data-ajax-callback="%9$s" class="cool-feedback-notice-wrapper %1$s">
            
            <div class="message_container">%4$s
            <div class="callto_action">
            <ul>
                <li class="love_it"><a href="%5$s" class="like_it_btn button button-primary" target="_new" title="%6$s">%6$s</a></li>
                <li class="already_rated"><a href="javascript:void(0);" class="already_rated_btn button cfb_dismiss_notice" title="%7$s">%7$s</a></li>             
                <li class="already_rated"><a href="javascript:void(0);" class="already_rated_btn button cfb_dismiss_notice" title="%10$s">%10$s</a></li>           
            </ul>
            <div class="clrfix"></div>
            </div>
            </div>
            </div>';

            return sprintf($html,
                    $wrap_cls,
                    $img_path,
                    $p_name,
                    $message,
                    $p_link,
                    $like_it_text,
                    $already_rated_text,
                    $ajax_url,// 8
                    $ajax_callback,//9        
                    $not_interested,//10
                    $nonce
                    );
            
        }
	}//end class
}
