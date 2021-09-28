<?php
/**
 * Plugin Name:       Geolonia Blocks
 * Description:       This is an official Geolonia plugin that allows you to display inexpensive, easy to redesign, and fast maps in WordPress.
 * Requires at least: 5.8
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            geoloniamaps, naoki0h
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       geolonia-blocks
 */

new Geolonia_Map();

/**
 * Class Geolonia_Map
 */
class Geolonia_Map {

	/**
	 * Geolonia_Map constructor.
	 */
	function __construct() {

		add_action( 'init', array( $this, 'init' ) );
		add_action( 'init', array( $this, 'block_init' ) );
	}

	/**
	 * Init function.
	 */
	public function init() {

		add_action( 'admin_menu', array( $this, 'admin_menu' ) );
		add_action( 'admin_init', array( $this, 'settings_init' ) );
		add_action( 'admin_init', array( $this, 'load_textdomain' ) );

        $apikey = $this->get_api_key();

		if ( ! isset( $apikey ) || empty( $apikey ) ) {
			add_action( 'admin_notices', array( $this, 'admin_notice__error' ) );
		}

		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ));
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ));
	}

	public function block_init() {
		register_block_type( __DIR__ );
	}

	public function enqueue_scripts() {
		$api_url = $this->get_api_url();
		wp_enqueue_script(
			'geolonia-embed-api',
			$api_url,
			array(),
			false,
			true
		);
	}

	/**
	 * @return string
	 */
	private function get_api_key() {
		$option = get_option( 'geolonia_map_blocks_settings' );
		if ( $option && trim( $option['api_key_field'] ) ) {
			return trim( $option['api_key_field'] );
		}
		return "";
	}

	/**
	 * Load textdomain.
	 */
	public function load_textdomain() {

		load_plugin_textdomain(
			'geolonia-blocks',
			false,
			plugin_basename( dirname( __FILE__ ) ) . '/languages'
		);

	}


	/**
	 * Get API key.
	 *
	 * @return string $url Map API key.
	 */
	public function get_api_url() {
		$apikey = $this->get_api_key();
		$url = esc_url('https://cdn.geolonia.com/v1/embed?geolonia-api-key=' . $apikey );

		return $url;
	}

	/**
	 * Sanitize api_key_field.
	 *
	 * @param string $input API key strings.
	 *
	 * @return array
	 */
	public function data_sanitize( $input ) {

		$new_input = array();
		$api_key = isset( $input['api_key_field'] ) ? $input['api_key_field'] : '';

		if ( ! empty( $api_key ) ) {

			if ( strlen( $api_key ) === mb_strlen( $api_key ) ) {

				$new_input['api_key_field'] = esc_attr( $api_key );

			} else {

				add_settings_error(
					'geolonia_map_blocks_settings',
					'api_key_field',
					esc_html__( 'Check your API key.', 'geolonia-blocks' ),
					'error'
				);
				$new_input['api_key_field'] = '';

			}
		} else {

			add_settings_error(
				'geolonia_map_blocks_settings',
				'api_key_field',
				esc_html__( 'Check your API key.', 'geolonia-blocks' ),
				'error'
			);

			$new_input['api_key_field'] = '';

		}

		return $new_input;

	}


	/**
	 * Admin notice.
	 */
	public function admin_notice__error() {

		$class = 'notice notice-warning is-dismissible';
		$link  = sprintf(
			'<a href="%1$s">%2$s</a>',
			admin_url( 'options-general.php?page=geolonia-blocks' ),
			esc_html__( 'Settings page', 'geolonia-blocks' )
		);
		$message = sprintf(
			__( 'Geolonia Maps, you need an API key. Please move to the %1$s.', 'geolonia-blocks' ),
			$link
		);
		printf( '<div class="%1$s"><p>%2$s</p></div>', esc_attr( $class ), $message );

	}

	/**
	 * Add admin menu.
	 */
	public function admin_menu() {

		add_options_page(
			'Geolonia Map',
			'Geolonia Map',
			'manage_options',
			'geolonia-blocks',
			array( $this, 'geolonia_map_blocks_options_page' )
		);

	}

	/**
	 * Register settings.
	 */
	public function settings_init() {

		register_setting(
			'geoloniamappage',
			'geolonia_map_blocks_settings',
			array( $this, 'data_sanitize' )
		);

		add_settings_section(
			'geolonia_map_blocks_settings_section',
			esc_html__( 'Geolonia Map settings', 'geolonia-blocks' ),
			array( $this, 'geolonia_map_blocks_settings_section_callback' ),
			'geoloniamappage'
		);

		add_settings_field(
			'api_key_field',
			esc_html__( 'Set API Key', 'geolonia-blocks' ),
			array( $this, 'api_key_field_render' ),
			'geoloniamappage',
			'geolonia_map_blocks_settings_section'
		);

	}

	/**
	 * Add description of Post Notifier.
	 */
	public function geolonia_map_blocks_settings_section_callback() {

		echo esc_html__( 'Set your Geolonia Maps API key.', 'geolonia-blocks' );

	}

	/**
	 * Output text field.
	 */
	public function api_key_field_render() {

		printf(
		        '<input type="text" name="geolonia_map_blocks_settings[api_key_field]" value="%s" size="30">',
                esc_attr( $this->get_api_key() )
        );
	}

	/**
	 * Output Geolonia Map page form.
	 */
	public function geolonia_map_blocks_options_page() {

		?>
		<form action='options.php' method='post'>

		<?php
			settings_fields( 'geoloniamappage' );
			do_settings_sections( 'geoloniamappage' );

			submit_button();

			/*
			 * API key obtaining method.
			 */
			$maps_api_for_web_link = sprintf(
				'%1$s<a href="https://app.geolonia.com/?#/signup">%2$s</a>',
				esc_html__( 'Create ', 'geolonia-blocks' ),
				esc_html__( 'Geolonia Maps API Key' )
			);

			// $get_key_text    = esc_html__( 'Click "GET A KEY" button', 'geolonia-blocks' );
			// $continue_text   = esc_html__( 'Click "CONTINUE" button', 'geolonia-blocks' );
			// $set_domain_text = esc_html__( 'Add your domain.', 'geolonia-blocks' );

			$html  = '';
			$html .= '<h2>' . esc_html__( 'How to get API key?', 'geolonia-blocks' ) . '</h2>';
			$html .= '<ol>';
			$html .= '<li>' . $maps_api_for_web_link . '</li>';
			// $html .= '<li>' . $get_key_text . '<p><img style="width: 80%;" src="' . plugin_dir_url( __FILE__ ) . 'images/001.png"></p></li>';
			// $html .= '<li>' . $continue_text . '<p><img style="width: 80%;" src="' . plugin_dir_url( __FILE__ ) . 'images/002.png"></p></li>';
			// $html .= '<li>' . $continue_text . '<p><img style="width: 80%;" src="' . plugin_dir_url( __FILE__ ) . 'images/003.png"></p></li>';
			// $html .= '<li>' . $set_domain_text . '<p><img style="width: 80%;" src="' . plugin_dir_url( __FILE__ ) . 'images/004.png"></p></li>';
			$html .= '</ol>';

			echo $html;

		?>

		</form>
		<?php

	}
} // end class
