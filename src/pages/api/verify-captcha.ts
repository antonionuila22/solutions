import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
    try {
        const { event } = await request.json();
        const { token, expectedAction } = event;

        if (!token) {
            return new Response(JSON.stringify({ success: false, message: 'No token provided' }), { status: 400 });
        }

        const secretKey = import.meta.env.RECAPTCHA_SECRET_KEY; // Guardá tu secret en el .env

        const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                secret: secretKey,
                response: token,
            }),
        });

        const verifyData = await verifyRes.json();

        if (!verifyData.success) {
            return new Response(JSON.stringify({ success: false, message: 'reCAPTCHA verification failed' }), { status: 400 });
        }

        if (expectedAction && verifyData.action !== expectedAction) {
            return new Response(JSON.stringify({ success: false, message: 'Unexpected action' }), { status: 400 });
        }

        return new Response(JSON.stringify({ success: true }), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify({ success: false, message: 'Server error' }), { status: 500 });
    }
};
