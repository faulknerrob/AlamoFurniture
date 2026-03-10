# WordPress Setup Guide — Alamo Live Edge Furniture Co.

This directory contains all files needed to import the Alamo Live Edge Furniture website into WordPress.

## Files Included

| File | Purpose |
|------|---------|
| `alamo-liveedge-import.xml` | WXR import file — imports all 6 pages into WordPress |
| `alamo-custom.css` | Custom stylesheet (all page styles) |
| `alamo-custom.js` | Custom JavaScript (navigation, FAQ accordion, forms, filters, animations) |
| `alamo-enqueue.php` | PHP snippet to load CSS/JS and output schema markup |
| `pages/` | Individual page HTML files (for manual copy-paste if preferred) |

## Quick Start (Recommended)

### Step 1: Import Pages

1. Go to **WordPress Dashboard > Tools > Import**
2. Click **WordPress** (install the importer plugin if prompted)
3. Click **Choose File** and select `alamo-liveedge-import.xml`
4. Click **Upload file and import**
5. Assign the author to your WordPress admin user
6. Check **"Download and import file attachments"**
7. Click **Submit**

This creates all 6 pages:
- **Home** (`/home/`)
- **Shop** (`/shop/`)
- **About** (`/about/`)
- **Get a Quote** (`/get-a-quote/`)
- **FAQ** (`/faq/`)
- **Contact** (`/contact/`)

### Step 2: Upload Custom Assets

1. Upload `alamo-custom.css` to your child theme directory
   (e.g., `/wp-content/themes/your-child-theme/alamo-custom.css`)
2. Upload `alamo-custom.js` to your child theme directory
   (e.g., `/wp-content/themes/your-child-theme/alamo-custom.js`)

### Step 3: Enqueue Assets

Add the code from `alamo-enqueue.php` to your child theme's `functions.php`.

**Alternative:** Use a plugin like [Code Snippets](https://wordpress.org/plugins/code-snippets/) to add the PHP without editing theme files.

### Step 4: Set Static Front Page

1. Go to **Settings > Reading**
2. Select **"A static page"**
3. Set **Homepage** to "Home"
4. Click **Save Changes**

### Step 5: Create Navigation Menu

1. Go to **Appearance > Menus**
2. Create a new menu called "Main Navigation"
3. Add all 6 pages to the menu
4. Set the menu location to your theme's primary/header menu
5. Save

## Alternative: Manual Page Creation

If you prefer not to use the XML importer, you can create pages manually:

1. Go to **Pages > Add New**
2. Switch to the **Code Editor** (click the three dots menu > Code Editor)
3. Copy the contents from the corresponding file in the `pages/` directory
4. Set the page title and slug
5. Publish

Individual page files:
- `pages/home.html` — Home page
- `pages/shop.html` — Shop / Gallery
- `pages/about.html` — About Rob Faulkner
- `pages/get-a-quote.html` — Quote Request Form
- `pages/faq.html` — FAQ
- `pages/contact.html` — Contact

## SEO Configuration

### If Using Yoast SEO

The import file includes Yoast-compatible meta fields:
- Meta descriptions
- OpenGraph titles and descriptions
- Focus keywords

These will be populated automatically if Yoast SEO is installed before importing.

### Schema Markup

JSON-LD schema is stored as custom fields and output via `alamo-enqueue.php`. Schemas included:
- **Home:** FurnitureStore (LocalBusiness) + BreadcrumbList
- **Shop:** ItemList with Product entries + BreadcrumbList
- **FAQ:** FAQPage schema + BreadcrumbList
- **Contact:** FurnitureStore with OpeningHoursSpecification + BreadcrumbList
- **About & Quote:** BreadcrumbList

### If Using Rank Math or Other SEO Plugin

Manually set the meta descriptions and OG tags from the values in each page's HTML source file.

## Form Handling

The quote and contact forms use client-side validation but need a backend handler. Recommended WordPress solutions:

1. **Contact Form 7** — Replace the HTML forms with CF7 shortcodes
2. **WPForms** — Drag-and-drop form builder with templates
3. **Gravity Forms** — Advanced form builder with conditional logic
4. **Formidable Forms** — Good for quote/estimate forms

To use the existing HTML forms as-is, connect them to a service like:
- [Formspree](https://formspree.io) — Add `action` and `method` attributes
- [Basin](https://usebasin.com) — No-code form backend

## Recommended WordPress Plugins

| Plugin | Purpose |
|--------|---------|
| Yoast SEO | SEO meta, sitemaps, schema (or Rank Math) |
| Contact Form 7 / WPForms | Form handling |
| WP Super Cache / W3 Total Cache | Performance |
| Smush / ShortPixel | Image optimization |
| UpdraftPlus | Backups |

## Theme Compatibility Notes

- The custom CSS uses CSS custom properties (CSS variables) — supported in all modern browsers
- Styles are scoped to specific class names (`.hero`, `.gallery-card`, `.faq-item`, etc.) to avoid conflicts with your WordPress theme
- The navigation and footer HTML in the page content can be removed if your WordPress theme provides its own header/footer — the pages include them for completeness
- For best results, use a minimal theme (Astra, GeneratePress, Kadence) with a blank page template

## Images

The site uses placeholder descriptions for images. After importing:
1. Upload your product photos to the **Media Library**
2. Edit each page and replace the placeholder `<div>` elements with `<img>` tags or WordPress Image blocks
3. Recommended image sizes:
   - Gallery cards: 800x600px
   - Hero backgrounds: 1920x1080px
   - About page photos: 600x800px (portrait)
