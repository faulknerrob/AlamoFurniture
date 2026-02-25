# Alamo Live Edge Furniture Co. — Website

Production-ready 6-page website for Alamo Live Edge Furniture Co., a veteran-owned custom live edge furniture and refinishing business in San Antonio, TX.

## Project Structure

```
├── index.html          Home page
├── shop.html           Shop / Gallery page
├── about.html          About Rob Faulkner
├── quote.html          Request a free quote
├── faq.html            Frequently asked questions
├── contact.html        Contact information & form
├── css/
│   └── styles.css      Complete responsive stylesheet
├── js/
│   └── main.js         Navigation, accordions, forms, animations
├── images/             Image assets (add photos here)
├── sitemap.xml         XML sitemap for search engines
├── robots.txt          Crawler directives
└── README.md           This file
```

## Setup Instructions

### Local Development

1. Clone or download this repository
2. Open `index.html` in a browser — no build step required
3. For local development with live reload, use any static server:
   ```bash
   # Python
   python3 -m http.server 8000

   # Node.js (npx)
   npx serve .

   # PHP
   php -S localhost:8000
   ```

### Adding Images

Replace the placeholder elements in the HTML with actual `<img>` tags. Recommended image specs:

- **Hero background:** 1920x1080px minimum, WebP format, <200KB
- **Gallery cards:** 800x600px (4:3 ratio), WebP format, <100KB each
- **About/Workshop photos:** 800x1000px (3:4 ratio for portrait), WebP format
- **OG images:** 1200x630px for social sharing

Image filenames should be descriptive and keyword-rich:
```
live-edge-walnut-dining-table-san-antonio.webp
mesquite-coffee-table-epoxy-river.webp
rob-faulkner-workshop-san-antonio.webp
```

All images should include descriptive `alt` text (already templated in the HTML).

### Fonts

The site uses Google Fonts loaded via CDN:
- **Playfair Display** (headings) — serif
- **Source Sans 3** (body) — sans-serif

For better performance in production, consider self-hosting the font files.

### Form Handling

The contact and quote forms currently log submissions to the console. To make them functional:

1. **Simple option:** Use a form service like Formspree, Netlify Forms, or Basin
2. **Custom option:** Point the form `action` to your server endpoint
3. **Email option:** Use EmailJS for client-side email sending

### Google Maps

The contact page includes a Google Maps embed showing San Antonio. To use a specific location:
1. Go to Google Maps and find the business location
2. Click "Share" → "Embed a map"
3. Replace the iframe `src` in `contact.html`

## Deployment

This is a static site — deploy to any static hosting:

- **Netlify:** Drag and drop the project folder
- **Vercel:** Connect the repository
- **GitHub Pages:** Push to a `gh-pages` branch
- **Traditional hosting:** Upload via FTP/SFTP

### Pre-Deployment Checklist

- [ ] Replace placeholder images with real photos
- [ ] Update phone number `(210) 555-0178` with real number
- [ ] Update email `rob@alamoliveedge.com` with real email
- [ ] Update physical address in schema markup and contact page
- [ ] Update Google Maps embed with actual business location
- [ ] Update social media URLs (Facebook, Instagram, Pinterest)
- [ ] Update canonical URLs to match production domain
- [ ] Update Open Graph image URLs
- [ ] Set up form submission handling (Formspree, server endpoint, etc.)
- [ ] Add Google Analytics or other tracking
- [ ] Set up Google Search Console and submit sitemap
- [ ] Create and link Google Business Profile
- [ ] Test all forms end-to-end
- [ ] Run Lighthouse audit (target 90+ on all categories)
- [ ] Test on real mobile devices
- [ ] Set up SSL certificate (HTTPS)

## SEO Checklist

### Implemented

- [x] Unique `<title>` tag per page with primary keyword
- [x] Unique `<meta description>` per page (150-160 chars)
- [x] One `<h1>` per page with primary keyword
- [x] Semantic heading hierarchy (H1 → H2 → H3)
- [x] Open Graph tags on all pages
- [x] Twitter Card meta tags
- [x] Canonical URLs (self-referencing)
- [x] LocalBusiness schema (JSON-LD)
- [x] BreadcrumbList schema on all pages
- [x] FAQPage schema on FAQ page
- [x] Product/ItemList schema on Shop page
- [x] XML sitemap with all pages
- [x] robots.txt with sitemap reference
- [x] Mobile-responsive design
- [x] Semantic HTML5 structure
- [x] Internal linking between all pages
- [x] Breadcrumb navigation
- [x] Alt text on all images
- [x] Accessible forms with labels and ARIA
- [x] Keyboard navigation support
- [x] WCAG 2.1 AA color contrast
- [x] Print-friendly styles

### To Complete After Launch

- [ ] Submit sitemap to Google Search Console
- [ ] Create Google Business Profile
- [ ] Build local citations (Yelp, BBB, Chamber of Commerce)
- [ ] Set up review generation (Google, Facebook)
- [ ] Monitor Core Web Vitals in Search Console
- [ ] Add real customer testimonials with permission
- [ ] Build backlinks from local SA directories and veteran business networks

## Technology

- **HTML5** — Semantic markup
- **CSS3** — Custom properties, Grid, Flexbox, media queries
- **Vanilla JavaScript** — No frameworks or dependencies
- **Google Fonts** — Playfair Display + Source Sans 3
- **Zero build tools required** — Ships as-is

## Browser Support

- Chrome 80+
- Firefox 78+
- Safari 13+
- Edge 80+
- Mobile Safari (iOS 13+)
- Chrome for Android

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Walnut | `#3E2723` | Headings, primary dark |
| Cream | `#FAF3E0` | Backgrounds, light text |
| Copper | `#B7410E` | Accent, CTAs, links |
| Background | `#FDFAF6` | Page background |
| Text | `#1A1A1A` | Body text |

All colors are defined as CSS custom properties in `css/styles.css` for easy updates.

## License

This website was built for Alamo Live Edge Furniture Co. All rights reserved.
