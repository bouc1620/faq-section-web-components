const faqSectionStyles = `
	:host {
		min-width: 17.5rem;
		max-width: var(--faq-section-max-width, 1380px);
		margin: 0 auto;
		filter: drop-shadow(rgba(0, 0, 0, 0.25) 0 0.75rem 1.25rem);
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}
`;

customElements.define(
  'faq-section',
  class FAQSection extends HTMLElement {
    get faqItems() {
      return this.querySelectorAll('faq-item');
    }

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
				<style>${faqSectionStyles}</style>
				<slot></slot>
			`;
    }

    connectedCallback() {
      this.addEventListener('faq-toggle', (event) => {
        for (const faqItem of this.faqItems) {
          if (faqItem === event.detail.item) {
            faqItem.toggle();
          } else {
            faqItem.toggle('false');
          }
        }
      });
    }
  }
);
