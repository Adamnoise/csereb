import React, { ReactNode } from 'react';

// Define Prop types
interface SidebarProps { children: ReactNode; /* other props */ }
interface SidebarSectionProps { children: ReactNode; /* other props */ }
interface SidebarItemProps { children: ReactNode; href?: string; /* other props */ }
// ... types for Header, Body, Footer, Label, Spacer

// Define SubComponents
const SidebarHeader = ({ children }: { children: ReactNode }) => <header>{children}</header>;
const SidebarBody = ({ children }: { children: ReactNode }) => <div>{children}</div>;
const SidebarFooter = ({ children }: { children: ReactNode }) => <footer>{children}</footer>;
const SidebarSection = ({ children }: SidebarSectionProps) => <section>{children}</section>;
const SidebarItem = ({ children, href }: SidebarItemProps) => <div><a href={href}>{children}</a></div>; // Simplified
const SidebarLabel = ({ children }: { children: ReactNode }) => <span>{children}</span>;
const SidebarSpacer = () => <hr />;

// Define Main Component Type with Static Properties
// Use an interface or type alias to define the component's signature AND its static members
type SidebarComponent = React.FC<SidebarProps> & {
  Header: typeof SidebarHeader;
  Body: typeof SidebarBody;
  Footer: typeof SidebarFooter;
  Section: typeof SidebarSection;
  Item: typeof SidebarItem;
  Label: typeof SidebarLabel;
  Spacer: typeof SidebarSpacer;
};

// Define the main component implementation
// Cast the component to the extended type
const Sidebar: SidebarComponent = ({ children }) => {
  return <nav className="sidebar">{children}</nav>; // Or whatever the root element is
};

// Attach static properties
Sidebar.Header = SidebarHeader;
Sidebar.Body = SidebarBody;
Sidebar.Footer = SidebarFooter;
Sidebar.Section = SidebarSection;
Sidebar.Item = SidebarItem;
Sidebar.Label = SidebarLabel;
Sidebar.Spacer = SidebarSpacer;

// Export default
export default Sidebar;