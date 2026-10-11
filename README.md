# behrorsolar
Behror Solar
test
test2
test3
finaltest

## CSS editing and publishing

Keep editing the readable CSS sources:

- `style.css` contains shared site styles.
- `css/solar-system-base.css` contains the common 3/5/10 kW component styles.
- The other `css/*.css` files contain styles for the matching page. Files ending in `.min.css` are generated assets.

After changing CSS, run from this folder:

```text
python tools/build_css.py
```

The builder uses Python 3's standard library, generates the minified stylesheets and updates their content-based version in the HTML links. No package installation or framework is required. Publish the updated HTML together with its `.min.css` assets, preserving the `css/` directory. Keep the readable sources and builder in GitHub for future edits. The builder is excluded from Cloudflare static assets by `.assetsignore`.

All pages share the section spacing, heading spacing, heading width and heading line-height variables in `style.css`. Section spacing is 48px above and below at wider widths and 28px through 768px; heading spacing is 28px / 24px. Compact utility strips retain their own spacing. Run responsive checks when changing these variables or shared components.
