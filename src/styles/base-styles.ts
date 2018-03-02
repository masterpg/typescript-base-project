import '@polymer/polymer/polymer';
import '@polymer/iron-flex-layout/iron-flex-layout';
import '@polymer/iron-flex-layout/iron-flex-layout-classes';
import '@polymer/paper-styles/color';
import '@polymer/paper-styles/typography';
const $_documentContainer = document.createElement('div');
$_documentContainer.setAttribute('style', 'display: none;');

$_documentContainer.innerHTML = `
  <dom-module id="base-styles">
    <template>
      <style include="iron-flex iron-flex-alignment iron-flex-reverse iron-flex-factors iron-positioning">

        :host {
          box-sizing: border-box;
        }

        * {
          box-sizing: border-box;
          outline: none;
        }

        .hidden {
          display: none;
        }

        .card {
          margin: 24px;
          padding: 16px;
          color: #757575;
          border-radius: 5px;
          background-color: #fff;
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
        }

        .circle {
          display: inline-block;
          width: 64px;
          height: 64px;
          text-align: center;
          color: #555;
          border-radius: 50%;
          background: #ddd;
          font-size: 30px;
          line-height: 64px;
        }

        h1 {
          margin: 16px 0;
          color: #212121;
          font-size: 22px;
        }

      </style>
    </template>
  </dom-module>
`;

document.head.appendChild($_documentContainer);