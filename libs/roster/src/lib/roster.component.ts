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
