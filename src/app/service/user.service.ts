import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from '../interface/user.interface';
import { Response } from '../interface/response.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl: string = 'https://randomuser.me/api/';

  constructor(private http: HttpClient) { }

  // Fetch all the users
  getUsers(size:number = 10): Observable<any>{
    return this.http.get<Response>(`${this.apiUrl}/?results=${size}`).pipe(
      map(this.processResponse)
    );
  }

  // Fetch one user using the user UUID
  getUser(uuid:string): Observable<any>{
    return this.http.get<Response>(`${this.apiUrl}/?uuid=${uuid}`).pipe(
      map(response => this.processResponse(response))
    );
  }

  //We are creating a function to restructure our response object exactly as we want as user Object properties (using the created user interface)
  private processResponse(response: Response): Response {
    return {
      info: { ...response.info },
      results: response.results.map((user: any) => (<User>{
        uuid: user.login.uuid,
        firstName: user.name.first,
        lastName: user.name.last,
        email: user.email,
        username: user.login.username,
        gender: user.gender,
        address: `${user.location.street.number} ${user.location.street.name} ${user.location.city}, ${user.location.country}`,
        dateOfBirth: user.dob.date,
        phone: user.phone,
        imageUrl: user.picture.medium,
        coordinate: { latitude: +user.location.coordinates.latitude, longitude: +user.location.coordinates.longitude }
      }))
    };
  }
}
