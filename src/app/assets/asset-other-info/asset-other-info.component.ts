import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Asset } from 'src/app/models/asset';

@Component({
  selector: 'app-asset-other-info',
  templateUrl: './asset-other-info.component.html',
  styleUrls: ['./asset-other-info.component.scss']
})
export class AssetOtherInfoComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public asset: Asset) { }

  ngOnInit() {
  }

}
