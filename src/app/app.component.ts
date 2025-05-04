import {
  Component,
  computed,
  effect,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CellCardComponent } from './components/cell-card/cell-card.component';
import { SupabaseService } from './supabase.service';
import { MessageModule } from 'primeng/message';
import { TagModule } from 'primeng/tag';

interface Cell {
  correctCellName: string;
  cellImageExtension: string;
  rightAnswer: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ButtonModule, CellCardComponent, MessageModule, TagModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  cells = computed(() => {
    const cells: Cell[] = this.supabaseService
      .cellNames()
      .map((cellNameWithExtension) => {
        const [correctCellName, cellImageExtension] =
          cellNameWithExtension.split('.');
        return {
          correctCellName,
          cellImageExtension,
          rightAnswer: false,
        };
      });
    return cells;
  });
  cellReponses = signal<Cell[]>([]);
  visitedCells: Cell[] = [];
  currentCell: WritableSignal<Cell | null> = signal<Cell | null>(null);
  noCellsRemaining = signal(false);
  amountCorrectCells = computed(
    () => this.cellReponses().filter((cell) => cell.rightAnswer).length
  );

  constructor(private supabaseService: SupabaseService) {
    effect(
      () => {
        this.getRandomCell();
      },
      {
        allowSignalWrites: true,
      }
    );

    effect(
      () => {
        const cells: Cell[] = this.supabaseService
          .cellNames()
          .map((cellNameWithExtension) => {
            const [correctCellName, cellImageExtension] =
              cellNameWithExtension.split('.');
            return {
              correctCellName,
              cellImageExtension,
              rightAnswer: false,
            };
          });
        this.cellReponses.set(cells);
      },
      {
        allowSignalWrites: true,
      }
    );
  }

  private getRandomCell() {
    const cells = this.cells();
    if (!cells.length) return;

    if (this.visitedCells.length === cells.length) {
      this.currentCell.set(null);
      this.noCellsRemaining.set(true);
      return;
    }

    const randomIndex = Math.floor(Math.random() * this.cells().length);
    const randomCell = this.cells().at(randomIndex) as Cell;
    console.log(randomCell);

    const cellAlreadyVisited = this.visitedCells.some(
      (cell) => cell.correctCellName === randomCell.correctCellName
    );

    if (cellAlreadyVisited) {
      this.getRandomCell();
      return;
    }

    this.visitedCells = [...this.visitedCells, randomCell];

    this.currentCell.set(randomCell);
  }

  clearVisitedCells() {
    this.visitedCells = [];
    this.cellReponses.update((prev) =>
      prev.map((cell) => ({ ...cell, rightAnswer: false }))
    );
    this.noCellsRemaining.set(false);
    this.getRandomCell();
  }

  nextCell() {
    this.getRandomCell();
  }

  updateCellResponses(isCorrectCell: boolean) {
    if (this.currentCell() && isCorrectCell) {
      const updatedCellsResponses = this.cellReponses()
        .map((cell) =>
          cell.correctCellName === this.currentCell()?.correctCellName
            ? { ...cell, rightAnswer: isCorrectCell }
            : cell
        )
        .sort();
      const sortedCells = updatedCellsResponses.sort(
        (a, b) => Number(b.rightAnswer) - Number(a.rightAnswer)
      );
      this.cellReponses.set(sortedCells);
    }
  }
}
