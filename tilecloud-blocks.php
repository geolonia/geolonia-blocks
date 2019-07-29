<?php
/**
 * Plugin Name:     Geolonia Blocks
 * Plugin URI:      PLUGIN SITE HERE
 * Description:     PLUGIN DESCRIPTION HERE
 * Author:          YOUR NAME HERE
 * Author URI:      YOUR SITE HERE
 * Text Domain:     geolonia-blocks
 * Domain Path:     /languages
 * Version:         0.1.0
 *
 * @package         Geolonia_Blocks
 */


add_action( 'wp_footer', function() {
	$api_key = esc_attr( 'YOUR-API-KEY' );
	?>
		<script type="text/javascript" src="https://api.geolonia.com/v1/embed?geolonia-api-key=<?php echo $api_key; ?>"></script>
	<?php
} );

 add_action( 'enqueue_block_editor_assets', function() {

   wp_enqueue_script(
     'geolonia-blocks',
     plugins_url( 'dist/main.js', __FILE__ ),
     [ 'wp-blocks', 'wp-element' ]
   );
 } );
