# Enterprise Design System (DESIGN_SYSTEM)

## Smart Recruitment & Applicant Tracking System (ATS)

**Document Version:** 2.0.0  
**Status:** Approved Engineering Standard  
**Framework:** Tailwind CSS v3+ with Custom Enterprise Tokens  
**Typography:** Inter / SF Pro Display System Font Stack  

---

## 1. Color Palette & Semantic Design Tokens

The color system is engineered for high-density enterprise software. It avoids hyper-saturated primary tones in favor of an authoritative, refined Deep Indigo and Slate neutral architecture.

### 1.1 Neutral Palette (Slate)
Neutral tones form 80% of the UI surface area, controlling background, borders, and typography.

| Token | Light Value | Dark Value | Typical Usage |
| :--- | :--- | :--- | :--- |
| `neutral-50` | `#F8FAFC` | `#0B0F17` | Light: App body background / Dark: Surface hover |
| `neutral-100` | `#F1F5F9` | `#111827` | Light: Subtle panel background / Dark: Base background |
| `neutral-200` | `#E2E8F0` | `#1E293B` | Borders, dividers, subtle outlines |
| `neutral-300` | `#CBD5E1` | `#334155` | Form input borders, inactive icon fills |
| `neutral-400` | `#94A3B8` | `#64748B` | Placeholder text, secondary metadata |
| `neutral-500` | `#64748B` | `#94A3B8` | Secondary icons, inactive tab labels |
| `neutral-600` | `#475569` | `#CBD5E1` | Supporting body text, breadcrumbs |
| `neutral-700` | `#334155` | `#E2E8F0` | Primary labels, table column headers |
| `neutral-800` | `#1E293B` | `#F1F5F9` | Card headers, primary text in light mode |
| `neutral-900` | `#0F172A` | `#FFFFFF` | Highest-emphasis text, display headings |

---

### 1.2 Brand & Primary Palette (Enterprise Cobalt / Indigo)
The primary accent color represents focus, action, and system intelligence.

| Token | Hex Value | Usage |
| :--- | :--- | :--- |
| `primary-50` | `#EEF2FF` | Active row tint, light badge background |
| `primary-100` | `#E0E7FF` | Selected card highlight border |
| `primary-200` | `#C7D2FE` | Focus ring glow |
| `primary-500` | `#4F46E5` | Active toggle, interactive icons |
| `primary-600` | `#4338CA` | Primary button fill, active tab indicator |
| `primary-700` | `#3730A3` | Primary button hover state |
| `primary-900` | `#1E1B4B` | Dark theme active item background |

---

### 1.3 Semantic Feedback Palettes

#### Success (Hired, Accepted, Verified, Pass)
* `success-50`: `#ECFDF5` (Light background)
* `success-500`: `#10B981` (Icons, checkmarks)
* `success-600`: `#059669` (Dark text, button accents)
* `success-700`: `#047857` (High-contrast text)

#### Warning (Action Required, Expiring Soon, Pending Review)
* `warning-50`: `#FFFBEB`
* `warning-500`: `#F59E0B`
* `warning-600`: `#D97706`
* `warning-700`: `#B45309`

#### Danger / Destructive (Rejected, Withdrawn, Expired, Error)
* `danger-50`: `#FEF2F2`
* `danger-500`: `#EF4444`
* `danger-600`: `#DC2626`
* `danger-700`: `#B91C1C`

#### Info / Stage Accent (Scheduled, In Review)
* `info-50`: `#F0F9FF`
* `info-500`: `#0284C7`
* `info-600`: `#0369A1`

---

### 1.4 Recruitment Pipeline Stage Badges Token Map

| Application Stage | Background Token | Text Token | Border Token |
| :--- | :--- | :--- | :--- |
| `APPLIED` | `bg-neutral-100 dark:bg-neutral-800` | `text-neutral-700 dark:text-neutral-300` | `border-neutral-200 dark:border-neutral-700` |
| `SCREENING` | `bg-blue-50 dark:bg-blue-950/40` | `text-blue-700 dark:text-blue-300` | `border-blue-200 dark:border-blue-800` |
| `INTERVIEW_SCHEDULED` | `bg-indigo-50 dark:bg-indigo-950/40` | `text-indigo-700 dark:text-indigo-300` | `border-indigo-200 dark:border-indigo-800` |
| `INTERVIEW_COMPLETED` | `bg-purple-50 dark:bg-purple-950/40` | `text-purple-700 dark:text-purple-300` | `border-purple-200 dark:border-purple-800` |
| `OFFERED` | `bg-amber-50 dark:bg-amber-950/40` | `text-amber-700 dark:text-amber-300` | `border-amber-200 dark:border-amber-800` |
| `ACCEPTED` | `bg-emerald-50 dark:bg-emerald-950/40` | `text-emerald-700 dark:text-emerald-300` | `border-emerald-200 dark:border-emerald-800` |
| `ONBOARDING` | `bg-teal-50 dark:bg-teal-950/40` | `text-teal-700 dark:text-teal-300` | `border-teal-200 dark:border-teal-800` |
| `HIRED` | `bg-green-100 dark:bg-green-950` | `text-green-800 dark:text-green-200` | `border-green-300 dark:border-green-700` |
| `REJECTED` | `bg-rose-50 dark:bg-rose-950/40` | `text-rose-700 dark:text-rose-300` | `border-rose-200 dark:border-rose-800` |
| `WITHDRAWN` | `bg-neutral-100 dark:bg-neutral-800` | `text-neutral-500 dark:text-neutral-400` | `border-neutral-200 dark:border-neutral-700` |

