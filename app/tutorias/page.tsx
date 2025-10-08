import { BookingSection } from '@/components/BookingSection';

export const metadata = {
  title: 'Tutorías',
  description: 'Agenda una tutoría personalizada con mentores de UNO Estudiante.'
};

export default function TutoriasPage() {
  return (
    <div className="space-y-16">
      <header className="space-y-4">
        <span className="text-xs uppercase tracking-[0.24em] text-brand-support">Tutorías UNO</span>
        <h1 className="font-display text-5xl italic text-brand-text">Agenda personalizada</h1>
        <p className="max-w-[60ch] text-base text-brand-text/80">
          Elige un horario de 60 minutos con 10 minutos de preparación para nuestro equipo. Completa tus datos y te enviaremos la
          confirmación con el enlace a tu sesión en Google Meet.
        </p>
      </header>
      <BookingSection />
    </div>
  );
}
