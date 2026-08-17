import { useState } from "react";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { updateProfile as updateProfileApi, addAddress, deleteAddress } from "../api/authApi.js";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user.name, phone: user.phone || "" });
  const [saving, setSaving] = useState(false);

  const [newAddress, setNewAddress] = useState({ label: "Home", street: "", city: "" });
  const [addingAddress, setAddingAddress] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateProfileApi(form);
      setUser((prev) => ({ ...prev, ...res.data }));
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.city) {
      toast.error("Street and city are required");
      return;
    }
    setAddingAddress(true);
    try {
      const res = await addAddress(newAddress);
      setUser((prev) => ({ ...prev, addresses: res.data }));
      setNewAddress({ label: "Home", street: "", city: "" });
      toast.success("Address added");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAddingAddress(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const res = await deleteAddress(addressId);
      setUser((prev) => ({ ...prev, addresses: res.data }));
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">My profile</h1>

      <form onSubmit={handleProfileSave} className="card mt-6 space-y-4 p-5">
        <h2 className="font-semibold text-gray-900">Personal details</h2>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Full name</label>
          <input
            className="input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
          <input className="input bg-gray-50" value={user.email} disabled />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
          <input
            className="input"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>

      <div className="card mt-6 space-y-4 p-5">
        <h2 className="font-semibold text-gray-900">Delivery addresses</h2>

        {user.addresses?.length > 0 && (
          <div className="space-y-2">
            {user.addresses.map((addr) => (
              <div key={addr._id} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {addr.label} {addr.isDefault && <span className="badge bg-primary-100 text-primary-700">Default</span>}
                  </p>
                  <p className="text-sm text-gray-500">{addr.street}, {addr.city}</p>
                </div>
                <button onClick={() => handleDeleteAddress(addr._id)} className="text-gray-400 hover:text-red-600">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleAddAddress} className="space-y-3 border-t border-gray-100 pt-4">
          <div className="grid grid-cols-2 gap-3">
            <input
              className="input"
              placeholder="Label (e.g. Home)"
              value={newAddress.label}
              onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
            />
            <input
              className="input"
              placeholder="City"
              value={newAddress.city}
              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
            />
          </div>
          <input
            className="input"
            placeholder="Street address"
            value={newAddress.street}
            onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
          />
          <button type="submit" disabled={addingAddress} className="btn-outline">
            {addingAddress ? "Adding..." : "Add address"}
          </button>
        </form>
      </div>
    </div>
  );
}
