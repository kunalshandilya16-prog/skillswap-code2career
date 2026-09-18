import React, { useState } from 'react';
import { Booking } from '../../types';
import { Modal } from '../common/Modal';
import { AlertTriangle, Clock } from 'lucide-react';

interface DeclineModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export const DeclineModal: React.FC<DeclineModalProps> = ({
  booking,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [reason, setReason] = useState('');

  if (!booking) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(reason.trim());
    setReason('');
    onClose();
  };

  const handleQuickReason = (text: string) => {
    setReason(text);
  };

  return (
    <Modal
      id="decline-booking-modal"
      isOpen={isOpen}
      onClose={onClose}
      title="Decline Booking Request"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <p className="font-semibold">Decision Point 1 & 2 Behavior:</p>
            <p className="mt-0.5">
              Declining will set this request to <strong>Declined</strong> and release{' '}
              <strong>{booking.gigTitle}</strong> back to active status on the marketplace so other clients can book it.
            </p>
          </div>
        </div>

        <div>
          <div className="text-xs text-slate-500 mb-1">Request from:</div>
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs">
            <div className="font-semibold text-slate-800">{booking.clientName}</div>
            <div className="text-slate-500">{booking.clientEmail}</div>
            <div className="text-slate-600 italic mt-1.5 border-t border-slate-200/60 pt-1.5">
              "{booking.message}"
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="decline-reason-input" className="block text-xs font-semibold text-slate-700 mb-1">
            Optional Decline Reason <span className="font-normal text-slate-400">(seen by client)</span>
          </label>
          <textarea
            id="decline-reason-input"
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g., Unavailable at the requested time, fully booked this week, or scope needs adjustment."
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
          />
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Quick suggestions:
            </span>
            <button
              type="button"
              onClick={() => handleQuickReason("I'm unavailable during the requested dates.")}
              className="text-[11px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
            >
              Unavailable during requested dates
            </button>
            <button
              type="button"
              onClick={() => handleQuickReason('Currently at maximum client capacity.')}
              className="text-[11px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
            >
              At maximum capacity
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            id="btn-cancel-decline"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Keep Pending
          </button>
          <button
            type="submit"
            id="btn-confirm-decline"
            className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors shadow-xs"
          >
            Confirm Decline
          </button>
        </div>
      </form>
    </Modal>
  );
};
