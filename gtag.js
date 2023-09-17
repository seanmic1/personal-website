//gtag.js

export const GA_TRACKING_ID = "G-W1WZS731E2"

export const pageview = url => {
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  })
}

export const event = ({ action, category, label, value }) => {
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}