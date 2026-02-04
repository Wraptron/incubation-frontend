 "use client";
 
 import * as React from "react";
 import { Eye, EyeOff } from "lucide-react";
 
 import { cn } from "@/lib/utils";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 
 type PasswordInputProps = Omit<React.ComponentProps<typeof Input>, "type"> & {
   containerClassName?: string;
 };
 
 const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
   ({ className, containerClassName, disabled, ...props }, ref) => {
     const [isVisible, setIsVisible] = React.useState(false);
 
     return (
       <div className={cn("relative", containerClassName)}>
         <Input
           ref={ref}
           type={isVisible ? "text" : "password"}
           className={cn("pr-10", className)}
           disabled={disabled}
           {...props}
         />
         <Button
           type="button"
           variant="ghost"
           size="icon"
           className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground hover:text-foreground"
           onClick={() => setIsVisible((v) => !v)}
           disabled={disabled}
           aria-label={isVisible ? "Hide password" : "Show password"}
           aria-pressed={isVisible}
           tabIndex={-1}
         >
           {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
         </Button>
       </div>
     );
   }
 );
 PasswordInput.displayName = "PasswordInput";
 
 export { PasswordInput };
