---
name: seo-optimizer
description: SEO specialist for BookingIncatrail travel booking platform. Analyzes and optimizes SEO for tours in Peru (Inca Trail, Machu Picchu, Salkantay). Expert in tourism keywords, bilingual SEO (ES/EN), schema markup for tours, and travel industry best practices.
---

# SEO Optimizer - BookingIncatrail

**Invocación:** Menciona "usa la skill seo-optimizer" o "analiza SEO según la skill"

Specialized SEO guidance for BookingIncatrail, a Next.js 15 travel booking platform for Peruvian adventure tours with bilingual support (Spanish/English).

## When to Use This Skill

Use this skill when:
- Optimizing website content for search engines
- Conducting keyword research and analysis
- Implementing technical SEO improvements
- Creating SEO-friendly meta tags and descriptions
- Auditing websites for SEO issues
- Improving Core Web Vitals and page speed
- Implementing schema markup (structured data)
- Planning content strategy for organic traffic

## SEO Fundamentals

### 1. Keyword Research & Strategy

**Primary Keyword Selection:**
- Focus on search intent (informational, navigational, transactional, commercial)
- Balance search volume with competition
- Consider keyword difficulty and ranking potential
- Target long-tail keywords for quick wins

**Keyword Research Process:**
```
1. Identify seed keywords from business objectives
2. Use tools to expand keyword list (Google Keyword Planner, Ahrefs, SEMrush)
3. Analyze search volume and difficulty
4. Group keywords by topic clusters
5. Map keywords to content types and pages
6. Prioritize based on potential ROI
```

