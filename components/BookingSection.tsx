'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CalendarWidget } from './CalendarWidget';
import { BookingForm } from './BookingForm';

export function BookingSection() {
  const [slot, setSlot] = useState<{ start: string; end: string } | null>(null);
  const router = useRouter();

  return (
    <div className="space-y-8">
      <CalendarWidget selectedSlot={slot} onSelect={setSlot} />
      <BookingForm
        selectedSlot={slot}
        onSuccess={() => {
          router.push('/gracias');
        }}
      />
    </div>
  );
}
