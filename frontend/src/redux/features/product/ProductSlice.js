import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import productService from './ProductService';
import { toast } from 'react-toastify';

const initialState = {
    product: null,
    products: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
    totalStoreValue: 0,
    outOfStock: 0,
    category: [],
}


// Create New Product
export const createProduct = createAsyncThunk(
    "products/create",
    async (formData, thunkAPI) => {
      try {
        return await productService.createProduct(formData);
      } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(message);
        return thunkAPI.rejectWithValue(message);
      }
    }
  );

  // Get All Products

export const getProducts = createAsyncThunk(
    "products/getAll",
    async (_, thunkAPI) => {
      try {
        return await productService.getProducts();
      } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(message);
        return thunkAPI.rejectWithValue(message);
      }
    }
  );

  // Get All Products from the database (MarketPlace)

export const getAllProducts = createAsyncThunk(
    "products/getAllproducts",
    async (_, thunkAPI) => {
      try {
        return await productService.getAllProducts();
      } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(message);
        return thunkAPI.rejectWithValue(message);
      }
    }
  );

// Delete a Product

export const deleteProducts = createAsyncThunk(
    "products/delete",
    async (id, thunkAPI) => {
      try {
        return await productService.deleteProducts(id);
      } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(message);
        return thunkAPI.rejectWithValue(message);
      }
    }
  );

  // get Single product

export const getProduct = createAsyncThunk(
    "products/getProduct",
    async (id, thunkAPI) => {
      try {
        return await productService.getProduct(id);
      } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(message);
        return thunkAPI.rejectWithValue(message);
      }
    }
  );

    // get Single product for Marketplace without user

export const  getSingleProductAll = createAsyncThunk(
  "products/getSingleProductAll",
  async (id, thunkAPI) => {
    try {
      return await productService.getSingleProductAll(id);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// get Products by Category
export const  getProductByCategory = createAsyncThunk(
  "products/category/getProductByCategory",
  async (category, thunkAPI) => {
    try {
      return await productService.getProdcutsByCategory(category);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateProducts = createAsyncThunk(
    "products/updateProduct",
    async ({id, formData}, thunkAPI) => {
      try {
        return await productService.updateProducts(id,formData);
      } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(message);
        return thunkAPI.rejectWithValue(message);
      }
    }
  );


const ProductSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        CALC_STORE_VALUE(state, action) {
            const products = action.payload
            const array = []
            products.map((item) => {
              const {price, quantity} = item 
              const productValue = price * quantity 
              return array.push(productValue)
            })
            const totalValue = array.reduce((a,b) => {
              return a + b
            },0)
            state.totalStoreValue = totalValue;
        },
        CALC_OUTOFSTOCK(state, action){
          const products = action.payload
          const array = []
          products.map((item) => {
            const {quantity} = item 
            return array.push(quantity)
          })
          let count = 0
          array.forEach((number) => {
            if(number === 0 || number === "0"){
              count += 1;
            }
          })
          state.outOfStock = count
        },
        CALC_CATEGORY(state , action ){
          const products = action.payload
          const array = []
          products.map((item) => {
            const { category } = item 
            return array.push(category)
          })
          const uniqueCategory =  [...new Set(array)]
          state.category = uniqueCategory

        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createProduct.pending, (state) => {
                state.isLoading = true
            })
            .addCase(createProduct.fulfilled, (state,action) => {
                state.isLoading = false
                state.isSuccess = true
                state.isError = false
                state.products.push(action.payload)
                toast.success("Product added Succesfully")
            })
            .addCase(createProduct.rejected, (state,action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                toast.error(action.payload)
            })
            .addCase(getProducts.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getProducts.fulfilled, (state,action) => {
                state.isLoading = false
                state.isSuccess = true
                state.isError = false
                state.products = action.payload
              
            })
            .addCase(getProducts.rejected, (state,action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                toast.error(action.payload)
            })
            .addCase(deleteProducts.pending, (state) => {
                state.isLoading = true
            })
            .addCase(deleteProducts.fulfilled, (state,action) => {
                state.isLoading = false
                state.isSuccess = true
                state.isError = false
                toast.success("Product Deleted Successfully")
               
              
            })
            .addCase(deleteProducts.rejected, (state,action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                toast.error(action.payload)
            })
            .addCase(updateProducts.pending, (state) => {
                state.isLoading = true
            })
            .addCase(updateProducts.fulfilled, (state,action) => {
                state.isLoading = false
                state.isSuccess = true
                state.isError = false
                toast.success("Product Updated Successfully")
               
              
            })
            .addCase(updateProducts.rejected, (state,action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                toast.error(action.payload)
            })
            .addCase(getProduct.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getProduct.fulfilled, (state,action) => {
                state.isLoading = false
                state.isSuccess = true
                state.isError = false
                state.product = action.payload
               
              
            })
            .addCase(getProduct.rejected, (state,action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                toast.error(action.payload)
            })
            .addCase(getAllProducts.fulfilled, (state,action) => {
                state.isLoading = false
                state.isSuccess = true
                state.isError = false
                state.product = action.payload
                
            })
            .addCase(getAllProducts.rejected, (state,action) => {
              state.isLoading = false
              state.isError = true
              state.message = action.payload

          })
    }
});

export const { CALC_STORE_VALUE, CALC_OUTOFSTOCK , CALC_CATEGORY} = ProductSlice.actions
export const selectIsLoading = (state) => state.product.isLoading;
export const selectProduct = (state) => state.product.product;
export const selectTotalStoreValue = (state) => state.product.totalStoreValue;
export const selectOutOfStock = (state) => state.product.outOfStock;
export const selectCategory = (state) => state.product.category;


export default ProductSlice.reducer