**Content Optimization Formula:**
- Primary keyword: 1-2% density (natural placement)
- Include in: Title tag, H1, first paragraph, URL, meta description
- Use semantic variations and related terms
- Maintain natural readability (don't keyword stuff)

### 2. On-Page SEO

**Title Tag Optimization:**
```html
<!-- Good: Descriptive, includes keyword, under 60 characters -->
<title>Ultimate Guide to React Hooks - Learn useEffect & useState</title>

<!-- Bad: Too long, keyword stuffing, generic -->
<title>React Hooks Guide React Hooks Tutorial React Hooks Examples Learn React</title>
```

**Best Practices:**
- Keep under 60 characters (displayed in SERPs)
- Place primary keyword near the beginning
- Include brand name if space permits
- Make compelling and click-worthy
- Unique for every page

**Meta Description:**
```html
<!-- Good: Compelling, includes keywords, call-to-action, 150-160 chars -->
<meta name="description" content="Master React Hooks with our comprehensive guide. Learn useState, useEffect, and custom hooks with practical examples. Start building better React apps today.">

<!-- Bad: Too short, no value proposition -->
<meta name="description" content="React Hooks guide and tutorial">
```

**Header Structure:**
```html
<!-- Proper hierarchy -->
<h1>Main Page Title (Primary Keyword)</h1>
  <h2>Section Heading (Related Keywords)</h2>
    <h3>Subsection</h3>
    <h3>Subsection</h3>
  <h2>Another Section</h2>
    <h3>Subsection</h3>
```

**URL Structure:**
```
✅ Good URLs:
- /blog/react-hooks-guide
- /products/running-shoes
- /learn/javascript-async-await

❌ Bad URLs:
- /blog?p=12345
- /products/cat-1/subcat-2/item-999
- /page.php?id=abc&ref=xyz
```

**Image Optimization:**
```html
<!-- Optimized image -->
<img
  src="/images/react-hooks-diagram-800w.webp"
  alt="React Hooks lifecycle diagram showing useState and useEffect"
  width="800"
  height="600"
  loading="lazy"
/>
```

**Best Practices:**
- Use descriptive, keyword-rich alt text
- Compress images (WebP format preferred)
- Specify dimensions to prevent layout shift
- Use lazy loading for below-fold images
- Include captions when relevant

### 3. Content Quality

**E-E-A-T Principles (Experience, Expertise, Authoritativeness, Trust):**
- Demonstrate author expertise with credentials
- Cite authoritative sources
- Keep content accurate and up-to-date
- Show real experience and original insights
- Include author bios and bylines

**Content Structure for SEO:**
```markdown
# Main Title (H1) - Primary Keyword

Brief introduction with primary keyword in first 100 words.

## What is [Topic]? (H2) - Answer core question

Comprehensive explanation with examples.

## Why [Topic] Matters (H2) - Value proposition

Benefits and use cases.

## How to [Action] (H2) - Practical guide

Step-by-step instructions with visuals.

## Best Practices (H2) - Advanced tips

Expert recommendations.

## Common Mistakes to Avoid (H2)

Troubleshooting and pitfalls.

## Conclusion

Summary and call-to-action.
```

**Content Length Guidelines:**
- Blog posts: 1,500-2,500 words (comprehensive topics)
- Product pages: 300-500 words minimum
- Category pages: 500-1,000 words
- Homepage: 500+ words

### 4. Technical SEO

**Schema Markup (Structured Data):**
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Complete Guide to React Hooks",
  "image": "https://example.com/images/react-hooks.jpg",
  "datePublished": "2024-01-15",
  "dateModified": "2024-02-01",
  "author": {
    "@type": "Person",
    "name": "Jane Developer"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Tech Academy",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  }
}
```

**Common Schema Types:**
- Article (blog posts)
- Product (e-commerce)
- FAQ (question/answer pages)
- HowTo (tutorials and guides)
- Organization (company info)
- LocalBusiness (location-based businesses)
- BreadcrumbList (navigation paths)
- Review/AggregateRating (ratings and reviews)

**Robots.txt Configuration:**
```
User-agent: *
Disallow: /admin/
Disallow: /private/
Disallow: /api/
Allow: /api/public/

Sitemap: https://example.com/sitemap.xml
```

**XML Sitemap Structure:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://example.com/blog/react-hooks-guide</loc>
    <lastmod>2024-01-10</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

**Canonical Tags:**
```html
<!-- Prevent duplicate content issues -->
<link rel="canonical" href="https://example.com/original-page">

<!-- Handle URL parameters -->
<link rel="canonical" href="https://example.com/products/shoes">
<!-- Even if accessed via: /products/shoes?color=red&size=10 -->
```

### 5. Core Web Vitals

**Largest Contentful Paint (LCP) - Target: < 2.5s**
- Optimize images and videos
- Use CDN for static assets
- Minimize render-blocking resources
- Implement lazy loading

**First Input Delay (FID) - Target: < 100ms**
- Minimize JavaScript execution time
- Break up long tasks
- Use web workers for heavy computations
- Defer non-critical JavaScript

**Cumulative Layout Shift (CLS) - Target: < 0.1**
- Set size attributes on images and videos
- Avoid inserting content above existing content
- Use transform animations instead of layout-triggering properties
- Reserve space for ads and embeds

**Page Speed Optimization:**
```html
<!-- Preload critical resources -->
<link rel="preload" href="/fonts/main.woff2" as="font" crossorigin>

<!-- Defer non-critical CSS -->
<link rel="preload" href="/styles/non-critical.css" as="style" onload="this.onload=null;this.rel='stylesheet'">

<!-- Async/defer JavaScript -->
<script src="/js/analytics.js" async></script>
<script src="/js/main.js" defer></script>
```

### 6. Mobile SEO

**Mobile-First Optimization:**
- Responsive design (mobile-friendly test passed)
- Touch-friendly buttons (minimum 48x48px)
- Readable font sizes (16px minimum)
- Proper viewport configuration
- Fast mobile page speed

**Viewport Configuration:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

### 7. Internal Linking Strategy

**Best Practices:**
- Use descriptive anchor text (avoid "click here")
- Link to relevant, contextual pages
- Maintain logical hierarchy and flow
- Include 3-5 internal links per 1,000 words
- Update old content with links to new content

**Example:**
```markdown
Learn more about [advanced React patterns](/guides/react-patterns)
or check out our [useState hook tutorial](/tutorials/usestate-guide).
```

## SEO Content Checklist

**Before Publishing:**
- [ ] Primary keyword in title tag (under 60 chars)
- [ ] Meta description (150-160 chars, compelling)
- [ ] H1 tag with primary keyword
- [ ] URL slug optimized and readable
- [ ] Images compressed with descriptive alt text
- [ ] 3-5 internal links to relevant content
- [ ] External links to authoritative sources
- [ ] Content length appropriate for topic depth
- [ ] Schema markup implemented
- [ ] Mobile-friendly and responsive
- [ ] Page speed optimized (< 3s load time)
- [ ] No broken links
- [ ] Canonical tag set correctly
- [ ] Social sharing meta tags (Open Graph, Twitter Card)

## Advanced SEO Strategies

### Topic Clusters & Pillar Pages

**Structure:**
```
Pillar Page: "Complete Guide to React"
  ├── Cluster: "React Hooks Tutorial"
  ├── Cluster: "React Context API Guide"
  ├── Cluster: "React Performance Optimization"
  └── Cluster: "React Testing Best Practices"
```

**Implementation:**
- Create comprehensive pillar content (3,000+ words)
- Develop 8-12 cluster articles supporting the pillar
- Link all clusters back to pillar page
- Link pillar page to all clusters
- Use consistent keyword themes

### Featured Snippet Optimization

**Question-Based Content:**
```markdown
## What is React?

React is a JavaScript library for building user interfaces,
developed by Facebook. It allows developers to create reusable
UI components and efficiently update the DOM through a virtual
DOM implementation.
```

**List-Based Content:**
```markdown
## Top 5 React Best Practices

1. Use functional components with hooks
2. Implement proper state management
3. Optimize performance with React.memo
4. Follow component composition patterns
5. Write comprehensive tests
```

**Table-Based Content:**
| Framework | Performance | Learning Curve | Ecosystem |
|-----------|-------------|----------------|-----------|
| React     | Excellent   | Moderate       | Extensive |
| Vue       | Excellent   | Easy           | Growing   |
| Angular   | Good        | Steep          | Mature    |

## Local SEO (for businesses with physical locations)

**Google Business Profile Optimization:**
- Complete all business information
- Regular posts and updates
- Respond to reviews
- Add high-quality photos
- Verify business hours

**Local Schema Markup:**
```json
{
  "@type": "LocalBusiness",
  "name": "Tech Solutions Inc",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main St",
    "addressLocality": "San Francisco",
    "addressRegion": "CA",
    "postalCode": "94102"
  },
  "telephone": "+1-415-555-0123"
}
```

## Monitoring & Analytics

**Key Metrics to Track:**
- Organic traffic trends
- Keyword rankings
- Click-through rates (CTR)
- Bounce rate and dwell time
- Core Web Vitals scores
- Backlink profile growth
- Conversion rates from organic traffic

**Tools:**
- Google Search Console (performance, indexing issues)
- Google Analytics 4 (traffic, behavior, conversions)
- PageSpeed Insights (Core Web Vitals)
- Ahrefs/SEMrush (keywords, backlinks, competition)
- Screaming Frog (technical audits)

When optimizing for SEO, prioritize user experience and value delivery. Search engines increasingly reward content that genuinely helps users and provides authoritative, trustworthy information.

---

## 🎯 BookingIncatrail SEO Strategy

### Project Details
- **Platform:** Next.js 15 + React 19 + MongoDB
- **Languages:** Spanish (ES) + English (EN) - Bilingual
- **Business:** Peruvian adventure tours (Inca Trail, Machu Picchu, Salkantay, Rainbow Mountain)
- **Location:** Cusco, Peru
- **Target Markets:** US, UK, EU, Australia, Latin America

### 🔑 Primary Keywords

**High-Volume Transactional:**
- "inca trail trek 2026"
- "machu picchu tours from cusco"
- "salkantay trek peru"
- "rainbow mountain cusco"
- "classic inca trail 4 day"

**Long-Tail (High Conversion):**
- "how much does inca trail cost"
- "inca trail permits availability"
- "best time to hike inca trail"
- "private inca trail tour operator"
- "short inca trail 2 day trek"

**Local SEO:**
- "cusco tour operator"
- "peru trekking agency"
- "machu picchu travel agency"

### ✅ Schema Markup Status

**Implemented:**
- ✅ TouristAttraction (tour pages)
- ✅ Product + Offer (pricing)
- ✅ BreadcrumbList (navigation)
- ✅ Organization (brand info)
- ✅ AggregateRating (4.9/5)

**Missing - High Priority:**
- 🔴 FAQPage (for CategoryFAQs component)
- 🔴 Review (for testimonials Section6)
- 🔴 LocalBusiness/TravelAgency (footer)
- 🟡 TouristTrip (detailed itineraries)
- 🟡 Event (seasonal tours)

### 📋 SEO Checklist for BookingIncatrail

**Database Optimization:**
- [ ] All `meta_title` fields: 55-60 chars with year + location
- [ ] All `meta_description`: 150-160 chars with CTA
- [ ] All `slug` fields: lowercase, hyphens, keywords
- [ ] All images in `gallery` have descriptive `alt` text

**Pages to Optimize:**
- [ ] Tour pages: `/[category]/[slug].js`
- [ ] Category pages: `/[category].js`
- [ ] Blog posts: `/blog/[slug].js`
- [ ] Homepage: `/index.js`

**Technical SEO:**
- [ ] Add hreflang tags for ES/EN versions
- [ ] Create comprehensive robots.txt
- [ ] Optimize Core Web Vitals (LCP < 2.5s)
- [ ] Add LocalBusiness schema to footer

**Content Strategy:**
- [ ] Blog: "Complete Inca Trail Guide 2026"
- [ ] Blog: "Inca Trail vs Salkantay Comparison"
- [ ] Blog: "Best Time to Visit Machu Picchu"
- [ ] Add FAQs to all tour pages

### 📍 Local SEO Setup

**LocalBusiness Schema Example:**
```json
{
  "@type": "TravelAgency",
  "name": "BookingIncatrail",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Cusco",
    "addressRegion": "Cusco",
    "addressCountry": "PE"
  },
  "telephone": "+51970811976",
  "priceRange": "$$",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "8900"
  }
}
```

### 🌐 Bilingual SEO

**Hreflang Implementation Needed:**
```html
<link rel="alternate" hreflang="es" href="https://bookingincatrail.com/es/..." />
<link rel="alternate" hreflang="en" href="https://bookingincatrail.com/en/..." />
<link rel="alternate" hreflang="x-default" href="https://bookingincatrail.com/..." />
```

### 📊 Priority Actions

**Week 1 - Critical:**
1. Audit all tour meta_titles (add year + location)
2. Add alt text to images missing descriptions
3. Implement FAQPage schema in CategoryFAQs

**Week 2 - High Impact:**
4. Add Review schema to testimonials
5. Implement LocalBusiness schema
6. Configure hreflang tags

**Week 3 - Optimization:**
7. Create robots.txt
8. Optimize meta descriptions
9. Build internal linking strategy

### 🚀 How to Use This Skill

Since this is a local custom skill, invoke it by saying:

**Examples:**
- "Use the seo-optimizer skill to audit tour pages"
- "Based on seo-optimizer, add FAQPage schema to CategoryFAQs"
- "Apply seo-optimizer recommendations to improve meta titles"
- "Analyze SEO according to the skill for blog posts"

I will read this file and apply the guidelines to your BookingIncatrail project.
