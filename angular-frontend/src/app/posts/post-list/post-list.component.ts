import { AuthService } from './../../auth/auth.service';
import { PostService } from './../posts.service';
import { Post } from './../post.model';
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  //posts=[
    //{title: 'First Post', content: 'First post\'s content'},
    //{title: 'Second Post', content: 'Second post\'s content'},
    //{title: 'Third Post', content: 'Third post\'s content'}
 //];
  posts: Post[]=[];
  private postSub: Subscription;
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage=1;
  pageSizeOptions = [1, 2, 5, 10];
  authenticated = false;
  userId:string;
  private authStatusSub: Subscription;

 constructor(public postService: PostService, private authService: AuthService) {}

onChangedPage(pageData : PageEvent) {
  this.isLoading = true;
  this.currentPage = pageData.pageIndex + 1;
  this.postsPerPage = pageData.pageSize;
  this.postService.getPosts(this.postsPerPage, this.currentPage);
}

 ngOnInit() {
   this.isLoading = true;
   this.postService.getPosts(this.postsPerPage, this.currentPage);
   this.userId=this.authService.getUserId();
   this.postSub = this.postService.getPostsUpdatedListener().subscribe((postData: {posts: Post[], postCount: number}) => {
     this.isLoading = false;
     this.totalPosts = postData.postCount;
     this.posts=postData.posts;
    });
    this.authenticated=this.authService.getAuthStatus();
    this.authStatusSub=this.authService.getAuthStatusListener().subscribe(isAuthenticated=>{
      this.authenticated=isAuthenticated;
      this.userId=this.authService.getUserId();
    });
 }

 onDelete(postId: string) {
   this.isLoading=true;
  this.postService.deletePost(postId).subscribe(() => {
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  });
 }

 ngOnDestroy() {
   this.postSub.unsubscribe();
 }
}
