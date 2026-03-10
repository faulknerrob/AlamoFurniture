#!/usr/bin/env python3
"""Generate WordPress-ready files from static HTML pages."""

import os
import re
from datetime import datetime

WP_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(WP_DIR)


def extract_main_content(html):
    """Extract content between <main> tags."""
    match = re.search(r'<main[^>]*>(.*?)</main>', html, re.DOTALL)
    return match.group(1).strip() if match else ''


def extract_meta(html, name):
    """Extract meta tag content."""
    match = re.search(rf'<meta\s+name="{name}"\s+content="([^"]*)"', html)
    if not match:
        match = re.search(rf'<meta\s+property="{name}"\s+content="([^"]*)"', html)
    return match.group(1) if match else ''


def extract_title(html):
    """Extract page title."""
    match = re.search(r'<title>([^<]*)</title>', html)
    return match.group(1) if match else ''


def extract_schema(html):
    """Extract all JSON-LD schema blocks."""
    return re.findall(
        r'<script\s+type="application/ld\+json">\s*(.*?)\s*</script>',
        html, re.DOTALL
    )


def strip_header_footer_from_content(content):
    """Remove breadcrumbs wrapper div (WordPress theme handles breadcrumbs)."""
    # Keep the content as-is since it's already just the <main> inner content
    return content


def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()


def write_file(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)


# Page definitions
pages = [
    {
        'file': 'index.html',
        'slug': 'home',
        'wp_title': 'Home',
        'is_front': True,
        'menu_order': 1,
    },
    {
        'file': 'shop.html',
        'slug': 'shop',
        'wp_title': 'Shop',
        'is_front': False,
        'menu_order': 2,
    },
    {
        'file': 'about.html',
        'slug': 'about',
        'wp_title': 'About',
        'is_front': False,
        'menu_order': 3,
    },
    {
        'file': 'quote.html',
        'slug': 'get-a-quote',
        'wp_title': 'Get a Quote',
        'is_front': False,
        'menu_order': 4,
    },
    {
        'file': 'faq.html',
        'slug': 'faq',
        'wp_title': 'FAQ',
        'is_front': False,
        'menu_order': 5,
    },
    {
        'file': 'contact.html',
        'slug': 'contact',
        'wp_title': 'Contact',
        'is_front': False,
        'menu_order': 6,
    },
]

# Generate individual WordPress page HTML files
os.makedirs(os.path.join(WP_DIR, 'pages'), exist_ok=True)

page_data = []
for page in pages:
    filepath = os.path.join(ROOT_DIR, page['file'])
    html = read_file(filepath)

    title = extract_title(html)
    description = extract_meta(html, 'description')
    keywords = extract_meta(html, 'keywords')
    og_title = extract_meta(html, 'og:title')
    og_description = extract_meta(html, 'og:description')
    og_image = extract_meta(html, 'og:image')
    canonical = ''
    canon_match = re.search(r'<link\s+rel="canonical"\s+href="([^"]*)"', html)
    if canon_match:
        canonical = canon_match.group(1)

    schemas = extract_schema(html)
    main_content = extract_main_content(html)

    page_data.append({
        **page,
        'title': title,
        'description': description,
        'keywords': keywords,
        'og_title': og_title,
        'og_description': og_description,
        'og_image': og_image,
        'canonical': canonical,
        'schemas': schemas,
        'content': main_content,
    })

    # Write individual page content file (Gutenberg block format)
    wp_content = f'''<!-- wp:html -->
{main_content}
<!-- /wp:html -->'''

    write_file(
        os.path.join(WP_DIR, 'pages', f'{page["slug"]}.html'),
        wp_content
    )

# Generate WXR XML import file
now = datetime.now()
pub_date = now.strftime('%a, %d %b %Y %H:%M:%S +0000')
post_date = now.strftime('%Y-%m-%d %H:%M:%S')

