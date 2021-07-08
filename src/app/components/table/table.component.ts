import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeviceTable } from 'src/app/models/device-table.model';
import { DeviceService } from 'src/app/services/device.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { TableUtilService } from 'src/app/services/table-util.service';



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

  // Default to filtering by device model
  searchKey: string = 'model';

  constructor(private deviceService: DeviceService, private tableUtilService: TableUtilService) { }

  ngOnInit(): void {
    this.setupTable();
    this.setupForm();
    this.subscribeToFormChanges();
  }

  // Changes the header key that we filter upon when user clicks option
  changeFilter(searchType: string): void {
    this.form.controls['search'].setValue(''); // Reset search
    this.searchKey = searchType; // Set filter key
  }

  // Sorts the rows alphabetically based on which column button is clicked
  sortRows(sortType: string): void {
    this.deviceTable.rows = this.tableUtilService.sortRows(this.deviceTable, sortType);
  }

  private subscribeToFormChanges(): void {
    this.form.controls['search'].valueChanges
      .pipe(takeUntil(this.stop$))
      .subscribe(value => {
        let tempRows = this.originalRows;
        this.deviceTable.rows  = tempRows.filter(row => row[this.searchKey].toLowerCase().includes(value.toLowerCase())
        );
      });
  }

  private setupForm(): void {
    this.form = new FormGroup({
      search: new FormControl(''),
    });
  }

  private setupTable(): void {
    this.deviceService.getAll()
      .pipe(take(1))
      .subscribe((data: DeviceTable) => {
        this.deviceTable = data;
        this.originalRows = data.rows;
      });
  }

  ngOnDestroy() {
    // Ends the open observable subscriptions
    this.stop$.next();
    this.stop$.complete();
  }

}
