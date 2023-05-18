import Script from 'next/script'

export default function Meta() {
  return (
    <>
      <Script
        async
        src="https://scripts.simpleanalyticscdn.com/latest.js"
        strategy="afterInteractive"
      ></Script>
      <noscript>
        {/* eslint-disable @next/next/no-img-element */}
        <img
          src="https://queue.simpleanalyticscdn.com/noscript.gif"
          alt=""
          referrerPolicy="no-referrer-when-downgrade"
        />
      </noscript>
    </>
  )
}