xml_items = []
for i, p in enumerate(page_data, start=1):
    # Escape content for XML CDATA
    content_cdata = p['content']

    # Build Yoast SEO meta (if Yoast is installed)
    yoast_meta = ''
    if p['description']:
        yoast_meta += f'''
        <wp:postmeta>
            <wp:meta_key><![CDATA[_yoast_wpseo_metadesc]]></wp:meta_key>
            <wp:meta_value><![CDATA[{p['description']}]]></wp:meta_value>
        </wp:postmeta>'''
    if p['og_title']:
        yoast_meta += f'''
        <wp:postmeta>
            <wp:meta_key><![CDATA[_yoast_wpseo_opengraph-title]]></wp:meta_key>
            <wp:meta_value><![CDATA[{p['og_title']}]]></wp:meta_value>
        </wp:postmeta>'''
    if p['og_description']:
        yoast_meta += f'''
        <wp:postmeta>
            <wp:meta_key><![CDATA[_yoast_wpseo_opengraph-description]]></wp:meta_key>
            <wp:meta_value><![CDATA[{p['og_description']}]]></wp:meta_value>
        </wp:postmeta>'''
    if p['keywords']:
        yoast_meta += f'''
        <wp:postmeta>
            <wp:meta_key><![CDATA[_yoast_wpseo_focuskw]]></wp:meta_key>
            <wp:meta_value><![CDATA[{p['keywords'].split(",")[0].strip()}]]></wp:meta_value>
        </wp:postmeta>'''

    # Schema markup as custom field
    schema_meta = ''
    for j, schema in enumerate(p['schemas']):
        schema_meta += f'''
        <wp:postmeta>
            <wp:meta_key><![CDATA[_alamo_schema_{j}]]></wp:meta_key>
            <wp:meta_value><![CDATA[{schema.strip()}]]></wp:meta_value>
        </wp:postmeta>'''

    xml_items.append(f'''
    <item>
        <title><![CDATA[{p['wp_title']}]]></title>
        <link>https://alamoliveedge.com/{p['slug'] if p['slug'] != 'home' else ''}</link>
        <pubDate>{pub_date}</pubDate>
        <dc:creator><![CDATA[admin]]></dc:creator>
        <guid isPermaLink="false">https://alamoliveedge.com/?page_id={i}</guid>
        <description></description>
        <content:encoded><![CDATA[<!-- wp:html -->
{content_cdata}
<!-- /wp:html -->]]></content:encoded>
        <excerpt:encoded><![CDATA[{p['description']}]]></excerpt:encoded>
        <wp:post_id>{i}</wp:post_id>
        <wp:post_date><![CDATA[{post_date}]]></wp:post_date>
        <wp:post_date_gmt><![CDATA[{post_date}]]></wp:post_date_gmt>
        <wp:post_modified><![CDATA[{post_date}]]></wp:post_modified>
        <wp:post_modified_gmt><![CDATA[{post_date}]]></wp:post_modified_gmt>
        <wp:comment_status><![CDATA[closed]]></wp:comment_status>
        <wp:ping_status><![CDATA[closed]]></wp:ping_status>
        <wp:post_name><![CDATA[{p['slug']}]]></wp:post_name>
        <wp:status><![CDATA[publish]]></wp:status>
        <wp:post_parent>0</wp:post_parent>
        <wp:menu_order>{p['menu_order']}</wp:menu_order>
        <wp:post_type><![CDATA[page]]></wp:post_type>
        <wp:post_password><![CDATA[]]></wp:post_password>
        <wp:is_sticky>0</wp:is_sticky>
        <wp:postmeta>
            <wp:meta_key><![CDATA[_wp_page_template]]></wp:meta_key>
            <wp:meta_value><![CDATA[default]]></wp:meta_value>
        </wp:postmeta>{yoast_meta}{schema_meta}
    </item>''')

wrx_xml = f'''<?xml version="1.0" encoding="UTF-8" ?>
<!-- WordPress eXtended RSS (WXR) Import File -->
<!-- Generated for: Alamo Live Edge Furniture Co. -->
<!-- Import via: WordPress Dashboard > Tools > Import > WordPress -->
<rss version="2.0"
    xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
    xmlns:content="http://purl.org/rss/1.0/modules/content/"
    xmlns:wfw="http://wellformedweb.org/CommentAPI/"
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:wp="http://wordpress.org/export/1.2/"
>
<channel>
    <title>Alamo Live Edge Furniture Co.</title>
    <link>https://alamoliveedge.com</link>
    <description>Handcrafted live edge furniture in San Antonio, TX</description>
    <pubDate>{pub_date}</pubDate>
    <language>en-US</language>
    <wp:wxr_version>1.2</wp:wxr_version>
    <wp:base_site_url>https://alamoliveedge.com</wp:base_site_url>
    <wp:base_blog_url>https://alamoliveedge.com</wp:base_blog_url>

    <wp:author>
        <wp:author_id>1</wp:author_id>
        <wp:author_login><![CDATA[admin]]></wp:author_login>
        <wp:author_email><![CDATA[rob@alamoliveedge.com]]></wp:author_email>
        <wp:author_display_name><![CDATA[Rob Faulkner]]></wp:author_display_name>
    </wp:author>
{"".join(xml_items)}
</channel>
</rss>'''

write_file(os.path.join(WP_DIR, 'alamo-liveedge-import.xml'), wrx_xml)

print(f"Generated WXR import file: alamo-liveedge-import.xml")
print(f"Generated {len(pages)} individual page files in pages/")
for p in pages:
    print(f"  - pages/{p['slug']}.html")
