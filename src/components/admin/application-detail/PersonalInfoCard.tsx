import { AppleCard } from "@/components/admin/AppleCard";
import { User, Mail, Phone, Calendar, CreditCard } from "lucide-react";

interface PersonalInfoCardProps {
  title: string;
  firstName: string;
  middleNames?: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  niNumber: string;
  rightToWork?: string;
  previousNames?: any[];
  placeOfBirth?: string;
}

export const PersonalInfoCard = ({
  title,
  firstName,
  middleNames,
  lastName,
  email,
  phone,
  dob,
  gender,
  niNumber,
  rightToWork,
  previousNames,
  placeOfBirth,
}: PersonalInfoCardProps) => {
  const InfoRow = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
    <div className="flex items-start gap-3">
      <div className="rounded-lg bg-primary/10 p-2 flex-shrink-0">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-muted-foreground mb-0.5">{label}</div>
        <div className="text-sm font-medium truncate">{value || "N/A"}</div>
      </div>
    </div>
  );

  return (
    <AppleCard className="p-6">
      <h3 className="text-lg font-semibold tracking-tight mb-4">Personal Details</h3>
      <div className="space-y-4">
        <InfoRow 
          icon={User} 
          label="Full Name" 
          value={`${title} ${firstName} ${middleNames || ""} ${lastName}`.trim()} 
        />
        <InfoRow icon={Mail} label="Email" value={email} />
        <InfoRow icon={Phone} label="Phone" value={phone} />
        <InfoRow icon={Calendar} label="Date of Birth" value={dob} />
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2 flex-shrink-0">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-muted-foreground mb-0.5">Gender</div>
            <div className="text-sm font-medium">{gender || "N/A"}</div>
          </div>
        </div>
        <InfoRow icon={CreditCard} label="NI Number" value={niNumber} />
        {placeOfBirth && <InfoRow icon={User} label="Place of Birth" value={placeOfBirth} />}
        {rightToWork && <InfoRow icon={User} label="Right to Work" value={rightToWork} />}
        
        {previousNames && previousNames.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="text-xs font-medium text-muted-foreground mb-2">Previous Names</div>
            <div className="space-y-2">
              {previousNames.map((name: any, idx: number) => (
                <div key={idx} className="text-sm rounded-lg bg-muted/30 p-2">
                  <div className="font-medium">{name.fullName}</div>
                  <div className="text-xs text-muted-foreground">
                    {name.dateFrom} - {name.dateTo}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppleCard>
  );
};
