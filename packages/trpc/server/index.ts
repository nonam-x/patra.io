import { router } from "./trpc";

import { healthRouter } from "./routes/health/route";
import { authRouter } from "./routes/auth/route";
import { formRouter } from "./routes/form/route";
import { fieldRouter } from "./routes/field/route";
import { submissionRouter } from "./routes/submission/route";
import { analyticsRouter } from "./routes/analytics/route";
import { themeRouter } from "./routes/theme/route";
import { exploreRouter } from "./routes/explore/route";

export const serverRouter = router({
  health: healthRouter,
  auth: authRouter,
  form: formRouter,
  field: fieldRouter,
  submission: submissionRouter,
  analytics: analyticsRouter,
  theme: themeRouter,
  explore: exploreRouter,
});

export { createContext } from "./context";
export type ServerRouter = typeof serverRouter;