---

## 2. Typography Hierarchy

The type system utilizes `Inter` as the primary sans-serif typeface, falling back to Apple SF Pro Display and system fonts.

```
Font Family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
```

| Scale Token | Font Size | Line Height | Letter Spacing | Weight | Typical Application |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `text-xs` | 12px (0.75rem) | 16px (1.0rem) | `+0.01em` | 500 / 600 | Badges, timestamps, helper labels, table headers |
| `text-sm` | 14px (0.875rem) | 20px (1.25rem) | `0em` | 400 / 500 | Standard body, table cells, form inputs, button text |
| `text-base` | 16px (1.0rem) | 24px (1.5rem) | `-0.01em` | 400 / 500 | Modals, prominent candidate cards, callout text |
| `text-lg` | 18px (1.125rem) | 28px (1.75rem) | `-0.015em` | 600 | Card titles, section headers, drawer titles |
| `text-xl` | 20px (1.25rem) | 28px (1.75rem) | `-0.02em` | 600 | Page subheadings, score breakdown headers |
| `text-2xl` | 24px (1.5rem) | 32px (2.0rem) | `-0.025em` | 700 | Primary page titles (e.g. "Software Engineer Requisition") |
| `text-3xl` | 30px (1.875rem) | 36px (2.25rem) | `-0.03em` | 700 | Analytics hero statistics (e.g. "21.4 Days") |

---

## 3. Spacing Scale & Elevation Tokens

### 3.1 Spacing Grid
The design system operates on an 8-point baseline grid with a 4-point micro-scale:
* `p-1` / `m-1`: 4px (micro badges, inline tags)
* `p-2` / `m-2`: 8px (compact table padding, tight button padding)
* `p-3` / `m-3`: 12px (standard button padding, input internal padding)
* `p-4` / `m-4`: 16px (card interior padding, table cell vertical padding)
* `p-6` / `m-6`: 24px (section margins, modal container padding)
* `p-8` / `m-8`: 32px (page level gutter padding)

### 3.2 Border Radius
* `rounded-sm`: 4px (Status badges, tags, micro buttons)
* `rounded-md`: 6px (Form inputs, standard buttons, dropdown menus)
* `rounded-lg`: 8px (Cards, modal dialogues, slide-over panels)
* `rounded-xl`: 12px (Kanban column containers, hero callouts)
* `rounded-full`: 9999px (User avatar pills, counter badges)

### 3.3 Elevation & Shadows
Shadows in this system are crisp and understated. Blurred diffuse drop-shadows are avoided.
* **Elevation 1 (Card / Dropdown):**
  * Light: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
  * Dark: `0 0 0 1px rgba(255, 255, 255, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.3)`
* **Elevation 2 (Dragged Card / Popover):**
  * Light: `0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04)`
  * Dark: `0 0 0 1px rgba(255, 255, 255, 0.1), 0 4px 12px rgba(0, 0, 0, 0.5)`
* **Elevation 3 (Modal / Slide-Over Drawer):**
  * Light: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)`
  * Dark: `0 0 0 1px rgba(255, 255, 255, 0.1), 0 20px 30px rgba(0, 0, 0, 0.7)`

---

## 4. UI Component Specifications

### 4.1 Buttons
* **Primary Button:**
  * Style: `bg-primary-600 hover:bg-primary-700 text-white font-medium text-sm px-4 py-2 rounded-md transition-colors shadow-sm`
  * Focus: `focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`
* **Secondary Button:**
  * Style: `bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-600 font-medium text-sm px-4 py-2 rounded-md transition-colors shadow-sm`
* **Destructive Button:**
  * Style: `bg-danger-600 hover:bg-danger-700 text-white font-medium text-sm px-4 py-2 rounded-md transition-colors`
* **Ghost / Icon Button:**
  * Style: `text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 p-1.5 rounded-md transition-colors`

### 4.2 Form Inputs & Controls
* **Text Input:**
  * Height: 36px (compact) or 40px (default)
  * Border: `border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm rounded-md`
  * Focus Ring: `focus:border-primary-500 focus:ring-1 focus:ring-primary-500`
  * Error State: `border-danger-500 focus:border-danger-500 focus:ring-danger-500 text-danger-900`
* **File Dropzone (Resume Upload):**
  * Border: `border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-primary-500 dark:hover:border-primary-500 rounded-lg p-6 text-center bg-neutral-50 dark:bg-neutral-900/50 transition-colors cursor-pointer`
  * Icon: Document upload icon (`w-8 h-8 text-neutral-400 mx-auto mb-2`)
  * Instruction: "Drag and drop your resume here, or **browse** (PDF, DOCX up to 5MB)"

### 4.3 Data Table Primitive
* **Header Row:** `bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-neutral-500 uppercase tracking-wider py-3 px-4`
* **Body Rows:** `border-b border-neutral-100 dark:border-neutral-800/60 hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors text-sm py-3 px-4`
* **Row Height:** 48px fixed to guarantee scan speed.

---

## 5. Tailwind CSS Token Configuration (`tailwind.config.js` snippet)

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        neutral: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#0B0F17',
        },
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          500: '#4F46E5',
          600: '#4338CA',
          700: '#3730A3',
          900: '#1E1B4B',
        },
        success: {
          50: '#ECFDF5',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
        warning: {
          50: '#FFFBEB',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        danger: {
          50: '#FEF2F2',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        elevated: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
        drawer: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
      },
      transitionDuration: {
        DEFAULT: '150ms',
      },
    },
  },
  plugins: [],
};
```
