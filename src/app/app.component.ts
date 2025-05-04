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

interface Cell {
  correctCellName: string;
  cellImageExtension: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ButtonModule, CellCardComponent, MessageModule],
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
        };
      });
    return cells;
  });
  visitedCells: Cell[] = [];
  currentCell: WritableSignal<Cell | null> = signal<Cell | null>(null);
  noCellsRemaining = signal(false);

  constructor(private supabaseService: SupabaseService) {
    effect(
      () => {
        this.getRandomCell();
      },
      {
        allowSignalWrites: true,
      }
    );
  }

  private getRandomCell() {
    const cells = this.cells();
    if (this.visitedCells.length === 5) {
      this.currentCell.set(null);
      this.noCellsRemaining.set(true);
      return;
    }

    if (!cells.length) return;

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
    this.noCellsRemaining.set(false);
    this.getRandomCell();
  }

  nextCell() {
    this.getRandomCell();
  }
}
