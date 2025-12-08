import { UseFormReturn } from "react-hook-form";
import { ChildminderApplication } from "@/types/childminder";
import { RKInput, RKSectionTitle } from "./rk";
import { Shield, Pencil } from "lucide-react";

interface Props {
  form: UseFormReturn<Partial<ChildminderApplication>>;
}

export const Section9Declaration = ({ form }: Props) => {
  const { register, watch, setValue } = form;

  const consentItems = [
    {
      key: "consent1",
      boldText: "Authorise ReadyKids",
      text: "to contact the children's services departments of any local authority area in which you have lived in the last 5 years.",
    },
    {
      key: "consent2", 
      boldText: "Authorise those local authorities",
      text: "to share with ReadyKids any relevant information about your suitability to work with children.",
    },
    {
      key: "consent3",
      boldText: "Understand",
      text: "that ReadyKids will use this information only for assessing your suitability and meeting safeguarding duties.",
    },
    {
      key: "consent4",
      boldText: "Understand",
      text: "that ReadyKids will handle all information in accordance with data protection law.",
    },
    {
      key: "consent5",
      boldText: "Confirm",
      text: "that all information in this application is true and complete to the best of your knowledge.",
    },
  ];

  return (
    <div className="space-y-8">
      <RKSectionTitle 
        title="Local Authority Consent & Declaration" 
        description="As part of safeguarding requirements, we must check with local authorities where you have lived in the past 5 years." 
      />

      {/* Consent Banner - Teal style */}
      <div className="rk-consent-banner">
        <div className="icon-wrapper">
          <Shield />
        </div>
        <h3>Why is this consent needed?</h3>
        <p>
          ReadyKids is an Ofsted-registered childminder agency. We must carry out background 
          checks with local authorities where you have lived to assess your suitability to work with children.
        </p>
      </div>

      {/* Consent Section */}
      <div className="rk-consent-section">
        <h4>Your Consent</h4>
        <p>By checking each box below, you confirm that you:</p>
        
        <div className="space-y-2">
          {consentItems.map((item, index) => {
            const isChecked = watch(item.key as keyof ChildminderApplication) as boolean || false;
            return (
              <div 
                key={item.key} 
                className={`rk-consent-item ${isChecked ? 'checked' : ''}`}
                onClick={() => setValue(item.key as keyof ChildminderApplication, !isChecked as never)}
              >
                <div className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => setValue(item.key as keyof ChildminderApplication, e.target.checked as never)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <span className="number">{index + 1}.</span>
                <span className="text">
                  <strong>{item.boldText}</strong> {item.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Signature Section - New Style */}
      <div className="rk-signature-section">
        <div className="rk-signature-header">
          <Pencil className="icon w-5 h-5" />
          <h4>Declaration & Signature</h4>
        </div>
        
        <div className="rk-signature-notice">
          <p>
            I have read and understood the information above and I give my consent for ReadyKids and 
            relevant local authority children's services departments to share information about me for the 
            purposes described.
          </p>
        </div>
        
        <div className="rk-signature-grid">
          <div>
            <label className="block text-sm font-medium text-rk-text mb-1">
              Your signature <span className="text-rk-error">*</span>
            </label>
            <p className="text-xs text-rk-text-light mb-2">Type your full name as your electronic signature</p>
            <input 
              type="text"
              placeholder="Type your full name"
              className="w-full px-4 py-3 border-2 border-rk-border rounded-[10px] bg-rk-gray-50 rk-signature-input focus:border-rk-primary focus:outline-none"
              {...register("signatureFullName")} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-rk-text mb-1">
              Full name (PRINT) <span className="text-rk-error">*</span>
            </label>
            <p className="text-xs text-rk-text-light mb-2">FULL NAME IN CAPITALS</p>
            <input 
              type="text"
              placeholder="FULL NAME IN CAPITALS"
              className="w-full px-4 py-3 border-2 border-rk-border rounded-[10px] bg-white focus:border-rk-primary focus:outline-none uppercase"
              {...register("declarationPrintName")} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-rk-text mb-1">
              Date <span className="text-rk-error">*</span>
            </label>
            <p className="text-xs text-rk-text-light mb-2">&nbsp;</p>
            <input 
              type="date"
              className="w-full px-4 py-3 border-2 border-rk-border rounded-[10px] bg-white focus:border-rk-primary focus:outline-none"
              {...register("signatureDate")} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};
