<?php
/*
Plugin Name: Action Tracker
Description: Action Tracker shortcode
Author: Mike Pritchard (mike@arsenicsoup.com)
Version: 1.3
*/

class ActionTrackerPlugin {

    public function __construct() {
        // Register the shirt code with WP
        add_shortcode('actionTracker', [ $this, 'handleShortcode' ]);        
    }

    /**
     * Add in the shortcode, pull in required JS dependencies and 
     * create the main div that the Vue app will live in.
     */
    function handleShortcode($atts = [], $content = null, $tag = '') {

        if (is_admin()){
            return;
        }
        
        $vueRootUrl = plugin_dir_url( __FILE__ ) . 'dist';
        $vueFileRoot = plugin_dir_path( __FILE__) . 'dist';

        $jsCore = ['bootstrap.min.js', 'jquery-3.3.1.min.js', 'popper.min.js'];

        // Find the build files
        $jsMatches = glob(plugin_dir_path( __FILE__) . 'dist/js/*.*.js');
        $cssMatches = glob(plugin_dir_path( __FILE__) . 'dist/css/*.*.css');

        // Bring in core dependencies first

        $isLocal = true;

        if ($isLocal){

            //wp_deregister_script('jquery');

            //wp_register_script('actiontracker_vuecore_jquery', $vueRootUrl . '/js/jquery-3.3.1.min.js', false, null, true);

            wp_register_script('actiontracker_vuecore_popper', $vueRootUrl . '/js/popper.min.js', false, null, true);
            wp_register_script('actiontracker_vuecore_bootstrap4', $vueRootUrl . '/js/bootstrap.min.js', false, null, true);
    
            foreach ($jsMatches as $i => $jsItem) {
                if (!in_array(basename($jsItem), $jsCore)){
                    $url = $vueRootUrl . '/js/' . basename($jsItem);
                    $name = "actiontracker_vuejs_".$i;
                    if (!wp_script_is($name, 'enqueued')){
                        //print_r('BUILD JS: ' . $jsItem . '<br/>');
                        wp_register_script($name, $url);
                        wp_enqueue_script($name);    
                    }
                }
            }
    
            foreach ($cssMatches as $i => $cssItem) {        
                $url = $vueRootUrl . '/css/' . basename($cssItem);
                $name = "actiontracker_vuecss_".$i;
                if (!wp_script_is($name, 'enqueued')){
                    //print_r('CSS JS: ' . $i . '<br/>');
                    wp_register_style($name, $url);
                    wp_enqueue_style($name);    
                }
                
            }

        }
        else {

            wp_register_script('actiontracker_vuecore_popper', 'http://app.actiontracker.org/js/popper.min.js', false, null, true);
            wp_register_script('actiontracker_vuecore_bootstrap4', 'http://app.actiontracker.org/js/bootstrap.min.js', false, null, true);
            
            //wp_enqueue_script('actiontracker_vuecore_jquery');
            wp_enqueue_script('actiontracker_vuecore_popper');
            wp_enqueue_script('actiontracker_vuecore_bootstrap4');
    
        }


        
        

        /*

        */
                
        // Handle short code params

        if (array_key_exists('view', $atts)) {
            $str = "<div class='actionTrackerVuePlugin' view='".$atts['view']."'>You need Javascript for this feature, sorry.</div>";    
        }
        else {
            $str = "<div class='actionTrackerVuePlugin' view='all'>You need Javascript for this feature, sorry.</div>";    
        }

        return $str;
    }
   
}

new ActionTrackerPlugin();
?>