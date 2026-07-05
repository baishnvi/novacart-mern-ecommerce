import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { MapPin, Trash2, Plus } from "lucide-react";
import { addressService } from "../../services/cartService";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";

const AddressesPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const loadAddresses = () => {
    addressService.getAddresses().then((res) => {
      setAddresses(res.data);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const onSubmit = async (data) => {
    try {
      await addressService.createAddress(data);
      toast.success("Address added successfully");
      reset();
      setIsModalOpen(false);
      loadAddresses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add address");
    }
  };

  const handleDelete = async (id) => {
    try {
      await addressService.deleteAddress(id);
      toast.success("Address removed");
      loadAddresses();
    } catch (err) {
      toast.error("Could not remove address");
    }
  };

  if (isLoading) return <div className="skeleton h-48 w-full rounded-xl" />;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-display text-xl">Saved Addresses</h3>
        <Button size="sm" icon={Plus} onClick={() => setIsModalOpen(true)}>
          Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <MapPin size={36} className="text-stone" strokeWidth={1.25} />
          <p className="text-sm text-stone">No saved addresses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((addr) => (
            <div key={addr._id} className="card-surface flex items-start justify-between gap-3 p-5">
              <div className="text-sm">
                <p className="font-medium">
                  {addr.fullName} {addr.isDefault && <span className="ml-1 text-xs text-gold">(Default)</span>}
                </p>
                <p className="text-stone">
                  {addr.addressLine1}, {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
                </p>
                <p className="text-stone">{addr.phone}</p>
              </div>
              <button
                onClick={() => handleDelete(addr._id)}
                className="text-stone hover:text-red-500"
                aria-label="Delete address"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Address" size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Full Name" {...register("fullName", { required: "Required" })} error={errors.fullName?.message} />
          <Input label="Phone" {...register("phone", { required: "Required" })} error={errors.phone?.message} />
          <Input
            label="Address Line 1"
            className="sm:col-span-2"
            {...register("addressLine1", { required: "Required" })}
            error={errors.addressLine1?.message}
          />
          <Input label="Address Line 2 (optional)" {...register("addressLine2")} />
          <Input label="City" {...register("city", { required: "Required" })} error={errors.city?.message} />
          <Input label="State" {...register("state", { required: "Required" })} error={errors.state?.message} />
          <Input
            label="Postal Code"
            {...register("postalCode", { required: "Required" })}
            error={errors.postalCode?.message}
          />
          <Input label="Country" {...register("country", { required: "Required" })} error={errors.country?.message} />
          <div className="sm:col-span-2">
            <Button type="submit" isLoading={isSubmitting} className="w-full">
              Save Address
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AddressesPage;
