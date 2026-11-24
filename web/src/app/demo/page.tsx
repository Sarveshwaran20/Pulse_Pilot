'use client';

import React, { useEffect } from 'react';
import CircadianCockpit from '@/app/cockpit/page';
import { useAppStore } from '@/lib/store';

export default function DemoPage() {
  const { enableDemoMode } = useAppStore();

  useEffect(() => {
    enableDemoMode();
  }, [enableDemoMode]);

  return <CircadianCockpit />;
}
