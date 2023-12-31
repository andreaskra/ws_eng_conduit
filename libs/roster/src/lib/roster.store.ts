import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ComponentStore } from '@ngrx/component-store';
import { concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { LocalStorageJwtService, authActions } from '@realworld/auth/data-access';
import { ngrxFormsQuery } from '@realworld/core/forms';
import { pipe } from 'rxjs';
import { concatMap, map, tap } from 'rxjs/operators';
import { RosterService } from './roster.service';

@Injectable()
export class RosterStoreService extends ComponentStore<Record<string, unknown>> {
  constructor(
    private readonly rosterService: RosterService,
    private readonly localStorageJwtService: LocalStorageJwtService,
    private readonly router: Router,
    private readonly store: Store,
  ) {
    super({});
  }

  // EFFECTS
  readonly updateRoster = this.effect<void>(
    pipe(
      concatLatestFrom(() => [this.store.select(ngrxFormsQuery.selectData)]),
      concatMap(([, data]) =>
        this.rosterService.update(data).pipe(
          tap((result) => this.router.navigate(['profile', result.user.username])),
          tap((result) => this.localStorageJwtService.setItem(result.user.token)),
          map(() => this.store.dispatch(authActions.getUser())),
        ),
      ),
    ),
  );
}
