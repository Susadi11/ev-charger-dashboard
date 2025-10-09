import React, { useEffect, useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

const inputClasses =
  'w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/60';

const OwnerModal = ({ isOpen, onClose, owner, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    nic: '',
    phone: '',
    status: 'active'
  });

  useEffect(() => {
    if (owner) {
      setFormData({
        name: owner.name || '',
        email: owner.email || '',
        nic: owner.nic || '',
        phone: owner.phone || '',
        status: owner.status || 'active'
      });
    } else {
      setFormData({
        name: '',
        email: '',
        nic: '',
        phone: '',
        status: 'active'
      });
    }
  }, [owner, isOpen]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={owner ? 'Edit Owner' : 'Add New Owner'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-xs font-semibold tracking-[0.08em] uppercase text-slate-500">
            Full Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={handleChange('name')}
            className={inputClasses}
            required
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-semibold tracking-[0.08em] uppercase text-slate-500">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              className={inputClasses}
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold tracking-[0.08em] uppercase text-slate-500">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={handleChange('phone')}
              className={inputClasses}
              required
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-semibold tracking-[0.08em] uppercase text-slate-500">
              NIC / ID
            </label>
            <input
              type="text"
              value={formData.nic}
              onChange={handleChange('nic')}
              className={inputClasses}
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold tracking-[0.08em] uppercase text-slate-500">
              Status
            </label>
            <select
              value={formData.status}
              onChange={handleChange('status')}
              className={inputClasses}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {owner ? 'Update Owner' : 'Add Owner'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default OwnerModal;
