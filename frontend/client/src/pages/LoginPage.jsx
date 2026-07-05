import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { loginUser, clearAuthError } from "../features/auth/authSlice";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error, isAuthenticated } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(location.state?.from?.pathname || "/", { replace: true });
    }
    return () => dispatch(clearAuthError());
  }, [isAuthenticated]);

  const onSubmit = (data) => {
    dispatch(loginUser(data));
  };

  return (
    <div className="container-page flex min-h-[80vh] items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link to="/" className="font-display text-3xl tracking-tightest">
            NovaCart
          </Link>
          <h1 className="mt-4 font-display text-2xl">Welcome back</h1>
          <p className="mt-1 text-sm text-stone">Sign in to continue to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            {...register("email", { required: "Email is required" })}
            error={errors.email?.message}
          />
          <Input
            label="Password"
            type="password"
            {...register("password", { required: "Password is required" })}
            error={errors.password?.message}
          />

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-xs text-stone hover:text-ink dark:hover:text-cream">
              Forgot password?
            </Link>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" isLoading={status === "loading"} className="mt-2 w-full">
            Sign In
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-stone">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-ink underline-offset-2 hover:underline dark:text-cream">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
