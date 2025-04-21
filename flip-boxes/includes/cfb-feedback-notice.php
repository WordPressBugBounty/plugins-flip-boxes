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

		/**
		 * @var string $plugin_url The URL of the plugin.
		 */
		private $plugin_url = CFB_URL;
		/**
		 * @var string $plugin_name The name of the plugin.
		 */
		private $plugin_name = 'Flip Boxes';
		/**
		 * @var string $plugin_slug The slug of the plugin.
		 */
		private $plugin_slug = 'cfb';
		/**
		 * @var string $review_option The review option.
		 */
		private $review_option = 'Flip-Boxes-ratingDiv';
		/**
		 * @var string $installation_date_option The installation date option.
		 */
		private $installation_date_option = 'Flip-Boxes-installDate';
		/**
		 * @var string $review_link The review link.
		 */
		private $review_link = 'https://wordpress.org/support/plugin/flip-boxes/reviews/#new-post';
		/**
		 * @var string $plugin_logo The plugin logo.
		 */
		private $plugin_logo = 'assets/images/cool-flipbox.png';
		/**
		 * @var string $buy_link The buy link.
		 */
		private $buy_link = ''; // leave it blank if you don't want to show buy pro button

		/**
		 * The Constructor
		 */
		public function __construct() {
			if (is_admin()) {
				add_action('admin_notices', [$this, 'cfb_block_notice']);
				add_action('admin_notices', [$this, 'cool_admin_notice_for_review']);
				add_action("wp_ajax_{$this->plugin_slug}_dismiss_notice", [$this, 'cool_dismiss_review_notice']);
				add_action("wp_ajax_{$this->plugin_slug}_block_notice_dismiss", [$this, 'cfb_block_notice_dismiss']);
			}
		}


		/**
		 * Display the block notice.
		 */
		public function cfb_block_notice() {
			global $post_type;
			$block_option_exists = get_option('cfb_flip_type_option', false);
			$block_notice_dismiss = get_option('cfb_block_notice_dismiss', false);
			
			if (!function_exists('register_block_type') || $post_type !== 'flipboxes' || $block_option_exists || $block_notice_dismiss) {
				return;
			}

			$review_nonce = wp_create_nonce("{$this->plugin_slug}_block_notice_nonce");
			$ajax_url = admin_url('admin-ajax.php');
			$ajax_callback = "{$this->plugin_slug}_block_notice_dismiss";
			$settings_url = admin_url('options-general.php?page=cfb_settings');

			$notice = $this->generate_block_notice_html($review_nonce, $ajax_url, $ajax_callback, $settings_url);
			echo $notice;
		}


		/**
		 * Generate HTML for block notice
		 */
		private function generate_block_notice_html($review_nonce, $ajax_url, $ajax_callback, $settings_url) {
			ob_start();
			?>
			<div id="<?php echo esc_attr($this->plugin_slug); ?>-block-introducion-notice" 
				class="notice notice-success is-dismissible cfb-block-notice-wrapper" 
				data-nonce="<?php echo esc_attr($review_nonce); ?>" 
				data-plugin-slug="<?php echo esc_attr($this->plugin_slug); ?>" 
				data-ajax-callback="<?php echo esc_attr($ajax_callback); ?>" 
				data-ajax-url="<?php echo esc_url($ajax_url); ?>">
				<div class="logo-container"><img src="<?php echo esc_url(CFB_URL . 'assets/images/flipboxes-logo.png'); ?>" width="80px"></div>
				<p>🌟 Introducing <b>Cool Flipbox Block Plugin!</b> Activate easily in <b><a href="<?php echo esc_url($settings_url); ?>">settings</a></b>, create stunning flipboxes in the Gutenberg editor.<br>Elevate your WordPress experience with the power of Cool Flipbox Block! 🚀</p>
			</div>
			<style>#<?php echo esc_attr($this->plugin_slug); ?>-block-introducion-notice{display: flex} .logo-container{margin-right: 1rem}</style>
			<script>
			jQuery(document).ready(function ($) {
				$(document).on("click", "#<?php echo esc_js($this->plugin_slug); ?>-block-introducion-notice .notice-dismiss", function (event) {
					var $this = $(this);
					var wrapper = $this.parents(".<?php echo esc_js($this->plugin_slug); ?>-block-notice-wrapper");
					var ajaxURL = wrapper.data("ajax-url");
					var ajaxCallback = wrapper.data("ajax-callback");
					var slug = wrapper.data("plugin-slug");
					var id = wrapper.attr("id");
					var wp_nonce = wrapper.data("nonce");
					$.post(ajaxURL, { "action": ajaxCallback, "slug": slug, "id": id, "_nonce": wp_nonce }, function(data) {
						wrapper.slideUp("fast");
					});
				});
			});
			</script>
			<?php
			return ob_get_clean();
		}

		/**
		 * Dismisses the block notice after checking the nonce.
		 */
		public function cfb_block_notice_dismiss() {
			if (!current_user_can('manage_options')) {
				wp_send_json_error('Insufficient permissions');
				exit;
			}
			$nonce_key = $this->plugin_slug . '_block_notice_nonce';
			if ( check_ajax_referer( $nonce_key, '_nonce', false ) ) {
				$slug = isset( $_REQUEST['slug'] ) ? sanitize_key( $_REQUEST['slug'] ) : false;
				if ( $slug ) {
					update_option( $slug . '_block_notice_dismiss', 'yes' );
				}
				wp_send_json_success();
			} else {
				wp_send_json_error( 'Invalid nonce' );
			}
		}

		// ajax callback for review notice
		public function cool_dismiss_review_notice() {
			if ( check_ajax_referer( $this->plugin_slug . '_dismiss_notice_nonce', '_nonce', false ) ) {
				update_option( $this->review_option, 'yes' );
				wp_send_json_success( array( 'message' => 'Notice dismissed' ) );
			} else {
				wp_send_json_error( array( 'message' => 'Invalid nonce' ) );
			}
			exit;
		}

		// admin notice
		public function cool_admin_notice_for_review() {
			if ( ! current_user_can( 'edit_posts' ) ) {
				return;
			}

			// get installation dates and rated settings
			$installation_date = get_option( $this->installation_date_option );
			$alreadyRated      = get_option( $this->review_option ) != false ? get_option( $this->review_option ) : 'no';

			// check user already rated
			if ( $alreadyRated == 'yes' ) {
				return;
			}

			// grab plugin installation date and compare it with current date
			$display_date = date( 'Y-m-d h:i:s' );
			$install_date = new DateTime( $installation_date );
			$current_date = new DateTime( $display_date );
			$difference   = $install_date->diff( $current_date );
			$diff_days    = $difference->days;

			// check if installation days is greator then week
			if ( isset( $diff_days ) && $diff_days >= 3 ) {
				echo $this->cool_create_notice_content();
			}
		}

		// generated review notice HTML
		function cool_create_notice_content() {
			$nonce = wp_create_nonce( $this->plugin_slug . '_dismiss_notice_nonce' );
			$plugin_buy_button = '';
			if ( $this->buy_link != '' ) {
				$plugin_buy_button = '<li><a href="' . esc_url( $this->buy_link ) . '" target="_blank" class="buy-pro-btn button button-secondary" title="Buy Pro">Buy Pro</a></li>';
			}

			$html = '
            <div data-ajax-url="' . esc_url( admin_url( 'admin-ajax.php' ) ) . '" data-ajax-callback="' . esc_attr( $this->plugin_slug . '_dismiss_notice' ) . '"
			data-nonce="' . esc_attr( $nonce ) . '" class="' . esc_attr( $this->plugin_slug ) . '-review-notice-wrapper notice">
			    <span class="notice-dismiss dashicons dashicons-no-alt ' . esc_attr( $this->plugin_slug ) . '_dismiss_notice" title="Dismiss this notice"></span>

                <div class="logo_container">
                    <a href="' . esc_url( $this->review_link ) . '" target="_blank"><img src="' . esc_url( $this->plugin_url . $this->plugin_logo ) . '" alt="' . esc_attr( $this->plugin_name ) . '"></a>
                </div>
                <div class="message_container">
                    <p>' . sprintf( esc_html__( 'Thanks for using the %s WordPress plugin. We hope it meets your expectations! Please give us a quick rating — it works as a boost for us to keep working on more ', 'text-domain' ), '<b>' . esc_html( $this->plugin_name ) . '</b>' ) . '<a href="https://coolplugins.net/" target="_blank">Cool Plugins</a></p>
                    <ul>
                        <li><a href="' . esc_url( $this->review_link ) . '" class="rate-it-btn button button-primary" target="_blank" title="Submit A Review...">Rate Now! ★★★★★</a></li>
                        <li><a href="javascript:void(0);" class="already-rated-btn button button-secondary ' . esc_attr( $this->plugin_slug ) . '_dismiss_notice" title="Already Rated - Close This Notice!">Already Rated</a></li>
                        <li><a href="javascript:void(0);" class="already-rated-btn button button-secondary ' . esc_attr( $this->plugin_slug ) . '_dismiss_notice" title="Not Interested - Close This Notice!">Not Interested</a></li>
                        ' . $plugin_buy_button . '
                    </ul>
                </div>
            </div>
            ';

			// css styles
			$style = '
            <style>
            #wpbody .' . esc_attr( $this->plugin_slug ) . '-review-notice-wrapper.notice {
                padding: 5px;
                margin: 5px 0;
                display: table;
                border-radius: 5px;
                border: 1px solid #ced3d6;
                box-sizing: border-box;
                box-shadow: 2px 4px 8px -2px rgba(0, 0, 0, 0.1)
            }
            .' . esc_attr( $this->plugin_slug ) . '-review-notice-wrapper .logo_container {
                width: 80px;
                display: table-cell;
                padding: 5px;
                vertical-align: middle;
            }
            .' . esc_attr( $this->plugin_slug ) . '-review-notice-wrapper .logo_container a,
            .' . esc_attr( $this->plugin_slug ) . '-review-notice-wrapper .logo_container img {
                width:80px;
                height:auto;
                display:inline-block;
            }
            .' . esc_attr( $this->plugin_slug ) . '-review-notice-wrapper .message_container {
                display: table-cell;
                padding: 5px;
                vertical-align: middle;
            }
            .' . esc_attr( $this->plugin_slug ) . '-review-notice-wrapper p,
            .' . esc_attr( $this->plugin_slug ) . '-review-notice-wrapper ul {
                padding: 0;
                margin: 0;
                line-height: 1.25em;
                display: flow-root;
            }
            .' . esc_attr( $this->plugin_slug ) . '-review-notice-wrapper ul {
                margin-top: 10px;
            }
            .' . esc_attr( $this->plugin_slug ) . '-review-notice-wrapper ul li {
                float: left;
                margin: 0px 10px 0 0;
            }
            .' . esc_attr( $this->plugin_slug ) . '-review-notice-wrapper ul li .button-primary {
                background: #ffe37d;
                text-shadow: none;
                border-color: #a69516;
                box-shadow: none;
                color: #403906;
            }
            .' . esc_attr( $this->plugin_slug ) . '-review-notice-wrapper ul li .button-secondary {
                background: #fff;
                background-color: #fff;
                border: 1px solid #757575;
                color: #757575;
            }
            .' . esc_attr( $this->plugin_slug ) . '-review-notice-wrapper ul li .button-secondary.already-rated-btn:after {
                color: #f12945;
                content: "\f153";
                display: inline-block;
                vertical-align: middle;
                margin: -1px 0 0 5px;
                font-size: 14px;
                line-height: 14px;
                font-family: dashicons;
            }
			.' . esc_attr( $this->plugin_slug ) . '-review-notice-wrapper .notice-dismiss {
				position: absolute;
				top: -4px;
				color: #72777c;
				text-decoration: none;
				cursor: pointer;
				font-size: 18px;
			}
			.' . esc_attr( $this->plugin_slug ) . '-review-notice-wrapper {
				position: relative;
			}

            .' . esc_attr( $this->plugin_slug ) . '-review-notice-wrapper ul li .button-primary:hover {
                background: #222;
                border-color: #000;
            }
            @media screen and (max-width: 768px) {
                #wpbody .' . esc_attr( $this->plugin_slug ) . '-review-notice-wrapper.notice {
                    display: flex;
					flex-direction:column;
                }
                .' . esc_attr( $this->plugin_slug ) . '-review-notice-wrapper .message_container {
                    display: flow-root;
                }
            }
            </style>
            ';

			// close notice script
			$script = '
            <script>
            jQuery(document).ready(function ($) {
                $(".' . esc_js( $this->plugin_slug ) . '_dismiss_notice").on("click", function (event) {
                    var $this = $(this);
                    var wrapper=$this.parents(".' . esc_js( $this->plugin_slug ) . '-review-notice-wrapper");
                    var ajaxURL=wrapper.data("ajax-url");
                    var ajaxCallback=wrapper.data("ajax-callback");
					var nonce = wrapper.data("nonce");         
                    $.post(ajaxURL, { "action":ajaxCallback,_nonce: nonce }, function( data ) {
                        wrapper.slideUp("fast");
                    }, "json");
                });
            });
            </script>
            ';

			$html .= '
            ' . $style . '
            ' . $script;

			return $html;
		}

		/**
		 * Get notice styles
		 */
		private function get_notice_styles() {
			ob_start();
			?>
			<style>
				#wpbody .' . $this->plugin_slug . '-review-notice-wrapper.notice {
					padding: 5px;
					margin: 5px 0;
					display: table;
					max-width: 820px;
					border-radius: 5px;
					border: 1px solid #ced3d6;
					box-sizing: border-box;
					box-shadow: 2px 4px 8px -2px rgba(0, 0, 0, 0.1)
				}
				.' . $this->plugin_slug . '-review-notice-wrapper .logo_container {
					width: 80px;
					display: table-cell;
					padding: 5px;
					vertical-align: middle;
				}
				.' . $this->plugin_slug . '-review-notice-wrapper .logo_container a,
				.' . $this->plugin_slug . '-review-notice-wrapper .logo_container img {
					width:80px;
					height:auto;
					display:inline-block;
				}
				.' . $this->plugin_slug . '-review-notice-wrapper .message_container {
					display: table-cell;
					padding: 5px;
					vertical-align: middle;
				}
				.' . $this->plugin_slug . '-review-notice-wrapper p,
				.' . $this->plugin_slug . '-review-notice-wrapper ul {
					padding: 0;
					margin: 0;
					line-height: 1.25em;
					display: flow-root;
				}
				.' . $this->plugin_slug . '-review-notice-wrapper ul {
					margin-top: 10px;
				}
				.' . $this->plugin_slug . '-review-notice-wrapper ul li {
					float: left;
					margin: 0px 10px 0 0;
				}
				.' . $this->plugin_slug . '-review-notice-wrapper ul li .button-primary {
					background: #ffe37d;
					text-shadow: none;
					border-color: #a69516;
					box-shadow: none;
					color: #403906;
				}
				.' . $this->plugin_slug . '-review-notice-wrapper ul li .button-secondary {
					background: #fff;
					background-color: #fff;
					border: 1px solid #757575;
					color: #757575;
				}
				.' . $this->plugin_slug . '-review-notice-wrapper ul li .button-secondary.already-rated-btn:after {
					color: #f12945;
					content: "\f153";
					display: inline-block;
					vertical-align: middle;
					margin: -1px 0 0 5px;
					font-size: 14px;
					line-height: 14px;
					font-family: dashicons;
				}
				.' . $this->plugin_slug . '-review-notice-wrapper ul li .button-primary:hover {
					background: #222;
					border-color: #000;
				}
				@media screen and (max-width: 660px) {
					.' . $this->plugin_slug . '-review-notice-wrapper .logo_container{
						display:none;
					}
					.' . $this->plugin_slug . '-review-notice-wrapper .message_container {
						display: flow-root;
					}
				}
				</style>
			<?php
			return ob_get_clean();
		}

		/**
		 * Get notice script
		 */
		private function get_notice_script() {
			ob_start();
			?>
			<script>
			jQuery(document).ready(function ($) {
				$(".<?php echo esc_js($this->plugin_slug); ?>_dismiss_notice").on("click", function (event) {
					var $this = $(this);
					var wrapper = $this.parents(".<?php echo esc_js($this->plugin_slug); ?>-review-notice-wrapper");
					var ajaxURL = wrapper.data("ajax-url");
					var ajaxCallback = wrapper.data("ajax-callback");         
					$.post(ajaxURL, { "action": ajaxCallback }, function(data) {
						wrapper.slideUp("fast");
					}, "json");
				});
			});
			</script>
			<?php
			return ob_get_clean();
		}

	}//end class
}
