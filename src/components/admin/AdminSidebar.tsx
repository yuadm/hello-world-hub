import { Home, Users, FileText, LogOut, BarChart3, Settings } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  { 
    title: "Dashboard", 
    url: "/admin/dashboard", 
    icon: Home,
    gradient: "from-primary to-secondary"
  },
  { 
    title: "Applications", 
    url: "/admin/applications", 
    icon: FileText,
    gradient: "from-secondary to-accent"
  },
  { 
    title: "Employees", 
    url: "/admin/employees", 
    icon: Users,
    gradient: "from-accent to-primary"
  },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "Successfully logged out of admin portal.",
    });
    navigate('/admin');
  };

  return (
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="border-b border-border/50 p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow">
            <BarChart3 className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="text-lg font-bold tracking-tight">Admin Portal</h2>
              <p className="text-xs text-muted-foreground">ChildMinderPro</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 mb-2 text-muted-foreground uppercase text-xs tracking-wider">
            {!collapsed && "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2 px-3">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className="group relative overflow-hidden"
                  >
                    <NavLink
                      to={item.url}
                      end
                      className={`
                        flex items-center gap-3 px-3 py-3 rounded-xl
                        transition-all duration-300 
                        hover:bg-muted/50
                        ${isActive(item.url) 
                          ? 'bg-gradient-to-r ' + item.gradient + ' text-primary-foreground shadow-glow' 
                          : 'text-muted-foreground'
                        }
                      `}
                    >
                      <item.icon className={`h-5 w-5 ${collapsed ? 'mx-auto' : ''}`} />
                      {!collapsed && (
                        <span className="font-medium">{item.title}</span>
                      )}
                      {isActive(item.url) && (
                        <div className="absolute inset-0 bg-white/10 animate-pulse" />
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 p-4">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={`
            w-full justify-start gap-3 px-3 py-3 rounded-xl
            hover:bg-destructive/10 hover:text-destructive
            transition-all duration-300
            ${collapsed ? 'justify-center' : ''}
          `}
        >
          <LogOut className={`h-5 w-5 ${collapsed ? 'mx-auto' : ''}`} />
          {!collapsed && <span className="font-medium">Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
