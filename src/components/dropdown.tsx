tsx
import { Menu } from '@headlessui/react'
import { Fragment } from 'react'

export function Dropdown({ children }: { children: React.ReactNode }) {
  return <Menu as="div">{children}</Menu>
}

export function DropdownButton({
  children,
  className,
  ...props
}: {
  children: React.ReactNode
  className?: string
} & React.ComponentPropsWithoutRef<'button'>) {
  return (
    <Menu.Button className={className} {...props}>
      {children}
    </Menu.Button>
  )
}

export function DropdownMenu({
  children,
  className,
  anchor = 'bottom start',
}: {
  children: React.ReactNode
  className?: string
  anchor?: 'bottom start' | 'top start'
}) {
  let originX = 'left'
  let originY = anchor.startsWith('bottom') ? 'top' : 'bottom'

  return (
    <Menu.Items
      className={className}
      static
      style={{
        position: 'absolute',
        [anchor.endsWith('start') ? 'left' : 'right']: 0,
      }}
    >
      {children}
    </Menu.Items>
  )
}

export function DropdownItem({
  children,
  as = 'div',
  ...props
}: {
  children: React.ReactNode
  as?: React.ElementType
} & React.ComponentPropsWithoutRef<any>) {
  return (
    <Menu.Item as={Fragment}>
      {({ active }) => (
        <div
          className={`${
            active ? 'bg-zinc-100 dark:bg-zinc-700' : ''
          } flex items-center gap-3 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-200`}
          as={as}
          {...props}
        >
          {children}
        </div>
      )}
    </Menu.Item>
  )
}

export function DropdownLabel({ children }: { children: React.ReactNode }) {
  return <span>{children}</span>
}

export function DropdownDivider() {
  return <hr className="border-zinc-200 dark:border-zinc-700 my-1" />
}