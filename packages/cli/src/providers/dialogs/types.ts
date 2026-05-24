// This file defines what a dialog configuration looks like
// Every dialog needs a title (shown at the top) and children (the content inside the popup)

import type { ReactNode } from "react";

export type DialogConfig = {
  title: string;
  children: ReactNode;
};