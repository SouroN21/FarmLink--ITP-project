import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../redux/features/auth/authSlice"
import ProductReducer from "../redux/features/product/ProductSlice"
import filtertReducer from "../redux/features/product/filterSlice"



export const store =  configureStore({
    reducer:{
        auth: authReducer,
        product: ProductReducer,
        filter: filtertReducer,
    }
})