import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { Post } from 'src/app/shared/interfaces';
import { PostService } from 'src/app/shared/posts.service';
import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {

  constructor(
    private postsService: PostService,
    private alertService: AlertService
    ) { }

  protected posts: Post[] = [];
  private pSub?: Subscription;
  private delSub?: Subscription;
  protected searchStr: string = '';

  ngOnInit(): void {
    this.pSub = this.postsService.getAll().subscribe(posts => {
      this.posts = posts;
    })
  }

  ngOnDestroy(): void {
    if (this.pSub) {
      this.pSub?.unsubscribe();
    }

    if (this.delSub) {
      this.delSub?.unsubscribe();
    }
  }

  remove(id?: string): void {
    if (id) {
      this.delSub = this.postsService.remove(id).subscribe(() => {
        this.posts = this.posts.filter(post => post.id !== id)
        this.alertService.warning('Пост удалён.');
      })
    }
  }

}
