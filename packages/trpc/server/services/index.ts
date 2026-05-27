import UserService from "@patra/services/user";
import FormService from "@patra/services/form";
import FieldService from "@patra/services/field";
import SubmissionService from "@patra/services/submission";
import AnalyticsService from "@patra/services/analytics";
import ThemeService from "@patra/services/theme";
import EmailService from "@patra/services/email";

export const userService = new UserService();
export const formService = new FormService();
export const fieldService = new FieldService();
export const submissionService = new SubmissionService();
export const analyticsService = new AnalyticsService();
export const themeService = new ThemeService();
export const emailService = new EmailService();
