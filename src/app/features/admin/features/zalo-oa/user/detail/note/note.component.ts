import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass, faXmark, faRotate } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { ZaloUserNoteService } from '../../../../../../shared/services/zalo_oa/user/zalo-user-note.service';
import { ZaloUserNoteResponse } from '../../../../../../models/responses/zalo_oa/user/zalo-user-note.response';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule]
})
export class NoteComponent implements OnInit {
    faMagnifyingGlass = faMagnifyingGlass;
    faXmark = faXmark;
    faRotate = faRotate;

    userId: string = '';
    notes: ZaloUserNoteResponse[] = [];
    loading: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private noteService: ZaloUserNoteService
    ) {}

    ngOnInit(): void {
        this.userId = this.route.parent?.snapshot.paramMap.get('userId') || '';
        this.loadNotes();
    }

    loadNotes(): void {
        this.loading = true;
        this.noteService.getAllNotesByUserId(this.userId).subscribe({
            next: (res) => {
                this.notes = res;
                this.loading = false;
            },
            error: () => { this.loading = false; }
        });
    }
} 