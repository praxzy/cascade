'use client';

import * as React from 'react';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children, scriptProps, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const mergedScriptProps =
    scriptProps && scriptProps.async !== undefined ? scriptProps : { async: true, ...scriptProps };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <NextThemesProvider {...props} scriptProps={mergedScriptProps}>
      {children}
    </NextThemesProvider>
  );
}
