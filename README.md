# Behror Solar

Official website source for [Behror Solar](https://behrorsolar.in/), the local digital platform of Global Green Energy for rooftop solar, battery storage and practical solar information in Rajasthan.

Global Green Energy is an authorised Tata Power Solaroof channel partner. Behror Solar is owned and managed by Mahendra Yadav, a partner in Global Green Energy.

Our work serves homeowners and businesses in Behror, Neemrana and surrounding areas across Kotputli–Behror, Alwar and Khairthal–Tijara districts.

## Website

Visit **[BehrorSolar.in](https://behrorsolar.in/)** for solar solutions, installation enquiries and practical guides.

The website covers:

- Residential rooftop solar and system sizing.
- Commercial and industrial rooftop solar.
- On-grid and hybrid solar systems.
- Battery storage and backup power.
- PM Surya Ghar information and application guidance.
- Solar equipment, warranties and maintenance.
- Field observations, generation reports and battery testing.

## Explore our solar resources

- [Residential rooftop solar](https://behrorsolar.in/solar-panels-behror-neemrana)
- [Commercial solar](https://behrorsolar.in/commercial-solar)
- [Hybrid solar systems](https://behrorsolar.in/hybrid-solar-behror-neemrana)
- [Solar battery storage](https://behrorsolar.in/solar-battery)
- [PM Surya Ghar guide](https://behrorsolar.in/pm-surya-ghar)
- [Solar guides and field observations](https://behrorsolar.in/solar-guides)

## About this repository

This repository contains the website's HTML pages, CSS, JavaScript,
images and supporting files.

The site uses a lightweight static structure. Its content includes
solar solution pages, local service information, educational articles
and documented field observations.

### Main files and directories

| Path | Purpose |
|---|---|
| `index.html` | Homepage |
| `*.html` | Solution pages, guides and other website pages |
| `hi/` | Hindi website content |
| `style.css` | Shared website styles |
| `css/` | Component and page styles |
| `site.js` | Shared website JavaScript |
| `images/` | Website images |
| `tools/` | Maintenance and build utilities |
| `robots.txt` | Crawler directives |
| `sitemap*.xml` | Website sitemaps |
| `wrangler.jsonc` | Cloudflare configuration |

## CSS editing and publishing

Edit the readable CSS source files:

- `style.css` contains shared site styles.
- `css/solar-system-base.css` contains common 3/5/10 kW component styles.
- Other `css/*.css` files contain styles for their matching pages.
- Files ending in `.min.css` are generated assets.

After changing CSS, run this command from the repository root:

```bash
python tools/build_css.py
```

The builder uses Python 3's standard library, generates minified
stylesheets and updates their content-based versions in HTML links.
No additional Python packages are required.

Publish the updated HTML together with its `.min.css` assets,
preserving the `css/` directory. Keep the readable sources and builder
in the repository for future edits.

The builder is excluded from Cloudflare static assets by
`.assetsignore`.

Shared spacing and heading variables are maintained in `style.css`.
Check desktop and mobile layouts after changing shared styles or
components.

## Content accuracy

Keep published specifications, prices, scheme information and
performance claims tied to their supporting sources and dates.

Field reports should distinguish measured results from estimates.
Solar production readings should not be presented as verified
household consumption, grid import or grid export unless those
quantities were separately measured.

## Enquiries and corrections

For solar installation enquiries, visit
[Behror Solar](https://behrorsolar.in/).

For website errors or technical suggestions, open an issue in this
repository. Do not include private customer information in public
issues.
