import { CommonModule, KeyValuePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, KeyValuePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
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

    console.log('Response:', response.records);

    if (response.records) {
      for (const record of response.records) {
        console.log('REcord:', record);

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

    console.log(this.groups);
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  ngOnInit() {
    this.load('did:dht:8qamgpthwxcqmxfb7bbj4rcuzej4qzr4em1aubr6u6s6npeq8foy');
  }
}
