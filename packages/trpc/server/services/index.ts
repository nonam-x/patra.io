import UserService from "@repo/services/user";
import FormService from "@repo/services/form";
import FieldService from "@repo/services/field";
import SubmissionService from "@repo/services/submission";
import AnalyticsService from "@repo/services/analytics";
import ThemeService from "@repo/services/theme";

export const userService = new UserService();
export const formService = new FormService();
export const fieldService = new FieldService();
export const submissionService = new SubmissionService();
export const analyticsService = new AnalyticsService();
export const themeService = new ThemeService();
