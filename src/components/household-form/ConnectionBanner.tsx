import { Badge } from "@/components/ui/badge";

interface ConnectionBannerProps {
  applicantName?: string;
  applicantAddress?: any;
  memberName?: string;
}

export function ConnectionBanner({ applicantName, applicantAddress, memberName }: ConnectionBannerProps) {
  return (
    <div className="border-2 border-blue-300 bg-blue-50 dark:bg-blue-950 p-4 rounded-md mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <p className="font-bold text-blue-800 dark:text-blue-200">
            Connected to Childminder Registration:
          </p>
          <p className="text-sm text-blue-900 dark:text-blue-300 mt-1">
            {applicantName && (
              <>
                <strong>{applicantName}</strong>
                {applicantAddress && ` - ${applicantAddress.line1}, ${applicantAddress.town}`}
              </>
            )}
          </p>
          {memberName && (
            <p className="text-xs text-blue-800 dark:text-blue-300 mt-1">
              This form is for: <strong>{memberName}</strong>
            </p>
          )}
        </div>
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          Verified Link
        </Badge>
      </div>
      <p className="text-xs text-blue-800 dark:text-blue-300 mt-3">
        This information is set by the childminder who added you to their application. If it is incorrect, you must ask them to cancel this request and send a new, correct invitation.
      </p>
    </div>
  );
}
