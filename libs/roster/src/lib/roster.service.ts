import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, UserResponse, Article } from '@realworld/core/api-types';
import { ApiService } from '@realworld/core/http-client';
import { map } from 'rxjs';

export interface IUserRoster {
  id: number;
  image?: string;
  username: string;
  likes: number;
  articles: number;
  firstPublish: string;
}

@Injectable({ providedIn: 'root' })
export class RosterService {
  constructor(private apiService: ApiService) {}

  getArticles(): Observable<Article[]> {
    // q: how do I querey the api to give me a list of all users?
    // a: I don't know, but I'm going to try to figure it out.
    return this.articles().pipe(map((response) => response.articles));
  }
  articles(): Observable<{ articles: Article[]; articlesCount: number }> {
    return this.apiService.get('/articles');
  }

  getRoster(): Observable<IUserRoster[]> {
    // q: how do I querey the api to give me a list of all users?
    // a: I don't know, but I'm going to try to figure it out.
    return this.roster().pipe(map((response) => response));
  }
  roster(): Observable<IUserRoster[]> {
    return this.apiService.get('/articles/roster');
  }
}
