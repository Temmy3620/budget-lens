import type { FormState } from "./form";

export type LoginFormErrors = {
	email?: string[];
	password?: string[];
};

export type SignupFormErrors = {
	name?: string[];
	email?: string[];
	password?: string[];
};

export type LoginFormState = FormState<LoginFormErrors>;
export type SignUpFormState = FormState<SignupFormErrors>;

export type ForgotPasswordFormErrors = {
	email?: string[];
};

export type ResetPasswordFormErrors = {
	password?: string[];
	confirmPassword?: string[];
};

export type ForgotPasswordFormState = FormState<ForgotPasswordFormErrors>;
export type ResetPasswordFormState = FormState<ResetPasswordFormErrors>;
