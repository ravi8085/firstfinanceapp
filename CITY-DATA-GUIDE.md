# City prices: source and activation

## What was there before
The supplied `investmentData.ts` contains fixed example budgets and locality ranges. It records no provider, observation dates, sample sizes or average/minimum methodology. They are not verified market data. The calculator and City expenses page no longer read those amounts. Older unused components/data remain for reference only.

## What is connected in the code
Numbeo city_prices API: https://www.numbeo.com/api/cost-of-living-api
API plans/license: https://www.numbeo.com/common/api.jsp
These are crowd-reported city averages and ranges, not verified rental transactions, government minimum rents or a customer's actual bills. Confirm your license permits the public display/redistribution used by this app before activation. No paid subscription or account has been created for you.

The checked-in `public/data/city-prices.json` is intentionally empty. No external subscription, key, repository deployment or scheduled job has been activated in this workspace. Until activation, users see “not connected” and enter their own expenses. There is no fabricated fallback.

## Activate daily updates
1. Obtain a Numbeo API plan/key with rights covering public app display and the required cities. Daily refresh makes 14 requests per day (roughly 420–434/month), plus manual and deployment runs; choose a quota accordingly. Confirm pricing with the provider.
2. Add the project to your GitHub repository. Keep private credentials out of the repository and downloadable app.
3. In repository Settings → Secrets and variables → Actions, add a repository secret named `NUMBEO_API_KEY`. Do not prefix it with VITE_; it must never reach browser code. Do not paste the private key into chat.
4. Configure the existing `AZURE_STATIC_WEB_APPS_API_TOKEN` deployment secret and the public Supabase variables as described in the deployment/auth guides.
5. Push these changes to the default branch (the existing deployment workflow uses main). In Actions, open “Azure Static Web Apps CI/CD” and choose Run workflow. It fetches city prices, then builds/deploys them. Inspect the refresh step for updated/unavailable city names.
6. The same workflow is scheduled daily at 01:00 UTC / 06:30 IST. GitHub schedules can be delayed and run on the default branch. This is a daily refreshed snapshot, not real-time streaming. The job must be enabled and repository schedules must remain active. The browser checks for a newer published file every 15 minutes and offers a manual check button; it does not call the paid API itself.
7. On the City price guide page verify source links, source month and retrieval timestamp. Missing/old data must stay labelled and must not auto-fill. The app disables applying a record when retrieved more than seven days ago, the provider source month is missing, or the source period is over 180 days old. Provider month-level dates are not exact observation dates.

For local verification, set NUMBEO_API_KEY in your own shell environment, run `npm run refresh:city-prices`, then `npm run dev`. Never commit the key. No subscription means the real provider integration cannot be verified end-to-end yet.

## Scope and calculation rules
- Delhi NCR maps to Delhi city, explicitly disclosed; it is not an NCR-wide average.
- Rent: choose one or three bedrooms, city centre or outside. Compare reported average or lowest reported. The low end is not an assured available listing or a statutory minimum. No unsupported locality prices are shown.
- Transport: monthly public transport pass only, not taxis/fuel/car ownership.
- Utilities: provider's basic utilities for an entire 85 m² apartment, excluding internet/mobile. It is not scaled to a household without evidence.
- Food and other prices retain provider units. They are shown for reference; a monthly food budget needs quantities, diet and household size and is not inferred from one unit price.
- EMI, education and miscellaneous costs stay user-entered. Only individually selected rent/transport/utilities benchmarks replace their corresponding fields; all others are preserved.
- Failed city fetches preserve prior timestamps when a prior file exists; a fully failed run stops deployment. No timestamps are advanced for failed cities. A clean CI runner may have no prior snapshot; missing cities remain unavailable.
- MoSPI HCES 2023–24 supplies historical state/urban per-person context, not live city rent quotes: https://www.mospi.gov.in/sites/default/files/publication_reports/Final_Report_HCES_2023-24L.pdf . Do not label it as a live locality source.

## Optional future accuracy improvements
Use a licensed rental-listing feed with locality, bedrooms, furnishing, listing date and sample counts for locality-level rent percentiles; add official transport fares and utility tariffs together with customer usage. Do not call the lowest advertised price a realistic minimum without sample/quality rules. A budget basket should expose quantities and household size rather than presenting modelled totals as actual household spending.
