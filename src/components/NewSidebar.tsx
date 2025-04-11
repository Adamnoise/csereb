// /home/user/csereb/src/components/NewSidebar.tsx
// (Assuming previous fixes for imports, heroicons, as, slot, alt are applied)

import Avatar from '@/components/avatar';
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@/components/dropdown';

// This import assumes '@/components/Sidebar' exports Sidebar as a default
// AND that Sidebar has .Header, .Body etc. correctly attached AND typed.
import Sidebar from '@/components/Sidebar';

import {
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cog8ToothIcon,
  LightBulbIcon,
  PlusIcon,
  ShieldCheckIcon,
  UserIcon,
  Cog6ToothIcon,
  HomeIcon,
  InboxIcon,
  MagnifyingGlassIcon,
  MegaphoneIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  Square2StackIcon,
  TicketIcon,
} from '@heroicons/react/20/solid';
import React from 'react'; // Make sure React is imported if not globally available

function Example() {
  // The error TS2559 on this line suggests TS might not even recognize
  // Sidebar as a valid React component type accepting children.
  // This reinforces the idea that the type definition/export of Sidebar is the issue.
  return (
    <Sidebar>
      {/* All subsequent errors (TS2339) stem from TS not finding these
          properties on the type it inferred for the imported 'Sidebar'. */}
      <Sidebar.Header>
        <Dropdown>
          {/* Assuming 'as' prop removed as per previous fix */}
          <DropdownButton onClick={() => window.location.href = "/teams/1/settings"} className="mb-2.5">
            <Avatar src="/tailwind-logo.svg" />
            <Sidebar.Label>Tailwind Labs</Sidebar.Label>
            <ChevronDownIcon />
          </DropdownButton>
          <DropdownMenu className="min-w-64" anchor="bottom start">
            <DropdownItem href="/teams/1/settings">
              <Cog8ToothIcon />
              <DropdownLabel>Settings</DropdownLabel>
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem href="/teams/1">
               {/* Assuming 'slot' prop removed as per previous fix */}
              <Avatar src="/tailwind-logo.svg" />
              <DropdownLabel>Tailwind Labs</DropdownLabel>
            </DropdownItem>
            <DropdownItem href="/teams/2">
               {/* Assuming 'slot' prop removed as per previous fix */}
              <Avatar initials="WC" className="bg-purple-500 text-white" />
              <DropdownLabel>Workcation</DropdownLabel>
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem href="/teams/create">
              <PlusIcon />
              <DropdownLabel>New team…</DropdownLabel>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Sidebar.Section>
          <Sidebar.Item href="/search">
            <MagnifyingGlassIcon />
            <Sidebar.Label>Search</Sidebar.Label>
          </Sidebar.Item>
          <Sidebar.Item href="/inbox">
            <InboxIcon />
            <Sidebar.Label>Inbox</Sidebar.Label>
          </Sidebar.Item>
        </Sidebar.Section>
      </Sidebar.Header>
      <Sidebar.Body>
        <Sidebar.Section>
          <Sidebar.Item href="/home">
            <HomeIcon />
            <Sidebar.Label>Home</Sidebar.Label>
          </Sidebar.Item>
          <Sidebar.Item href="/events">
            <Square2StackIcon />
            <Sidebar.Label>Events</Sidebar.Label>
          </Sidebar.Item>
          <Sidebar.Item href="/orders">
            <TicketIcon />
            <Sidebar.Label>Orders</Sidebar.Label>
          </Sidebar.Item>
          <Sidebar.Item href="/broadcasts">
            <MegaphoneIcon />
            <Sidebar.Label>Broadcasts</Sidebar.Label>
          </Sidebar.Item>
          <Sidebar.Item href="/settings">
            <Cog6ToothIcon />
            <Sidebar.Label>Settings</Sidebar.Label>
          </Sidebar.Item>
        </Sidebar.Section>
        <Sidebar.Spacer />
        <Sidebar.Section>
          <Sidebar.Item href="/support">
            <QuestionMarkCircleIcon />
            <Sidebar.Label>Support</Sidebar.Label>
          </Sidebar.Item>
          <Sidebar.Item href="/changelog">
            <SparklesIcon />
            <Sidebar.Label>Changelog</Sidebar.Label>
          </Sidebar.Item>
        </Sidebar.Section>
      </Sidebar.Body>
      <Sidebar.Footer>
        <Dropdown>
           {/* Assuming 'as' prop removed as per previous fix */}
          <DropdownButton onClick={() => window.location.href = "/my-profile"}>
            <span className="flex min-w-0 items-center gap-3">
               {/* Assuming 'alt' prop removed as per previous fix */}
              <Avatar src="/profile-photo.jpg" className="size-10" square />
              <span className="min-w-0">
                <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">Erica</span>
                <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                  erica@example.com
                </span>
              </span>
            </span>
            <ChevronUpIcon />
          </DropdownButton>
          <DropdownMenu className="min-w-64" anchor="top start">
            <DropdownItem href="/my-profile">
              <UserIcon />
              <DropdownLabel>My profile</DropdownLabel>
            </DropdownItem>
            <DropdownItem href="/settings">
              <Cog8ToothIcon />
              <DropdownLabel>Settings</DropdownLabel>
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem href="/privacy-policy">
              <ShieldCheckIcon />
              <DropdownLabel>Privacy policy</DropdownLabel>
            </DropdownItem>
            <DropdownItem href="/share-feedback">
              <LightBulbIcon />
              <DropdownLabel>Share feedback</DropdownLabel>
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem href="/logout">
              <ArrowRightStartOnRectangleIcon />
              <DropdownLabel>Sign out</DropdownLabel>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Sidebar.Footer>
    </Sidebar>
  );
}

export default Example;