import Link from 'next/link';

export const metadata = {
  title: 'Gracias',
  description: 'Confirmación de tu solicitud en UNO Estudiante.'
};

export default function GraciasPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="text-xs uppercase tracking-[0.24em] text-brand-support">Mensaje enviado</span>
      <h1 className="mt-4 font-display text-5xl italic text-brand-text">¡Gracias por confiar en UNO Estudiante!</h1>
      <p className="mt-4 max-w-[60ch] text-base text-brand-text/80">
        Te enviamos un correo con todos los detalles. Si no lo ves en los próximos minutos, revisa la carpeta de spam o escríbenos a
        hola@unoestudiante.com.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="rounded-full border border-brand-support/60 bg-brand-accent px-5 py-3 text-brand-base">
          Ir al inicio
        </Link>
        <Link href="/cursos" className="rounded-full border border-white/20 px-5 py-3 text-brand-text">
          Explorar cursos
        </Link>
      </div>
    </div>
  );
}
