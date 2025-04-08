import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { Sun, Moon } from "lucide-react";

import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer data-[state=checked]:bg-zinc-100 dark:data-[state=checked]:bg-zinc-100 data-[state=unchecked]:bg-zinc-900 focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-10 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "relative flex items-center justify-center bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none size-5.5 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[74%] data-[state=unchecked]:translate-x-0 border border-gray-900 dark:border-white"
        )}
      >
        {/* Icon changes based on state */}
        <Sun className="w-3 h-3 text-yellow-700 dark:hidden" />
        <Moon className="w-3 h-3 text-white hidden dark:block" />
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}

export { Switch }
