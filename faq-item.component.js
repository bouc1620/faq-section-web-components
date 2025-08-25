const faqItemStyles = `
	:host {
		background-color: var(--faq-section-faq-item-background-color, white);
		border: 1px solid var(--faq-section-faq-item-border-color, #dadada);
		border-radius: var(--faq-section-faq-item-border-radius, 0.375rem);
	}

	.faq-question {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		background-color: transparent;
		color: var(--faq-section-faq-item-question-color, #001041);
		width: 100%;
		font-size: 1.25rem;
		font-weight: 600;
		line-height: var(--faq-section-faq-item-question-line-height, 120%);
		padding: var(--faq-section-faq-item-padding, 2.25rem);
		text-align: start;
		border: 0;
		outline-offset: -0.25rem;
		border-radius: var(--faq-section-faq-item-border-radius, 0.375rem);
		cursor: pointer;
		overflow: hidden;
	}

	.faq-cross-icon {
		position: relative;
		min-width: 1.5rem;
		min-height: 1.5rem;
	}

	.faq-cross-icon span {
		position: absolute;
		background-color: currentColor;
		border-radius: 0.125rem;

		transition: 0.3s;
	}

	.faq-cross-icon span:first-child {
		top: 0;
		bottom: 0;
		width: 0.25rem;
		left: 42%;
	}

	.faq-cross-icon span:last-child {
		left: 0;
		right: 0;
		height: 0.25rem;
		top: 42%;
	}

	.faq-question[aria-expanded='true'] .faq-cross-icon span {
		transform: rotate(90deg);
	}

	.faq-question[aria-expanded='true'] .faq-cross-icon span:last-child {
		left: 50%;
		right: 50%;
	}

	.faq-answer {
		display: grid;
		grid-template-rows: 0fr;
		background-color: transparent;
		color: var(--faq-section-faq-item-answer-color, black);

		transition: grid-template-rows 0.3s ease;
	}

	.faq-answer[aria-hidden='false'] {
		grid-template-rows: 1fr;
	}

	.faq-answer > * {
		overflow: hidden;
	}

	.faq-answer .answer-container {
		margin: 0;
		padding: 0 var(--faq-section-faq-item-padding)
			var(--faq-section-faq-item-padding)
			var(--faq-section-faq-item-padding);
		line-height: var(--faq-section-faq-item-answer-line-height, 175%);
	}

	@media (prefers-reduced-motion: reduce) {
		.faq-cross-icon span {
			transition: none;
		}
		
		.faq-answer {
			transition: none;
		}
	}
`;

customElements.define(
  'faq-item',
  class FAQItem extends HTMLElement {
    static instanceNumber = 0;

    static get observedAttributes() {
      return ['is-open'];
    }

    get isOpen() {
      return this.getAttribute('is-open');
    }

    set isOpen(value) {
      return this.setAttribute('is-open', value);
    }

    get questionElement() {
      return this.shadowRoot.querySelector('.faq-question');
    }

    get answerElement() {
      return this.shadowRoot.querySelector('.faq-answer');
    }

    constructor() {
      super();
      this._id = FAQItem.instanceNumber++;
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
				<style>${faqItemStyles}</style>
				<button
					id="faq-question-${this._id}"
					class="faq-question"
					aria-expanded="false"
					aria-controls="faq-answer-${this._id}"
				>
					<slot name="question" role="heading"></slot>
					<span class="faq-cross-icon"><span></span><span></span></span>
				</button>
				<div class="faq-answer" id="faq-answer-${this._id}" aria-labelledby="faq-question-${this._id}" aria-hidden="true" role="region" inert="inert">
					<div>
						<div class="answer-container">
							<slot name="answer"></slot>
						</div>
					</div>
				</div>
			`;
    }

    connectedCallback() {
      this.setAttribute('is-open', 'false');

      const dispatchToggleEvent = () => {
        this.dispatchEvent(
          new CustomEvent('faq-toggle', {
            bubbles: true,
            composed: true,
            detail: { item: this },
          })
        );
      };

      this.questionElement.addEventListener('mousedown', (event) => {
        if (!event || event.button !== 0) {
          return;
        }

        dispatchToggleEvent();
      });

      this.questionElement.addEventListener('keydown', (event) => {
        if (!event || (event.key !== 'Enter' && event.key !== ' ')) {
          return;
        }

        dispatchToggleEvent();
      });
    }

    attributeChangedCallback(name, _oldValue, newValue) {
      if (name !== 'is-open') {
        return;
      }

      if (newValue === 'true') {
        this.questionElement.setAttribute('aria-expanded', 'true');
        this.answerElement.removeAttribute('inert');
        this.answerElement.setAttribute('aria-hidden', 'false');
      } else if (newValue === 'false') {
        this.questionElement.setAttribute('aria-expanded', 'false');
        this.answerElement.setAttribute('inert', 'inert');
        this.answerElement.setAttribute('aria-hidden', 'true');
      }
    }

    toggle(value) {
      value =
        value ??
        (this.isOpen === undefined || this.isOpen === 'false'
          ? 'true'
          : 'false');
      this.isOpen = value;
    }
  }
);
