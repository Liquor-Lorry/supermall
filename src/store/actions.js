import {ADD_COUNTER, ADD_TO_CART} from './mutation-type'

export default {
  addCart(context, payload){
    return new Promise((resolve, reject) => {
      //payload新添加的商品
    //找出之前数组中是否有该商品
    /* let oldProduct = state.cartList.find(item => item.iid === payload.is-invalid) */
    let oldProduct = null
    for(let item of context.state.cartList){
      if(item.iid === payload.iid){
        oldProduct = item
      }
    }

    if(oldProduct){//数量+1
     /*  oldProduct.count += 1 */
     context.commit(ADD_COUNTER, oldProduct)
     resolve('当前商品数量+1')
    }else{//添加新的商品
      payload.count = 1
      /* context.state.cartList.push(payload) */
      context.commit(ADD_TO_CART, payload)
      resolve('添加购物车成功')
    }
    })
  }
}
