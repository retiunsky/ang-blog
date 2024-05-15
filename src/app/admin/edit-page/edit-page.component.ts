import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { Post } from 'src/app/shared/interfaces';
import { PostService } from 'src/app/shared/posts.service';
import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit, OnDestroy {

  form?: FormGroup;
  post?: Post;
  submitted: boolean = false;
  updateSub?: Subscription;

  constructor(
    private aRoute: ActivatedRoute,
    private postService: PostService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.aRoute.params.pipe(
      switchMap((params: Params) => {
        return this.postService.getById(params['id'])
      })
    ).subscribe( (post: Post) => {
      this.post = post;
      this.form = new FormGroup({
        title: new FormControl(post.title, Validators.required),
        text: new FormControl(post.text, Validators.required),
      })
    })
  }

  submit() {
    if (this.form)
    {
      if (this.form!.invalid) return;
   
      this.submitted = true;

      this.updateSub = this.postService.update({
        ...this.post!,
        title: this.form.value.title,
        text: this.form.value.text,
        date: new Date()
      }).subscribe(() => {
        this.submitted = false;
        this.alertService.success('Публикация обновлена');
      });
    } else return;
    
  }

  ngOnDestroy(): void {
    if (this.updateSub) {
      this.updateSub.unsubscribe();
    }
  }

}
