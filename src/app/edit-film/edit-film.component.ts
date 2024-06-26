import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MaterialModule } from '../../modules/material.module';
import { map, of, switchMap, tap } from 'rxjs';
import { FilmsService } from '../../services/films.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {Film} from "../../entities/film";

@Component({
  selector: 'app-edit-film',
  standalone: true,
  imports: [MaterialModule, RouterLink, ReactiveFormsModule],
  templateUrl: './edit-film.component.html',
  styleUrl: './edit-film.component.css'
})
export class EditFilmComponent implements OnInit{
  route = inject(ActivatedRoute);
  filmsService = inject(FilmsService);
  filmId? :number;
  film = new Film('',0, '');
  editForm = new FormGroup({
    nazov: new FormControl('',{
      validators: [Validators.required, Validators.minLength(3)]
    }),
    rok: new FormControl(0,[Validators.required]),
    slovenskyNazov: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.filmsService.getFilms().pipe(
      switchMap(films => this.route.paramMap),
      map(params => Number(params.get('id')) || undefined),
      tap(id => this.filmId = id),
      switchMap(id => id ? this.filmsService.getFilm(id): of(new Film('', 0, '')))
    ).subscribe(film => {
      this.film = film;
      console.log("Editing film:", film);
      this.editForm.patchValue({
        nazov: film.nazov,
        rok: film.rok,
        slovenskyNazov: film.slovenskyNazov,
      });
    });
  }

  submit() {
    this.film.nazov = this.nazov.value.trim();
    this.film.rok = this.rok.value;
    this.film.slovenskyNazov = this.slovenskyNazov.value.trim();
  }

  get nazov():FormControl<string> {
    return this.editForm.get('nazov') as FormControl<string>;
  }
  get rok():FormControl<number> {
    return this.editForm.get('rok') as FormControl<number>;
  }
  get slovenskyNazov():FormControl<string> {
    return this.editForm.get('slovenskyNazov') as FormControl<string>;
  }
}
