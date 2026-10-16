
import type { APIRoute } from "astro";
import { Resend } from "resend";

export const prerender = false;

const apiKey = import.meta.env.RESEND_API_KEY || import.meta.env.APIKEY;

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const email = formData.get("email");
    const subject = formData.get("subject");
    const message = formData.get("message");

    if (
      typeof subject !== "string" ||
      typeof message !== "string" ||
      typeof email !== "string" ||
      !email.trim() ||
      !subject.trim() ||
      !message.trim()
    ) {
      return Response.json(
        { error: "Faltan campos requeridos o son inválidos." },
        { status: 400 }
      );
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      subject.length > 200 ||
      message.length > 10000
    ) {
      return Response.json(
        { error: "Revisa el correo y la longitud de los campos." },
        { status: 400 }
      );
    }

    const from = import.meta.env.EMAIL_FROM;
    const recipient = import.meta.env.MY_EMAIL;
    if (!apiKey || !from || !recipient) {
      console.error("Falta configurar RESEND_API_KEY (o APIKEY), EMAIL_FROM o MY_EMAIL");
      return Response.json(
        { error: "El servicio de correo no está configurado." },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const { data: result, error } = await resend.emails.send({
      from,
      to: [recipient],
      replyTo: email.trim(),
      subject: subject.trim(),
      html: `<p>${escapeHtml(message.trim()).replace(/\r?\n/g, "<br>")}</p>`,
      text: message.trim(),
    });

    if (error) {
      console.error("Resend error:", error);
      return Response.json(
        { error: "Error al enviar el correo." },
        { status: 502 }
      );
    }



    return Response.json({
      success: true,
      id: result?.id,
      message: "Correo enviado correctamente.",
    });
  } catch (error) {
    console.error("Endpoint error:", error);
    return Response.json(
      { error: "Solicitud inválida o error interno." },
      { status: 500 }
    );
  }
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });
}
