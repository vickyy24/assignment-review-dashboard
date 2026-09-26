import React, { useState } from "react";
import Button from "../components/ui/Button";
import { useApp } from "../context/AppContext";
import { BookOpen, ChartNoAxesColumnIncreasing, CheckCircle2, CircleAlert, Eye, EyeOff, FileText, GraduationCap, LockKeyhole, Mail, MessageSquareText, UserRound } from "lucide-react";
import { EMAIL_REGEX, PASSWORD_REGEX } from "../utils/validation";

export default function LoginPage() {
    const { login } = useApp();
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });
    const [formError, setFormError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const validateForm = () => {
        return {
            email: EMAIL_REGEX.test(credentials.email.trim())
                ? ""
                : "Enter a valid email address.",
            password: PASSWORD_REGEX.test(credentials.password)
                ? ""
                : "Password must be at least 8 characters.",
        };
    };

    const hasFieldErrors = (errors) => {
        return Boolean(errors.email || errors.password);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCredentials((currentCredentials) => {
            return {
                ...currentCredentials,
                [name]: value,
            };
        });
        setFieldErrors((currentErrors) => {
            return { ...currentErrors, [name]: "" };
        });
        setFormError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");
        const validationErrors = validateForm();
        setFieldErrors(validationErrors);
        if (hasFieldErrors(validationErrors)) {
            return;
        }

        setLoading(true);
        try {
            await new Promise((resolve) => {
                setTimeout(resolve, 600);
            }); // simulate network
            login(credentials.email.trim(), credentials.password);
        } catch (err) {
            setFormError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordVisibility = () => {
        setShowPassword((visible) => {
            return !visible;
        });
    };

    return (
        <div className="login-root bg-[#f4f1f6] h-screen max-md:h-auto max-md:min-h-screen p-4 max-sm:p-3 grid place-items-center">
            {/* Background blobs */}
            <div className="blob blob-1" />
            <div className="blob blob-2" />
            <div className="blob blob-3" />

            <main className="login-card login-layout text-left relative overflow-hidden w-full max-w-[1370px] p-0 grid grid-cols-1 md:grid-cols-2 h-full min-h-0 max-md:h-auto max-md:max-h-none max-md:overflow-visible max-md:max-w-[520px] max-sm:rounded-[20px]">
                <section
                    className="login-brand-panel relative min-w-0 pt-[30px] px-[52px] pb-5 max-md:min-h-0 max-md:px-[30px] max-md:pt-7 max-md:pb-5 max-sm:px-5 max-sm:pt-6 max-sm:pb-4 flex flex-col justify-between"
                    aria-label="EduBoard"
                >
                    <div className="m-0 text-left relative z-10">
                        <div className="mb-[34px] max-sm:mb-5 flex flex-wrap items-center gap-[9px] max-sm:gap-1">
                            <img
                                className="h-[38px] w-[38px] object-contain max-sm:h-8 max-sm:w-8"
                                src="/eduboard-mark.svg"
                                alt=""
                            />
                            <span className="login-product-name">EduBoard</span>
                        </div>
                        <h1 className="login-title login-brand-title text-[42px] max-md:text-4xl max-sm:text-[30px]">
                            Learn. Build. Grow.
                        </h1>
                        <p className="login-subtitle">
                            Assignments, progress and feedback — all in one
                            place.
                        </p>
                    </div>

                    <div className="login-features flex flex-col gap-[11px] mt-5 max-md:hidden">
                        <div className="login-feature flex items-center gap-[14px]">
                            <span className="login-feature-icon-blue rounded-[15px] h-11 w-11 flex-none grid place-items-center">
                                <FileText size={18} />
                            </span>
                            <span className="flex flex-col gap-0.5">
                                <strong>Manage Assignments</strong>
                                <small>Stay updated with all your tasks</small>
                            </span>
                        </div>
                        <div className="login-feature flex items-center gap-[14px]">
                            <span className="login-feature-icon-purple rounded-[15px] h-11 w-11 flex-none grid place-items-center">
                                <ChartNoAxesColumnIncreasing size={18} />
                            </span>
                            <span className="flex flex-col gap-0.5">
                                <strong>Track Progress</strong>
                                <small>See your growth and performance</small>
                            </span>
                        </div>
                        <div className="login-feature flex items-center gap-[14px]">
                            <span className="login-feature-icon-green rounded-[15px] h-11 w-11 flex-none grid place-items-center">
                                <MessageSquareText size={18} />
                            </span>
                            <span className="flex flex-col gap-0.5">
                                <strong>Get Feedback</strong>
                                <small>Learn and improve with reviews</small>
                            </span>
                        </div>
                    </div>

                    <div
                        className="relative z-10 h-[145px] mt-[10px] w-full max-md:hidden flex-none"
                        aria-hidden="true"
                    >
                        <div className="login-illustration-orbit absolute h-[190px] w-[190px] left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2" />
                        <div className="login-illustration-ring absolute left-[5px] top-[9px] h-11 w-11 max-md:left-1 max-md:top-0 max-md:h-[38px] max-md:w-[38px] grid place-items-center">
                            <CheckCircle2 size={24} />
                        </div>
                        <div className="login-illustration-card absolute left-1/2 top-1/2 h-[84px] w-[220px] -translate-x-1/2 -translate-y-1/2 p-3 max-md:h-[70px] max-md:w-[180px] max-md:gap-2 max-md:p-[10px] flex items-center gap-[10px]">
                            <span className="illustration-icon max-md:h-[34px] max-md:w-[34px] grid place-items-center">
                                <BookOpen size={19} />
                            </span>
                            <span className="illustration-lines flex flex-1 flex-col gap-2">
                                <i />
                                <i />
                                <i className="last:w-[72%]" />
                            </span>
                        <span className="text-[var(--success-color)]">
                                <CheckCircle2 size={17} />
                            </span>
                        </div>
                        <div className="login-illustration-card text-[#a0783e] absolute right-0 bottom-[7px] h-[58px] w-[96px] max-md:right-1 max-md:bottom-[-2px] max-md:h-12 max-md:w-[82px] flex items-center justify-evenly">
                            <ChartNoAxesColumnIncreasing size={23} />
                            <span className="illustration-bars h-[33px] flex items-end gap-1">
                                <i className="h-3" />
                                <i className="h-5" />
                                <i className="h-4" />
                                <i className="h-[29px]" />
                            </span>
                        </div>
                        <div className="login-illustration-dot login-illustration-dot-one absolute right-[29%] top-[10%] h-[7px] w-[7px]" />
                        <div className="login-illustration-dot bg-[#b28a55] absolute left-[17%] bottom-[9%] h-[7px] w-[7px]" />
                    </div>
                </section>

                <section
                    className="login-form-panel min-w-0 min-h-0 overflow-y-auto max-md:overflow-visible bg-white px-[44px] py-[30px] max-md:p-[30px] max-sm:px-5 max-sm:py-6 flex items-start justify-center"
                    aria-label="Sign in"
                >
                    <div className="w-full max-w-[545px] my-auto">
                        <div className="login-form-heading mb-5">
                            <h2 className="text-[32px] max-md:text-[26px]">
                                Welcome Back
                            </h2>
                            <p>Login to continue to your dashboard</p>
                        </div>
                        <form
                            onSubmit={handleSubmit}
                            className="w-full max-w-none max-md:gap-[15px] flex flex-col gap-[15px]"
                            noValidate
                        >
                            <div className="field flex flex-col gap-[7px]">
                                <label htmlFor="email" className="field-label">
                                    Email
                                </label>
                                <div className="relative w-full">
                                    <span className="login-input-icon absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none flex">
                                        <Mail size={17} />
                                    </span>
                                    <input
                                        id="email"
                                        name="email"
                                        type="text"
                                        inputMode="email"
                                        autoComplete="email"
                                        aria-invalid={Boolean(
                                            fieldErrors.email,
                                        )}
                                        aria-describedby={
                                            fieldErrors.email
                                                ? "email-error"
                                                : undefined
                                        }
                                        className={`field-input placeholder:text-[var(--login-field-placeholder-color)] h-[52px] max-sm:h-[50px] ${fieldErrors.email ? "border-[var(--error-color)]" : ""}`}
                                        value={credentials.email}
                                        onChange={handleInputChange}
                                        placeholder="Enter your email"
                                    />
                                </div>
                                {fieldErrors.email && (
                                    <p
                                        id="email-error"
                                        className="field-error"
                                        role="alert"
                                    >
                                        {fieldErrors.email}
                                    </p>
                                )}
                            </div>
                            <div className="field flex flex-col gap-[7px]">
                                <label
                                    htmlFor="password"
                                    className="field-label"
                                >
                                    Password
                                </label>
                                <div className="relative w-full">
                                    <span className="login-input-icon absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none flex">
                                        <LockKeyhole size={17} />
                                    </span>
                                    <input
                                        id="password"
                                        name="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        autoComplete="current-password"
                                        aria-invalid={Boolean(
                                            fieldErrors.password,
                                        )}
                                        aria-describedby={
                                            fieldErrors.password
                                                ? "password-error"
                                                : undefined
                                        }
                                        className={`field-input placeholder:text-[var(--login-field-placeholder-color)] h-[52px] max-sm:h-[50px] ${fieldErrors.password ? "border-[var(--error-color)]" : ""}`}
                                        value={credentials.password}
                                        onChange={handleInputChange}
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        className="password-visibility absolute right-3 top-1/2 -translate-y-1/2 h-[30px] w-[30px] grid place-items-center"
                                        type="button"
                                        onClick={handlePasswordVisibility}
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff size={17} />
                                        ) : (
                                            <Eye size={17} />
                                        )}
                                    </button>
                                </div>
                                {fieldErrors.password && (
                                    <p
                                        id="password-error"
                                        className="field-error"
                                        role="alert"
                                    >
                                        {fieldErrors.password}
                                    </p>
                                )}
                            </div>

                            {formError && (
                                <div className="error-banner" role="alert">
                                    <CircleAlert size={16} aria-hidden="true" />{" "}
                                    {formError}
                                </div>
                            )}

                            <Button
                                variant="primary"
                                type="submit"
                                className="inline-flex h-12 items-center justify-center gap-2 mt-0"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="spinner animate-spin" />
                                ) : (
                                    "Login"
                                )}
                            </Button>
                        </form>
                        <div className="my-[10px] flex items-center gap-[14px] text-xs text-[#8b729a]">
                            <span className="h-px flex-1 bg-[#eadff0]" />
                            <span>OR</span>
                            <span className="h-px flex-1 bg-[#eadff0]" />
                        </div>
                        <aside
                            className="demo-credentials p-[14px_16px]"
                            aria-label="Demo credentials"
                        >
                            <p className="demo-credentials-title">
                                Demo Credentials
                            </p>
                            <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-[10px]">
                                <div className="demo-account-card [overflow-wrap:anywhere] p-[10px_12px] flex flex-col items-start gap-1">
                                    <span className="demo-account-icon demo-account-icon-student grid place-items-center">
                                        <GraduationCap size={19} />
                                    </span>
                                    <strong className="text-[13px] text-[#41304d]">
                                        Student
                                    </strong>
                                    <span>Arjun</span>
                                    <span>Email: arjun@student.edu</span>
                                    <span>Password: student123</span>
                                    <span>Priya</span>
                                    <span>Email: priya@student.edu</span>
                                    <span>Password: student123</span>
                                </div>
                                <div className="demo-account-card [overflow-wrap:anywhere] p-[10px_12px] flex flex-col items-start gap-1">
                                    <span className="demo-account-icon demo-account-icon-admin grid place-items-center">
                                        <UserRound size={19} />
                                    </span>
                                    <strong className="text-[13px] text-[#41304d]">
                                        Admin
                                    </strong>
                                    <span>ramesh@prof.edu</span>
                                    <span>admin123</span>
                                </div>
                            </div>
                        </aside>
                    </div>
                </section>
            </main>
        </div>
    );
}
