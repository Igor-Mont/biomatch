import { Component, computed, effect, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-cell-card',
  standalone: true,
  imports: [
    CardModule,
    ImageModule,
    ButtonModule,
    FormsModule,
    InputTextModule,
    MessageModule,
  ],
  templateUrl: './cell-card.component.html',
  styleUrl: './cell-card.component.scss',
})
export class CellCardComponent {
  readonly baseURLStorage =
    'https://tbbgozdyagxrctknmptj.supabase.co/storage/v1/object/public/biomatch/cells';

  cellName: string = '';
  correctCellName = input.required<string>();
  cellImageExtension = input.required<string>();
  cellNameIsSubmitted = signal(false);
  cellNameIsCorrect = signal(false);
  cellImageURL = computed(
    () =>
      `${this.baseURLStorage}/${encodeURIComponent(
        this.correctCellName()
      )}.${this.cellImageExtension()}`
  );

  constructor() {
    effect(
      () => {
        this.cellName = '';
        console.log(this.cellImageExtension());
        console.log(this.correctCellName());
        this.cellNameIsCorrect.set(false);
        this.cellNameIsSubmitted.set(false);
      },
      {
        allowSignalWrites: true,
      }
    );
  }

  checkCellName() {
    this.cellNameIsSubmitted.set(true);
    this.cellNameIsCorrect.set(this.cellName === this.correctCellName());
  }
}
