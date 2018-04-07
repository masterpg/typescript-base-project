import '@polymer/paper-button/paper-button';
import '@polymer/polymer/polymer';
import { html } from '@polymer/polymer/lib/utils/html-tag';

import '../../../styles/base-styles';
import { BaseUIElement } from '../../base-element';
import { customElement } from '../../../polymer-decorators';

@customElement('sample3-view')
export class Sample3View extends BaseUIElement {

  static get template() {
    return html`
      <style include="base-styles">
        :host {
          display: block;
        }
      </style>

      <div class="card">
        <div class="circle">3</div>
        <h1>View Three</h1>
        <p>Ea duis bonorum nec, falli paulo aliquid ei eum.</p>
        <p>Id nam odio natum malorum, tibique copiosae expetenda mel ea.Detracto suavitate repudiandae no eum. Id adhuc minim soluta nam.Id nam odio natum malorum, tibique copiosae expetenda mel ea.</p>
      </div>
    `;
  }
}
