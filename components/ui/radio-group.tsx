"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface RadioGroupItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string
}

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  onValueChange?: (value: string) => void
  name?: string
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value, onValueChange, children, name, ...props }, ref) => {
    const id = React.useId()
    const groupName = React.useMemo(() => name || `radio-group-${id}`, [name, id])
    
    return (
      <div
        ref={ref}
        className={cn("grid gap-2", className)}
        role="radiogroup"
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement<RadioGroupItemProps>(child)) {
            return React.cloneElement(child, {
              name: groupName,
              checked: child.props.value === value,
              onChange: () => onValueChange?.(child.props.value),
            })
          }
          return child
        })}
      </div>
    )
  }
)
RadioGroup.displayName = "RadioGroup"

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="radio"
          ref={ref}
          className={cn(
            "h-4 w-4 rounded-full border border-primary text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        />
        {children && (
          <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {children}
          </span>
        )}
      </label>
    )
  }
)
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }