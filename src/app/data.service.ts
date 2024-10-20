import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  groups: { [key: string]: any } = {};
  loaded = false;

  constructor() {}

  // Method to flatten groups to unique entries
  private flattenGroups(): any[] {
    const uniqueEntries = new Set<any>();
    for (const key in this.groups) {
      if (this.groups.hasOwnProperty(key)) {
        this.groups[key].forEach((entry: any) => uniqueEntries.add(entry));
      }
    }
    return Array.from(uniqueEntries);
  }

  // Method to check if an entry with the given recordId is unique
  private isUniqueRecordId(recordId: string): boolean {
    const flattenedGroups = this.flattenGroups();
    const recordIds = flattenedGroups.map((entry) => entry.id);
    return recordIds.filter((id) => id === recordId).length <= 1;
  }

  // Method to filter and find the entry with the supplied recordId
  entry(recordId: string): any {
    if (!this.isUniqueRecordId(recordId)) {
      throw new Error(`Record ID ${recordId} is not unique.`);
    }

    const flattenedGroups = this.flattenGroups();
    return flattenedGroups.find((entry) => entry.id === recordId);
  }
}
