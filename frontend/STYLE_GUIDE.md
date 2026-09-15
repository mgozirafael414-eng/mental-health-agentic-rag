# 🎨 MindCare UI Style Guide

## Modern ChatGPT-Inspired Design System

This document outlines the visual design system and styling approach for MindCare's modern, professional interface.

---

## Color Palette

### Primary Gradient
- **Start**: `#667eea` (Indigo)
- **End**: `#764ba2` (Purple)
- Used for: Buttons, headers, gradients, interactive elements
- **Hover Effect**: Slightly more saturated and elevated

### Neutrals
- **Background**: `#ffffff` (White)
- **Surface**: `#f9fafb` (Light Gray)
- **Border**: `#e5e7eb` (Medium Gray)
- **Text**: `#1f2937` (Dark Gray)
- **Muted**: `#9ca3af` (Light Gray Text)

### Semantic Colors
- **Success**: `#10b981` (Green)
- **Error**: `#dc2626` (Red)
- **Info**: `#0284c7` (Blue)
- **Warning**: `#f59e0b` (Amber)

### Gradients
```css
/* Primary Gradient */
linear-gradient(135deg, #667eea, #764ba2)

/* Accent Background */
linear-gradient(135deg, #e0e7ff, #f3e8ff)

/* Background Fade */
linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)
```

---

## Typography

### Font Stack
```css
font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Heading Hierarchy
- **H1** (32px): Dashboard welcome, page titles
- **H2** (24px): Section headers
- **H3** (18px): Card titles, subsection headers
- **Body** (15px): Main text content
- **Small** (13px): Secondary text, labels
- **Tiny** (11px): Captions, hints

### Font Weights
- **400**: Regular text
- **600**: Labels, secondary headers
- **700**: Headers, buttons, emphasis

---

## Spacing System

Based on 4px grid:
- **xs**: 4px
- **sm**: 8px
- **md**: 12px
- **lg**: 16px
- **xl**: 20px
- **2xl**: 24px
- **3xl**: 32px

---

## Component Styles

### Buttons

#### Primary Button (Gradient)
```css
background: linear-gradient(135deg, #667eea, #764ba2);
color: white;
border-radius: 12px;
padding: 10px 16px;
font-weight: 600;
box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
transition: all 0.2s ease;

&:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(102, 126, 234, 0.4);
}
```

#### Secondary Button
```css
background: white;
border: 1px solid #d1d5db;
color: #6b7280;
border-radius: 12px;
transition: all 0.2s ease;

&:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}
```

### Cards

#### Modern Card Style
```css
background: white;
border: 1px solid #e5e7eb;
border-radius: 16px;
padding: 20px;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

&:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
}
```

### Input Fields

#### Text Input / Textarea
```css
background: white;
border: 1px solid #d1d5db;
border-radius: 12px;
padding: 10px;
font-size: 14px;
transition: all 0.2s ease;

&:focus {
  border-color: #667eea;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.15);
  outline: 0;
}
```

---

## Chat Interface

### Message Bubble Styles

#### User Message
```css
background: linear-gradient(135deg, #667eea, #764ba2);
color: white;
border-radius: 18px 18px 4px 18px;
padding: 14px 16px;
box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
max-width: 80%;
```

#### Assistant Message
```css
background: white;
color: #374151;
border: 1px solid #e5e7eb;
border-radius: 18px 18px 18px 4px;
padding: 14px 16px;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
max-width: 80%;
```

### Typing Indicator
```css
@keyframes typingAnimation {
  0%, 60%, 100% {
    opacity: 0.3;
    transform: translateY(0);
  }
  30% {
    opacity: 1;
    transform: translateY(-8px);
  }
}
```

### Chat Header
```css
height: 72px;
background: white;
border-bottom: 1px solid #f0f0f0;
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
display: flex;
align-items: center;
justify-content: space-between;
```

---

## Dashboard Components

### Welcome Section
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
box-shadow: 0 20px 60px rgba(102, 126, 234, 0.4);
border-radius: 20px;
padding: 42px 48px;
color: white;
position: relative;
overflow: hidden;
```

### Tool Cards
- **Grid**: 4 columns on desktop, responsive on mobile
- **Gap**: 20px
- **Card Style**: Modern with top gradient border on hover
- **Icon**: 50px x 50px with rounded background

---

## Sidebar Styling

### Conversation Panel
```css
width: 300px;
background: #f9fafb;
border-right: 1px solid #e5e7eb;
box-shadow: 2px 0 8px rgba(0, 0, 0, 0.03);
```

### Conversation Item (Active)
```css
background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.1));
border-left: 3px solid #667eea;
border-radius: 12px;
```

---

## Animations & Transitions

### Standard Transition
```css
transition: all 0.2s ease;
```

### Hover Lift Effect
```css
transform: translateY(-2px);
```

### Smooth Scroll
```css
scroll-behavior: smooth;
```

### Button Press
```css
active {
  transform: translateY(0);
}
```

---

## Shadows

### Elevation Levels
```css
/* Shadow 1 - Subtle */
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

/* Shadow 2 - Medium */
box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

/* Shadow 3 - Large */
box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);

/* Shadow 4 - XL (Gradients) */
box-shadow: 0 20px 60px rgba(102, 126, 234, 0.4);
```

---

## Status & Alert Styles

### Error Banner
```css
background: linear-gradient(135deg, #fef2f2, #fee2e2);
border-top: 1px solid #fecaca;
border-bottom: 2px solid #dc2626;
```

### Success Alert
```css
background: #d1fae5;
color: #059669;
border-color: #a7f3d0;
```

### Info Alert
```css
background: #f0f9ff;
border-color: #bae6fd;
```

---

## Responsive Design

### Breakpoints
- **Desktop**: 1024px and above (4-column layouts)
- **Tablet**: 768px - 1023px (2-column layouts)
- **Mobile**: Below 768px (1-column, hidden sidebar)

### Key Changes
- Sidebar hides on mobile
- Grid adapts to 2-3 columns
- Chat takes full width
- Touch-friendly button sizes (44px minimum)

---

## Dark Mode Ready

The color system is designed to be easily adaptable for dark mode:
- Primary gradients remain consistent
- Backgrounds invert (white → dark gray)
- Text colors invert (dark → light)
- Shadows increase in opacity

---

## Usage Examples

### Creating a New Styled Component
```jsx
const StyledContainer = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  }
`;
```

### Button with Gradient
```jsx
<button className="primary-button">
  <Icon size={16} />
  Start Conversation
</button>
```

---

## Performance Considerations

- Gradients are GPU-accelerated on modern browsers
- Transitions use `transform` and `opacity` (performant properties)
- Shadows use `box-shadow` (not `filter` for better performance)
- Animations use 60fps-optimized transforms
- No animation-delay > 0.4s to prevent perception of lag

---

## Accessibility

### Color Contrast
- All text meets WCAG AA standards (4.5:1 minimum)
- Error states use color + icons
- Focus states are clearly visible

### Touch Targets
- Minimum 44px x 44px for interactive elements
- Adequate spacing to prevent accidental taps

### Keyboard Navigation
- All interactive elements are focusable
- Focus indicators are clearly visible
- Tab order follows logical flow

---

## Browser Support

- **Chrome**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Safari**: Latest 2 versions
- **Edge**: Latest 2 versions

All modern CSS features (flexbox, grid, gradients) are supported.

---

Generated: 2026-09-12
