# Unchained Experience — Website

Kenya-based tours, travel and flight booking company website. Plain HTML/CSS/JS, deployed to Vercel with a serverless function for form handling.

## Structure
```
/
├── index.html          Home
├── about.html           About Us
├── flights.html          Flight Booking
├── gallery.html          Gallery
├── blog.html             Travel Tips
├── contact.html          Contact
├── css/style.css
├── js/main.js
├── api/enquiry.js        Vercel serverless function (form submissions)
├── assets/logo.jpg
├── robots.txt
├── sitemap.xml
└── vercel.json
```

## Deploy to Vercel (free)

1. Push this folder to a GitHub repo.
2. Go to vercel.com → New Project → import the repo. No build step needed (static site).
3. Deploy. You'll get a free URL like `unchained-experience.vercel.app`.

## Make the contact form actually send emails

The enquiry form posts to `/api/enquiry`, which currently logs submissions to Vercel's function logs and returns success — the frontend also has a WhatsApp fallback if the API fails. To get real emails:

1. Sign up free at https://resend.com (no credit card needed, 100 emails/day free).
2. Get an API key.
3. In Vercel: Project → Settings → Environment Variables → add `RESEND_API_KEY` with that value.
4. Redeploy. Enquiries will now email to official.unchainedexperience@gmail.com.

Without this step, the site still works — WhatsApp is the fallback every form uses if the API doesn't respond.

## Getting found on Google (free)

1. After deploying, go to https://search.google.com/search-console
2. Add your Vercel URL as a property.
3. Submit `https://yourdomain.vercel.app/sitemap.xml` under Sitemaps.
4. Google will start crawling within days. Indexing can take 1–3 weeks.

## Updating content later

- **Photos**: replace files in `/assets/` or swap the Unsplash URLs in the HTML for your own uploaded images.
- **Destinations/packages**: edit the `.tour-card` blocks in `index.html`.
- **Contact info**: WhatsApp/phone number appears in multiple places — search for `254750625490` across files to update everywhere at once.

## Custom domain (optional, paid)

Buy a domain (e.g. unchainedexperience.com) from any registrar, then in Vercel: Project → Settings → Domains → add it and follow the DNS instructions. Typically $10–15/year.
