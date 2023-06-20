import Script from "next/script";

export default function Meta() {
  return (
    <>
      <title>Filmingo</title>
      <meta
        property="og:description"
        content="Filmingo - Experience the joy of watching movies together online with Filmingo. Stream and enjoy synchronized movie viewing with friends from anywhere."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://filmingo.me" />
      {/* <meta
        property="og:image"
        content="https://res.cloudinary.com/davkfrmah/image/upload/v1686146984/Filmingo/temp_film_bvuced.jpg"
      /> */}
      <meta
        property="og:image"
        content="https://res.cloudinary.com/davkfrmah/image/upload/v1684239381/Filmingo/flamingo_logo.png"
      />
      <meta property="og:image:alt" content="Filmingo" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <Script
        async
        defer
        src="https://scripts.simpleanalyticscdn.com/latest.js"
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
  );
}
