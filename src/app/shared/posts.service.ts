import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable, of, tap } from "rxjs";
import { environment } from "src/environments/environment.prod";
import { FbCreateResponse, Post } from "./interfaces";

@Injectable({providedIn: "root"})

export class PostService {

    constructor(private http: HttpClient) {}

    create(post: Post): Observable<Post> {
        return this.http.post<FbCreateResponse>(`${environment.fbDbUrl}/posts.json`, post)
        .pipe(
            map((response: FbCreateResponse) => {
                
                return {
                    ...post, 
                    id: response.name,
                    date: new Date(post.date),
                } 
            })
        );
    }

    getAll(): Observable<Post[]> {
        return this.http.get<Post[]>(`${environment.fbDbUrl}/posts.json`)
            .pipe(
                map((response: {[key: string]: any}) => {
                    var newPosts: Post[] = Object
                    .keys(response) // -NGRSY5xyOLMfLN3ME_v,-NGWRNFmFAJDNar8ICbr (Метод возвращает массив строковых элементов, соответствующих именам перечисляемых свойств)
                    .map( key => ({
                        ...response[key],
                        id: key,
                        date: new Date(response[key].date)
                    }))
                    return newPosts;
                })
            )
    }

    getById(id: string): Observable<Post> {
        return this.http.get<Post>(`${environment.fbDbUrl}/posts/${id}.json`)
        .pipe(
            map((post: Post) => {
                return {
                    ...post, 
                    id, // переопределяем
                    date: new Date(post.date),
                } 
            })
        )
    }

    remove(id: string): Observable<void> {
        return this.http.delete<void>(`${environment.fbDbUrl}/posts/${id}.json`)
    }

    update(post: Post): Observable<Post> {
        return this.http.patch<Post>(`${environment.fbDbUrl}/posts/${post.id}.json`, post);
    }

}

