import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeviceTable } from 'src/app/models/device-table.model';
import { DeviceService } from 'src/app/services/device.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';



@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {

  // Shared Subject for completing observables
  private stop$: Subject<void> = new Subject<void>();


  deviceTable: DeviceTable;
  form: FormGroup;
  private originalRows: any;
  private sortAscending: boolean = true;

  // Default to filtering by device model
  searchKey: string = 'model';

  constructor(private deviceService: DeviceService) { }

  ngOnInit(): void {
    this.setupTable();

    this.form = new FormGroup({
      search: new FormControl(''),
    });

    this.form.controls['search'].valueChanges
      .pipe(takeUntil(this.stop$))
      .subscribe(value => {
        let tempRows = this.originalRows;
        this.deviceTable.rows  = tempRows.filter(row => row[this.searchKey].toLowerCase().includes(value.toLowerCase())
        );
      });
  }

  private setupTable(): void {
    this.deviceService.getAll()
      .pipe(take(1))
      .subscribe((data: DeviceTable) => {
        this.deviceTable = data;
        console.log(this.deviceTable);
        this.originalRows = data.rows;
      });
  }

  changeSearch(searchType: string) {
    this.searchKey = searchType;
  }

  sortRows(sortType: string) {
    this.deviceTable.rows = this.deviceTable.rows.sort((row1, row2) => {
      const type1 = row1[sortType].toLowerCase();
      const type2 = row2[sortType].toLowerCase();

      return this.sortAscending ? this.ascendingCompare(type1, type2) : this.descendingCompare(type1, type2);
    });
    this.sortAscending = !this.sortAscending;
  }

  private ascendingCompare(type1, type2) {
    let compare = 0;
    if (type1 > type2) {
      compare = 1;
    } else if (type1 < type2) {
      compare = -1;
    }
    return compare;
  }

  private descendingCompare(type1, type2) {
    let compare = 0;
    if (type1 < type2) {
      compare = 1;
    } else if (type1 > type2) {
      compare = -1;
    }
    return compare;
  }


  ngOnDestroy() {
    // Ends the open observable subscriptions
    this.stop$.next();
    this.stop$.complete();
  }

}
