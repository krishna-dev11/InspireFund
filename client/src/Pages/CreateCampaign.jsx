import { useNavigate } from "react-router-dom";
import CreateCampaignModal from "../Components/Core/Campaign/CreateCampaignModal";

function CreateCampaign() {
  const navigate = useNavigate();
  return <CreateCampaignModal onClose={() => navigate("/dashboard")} />;
}

export default CreateCampaign;
