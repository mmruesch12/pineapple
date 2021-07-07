import { Component, OnInit } from '@angular/core';
import { DeviceTable } from 'src/app/models/device-table.model';
import { DeviceService } from 'src/app/services/device.service';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  deviceTable: DeviceTable;
  form: FormGroup;
  private originalRows: any;

  constructor(private deviceService: DeviceService) { }

  ngOnInit(): void {
    this.setupTable();

    this.form = new FormGroup({
      searchKey: new FormControl(''),
    });

    this.form.controls['searchKey'].valueChanges.subscribe(value => {
      if (value === '') {
        this.deviceTable.rows = this.originalRows;
      }
      this.deviceTable.rows  = this.deviceTable.rows.filter(row => row.model.toLowerCase().includes(value.toLowerCase())
      );
    });
  }

  private setupTable(): void {
    this.deviceService.getAll().subscribe((data: DeviceTable) => {
      this.deviceTable = data;
      this.originalRows = data.rows;
    });
  }

}
