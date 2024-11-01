<?php
/**
 * @package   	Social Deux
 * @author    	Wordpress
 * @link      	
 * @copyright 	2013 Wordpress
 *
 * @wordpress-plugin
 * Plugin Name:       Social Deux
 * Plugin URI:        
 * Description:       Social Deux is a plugin that gives you 11 popular custom styled social media sharing buttons with counters.
 * Version:           1.1
 * Author:            
 * Author URI:        
 * Text Domain:       ultimate-social-deux
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

define('SOCIAL_DEUX_VERSION', '1.1');

require_once( plugin_dir_path( __FILE__ ) . 'public/class-ultimate-social-deux-public.php' );
require_once( plugin_dir_path( __FILE__ ) . 'public/class-ultimate-social-deux-shortcodes.php' );
require_once( plugin_dir_path( __FILE__ ) . 'public/class-ultimate-social-deux-pinterest-sharer.php' );
require_once( plugin_dir_path( __FILE__ ) . 'public/class-ultimate-social-deux-placement.php' );
require_once( plugin_dir_path( __FILE__ ) . 'public/class-ultimate-social-deux-widget.php' );
require_once( plugin_dir_path( __FILE__ ) . 'public/class-ultimate-social-deux-visual-composer.php' );
require_once( plugin_dir_path( __FILE__ ) . 'public/class-ultimate-social-deux-fan-count.php' );

register_activation_hook( __FILE__, array( 'UltimateSocialDeux', 'activate' ) );
register_deactivation_hook( __FILE__, array( 'UltimateSocialDeux', 'deactivate' ) );

add_action( 'plugins_loaded', array( 'UltimateSocialDeux', 'get_instance' ) );
add_action( 'plugins_loaded', array( 'UltimateSocialDeuxShortcodes', 'get_instance' ) );
add_action( 'plugins_loaded', array( 'UltimateSocialDeuxPinterestSharer', 'get_instance' ) );
add_action( 'plugins_loaded', array( 'UltimateSocialDeuxPlacement', 'get_instance' ) );
add_action( 'plugins_loaded', array( 'UltimateSocialDeuxFanCount', 'get_instance' ) );

/*----------------------------------------------------------------------------*
 * Dashboard and Administrative Functionality
 *----------------------------------------------------------------------------*/

if ( is_admin() && ( ! defined( 'DOING_AJAX' ) || ! DOING_AJAX ) ) {

	require_once( plugin_dir_path( __FILE__ ) . 'admin/class-ultimate-social-deux-admin.php' );
	add_action( 'plugins_loaded', array( 'UltimateSocialDeuxAdmin', 'get_instance' ) );
	require_once( plugin_dir_path( __FILE__ ) . 'admin/includes/class.settings-api.php' );
	require_once( plugin_dir_path( __FILE__ ) . 'admin/includes/wp-updates-plugin.php');
new WPUpdatesPluginUpdater_541( 'http://wp-updates.com/api/2/plugin', plugin_basename(__FILE__));

}

/*add_filter('pre_set_site_transient_update_plugins', 'remove_update_notification');
function remove_update_notification($value) {
 unset($value->response[ plugin_basename(__FILE__) ]);
 return $value;
}*/