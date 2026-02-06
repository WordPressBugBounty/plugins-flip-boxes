<?php


// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedNamespaceFound
namespace CFB\feedback;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}


class cp_feedback{
    private static $instance = null;
    private $plugin_url;
    private $plugin_version;
    private $plugin_name;
    private $plugin_slug;
    private $feedback_url;

    /**
     * Avoid creating multiple instance of this class
     */
    static function get_instance(){

        if( empty( self::$instance ) ){
            return self::$instance = new self;
        }
        return self::$instance;

    }

    /*
    |-----------------------------------------------------------------|
    |   Use this constructor to fire all actions and filters          |
    |-----------------------------------------------------------------|
    */
    public function __construct(){
        if( !is_admin() ){
            return;
        }

        $this->plugin_url = CFB_URL;
        $this->plugin_version = CFB_VERSION;
        $this->plugin_name = 'Flip Boxes';
        $this->plugin_slug = 'cfb';
        $this->feedback_url = 'https://feedback.coolplugins.net/wp-json/coolplugins-feedback/v1/feedback';

        add_action('admin_enqueue_scripts', [$this, 'cfb_enqueue_feedback_scripts']);
        add_action('admin_head', [$this, 'cfb_show_deactivate_feedback_popup']);
        add_action("wp_ajax_{$this->plugin_slug}_cfb_submit_deactivation_response", [$this, 'cfb_submit_deactivation_response']);
    }

    /*
    |-----------------------------------------------------------------|
    |   Enqueue all scripts and styles to required page only          |
    |-----------------------------------------------------------------|
    */
    function cfb_enqueue_feedback_scripts(){
        $screen = get_current_screen();
        if( isset( $screen ) && $screen->id == 'plugins' ){
            wp_enqueue_script(__NAMESPACE__.'feedback-script', $this->plugin_url .'admin/feedback/js/admin-feedback.js', array('jquery'), $this->plugin_version, true);
            wp_enqueue_style('cool-plugins-feedback-style', $this->plugin_url .'admin/feedback/css/admin-feedback.css', array(), $this->plugin_version );
        }
    }
    

