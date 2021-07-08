import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DeviceTable } from '../models/device-table.model';
import { Device } from '../models/device.model';

@Injectable({
  providedIn: 'root'
})
export class TableUtilService {

  private sortAscending: boolean = false;

  constructor() { }

  sortRows(deviceTable: DeviceTable, sortType: string): Device[] {
    this.sortAscending = !this.sortAscending;

    return deviceTable.rows.sort((row1, row2) => {
      const type1 = row1[sortType].toLowerCase();
      const type2 = row2[sortType].toLowerCase();
      return this.sortAscending ? this.ascendingSort(type1, type2) : this.descendingSort(type1, type2);
    });
  }

  private ascendingSort(type1, type2): number {
    let compare = 0;
    if (type1 > type2) {
      compare = 1;
    } else if (type1 < type2) {
      compare = -1;
    }
    return compare;
  }

  private descendingSort(type1, type2): number {
    let compare = 0;
    if (type1 < type2) {
      compare = 1;
    } else if (type1 > type2) {
      compare = -1;
    }
    return compare;
  }

}
