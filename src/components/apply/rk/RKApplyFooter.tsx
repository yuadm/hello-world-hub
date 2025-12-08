import { cn } from "@/lib/utils";

interface RKApplyFooterProps {
  className?: string;
}

export const RKApplyFooter = ({ className }: RKApplyFooterProps) => {
  return (
    <footer className={cn("bg-rk-gray-700 text-white py-6 mt-12", className)}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-rk-gray-300">
            © 2025 ReadyKids Childminder Agency. Ofsted URN 2012345.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-rk-gray-300 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-rk-gray-300 hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-rk-gray-300 hover:text-white transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