    /*
    |-----------------------------------------------------------------|
    |   HTML for creating feedback popup form                         |
    |-----------------------------------------------------------------|
    */
    public function cfb_show_deactivate_feedback_popup() {
		
		$screen = get_current_screen();
		if( !isset( $screen ) || $screen->id != 'plugins' ){
			return;
		}
		$deactivate_reasons = [
			'didnt_work_as_expected' => [
                // phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
				'title' => esc_html__( 'The plugin didn\'t work as expected', 'cool-plugins' ),
                // phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
				'input_placeholder' => esc_html__('What did you expect?', 'cool-plugins'),
			],
			'found_a_better_plugin' => [
                // phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
				'title' => esc_html__( 'I found a better plugin', 'cool-plugins' ),
                // phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
				'input_placeholder' => esc_html__( 'Please share which plugin', 'cool-plugins' ),
			],
			'couldnt_get_the_plugin_to_work' => [
                // phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
				'title' => esc_html__( 'The plugin is not working', 'cool-plugins' ),
                // phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
				'input_placeholder' => esc_html__('Please share your issue. So we can fix that for other users.', 'cool-plugins'),
			],
			'temporary_deactivation' => [
                // phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
				'title' => esc_html__( 'It\'s a temporary deactivation', 'cool-plugins' ),
				'input_placeholder' => '',
			],
			'other' => [
                // phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
				'title' => esc_html__( 'Other', 'cool-plugins' ),
                // phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
				'input_placeholder' => esc_html__( 'Please share the reason', 'cool-plugins' ),
			],
		];

		?>
		<div id="cool-plugins-deactivate-feedback-dialog-wrapper" class="hide-feedback-popup">
			            
            <div class="cool-plugins-deactivation-response">
            <div id="cool-plugins-deactivate-feedback-dialog-header">
                
				<span id="cool-plugins-feedback-form-title"><?php 
                // phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
                echo esc_html__( 'Quick Feedback', 'cool-plugins' ); ?></span>
            </div>
            <div id="cool-plugins-loader-wrapper">
				<div class="cool-plugins-loader-container">
                    <img class="cool-plugins-preloader" src="<?php echo esc_url( $this->plugin_url ); ?>admin/feedback/images/cool-plugins-preloader.gif">
                </div>
            </div>
            <div id="cool-plugins-form-wrapper" class="cool-plugins-form-wrapper-cls">
			<form id="cool-plugins-deactivate-feedback-dialog-form" method="post">
				<?php
				wp_nonce_field( '_cool-plugins_deactivate_feedback_nonce' );
				?>
				<input type="hidden" name="action" value="cool-plugins_deactivate_feedback" />
                <div id="cool-plugins-deactivate-feedback-dialog-form-caption"><?php 
                // phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
                echo esc_html__( 'If you have a moment, please share why you are deactivating this plugin.', 'cool-plugins' ); ?></div>
				<div id="cool-plugins-deactivate-feedback-dialog-form-body">
					<?php foreach ( $deactivate_reasons as $reason_key => $reason ) : ?>
						<div class="cool-plugins-deactivate-feedback-dialog-input-wrapper">
							<input id="cool-plugins-deactivate-feedback-<?php echo esc_attr( $reason_key ); ?>" class="cool-plugins-deactivate-feedback-dialog-input" type="radio" name="reason_key" value="<?php echo esc_attr( $reason_key ); ?>" />
							<label for="cool-plugins-deactivate-feedback-<?php echo esc_attr( $reason_key ); ?>" class="cool-plugins-deactivate-feedback-dialog-label"><?php echo esc_html( $reason['title'] ); ?></label>
							<?php if ( ! empty( $reason['input_placeholder'] ) ) : ?>
								<textarea class="cool-plugins-feedback-text" type="textarea" name="reason_<?php echo esc_attr( $reason_key ); ?>" placeholder="<?php echo esc_attr( $reason['input_placeholder'] ); ?>"></textarea>
							<?php endif; ?>
							<?php if ( ! empty( $reason['alert'] ) ) : ?>
								<div class="cool-plugins-feedback-text"><?php echo esc_html( $reason['alert'] ); ?></div>
							<?php endif; ?>
						</div>
                    <?php endforeach; ?>
                    <input class="cool-plugins-GDPR-data-notice" id="cool-plugins-GDPR-data-notice" type="checkbox"><label for="cool-plugins-GDPR-data-notice"><?php 
                    // phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
                    echo esc_html__('I consent to having Cool Plugins store my all submitted information via this form, they can also respond to my inquiry.','cool-plugins');?></label>
                </div>
                <div class="cool-plugin-popup-button-wrapper">
                    <a class="cool-plugins-button button-deactivate" id="cool-plugin-submitNdeactivate">Submit and Deactivate</a>
                    <a class="cool-plugins-button" id="cool-plugin-skipNdeactivate">Skip and Deactivate</a>
                </div>
            </form>
            </div>
           </div>
		</div>
		<?php
    }
    

