import * as React from 'react';

interface CoursePaymentEmailProps {
  courseTitle: string;
  paymentLink: string;
  studentName: string;
  brandName: string;
}

export function CoursePaymentEmail({ courseTitle, paymentLink, studentName, brandName }: CoursePaymentEmailProps) {
  return (
    <html lang="es" style={{ fontFamily: 'Arial, Helvetica, sans-serif', backgroundColor: '#f5f2ed', color: '#1f1f1f' }}>
      <body style={{ margin: 0, padding: 0 }}>
        <table width="100%" cellPadding={0} cellSpacing={0} role="presentation">
          <tbody>
            <tr>
              <td align="center" style={{ padding: '40px 0' }}>
                <table width="600" cellPadding={0} cellSpacing={0} role="presentation" style={{ backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden' }}>
                  <tbody>
                    <tr>
                      <td style={{ backgroundColor: '#0E0F12', padding: '32px' }}>
                        <h1 style={{ margin: 0, color: '#F7F3ED', fontStyle: 'italic', fontWeight: 600, fontSize: '28px' }}>{brandName}</h1>
                        <p style={{ marginTop: '12px', color: '#E6A3B2', fontSize: '16px' }}>Confirmación de reserva de cupo</p>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '32px' }}>
                        <p style={{ fontSize: '16px', lineHeight: 1.6 }}>Hola {studentName},</p>
                        <p style={{ fontSize: '16px', lineHeight: 1.6 }}>
                          ¡Gracias por tu interés en el curso <strong style={{ fontStyle: 'italic' }}>{courseTitle}</strong>! Para asegurar tu
                          cupo, finaliza el pago en el siguiente enlace:
                        </p>
                        <p style={{ textAlign: 'center', margin: '32px 0' }}>
                          <a
                            href={paymentLink}
                            style={{
                              display: 'inline-block',
                              padding: '14px 28px',
                              backgroundColor: '#FF5DA2',
                              color: '#0E0F12',
                              textDecoration: 'none',
                              borderRadius: '999px',
                              fontWeight: 600
                            }}
                          >
                            Pagar ahora
                          </a>
                        </p>
                        <p style={{ fontSize: '15px', lineHeight: 1.6 }}>
                          Si tienes preguntas o necesitas soporte, responde a este correo. Estamos listos para acompañarte.
                        </p>
                        <p style={{ marginTop: '24px', fontSize: '15px', lineHeight: 1.6 }}>
                          Equipo {brandName}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ backgroundColor: '#F7F3ED', padding: '24px', textAlign: 'center', color: '#2B2F38', fontSize: '13px' }}>
                        Lo único que necesitas como estudiante: cursos, guías y tutorías en un solo lugar.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}
