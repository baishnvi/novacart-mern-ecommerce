import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { registerUser, clearAuthError } from "../features/auth/authSlice";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, isAuthenticated } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
    return () => dispatch(clearAuthError());
  }, [isAuthenticated]);

  const onSubmit = (data) => {
    dispatch(registerUser({ name: data.name, email: data.email, password: data.password }));
  };

  return (
    <div className="container-page flex min-h-[80vh] items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link to="/" className="font-display text-3xl tracking-tightest">
            NovaCart
          </Link>
          <h1 className="mt-4 font-display text-2xl">Create your account</h1>
          <p className="mt-1 text-sm text-stone">Join NovaCart for a better way to shop</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Full Name"
            {...register("name", { required: "Name is required", minLength: { value: 2, message: "Too short" } })}
            error={errors.name?.message}
          />
          <Input
            label="Email"
            type="email"
            {...register("email", { required: "Email is required" })}
            error={errors.email?.message}
          />
          <Input
            label="Password"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Must be at least 8 characters" },
              pattern: { value: /\d/, message: "Must contain at least one number" },
            })}
            error={errors.password?.message}
            hint="At least 8 characters, including a number"
          />
          <Input
            label="Confirm Password"
            type="password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (val) => val === watch("password") || "Passwords do not match",
            })}
            error={errors.confirmPassword?.message}
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" isLoading={status === "loading"} className="mt-2 w-full">
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-stone">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-ink underline-offset-2 hover:underline dark:text-cream">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
