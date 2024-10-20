import { CommonModule, KeyValuePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { Web5 } from '@web5/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, KeyValuePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'app';

  entries: any[] = [];

  // groups = new Map<string, any[]>();

  groups: { [key: string]: any } = {};

  // objectKeys = Object.keys;

  async load(did: string) {
    if (!did) {
      console.warn('No DID provided');
      return;
    }

    if (typeof Web5 !== 'undefined') {
      console.log('Web5 is available:', Web5);
      // You can now use Web5 here
    } else {
      console.error('Web5 is not available');
    }

    const { web5, did: userDid } = await Web5.Web5.connect();
    console.log(web5, userDid);

    // const urlParams = new URLSearchParams(window.location.search);
    // const did = urlParams.get('did');

    console.log('From DID:', did);

    const response = await web5.dwn.records.query({
      from: did,
      // from: 'did:dht:1ko4cqh7c7i9z56r7qwucgpbra934rngc5eyffg1km5k6rc5991o',
      message: {
        filter: {
          protocol: 'https://schema.ariton.app/text',
          protocolPath: 'entry',
          schema: 'https://schema.ariton.app/text/schema/entry',
          dataFormat: 'application/json',
        },
      },
    });

    console.log('response from query', response);

    // const template = document.getElementById('template');
    // const parentElement = document.getElementById('articles');

    // this.entries = [];

    if (response.records) {
      for (const record of response.records) {
        const data = await record.data.json();

        const entry = {
          record,
          data,
          id: record.id,
        };

        console.log(entry);

        for (const label of record.tags['labels'] as []) {
          if (label == null || label == '') {
            continue;
          }

          if (this.groups[label] == null) {
            this.groups[label] = [];
          }

          this.groups[label].push(entry);
        }

        // record.tags.labels

        // this.entries.push(entry);

        // const clonedTemplate = template.cloneNode(true);

        // // Remove a class by name from the cloned template
        // clonedTemplate.classList.remove('hidden');

        // const data = await record.data.json();
        // console.log("data", data);

        // clonedTemplate.querySelector('.img-responsive').src = data.image;
        // clonedTemplate.querySelector('.article-link').innerText = data.title;
        // clonedTemplate.querySelector('.article-categories').innerText = data.labels.join(', ');

        // // clonedTemplate.querySelector('.img-responsive').src = record.tags.image;
        // // clonedTemplate.querySelector('.article-link').innerText = record.tags.title;
        // clonedTemplate.querySelector('.article-date').innerText = new Date(record.dateModified).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

        // // Modify the cloned template as needed
        // // For example, if the template has a child element with class 'content', you can modify its text content
        // // clonedTemplate.querySelector('.content').textContent = // record.data.json().content;

        // // Append the cloned template to the parent element
        // parentElement.insertBefore(clonedTemplate, parentElement.firstChild);
      }
    }

    // template.classList.add('hidden');
  }

  ngOnInit() {
    this.load('did:dht:8qamgpthwxcqmxfb7bbj4rcuzej4qzr4em1aubr6u6s6npeq8foy');

    const lightIcon = document.getElementById('light-icon')!;
    const darkIcon = document.getElementById('dark-icon')!;

    const toggleButton = document.querySelector('.theme-toggle')!;
    const screenshotLight = document.querySelector('.screenshot-light')!;
    const screenshotDark = document.querySelector('.screenshot-dark')!;

    const htmlElement = document.documentElement;

    toggleButton.addEventListener('click', () => {
      if (htmlElement.getAttribute('data-theme') === 'dark') {
        htmlElement.removeAttribute('data-theme');
        htmlElement.style.setProperty('color-scheme', 'light');

        lightIcon.setAttribute('display', 'inline-block');
        darkIcon.setAttribute('display', 'none');

        screenshotLight.classList.remove('hidden');
        screenshotDark.classList.add('hidden');
      } else {
        htmlElement.setAttribute('data-theme', 'dark');
        htmlElement.style.setProperty('color-scheme', 'dark');

        lightIcon.setAttribute('display', 'none');
        darkIcon.setAttribute('display', 'inline-block');

        screenshotLight.classList.add('hidden');
        screenshotDark.classList.remove('hidden');
      }
    });

    const darkModeMediaQuery = window.matchMedia(
      '(prefers-color-scheme: dark)'
    );
    let darkMode = darkModeMediaQuery.matches;

    // console.log("DARK MODE?", darkMode);

    darkIcon.setAttribute('display', 'none');
  }
}
