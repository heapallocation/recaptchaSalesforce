import { LightningElement } from 'lwc';

export default class RecaptchaInvisible extends LightningElement {
    recaptchaSuccess = false;

    connectedCallback() {
        document.addEventListener('grecaptchaVerified', this.handleRecaptchaResponse.bind(this));
        document.addEventListener('grecaptchaError', this.handleRecaptchaError.bind(this));
    }

    renderedCallback() {
        //valide values for badge: bottomright bottomleft inline
        const recaptchaElement = this.template.querySelector('.g-recaptcha');
        console.log('Recaptcha element:', recaptchaElement);
        var payload = { element: recaptchaElement, badge: 'bottomright' };
        document.dispatchEvent(new CustomEvent('grecaptchaRender', { detail: payload }));
    }

    handleRecaptchaResponse(event) {
        const response = event.detail.response;
        this.recaptchaSuccess = true;
        console.log('Recaptcha response:', recaptchaSuccess);
    }   

    handleRecaptchaError(event) {
        const error = event.detail.error;
        console.error('Recaptcha error:', error);
    }

    handleSubmit() {
        document.dispatchEvent(new Event('grecaptchaExecute'));
    }
}