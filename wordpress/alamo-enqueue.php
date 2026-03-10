<?php
/**
 * Alamo Live Edge Furniture Co. — WordPress Asset Enqueue
 *
 * Add this code to your child theme's functions.php, or use a plugin
 * like "Code Snippets" to add it without editing theme files.
 *
 * BEFORE USING: Upload alamo-custom.css and alamo-custom.js to your
 * child theme directory (or adjust the paths below).
 */

/**
 * Enqueue Alamo Live Edge custom styles and scripts.
 */
function alamo_enqueue_custom_assets() {
    // Google Fonts — Playfair Display & Source Sans 3
    wp_enqueue_style(
        'alamo-google-fonts',
        'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Source+Sans+3:wght@300;400;500;600;700&display=swap',
        array(),
        null
    );

    // Custom CSS
    wp_enqueue_style(
        'alamo-custom-css',
        get_stylesheet_directory_uri() . '/alamo-custom.css',
        array('alamo-google-fonts'),
        '1.0.0'
    );

    // Custom JS
    wp_enqueue_script(
        'alamo-custom-js',
        get_stylesheet_directory_uri() . '/alamo-custom.js',
        array(),
        '1.0.0',
        true // Load in footer
    );
}
add_action('wp_enqueue_scripts', 'alamo_enqueue_custom_assets');

/**
 * Add JSON-LD Schema markup to page heads.
 * Schemas are stored as custom fields (_alamo_schema_0, _alamo_schema_1, etc.)
 */
function alamo_output_schema_markup() {
    if (!is_singular('page')) return;

    global $post;
    $i = 0;
    while ($schema = get_post_meta($post->ID, '_alamo_schema_' . $i, true)) {
        echo '<script type="application/ld+json">' . "\n";
        echo $schema . "\n";
        echo '</script>' . "\n";
        $i++;
    }
}
add_action('wp_head', 'alamo_output_schema_markup');

/**
 * Set the Home page as the static front page (run once after import).
 * Uncomment and visit any page to activate, then re-comment.
 */
/*
function alamo_set_front_page() {
    $home_page = get_page_by_path('home');
    if ($home_page) {
        update_option('show_on_front', 'page');
        update_option('page_on_front', $home_page->ID);
    }
}
add_action('init', 'alamo_set_front_page');
*/
