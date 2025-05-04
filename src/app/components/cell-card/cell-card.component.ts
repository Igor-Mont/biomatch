import {
  Component,
  computed,
  effect,
  EventEmitter,
  input,
  Output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TagModule } from 'primeng/tag';

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
    TagModule,
  ],
  templateUrl: './cell-card.component.html',
  styleUrl: './cell-card.component.scss',
})
export class CellCardComponent {
  @Output() onValidateCell = new EventEmitter<boolean>();
  readonly baseURLStorage =
    'https://tbbgozdyagxrctknmptj.supabase.co/storage/v1/object/public/biomatch/cells';

  cellName: string = '';
  correctCellName = input.required<string>();
  initialVowelsOfCorrectCellName = computed(() => {
    const [firstVowel, secondVowel] = this.correctCellName();
    return `${firstVowel} ${secondVowel}`.toUpperCase();
  });
  showTip = signal(false);
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
        this.cellImageExtension();
        this.correctCellName();
        this.showTip.set(false);
        this.cellNameIsCorrect.set(false);
        this.cellNameIsSubmitted.set(false);
      },
      {
        allowSignalWrites: true,
      }
    );
  }

  checkCellName(event?: KeyboardEvent) {
    if (event && event.key !== 'Enter') return;

    this.cellNameIsSubmitted.set(true);

    const cellNameNormalized = this.normalizeCellName(this.cellName);
    const correctCellNameNormalized = this.normalizeCellName(
      this.correctCellName()
    );

    const correctCell =
      cellNameNormalized === correctCellNameNormalized ||
      this.areCellNamesEquivalent(
        cellNameNormalized,
        correctCellNameNormalized
      );

    this.cellNameIsCorrect.set(correctCell);
    this.onValidateCell.emit(correctCell);
  }

  toggleShowTip() {
    this.showTip.update((prev) => !prev);
  }

  private normalizeCellName(cellName: string) {
    return cellName
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  private areCellNamesEquivalent(
    cellNameNormalized: string,
    correctCellNameNormalized: string
  ) {
    const spplitedCellNameNormalized = cellNameNormalized.split(' ');
    const spplitedCorrectCellNameNormalized =
      correctCellNameNormalized.split(' ');

    return spplitedCellNameNormalized.some((spplitedCellName) =>
      spplitedCorrectCellNameNormalized.includes(spplitedCellName)
    );
  }
}
