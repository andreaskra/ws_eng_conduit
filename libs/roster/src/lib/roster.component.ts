import { CommonModule } from '@angular/common';
import { DynamicFormComponent, Field, formsActions, ListErrorsComponent, ngrxFormsQuery } from '@realworld/core/forms';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { authActions, selectUser } from '@realworld/auth/data-access';
import { IUserRoster, RosterService } from './roster.service';
import { User, UserResponse, Article } from '@realworld/core/api-types';
import { Store } from '@ngrx/store';
import {
  articleListInitialState,
  articleListQuery,
  articleListActions,
  ListType,
} from '@realworld/articles/data-access';
import { ArticleListComponent } from '@realworld/articles/feature-articles-list/src';
import { selectLoggedIn } from '@realworld/auth/data-access';
import { RouterModule } from '@angular/router';

@UntilDestroy()
@Component({
  standalone: true,
  selector: 'cdt-roster',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.css'],
  imports: [RouterModule, CommonModule, DynamicFormComponent, ListErrorsComponent, ArticleListComponent],
  providers: [RosterService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RosterComponent implements OnInit {
  articles: Article[] = []; // Define an array to store user data
  roster: IUserRoster[] = []; // Define an array to store user data
  authors: Author[] = []; // Define an array to store user data

  constructor(private userService: RosterService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Fetch user data from your backend or data source
    this.userService.getRoster().subscribe(
      (articles: IUserRoster[]) => {
        this.updateRoster(articles);
      },
      (error) => {
        // Handle error
        console.error(error);
      },
    );
  }

  updateRoster(roster: IUserRoster[]) {
    this.roster = roster;
    // this.roster = getAuthorsFromArticles(this.articles);
    this.cdr.detectChanges();
  }
}

export interface Author {
  username: string; // The user name
  profileLink: string; // The profile link
  totalArticlesAuthored: number; // The total number of articles authored
  totalLikesReceived: number; // The total number of likes received on their articles
  firstArticleDate: string | null; // The date of their first article (empty if none)
}

function getAuthorsFromArticles(articles: Article[]) {
  // Create an empty map to store author information by their username
  const authorMap = new Map();

  // Iterate through the articles to aggregate author information
  for (const article of articles) {
    const authorUsername = article.author.username;

    // If the author is not already in the map, initialize their information
    if (!authorMap.has(authorUsername)) {
      authorMap.set(authorUsername, {
        username: article.author.username,
        profileLink: article.author.image, // Replace with the actual profile link
        totalArticlesAuthored: 0,
        totalLikesReceived: 0,
        firstArticleDate: null,
      });
    }

    // Increment the totalArticlesAuthored count
    authorMap.get(authorUsername).totalArticlesAuthored++;

    // Add the favoritesCount to totalLikesReceived
    authorMap.get(authorUsername).totalLikesReceived += article.favoritesCount;

    // Update the firstArticleDate if it's null or earlier than the current article's date
    if (
      !authorMap.get(authorUsername).firstArticleDate ||
      article.createdAt < authorMap.get(authorUsername).firstArticleDate
    ) {
      authorMap.get(authorUsername).firstArticleDate = article.createdAt;
    }
  }

  // Convert the map values (author objects) into an array
  const authors = Array.from(authorMap.values());

  return authors;
}
