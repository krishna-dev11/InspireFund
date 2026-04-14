import { Clock, Rocket } from "lucide-react";
import ProgressBar from "../../Common/ProgressBar";
import formatCurrency from "../../../Utilities/formatCurrency";
import { calcProgress, daysLeft, getStatusColor } from "../../../Utilities/campaignHelpers";

function CampaignCard({ campaign, onView }) {
  const pct = calcProgress(campaign.raisedAmount, campaign.targetAmount);
  const days = daysLeft(campaign.deadline);
  return (
    <div
      className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group"
      onClick={() => onView(campaign)}
    >
      <div className="h-40 bg-gradient-to-br from-indigo-50 via-purple-50 to-amber-50 flex items-center justify-center relative overflow-hidden">
        {campaign.image ? (
          <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />
        ) : (
          <Rocket size={40} className="text-indigo-300" />
        )}
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(campaign.status)}`}>
          {campaign.status === "completed" ? "Funded" : campaign.status === "pending" ? "Pending" : days === 0 ? "Ended" : "Active"}
        </span>
      </div>
      <div className="p-4">
        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{campaign.category}</span>
        <h3 className="font-bold text-gray-900 mt-2 mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {campaign.title}
        </h3>
        <p className="text-gray-500 text-xs line-clamp-2 mb-3">{campaign.description}</p>
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span className="font-semibold text-gray-800">{formatCurrency(campaign.raisedAmount)}</span>
            <span>{pct}%</span>
          </div>
          <ProgressBar value={pct} />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Goal: {formatCurrency(campaign.targetAmount)}</span>
            <span>{campaign.contributors?.length ?? 0} backers</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Clock size={12} />
            {days > 0 ? `${days}d left` : "Ended"}
          </span>
          <button
            className="text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              onView(campaign);
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default CampaignCard;
