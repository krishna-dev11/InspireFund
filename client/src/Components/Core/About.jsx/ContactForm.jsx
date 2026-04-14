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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-[600px] app-card p-8 md:p-12 relative overflow-hidden"
    >
      <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-[#F97316]/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="flex flex-col relative z-10">
        <div className="flex flex-col text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight uppercase text-app">
            {heading}
          </h2>
          <p className="mt-2 text-sm font-medium italic text-muted">
            {description}
          </p>
        </div>

        <label className="mb-4">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest ml-1 text-app">
            Full Name <span className="text-[#F97316]">*</span>
          </p>
          <input
            type="text"
            placeholder="Enter your name"
            {...register("fullName", { required: true })}
            className="input-base w-full p-4 placeholder-gray-500"
          />
        </label>

        <label className="mb-4">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest ml-1 text-app">
            Email Address <span className="text-[#F97316]">*</span>
          </p>
          <input
            type="email"
            placeholder="you@example.com"
            {...register("email", { required: true })}
            className="input-base w-full p-4 placeholder-gray-500"
          />
        </label>

        <label className="mb-4">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest ml-1 text-app">
            Phone <span className="text-[#F97316]">*</span>
          </p>
          <input
            type="tel"
            placeholder="+91 90000 00000"
            {...register("phone", { required: true })}
            className="input-base w-full p-4 placeholder-gray-500"
          />
        </label>

        <label className="mb-4">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest ml-1 text-app">
            Campaign Type
          </p>
          <select {...register("campaignType")} className="input-base w-full p-4 bg-surface-2">
            <option className="bg-white text-black dark:bg-black dark:text-white">Startup</option>
            <option className="bg-white text-black dark:bg-black dark:text-white">Social Cause</option>
            <option className="bg-white text-black dark:bg-black dark:text-white">Creator Project</option>
            <option className="bg-white text-black dark:bg-black dark:text-white">Community Event</option>
          </select>
        </label>

        <label className="mb-6">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest ml-1 text-app">
            Message <span className="text-[#F97316]">*</span>
          </p>
          <textarea
            rows={4}
            placeholder="Tell us about your campaign..."
            {...register("message", { required: true })}
            className="input-base w-full p-4 placeholder-gray-500 resize-none"
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-2xl py-4 font-bold text-[10px] uppercase tracking-[0.3em] btn-primary active:scale-95"
        >
          Submit Inquiry
        </button>
      </div>
    </form>
  );
};

export default ContactForm;

