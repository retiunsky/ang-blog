import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { Post } from '../shared/interfaces';
import { PostService } from '../shared/posts.service';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss']
})
export class PostPageComponent implements OnInit {

  post$?: Observable<Post>;

  constructor(
    private postService: PostService,
    private aRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.post$ = 
      this.aRoute.params.pipe(
        switchMap((params: Params) => {
          return this.postService.getById(params['id'])
        })
      )
  }

}
