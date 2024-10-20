import { CommonModule, KeyValuePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, KeyValuePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  sanitizer = inject(DomSanitizer);

  title = 'app';

  entries: any[] = [];

  groups: { [key: string]: any } = {};

  loading = true;

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
      message: {
        filter: {
          protocol: 'https://schema.ariton.app/text',
          protocolPath: 'entry',
          schema: 'https://schema.ariton.app/text/schema/entry',
          dataFormat: 'application/json',
        },
      },
    });

    if (response.records) {
      for (const record of response.records) {
        const data = await record.data.json();

        const entry = {
          record,
          data,
          id: record.id,
        };

        for (const label of record.tags['labels'] as []) {
          if (label == null || label == '') {
            continue;
          }

          if (this.groups[label] == null) {
            this.groups[label] = [];
          }

          this.groups[label].push(entry);
        }
      }
    }

    this.loading = false;
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
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
