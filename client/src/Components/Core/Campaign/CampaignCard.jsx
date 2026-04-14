import { Clock, Rocket } from "lucide-react";
import ProgressBar from "../../Common/ProgressBar";
import formatCurrency from "../../../Utilities/formatCurrency";
import { calcProgress, daysLeft, getStatusColor } from "../../../Utilities/campaignHelpers";

function CampaignCard({ campaign, onView }) {
  const pct = calcProgress(campaign.raisedAmount, campaign.targetAmount);
  const days = daysLeft(campaign.deadline);
  return (
    <div
      className="app-card overflow-hidden transition-all hover:-translate-y-1 cursor-pointer group"
      onClick={() => onView(campaign)}
    >
      <div className="h-40 bg-surface-2 flex items-center justify-center relative overflow-hidden border-b border-app">
        {campaign.image ? (
          <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />
        ) : (
          <Rocket size={40} className="text-[#F97316]" />
        )}
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(campaign.status)}`}>
          {campaign.status === "completed" ? "Funded" : campaign.status === "pending" ? "Pending" : days === 0 ? "Ended" : "Active"}
        </span>
      </div>
      <div className="p-4">
        <span className="text-xs font-medium text-[#F97316] bg-[#F97316]/10 px-2 py-0.5 rounded-full">{campaign.category}</span>
        <h3 className="font-bold text-app mt-2 mb-1 line-clamp-2 group-hover:text-[#F97316] transition-colors">
          {campaign.title}
        </h3>
        <p className="text-muted text-xs line-clamp-2 mb-3">{campaign.description}</p>
        <div className="mb-3">
          <div className="flex justify-between text-xs text-muted mb-1">
            <span className="font-semibold text-app">{formatCurrency(campaign.raisedAmount)}</span>
            <span>{pct}%</span>
          </div>
          <ProgressBar value={pct} />
          <div className="flex justify-between text-xs text-muted mt-1">
            <span>Goal: {formatCurrency(campaign.targetAmount)}</span>
            <span>{campaign.contributors?.length ?? 0} backers</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-muted">
            <Clock size={12} />
            {days > 0 ? `${days}d left` : "Ended"}
          </span>
          <button
            className="text-xs font-semibold btn-primary px-3 py-1.5"
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
