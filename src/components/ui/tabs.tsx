import * as React from "react"
import { cn } from "@/lib/utils"

const Tabs = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement> & { defaultValue?: string, value?: string, onValueChange?: (value: string) => void }) => {
  const [activeTab, setActiveTab] = React.useState(props.value || props.defaultValue)
  
  React.useEffect(() => {
    if (props.value !== undefined) {
      setActiveTab(props.value)
    }
  }, [props.value])

  const handleTabChange = (value: string) => {
    if (props.value === undefined) {
      setActiveTab(value)
    }
    props.onValueChange?.(value)
  }

  return (
    <div
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      {React.Children.map(props.children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { activeTab, onTabChange: handleTabChange })
        }
        return child
      })}
    </div>
  )
}

const TabsList = ({ className, activeTab, onTabChange, ...props }: any) => (
  <div
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  >
    {React.Children.map(props.children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child as React.ReactElement<any>, { activeTab, onTabChange })
      }
      return child
    })}
  </div>
)

const TabsTrigger = ({ className, value, activeTab, onTabChange, ...props }: any) => (
  <button
    type="button"
    role="tab"
    aria-selected={activeTab === value}
    data-state={activeTab === value ? "active" : "inactive"}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    onClick={() => onTabChange?.(value)}
    {...props}
  />
)

const TabsContent = ({ className, value, activeTab, ...props }: any) => {
  if (activeTab !== value) return null
  return (
    <div
      role="tabpanel"
      data-state={activeTab === value ? "active" : "inactive"}
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
