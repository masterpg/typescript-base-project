import '@polymer/paper-button/paper-button';
import '@polymer/polymer/polymer';
import * as view from './index.html';

import '../../../styles/base-styles';
import { BaseUIElement } from '../../base-element';
import { customElement } from '../../../polymer-decorators';

@customElement('sample2-view')
export class Sample2View extends BaseUIElement {

  static get template() {
    return view;
  }
}
