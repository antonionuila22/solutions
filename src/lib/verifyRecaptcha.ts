// src/lib/verifyRecaptcha.ts
import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise';

const projectID = import.meta.env.RECAPTCHA_ENTERPRISE_PROJECT_ID;
const recaptchaKey = import.meta.env.RECAPTCHA_ENTERPRISE_SITE_KEY;

export async function verifyRecaptchaToken(token: string, action = 'form_submit'): Promise<number | null> {
    if (!projectID || !recaptchaKey) {
        return null;
    }

    const client = new RecaptchaEnterpriseServiceClient();
    const projectPath = client.projectPath(projectID);

    const request = {
        assessment: {
            event: {
                token,
                siteKey: recaptchaKey,
            },
        },
        parent: projectPath,
    };

    try {
        const [response] = await client.createAssessment(request);

        if (!response.tokenProperties?.valid) {
            return null;
        }

        if (response.tokenProperties.action !== action) {
            return null;
        }

        return response.riskAnalysis?.score || null;
    } catch (error) {
        return null;
    }
}
