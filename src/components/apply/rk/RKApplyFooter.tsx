import { cn } from "@/lib/utils";

interface RKApplyFooterProps {
  className?: string;
}

export const RKApplyFooter = ({ className }: RKApplyFooterProps) => {
  return (
    <footer className={cn("bg-white border-t border-rk-border py-6 mt-12", className)}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-rk-text-light">
          <p>© 2025 ReadyKids Childminder Agency. Ofsted URN 2012345.</p>
          <div className="flex items-center gap-6">
            <a href="/privacy" className="hover:text-rk-primary transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-rk-primary transition-colors">Terms of Service</a>
            <a href="/contact" className="hover:text-rk-primary transition-colors">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
