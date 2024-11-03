import { CommonModule, KeyValuePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, KeyValuePipe, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  sanitizer = inject(DomSanitizer);

  data = inject(DataService);

  title = 'app';

  // entries: any[] = [];

  // groups: { [key: string]: any } = {};

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

    // const urlParams = new URLSearchParams(window.location.search);
    // const did = urlParams.get('did');

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

    // Reset all previously loaded data.
    this.data.groups = {};

    if (response.records) {
      for (const record of response.records) {
        const data = await record.data.json();

        const entry = {
          record,
          data,
          id: record.id,
        };

        if (record.tags) {
          for (const label of record.tags['labels'] as []) {
            if (label == null || label == '') {
              continue;
            }

            if (this.data.groups[label] == null) {
              this.data.groups[label] = [];
            }

            this.data.groups[label].push(entry);
          }
        }
      }
    }

    this.loading = false;
    this.data.loaded = true;
    this.data.complete = true;
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  ngOnInit() {
    if (!this.data.complete) {
      this.load('did:dht:wfcf3guhgb183rbfx5r4a5u3kh9tgjnmdp75xdphyj6wbaxxym7o');
    } else {
      this.loading = false;
    }
  }
}
