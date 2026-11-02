import {createContext,useContext,useEffect,useMemo,useState,type ReactNode} from 'react';
import type {CartItem} from '../types';
interface Store {cart:CartItem[];favorites:string[];addToCart:(id:string)=>void;removeFromCart:(id:string)=>void;setQuantity:(id:string,n:number)=>void;toggleFavorite:(id:string)=>void;cartCount:number;cartTotal:number}
const Ctx=createContext<Store|null>(null);
export function StoreProvider({children}:{children:ReactNode}){
 const [cart,setCart]=useState<CartItem[]>(()=>JSON.parse(localStorage.getItem('ix-cart')||'[]'));
 const [favorites,setFavorites]=useState<string[]>(()=>JSON.parse(localStorage.getItem('ix-favs')||'[]'));
 useEffect(()=>localStorage.setItem('ix-cart',JSON.stringify(cart)),[cart]); useEffect(()=>localStorage.setItem('ix-favs',JSON.stringify(favorites)),[favorites]);
 const addToCart=(id:string)=>setCart(old=>old.some(x=>x.productId===id)?old.map(x=>x.productId===id?{...x,quantity:x.quantity+1}:x):[...old,{productId:id,quantity:1}]);
 const removeFromCart=(id:string)=>setCart(old=>old.filter(x=>x.productId!==id)); const setQuantity=(id:string,n:number)=>setCart(old=>n<1?old.filter(x=>x.productId!==id):old.map(x=>x.productId===id?{...x,quantity:n}:x));
 const toggleFavorite=(id:string)=>setFavorites(old=>old.includes(id)?old.filter(x=>x!==id):[...old,id]);
 const cartCount=cart.reduce((s,x)=>s+x.quantity,0);
 const cartTotal=useMemo(()=>cart.reduce((s,x)=>{const p=products.find(p=>p.id===x.productId);return s+(p?.price||0)*x.quantity},0),[cart]);
 return <Ctx.Provider value={{cart,favorites,addToCart,removeFromCart,setQuantity,toggleFavorite,cartCount,cartTotal}}>{children}</Ctx.Provider>
}
import {products} from '../data/products';
export function useStore(){const v=useContext(Ctx);if(!v)throw new Error('useStore must be used inside StoreProvider');return v}
