// src/lib/verifyRecaptcha.ts
import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise';

const projectID = 'solutions-codebr-1748634875071';
const recaptchaKey = '6Lf6olArAAAAALJssnzah9pMjSczKZQIZYBglamB';

export async function verifyRecaptchaToken(token: string, action = 'form_submit'): Promise<number | null> {
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

    const [response] = await client.createAssessment(request);

    if (!response.tokenProperties?.valid) {
        console.error(`Invalid token: ${response.tokenProperties?.invalidReason}`);
        return null;
    }

    if (response.tokenProperties.action !== action) {
        console.error(`Action mismatch: ${response.tokenProperties.action}`);
        return null;
    }

    return response.riskAnalysis?.score || null;
}
