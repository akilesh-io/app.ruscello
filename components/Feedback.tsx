import Script from "next/script";
import React, { useEffect, useState } from "react";

const FeedbackModal = () => {
  useEffect(() => {
    const popupShown = localStorage.getItem("popupShown");
    //localStorage.clear();
    const feedbackButton = document.getElementById("feedback-button");
    setTimeout(() => {
      if (!popupShown) {
        feedbackButton?.click();
        localStorage.setItem("popupShown", "true");
      }
    }, 60000); // Display after 1 minute (60,000 milliseconds)
  }, []);

  return (
    <div>
      <Script
        async
        src="//embed.typeform.com/next/embed.js"
        strategy="afterInteractive"
      ></Script>
      <button
        id="feedback-button"
        // align top-right
        className="border-2 border-black rounded-md px-4 py-2 text-black font-medium hover:bg-gray-200 hover:text-black transition-all fixed top-4 right-4 z-50"
        data-tf-popup="Kjk8omIg"
        data-tf-opacity="100"
        data-tf-iframe-props="title=Filmingo"
        data-tf-transitive-search-params
        data-tf-medium="snippet"
      >
        Feedback
      </button>
    </div>
  );
};

export default FeedbackModal;