    function cfb_submit_deactivation_response(){
        if ( ! isset( $_POST['_wpnonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['_wpnonce'] ) ), '_cool-plugins_deactivate_feedback_nonce' ) ) {
            wp_send_json_error('Invalid nonce. Security check failed.');
        } else {
            $reason = isset( $_POST['reason'] ) ? sanitize_text_field( wp_unslash( $_POST['reason'] ) ) : '';
            $deactivate_reasons = [
                'didnt_work_as_expected' => [
                    // phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
                    'title' => esc_html__('The plugin didn\'t work as expected', 'cool-plugins'),
                    // phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
                    'input_placeholder' => esc_html__('What did you expect?', 'cool-plugins'),
                ],
                'found_a_better_plugin' => [
                    // phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
                    'title' => esc_html__('I found a better plugin', 'cool-plugins'),
                    // phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
                    'input_placeholder' => esc_html__('Please share which plugin', 'cool-plugins'),
                ],
                'couldnt_get_the_plugin_to_work' => [
                    // phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
                    'title' => esc_html__('The plugin is not working', 'cool-plugins'),
                    // phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
                    'input_placeholder' => esc_html__('Please share your issue. So we can fix that for other users.', 'cool-plugins'),
                ],
                'temporary_deactivation' => [
                    // phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
                    'title' => esc_html__('It\'s a temporary deactivation', 'cool-plugins'),
                    'input_placeholder' => '',
                ],
                'other' => [
                    // phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
                    'title' => esc_html__('Other', 'cool-plugins'),
                    // phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
                    'input_placeholder' => esc_html__('Please share the reason', 'cool-plugins'),
                ],
            ];
    
            $deactivation_reason = array_key_exists($reason, $deactivate_reasons) ? $reason : 'other'; 		
            $sanitized_message = isset( $_POST['message'] ) && sanitize_text_field( wp_unslash( $_POST['message'] ) ) != '' ? sanitize_text_field( wp_unslash( $_POST['message'] ) ) : 'N/A';
            $plugin_initial    = get_option('cfb-initial-save-version') ? get_option('cfb-initial-save-version'): 'N/A';
            $install_date      = get_option('cfb-install-date') ? get_option('cfb-install-date'): 'N/A';
            $unique_key        = '60';
            
            $admin_email = sanitize_email(get_option('admin_email'));
            $site_url = esc_url_raw(site_url());
            $site_id            = $site_url . '-' . $install_date . '-' . $unique_key;
			$response = wp_remote_post($this->feedback_url, [
                'timeout' => 30,
                'body' => [
                    'server_info' => serialize(\CflipBoxes::cfb_get_user_info()['server_info']),
                    'extra_details' => serialize(\CflipBoxes::cfb_get_user_info()['extra_details']),
                    'plugin_version' => $this->plugin_version,
                    'plugin_name' => $this->plugin_name,
					'reason' => $deactivation_reason,
					'review' => $sanitized_message,
					'email'	=>	$admin_email,
					'domain' => $site_url,
                    'plugin_initial' => $plugin_initial,
                    'site_id' => md5( $site_id),
                ],
			]);
            
            if (is_wp_error($response)) {
                wp_send_json_error('Failed to submit feedback: ' . $response->get_error_message());
            }
			
            wp_send_json(['response' => $response]);
        }
               
        $reason = isset( $_POST['reason'] ) ? sanitize_text_field( wp_unslash( $_POST['reason'] ) ) : '';
        $deactivate_reasons = $this->get_deactivate_reasons();

        $deactivation_reason = array_key_exists($reason, $deactivate_reasons) ? $reason : 'other';
        $sanitized_message = !empty($_POST['message']) ? sanitize_text_field( wp_unslash( $_POST['message'] ) ) : 'N/A';
        
        
        
        $response = wp_remote_post($this->feedback_url, [
            'timeout' => 30,
            'body' => [
                
                'plugin_version' => $this->plugin_version,
                'plugin_name' => $this->plugin_name,
                'reason' => $deactivation_reason,
                'review' => $sanitized_message,
                'email' => get_option('admin_email'),
                'domain' => site_url(),
                

            ],
        ]);

        wp_send_json(['response' => $response]);
    }

    private function get_deactivate_reasons() {
        return [
            'didnt_work_as_expected' => [
                // phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
                'title' => __('The plugin didn\'t work as expected', 'cool-plugins'),
                // phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
                'input_placeholder' => __('What did you expect?', 'cool-plugins'),
            ],
            'found_a_better_plugin' => [
                // phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
            'title' => esc_html__('I found a better plugin', 'cool-plugins'),
            // phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
            'input_placeholder' => esc_html__('Please share which plugin', 'cool-plugins'),
            ],
            'couldnt_get_the_plugin_to_work' => [
                // phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
                'title' => esc_html__('The plugin is not working', 'cool-plugins'),
                // phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
                'input_placeholder' => esc_html__('Please share your issue. So we can fix that for other users.', 'cool-plugins'),
            ],
            'temporary_deactivation' => [
                // phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
                'title' => esc_html__('It\'s a temporary deactivation', 'cool-plugins'),
                'input_placeholder' => '',
            ],
            'other' => [
                // phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
                'title' => esc_html__('Other', 'cool-plugins'),
                // phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
                'input_placeholder' => esc_html__('Please share the reason', 'cool-plugins'),
            ],
            
        ];
     }
}

cp_feedback::get_instance();;