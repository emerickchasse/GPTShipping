---
version: "alpha"
name: PawSwipe
description: "A warm, practical pet-person storefront introducing an original made-to-order bandana without launch theatre."
colors:
  primary: "#1D5B49"
  on-primary: "#FFFFFF"
  background: "#FAF8F3"
  surface: "#FFFFFF"
  foreground: "#18332B"
  muted: "#E9F0EA"
  muted-foreground: "#4B6259"
  border: "#C9D6CD"
  focus-ring: "#C85A3B"
typography:
  h1:
    fontFamily: "Georgia, serif"
    fontSize: 3.5rem
    fontWeight: 700
    lineHeight: 1.02
  h2:
    fontFamily: "Georgia, serif"
    fontSize: 2.25rem
    fontWeight: 700
    lineHeight: 1.12
  body-md:
    fontFamily: "Arial, sans-serif"
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Arial, sans-serif"
    fontSize: 0.875rem
    fontWeight: 700
    lineHeight: 1.25
rounded:
  sm: 8px
  md: 16px
  lg: 28px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "14px 20px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
---

## Overview

Use a calm, tactile, capable feel. The interface should be friendly to pet owners without looking childish. Avoid artificial urgency, health claims, and fake review counts.

## Colors

Reserve green for primary actions and success. Clay is a focus/accent color only. Use dark green text on cream or white backgrounds for accessible reading.

## Typography

Use a serif display face for short headings and a neutral sans serif for body copy. Keep scanning easy and copy concrete.

## Layout

Use a centered 1160px maximum content width, fluid mobile gutters, and generous 24–40px vertical rhythm. Collapse multi-column content to one column at narrow widths.

## Elevation & Depth

Use restrained borders and soft shadows on product cards. Never use glass effects.

## Components

Buttons require visible keyboard focus, hover and disabled states. Cart interactions must announce changes to assistive technology. Email forms require an explicit error/success message.

## Open Questions

Sample quality, exact USD offer, regions, delivery window, support contact, care guidance, and legal policy wording must be verified before launch.
