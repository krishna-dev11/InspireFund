import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { CheckCircle, Image as ImageIcon, Info, Rocket, X } from "lucide-react";
import { CATEGORIES } from "../../../data/categories";
import { createCampaign } from "../../../Services/Operations/campaignAPI";
import showToast from "../../../Utilities/showToast";

function CreateCampaignModal({ onClose, onCreated }) {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const { watch, setValue } = useForm({
    defaultValues: {
      title: "",
      description: "",
      targetAmount: "",
      category: "Technology",
      tags: "",
      durationDays: "30",
      additionalInfo: "",
    },
  });

  const form = watch();
  const u = (k, v) => setValue(k, v, { shouldDirty: true });

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Please select an image file", "error");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast("Image must be under 10MB", "error");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.targetAmount) {
      showToast("Please fill all required fields", "error");
      return;
    }
    if (Number(form.targetAmount) <= 0) {
      showToast("Target amount must be greater than 0", "error");
      return;
    }

    setLoading(true);
    setStep(2);
    try {
      const fd = new FormData();
      fd.append("title", form.title.trim());
      fd.append("description", form.description.trim());
      fd.append("targetAmount", form.targetAmount);
      fd.append("category", form.category);
      fd.append("durationDays", form.durationDays);
      if (form.tags) {
        form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
          .forEach((t) => fd.append("tags[]", t));
      }
      if (imageFile) fd.append("image", imageFile);

      const ok = await dispatch(createCampaign(fd));
      if (ok) {
        setStep(3);
        setTimeout(() => {
          if (onCreated) onCreated();
          onClose();
        }, 2500);
      } else {
        setStep(1);
      }
    } catch {
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-indigo-700 to-violet-700 p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Create New Campaign</h2>
              <p className="text-white/70 text-sm mt-0.5">Launch your idea and start raising funds</p>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white">
              <X size={22} />
            </button>
          </div>
          <div className="flex gap-2 mt-5">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${step >= s ? "bg-white" : "bg-white/30"}`} />
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="p-6 space-y-4">
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 flex gap-2 text-sm text-indigo-700">
              <Info size={16} className="shrink-0 mt-0.5" />
              Campaigns need admin approval before going live. Platform fee: 5% on raised amount.
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Campaign Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => u("title", e.target.value)}
                  placeholder="Give your campaign a compelling title"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none"
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => u("description", e.target.value)}
                  rows={3}
                  placeholder="Tell your story — what problem are you solving?"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Target Amount (?) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-500 text-sm">?</span>
                  <input
                    type="number"
                    value={form.targetAmount}
                    onChange={(e) => u("targetAmount", e.target.value)}
                    placeholder="500000"
                    className="w-full pl-7 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Duration (days)</label>
                <select
                  value={form.durationDays}
                  onChange={(e) => u("durationDays", e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none bg-white"
                >
                  {[15, 30, 45, 60, 90].map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => u("category", e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none bg-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Tags (comma separated)</label>
                <input
                  value={form.tags}
                  onChange={(e) => u("tags", e.target.value)}
                  placeholder="startup, tech, green"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Campaign Image (uploads to Cloudinary)</label>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  handleFile(e.dataTransfer.files[0]);
                }}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  dragOver
                    ? "border-indigo-500 bg-indigo-50"
                    : imagePreview
                    ? "border-emerald-400 bg-emerald-50"
                    : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
                }`}
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="preview" className="h-20 w-auto rounded-lg object-cover" />
                    <p className="text-sm text-emerald-700 font-medium">Image ready · {imageFile?.name}</p>
                  </>
                ) : (
                  <>
                    <ImageIcon size={28} className="text-gray-400" />
                    <p className="text-sm text-gray-500">
                      Drag & drop or <span className="text-indigo-600 font-semibold">click to upload</span>
                    </p>
                    <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
            </div>
            <button
              onClick={handleSubmit}
              disabled={!form.title || !form.description || !form.targetAmount || loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3.5 rounded-xl font-bold hover:opacity-90 disabled:opacity-40 transition-all flex items-center justify-center gap-2"
            >
              Launch Campaign ?
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="p-16 flex flex-col items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Rocket size={24} className="text-indigo-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Submitting Campaign</h3>
            <div className="space-y-2 w-full max-w-xs">
              {["Uploading image to Cloudinary…", "Saving campaign to MongoDB…", "Notifying admin for review…"].map((msg, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle size={14} className="text-emerald-500" />
                  {msg}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="p-12 flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle size={40} className="text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Campaign Submitted!</h3>
            <p className="text-gray-500 text-sm text-center">
              Your campaign is pending admin review. You'll see it in "My Campaigns" once approved.
            </p>
            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-medium">? Pending Review · Est. 24 hrs</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateCampaignModal;
