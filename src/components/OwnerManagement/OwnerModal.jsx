import React, { useEffect, useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { registerEVOwner, updateEVOwner } from '../../api/evOwnerApi';

const inputClasses =
  'w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/60';

const OwnerModal = ({ isOpen, onClose, owner, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    nic: '',
    password: '',
    phone: '',
    vehicleType: '',
    status: 'active'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (owner) {
      // Editing existing owner
      setFormData({
        name: owner.name || '',
        email: owner.email || '',
        nic: owner.nic || '',
        password: '', // Don't show existing password
        phone: owner.phone || '',
        vehicleType: owner.vehicleType || '',
        status: owner.status || 'active'
      });
    } else {
      // Creating new owner
      setFormData({
        name: '',
        email: '',
        nic: '',
        password: '',
        phone: '',
        vehicleType: '',
        status: 'active'
      });
    }
    setError(null);
  }, [owner, isOpen]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (owner) {
        // Update existing owner
        await updateEVOwner(owner.nic, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          vehicleType: formData.vehicleType
        });
      } else {
        // Register new owner
        if (!formData.password) {
          setError('Password is required for new owners');
          setLoading(false);
          return;
        }
        await registerEVOwner({
          name: formData.name,
          email: formData.email,
          nic: formData.nic,
          password: formData.password,
          phone: formData.phone,
          vehicleType: formData.vehicleType
        });
      }
      
      // Call parent's onSave to refresh the list
      onSave();
    } catch (err) {
      setError(err.message);
      console.error('Save error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={owner ? 'Edit Owner' : 'Add New Owner'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div>
          <label className="mb-2 block text-xs font-semibold tracking-[0.08em] uppercase text-slate-500">
            Full Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={handleChange('name')}
            className={inputClasses}
            required
            disabled={loading}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-semibold tracking-[0.08em] uppercase text-slate-500">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              className={inputClasses}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold tracking-[0.08em] uppercase text-slate-500">
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={handleChange('phone')}
              className={inputClasses}
              placeholder="+94771234567"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-semibold tracking-[0.08em] uppercase text-slate-500">
              NIC / ID *
            </label>
            <input
              type="text"
              value={formData.nic}
              onChange={handleChange('nic')}
              className={inputClasses}
              placeholder="912345678V"
              required
              disabled={loading || owner} // NIC cannot be changed when editing
            />
            {owner && (
              <p className="mt-1 text-xs text-slate-500">
                NIC cannot be changed
              </p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold tracking-[0.08em] uppercase text-slate-500">
              Vehicle Type *
            </label>
            <input
              type="text"
              value={formData.vehicleType}
              onChange={handleChange('vehicleType')}
              className={inputClasses}
              placeholder="e.g., Tesla Model 3, Nissan Leaf"
              required
              disabled={loading}
            />
          </div>
        </div>

        {!owner && (
          <div>
            <label className="mb-2 block text-xs font-semibold tracking-[0.08em] uppercase text-slate-500">
              Password *
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              className={inputClasses}
              placeholder="Minimum 6 characters"
              required={!owner}
              minLength={6}
              disabled={loading}
            />
            <p className="mt-1 text-xs text-slate-500">
              Required for new accounts. Minimum 6 characters.
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button 
            variant="secondary" 
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                {owner ? 'Updating...' : 'Creating...'}
              </span>
            ) : (
              owner ? 'Update Owner' : 'Add Owner'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default OwnerModal;