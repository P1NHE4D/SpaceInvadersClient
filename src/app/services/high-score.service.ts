import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {catchError} from "rxjs/operators";
import {MpHighScore} from "../models/mp-high-score";
import {SpHighScore} from "../models/sp-high-score";

@Injectable({
  providedIn: 'root'
})
export class HighScoreService {
  private readonly baseUrl: string = 'http://localhost:5000/api';
  private readonly httpOptions = {
    headers: new HttpHeaders({'ContentType': 'application/json'})
  };

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Adds a high score entry to the database
   * @param highScoreEntry single or multi player high score
   */
  addScore<T extends SpHighScore | MpHighScore>(highScoreEntry: T): Observable<T> {
    let url: string;
    if (highScoreEntry instanceof SpHighScore) {
      url = `${this.baseUrl}/sp-high-score`
    } else {
      url = `${this.baseUrl}/mp-high-score`
    }
    return this.http.post<T>(url, highScoreEntry, this.httpOptions).pipe(
      catchError(this.handleError<T>())
    );
  }

  /**
   * Retrieves all single player high scores from server
   */
  getSpHighScores<T extends SpHighScore[]>(): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/sp-high-score`).pipe(
      catchError(this.handleError<T>())
    );
  }

  /**
   * Retrieves all multi player high scores from server
   */
  getMpHighScores<T extends MpHighScore[]>(): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/mp-high-score`).pipe(
      catchError(this.handleError<T>())
    );
  }

  private handleError<T> (result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    }
  }
}
