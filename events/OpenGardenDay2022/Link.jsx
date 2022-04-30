import React from "react";
import { useReward } from "react-rewards";

export default () => {
  const { reward, isAnimating } = useReward("rewardId", "confetti");

  return (
    <button disabled={isAnimating} onClick={reward}>
      <span id="rewardId" />
        <a href="https://www.eventbrite.com/e/north-brooklyn-gardens-bike-tour-tickets-329216935717?utm-campaign=social%2Cemail&utm-content=attendeeshare&utm-medium=discovery&utm-source=strongmail&utm-term=listing">
      <img src="https://cdn.evbstatic.com/s3-build/453732-rc2022-04-28_16.04-43b83bd/django/images/logos/eb_orange_on_white_1200x630.png"/>
      <h1>
          Register on Eventbrite
      </h1>
        </a>
    </button>
  );
};
