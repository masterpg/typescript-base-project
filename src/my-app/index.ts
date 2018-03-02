import '@polymer/polymer/polymer';
import {Element as PolymerElement} from '@polymer/polymer/polymer-element';
import '@polymer/paper-button/paper-button';
import '../styles/base-styles';
import * as api from '../api';

export class MyApp extends PolymerElement {

  static get template() {
    return `
      <style include="base-styles">
        :host {
          display: block;
          margin: 10px;
        }

        paper-button {
          font-size: 14px;
          color: var(--paper-indigo-500);
          --paper-button: {
            margin: 0;
            padding: 0;
          }
        }

        .posts {
          border-collapse: collapse; 
        }

        .posts thead th {
          text-align: left;
          font-weight: normal;
        }
        
        .posts thead th.id {
          width: 40px;
        }

        .posts thead th.title {
          width: 150px;
        }
        
        .posts thead th.author {
          width: 150px;
        }
      </style>

      <div class="main">
        <paper-button on-click="__buttonOnClick">Load posts</paper-button>
        <table class="posts">
          <thead>
            <th class="id">ID</th>
            <th class="title">Title</th>
            <th class="author">Author</th>
          </thead>
          <tbody>
            <template is="dom-repeat" items="[[__posts]]">
              <tr>
                <td>[[item.id]]</td>
                <td>[[item.title]]</td>
                <td>[[item.author]]</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    `;
  }

  constructor() {
    super();
  }

  __posts: api.Post[];

  async __buttonOnClick(e) {
    const posts = await api.getPosts();
    posts.forEach((item, index, list) => {
      console.log('id:', item.id, ', title:', item.title, ', author:', item.author);
    });
    this.__posts = posts;
  }
}

customElements.define('my-app', MyApp);