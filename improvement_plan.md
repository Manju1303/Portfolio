# Portfolio Improvement Plan

## 1. Responsiveness & Flexibility

### Profile Card Overflow
- **Issue**: The `.profile-card` has a fixed `width: 340px`, which causes horizontal overflow on screens smaller than 360px (like iPhone SE).
- [x] **Fix**: Change `width: 340px` to `width: 100%` and `max-width: 340px`.

### Project Card Content Overflow
- **Issue**: The `.project-flip-card` has a fixed `aspect-ratio: 16/9`. On mobile, this makes the card very short, making it impossible to read the features and tech stack on the back side.
- [x] **Fix**: Change `aspect-ratio` to `auto` on mobile and add `min-height: 320px`.

### Hero Section Alignment
- **Issue**: On mobile, the hero content is centered, but the `hero-bio` might still feel off if not properly constrained.
- [x] **Fix**: Ensure `hero-bio` has `max-width: 100%` and consistent centering.

### Typography
- **Issue**: Fixed font sizes for hero title (`5rem` -> `3rem`) can be abrupt.
- [x] **Fix**: Use `clamp(2.5rem, 8vw, 5rem)` for the hero title.

## 2. Alignment & Spacing

### Container Padding
- **Adjustment**: Ensure consistent horizontal padding across all sections on mobile.

### Floating Badges
- **Adjustment**: Hide or reposition floating badges that overlap content on small screens.

## 3. Implementation Steps

1.  Modify `styles.css` to update `.profile-card` width.
2.  Update `.project-flip-card` aspect ratio in the mobile media query.
3.  Implement `clamp()` for `.hero-title`.
4.  Refine `.hero-bio` centering and width.
5.  Test the mobile menu transition.
