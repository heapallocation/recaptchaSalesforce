import { LightningElement, api } from 'lwc';
import { FlowAttributeChangeEvent, FlowNavigationNextEvent } from "lightning/flowSupport";

export default class FlowRecaptcha extends LightningElement {
    @api availableActions = [];
    @api recaptchaResponse = 'No recaptcha yet';
    hasRendered = false;

    connectedCallback() {
        console.log('connectedCallback called');
        document.addEventListener('grecaptchaVerified', this.handleRecaptchaResponse.bind(this));
        console.log('Recaptcha event listener for grecaptchaVerified added');
        document.addEventListener('grecaptchaError', this.handleRecaptchaError.bind(this));
        console.log('Recaptcha event listener for grecaptchaError added');
    }

    renderedCallback() {
        if (!this.hasRendered) {
            console.log('renderedCallback called');
            // Valid values for badge: bottomright, bottomleft, inline
            const recaptchaElement = this.template.querySelector('.g-recaptcha');
            console.log('Recaptcha element:', recaptchaElement);
            var payload = { element: recaptchaElement, badge: 'bottomright' };
            document.dispatchEvent(new CustomEvent('grecaptchaRender', { detail: payload }));
            console.log('grecaptchaRender event dispatched');
            this.hasRendered = true; // Set the flag to prevent re-rendering
        }
    }

    handleRecaptchaResponse(event) {
        console.log('handleRecaptchaResponse called');
        if (this.recaptchaResponse === 'No recaptcha yet') {
            console.log('going to set response');
            console.log('change test');
            console.log('Recaptcha response:', this.recaptchaResponse);
            console.log('version 1');
            this.setResponse('Passed');
        }
    }

    handleRecaptchaError(event) {
        if (this.recaptchaResponse === 'No recaptcha yet') {
            const error = event.detail.error;
            console.error('Recaptcha error:', error);
            this.setResponse('Failed');
        }
    }

    setResponse(response) {
        console.log('setResponse called with response:', response);
        const changeEvent = new FlowAttributeChangeEvent('recaptchaResponse', response);
        this.dispatchEvent(changeEvent);
        console.log('FlowAttributeChangeEvent dispatched with response:', response);
        this.nextFlowAction();
    }

    nextFlowAction() {
        console.log('handleGoNext called');
        // Check if NEXT is allowed on this screen
        if (this.availableActions.find((action) => action === 'NEXT')) {
            console.log('NEXT action found');
            // Navigate to the next screen
            const navigateNextEvent = new FlowNavigationNextEvent();
            this.dispatchEvent(navigateNextEvent);
            console.log('FlowNavigationNextEvent dispatched');
        } else {
            console.log('NEXT action not found');
        }
    }

    handleSubmit() {
        console.log('Executing Recaptcha');
        document.dispatchEvent(new Event('grecaptchaExecute'));
        console.log('Recaptcha executed');
    }
}