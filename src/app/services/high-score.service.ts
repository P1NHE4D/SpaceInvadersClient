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
  private readonly BASEURL: string = 'http://localhost:5000/api';
  private readonly HTTPOPTIONS = {
    headers: new HttpHeaders({'ContentType': 'application/json'})
  };

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Adds a single player high score entry to the database
   * @param highScoreEntry single player high score
   */
  addSpHighScore<T extends SpHighScore>(highScoreEntry: T): Observable<T> {
    return this.http.post<T>(`${this.BASEURL}/sp-high-score`, highScoreEntry, this.HTTPOPTIONS).pipe(
      catchError(this.handleError<T>())
    );
  }

  /**
   * Adds a multi player high score entry tp the database
   * @param highScoreEntry  multi player high score
   */
  addMpHighScore<T extends MpHighScore>(highScoreEntry: T): Observable<T> {
    return this.http.post<T>(`${this.BASEURL}/mp-high-score`, highScoreEntry, this.HTTPOPTIONS).pipe(
      catchError(this.handleError<T>())
    );
  }

  /**
   * Retrieves all single player high scores from server
   */
  getSpHighScores<T extends SpHighScore[]>(): Observable<T> {
    return this.http.get<T>(`${this.BASEURL}/sp-high-score`).pipe(
      catchError(this.handleError<T>())
    );
  }

  /**
   * Retrieves all multi player high scores from server
   */
  getMpHighScores<T extends MpHighScore[]>(): Observable<T> {
    return this.http.get<T>(`${this.BASEURL}/mp-high-score`).pipe(
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
