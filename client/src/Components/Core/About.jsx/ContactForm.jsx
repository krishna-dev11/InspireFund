import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const ContactForm = ({ heading, description }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm();

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        fullName: "",
        email: "",
        phone: "",
        campaignType: "",
        message: "",
      });
    }
  }, [reset, isSubmitSuccessful]);

  const onSubmit = () => {
    toast.success("Thanks! Our team will reach out shortly.");
  };

  const inputStyle =
    "w-full rounded-2xl p-4 placeholder-gray-600 outline-none focus:border-[#F97316]/40 transition-all bg-white/[0.02] border border-white/10 text-white";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-[600px] bg-white/[0.02] backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-[#F97316]/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="flex flex-col relative z-10">
        <div className="flex flex-col text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight uppercase text-white">
            {heading}
          </h2>
          <p className="mt-2 text-sm font-medium italic text-gray-400">
            {description}
          </p>
        </div>

        <label className="mb-4">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest ml-1 text-white">
            Full Name <span className="text-[#F97316]">*</span>
          </p>
          <input
            type="text"
            placeholder="Enter your name"
            {...register("fullName", { required: true })}
            className={inputStyle}
          />
        </label>

        <label className="mb-4">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest ml-1 text-white">
            Email Address <span className="text-[#F97316]">*</span>
          </p>
          <input
            type="email"
            placeholder="you@example.com"
            {...register("email", { required: true })}
            className={inputStyle}
          />
        </label>

        <label className="mb-4">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest ml-1 text-white">
            Phone <span className="text-[#F97316]">*</span>
          </p>
          <input
            type="tel"
            placeholder="+91 90000 00000"
            {...register("phone", { required: true })}
            className={inputStyle}
          />
        </label>

        <label className="mb-4">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest ml-1 text-white">
            Campaign Type
          </p>
          <select {...register("campaignType")} className={inputStyle}>
            <option className="bg-black text-white">Startup</option>
            <option className="bg-black text-white">Social Cause</option>
            <option className="bg-black text-white">Creator Project</option>
            <option className="bg-black text-white">Community Event</option>
          </select>
        </label>

        <label className="mb-6">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest ml-1 text-white">
            Message <span className="text-[#F97316]">*</span>
          </p>
          <textarea
            rows={4}
            placeholder="Tell us about your campaign..."
            {...register("message", { required: true })}
            className={`${inputStyle} resize-none`}
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-2xl py-4 font-bold text-[10px] uppercase tracking-[0.3em] bg-white text-black hover:bg-[#F97316] hover:text-black transition-all active:scale-95 shadow-xl"
        >
          Submit Inquiry
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
