// src/pages/api/verify-recaptcha.ts
import type { APIRoute } from 'astro';
import { verifyRecaptchaToken } from '../../lib/verifyRecaptcha';

export const POST: APIRoute = async ({ request }) => {
    const formData = await request.formData();
    const token = formData.get('token')?.toString();

    if (!token) {
        return new Response('Missing reCAPTCHA token', { status: 400 });
    }

    try {
        const score = await verifyRecaptchaToken(token);

        if (score !== null && score >= 0.5) {
            return new Response('Human verified ✅', { status: 200 });
        } else {
            return new Response('Bot detection triggered ❌', { status: 403 });
        }
    } catch (err) {
        console.error(err);
        return new Response('Error verifying token', { status: 500 });
    }
};
