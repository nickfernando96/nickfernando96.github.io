import { cursos } from './../app.component.model';
import { HttpClient } from '@angular/common/http'; 
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';


@Injectable()
export class AppLerDbJson {
    
    constructor(private http: HttpClient) {}

    public getJSON(): Observable<cursos[]> {
        return this.http.get<cursos[]>('./assets/db/db.json');
    }
    
}