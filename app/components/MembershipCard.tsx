"use client"

import React, { useRef } from 'react';
import { toPng } from 'html-to-image';

const MembershipCard = ({ name, memberId, expirationDate, tier }) => {
  const cardRef = useRef(null);

  const downloadCard = () => {
    if (cardRef.current === null) {
      return;
    }
    
    toPng(cardRef.current)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${name}_membership_card.png`;
        link.click();
      })
      .catch((err) => {
        console.error('Could not generate image', err);
      });
  };

  return (
    <div className="flex flex-col items-center">
      <div
        ref={cardRef}
        className="bg-white shadow-lg rounded-lg w-80 p-6 border-t-4 border-gray-900"
      >
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Membership Card</h3>
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
            <span className="font-semibold">Expires On:</span> {expirationDate}
          </p>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">Thank you for being a valued member!</p>
        </div>
      </div>
      <button
        onClick={downloadCard}
        className="mt-4 px-4 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:bg-blue-900 transition duration-200"
      >
        Download Card
      </button>
    </div>
  );
};

export default MembershipCard;
