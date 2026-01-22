import React from "react";

const PromotionList = ({ promotions, onDelete }) => {
  if (!Array.isArray(promotions) || promotions.length === 0) {
    return <div className="text-sm text-gray-500">No promotions</div>;
  }

  return (
    <div className="mt-3 space-y-2">
      {promotions.map((pr) => (
        <div key={pr.promoId} className="flex items-center justify-between border rounded-md p-2">
          <div className="text-sm">
            <div>
              <span className="font-medium">Discount:</span> ${pr.discountValue}
            </div>
            <div className="text-xs text-gray-600">
              {new Date(pr.validFrom).toLocaleDateString()} - {new Date(pr.validUntil).toLocaleDateString()}
            </div>
          </div>
          <button className="border px-3 py-1 text-sm" onClick={() => onDelete(pr.promoId)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default PromotionList;
