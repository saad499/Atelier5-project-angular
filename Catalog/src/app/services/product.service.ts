// @ts-ignore
import { Injectable } from '@angular/core';
// @ts-ignore
import {observable, Observable, of, throwError} from "rxjs";
import {PageProduct, Product} from "../models/Product.model";
// @ts-ignore
import {UUID} from "angular2-uuid";

// @ts-ignore
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  products:Array<Product>


  constructor() {
    this.products=[
      {id:UUID.UUID(),name:"Computer",price: Math.floor(Math.random() * 90228) + 1,promotion:false},
      {id:UUID.UUID(),name:"Printer",price: Math.floor(Math.random() * 90228) + 1,promotion:true},
      {id:UUID.UUID(),name:"Smart phone",price: Math.floor(Math.random() * 10000) + 1,promotion:false},
    ]
    for (let i = 0; i < 20; i++) {
      this.products.push( {id:UUID.UUID(),name:"Computer",price: Math.floor(Math.random() * 90228) + 1,promotion:Math.random()>0.5?true:false},)
      this.products.push( {id:UUID.UUID(),name:"Printer",price: Math.floor(Math.random() * 90228) + 1,promotion:Math.random()>0.5?true:false},)
      this.products.push( {id:UUID.UUID(),name:"Smart phone",price: Math.floor(Math.random() * 90228) + 1,promotion:Math.random()>0.5?true:false},)

    }

  }
  public getProducts():Observable<Product[]> {
    let rdm=Math.random()
    if(rdm<0.1) return throwError(()=> new Error("Error in getProducts"))
    else return of([...this.products])
  }
  public getPageProducts(page:number,size:number):Observable<PageProduct> {
    let index=page*size
    let totalPages=~~(this.products.length/size);
    if(this.products.length%size !=0)
      totalPages++;
     let pageProducts=this.products.slice(index,index+size);
     return of({page:page,size:size,totalPages:totalPages,products:pageProducts});
  }

  public deleteProduct(id:string):Observable<boolean>{
    this.products=this.products.filter(p=>p.id!=id)
    return of(true)
  }

  public searchProducts(keyword:string,page:number,size:number):Observable<PageProduct>{
    let result = this.products.filter(product=>product.name.toLowerCase().includes(keyword.toLowerCase()));
    let index=page*size
    let totalPages=~~(result.length/size);
    if(result.length%size !=0)
      totalPages++;
    let pageProducts=result.slice(index,index+size);
    return of({page:page,totalPages:totalPages,products:pageProducts,size:size})

  }

  public setPromotion(id:string):Observable<boolean>{
    let product = this.products.find(p=>p.id==id);
    if (product!=undefined){
      product.promotion=!product.promotion
      return of(true)
    }
    else
    return   throwError(()=>new Error("Product not found"))

  }
}
