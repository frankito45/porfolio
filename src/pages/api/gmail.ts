
export const prerender = false;

import type { APIRoute } from "astro";

export const POST:APIRoute = async ({request}) => {

    try {
        const data = await request.json();
        const {to,  body} = data;


        if(!to || !body) {
            return new Response(JSON.stringify({error: "Faltan requerimientos"}), {status: 400});
        }

        
        return new Response(JSON.stringify({message: "Correo enviado correctamente"}), {status: 200});
    
    
    }

    catch (error) {
        return new Response(JSON.stringify({error: "Error al enviar el correo"}), {status: 500});
    }
}
    



