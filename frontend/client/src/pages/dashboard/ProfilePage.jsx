import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { userService } from "../../services/cartService";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);

  const profileForm = useForm({ defaultValues: { name: user?.name, phone: user?.phone } });
  const passwordForm = useForm();

  const onProfileSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("phone", data.phone || "");
      await userService.updateProfile(formData);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update profile");
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      await userService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password changed. Please log in again.");
      passwordForm.reset();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not change password");
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="card-surface p-6">
        <h3 className="mb-5 font-display text-xl">Personal Information</h3>
        <form
          onSubmit={profileForm.handleSubmit(onProfileSubmit)}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          <Input label="Full Name" {...profileForm.register("name", { required: true })} />
          <Input label="Email" value={user?.email} disabled className="opacity-60" />
          <Input label="Phone" {...profileForm.register("phone")} />
          <div className="sm:col-span-2">
            <Button type="submit" isLoading={profileForm.formState.isSubmitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>

      <div className="card-surface p-6">
        <h3 className="mb-5 font-display text-xl">Change Password</h3>
        <form
          onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          <Input
            label="Current Password"
            type="password"
            {...passwordForm.register("currentPassword", { required: "Required" })}
            error={passwordForm.formState.errors.currentPassword?.message}
          />
          <div />
          <Input
            label="New Password"
            type="password"
            {...passwordForm.register("newPassword", {
              required: "Required",
              minLength: { value: 8, message: "Must be at least 8 characters" },
            })}
            error={passwordForm.formState.errors.newPassword?.message}
          />
          <Input
            label="Confirm New Password"
            type="password"
            {...passwordForm.register("confirmPassword", {
              validate: (val) => val === passwordForm.watch("newPassword") || "Passwords do not match",
            })}
            error={passwordForm.formState.errors.confirmPassword?.message}
          />
          <div className="sm:col-span-2">
            <Button type="submit" variant="secondary" isLoading={passwordForm.formState.isSubmitting}>
              Update Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
