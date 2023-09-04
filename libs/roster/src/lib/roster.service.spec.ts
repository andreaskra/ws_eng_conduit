import { TestBed, inject } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiService } from '@realworld/core/http-client';
import { RosterService } from './roster.service';

describe('RosterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RosterService, MockProvider(ApiService)],
    });
  });

  it('should be created', inject([RosterService], (service: RosterService) => {
    expect(service).toBeTruthy();
  }));
});
