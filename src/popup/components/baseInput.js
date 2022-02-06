class BaseInput extends HTMLElement {
  constructor() {
    super();

    this.placeholder = "";
  }

  connectedCallback() {
    this.placeholder = '테스트';
    this.render()
  }

  
}
