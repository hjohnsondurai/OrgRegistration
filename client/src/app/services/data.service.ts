import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  obj = {
    saveData:(key, data)=>{
      let exData = this.obj.getData(key);
      exData.push(data);
      if(window.localStorage){
        localStorage.setItem(key, JSON.stringify(exData));
      }
    },
    getData: (key)=>{
      if(window.localStorage){
        return JSON.parse(localStorage.getItem(key)) || [];
      } else {
        return [];
      }
    }
  }

  constructor() { }
}
