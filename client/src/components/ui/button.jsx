import { cn } from '@/lib/utils';
    import { Slot } from '@radix-ui/react-slot';
    import { cva } from 'class-variance-authority';
    import React from 'react';

    const buttonVariants = cva(
      'inline-flex items-center justify-center rounded-lg text-sm font-semibold ring-offset-background transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 transform active:scale-95', /* Updated for realism */
      {
        variants: {
          variant: {
            default: 'bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-primary/50', /* Primary glow */
            destructive:
              'bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90 hover:shadow-destructive/50',
            outline:
              'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground shadow-sm hover:shadow-md',
            secondary:
              'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow-md',
            ghost: 'hover:bg-accent hover:text-accent-foreground',
            link: 'text-primary underline-offset-4 hover:underline hover:text-primary/80',
          },
          size: {
            default: 'h-10 px-4 py-2',
            sm: 'h-9 rounded-md px-3',
            lg: 'h-11 rounded-lg px-8 text-base', /* Larger for impact */
            icon: 'h-10 w-10',
          },
        },
        defaultVariants: {
          variant: 'default',
          size: 'default',
        },
      },
    );

    const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
      const Comp = asChild ? Slot : 'button';
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
      );
    });
    Button.displayName = 'Button';

    export { Button, buttonVariants };