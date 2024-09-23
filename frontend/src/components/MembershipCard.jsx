import React, { useRef } from "react";
import { toPng } from "html-to-image";

const MembershipCard = ({ name, memberId, expirationDate, tier }) => {
  const cardRef = useRef(null);

  const downloadCard = async () => {
    if (!cardRef.current) return;

    try {
      const dataUrl = await toPng(cardRef.current);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${name}_membership_card.png`;
      link.click();
    } catch (err) {
      console.error("Could not generate image", err);
      alert("Failed to download the membership card. Please try again.");
    }

    return (
      <div className="flex flex-col items-center">
        <div
          ref={cardRef}
          className="bg-white shadow-lg rounded-lg w-80 p-6 border-t-4 border-gray-900"
          aria-labelledby="membership-card-header"
          role="region"
        >
          <div className="text-center">
            <h3
              id="membership-card-header"
              className="text-xl font-semibold text-gray-800 mb-4"
            >
              Membership Card
            </h3>
          </div>
          <div className="text-left space-y-2">
            <p className="text-gray-700">
              <span className="font-semibold">Name:</span> {name}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Member ID:</span> {memberId}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Tier:</span> {tier}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Valid for 3 years</span>
            </p>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Thank you for being a valued member!
            </p>
          </div>
        </div>
        <button
          onClick={downloadCard}
          className="mt-4 px-4 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:bg-blue-900 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Download Card
        </button>
      </div>
    );
  };
};

export default MembershipCard;
