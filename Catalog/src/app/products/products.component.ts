// @ts-ignore
import { Component, OnInit } from '@angular/core';
import {ProductService} from "../services/product.service";
import {Product} from "../models/Product.model";
// @ts-ignore
import {FormBuilder, FormGroup} from "@angular/forms";

// @ts-ignore
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  //random number between 1 and 100
  //randomNum = Math.floor(Math.random() * 100) + 1;

  products!:Array<Product>
  currentPage:number=0
  pageSize:number=5
  totalPages:number=0
  errorMessage!:string
  searchFormGroup!: FormGroup;
  currentAction:string="all"
  constructor(private  productService:ProductService,private formBuilder:FormBuilder) {

  }


  ngOnInit(): void {
   this.handleGetPageProducts()
    this.searchFormGroup=this.formBuilder.group({
      keyword:this.formBuilder.control(null)
    })
  }

  handleGetProducts() {
    this.productService.getProducts().
    subscribe({
      next:(products:Array<Product>)=>{
        this.products=products
      },
      error:(err:any)=>{
        this.errorMessage=err

      }
    })
  }

  handleGetPageProducts() {
    this.productService.getPageProducts(this.currentPage,this.pageSize).subscribe({
      next:({data}: { data: any })=>{
        this.products=data.products
        this.totalPages=data.totalPages
      }
    })
  }

   deleteProduct(product:Product) {
    let confirmDelete=confirm("Are you sure you want to delete "+product.name+"?")
    if(confirmDelete==false) return;
    this.productService.deleteProduct(product.id).subscribe({
      next:(result:boolean)=>{
        //this.handleGetProducts()
        let index=this.products.indexOf(product)
        this.products.splice(index,1)
      }
    })
    }

  handleChangePromo(product: Product) {
    let promo=product.promotion
    this.productService.setPromotion(product.id).subscribe(
      {
        next:(data:any)=>{
          product.promotion=!promo
        },
        /*error: {err}: { err: any } =>{
          this.errorMessage=err
        }*/
      }
    )

  }

  handleSearchProduct() {
    this.currentAction="search"
    this.currentPage=0
    let keyword=this.searchFormGroup.get("keyword")?.value
    if(keyword==null || keyword=="")   this.handleGetProducts();
    this.productService.searchProducts(keyword,this.currentPage,this.pageSize).subscribe({
      next:(data:any)=>{
        this.products=data.products
        this.totalPages=data.totalPages
      },
     /* error:err => {
        this.errorMessage=err
      }*/
    })
  }

  goToPage(i: number) {
    this.currentPage=i;
    if(this.currentAction==='all')
        this.handleGetPageProducts()
    else
      this.handleSearchProduct()
  }
}
