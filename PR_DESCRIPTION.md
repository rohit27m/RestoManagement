# Pull Request: Add Dark Mode Theme Switcher and Improve Text Contrast

## 🎨 Summary
This PR adds a complete dark mode theme implementation with improved text contrast across all dashboard pages.

## ✨ Features Added
- **Theme Context**: Global theme state management with localStorage persistence
- **Theme Toggle Button**: Easy switch between light and dark modes with animated icons
- **Dark Mode Support**: Full dark mode styling for:
  - Waiter Dashboard
  - Chef Dashboard
  - All UI components (headers, cards, buttons, tables, orders)
- **Improved Contrast**: Enhanced text visibility in both light and dark themes
- **Persistent Preference**: Theme choice saved to localStorage

## 🔧 Technical Changes
### New Files
- `client/app/context/ThemeContext.tsx` - Theme state management
- `client/app/components/ThemeToggle.tsx` - Theme switcher component

### Modified Files
- `client/app/layout.tsx` - Added ThemeProvider wrapper
- `client/app/globals.css` - Updated dark mode CSS variables
- `client/app/waiter/page.tsx` - Added dark mode classes throughout
- `client/app/chef/page.tsx` - Added dark mode classes throughout

## 🎯 Key Improvements
1. **Better Readability**: Text now has proper contrast against backgrounds in both themes
2. **Professional UI**: Smooth transitions between light and dark modes
3. **User Experience**: Theme preference persists across sessions
4. **Accessibility**: Better color contrast ratios for improved readability

## 📸 Visual Changes
### Light Mode (Existing)
- Clean slate gray theme with white backgrounds
- Dark text on light backgrounds

### Dark Mode (New)
- Deep slate backgrounds (#0f172a)
- Light text (#f1f5f9) for excellent contrast
- Subtle borders and shadows for depth

## 🧪 Testing
- [x] Theme toggles correctly on both dashboards
- [x] Theme persists after page reload
- [x] All text elements are readable in both modes
- [x] All buttons and interactive elements work correctly
- [x] Responsive design maintained in both themes

## 🚀 How to Test
1. Login to the application
2. Navigate to Waiter or Chef dashboard
3. Click the theme toggle button (🌙 / ☀️) in the header
4. Verify all text is clearly visible
5. Reload the page - theme should persist
6. Test all interactive elements (tables, orders, buttons)

## 📝 Notes
- Theme toggle appears next to logout button on all dashboards
- Default theme is light mode
- Theme preference stored in browser localStorage
- Tailwind's dark mode classes used throughout

## ✅ Checklist
- [x] Code follows project style guidelines
- [x] All text has proper contrast in both themes
- [x] Theme preference persists correctly
- [x] No console errors or warnings
- [x] Responsive design works in both themes
- [x] All existing functionality preserved

## 🔗 Related Issues
Fixes: User reported text visibility issues in dashboards

---

**Ready to merge**: This PR is ready for review and can be merged into `master` after approval.
