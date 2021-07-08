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

  constructor(private deviceService: DeviceService) { }

  ngOnInit(): void {
    this.setupTable();

    this.form = new FormGroup({
      searchKey: new FormControl(''),
    });

    this.form.controls['searchKey'].valueChanges
      .pipe(takeUntil(this.stop$))
      .subscribe(value => {
        let tempRows = this.originalRows;
        this.deviceTable.rows  = tempRows.filter(row => row.model.toLowerCase().includes(value.toLowerCase())
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

  ngOnDestroy() {
    // Ends the open observable subscriptions
    this.stop$.next();
    this.stop$.complete();
  }

}
