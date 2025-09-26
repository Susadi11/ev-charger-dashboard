import React, { useState, useEffect } from 'react';
import { QrCode, Calendar, Clock, MapPin, CheckCircle, Download, Share, X } from 'lucide-react';

const ReservationSummary = ({ reservation, onClose }) => {
  const [qrCodeData, setQrCodeData] = useState('');

  useEffect(() => {
    if (reservation) {
      // Generate QR code data (in a real app, this would be a unique reservation code)
      const qrData = {
        reservationId: reservation.id,
        stationId: reservation.stationId,
        startTime: reservation.startTime,
        endTime: reservation.endTime,
        status: reservation.status
      };
      setQrCodeData(JSON.stringify(qrData));
    }
  }, [reservation]);

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Pending':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Cancelled':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Confirmed':
        return '✓';
      case 'Pending':
        return '⏳';
      case 'Cancelled':
        return '✕';
      default:
        return '?';
    }
  };

  const handleDownloadQR = () => {
    // In a real app, this would generate and download a QR code image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 200;
    
    // Simple QR code placeholder (in real app, use a QR code library)
    ctx.fillStyle = '#000';
    ctx.fillRect(50, 50, 100, 100);
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.fillText('QR Code', 75, 120);
    
    const link = document.createElement('a');
    link.download = `reservation-${reservation.id}-qr.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'EV Charging Reservation',
          text: `Reservation for ${reservation.stationName} on ${formatDateTime(reservation.startTime)}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(
        `Reservation for ${reservation.stationName} on ${formatDateTime(reservation.startTime)}`
      );
      alert('Reservation details copied to clipboard!');
    }
  };

  if (!reservation) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Reservation Details</h2>
            <p className="text-sm text-gray-500 mt-1">Operator View - QR Code for Station Access</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex justify-center">
            <span
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
                reservation.status
              )}`}
            >
              <span className="mr-2">{getStatusIcon(reservation.status)}</span>
              {reservation.status}
            </span>
          </div>

          {/* Reservation Details */}
          <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reservation Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Station</p>
                  <p className="font-medium text-gray-900">{reservation.stationName}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(reservation.startTime).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <Clock className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Start Time</p>
                  <p className="font-medium text-gray-900">
                    {new Date(reservation.startTime).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <Clock className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">End Time</p>
                  <p className="font-medium text-gray-900">
                    {new Date(reservation.endTime).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-200 rounded-2xl p-8 text-center">
            <QrCode className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Station Access QR Code</h3>
            <p className="text-gray-600 mb-6">
              Customer scans this QR code at the charging station to start their session
            </p>
            
            {/* QR Code Placeholder */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 inline-block mb-6">
              <div className="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-300 rounded-lg mx-auto mb-2"></div>
                  <p className="text-xs text-gray-500">QR Code</p>
                </div>
              </div>
            </div>

            {/* QR Code Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleDownloadQR}
                className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download QR
              </button>
              <button
                onClick={handleShare}
                className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                <Share className="w-4 h-4 mr-2" />
                Share
              </button>
            </div>
          </div>

          {/* Operator Notes */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <h4 className="font-medium text-amber-900 mb-2">Operator Guidelines</h4>
            <ul className="text-sm text-amber-800 space-y-1">
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                Customer must arrive within 15 minutes of start time
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                Reservation auto-cancels if customer doesn't arrive on time
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                Can cancel reservation up to 12 hours before start time
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                QR code provides secure access to charging station
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-900 text-white rounded-2xl font-medium hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationSummary;
