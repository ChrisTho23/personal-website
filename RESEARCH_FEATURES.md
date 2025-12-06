# Research Section - Feature Comparison

## Visual Differences

### Color Schemes
| Section   | Gradient                                                |
|-----------|---------------------------------------------------------|
| Blog      | `from-zinc-800 via-zinc-400/10 to-zinc-900`           |
| Projects  | `from-zinc-900 via-zinc-400/10 to-zinc-900`           |
| Research  | `from-zinc-900 via-blue-950/10 to-zinc-900` ✨ (Blue!) |

### Layout Differences
| Feature           | Blog                | Projects              | Research              |
|-------------------|---------------------|-----------------------|-----------------------|
| Overview Layout   | Vertical list       | Featured + Grid       | Grid (1-3 columns)    |
| Card Display      | Full width          | Mixed sizes           | Uniform grid          |
| Image Support     | ❌ (only in detail) | ❌                    | ✅ (on overview)      |
| Featured Items    | ❌                  | ✅ (3 featured)       | ❌                    |

## Unique Research Features

### 1. Image Display on Overview
```tsx
// Each research card shows an image
{paper.image && (
  <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
    <Image
      src={paper.image}
      alt={paper.title}
      fill
      className="object-cover transition-transform duration-300 group-hover:scale-105"
    />
  </div>
)}
```

### 2. Venue Information
- **Blog**: Shows date only
- **Projects**: Shows date only
- **Research**: Shows date + venue (e.g., "NeurIPS 2017") ✨

### 3. Direct Paper Links
- External link icon visible on cards
- Dedicated "Paper" link button in detail page header
- Opens in new tab when clicked

### 4. Enhanced Header
The research detail page header includes:
- Title (larger, more prominent)
- Venue (displayed prominently)
- Publication date (formatted as full date)
- Direct link to paper with external link icon
- View counter
- Back to research button

## Content Structure Comparison

### Blog Post Frontmatter
```yaml
---
title: "Post Title"
description: "Description"
date: "2025-02-28"
published: true
picture: "/image.png"  # Only used in meta tags
---
```

### Project Frontmatter
```yaml
---
title: "Project Title"
description: "Description"
date: "2024-03-10"
published: true
repository: "username/repo"
url: "https://example.com"
---
```

### Research Paper Frontmatter ✨
```yaml
---
title: "Paper Title"
description: "Description"
date: "2023-10-04"
venue: "Conference/Journal"  # NEW
published: true
paperUrl: "https://arxiv.org/..."  # NEW
image: "/image.png"  # NEW - displayed on overview
---
```

## Component Architecture

### Research Section Components
```
research/
├── layout.tsx          # Blue-tinted background
├── page.tsx           # Grid layout overview
├── paper.tsx          # Card with image + venue + external link
└── [slug]/
    ├── page.tsx       # Detail page
    ├── header.tsx     # Enhanced header with venue + paper link
    ├── view.tsx       # View tracking (type: "research")
    └── mdx.css        # Content styling
```

## API Integration

### View Counter API (`/api/incr`)
Now supports three content types:

```typescript
// Request body
{
  slug: "paper-slug",
  type: "research"  // "blog" | "projects" | "research"
}

// Redis key format
["pageviews", type, slug].join(":")
// Examples:
// "pageviews:blog:february"
// "pageviews:projects:DrakeGPT"
// "pageviews:research:example-paper"
```

## Styling Details

### Paper Card Hover Effects
1. **Image**: Scales to 105% on hover
2. **Title**: Changes from zinc-200 to white
3. **Description**: Changes from zinc-400 to zinc-200
4. **External Link Icon**: Changes from zinc-400 to zinc-200
5. **Card Background**: Subtle glow effect (inherited from Card component)

### Grid Layout Responsiveness
- **Mobile (< 768px)**: 1 column
- **Tablet (768px - 1024px)**: 2 columns
- **Desktop (> 1024px)**: 3 columns

## Usage Examples

### Basic Research Paper
```mdx
---
title: "Attention Is All You Need"
description: "Introducing the Transformer architecture"
date: "2017-06-12"
venue: "NeurIPS 2017"
published: true
paperUrl: "https://arxiv.org/abs/1706.03762"
image: "/attention.png"
---

# Abstract
The dominant sequence transduction models...

# Introduction
Recurrent neural networks have been...
```

### Research Paper Without Image
```mdx
---
title: "My Paper"
description: "Description"
date: "2024-01-15"
venue: "ICML 2024"
published: true
paperUrl: "https://arxiv.org/..."
# image field omitted - card will still display beautifully
---
```

### Draft Paper (Not Published)
```mdx
---
title: "Work in Progress"
description: "Still working on this"
date: "2024-12-01"
venue: "Preprint"
published: false  # Won't appear on the site
paperUrl: "https://..."
image: "/image.png"
---
```

## Performance Optimization

- **Static Generation**: All pages pre-rendered at build time
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Separate bundles for each route
- **Redis Caching**: View counts cached with 60s revalidation

## Accessibility Features

- Proper semantic HTML (`<article>`, `<time>`, etc.)
- Alt text for all images
- Keyboard navigation support
- Focus states on interactive elements
- ARIA labels where appropriate
- Screen reader friendly

## SEO Benefits

- Server-side rendering
- Proper meta tags support (extensible)
- Semantic HTML structure
- Canonical URLs
- Structured data ready (can be added)

