<?php
/**
 * Plugin Name:     Tilecloud Blocks
 * Plugin URI:      PLUGIN SITE HERE
 * Description:     PLUGIN DESCRIPTION HERE
 * Author:          YOUR NAME HERE
 * Author URI:      YOUR SITE HERE
 * Text Domain:     tilecloud-blocks
 * Domain Path:     /languages
 * Version:         0.1.0
 *
 * @package         Tilecloud_Blocks
 */


add_action( 'wp_footer', function() {
	$api_key = esc_attr( 'YOUR-API-KEY' );
	?>
		<script type="text/javascript" src="https://api.tilecloud.io/v1/embed?tilecloud-api-key=<?php echo $api_key; ?>"></script>
	<?php
} );

 add_action( 'enqueue_block_editor_assets', function() {

   wp_enqueue_script(
     'tilecloud-blocks',
     plugins_url( 'dist/main.js', __FILE__ ),
     [ 'wp-blocks', 'wp-element' ]
   );
 } );
