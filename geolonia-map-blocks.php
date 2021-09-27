<?php
/**
 * Plugin Name:       Geolonia Map Blocks
 * Description:       Example block written with ESNext standard and JSX support – build step required.
 * Requires at least: 5.8
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       geolonia-map-blocks
 */

function geolonia_map_blocks_block_init() {
	register_block_type( __DIR__ );
}
add_action( 'init', 'geolonia_map_blocks_block_init' );

function geolonia_map_blocks_enqueue_scripts() {
  wp_enqueue_script(
    'geolonia-embed-api',
    'https://cdn.geolonia.com/v1/embed?geolonia-api-key=YOUR-API-KEY',
    array(),
    false,
    true
  );
}

add_action( 'wp_enqueue_scripts', 'geolonia_map_blocks_enqueue_scripts');
add_action( 'admin_enqueue_scripts', 'geolonia_map_blocks_enqueue_scripts');

