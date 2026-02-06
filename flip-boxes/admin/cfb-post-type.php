<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

if ( ! class_exists( 'CFB_post_type' ) ) {
	class CFB_post_type {
		private $prefix = '_cfb_';

		public function __construct() {
            add_action( 'admin_menu', array( $this, 'cfb_menu_page' ) );
            add_action( 'admin_init', array( $this, 'register_settings' ) );

            if ( get_option( 'cfb_flip_type_option', 'post' ) === 'post' ) {
                $this->init_post_type_hooks();
            }
        }

		private function init_post_type_hooks() {
            add_action( 'init', array( $this, 'cfb_register_post_type' ) );
            add_action( 'cmb2_admin_init', array( $this, 'cfb_metaboxes' ) );
            add_action( 'cmb2_admin_init', array( $this, 'cfb_general_settings' ) );
            add_action( 'cmb2_admin_init', array( $this, 'cfb_advanced_settings' ) );
            add_action( 'cmb2_admin_init', array( $this, 'cfb_rating_metabox' ) );
            add_filter( 'manage_edit-flipboxes_columns', array( $this, 'cfb_add_custom_columns' ) );
            add_action( 'manage_flipboxes_posts_custom_column', array( $this, 'cfb_columns_content' ), 10, 2 );
            add_action( 'add_meta_boxes', array( $this, 'cfb_shortcode_metabox' ) );
        }

		function cfb_menu_page() {
			add_options_page(
				'Cool Flipbox',
				'Cool Flipbox',
				'manage_options',
				'cfb_settings',
				array( $this, 'page_callback_function' )
			);
		}

		/**
		 * Method for creating a menu page with for block or post
		 */

		 // register flip box settings
		 function register_settings() {
			register_setting(
				'cfb_options_group',
				'cfb_flip_type_option',
				array(
					'sanitize_callback' => array( $this, 'sanitize_flip_type' ),
				)
			);
		}
		public function sanitize_flip_type( $value ) {
			$allowed = array( 'post', 'block' );
			return in_array( $value, $allowed, true ) ? $value : 'post';
		}

		// callback function for flip box settings page
		public function page_callback_function() {          ?>
				<div class="wrap" style="max-width: 100vw; padding: 20px; background-color: #fff; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
				
				<h1 style="color: #333; font-size: 32px;"><?php 
				// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
				echo esc_html__('Cool Flipbox Settings', 'c-flipboxes'); ?></h1>
					<style>
						.cfb_setting_form {
							margin-top: 20px;
						}

						.cfb_setting_form h2 {
							color: #333;
							font-size: 24px;
						}

						.cfb_setting_fieldset {
							border: 1px solid #ddd;
							padding: 10px;
							margin-bottom: 20px;
							display:flex;
							gap:5px;
						}

						.cfb_setting_label {
							box-sizing:border-box;
							border:2px solid transparent;
							border-radius:5px;
							margin-bottom: 10px;
							padding:10px;
						}
						.cfb_setting_label p{
							background-color:whitesmoke;
							padding:10px;
						}
						.cfb_setting_label img{
							border:1px solid whitesmoke;
							width:100%;
							margin:5px auto 0px auto;
						}
						.cfb_setting_label:has(input[type="radio"]:checked){
							border-color:blue;
						}
						.cfb_setting_iframe {
							min-width: 700px;
							  min-height: 368px;
							margin-top: 20px;
						}
					</style>
					<script>
						
						jQuery(document).ready(function ($) {
						// Handle radio button change event
						$('input[name="cfb_flip_type_option"]').change(function () {
							// Get the selected value
							var selectedValue = $(this).val();

							// Update the iframe src and h2 content based on the selected value
							if (selectedValue === 'post') {
								$('.cfb_setting_iframe').attr('src', 'https://www.youtube.com/embed/qjC_TXUJ3-w');
								$('.frame_heading').text('Classic Post Type')
							} else if (selectedValue === 'block') {
								$('.frame_heading').text('Block Based')
								$('.cfb_setting_iframe').attr('src', 'https://www.youtube.com/embed/aSqsRIQO2-U');
							}
						});
					});
					</script>
					<form method="post" action="options.php" class="cfb_setting_form">
								<?php
								settings_fields( 'cfb_options_group' );
								$saved_flip_type = get_option( 'cfb_flip_type_option', 'post' );
								?>
								<h2><?php
								// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
								echo esc_html__('Flipbox Builder Type:', 'c-flipboxes'); ?></h2>
								<fieldset class="cfb_setting_fieldset">
									<legend class="screen-reader-text">
										<span><?php 
										// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
										echo esc_html__('Flipbox builder type', 'c-flipboxes'); ?></span>
									</legend>
									<label for="post" class="cfb_setting_label">
									<p><input type="radio" name="cfb_flip_type_option" id="post" value="post" <?php checked( 'post', $saved_flip_type ); ?> /><?php 
									// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
									echo esc_html__('Classic Post Type', 'c-flipboxes'); ?></p>
										<img src="<?php echo esc_url(CFB_URL . '/assets/images/flipbox-shortcode.png'); ?>"  alt="" width="100">
									</label>
									<label for="block" class="cfb_setting_label">
									<p><input type="radio" name="cfb_flip_type_option" id="block" value="block" <?php checked( 'block', $saved_flip_type ); ?> /><?php 
									// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
									echo esc_html__('Modern Block Based', 'c-flipboxes'); ?></p>
										<img src="<?php echo esc_url(CFB_URL . '/assets/images/flipbox-block.png'); ?>"  alt="" width="100">
									</label>
								</fieldset>
								<?php 
								// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
								submit_button( esc_html__('Save Changes', 'c-flipboxes'), 'primary', 'submit-btn' ); ?>
							</form>
							<h2 class="frame_heading"><?php 
							// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
							echo esc_html__('Classic Post Type', 'c-flipboxes'); ?></h2>
							<iframe class="cfb_setting_iframe" src="https://www.youtube.com/embed/qjC_TXUJ3-w" frameborder="0" allowfullscreen></iframe>
				</div>
				<?php
		}



		function cfb_register_post_type() {
			$labels = array(
				'name'                  => _x( 'Cool Flipbox', 'Post Type General Name', 'flip-boxes' ),
				'singular_name'         => _x( 'Cool Flipbox', 'Post Type Singular Name', 'flip-boxes' ),
				'menu_name'             => __( 'Cool Flipbox', 'flip-boxes' ),
				'name_admin_bar'        => __( 'Cool Flipbox', 'flip-boxes' ),
				'archives'              => __( 'Item Archives', 'flip-boxes' ),
				'attributes'            => __( 'Item Attributes', 'flip-boxes' ),
				'parent_item_colon'     => __( 'Parent Item:', 'flip-boxes' ),
				'all_items'             => __( 'All Flipbox', 'flip-boxes' ),
				'add_new_item'          => __( 'Add New Flipbox', 'flip-boxes' ),
				'add_new'               => __( 'Add New', 'flip-boxes' ),
				'new_item'              => __( 'New Item', 'flip-boxes' ),
				'edit_item'             => __( 'Edit Item', 'flip-boxes' ),
				'update_item'           => __( 'Update Item', 'flip-boxes' ),
				'view_item'             => __( 'View Item', 'flip-boxes' ),
				'view_items'            => __( 'View Items', 'flip-boxes' ),
				'search_items'          => __( 'Search Item', 'flip-boxes' ),
				'not_found'             => __( 'Not found', 'flip-boxes' ),
				'not_found_in_trash'    => __( 'Not found in Trash', 'flip-boxes' ),
				'featured_image'        => __( 'Featured Image', 'flip-boxes' ),
				'set_featured_image'    => __( 'Set featured image', 'flip-boxes' ),
				'remove_featured_image' => __( 'Remove featured image', 'flip-boxes' ),
				'use_featured_image'    => __( 'Use as featured image', 'flip-boxes' ),
				'insert_into_item'      => __( 'Insert into item', 'flip-boxes' ),
				'uploaded_to_this_item' => __( 'Uploaded to this item', 'flip-boxes' ),
				'items_list'            => __( 'Items list', 'flip-boxes' ),
				'items_list_navigation' => __( 'Items list navigation', 'flip-boxes' ),
				'filter_items_list'     => __( 'Filter items list', 'flip-boxes' ),
			);
			$args   = array(
				'label'               => __( 'Cool Flipbox', 'flip-boxes' ),
				'description'         => __( 'Post Type Description', 'flip-boxes' ),
				'labels'              => $labels,
				'supports'            => array( 'title' ),
				'taxonomies'          => array(),
				'hierarchical'        => false,
				'public'              => false,
				'show_ui'             => true,
				'show_in_menu'        => true,
				'menu_position'       => 5,
				'show_in_admin_bar'   => true,
				'show_in_nav_menus'   => true,
				'can_export'          => true,
				'has_archive'         => true,
				'exclude_from_search' => false,
				'publicly_queryable'  => false,
				'capability_type'     => 'page',
				'menu_icon'           => 'dashicons-image-flip-horizontal',
			);
			register_post_type( 'flipboxes', $args );
		}

		/*Define the metabox and field configurations*/
		function cfb_metaboxes() {
			// Start with an underscore to hide fields from custom fields list
			$prefix = '_cfb_';

			$cmb2 = new_cmb2_box(
				array(
					'id'           => 'cfb_live_preview',
					// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
					'title'        => __( 'Cool Flipbox Live Preview', 'c-flipboxes' ),
					'object_types' => array( 'flipboxes' ), // Post type
					'context'      => 'normal',
					'priority'     => 'high',
					'show_names'   => true, // Show field names on the left
				// 'cmb_styles' => false, // false to disable the CMB stylesheet
				// 'closed'     => true, // Keep the metabox closed by default
				)
			);

			$cmb2->add_field(
				array(
					'name' => '',
					'desc' => CFB_Functions::cfb_display_live_preview(),
					'type' => 'title',
					'id'   => 'cfb_live_preview',
				)
			);

			/* Initiate the metabox*/
			$flip = new_cmb2_box(
				array(
					'id'           => 'test_metabox',
					// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
					'title'        => __( 'Add Flipboxes', 'c-flipboxes' ),
					'object_types' => array( 'flipboxes' ), // Post type
					'context'      => 'normal',
					'priority'     => 'high',
					'show_names'   => true, // Show field names on the left
				)
			);

			$group_field_id = $flip->add_field(
				array(
					'id'          => $prefix . 'flip_repeat_group',
					'type'        => 'group',
					'description' => '',
					'options'     => array(
						// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
						'group_title'    => __( 'Item {#}', 'c-flipboxes' ), 
						// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
						'add_button'     => __( 'Add Another Flipbox', 'c-flipboxes' ),
						// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
						'remove_button'  => __( 'Remove Flipbox', 'c-flipboxes' ),
						'sortable'       => true, // beta
						'closed'         => true, // true to have the groups closed by default
						// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
						'remove_confirm' => esc_html__( 'Are you sure you want to remove?', 'c-flipboxes' ), // Performs confirmation before removing group.
					),
				)
			);

			// Id's for group's fields only need to be unique for the group. Prefix is not needed.
			$flip->add_group_field(
				$group_field_id,
				array(
					// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
					'name'        => __( 'Title', 'c-flipbox' ),
					// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
					'description' => __( 'Enter a title for this Flipbox', 'c-flipbox' ),
					'id'          => 'flipbox_title',
					'type'        => 'text',
				)
			);

			$flip->add_group_field(
				$group_field_id,
				array(
					// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
					'name'        => __( 'Front Description', 'c-flipbox' ),
					'id'          => 'flipbox_label',
					// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
					'description' => __( 'Add Front Description for this Flipbox', 'c-flipbox' ),
					'type'        => 'textarea_small',
				)
			);

			$flip->add_group_field(
				$group_field_id,
				array(
					// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
					'name'        => __( 'Back Description', 'c-flipbox' ),
					// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
					'description' => __( 'Add Back Description for this Flipbox', 'c-flipbox' ),
					'id'          => 'flipbox_desc',
					'type'        => 'textarea_small',
				)
			);

			$flip->add_group_field(
				$group_field_id,
				array(
					// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
					'name'        => __( 'Description Length', 'c-flipbox' ),
					// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
					'description' => __( 'Enter number of characters', 'c-flipbox' ),
					'id'          => 'flipbox_desc_length',
					'type'        => 'text',
					'default'     => '75',
				)
			);

			$flip->add_group_field(
				$group_field_id,
				array(
					// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
					'name'        => __( 'Select Icon', 'c-flipbox' ),
					// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
					'description' => __( 'Choose an Icon for Flipbox Layout', 'c-flipbox' ),
					'id'          => 'flipbox_icon',
					'type'        => 'fontawesome_icon',
				)
			);
			$flip->add_group_field(
				$group_field_id,
				array(
					// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
					'name'        => __( 'Color Scheme', 'c-flipbox' ),
					// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
					'description' => __( 'Choose Color Scheme', 'c-flipbox' ),
					'id'          => 'color_scheme',
					'type'        => 'colorpicker',
				)
			);

			$flip->add_group_field(
				$group_field_id,
				array(
					// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
					'name'        => __( 'Image', 'c-flipbox' ),
					'id'          => 'flipbox_image',
					// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
					'description' => __( 'Upload an Image', 'c-flipbox' ),
					'type'        => 'file',
				)
			);

			$flip->add_group_field(
				$group_field_id,
				array(
					// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
					'name'        => __( 'URL', 'c-flipbox' ),
					'id'          => 'flipbox_url',
					// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
					'description' => __( 'Enter URL for Button', 'c-flipbox' ),
					'type'        => 'text_url',
					'protocols'   => array( 'http', 'https' ),
				)
			);

			$flip->add_group_field(
				$group_field_id,
				array(
					// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
					'name'        => __( 'URL Text', 'c-flipbox' ),
					'id'          => 'read_more_link',
					// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
					'description' => __( 'Enter Text For Button', 'c-flipbox' ),
					'type'        => 'text',
				)
			);
		}

		/*Define the metabox and field configurations.*/
		function cfb_general_settings() {
			// Start with an underscore to hide fields from custom fields list
			$prefix = '_cfb_';

			/*Initiate the metabox*/
			$flip = new_cmb2_box(
				array(
					'id'           => 'cfb-side-mt',
					// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
					'title'        => __( 'Flipbox General Settings', 'c-flipboxes' ),
					'object_types' => array( 'flipboxes' ), // Post type
					'context'      => 'side',
					'priority'     => 'low',
					'show_names'   => true, // Show field names on the left
				)
			);

			// Regular text field
			$flip->add_field(
				array(
					// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
					'name'             => __( 'layout', 'c-flipboxes' ),
					// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
					'desc'             => __( 'Select Flipbox Layout', 'c-flipboxes' ),
					'id'               => $prefix . 'flip_layout',
					'type'             => 'select',
					'show_option_none' => false,
					'default'          => 'dashed-with-icon',
					'options'          => array(
						// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
						'dashed-with-icon' => __( 'Layout 1 (Dashed With Icon)', 'c-flipboxes' ),
						// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
						'with-image'       => __( 'Layout 2 (With Image)', 'c-flipboxes' ),
						// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
						'solid-with-icon'  => __( 'Layout 3 (Solid With Icon)', 'c-flipboxes' ),
						// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
						'layout-4'         => __( 'Layout 4', 'c-flipboxes' ),
						// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
						'layout-5'         => __( 'Layout 5', 'c-flipboxes' ),
						// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
						'layout-6'         => __( 'Layout 6', 'c-flipboxes' ),
						// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
						'layout-7'         => __( 'Layout 7', 'c-flipboxes' ),
						// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
						'layout-8'         => __( 'Layout 8', 'c-flipboxes' ),
						// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
						'layout-9'         => __( 'Layout 9', 'c-flipboxes' ),
					),
				)
			);

			$flip->add_field(
				array(
					// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
					'name'             => __( 'Effect', 'c-flipboxes' ),
					// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
					'desc'             => __( 'Select Flipbox Effect', 'c-flipboxes' ),
					'id'               => $prefix . 'effect',
					'type'             => 'select',
					'show_option_none' => false,
					'default'          => 'left-to-right',
					'options'          => array(
						// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
						'x' => __( 'Bottom To Top', 'c-flipboxes' ),
						// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
						'y' => __( 'Left To Right', 'c-flipboxes' ),
					),
				)
			);

			$flip->add_field(
				array(
					// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
					'name'             => __( 'Number of columns', 'c-flipboxes' ),
					// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
					'desc'             => __( 'Select Number of columns', 'c-flipboxes' ),
					'id'               => $prefix . 'column',
					'type'             => 'select',
					'show_option_none' => false,
					'default'          => 'col-md-4',
					'options'          => array(
						// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
						'col-md-12' => __( 'One', 'c-flipboxes' ),
						// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
						'col-md-6'  => __( 'Two', 'c-flipboxes' ),
						// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
						'col-md-4'  => __( 'Three', 'c-flipboxes' ),
						// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
						'col-md-3'  => __( 'Four', 'c-flipboxes' ),
						// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
						'col-md-2'  => __( 'Six', 'c-flipboxes' ),
					),
				)
			);

			$flip->add_field(
				array(
					// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
					'name'        => __( 'Skin Color', 'c-flipboxes' ),
					// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
					'description' => __( 'Choose a skin color', 'c-flipboxes' ),
					'id'          => $prefix . 'skin_color',
					'type'        => 'colorpicker',
					'default'     => '#f4bf64',
				)
			);

			$flip->add_field(
				array(
					// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
					'name'             => __( 'Height', 'c-flipboxes' ),
					// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
					'desc'             => __( 'Select height for Flipbox', 'c-flipboxes' ),
					'id'               => $prefix . 'height',
					'type'             => 'select',
					'show_option_none' => false,
					'default'          => 'default',
					'options'          => array(
						// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
						'default' => __( 'Default(according to content)', 'c-flipboxes' ),
						// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
						'equal'   => __( 'Equal height of each Flipbox', 'c-flipboxes' ),
					),
				)
			);

		}

		function cfb_advanced_settings() {
			// Start with an underscore to hide fields from custom fields list
			$prefix = '_cfb_';

			/*Initiate the metabox*/
			$flip = new_cmb2_box(
				array(
					'id'           => 'cfb_advanced_settings',
					// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
					'title'        => __( 'Flipbox Advanced Settings', 'c-flipboxes' ),
					'object_types' => array( 'flipboxes' ), // Post type
					'context'      => 'side',
					'priority'     => 'low',
					'show_names'   => true, // Show field names on the left
				)
			);

			$flip->add_field(
				array(
					// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
					'name' => __( 'Number of Flipboxes', 'c-flipboxes' ),
					// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
					'desc' => __( 'Enter number of flipboxes to show', 'c-flipboxes' ),
					'id'   => $prefix . 'no_of_items',
					'type' => 'text',
				)
			);

			$flip->add_field(
				array(
					// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
					'name'    => __( 'Icon Size(in px)', 'c-flipboxes' ),
					// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
					'desc'    => __( 'Enter icon size', 'c-flipboxes' ),
					'id'      => $prefix . 'icon_size',
					'type'    => 'text',
					'default' => '52px',
				)
			);

			$flip->add_field(
				array(
					// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
					'name' => __( 'Read More link in same tab', 'c-flipboxes' ),
					// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
					'desc' => __( 'Check if you want to open Read More link in same tab', 'c-flipboxes' ),
					'id'   => $prefix . 'LinkTarget',
					'type' => 'checkbox',
				)
			);

			$flip->add_field(
				array(
					// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
					'name'    => __( 'Bootstrap', 'c-flipboxes' ),
					'id'      => $prefix . 'bootstrap',
					'default' => 'enable',
					'type'    => 'radio',
					'options' => array(
						// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
						'enable'  => __( 'Enable Bootstrap', 'c-flipboxes' ),
						// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
						'disable' => __( 'Disable Bootstrap', 'c-flipboxes' ),
					),
				)
			);

			$flip->add_field(
				array(
					// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
					'name'    => __( 'Fontawesome', 'c-flipboxes' ),
					'id'      => $prefix . 'font',
					'default' => 'enable',
					'type'    => 'radio',
					'options' => array(
						// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
						'enable'  => __( 'Enable Fontawesome', 'c-flipboxes' ),
						// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
						'disable' => __( 'Disable Fontawesome', 'c-flipboxes' ),
					),
				)
			);

			$flip->add_field(
				array(
					// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
					'name'    => __( 'Flipbox Event', 'c-flipboxes' ),
					'id'      => $prefix . 'event',
					'default' => 'hover',
					'type'    => 'radio',
					'options' => array(
						// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
						'hover' => __( 'Hover', 'c-flipboxes' ),
						// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
						'click'  => __( 'Click', 'c-flipboxes' ),
					),
				)
			);

		}

		function cfb_rating_metabox() {
			 $prefix = '_cfb_';

			$rating_metabox = new_cmb2_box(
				array(
					'id'           => 'cfb_rating_metabox',
					// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
					'title'        => __( 'Please Share Your Feedback', 'c-flipboxes' ),
					'object_types' => array( 'flipboxes' ),
					'context'      => 'side',
					'priority'     => 'low',
					'show_names'   => true,
				)
			);

			$rating_metabox->add_field(
				array(
					// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					'desc' => sprintf(
						/* translators: %s: URL to the 5 stars rating image */
						__( 'Thank you for using <strong>Cool Flipbox!</strong> If you enjoy this plugin, please consider leaving us a rating on WordPress.org. <img src="%s"/> <a href="https://wordpress.org/support/plugin/flip-boxes/reviews/#new-post" target="_blank" class="button button-primary">Submit Review ★★★★★</a>', 'flip-boxes' ),
						esc_url( CFB_URL . '/assets/images/stars5.png' )
					),
					'id'   => $prefix . 'rate_us_link',
					'type' => 'title',
				)
			);
		}


		/**
		 * ADD NEW COLUMN
		 *
		 * @return $new_columns
		 */
		function cfb_add_custom_columns( $flip_cols ) {
			$new_columns['cb']          = '<input type="checkbox" />';
			$new_columns['title']       = _x( 'Title', 'column name', 'flip-boxes' );
			$new_columns['flip_layout'] = _x( 'Layout', 'column name', 'flip-boxes' );
			$new_columns['effect']      = __( 'Effect', 'flip-boxes' );
			$new_columns['code']        = __( 'Shortcode', 'flip-boxes' );
			$new_columns['date']        = _x( 'Sort By Date', 'column name', 'flip-boxes' );
			return $new_columns;
		}

		function cfb_columns_content( $flip_cols, $post ) {
			$prefix = '_cfb_';
			// global $layouts;
			$layouts = array(
				// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
				'dashed-with-icon' => __( 'Dashed With Icons', 'c-flipboxes' ),
				// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
				'with-image'       => __( 'With Image', 'c-flipboxes' ),
				// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
				'solid-with-icon'  => __( 'Solid With Icon', 'c-flipboxes' ),
				// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
				'layout-4'         => __( 'Layout 4', 'c-flipboxes' ),
				// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
				'layout-5'         => __( 'Layout 5', 'c-flipboxes' ),
				// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
				'layout-6'         => __( 'Layout 6', 'c-flipboxes' ),
				// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
				'layout-7'         => __( 'Layout 7', 'c-flipboxes' ),
				// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
				'layout-8'         => __( 'Layout 8', 'c-flipboxes' ),
				// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
				'layout-9'         => __( 'Layout 9', 'c-flipboxes' ),
			);
			// global $effects;
			$effects = array(
				// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
				'x' => __( 'Bottom To Top', 'c-flipboxes' ),
				// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
				'y' => __( 'Left To Right', 'c-flipboxes' ),
			);

		    switch ( $flip_cols ) {
				case 'flip_layout':
					$lt = get_post_meta( $post, $prefix . 'flip_layout', true );
					if ( isset( $layouts[ $lt ] ) ) {
						echo esc_html($layouts[ $lt ]);
					}
					break;
				case 'effect':
					$eff = get_post_meta( $post, $prefix . 'effect', true );
					if ( isset( $effects[ $eff ] ) ) {
						echo esc_html($effects[ $eff ]);
					}
					break;
				case 'code':
					global $dynamic_attr;
					global $id;
					$dynamic_attr = "[flipboxes id=\"{$id}\"]";
					echo "<input type='text' value='" . esc_attr($dynamic_attr) . "' readonly>";
					break;
				default:
				// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
					esc_html_e( 'Not Matched', 'cfb2' );
					break;
			}
		}

		function cfb_shortcode_metabox() {
			add_meta_box( 'my-meta-box-id', 'Use This Shortcode', array( $this, 'cfb_shortcode_text' ), 'flipboxes', 'side', 'high' );
		}

		function cfb_shortcode_text() {
			$id           = get_the_ID();
			$dynamic_attr = '';
			// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
			esc_html_e( 'Paste this shortcode anywhere (page/post).', 'c-flipbox' );
			$dynamic_attr .= "[flipboxes id=\"{$id}\"";
			$dynamic_attr .= ']';
			$prefix        = '_cfb_';
			?>
			<br>
			<br>
			<input type="text" class="regular-small" name="my_meta_box_text" id="my_meta_box_text" value="<?php echo esc_attr( $dynamic_attr ); ?>" readonly/>
			<?php
		}
		


	}
}

