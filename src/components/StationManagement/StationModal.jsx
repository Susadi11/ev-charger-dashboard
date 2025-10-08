import React, { useEffect, useState } from 'react';
import { MapPin, Zap, Calendar, Clock } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';

const inputClasses =
  'w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/60';

const StationModal = ({ isOpen, onClose, station, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    address: '',
    type: 'AC',
    slots: '',
    latitude: '',
    longitude: '',
    operatingHours: {
      open: '00:00',
      close: '23:59'
    },
    schedule: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true
    },
    status: 'operational'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (station) {
      setFormData({
        name: station.name || '',
        location: station.location || '',
        address: station.address || '',
        type: station.type || 'AC',
        slots: station.slots || '',
        latitude: station.latitude || '',
        longitude: station.longitude || '',
        operatingHours: station.operatingHours || { open: '00:00', close: '23:59' },
        schedule:
          station.schedule || {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: true,
            sunday: true
          },
        status: station.status || 'operational'
      });
    } else {
      setFormData({
        name: '',
        location: '',
        address: '',
        type: 'AC',
        slots: '',
        latitude: '',
        longitude: '',
        operatingHours: { open: '00:00', close: '23:59' },
        schedule: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true
        },
        status: 'operational'
      });
    }
    setErrors({});
  }, [station, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Station name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.slots || formData.slots < 1) newErrors.slots = 'Slots must be at least 1';

    if (
      formData.latitude &&
      (Number.isNaN(Number(formData.latitude)) ||
        Number(formData.latitude) < -90 ||
        Number(formData.latitude) > 90)
    ) {
      newErrors.latitude = 'Invalid latitude';
    }
    if (
      formData.longitude &&
      (Number.isNaN(Number(formData.longitude)) ||
        Number(formData.longitude) < -180 ||
        Number(formData.longitude) > 180)
    ) {
      newErrors.longitude = 'Invalid longitude';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    onSave(formData);
    onClose();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleScheduleChange = (day) => {
    setFormData((prev) => ({
      ...prev,
      schedule: { ...prev.schedule, [day]: !prev.schedule[day] }
    }));
  };

  const handleTimeChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      operatingHours: { ...prev.operatingHours, [field]: value }
    }));
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={station ? 'Edit Station' : 'Add New Station'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-semibold tracking-[0.08em] uppercase text-slate-500">
              Station Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`${inputClasses} ${errors.name ? 'border-red-400 focus:ring-rose-500/60' : ''}`}
              placeholder="Downtown Charging Hub"
            />
            {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold tracking-[0.08em] uppercase text-slate-500">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`${inputClasses} ${errors.location ? 'border-red-400 focus:ring-rose-500/60' : ''}`}
              placeholder="Colombo"
            />
            {errors.location && <p className="mt-1 text-xs text-rose-500">{errors.location}</p>}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold tracking-[0.08em] uppercase text-slate-500">
            Full Address *
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={`${inputClasses} ${errors.address ? 'border-red-400 focus:ring-rose-500/60' : ''}`}
            placeholder="123 Main Street, Colombo 01"
          />
          {errors.address && <p className="mt-1 text-xs text-rose-500">{errors.address}</p>}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-[0.08em] uppercase text-slate-500">
              <Zap className="h-3 w-3" />
              Charger Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={inputClasses}
            >
              <option value="AC">AC Charger</option>
              <option value="DC">DC Charger</option>
              <option value="Both">AC &amp; DC</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold tracking-[0.08em] uppercase text-slate-500">
              Total Slots *
            </label>
            <input
              type="number"
              name="slots"
              min="1"
              value={formData.slots}
              onChange={handleChange}
              className={`${inputClasses} ${errors.slots ? 'border-red-400 focus:ring-rose-500/60' : ''}`}
            />
            {errors.slots && <p className="mt-1 text-xs text-rose-500">{errors.slots}</p>}
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold tracking-[0.08em] uppercase text-slate-500">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={inputClasses}
            >
              <option value="operational">Operational</option>
              <option value="maintenance">Maintenance</option>
              <option value="offline">Offline</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-[0.08em] uppercase text-slate-500">
              <MapPin className="h-3 w-3" />
              Latitude
            </label>
            <input
              type="text"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              className={`${inputClasses} ${errors.latitude ? 'border-red-400 focus:ring-rose-500/60' : ''}`}
              placeholder="6.9271"
            />
            {errors.latitude && <p className="mt-1 text-xs text-rose-500">{errors.latitude}</p>}
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold tracking-[0.08em] uppercase text-slate-500">
              Longitude
            </label>
            <input
              type="text"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              className={`${inputClasses} ${errors.longitude ? 'border-red-400 focus:ring-rose-500/60' : ''}`}
              placeholder="79.8612"
            />
            {errors.longitude && <p className="mt-1 text-xs text-rose-500">{errors.longitude}</p>}
          </div>
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-[0.08em] uppercase text-slate-500">
            <Clock className="h-3 w-3" />
            Operating Hours
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <span className="mb-1 block text-xs text-slate-500">Opening Time</span>
              <input
                type="time"
                value={formData.operatingHours.open}
                onChange={(event) => handleTimeChange('open', event.target.value)}
                className={inputClasses}
              />
            </div>
            <div>
              <span className="mb-1 block text-xs text-slate-500">Closing Time</span>
              <input
                type="time"
                value={formData.operatingHours.close}
                onChange={(event) => handleTimeChange('close', event.target.value)}
                className={inputClasses}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-[0.08em] uppercase text-slate-500">
            <Calendar className="h-3 w-3" />
            Operating Days
          </label>
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => (
              <button
                key={day}
                type="button"
                onClick={() => handleScheduleChange(day)}
                className={`rounded-2xl border px-2 py-2 text-xs font-medium transition ${
                  formData.schedule[day]
                    ? 'border-gray-900 bg-gray-900 text-white shadow-sm'
                    : 'border-gray-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {dayLabels[index]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{station ? 'Update Station' : 'Create Station'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default StationModal;
